# Voice Controlled Discord Bot

This repository is for BardBot - A Discord Bot to automate TTRPG music/ambience.

Utilizing Wit.AI, BardBot will listen to your DM for common phrases such as 'You walk into {description}', or 'roll for initiative' to suggest the best audio for the moment.

Don't like the selection? Easily pick another using the dropdown menu.

![Banner](assets/banner.jpg)

# About

It is a voice controlled Discord Bot, which means you can use both your voice as well as slash commands.

You will need to train Wit.AI at https://wit.ai, in order to understand your language best. Sometimes it may not be fully accurate until trained rigorously.

[Check out the **Show-off and Tutorial Video**](https://github.com/Tomato6966/voice-controlled-discord-bot/blob/main/README.md#explanation-and-show-off-video)

![image](https://user-images.githubusercontent.com/68145571/182658779-1638aed0-10e3-4c23-b95d-1f7e36d8fc82.png)

# System-Requirements

- **Idle Load**: **`17mb Ram`**
- **High Load**: **`25-30mb Ram`**
- **Highest Memory Load** _with HEAPS for 2 Days runtime_: **`97mb Ram`**
- **JS-Engine:** [nodejs v16.10 or later](https://nodejs.org)
- **RUST (cmake):** [latest](https://www.rust-lang.org/tools/install)
- **FFMPEG:** `npm i ffmpeg-static ffmpeg` & `apt-get install -y ffmpeg`

| Recommended-CPU | Recommended-RAM |
| --------------- | --------------- |
| 1 CORE          | 250mb Ram       |

### Example Usage

> ![image](https://user-images.githubusercontent.com/68145571/182658298-f079f132-29ad-4259-8328-d9c1ebfad280.png)

# How to use the Bot? | [Check the Video](https://github.com/Tomato6966/voice-controlled-discord-bot/blob/main/README.md#explanation-and-show-off-video)

0.  _[Join the testing Server](https://discord.gg/TWRJH6ACvR) - Prefix: `v!`_ / [self-host it!](https://github.com/Tomato6966/voice-controlled-discord-bot/blob/main/README.md#self-hosting)
1.  Join a Discord Voice-Channel, _in a Server, where the Bot is in!_
2.  Type in a Text-Channel `/control` or `@Bot control`
    a. _Now it'll only listen and be controlable by YOU_
3.  BardBot will listen to your voice channel for key phrases (in bold) to suggest relevant audio.
    a. **Examples**:
    i. `**You walk into** a hustling and bustling city`
    ii. `**In the distance** you seen the sunrise`
    iii. `**Suddenly** the room fills with an ominous mist`
    iv. `**Roll for initiative**`
    v. `**A new day begins**`
4.  You may use voice commands like so, at a basic level:
    a. **Examples**:
    i. `bot play shape of you`
    ii. `bot play thunder`
    iii. `bot play despacito`
    iv. `bot nightcore` _=Audio-Filter_
    v. `bot skip`
    vi. `bot stop`
5.  Tips to get understood more often!
    a. Make sure to talk in a normal speed and loudness, do not scream or errape
    b. Also Make sure to Reduce background noices, speak clear and fluently to be "recogniced" by the bot pretty well!

# Resources used (modules & credits)

- `node-fetch@2` for api Calls
- `discord.js@latest` as my Discord-Bot-Wrapper
- `@discordjs/voice`, `@discordjs/opus`, `discord-ytdl-core`, `ytdl-core`, `youtube-sr`, `ffmpeg`, `libsodium-wrappers` for the Music System (Its similar to [my light-music-bot](https://github.com/Tomato6966/light-music-bot))
- `ffmpeg`, `prism-media`, `node-crc` for parsing / Piping / Transforming Audio Streams, -Buffers and -Files.
- `dotenv` for allowing to use .env ENVIRONMENT Variables
