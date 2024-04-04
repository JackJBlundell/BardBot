const { ButtonStyle, ButtonBuilder } = require("discord.js");

const donate = new ButtonBuilder()
  .setLabel("Donate to the team")

  .setURL("https://www.paypal.com/donate/?hosted_button_id=34K9LSDMXE4TW")
  .setStyle(ButtonStyle.Link);

const feedback = new ButtonBuilder()
  .setLabel("Got Feedback?")
  .setURL("https://forms.gle/uZ8GQsCFyU83E5uW6")
  .setStyle(ButtonStyle.Link);

const help = new ButtonBuilder()
  .setCustomId("help")
  .setLabel("Learn More")
  .setStyle(ButtonStyle.Primary);

const stop = new ButtonBuilder()
  .setCustomId("stop")
  .setLabel("Stop")
  .setStyle(ButtonStyle.Danger);

const different = new ButtonBuilder()
  .setCustomId("different")
  .setLabel("Change Audio")
  .setStyle(ButtonStyle.Secondary);

const confirm = new ButtonBuilder()
  .setCustomId("confirm")
  .setLabel("▶️ Play")
  .setStyle(ButtonStyle.Success);
module.exports = { help, donate, feedback, stop, different, confirm };
