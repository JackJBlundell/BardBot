const {
  getVoiceConnection,
  VoiceConnectionStatus,
  createAudioResource,
} = require("@discordjs/voice");
const {
  PermissionsBitField,
  SlashCommandBuilder,
  ButtonStyle,
  ButtonBuilder,
  ActionRowBuilder,
} = require("discord.js");
const { joinVoiceChannelUtil } = require("../utils/playerFunctions.js");
const { parseAudioData } = require("../utils/speechHandler.js");
const { settings, Emojis } = require("../constants/settingsData.js");
const { translate } = require("../utils/language.js");
const { donate, feedback, help } = require("../buttons/buttons.js");
const justListened = new Map();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("control")
    .setDescription("Take audio-control of the Bot"),
  execute: async (
    client,
    args,
    user,
    channel,
    voiceChannel,
    message,
    prefix
  ) => {
    try {
      console.log("here!");
      // if not connected, return an error
      if (!voiceChannel)
        return message
          .reply({
            content: translate(message.client, message.guildId, "JOIN_VC"),
          })
          .catch(console.warn);

      // receive the Bot's connection
      const oldConnection = getVoiceConnection(channel.guild.id);
      // if the bot is connected already return error
      if (oldConnection)
        return message
          .reply({
            content: translate(
              message.client,
              message.guildId,
              "ALREADY_CONNECTED",
              oldConnection.joinConfig.channelId
            ),
          })
          .catch(() => null);

      console.log("old connection done!");
      // missing Permission for CONNECT
      if (
        !voiceChannel
          .permissionsFor(message.client.user.id)
          ?.has(PermissionsBitField.Flags.Connect)
      )
        return message
          .reply({
            content: translate(
              message.client,
              message.guildId,
              "MISSING_PERMS",
              "__CONNECT__"
            ),
          })
          .catch(() => null);

      console.log("past voice connection");
      // missing Permission for SPEAK
      if (
        !voiceChannel
          .permissionsFor(message.client.user.id)
          ?.has(PermissionsBitField.Flags.Speak)
      )
        return message
          .reply({
            content: translate(
              message.client,
              message.guildId,
              "MISSING_PERMS",
              "__SPEAK__"
            ),
          })
          .catch(() => null);

      //join in a voice connection
      const voiceConnection = await joinVoiceChannelUtil(
        message.client,
        voiceChannel
      );

      console.log("joined channel");

      if (!voiceConnection)
        return message
          .reply({
            content: translate(
              message.client,
              message.guildId,
              "COULD_NOT_JOIN",
              voiceChannel.id
            ),
          })
          .catch(() => null);

      let id = message.author
        ? message.author.id
        : message.user
        ? message.user.id
        : "";
      message.client.listenAbleUsers.add(id);
      message.client.connectedGuilds.add(message.guildId);

      const row = new ActionRowBuilder().addComponents(help, feedback, donate);

      console.log("Should be replying!!?",message);
      
      let response = await message
        .reply({
          content: translate(
            message.client,
            message.guildId,
            "CONTROLLING",
            message.client.commands
              .filter((c) => !settings.prefixCommands.includes(c.name))
              .map((x) => `\`${x.name}\``)
              .join(",")
          ),
          components: [row],
        })
        .catch((err) => {
          return null;
        });
      //STARTE ZUHÖRER
      voiceConnection.receiver.speaking.on("start", async (userId) => {
        // if it's an invalid User, or the user is not allowed anymore, or still is on cooldown WAIT
        if (
          !message.client.listenAbleUsers.has(userId) ||
          IsOnCooldown(userId, settings.listeningCooldown)
        ) {
          return;
        }
        // use and parse the audio data from the user

        parseAudioData(
          message.client,
          voiceConnection,
          message.user,
          message.channel
        );
      });

      // Keep alive!
      const networkStateChangeHandler = (oldNetworkState, newNetworkState) => {
        const newUdp = Reflect.get(newNetworkState, "udp");
        clearInterval(newUdp?.keepAliveInterval);
      };

      //ERROR LOGGER
      voiceConnection.receiver.speaking.on("disconnect", async (e) => {
        if (e) console.error(e);
        message.client.listenAbleUsers.delete(message.user.id);
      });

      voiceConnection.on("stateChange", (oldState, newState) => {
        const oldNetworking = Reflect.get(oldState, "networking");
        const newNetworking = Reflect.get(newState, "networking");

        oldNetworking?.off("stateChange", networkStateChangeHandler);
        newNetworking?.on("stateChange", networkStateChangeHandler);
      });

      voiceConnection.on(
        VoiceConnectionStatus.Disconnected,
        async (oldState, newState) => {
          try {
            await Promise.race([
              entersState(connection, VoiceConnectionStatus.Signalling, 5_000),
              entersState(connection, VoiceConnectionStatus.Connecting, 5_000),
            ]);
            // Seems to be reconnecting to a new channel - ignore disconnect
          } catch (error) {
            // Seems to be a real disconnect which SHOULDN'T be recovered from
            voiceConnection.destroy();

            if (oldConnection) {
              oldConnection.destroy();
            }
          }
        }
      );
    } catch (e) {
      console.log("Error!");
      console.error(e);
      message
        .reply({
          content:
            `${Emojis.cross.str} Could not connect. **Reason**: \`\`\`${
              e.message || e
            }`.substring(0, 1950) + `\`\`\``,
        })
        .catch(() => {
          console.log("caught!")
        });
    }
  },
};

function IsOnCooldown(userId, time = 5_000) {
  const justListenedTime = justListened.get(userId);

  if (justListenedTime && Date.now() - justListenedTime < time) return true;

  justListened.set(userId, Date.now());

  return false;
}
