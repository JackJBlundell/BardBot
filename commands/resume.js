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
const { sendMessage } = require("../utils/message.helper.js");
module.exports = {
  name: "resume",
  description: "Resumes the current song",
  data: new SlashCommandBuilder()
    .setName("resume")
    .setDescription("Resumes the current song"),
  execute: async (
    client,
    args,
    user,
    channel,
    voiceChannel,
    message,
    prefix
  ) => {
    const oldConnection = getVoiceConnection(channel.guild.id);
    if (!oldConnection)
      return sendMessage(message, undefined, channel, {
        content: translate(client, message.guildId, "NOT_CONNECTED"),
      });

    const queue = client.queues.get(message.guildId); // get the queue
    if (!queue) {
      await sendMessage(message, undefined, channel, {
        content: translate(client, message.guildId, "NOTHING_PLAYING"),
      });
    }
    // if already paused
    if (!queue.paused)
      return sendMessage(message, undefined, channel, {
        content: translate(client, message.guildId, "NOT_PAUSED"),
      });

    queue.paused = false;

    // skip the track
    oldConnection.state.subscription.player.unpause();

    return sendMessage(message, undefined, channel, client, {
      content: translate(client, message.guildId, "RESUMED"),
    });
  },
};
