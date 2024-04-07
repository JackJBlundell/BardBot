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
const Emojis = require("../constants/Emojis.js");
const { sendMessage } = require("../utils/message.helper.js");
module.exports = {
  name: "auto",
  description: "Toggle auto-play mode..",
  data: new SlashCommandBuilder()
    .setName("auto")
    .setDescription("Toggles auto-play mode."),
  execute: async (
    client,
    args,
    user,
    channel,
    voiceChannel,
    message,
    prefix
  ) => {
    if (!voiceChannel)
      return sendMessage(message, undefined, channel, {
        content: translate(message.client, message.guildId, "JOIN_VC"),
      });

    let guildNoteMode = client.autoModes.get(channel.guild.id);
    let activated = guildNoteMode ? !guildNoteMode : true;

    client.autoModes.set(channel.guild.id, activated);

    sendMessage(
      message,
      undefined,
      channel,
      client,
      `${activated ? Emojis.check.str : Emojis.cross.str} Auto-play mode ${
        activated ? "activated" : "de-actived"
      }.`
    );
    return await channel.send(
      `I will now ${
        activated ? "start" : "stop"
      }  automatically playing audio for you.`
    );
  },
};
