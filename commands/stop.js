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
const { msUnix } = require("../utils/botUtils.js");
const { sendMessage } = require("../utils/message.helper.js");
const { settings } = require("../utils/constants/settingsData.js");
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
      return sendMessage(message, undefined, channel, client, {
        content: translate(client, guildId, "NOT_CONNECTED"),
      });

    const queue = client.queues.get(guildId); // get the queue
    if (!queue) {
      return sendMessage(message, undefined, channel, client, {
        content: translate(client, guildId, "NOTHING_PLAYING"),
      });
    }
    // no new songs (and no current)
    queue.tracks = [client.commandResponses.get("stop")];
    // set the queue to stopped
    queue.stopped = true;
    // skip the track
    oldConnection.state.subscription.player.stop();

    let response = await sendMessage(message, undefined, channel, client, {
      embeds: [
        {
          title: `${Emojis.cross.str} Stopped Playing`,
          color: 0xf9da16,
          description: `I have stopped playing music & will remove this message shortly`,
        },
      ],
    });

    setTimeout(async () => {
      response.delete(1000);
    }, settings.leaveEmptyVC);
  },
};
