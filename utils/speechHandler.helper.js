const { soundboard } = require("./constants/settingsData");
const SoundBoard = require("djs-soundboard");
let sound = new SoundBoard();
const { createAudioResource } = require("@discordjs/voice");
const { createReadStream } = require("fs");

// Function to find triggers if any and to call them out.
function getTriggeredWords(array) {
  let triggeredWords = []; // Array to store triggered words
  let initiative = false; // Flag for initiative trigger
  let newDay = false; // Flag for new day trigger

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
  const keywords = [
    {
      word: "roll",
      related: [
        { word: "initiative", rank: 1 },
        { word: "for", rank: 1 },
      ],
    }, // "roll" and its related words
    { word: "new", related: [{ word: "day", rank: 1 }] }, // "new" and its related word
    {
      word: "in",
      related: [
        { word: "distance", rank: 1 },
        { word: "the", rank: 2 },
      ],
    }, // "in" and its related words
    {
      word: "the",
      related: [
        { word: "distance", rank: 1 },
        { word: "in", rank: 2 },
      ],
    }, // "the" and its related words
    { word: "suddenly", related: [] }, // "suddenly" has no related words
    {
      word: "you",
      related: [
        { word: "walk", rank: 1 },
        { word: "run", rank: 1 },
        { word: "into", rank: 2 },
        { word: "through", rank: 2 },
      ],
    }, // "your" and its related words
    // Add more keywords and related words as needed
  ];

  // Iterate over each keyword
  for (const { word, related } of keywords) {
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
function getSoundboardKeywords(array, voiceChannel) {
  for (let i = 0; i < soundboard.combat.length; i++) {
    let effect = soundboard.combat[i];

    if (effect !== null && array.includes(effect.required)) {
      // There is a trigger for soundboard - check for more keywords.
      let triggered = false;

      for (let j = 0; j < effect.keywords.length; j++) {
        if (array.includes(effect[i])) {
          try {
            sound.play(
              voiceChannel,
              createAudioRe(
                createReadStream(
                  join(__dirname, "..", "assets", "music", match.url)
                )
              )
            );
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
  getSoundboardKeywords,
};
