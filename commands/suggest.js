const {
  playSong,
  createQueue,
  createSong,
  queuePos,
  createSuggestion,
  findBestMatch,
} = require("../utils/playerFunctions.js");

const { join } = require("path");
const { default: YouTube } = require("youtube-sr");
const {
  getVoiceConnection,
  createAudioResource,
  createAudioPlayer,
  NoSubscriberBehavior,
} = require("@discordjs/voice");
const { translate } = require("../utils/language.js");
const {
  SlashCommandBuilder,
  ButtonStyle,
  ActionRowBuilder,
  ButtonBuilder,
} = require("discord.js");

const { Emojis, audioList } = require("../constants/settingsData.js");
const { suggest } = require("../utils/speechHandler.helper.js");

module.exports = {
  name: "suggest",
  description: "Play a song",
  aliases: ["place"],
  data: new SlashCommandBuilder()
    .setName("suggest")
    .setDescription("Suggest a song"),
  execute: async (
    client,
    args,
    user,
    channel,
    voiceChannel,
    message,
    prefix
  ) => {
    suggest(client, args, user, channel, voiceChannel, message, prefix);
  },
};
