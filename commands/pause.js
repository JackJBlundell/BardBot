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
module.exports = {
  name: "pause",
  description: "Pauses the current Track",
  data: new SlashCommandBuilder()
    .setName("pause")
    .setDescription("Pause the current Track"),
  execute: async (
    client,
    args,
    user,
    channel,
    voiceChannel,
    message,
    prefix
  ) => {
    const oldConnection = getVoiceConnection(message.guildId);
    if (!oldConnection)
      return channel
        .send({
          content: translate(client, message.guildId, "NOT_CONNECTED"),
        })
        .catch(() => null);

    const queue = client.queues.get(message.guildId); // get the queue
    if (!queue) {
      return channel
        .send({
          content: translate(client, message.guildId, "NOTHING_PLAYING"),
        })
        .catch(() => null);
    }

    // if already paused
    if (queue.paused)
      return channel
        .send({
          content: translate(client, message.guildId, "NOT_RESUMED"),
        })
        .catch(() => null);

    queue.paused = true;

    // skip the track
    oldConnection.state.subscription.player.pause();

    return message
      .reply({
        content: translate(client, message.guildId, "PAUSED"),
      })
      .catch(() => null);
  },
};
