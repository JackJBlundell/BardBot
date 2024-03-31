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
const { settings, Emojis } = require("../utils/constants/settingsData.js");
const { translate } = require("../utils/language.js");
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
      // User's VOice Channel Connection
      const { channel } = message.member.voice;
      // if not connected, return an error
      if (!channel)
        return message
          .reply({
            content: translate(message.client, message.guildId, "JOIN_VC"),
          })
          .catch(console.warn);

      // receive the Bot's connection
      const oldConnection = getVoiceConnection(message.guildId);
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

      // missing Permission for CONNECT
      if (
        !channel
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
      // missing Permission for SPEAK
      if (
        !channel
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
        channel
      );

      // Keep alive!
      const networkStateChangeHandler = (oldNetworkState, newNetworkState) => {
        const newUdp = Reflect.get(newNetworkState, "udp");
        clearInterval(newUdp?.keepAliveInterval);
      };

      voiceConnection.on("stateChange", (oldState, newState) => {
        const oldNetworking = Reflect.get(oldState, "networking");
        const newNetworking = Reflect.get(newState, "networking");

        oldNetworking?.off("stateChange", networkStateChangeHandler);
        newNetworking?.on("stateChange", networkStateChangeHandler);
      });

      voiceConnection.on(
        VoiceConnectionStatus.Disconnected,
        async (oldState, newState) => {
          console.log("Disconnected?");
          try {
            await Promise.race([
              entersState(connection, VoiceConnectionStatus.Signalling, 5_000),
              entersState(connection, VoiceConnectionStatus.Connecting, 5_000),
            ]);
            // Seems to be reconnecting to a new channel - ignore disconnect
          } catch (error) {
            console.log("Destroying!");
            // Seems to be a real disconnect which SHOULDN'T be recovered from
            voiceConnection.destroy();

            if (oldConnection) {
              oldConnection.destroy();
            }
          }
        }
      );
      if (!voiceConnection)
        return message
          .reply({
            content: translate(
              message.client,
              message.guildId,
              "COULD_NOT_JOIN",
              channel.id
            ),
          })
          .catch(() => null);

      message.client.listenAbleUsers.add(message.user.id);

      console.log("Adding this user to listenable users:", message.user);

      //STARTE ZUHÖRER
      voiceConnection.receiver.speaking.on("start", async (userId) => {
        // if it's an invalid User, or the user is not allowed anymore, or still is on cooldown WAIT
        console.log("Speaking.", userId);
        if (
          !message.client.listenAbleUsers.has(userId) ||
          userId !== message.user.id ||
          IsOnCooldown(userId, settings.listeningCooldown)
        ) {
          console.log(
            "Listenable user?",
            message.client.listenAbleUsers.has(userId),

            "Users: ",
            message.client.listenAbleUsers,

            "USer id: ",
            userId
          );
          console.log("mismatch?", userId !== message.client.user.id);
          console.log(
            "cooldown",
            IsOnCooldown(userId, settings.listeningCooldown)
          );
          return;
        }
        // use and parse the audio data from the user

        console.log("parsing audio");
        parseAudioData(
          message.client,
          voiceConnection,
          message.user,
          message.channel
        );
      });

      //ERROR LOGGER
      voiceConnection.receiver.speaking.on("disconnect", async (e) => {
        if (e) console.error(e);
        message.client.listenAbleUsers.delete(message.user.id);
      });

      const help = new ButtonBuilder()
        .setCustomId("donate")
        .setLabel("Learn More")
        .setURL("https://www.paypal.com/donate/?hosted_button_id=34K9LSDMXE4TW")
        .setStyle(ButtonStyle.Secondary);

      const donate = new ButtonBuilder()
        .setCustomId("help")
        .setLabel("Learn More")
        .setStyle(ButtonStyle.Primary);

      const row = new ActionRowBuilder().addComponents(help, donate);

      message
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
        .catch(() => null);

      try {
        const confirmation = await message.awaitMessageComponent({
          time: 60_000,
        });

        let connection = getVoiceConnection(channel.guild.id);

        if (confirmation.customId === "donate") {
        } else if (confirmation.customId === "help") {
          message
            .send({
              content: translate(
                client,
                message.guildId,
                "HELP",
                prefix || process.env.DEFAULTPREFIX
              ),
            })
            .catch(() => null);
        }
      } catch (e) {
        console.log(e);
      }
    } catch (e) {
      console.error(e);
      message
        .reply({
          content:
            `${Emojis.cross.str} Could not connect. **Reason**: \`\`\`${
              e.message || e
            }`.substring(0, 1950) + `\`\`\``,
        })
        .catch(() => null);
    }
  },
};

function IsOnCooldown(userId, time = 5_000) {
  const justListenedTime = justListened.get(userId);

  if (justListenedTime && Date.now() - justListenedTime < time) return true;

  justListened.set(userId, Date.now());

  return false;
}
