const {
  playSong,
  createQueue,
  createSong,
  queuePos,
} = require("../utils/playerFunctions.js");
const { default: YouTube } = require("youtube-sr");
const { getVoiceConnection } = require("@discordjs/voice");
const { translate } = require("../utils/language.js");
const { SlashCommandBuilder } = require("discord.js");
module.exports = {
  name: "volume",
  description: "Changes the Volume",
  data: new SlashCommandBuilder()
    .setName("volume")
    .setDescription("Changes the Volume"),
  execute: async (
    client,
    args,
    user,
    channel,
    voiceChannel,
    message,
    prefix
  ) => {
    let guildId = message.guildId ? message.guildId : channel.guild.id;

    const oldConnection = getVoiceConnection(guildId);
    if (!oldConnection)
      return message
        .edit({
          content: translate(client, guildId, "NOT_CONNECTED"),
        })
        .catch(() => null);

    const queue = client.queues.get(guildId); // get the queue
    if (!queue) {
      return channel
        .send({
          content: translate(client, guildId, "NOTHING_PLAYING"),
        })
        .catch(() => null);
    }
    if (
      !args[0] ||
      isNaN(Number(args[0])) ||
      Number(args[0]) < 0 ||
      Number(args[0]) > 150
    ) {
      return channel
        .send({
          content: translate(client, guildId, "INVALID_VOL"),
        })
        .catch(() => null);
    }
    queue.volume = Number(args[0]);

    // change the volume
    oldConnection.state.subscription.player.state.resource.volume.setVolume(
      queue.volume / 100
    );

    return channel
      .send({
        content: translate(client, guildId, "VOLUME", queue.volume),
      })
      .catch(() => null);
  },
};
