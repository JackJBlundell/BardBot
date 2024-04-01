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
} = require("../utils/playerFunctions.js");
const { parseAudioData } = require("../utils/speechHandler.js");
const { default: YouTube } = require("youtube-sr");
const { translate } = require("../utils/language.js");
const Emojis = require("../utils/constants/Emojis.js");
module.exports = {
  name: "stop",
  description: "Stops the Player and listener!",
  data: new SlashCommandBuilder()
    .setName("stop")
    .setDescription("Stops the player and listening song"),
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
      return channel
        .send({
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
    // no new songs (and no current)
    queue.tracks = [client.commandResponses.get("stop")];
    // set the queue to stopped
    queue.stopped = true;
    // skip the track
    oldConnection.state.subscription.player.stop();

    await channel.send({
      components: [],
      embeds: [
        {
          title: `${Emojis.cross.str} Stopped Playing`,
          color: 0xf9da16,
          description: `I have stopped playing music.`,
        },
      ],
    });
  },
};
