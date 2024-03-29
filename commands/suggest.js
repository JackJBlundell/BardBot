const {
  playSong,
  createQueue,
  createSong,
  queuePos,
  createSuggestion,
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

const { createReadStream } = require("fs");

const { Emojis, audioList } = require("../utils/constants/settingsData.js");

// Function to select best audio match based on words spoken...
function findBestMatch(triggeredWords) {
  let bestMatch = undefined;
  let maxMatches = 0;

  audioList.forEach((audio) => {
    const matches = audio.tags.filter((tag) =>
      triggeredWords.includes(tag)
    ).length;
    if (matches > maxMatches) {
      maxMatches = matches;
      bestMatch = audio;
    }
  });

  return bestMatch;
}

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
    const oldConnection = getVoiceConnection(channel.guild.id);
    if (!oldConnection)
      return channel
        .send({
          content: translate(client, channel.guild.id, "NOT_CONNECTED"),
        })
        .catch(() => null);

    try {
      let match = findBestMatch(args);

      if (match) {
        createSuggestion(channel, user, voiceChannel, client, match, args);
      }
    } catch (e) {
      console.error(e);
      return channel
        .send(
          `❌ Could not play the Song because: \`\`\`${e.message || e}`.substr(
            0,
            1950
          ) + `\`\`\``
        )
        .catch(() => null);
    }
  },
};
