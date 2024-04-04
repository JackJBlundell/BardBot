const { sendMessage } = require("../utils/message.helper");

function showAudioListSelect(
  message,
  response,
  channel,
  voiceChannel,
  user,
  client
) {
  const selectMenu = new StringSelectMenuBuilder()
    .setCustomId("select")
    .setPlaceholder("Select Audio");

  audioList.map((val, index) => {
    selectMenu.addOptions(
      new StringSelectMenuOptionBuilder()
        .setLabel(val.name)
        .setValue(val.id)
        .setDescription(val.actionDesc)
    );
  });

  const row = new ActionRowBuilder().addComponents(selectMenu);

  let new_response = sendMessage(message, response, channel, {
    embeds: [
      {
        title: `${Emojis.think.str} Select Audio`,
        color: 0xf9da16,
        description: ` **I have a few ditties lined up for you down below.**`,
      },
    ],
    components: [row],
  });

  const collector = message
    ? message.createMessageComponentCollector({
        componentType: ComponentType.StringSelect,
        time: 3_600_000,
      })
    : response.createMessageComponentCollector
    ? response.createMessageComponentCollector({
        componentType: ComponentType.StringSelect,
        time: 3_600_000,
      })
    : new_response.createMessageComponentCollector({
        componentType: ComponentType.StringSelect,
        time: 3_600_000,
      });

  collector.on("collect", async (i) => {
    i.deferUpdate();
    const selection = i.values[0];

    createSuggestion(
      channel,
      user,
      voiceChannel,
      client,
      audioList.find((val) => val.id === selection),
      [],
      message && message.edit ? message : response,
      true
    );
  });
}

module.exports = { showAudioListSelect };
