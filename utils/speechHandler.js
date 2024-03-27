// Import Packages
const {
  readFileSync,
  createWriteStream,
  unlinkSync,
  createReadStream,
} = require("fs");
const fs = require("fs");

const { EndBehaviorType } = require("@discordjs/voice");
const prism = require("prism-media");
const fetch = require("node-fetch");

const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfmpegPath(ffmpegPath);
const { pipeline } = require("node:stream");
const { AttachmentBuilder } = require("discord.js");
// util functions and settings
const { msUnix, transformUsername, delay } = require("./botUtils");
const { settings, Emojis } = require("./constants/settingsData");
const { translate } = require("./language");

let witAI_lastcallTS = null;

async function parseAudioData(client, VoiceConnection, user, channel) {
  // create the filename of it
  const filename = `${process.cwd()}/temp/${transformUsername(
    user.username
  )}_${Date.now()}.pcm`;
  // then make a listenable audio stream, with the maximum highWaterMark (longest duration(s))
  const audioStream = VoiceConnection.receiver.subscribe(user.id, {
    end: {
      behavior: EndBehaviorType.AfterSilence,
      duration: 2000,
    },
    highWaterMark: 1 << 16,
  });
  const writeStream = fs.createWriteStream(filename);

  const opusDecoder = new prism.opus.Decoder({
    frameSize: 960,
    channels: 2,
    rate: 48000,
  });

  audioStream.pipe(opusDecoder).pipe(writeStream);

  console.log(`👂 Started recording ${filename}`);
  const msg = await channel
    .send({
      content: translate(
        client,
        channel.guild.id,
        "NOWLISTENING",
        user.tag,
        msUnix(Date.now() + 5_000)
      ),
    })
    .catch(() => null);

  writeStream.on("close", async () => {
    console.log("OUT finished");

    return await handlePCMFile(
      client,
      VoiceConnection,
      user,
      channel,
      msg,
      filename
    );
  });
  // create an ogglogicalbitstream piper
  // const oggStream = new prism.opus.OggLogicalBitstream({
  //   opusHead: new prism.opus.OpusHead({
  //     channelCount: 2,
  //     sampleRate: 44100,
  //   }),
  //   pageSizeControl: {
  //     maxPackets: 10,
  //   },
  // });
  // // and lastly the file write stream
  // const out = createWriteStream(filename);

  // send a status update

  // pipe the audiostream, ogg stream and writestream together, once audiostream is finished
  // pipeline(audioStream, oggStream, out, async (err) => {
  //   if (err)
  //     return console.warn(
  //       `❌ Error recording file ${filename} - ${err.message}`
  //     );

  //   console.log(`✅ Recorded ${filename}`);
  //   // TESTED - here we have a PCM File which when transformed to a .wav file is listen-able

  // });
}

async function handlePCMFile(
  client,
  VoiceConnection,
  user,
  channel,
  msg,
  pcmFileName
) {
  const mp3FileName = pcmFileName.replace(".pcm", ".mp3");

  fs.stat(mp3FileName, function (err, stat) {
    if (err == null) {
      console.log("File exists");
    } else if (err.code === "ENOENT") {
      console.log("File does not exist");
    } else {
      console.log("Some other error: ", err.code);
    }
  });
  // convert the pcm file to an mp3 file

  await convertAudioFiles(pcmFileName, mp3FileName);
  // create a read stream of the wav file
  const mp3FileStream = createReadStream(mp3FileName);

  fs.stat(mp3FileName, function (err, stat) {
    if (err == null) {
      console.log("File exists");
    } else if (err.code === "ENOENT") {
      console.log("File does not exist");
    } else {
      console.log("Some other error: ", err.code);
    }
  });
  // try to do the text-to-speech
  try {
    // anti spam delay loop
    // ensure we do not send more than one request per second
    if (witAI_lastcallTS != null) {
      let now = Date.now();
      let secCounter = 0;
      while (now - witAI_lastcallTS < 1000) {
        await delay(100);
        secCounter++;
        now = Date.now();
        if (secCounter >= 50) return;
      }
    }
    // set current witAI call
    witAI_lastcallTS = Date.now();
    // "audio/raw;encoding=signed-integer;bits=16;rate=48k;endian=little"
    const output = await fetch("https://api.wit.ai/speech", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.WIT_AI_ACCESS_TOKEN}`,
        "Content-Type": "audio/mpeg3",
      },
      body: mp3FileStream,
    })
      .then((res) => speechToText(res))
      .catch(console.error);

    // stop the mp3 file reading stream
    mp3FileStream.destroy();

    // delete the temp files
    try {
      unlinkSync(pcmFileName);
    } catch {}
    try {
      unlinkSync(mp3FileName);
    } catch {}

    if (!output?.length) return;

    const [keyWord, ...params] = output.split(" ");

    console.log(keyWord, params);
    if (
      keyWord &&
      params[0] &&
      settings.validVoiceKeyWords.some(
        (x) => x.toLowerCase() == keyWord.toLowerCase()
      )
    ) {
      return processCommandQuery(
        client,
        params,
        user,
        channel,
        VoiceConnection,
        msg,
        mp3FileName
      );
    }
    if (output === "hey" || output === undefined || !keyWord || !params[0]) {
      return await msg
        .edit({
          content: `${Emojis.cross.str} **I could not understand you!**\n> Try to speak clearer and faster...`,
        })
        .catch(console.warn);
    }
    return await msg
      .edit({
        content: `${Emojis.cross.str} **INVALID-Input:**\n> \`\`\`${output}\`\`\`\n> Try to speak clearer and faster...`,
      })
      .catch(console.warn);
  } catch (e) {
    console.error(e);
  }
}
async function processCommandQuery(
  client,
  params,
  user,
  channel,
  VoiceConnection,
  msg,
  mp3FileName
) {
  const [commandName, ...args] = params;

  await msg
    .edit({
      content: `✅ **Your Command:**\n> \`\`\`${commandName} ${args.join(
        " "
      )}\`\`\``,
    })
    .catch(console.warn);

  const command =
    client.commands.get(commandName?.toLowerCase()) ||
    client.commands.find(
      (c) => !!c.aliases?.includes(commandName?.toLowerCase())
    );
  if (command && command.name !== "control")
    command.execute(
      client,
      args,
      user,
      channel,
      await client.channels.fetch(VoiceConnection.joinConfig.channelId)
    );
  return;
}

// the api now returns Unspecific amount of CHUNKS of JSON DATA
// step one : recieve it as a stream
// step two : return the last chunk
async function speechToText(res) {
  const wholeBody = await res.text();

  console.log(wholeBody);

  const returnData = [];
  for (const thing of wholeBody.split("\n")) {
    if (thing.includes('"text":')) {
      try {
        //'   "text": "...", '
        const parsedData = JSON.parse(`{ ${thing.trim().replace('",', '"')} }`);
        if (parsedData?.text) {
          if (parsedData.text.endsWith("!") || parsedData.text.endsWith("."))
            returnData.push(
              parsedData.text.substring(0, parsedData.text.length - 1)
            );
          else returnData.push(parsedData.text);
        }
      } catch (e) {
        console.warn(e);
      }
    }
  }
  const sorted = returnData.sort((a, b) => {
    if (a.length < b.length) return 1;
    if (a.length > b.length) return -1;
    return 0;
  });

  console.log("SORTED?,", sorted);
  const output = sorted[0]?.split(", ")?.join(" ")?.toLowerCase();
  if (output.startsWith("hey ")) return output.replace("hey ", "");
  return output;
}

async function convertAudioFiles(infile, outfile) {
  return new Promise((resolve, reject) => {
    ffmpeg(infile)
      .inputFormat("s16le") // Set input format to raw PCM
      .inputOptions("-ar 44100") // Set input sample rate to 44100 Hz
      .inputOptions("-ac 2") // Set input channels to stereo
      .on("end", () => {
        console.log(`Converted audio file saved as ${outfile}`);
        resolve(outfile);
      })
      .on("error", (err) => {
        console.error("Error converting audio file:", err);
        reject(err);
      })
      .save(outfile);
  });
}
// async function convertAudioFiles(infile, outfile) {
//   return await new Promise((resolve, reject) => {
//     ffmpeg(infile)
//       .inputOptions(["-f", "s16le", "-ar", "48k", "-ac", "1"])
//       .save(outfile)
//       .on("end", () => {
//         console.log("RESOLVED!", outfile);
//         resolve(outfile);
//       })
//       .on("error", (err) => {
//         console.log("ERROR: ", err);
//         reject(err);
//       });
//   });
// }
module.exports = {
  parseAudioData,
};
