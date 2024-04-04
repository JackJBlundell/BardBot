const { Emojis } = require("../utils/constants/settingsData.js");
const {
  newLiner,
  parseChannelMention,
  parseUserMention,
} = require("../utils/botUtils.js");
module.exports = {
  MISSING_PERMS: `${Emojis.cross.str} You are missing Permissions for this Command`,

  PREFIXINFO: (prefix) =>
    `${Emojis.check.str} **My Prefix here is \`${prefix}\`**`,

  LANGUAGE: (newlangstring) =>
    `${Emojis.check.str} Changed the Language to **${newlangstring}**`,
  TIME_ENDED: `Time ran out`,

  JOIN_VC: `${Emojis.warn.str} **Please join a Channel first**`,
  ALREADY_CONNECTED: (channelId) =>
    `${Emojis.denied.str} **I'm already connected in ${parseChannelMention(
      channelId
    )}**!`,
  MISSING_PERMS: (permString) =>
    `${Emojis.denied.str} **I'm missing the Permission to "${permString}" in your Voice-Channel!**`,

  COULD_NOT_JOIN: (channelId) =>
    `${Emojis.cross.str} **I could not connect to ${parseChannelMention(
      channelId
    )}.**`,
  HELP: (prefix) => {
    return newLiner(
      `❓ **Bard Bot Help** ❓\n\n`,
      `Trala! I am BardBot, your official D&D Discord Companion. I'm designed to enhance immersion through the power of ``__Automatic Suggestions:__\n`,
      `> *I'm always on the lookout for magical triggers!* 🎩✨\n`,
      `> - **"You walk into":** Transport your players to vivid locales with just a phrase! 🌍\n`,
      `> - **"Suddenly":** Stir the senses and invoke surprise with a sudden twist in the tale! ⚡\n`,
      `> - **"In the distance":** Set the scene with distant wonders and mysterious encounters! 🔭\n`,
      `> - **"Roll for initiative":** Gear up for epic battles as the adrenaline starts to flow! 🎲⚔️\n`,
      `> - **"A new day begins":** Greet the dawn with fresh possibilities and new adventures! 🌅📜\n\n`,
      `__Manual Audio Suggestion:__\n`,
      `> *For more control, summon BardBot by tagging it or speaking 'bot' and using the 'play' keyword along with any keywords for the desired audio.* 🎵🔍\n`,
      `> - *Example 1 (Chat Command):* "Hey @BardBot play beach fun"\n`,
      `> - *Example 2 (Voice Command):* "Bot, play boss battle."\n\n`,
      `__Available Slash Commands:__\n`,
      `- **/control:** Initialise BardBot\n`,
      `- **/stop:** Stop any audio playing\n`,
      `- **/language:** Select the language of the bot\n`,
      `- **/ping:** Check ping time\n`,
      `- **/pause:** Pause audio playing\n`,
      `- **/resume:** Resume audio playing\n\n`,
      `- **/auto:** Toggle auto-play mode - Increased immersion!\n\n`,
      `- **/notes:** Toggle notation mode - Transcribe your DM`
    );
  },
  CONTROLLING: (possibleCommands) => {
    return newLiner(
      `Ahoy, adventurers! Welcome to BardBot, your mystical companion for immersive D&D sessions. 🎲✨\n`,
      `__**What I do:**__\n`,
      `Summon the perfect ambience just by uttering magical phrase like:\n`,
      `> __**"You walk into a bustling city"**__`,
      `> __**"Suddenly, darkness surrounds you"**__`,
      `> __**"Roll for initiative"**__`,
      `> __**"A new day begins"**__\n`,
      `I can even take notes, and auto-play songs for maximum immersion.\n`,

      `__**How to Use:**__\n`,
      `You can see the full range of functionality within the __**/help**__ function. 🗣️✨\n`,
      `__**LLM Learning / Feedback:**__\n`,
      `Our LLM is learning, and your input helps it develop it's understanding. We'd love to hear your feedback in our official server: discord.gg /9Rz5BQ9n\n`,
      `__**Tips for the Best Experience:**__\n`,
      `Speak clearly, without pauses, and make sure the air is silent as a tomb. 🤫💬\n`,
      `__**Where the Magic Comes From:**__\n`,
      `All audio enchantments are courtesy of Michael Ghelfi Studios, ensuring a truly immersive experience. We're aware of copyright issues for creators and aim to have a fix for you all soon! 🎵✨\n`,
      `__**Try it now:**__\n`,
      `> Say __**"A new day begins"**__`,
      `> Type __**"@BardBot play spooky dungeon"**__`,
      `> Say __**"bot play beach"**__`,
      `> Learn more with __**/help**__\n`
    );
  },
  PING: (ping) => `🏓 My **API-RESPONSE-TIME** is **${ping}ms**`,
  NOWLISTENING: (usertag, time) =>
    `👂 **Now listening to ${usertag}**\n> *Next input can be taken <t:${time}:R>*`,
  QUEUE_EMPTY: (time) =>
    `${Emojis.empty.str} **Queue got empty**\n> I will leave the Channel <t:${time}:R>`,
  LEFT_VC: `👋 **Left the VoiceChannel**`,
  NOT_CONNECTED: `${Emojis.denied.str} **I'm not connected somewhere!**`,
  NOTHING_PLAYING: `${Emojis.denied.str} **Nothing playing right now**`,
  NOTHING_TO_SKIP: `${Emojis.denied.str} **Nothing to skip**`,
  SKIPPED: `${Emojis.skip.str} **Successfully skipped the Track**`,
  STOPPED: `${Emojis.stop.str} **Successfully stopped playing and cleared the Queue.**`,
  NOT_CONTROLLING: (prefix) =>
    `${Emojis.cross.str} **You are not the one Controlling the Bot via \`${prefix}control\`**`,
  FILTER: (state, filter) =>
    `🎚 **Successfully ${
      state ? "added" : "removed"
    } the \`${filter}\` Filter.**`,

  INVALID_VOL: `${Emojis.cross.str} **Invalid / No Volume Added!**\n> Add a percentage between \`0\` and \`150\`!`,
  VOLUME: (vol) => `${Emojis.check.str} **Changed the Volume to ${vol}%**`,

  RESUMED: `▶️ **Successfully resumed the Track**`,
  NOT_PAUSED: `👎 **Track is not paused**`,
  PAUSED: `⏸️ **Successfully paused the Track**`,
  NOT_RESUMED: `👎 **Track already paused**`,

  CLEAREDQUEUE: `🪣 **Successfully cleared the Queue.**`,
};
