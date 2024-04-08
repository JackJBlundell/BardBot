const {
  getVoiceConnection,
  VoiceConnection,
  createAudioResource,
  createAudioPlayer,
  NoSubscriberBehavior,
} = require("@discordjs/voice");
const { translate } = require("../utils/language.js");
const Emojis = require("../constants/Emojis.js");
const {
  playTrigger,
  createSuggestion,
} = require("../utils/playerFunctions.js");
const { stop, different } = require("../buttons/buttons.js");
const {
  ActionRowBuilder,
  StringSelectMenuOptionBuilder,
  StringSelectMenuBuilder,
  ComponentType,
} = require("discord.js");
const { createReadStream } = require("fs");
const { join } = require("path");
const { createQueue } = require("../playerFunctions.js");
const { settings, audioList } = require("../constants/settingsData.js");
const { deleteMessage } = require("../utils/message.helper.js");
const { error } = require("console");

module.exports = async (client) => {
  client.on("interactionCreate", async (interaction) => {
    let stringSelect = interaction.isStringSelectMenu();
    let button = interaction.isButton();

    console.log("button??");
    // Button only!
    if (!button && !stringSelect) return;

    try {
      // await interaction.deferReply({ ephemeral: true });
    } catch (err) {
      console.log("deferring!");
    }

    const channel = await client.channels
      .fetch(interaction.channelId)
      .catch(() => null);

    let connection = getVoiceConnection(interaction.guildId);

    if (channel && connection) {
      if (button) {
        console.log("is button!");
        if (interaction.customId === "help") {
          const prefix = "v!";
          await channel
            .send({
              content: translate(
                client,
                interaction.guildId,
                "HELP",
                prefix || process.env.DEFAULTPREFIX
              ),
              components: [],
            })
            .catch((err) => {
              console.log(err);
              return null;
            });
        } else if (interaction.customId === "stop") {
          connection.state.subscription.player.stop();

          let response = await replyInteraction(
            interaction,
            {
              components: [],
              embeds: [
                {
                  title: `${Emojis.cross.str} Stopped Playing`,
                  color: 0xf9da16,
                  description: `I have stopped playing music & will remove this message shortly`,
                },
              ],
            },
            channel
          );

          setTimeout(async () => {
            await deleteMessage(interaction, response);
          }, settings.leaveEmptyVC);
        } else if (interaction.customId === "confirm") {
          const suggestion = client.suggestions.get(interaction.guildId);
          let match = suggestion ? suggestion : "";

          console.log("all: ", client.suggestions);
          console.log(suggestion, match);

          console.log("match?");
          const row = new ActionRowBuilder().addComponents(stop, different);

          // Trigger play

          try {
            let queue = client.queues.get(channel.guild.id);

            // Get music file
            let resource = createAudioResource(
              createReadStream(
                join(__dirname, "..", "assets", "music", match.url)
              )
            );

            const player = createAudioPlayer({
              behaviors: {
                noSubscriber: NoSubscriberBehavior.Pause,
              },
            });

            const newQueue = createQueue(
              resource,
              interaction.author,
              channel.id,
              connection
            );
            client.queues.set(interaction.guildId, newQueue);

            player.play(resource);

            connection.subscribe(player);

            console.log("uhhh here it is!");

            let response;
            try {
              try {
                response = await interaction.reply({
                  components: [],
                  embeds: [
                    {
                      title: `${Emojis.music.str} Now Playing`,
                      color: 0xf9da16,
                      description: `**Now Playing:** __${match.name}__`,
                    },
                  ],
                  components: [row],
                });
              } catch (error) {
                response = await interaction.update({
                  components: [],
                  embeds: [
                    {
                      title: `${Emojis.music.str} Now Playing`,
                      color: 0xf9da16,
                      description: `**Now Playing:** __${match.name}__`,
                    },
                  ],
                  components: [row],
                });
              }
            } catch (err) {
              console.log(err);
              response = await interaction.editReply({
                components: [],
                embeds: [
                  {
                    title: `${Emojis.music.str} Now Playing`,
                    color: 0xf9da16,
                    description: `**Now Playing:** __${match.name}__`,
                  },
                ],
                components: [row],
              });
            }

            console.log("uh after?");

            // Auto-stop!
            try {
              console.log("Getting collector");
              const collector =
                interaction.channel.createMessageComponentCollector({
                  time: 3_600_000,
                });

              collector.on("collect", async (i) => {
                i.deferUpdate();

                if (i.customId === "different") {
                  // Checking the custom ID of the interaction
                  console.log("SHOULD BE GOING BRO");
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

                  let new_response = interaction.editReply({
                    embeds: [
                      {
                        title: `${Emojis.think.str} Select Audio`,
                        color: 0xf9da16,
                        description: ` **I have a few ditties lined up for you down below.**`,
                      },
                    ],
                    components: [row], // Putting components inside the components field
                  });

                  collector.stop(); // Stop the collector after processing this interactionconst collector =
                  let new_collector =
                    interaction.channel.createMessageComponentCollector({
                      time: 3_600_000,
                    });

                  new_collector.on("collect", async (i) => {
                    i.deferUpdate();
                    const selection = i.values[0];

                    console.log(selection);
                    createSuggestion(
                      channel,
                      interaction.author,
                      connection,
                      client,
                      audioList.find((val) => val.id === selection),
                      [],
                      interaction,
                      true
                    );
                  });
                }
              });
            } catch (e) {
              console.log("Error in creating select ", e);
              console.log("NOOOOOO");
              return await interaction.editReply({
                content: "collector not received within 1 minute, cancelling",
                components: [],
              });
            }

            return;
          } catch (err) {
            console.log("ERROR IN PLAY THING 1: ", err);
            return;
          }
        } else if (interaction.customId === "different") {
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

          try {
            let new_response = await interaction.reply({
              embeds: [
                {
                  title: `${Emojis.think.str} Select Audio`,
                  color: 0xf9da16,
                  description: ` **I have a few ditties lined up for you down below.**`,
                },
              ],
              components: [row], // Putting components inside the components field
            });
          } catch (err) {
            await interaction.editReply({
              embeds: [
                {
                  title: `${Emojis.think.str} Select Audio`,
                  color: 0xf9da16,
                  description: ` **I have a few ditties lined up for you down below.**`,
                },
              ],
              components: [row], // Putting components inside the components field
            });
          }
          let new_collector =
            await interaction.channel.createMessageComponentCollector({
              time: 3_600_000,
            });

          new_collector.on("collect", async (i) => {
            try {
              await i.deferUpdate();
              const selection = i.values[0];

              console.log(selection);
              createSuggestion(
                channel,
                interaction.author,
                connection,
                client,
                audioList.find((val) => val.id === selection),
                [],
                interaction,
                true,
                true
              );
              return;
            } catch (err) {
              console.log(err);
              return;
            }
          });
        } else if (interaction.customId === "note-stop") {
          console.log("clicked?");
          return await replyInteraction(
            interaction,
            {
              embeds: [
                {
                  title: `${Emojis.notes.str} Notation mode de-activated. `,
                  color: 0xcd0400,
                  description: `Feel free to turn notation mode back on at any time!`,
                },
              ],
            },
            channel
          );
        } else if (interaction.customId === "select") {
          console.log("string select!!");
          try {
            await interaction.reply({
              content: "Please make a selection",
              ephemeral: true,
            });

            console.log("replied?");
            let new_collector =
              await interaction.channel.createMessageComponentCollector({
                time: 3_600_000,
                componentType: ComponentType.StringSelect,
              });

            new_collector.on("collect", async (i) => {
              console.log("collected...");
              try {
                await i.deferUpdate();
                const selection = i.values[0];

                console.log(selection);
                createSuggestion(
                  channel,
                  interaction.author,
                  connection,
                  client,
                  audioList.find((val) => val.id === selection),
                  [],
                  interaction,
                  true,
                  true
                );
                return;
              } catch (err) {
                console.log(err);
                return;
              }
            });
          } catch (err) {
            console.log(err);
          }
        }
      }
    } else {
      return channel
        .send({
          content: translate(client, guildId, "NOT_CONNECTED"),
        })
        .catch(() => null);
    }
  });
};
async function replyInteraction(interaction, content, channel) {
  console.log("Interaction received: ", interaction);
  try {
    // Check if the interaction object is available
    if (!interaction) {
      throw new Error("Interaction object is not provided.");
    }

    // Respond to the component interaction using update() to edit the message on which the component was attached
    try {
      return await interaction.update(content);
      return; // Exit the function if update is successful
    } catch (updateError) {
      console.error("Error updating interaction:", updateError);
    }

    // Try other response methods if update() fails
    try {
      return await interaction.editReply(content);
      return; // Exit the function if editReply is successful
    } catch (editError) {
      console.error("Error editing reply:", editError);
    }

    try {
      return await interaction.reply(content);
      return; // Exit the function if reply is successful
    } catch (replyError) {
      console.error("Error replying to interaction:", replyError);
    }

    try {
      return await interaction.followUp(content);
      return; // Exit the function if followUp is successful
    } catch (followUpError) {
      console.error("Error following up interaction:", followUpError);
    }
  } catch (err) {
    console.error("Error responding to interaction:", err);
  }
}
