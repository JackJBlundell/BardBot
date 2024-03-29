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
      `${Emojis.check.str} **HELP | ABOUT ME!**`,
      `> **My Prefix is: \`${prefix}\`**`,
      `*I'm a voice-controlled-music-bot with high quality and many features!*`,
      `> To get started, simply type \`${prefix}control\` in the Chat`,
      `> It will tell you what to do, but **simply said**:`,
      `> Just say the commands you want to do!`,
      `**PLEASE MIND:** Before each command, you must add a Keyword! Valid ones are:`,
      `> \`bot\` / \`voice\` / \`speech\` / \`client\``
    );
  },
  CONTROLLING: (possibleCommands) => {
    return newLiner(
      `${Emojis.check.str} **You are now controlling the Bot!**`,
      `__How BardBot works:__`,
      `> BardBot works by listening to your Dungeon Master & suggesting audio to set the tone - Supported by a range of voice commands.\n`,
      `__Possible Trigger Words:__`,
      `> "You walk into {description}", "Suddenly {description}", "In the distance {description}"`,
      `**Vocal Trigger Examples**: \`\`\`You walk into a cold and dark basement\nyou walk into a hustling and bustling city\nin the distance you see the sunrise\nin the distance you see great flapping wings and hear a roar \nsuddenly you are surrounded by shadowy figures\nsuddenly the room goes cold\n\`\`\``,
      `__Actual Commands:__`,
      `> ${possibleCommands}\n`,
      `__How to execute a Command?__`,
      `> *Say it, by saying a Keyword and then the Command and Query! (in English)*'n`,
      `**Examples**: \`\`\`bot play shape of you\nbot skip\nbot stop\nbot nightcore\nbot play no diggity\nbot play believer\`\`\``,
      `**Tips to be understood:**`,
      `> -) Don't make pauses`,
      `> -) No background noises`,
      `> -) Speak normally rather fast and Clear`,
      `> -) Make sure that NOBODY Speaks (not even a BOT)`,
      `**Audio By:**:`,
      `> (Audio by) Michael Ghelfi Studios`
      //   `\n> *You can still use me with commands as normal!*`
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
