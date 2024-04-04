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
  name: "notes",
  description: "Toggle note mode..",
  data: new SlashCommandBuilder()
    .setName("notes")
    .setDescription("Toggles notation mode."),
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
      return sendMessage(message, channel, {
        content: translate(message.client, message.guildId, "JOIN_VC"),
      });

    let guildNoteMode = client.noteModes.get(channel.guild.id);
    let activated = guildNoteMode ? !guildNoteMode : true;

    client.noteModes.set(channel.guild.id, activated);

    sendMessage(
      message,
      channel,
      `${activated ? Emojis.check.str : Emojis.cross.str} Notation mode ${
        activated ? "activated" : "de-actived"
      }.`
    );
    return await channel.send(
      `I will now ${
        activated ? "start letting" : "stop letting"
      } you know what I hear as and when I hear it.`
    );
  },
};
