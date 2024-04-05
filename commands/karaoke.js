// const {
//   getVoiceConnection,
//   createAudioPlayer,
//   NoSubscriberBehavior,
// } = require("@discordjs/voice");
// const { PermissionsBitField, SlashCommandBuilder } = require("discord.js");
// const {
//   joinVoiceChannelUtil,
//   playSong,
//   createQueue,
//   createSong,
//   leaveVoiceChannel,
//   getResource,
// } = require("../utils/playerFunctions.js");
// const { parseAudioData } = require("../utils/speechHandler.js");
// const { default: YouTube } = require("youtube-sr");
// const { translate } = require("../utils/language.js");
// module.exports = {
//   name: "karaoke",
//   description: "Toggles a Karaoke effect!",
//   data: new SlashCommandBuilder()
//     .setName("karaoke")
//     .setDescription("Toggles a Karaoke effect!"),
//   execute: async (
//     client,
//     args,
//     user,
//     channel,
//     voiceChannel,
//     message,
//     prefix
//   ) => {
//     const oldConnection = getVoiceConnection(channel.guild.id);
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

//     const filterToChange = "Karaoke";
//     queue.effects[`${filterToChange.toLowerCase()}`] =
//       !queue.effects[`${filterToChange.toLowerCase()}`];

//     // changed a filter
//     queue.filtersChanged = true;
//     const curPos =
//       oldConnection.state.subscription.player.state.resource.playbackDuration;
//     oldConnection.state.subscription.player.stop();
//     oldConnection.state.subscription.player.play(
//       getResource(queue, queue.tracks[0].id, curPos)
//     );

//     return channel
//       .send({
//         content: translate(
//           client,
//           channel.guildId,
//           "FILTER",
//           !!queue.effects[`${filterToChange.toLowerCase()}`],
//           filterToChange
//         ),
//       })
//       .catch(() => null);
//   },
// };
