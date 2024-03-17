const {
  getVoiceConnection,
  createAudioPlayer,
  NoSubscriberBehavior,
} = require("@discordjs/voice");
const { PermissionsBitField, SlashCommandBuilder } = require("discord.js");
const {
  joinVoiceChannelUtil,
  playSong,
  createQueue,
  createSong,
  leaveVoiceChannel,
  getResource,
} = require("../utils/playerFunctions.js");
const { parseAudioData } = require("../utils/speechHandler.js");
const { default: YouTube } = require("youtube-sr");
const { translate } = require("../utils/language.js");
module.exports = {
  name: "bassboost",
  aliases: ["bass"],
  description: "Toggles a Bassboost effect!",
  data: new SlashCommandBuilder()
    .setName("bassboost")
    .setDescription("Toggles a Bassboost effect!"),
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
          content: translate(client, channel.guild.id, "NOT_CONNECTED"),
        })
        .catch(() => null);

    const queue = client.queues.get(channel.guild.id); // get the queue
    if (!queue) {
      return channel
        .send({
          content: translate(client, channel.guild.id, "NOTHING_PLAYING"),
        })
        .catch(() => null);
    }

    // 7 dbs
    const filterToChange = "Bassboost";
    queue.effects[`${filterToChange.toLowerCase()}`] =
      queue.effects[`${filterToChange.toLowerCase()}`] === 0 ? 7 : 0;

    // change the Basslevel
    queue.filtersChanged = true;
    const curPos =
      oldConnection.state.subscription.player.state.resource.playbackDuration;
    oldConnection.state.subscription.player.stop();
    oldConnection.state.subscription.player.play(
      getResource(queue, queue.tracks[0].id, curPos)
    );

    return channel
      .send({
        content: translate(
          client,
          channel.guildId,
          "FILTER",
          queue.effects[`${filterToChange.toLowerCase()}`] !== 0,
          filterToChange
        ),
      })
      .catch(() => null);
  },
};
