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
    if (!queue.paused)
      return channel
        .send({
          content: translate(client, message.guildId, "NOT_PAUSED"),
        })
        .catch(() => null);

    queue.paused = false;

    // skip the track
    oldConnection.state.subscription.player.unpause();

    return channel
      .send({
        content: translate(client, message.guildId, "RESUMED"),
      })
      .catch(() => null);
  },
};
