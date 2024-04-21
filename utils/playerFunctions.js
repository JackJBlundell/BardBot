// Import Packages
const dcYtdl = require("discord-ytdl-core");
const {
  Client,
  VoiceChannel,
  ChannelType,
  User,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
  ComponentType,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} = require("discord.js");

const {
  entersState,
  joinVoiceChannel,
  getVoiceConnection,
  VoiceConnectionStatus,
  createAudioResource,
  createAudioPlayer,
  NoSubscriberBehavior,
  VoiceConnection,
  AudioPlayer,
  AudioResource,
} = require("@discordjs/voice");
const { join } = require("path");

const {
  readFileSync,
  createWriteStream,
  unlinkSync,
  createReadStream,
} = require("fs");

const { Emojis, audioList } = require("../constants/settingsData.js");

// require settingsData
const { Color, settings } = require("../constants/settingsData.js");
const { translate } = require("./language");
const { msUnix, delay } = require("./botUtils");
const { EmbedBuilder } = require("discord.js");
const { stop, different, confirm } = require("../buttons/buttons.js");
const { sendMessage, editMessage } = require("./message.helper.js");

/**
 * An array of valid voice channel types the bot can connect to
 */
const validVCTypes = [ChannelType.GuildVoice, ChannelType.GuildStageVoice];

async function playTrigger(
  message,
  outerResponse,
  channel,
  voiceChannel,
  client,
  user,
  match,
  button
) {
  console.log("match?");
  const row = new ActionRowBuilder().addComponents(stop, different);

  // Trigger play

  try {
    console.log("awaiting message!");
    let response;

    // If not button it must be through text or voice meaning we do not
    // have to follow-up or editReply
    if (!button) {
      try {
        response = message.update({
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
      } catch {
        response = await editMessage(message, outerResponse, channel, client, {
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
    } else {
      // If string select made this happen...
      try {
        response = await message.editReply({
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
      } catch {
        try {
          response = await message.followUp({
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
        } catch (err) {
          try {
            response = await message.edit({
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
          } catch {
            response = await channel.send({
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
        }
      }
    }

    console.log("done?");
    let queue = client.queues.get(channel.guild.id);

    // Get music file
    let resource = createAudioResource(
      createReadStream(join(__dirname, "..", "assets", "music", match.url))
    );

    const player = createAudioPlayer({
      behaviors: {
        noSubscriber: NoSubscriberBehavior.Pause,
      },
    });

    const newQueue = createQueue(resource, user, channel.id, voiceChannel);
    client.queues.set(channel.guild.id, newQueue);

    player.play(resource);

    let connection = getVoiceConnection(channel.guild.id);
    connection.subscribe(player);

    const confirmation2 = await response.awaitMessageComponent({
      time: 3_600_000,
    });
  } catch (err) {
    console.log("ERROR IN PLAY THING: ", err);
  }
}
async function createSuggestion(
  channel,
  user,
  voiceChannel,
  client,
  match,
  words,
  message,
  chooseMode
) {
  console.log("uhh ok... i am in here...");
  if (client.autoModes.get(channel.guild.id) || chooseMode) {
    // Just play it bruh.

    console.log("Playing??", match);
    return playTrigger(
      message,
      undefined,
      channel,
      voiceChannel,
      client,
      user,
      match,
      true
    );
  } else {
    // Suggestion

    const row = new ActionRowBuilder().addComponents(confirm, different);
    console.log("adding to suggesitons...", channel.guild.id);

    let response = await channel.send({
      embeds: [
        {
          title: `${Emojis.music.str} Audio Suggestion`,
          color: 0xf9da16,
          description:
            words.length > 0
              ? ` **I heard: "__${words.join(
                  " "
                )}__**"\n\nSounds like you might need some ${
                  match.name
                }, shall I **${match.actionDesc}**`
              : `Sounds like you might need some ${match.name}, shall I **${match.actionDesc}**`,
        },
      ],
      components: [row],
    });

    // const collectorFilter = (i) => i.user.id === m.user.id;
    // No filter because anybody can change it...

    const confirmation = await response.awaitMessageComponent({
      time: 60_000,
    });

    if (confirmation.customId === "confirm") {
      const row = new ActionRowBuilder().addComponents(stop, different);
      // Trigger play
      try {
        let queue = client.queues.get(channel.guild.id);
        // Get music file
        let resource = createAudioResource(
          createReadStream(join(__dirname, "..", "assets", "music", match.url))
        );
        const player = createAudioPlayer({
          behaviors: {
            noSubscriber: NoSubscriberBehavior.Pause,
          },
        });
        const connection = getVoiceConnection(channel.guild.id);
        const newQueue = createQueue(resource, user, channel.id, connection);
        client.queues.set(channel.guild.id, newQueue);
        player.play(resource);
        connection.subscribe(player);
        let response_new = await response.edit(
          {
            components: [],
            embeds: [
              {
                title: `${Emojis.music.str} Now Playing`,
                color: 0xf9da16,
                description: `**Now Playing:** __${match.name}__`,
              },
            ],
            components: [row],
          },
          channel
        );
        //
        const confirmation = await response_new.awaitMessageComponent({
          time: 60_000,
        });
        if (confirmation.customId === "different") {
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
          let new_response;
          try {
            new_response = await response.edit({
              embeds: [
                {
                  title: `${Emojis.think.str} Select Audio`,
                  color: 0xf9da16,
                  description: ` **I have a few ditties lined up for you down below.**`,
                },
              ],
              components: [row],
            });
          } catch (err) {
            console.log(err);
          }
        } else if (confirmation.customId === "stop") {
          connection.state.subscription.player.stop();
          await response.edit(
            {
              components: [],
              embeds: [
                {
                  title: `${Emojis.cross.str} Stopped Playing`,
                  color: 0xf9da16,
                  description: `I have stopped playing my amazing music.`,
                },
              ],
            },
            channel
          );
        }
        return;
      } catch (err) {
        console.log("ERROR IN PLAY THING: ", err);
      }
    } else if (confirmation.customId === "different") {
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
      let new_response;
      try {
        new_response = await response.edit({
          embeds: [
            {
              title: `${Emojis.think.str} Select Audio`,
              color: 0xf9da16,
              description: ` **I have a few ditties lined up for you down below.**`,
            },
          ],
          components: [row],
        });
      } catch (err) {
        console.log(err);
      }
      const collector = new_response.createMessageComponentCollector({
        componentType: ComponentType.StringSelect,
        time: 3_600_000,
      });

      collector.on("collect", async (i) => {
        const selection = i.values[0];

        console.log(selection);
        let queue = client.queues.get(channel.guild.id);

        match = audioList.find((val) => val.id === selection);

        if (match) {
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
            user,
            channel.id,
            voiceChannel
          );
          client.queues.set(channel.guild.id, newQueue);

          player.play(resource);

          let connection = getVoiceConnection(channel.guild.id);
          connection.subscribe(player);

          const row = new ActionRowBuilder().addComponents(stop);

          new_response = await response.edit({
            components: [],
            embeds: [
              {
                title: `${Emojis.music.str} Now Playing: __${match.name}__`,
                color: 0xf9da16,
                description: `**Note:** You can manually choose or stop audio using @BardBot play commands, see /help.`,
              },
            ],
            components: [],
          });

          const confirmation2 = await new_response.awaitMessageComponent({
            time: 60_000,
          });

          if (confirmation2.customId === "stop") {
            connection.state.subscription.player.stop();
            let new_new_response = response.edit(
              {
                components: [],
                embeds: [
                  {
                    title: `${Emojis.cross.str} Stopped Playing`,
                    color: 0xf9da16,
                    description: `I have stopped playing my amazing music.`,
                  },
                ],
              },
              channel
            );
          }
        }

        // Get music file
      });
    }
  }
}

/**
 * Joins a Voice-Channel
 * @param {Client} client
 * @param {VoiceChannel} channel
 * @returns {Promise<VoiceConnection>} Voiceconnection
 */
const joinVoiceChannelUtil = async (client, channel) => {
  return new Promise(async (res, rej) => {
    if (!validVCTypes.includes(channel.type))
      return rej("Channel is not a Voice / Stage Channel");
    // create a new connection
    const newConnection = joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator,
      selfDeaf: false,
      selfMute: false,
    });
    // set the voicestate as rady
    await entersState(newConnection, VoiceConnectionStatus.Ready, 20e3);
    let resource = createAudioResource(
      createReadStream(join(__dirname, "..", "assets", "ping.mp3"))
    );

    channel.send("*strums a hearty note*");
    const player = createAudioPlayer({
      behaviors: {
        noSubscriber: NoSubscriberBehavior.Pause,
      },
    });

    player.play(resource);
    newConnection.subscribe(player);

    // voiceconnection handlings
    newConnection.on(
      VoiceConnectionStatus.Disconnected,
      async (oldState, newState) => {
        try {
          await Promise.race([
            entersState(newConnection, VoiceConnectionStatus.Signalling, 5_000),
            entersState(newConnection, VoiceConnectionStatus.Connecting, 5_000),
          ]);
          // if no error, then it was a swich
        } catch (error) {
          newConnection.destroy();
        }
      }
    );
    // delete the queue on channel leave
    newConnection.on(VoiceConnectionStatus.Destroyed, () => {
      client.queues.delete(channel.guild.id);
      client.noteModes.delete(channel.guild.id);
      client.autoModes.delete(channel.guild.id);
    });

    // making the client a speaker, if in a stage channel
    if (channel.type === ChannelType.GuildStageVoice)
      await channel.guild.members?.me?.voice?.setSuppressed(true);

    return res(newConnection);
  });
};

/**
 * Format < 100 Numbers
 * @param {number} t
 * @returns
 */
const m2 = (t) => {
  return parseInt(t) < 10 ? `0${t}` : `${t}`;
};

/**
 * Format < 1000 Numbers
 * @param {number} t
 * @returns
 */
const m3 = (t) => {
  return parseInt(t) < 100 ? `0${m2(t)}` : `${t}`;
};

/**
 * Formats a duration from ms to human-readable
 * @param {number} ms
 * @returns Formatted Duration in min:sec
 */
const formatDuration = (ms) => {
  const sec = parseInt((ms / 1000) % 60);
  const min = parseInt((ms / (1000 * 60)) % 60);
  const hrs = parseInt((ms / (1000 * 60 * 60)) % 24);
  if (sec >= 60) sec = 0;
  if (min >= 60) min = 0;
  if (hrs > 1) return `${m2(hrs)}:${m2(min)}:${m2(sec)}`;
  return `${m2(min)}:${m2(sec)}`;
};

/**
 * Format a link
 * @param {string} ID
 * @param {string}  prefix "www"|"music"
 * @returns YoutubeWatch link based on id
 */
const getYTLink = (ID, prefix = "www") => {
  return `https://${prefix}.youtube.com/watch?v=${ID}`;
};

/**
 * Leaves the voice channel of the guild
 * @param {VoiceChannel} channel
 * @returns
 */
const leaveVoiceChannel = async (channel) => {
  return new Promise(async (res, rej) => {
    const oldConnection = getVoiceConnection(channel.guild.id);
    if (oldConnection) {
      if (oldConnection.joinConfig.channelId != channel.id)
        return rej("We aren't in the same channel!");
      try {
        oldConnection.destroy();
        await delay(250);
        return res(true);
      } catch (e) {
        return rej(e);
      }
    } else {
      return rej("I'm not connected somwhere.");
    }
  });
};

/**
 * Creates a Audio Resource Stream, with FFMPEG Filters (if the queue has them)
 * @param {object} queue
 * @param {string} songInfoId
 * @param {?number} seekTime
 * @returns {AudioResource}
 */
const getResource = (queue, songInfoId, seekTime = 0) => {
  let Qargs = "";
  let effects = queue?.effects || {
    bassboost: 4,
    speed: 1,
  };
  if (effects.normalizer) Qargs += `,dynaudnorm=f=200`;
  if (effects.bassboost) Qargs += `,bass=g=${effects.bassboost}`;
  if (effects.speed) Qargs += `,atempo=${effects.speed}`;
  if (effects["3d"]) Qargs += `,apulsator=hz=0.03`;
  if (effects.subboost) Qargs += `,asubboost`;
  if (effects.mcompand) Qargs += `,mcompand`;
  if (effects.haas) Qargs += `,haas`;
  if (effects.gate) Qargs += `,agate`;
  if (effects.karaoke) Qargs += `,stereotools=mlev=0.03`;
  if (effects.flanger) Qargs += `,flanger`;
  if (effects.pulsator) Qargs += `,apulsator=hz=1`;
  if (effects.surrounding) Qargs += `,surround`;
  if (effects.vaporwave) Qargs += `,aresample=48000,asetrate=48000*0.8`;
  if (effects.nightcore) Qargs += `,aresample=48000,asetrate=48000*1.5`;
  if (effects.phaser) Qargs += `,aphaser=in_gain=0.4`;
  if (effects.tremolo) Qargs += `,tremolo`;
  if (effects.vibrato) Qargs += `,vibrato=f=6.5`;
  if (effects.reverse) Qargs += `,areverse`;
  if (effects.treble) Qargs += `,treble=g=5`;
  if (Qargs.startsWith(",")) Qargs = Qargs.substring(1);
  const requestOpts = {
    filter: "audioonly",
    fmt: "mp3",
    highWaterMark: 1 << 62,
    liveBuffer: 1 << 62,
    dlChunkSize: 0,
    seek: Math.floor(seekTime / 1000),
    bitrate: queue?.bitrate || 128,
    quality: "lowestaudio",
    encoderArgs: Qargs ? ["-af", Qargs] : ["-af", "bass=g=6,dynaudnorm=f=200"], // queue.filters
  };
  if (
    process.env.YOUTUBE_LOGIN_COOKIE &&
    process.env.YOUTUBE_LOGIN_COOKIE.length > 10
  ) {
    requestOpts.requestOptions = {
      headers: {
        cookie: process.env.YOUTUBE_LOGIN_COOKIE,
      },
    };
  }
  const resource = createAudioResource(
    dcYtdl(getYTLink(songInfoId), requestOpts),
    {
      inlineVolume: true,
    }
  );
  const volume =
    queue && queue.volume && queue.volume <= 150 && queue.volume >= 1
      ? queue.volume / 100
      : 0.15; // queue.volume / 100;
  resource.volume.setVolume(volume);
  resource.playbackDuration = seekTime;
  return resource;
};

/**
 * Plays a song in a voice channel if possible, else it's adding it
 * @param {Client} client
 * @param {VoiceChannel} channel
 * @param {object} songInfo
 * @returns
 */
const playSong = async (client, channel, songInfo) => {
  return new Promise(async (res, rej) => {
    const oldConnection = getVoiceConnection(channel.guild.id);
    if (oldConnection) {
      if (oldConnection.joinConfig.channelId != channel.id)
        return rej("We aren't in the same channel!");
      try {
        const curQueue = client.queues.get(channel.guild.id);

        const player = createAudioPlayer({
          behaviors: {
            noSubscriber: NoSubscriberBehavior.Stop,
          },
        });

        oldConnection.subscribe(player);

        const resource = getResource(curQueue, songInfo.id);
        // play the resource
        player.play(resource);

        // When the player plays a new song
        player.on("playing", (player) => {
          const queue = client.queues.get(channel.guild.id);
          // if filters changed, don't send something
          if (queue && queue.filtersChanged) {
            queue.filtersChanged = false;
          } else {
            sendQueueUpdate(client, channel.guild.id);
          }
        });
        // When the player goes on idle
        player.on("idle", () => {
          const queue = client.queues.get(channel.guild.id);
          handleQueue(client, player, queue);
        });
        // when an error happens
        player.on("error", (error) => {
          console.error(error);
          const queue = client.queues.get(channel.guild.id);
          handleQueue(client, player, queue);
        });

        return res(songInfo);
      } catch (e) {
        return rej(e);
      }
    } else {
      return rej("I'm not connected somwhere.");
    }
  });
};

/**
 * handles the queue (skipping, stopping, looping)
 * @param {Client} client
 * @param {AudioPlayer} player
 * @param {object} queue
 * @returns {void}
 */
async function handleQueue(client, player, queue) {
  if (queue && !queue.filtersChanged) {
    try {
      player.stop();
      if (queue && queue.tracks && queue.tracks.length > 1) {
        queue.previous = queue.tracks[0];
        if (queue.trackloop && !queue.skipped) {
          if (queue.paused) queue.paused = false;
          if (queue.tracks[0]?.resource)
            player.play(createAudioResource(queue.tracks[0].resource));
          else player.play(getResource(queue, queue.tracks[0].id));
        } else if (queue.queueloop && !queue.skipped) {
          const skipped = queue.tracks.shift();
          queue.tracks.push(skipped);
          if (queue.paused) queue.paused = false;
          if (queue.tracks[0]?.resource)
            player.play(createAudioResource(queue.tracks[0].resource));
          else player.play(getResource(queue, queue.tracks[0].id));
        } else {
          if (queue.skipped) queue.skipped = false;
          if (queue.paused) queue.paused = false;
          queue.tracks.shift();
          if (queue.tracks[0]?.resource)
            player.play(createAudioResource(queue.tracks[0].resource));
          else player.play(getResource(queue, queue.tracks[0].id));
        }
      } else if (queue && queue.tracks && queue.tracks.length <= 1) {
        // removes the nowplaying, if no upcoming and ends it
        queue.previous = queue.tracks[0];
        if (queue.trackloop || (queue.queueloop && !queue.skipped)) {
          if (queue.tracks[0]?.resource)
            player.play(createAudioResource(queue.tracks[0].resource));
          else player.play(getResource(queue, queue.tracks[0].id));
        } else {
          if (queue.skipped) queue.skipped = false;
          if (queue.stopped) {
            // if there is a voice-response resource, play it
            if (queue.tracks[0]?.resource) {
              const track = queue.tracks.shift();
              if (track?.resource)
                return player.play(createAudioResource(track.resource));
            }

            // // get the bot's voice Connection
            // const meChannel = client.guilds.cache.get(queue.guildId)?.members
            //   ?.me?.voice?.channel;
            // if (meChannel) leaveVoiceChannel(meChannel);
            // else {
            //   // else fetch the voicechannel and leave it
            //   const vc = await client.channels
            //     .fetch(queue.voiceChannel)
            //     .catch(() => null);
            //   if (vc) leaveVoiceChannel(vc);
            // }

            // send a status update if possible
            const textChannel = await client.channels
              .fetch(queue.textChannel)
              .catch(() => null);
            if (textChannel)
              textChannel
                .send({
                  content: translate(client, textChannel.guild.id, "STOPPED"),
                })
                .catch(() => null);
            return;
          }
          queue.tracks = [];
          // Queue Empty, do this
          // const textChannel = await client.channels
          //   .fetch(queue.textChannel)
          //   .catch(() => null);
          // if (textChannel) {
          //   textChannel
          //     .send({
          //       content: translate(
          //         client,
          //         textChannel.guildId,
          //         "QUEUE_EMPTY",
          //         msUnix(Date.now() + settings.leaveEmptyVC)
          //       ),
          //     })
          //     .catch(console.warn);
          // }
          setTimeout(async () => {
            const nqueue = client.queues.get(queue.guildId);
            if (!nqueue?.tracks?.length) {
              // get the bot's voice Connection
              const meChannel = client.guilds.cache.get(queue.guildId)?.members
                ?.me?.voice?.channel;
              if (meChannel) leaveVoiceChannel(meChannel);
              else {
                // else fetch the voicechannel and leave it
                const vc = await client.channels
                  .fetch(queue.voiceChannel)
                  .catch(() => null);
                if (vc) leaveVoiceChannel(vc);
              }
            } else console.log(nqueue);
            return;
          }, settings.leaveEmptyVC);
        }
      } else {
        // get the bot's voice Connection
        const meChannel = client.guilds.cache.get(queue.guildId)?.members?.me
          ?.voice?.channel;
        if (meChannel) leaveVoiceChannel(meChannel);
        else {
          // else fetch the voicechannel and leave it
          const vc = await client.channels
            .fetch(queue.voiceChannel)
            .catch(() => null);
          if (vc) leaveVoiceChannel(vc);
        }
        // send a queue textchannel update
        const textChannel = await client.channels
          .fetch(queue.textChannel)
          .catch(() => null);
        if (textChannel)
          textChannel
            .send({
              content: translate(client, textChannel.guildId, "LEFT_VC"),
            })
            .catch(() => null);
        return;
      }
    } catch (e) {
      console.error(e);
    }
  }
  return;
}

/**
 * Sends a Queue Update to the queue channel
 * @param {Client} client
 * @param {string} guildId
 * @returns {void}
 */
const sendQueueUpdate = async (client, guildId) => {
  const queue = client.queues.get(guildId);
  if (!queue || !queue.tracks || queue.tracks.length == 0 || !queue.textChannel)
    return;

  const textChannel = await client.channels
    .fetch(queue.textChannel)
    .catch(() => null);
  if (!textChannel) return;

  const song = queue.tracks[0];
  const embed = new EmbedBuilder()
    .setColor(Color.Main)
    .setURL(getYTLink(song.id))
    .setFields([
      {
        name: `**Duration:**`,
        value: `> \`${song.durationFormatted}\``,
        inline: true,
      },
      {
        name: `**Requester:**`,
        value: `> ${song.requester} \`${song.requester.tag}\``,
        inline: true,
      },
    ]);
  if (song?.thumbnail?.url) embed.setThumbnail(`${song?.thumbnail?.url}`);

  textChannel
    .send({
      embeds: [embed],
    })
    .catch(console.warn);
  return;
};

/**
 * Merge song and requester together
 * @param {*} song
 * @param {User} requester
 * @returns Object of song and requester
 */
const createSong = (song, requester) => {
  return { ...song, requester };
};

/**
 * Formats the song index to a readable string
 * @param {number} length
 * @returns String
 */
const queuePos = (length) => {
  const str = {
    1: "st",
    2: "nd",
    3: "rd",
  };
  return `${length}${str[length % 10] ? str[length % 10] : "th"}`;
};

/**
 * Creates a Queue Object for the voicechannel, textchannel and guildId
 * @param {*} song
 * @param {User} user
 * @param {string} channelId
 * @param {VoiceChannel} voiceChannel
 * @param {number} bitrate
 * @returns a Queue-Object
 */
const createQueue = (song, user, channelId, voiceChannel, bitrate = 128) => {
  return {
    guildId: voiceChannel.guildId,
    voiceChannel,
    textChannel: channelId,
    paused: false,
    skipped: false,
    effects: {
      bassboost: 0,
      subboost: false,
      mcompand: false,
      haas: false,
      gate: false,
      karaoke: false,
      flanger: false,
      pulsator: false,
      surrounding: false,
      "3d": false,
      vaporwave: false,
      nightcore: false,
      phaser: false,
      normalizer: false,
      speed: 1,
      tremolo: false,
      vibrato: false,
      reverse: false,
      treble: false,
    },
    trackloop: false,
    queueloop: false,
    filtersChanged: false,
    volume: 15, // queue volume, between 1 and 100
    tracks: [createSong(song, user)],
    previous: undefined,
    creator: user,
    bitrate: bitrate,
  };
};

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
  validVCTypes,
  joinVoiceChannelUtil,
  m2,
  m3,
  formatDuration,
  getYTLink,
  leaveVoiceChannel,
  getResource,
  playSong,
  sendQueueUpdate,
  createSong,
  queuePos,
  createQueue,
  createSuggestion,
  findBestMatch,
  playTrigger,
};
