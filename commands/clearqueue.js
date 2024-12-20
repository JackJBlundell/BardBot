const { getVoiceConnection } = require("@discordjs/voice");
const { PermissionsBitField, SlashCommandBuilder } = require("discord.js");
const {
  joinVoiceChannelUtil,
  playSong,
  createQueue,
  createSong,
} = require("../utils/playerFunctions.js");
const { parseAudioData } = require("../utils/speechHandler.js");
const { default: YouTube } = require("youtube-sr");
const { translate } = require("../utils/language.js");
// module.exports = {
//   name: "clearqueue",
//   description: "Clears the current queue",
//   data: new SlashCommandBuilder()
//     .setName("clearqueue")
//     .setDescription("Clears the current queue"),
//   execute: async (
//     client,
//     args,
//     user,
//     channel,
//     voiceChannel,
//     message,
//     prefix
//   ) => {
//     const oldConnection = getVoiceConnection(message.guildId);
//     if (!oldConnection)
//       return channel
//         .send({
//           content: translate(client, message.guildId, "NOT_CONNECTED"),
//         })
//         .catch(() => null);

//     const queue = client.queues.get(message.guildId); // get the queue
//     if (!queue) {
//       return channel
//         .send({
//           content: translate(client, message.guildId, "NOTHING_PLAYING"),
//         })
//         .catch(() => null);
//     }
//     // no new songs (and no current)
//     queue.tracks = [queue.tracks[0]];
//     // skip the track

//     return channel
//       .send({
//         content: translate(client, message.guildId, "CLEAREDQUEUE"),
//       })
//       .catch(() => null);
//   },
// };
