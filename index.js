const { createAudioResource } = require("@discordjs/voice");
const { Client } = require("discord.js");
const { readdirSync } = require("fs");
const { clientData } = require("./utils/constants/clientData.js");
require("dotenv").config();
const nacl = require("tweetnacl");

const client = new Client(clientData);

// load modules
readdirSync(`./extenders`)
  .filter((x) => x.endsWith(".js"))
  .forEach((fileName) => require(`./extenders/${fileName}`)(client));
readdirSync(`./events`)
  .filter((x) => x.endsWith(".js"))
  .forEach((fileName) => require(`./events/${fileName}`)(client));
readdirSync(`./commands`)
  .filter((x) => x.endsWith(".js"))
  .forEach((fileName) =>
    client.commands.set(
      fileName.toLowerCase().replace(".js", ""),
      require(`./commands/${fileName}`)
    )
  );
readdirSync(`./commandResponses`)
  .filter((x) => x.endsWith(".mp3"))
  .forEach((fileName) =>
    client.commandResponses.set(fileName.toLowerCase().replace(".mp3", ""), {
      title: "infoActionAudio",
      resource: createAudioResource(`./commandResponses/${fileName}`),
    })
  );
// Log in with the process.env.DISCORD_TOKEN Variable
client.login(process.env.DISCORD_TOKEN);

exports.handler = async (event) => {
  // Checking signature (requirement 1.)
  // Your public key can be found on your application in the Developer Portal
  const PUBLIC_KEY = process.env.PUBLIC_KEY;
  const signature = event.headers["x-signature-ed25519"];
  const timestamp = event.headers["x-signature-timestamp"];
  const strBody = event.body; // should be string, for successful sign

  const isVerified = nacl.sign.detached.verify(
    Buffer.from(timestamp + strBody),
    Buffer.from(signature, "hex"),
    Buffer.from(PUBLIC_KEY, "hex")
  );

  if (!isVerified) {
    return {
      statusCode: 401,
      body: JSON.stringify("invalid request signature"),
    };
  }

  // Replying to ping (requirement 2.)
  const body = JSON.parse(strBody);
  if (body.type == 1) {
    return {
      statusCode: 200,
      body: JSON.stringify({ type: 1 }),
    };
  }
};
