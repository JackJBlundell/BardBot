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
  name: "skip",
  description: "Skips the current song",
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Skips the current song"),
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
    // no new songs (and no current)
    if (!queue.tracks || queue.tracks.length <= 1) {
      return channel
        .send({
          content: translate(client, message.guildId, "NOTHING_TO_SKIP"),
        })
        .catch(() => null);
    }
    queue.skipped = true;

    queue.tracks.splice(1, 0, client.commandResponses.get("skip"));
    // skip the track
    oldConnection.state.subscription.player.stop();

    return message
      .reply({
        content: translate(client, message.guildId, "SKIPPED"),
      })
      .catch(() => null);
  },
};
