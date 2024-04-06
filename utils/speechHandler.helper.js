const { soundboard, triggerKeywords } = require("./constants/settingsData");
const SoundBoard = require("djs-soundboard");
let sound = new SoundBoard();
const { createAudioResource, getVoiceConnection } = require("@discordjs/voice");
const { createReadStream } = require("fs");
const { join } = require("path");
const { translate } = require("./language");
const { findBestMatch, createSuggestion } = require("./playerFunctions");

function isNewDay(words) {
  let newPointer = -1; // Pointer for "new"
  let dayPointer = -1; // Pointer for "day"
  let beginsPointer = -1; // Pointer for "begins"

  for (let i = 0; i < words.length; i++) {
    const word = words[i];

    if (word === "new") {
      newPointer = i;
    } else if (
      word === "day" &&
      newPointer !== -1 &&
      (dayPointer === -1 || i - newPointer <= 3)
    ) {
      dayPointer = i;
    } else if (
      word === "begins" &&
      dayPointer !== -1 &&
      (beginsPointer === -1 || i - dayPointer <= 3)
    ) {
      beginsPointer = i;
    }

    // If all pointers are set and maintain the correct order within the allowed distance, return true
    if (
      newPointer !== -1 &&
      dayPointer !== -1 &&
      beginsPointer !== -1 &&
      beginsPointer - dayPointer <= 3 &&
      dayPointer - newPointer <= 3
    ) {
      return true;
    }
  }

  // If the phrase is not found
  return false;
}

function isRollInitiative(words) {
  return words.includes("roll") && words.includes("initiative");
}

// This needs work!!!
// Function to find triggers if any and to call them out.
function getTriggeredWords(array) {
  let triggeredWords = []; // Array to store triggered words
  let initiative = isRollInitiative(array); // Flag for initiative trigger
  let newDay = isNewDay(array); // Flag for new day trigger

  // Helper function to find all occurrences of a word in the array
  function findAllIndexes(arr, val) {
    let indexes = [];
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === val) {
        indexes.push(i);
      }
    }
    return indexes;
  }

  // Check for trigger words and related words
  for (const { word, related } of triggerKeywords) {
    // Check if the keyword is present in the array
    if (array.includes(word)) {
      // Find all occurrences of the keyword in the array
      const wordIndexes = findAllIndexes(array, word);
      for (const wordIndex of wordIndexes) {
        // If the keyword has no related words, add all words after it to triggeredWords
        if (related.length === 0) {
          triggeredWords = array;
        } else {
          let foundRequiredRelatedWord = false;
          // Iterate over each related word
          for (const relatedWordObj of related) {
            const { word: relatedWord, rank } = relatedWordObj;
            // Check the next 5 words after the occurrence of the keyword
            for (
              let i = wordIndex + 1;
              i <= wordIndex + array.length - wordIndex && i < array.length;
              i++
            ) {
              // If a required related word is found, add it to triggeredWords
              if (array[i] === relatedWord && rank === 1) {
                return {
                  triggeredWords: array,
                  initiative,
                  newDay,
                }; // Exit the function
              }
              // If an optional related word is found and no required related word has been found yet, add it to triggeredWords
              else if (
                array[i] === relatedWord &&
                rank === 2 &&
                !foundRequiredRelatedWord
              ) {
                triggeredWords.push(word);
                triggeredWords.push(relatedWord);
              }
            }
            // If a required related word was found, set foundRequiredRelatedWord to true
            if (rank === 1 && array.includes(relatedWord, wordIndex + 1)) {
              foundRequiredRelatedWord = true;
            }
          }
        }
      }
    }
  }

  // Return the triggered words and flags
  return { triggeredWords, initiative, newDay };
}

// Function to get a variety of soundboard keywords such as 'Arrow flies' or 'dragon breathes'...
function triggerSoundboard(array, voiceChannel) {
  console.log(array);
  for (let i = 0; i < soundboard.combat.length; i++) {
    let effect = soundboard.combat[i];

    if (effect !== null && array.includes(effect.required)) {
      console.log("Got required...");
      // There is a trigger for soundboard - check for more keywords.
      let triggered = false;

      for (let j = 0; j < effect.keywords.length; j++) {
        console.log("keyword: ", effect.keywords[j]);
        if (array.includes(effect.keywords[j])) {
          try {
            console.log("Ok playing!");
            // sound.play(voiceChannel, "senpai");
          } catch (err) {
            console.log(err);
          }

          triggered = true;
        }
      }
    } else if (effect === null) {
      // There is no effect
    }
  }
}

// Function to get 'bot play' or 'bot stop' etc. words...
function getBotTriggeredWords(array) {
  let triggeredWords = [];
  let foundTrigger = false;

  // Iterate through the array of strings
  for (let i = 0; i < array.length; i++) {
    // Keywords to trigger the audio.
    let isBot = array[i].toLowerCase() === "bot";

    if (isBot) {
      foundTrigger = true;
      triggeredWords = [];
      continue;
    }

    // If trigger words have been found and current word is not a stop word ("as"), add it to the list
    if (foundTrigger) {
      triggeredWords.push(array[i]);
    }
  }

  return triggeredWords;
}

module.exports = {
  getBotTriggeredWords,
  getTriggeredWords,
  triggerSoundboard,
  suggest,
};

async function suggest(
  client,
  args,
  user,
  channel,
  voiceChannel,
  message,
  prefix
) {
  const oldConnection = getVoiceConnection(channel.guild.id);
  if (!oldConnection)
    return channel
      .send({
        content: translate(client, channel.guild.id, "NOT_CONNECTED"),
      })
      .catch(() => null);

  try {
    let match = findBestMatch(args);

    console.log("Match? ", match, args);
    if (match) {
      createSuggestion(
        channel,
        user,
        voiceChannel,
        client,
        match,
        args,
        message
      );
      return;
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
}
