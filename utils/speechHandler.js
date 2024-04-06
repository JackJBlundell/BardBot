// Import Packages
const {
  readFileSync,
  createWriteStream,
  unlinkSync,
  createReadStream,
} = require("fs");
const fs = require("fs");
const { join } = require("path");

const {
  EndBehaviorType,
  createAudioResource,
  createAudioPlayer,
  NoSubscriberBehavior,
  getVoiceConnection,
} = require("@discordjs/voice");
const prism = require("prism-media");
const fetch = require("node-fetch");

const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfmpegPath(ffmpegPath);
const { pipeline } = require("node:stream");
const {
  AttachmentBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} = require("discord.js");
// util functions and settings
const { msUnix, transformUsername, delay } = require("./botUtils");
const {
  settings,
  Emojis,
  tags,
  audioList,
} = require("./constants/settingsData");
const { translate } = require("./language");
const OpenAI = require("openai");
const { createQueue, createSuggestion } = require("./playerFunctions");
const {
  getBotTriggeredWords,
  getTriggeredWords,
  getSoundboardKeywords,
  triggerSoundboard,
  suggest,
} = require("./speechHandler.helper");

let witAI_lastcallTS = null;

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_TOKEN,
});

async function parseAudioData(client, VoiceConnection, user, channel) {
  try {
    // create the filename of it
    const filename = `${process.cwd()}/temp/${transformUsername(
      user.username
    )}_${Date.now()}.pcm`;
    // then make a listenable audio stream, with the maximum highWaterMark (longest duration(s))
    const audioStream = VoiceConnection.receiver.subscribe(user.id, {
      end: {
        behavior: EndBehaviorType.AfterSilence,
        duration: 700,
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

    // const msg = await channel
    //   .send({
    //     content: translate(
    //       client,
    //       channel.guild.id,
    //       "NOWLISTENING",
    //       user.tag,
    //       msUnix(Date.now() + settings.listeningCooldown)
    //     ),
    //   })
    //   .catch(() => null);

    writeStream.on("close", async () => {
      // console.log("OUT finished");

      return await handlePCMFile(
        client,
        VoiceConnection,
        user,
        channel,
        filename
      );
    });
  } catch (err) {
    console.log("Error in parsing...");
  }
}

async function handlePCMFile(
  client,
  VoiceConnection,
  user,
  channel,
  pcmFileName
) {
  try {
    const mp3FileName = pcmFileName.replace(".pcm", ".mp3");

    // convert the pcm file to an mp3 file
    await convertAudioFiles(pcmFileName, mp3FileName);
    // create a read stream of the wav file
    const mp3FileStream = createReadStream(mp3FileName);

    // try to do the text-to-speech
    try {
      // anti spam delay loop
      // ensure we do not send more than one request per second
      if (witAI_lastcallTS != null) {
        let now = Date.now();
        let secCounter = 0;
        while (now - witAI_lastcallTS < 1000) {
          console.log("delaying push...");
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
        .then((res) => {
          console.log(res);
          console.log("Back from Wit.AI!");
          return speechToText(res);
        })
        .catch(console.error);

      console.log("ok we got: ", output);

      // stop the mp3 file reading stream
      mp3FileStream.destroy();

      // delete the temp files

      try {
        fs.readdir("temp", (err, files) => {
          if (err) throw err;
          for (const file of files) {
            if (file.includes(user.username)) {
              fs.unlink(join("temp", file), (err) => {
                if (err) throw err;
              });
            }
          }
        });
      } catch (err) {
        console.log(err);
      }

      if (!output?.length) {
        console.log("no length");
        return;
      }

      // Get words after bot
      let voice_command = getBotTriggeredWords(output.split(" "));

      let { triggeredWords, initiative, newDay } = getTriggeredWords(
        output.split(" ")
      );

      let voiceChannel = await client.channels.fetch(
        VoiceConnection.joinConfig.channelId
      );

      // sound board trigger if any
      // getSoundboardKeywords(output.split(" "), voiceChannel);

      let guildNoteMode = client.noteModes.get(channel.guild.id);

      // If notation mode
      if (guildNoteMode) {
        const stop = new ButtonBuilder()
          .setCustomId("stop")
          .setLabel("Turn Off")
          .setStyle(ButtonStyle.Danger);

        const row = new ActionRowBuilder().addComponents(stop);

        let response = await channel.send({
          embeds: [
            {
              title: `${Emojis.notes.str} "${output}"`,
              color: 0xfff,
              description: `\nBe sure to speak **loud**, **clear**, and **do not pause** when speaking. `,
            },
          ],
          flags: [4096],
        });

        try {
          const confirmation = await response.awaitMessageComponent({
            time: 60_000,
          });

          if (confirmation.customId === "stop") {
            console.log("clicked?");
            await response
              .edit({
                embeds: [
                  {
                    title: `${Emojis.notes.str} Notation mode de-activated. `,
                    color: 0xcd0400,
                    description: `Feel free to turn notation mode back on at any time!`,
                  },
                ],
              })
              .catch((err) => {
                console.log(err);
                return null;
              });
          }
        } catch (e) {
          console.log("Error::::", e);
        }
      }

      triggerSoundboard(output.split(" "), voiceChannel);

      if (!initiative && voice_command.length > 0) {
        // 'Bot' command called for simply running a command.
        return processCommandQuery(
          client,
          voice_command,
          user,
          channel,
          VoiceConnection,
          mp3FileName
        );
      } else if (initiative) {
        createSuggestion(
          channel,
          user,
          voiceChannel,
          client,
          audioList.find((val) => val.id === "boss"),
          triggeredWords,
          undefined
        );
      } else if (newDay) {
        createSuggestion(
          channel,
          user,
          voiceChannel,
          client,
          audioList.find((val) => val.id === "adventuring"),
          triggeredWords,
          undefined
        );
      } else if (triggeredWords.length > 0) {
        suggest(
          client,
          triggeredWords,
          user,
          channel,
          voiceChannel,
          undefined,
          {}
        );

        return;
      }
      //  Insert message for bad audio if you wanna
    } catch (e) {
      console.error(e);
    }
  } catch (err) {
    console.log("error in PCM file");
  }
}
async function processCommandQuery(
  client,
  params,
  user,
  channel,
  VoiceConnection,
  mp3FileName
) {
  const [commandName, ...args] = params;

  const command =
    client.commands.get(commandName?.toLowerCase()) ||
    client.commands.find(
      (c) => !!c.aliases?.includes(commandName?.toLowerCase())
    );
  if (command && command.name !== "control") {
    command.execute(
      client,
      args,
      user,
      channel,
      await client.channels.fetch(VoiceConnection.joinConfig.channelId),
      {}
    );
  }
  return;
}

// the api now returns Unspecific amount of CHUNKS of JSON DATA
// step one : recieve it as a stream
// step two : return the last chunk
async function speechToText(res) {
  const wholeBody = await res.text();

  const returnData = [];
  for (const thing of wholeBody.split("\n")) {
    if (thing.includes('"text":')) {
      console.log("Going into text?", thing);
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

  console.log(returnData);
  const sorted = returnData.sort((a, b) => {
    if (a.length < b.length) return 1;
    if (a.length > b.length) return -1;
    return 0;
  });

  console.log(sorted);
  const output = sorted[0]?.split(", ")?.join(" ")?.toLowerCase();
  if (output && output.startsWith("hey ")) return output.replace("hey ", "");
  console.log("Returning ", output);
  return output;
}

async function convertAudioFiles(infile, outfile) {
  return new Promise((resolve, reject) => {
    ffmpeg(infile)
      .inputFormat("s16le") // Set input format to raw PCM
      .inputOptions("-ar 44100") // Set input sample rate to 44100 Hz
      .inputOptions("-ac 2") // Set input channels to stereo
      .on("end", () => {
        resolve(outfile);
      })
      .on("error", (err) => {
        console.error("Error converting audio file:", err);
        reject(err);
      })
      .save(outfile);
  });
}

module.exports = {
  parseAudioData,
};
