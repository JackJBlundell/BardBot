const Color = require("./Color.js");
const Status = require("./Status.js");
const Emojis = require("./Emojis.js");

const expandedTags = {
  cityNoises: [
    "urban",
    "city",
    "town",
    "street",
    "crowd",
    "traffic",
    "market",
    "hustle",
    "bustle",
  ],
  tavernAmbiance: [
    "pub",
    "bar",
    "inn",
    "tavern",
    "cheers",
    "drinks",
    "mugs",
    "fireplace",
    "rustic",
    "dive",
  ],
  prisonDungeonNoises: [
    "prison",
    "dungeon",
    "cell",
    "scary",
    "chains",
    "echoes",
    "grunts",
    "screams",
    "dark",
    "moody",
  ],
  bossBattleMusic: [
    "battle",
    "fight",
    "combat",
    "boss",
    "adrenaline",
    "intense",
    "epic",
    "showdown",
    "danger",
    "evil",
  ],
  coldSadMusic: [
    "sad",
    "lonely",
    "melancholy",
    "desolate",
    "gloomy",
    "tears",
    "heartbreak",
  ],
  warmHappyMusic: [
    "warm",
    "happy",
    "joyful",
    "uplifting",
    "celebration",
    "cheerful",
    "sunny",
    "sun",
    "sunrise",
    "fun",
    "rise",
    "fills",
    "bright",
  ],
  adventuringTravellingMusic: [
    "adventure",
    "journey",
    "travel",
    "explore",
    "discovery",
    "road",
    "fun",
    "wagon",
    "freedom",
  ],
  ominousMusicMysterious: [
    "ominous",
    "mysterious",
    "eerie",
    "suspenseful",
    "darkness",
    "fills",
    "dark",
    "clouds",
    "uncanny",
    "haunting",
    "mystical",
  ],
  magicalWhimsical: [
    "magical",
    "whimsical",
    "enchanting",
    "fantasy",
    "fairy",
    "spellbinding",
    "mystical",
    "peaceful",
    "peace",
  ],
  forestAmbiance: [
    "forest",
    "woods",
    "trees",
    "birds",
    "nature",
    "serene",
    "rustling",
    "calm",
    "tranquil",
  ],
  mountainAmbiance: [
    "mountain",
    "peaks",
    "summit",
    "cliffs",
    "wind",
    "scenic",
    "mountainous",
  ],
  beachAmbiance: [
    "beach",
    "shore",
    "waves",
    "seagulls",
    "breeze",
    "relaxing",
    "seashore",
    "sea",
    "sand",
    "ocean",
  ],
  caveAmbiance: [
    "cave",
    "cavern",
    "echoes",
    "stalactites",
    "darkness",
    "spooky",
    "scary",
    "ominous",
    "mysterious",
    "dark",
    "rocks",
    "rocky",
  ],
  castleAmbiance: [
    "castle",
    "fortress",
    "palace",
    "halls",
    "regal",
    "grandeur",
    "noble",
    "trumpets",
    "royal",
  ],
  villageAmbiance: [
    "village",
    "hamlet",
    "town",
    "market",
    "laughter",
    "livestock",
    "chatter",
    "community",
  ],
  underwaterAmbiance: [
    "underwater",
    "ocean",
    "sea",
    "bubbles",
    "depths",
    "whales",
    "calm",
    "fish",
    "submerged",
  ],
  desertAmbiance: [
    "desert",
    "dunes",
    "oasis",
    "sand",
    "heat",
    "mirage",
    "camels",
    "nomadic",
  ],
  hauntedHouseAmbiance: [
    "haunted",
    "house",
    "creepy",
    "ghostly",
    "moans",
    "shadows",
    "candles",
    "chills",
  ],
  spaceAmbiance: [
    "space",
    "cosmic",
    "stars",
    "silence",
    "vacuum",
    "futuristic",
    "astral",
    "universe",
  ],
  winterWonderlandAmbiance: [
    "winter",
    "snow",
    "ice",
    "frost",
    "aurora",
    "cozy",
    "festive",
    "whimsical",
    "windy",
    "icy",
    "frozen",
    "cold",
    "tundra",
    "snowing",
    "snowfall",
  ],
};

let tags = [];

// Loop through each property of expandedTags
for (let key in expandedTags) {
  // Concatenate the tag array of each property to the tags array
  tags = tags.concat(expandedTags[key]);
}

// Remove duplicate tags if any
tags = Array.from(new Set(tags));

const audioList = [
  {
    id: "adventuring",
    name: "Adventuring/Travelling Music",
    tags: expandedTags.adventuringTravellingMusic,
    url: "https://firebasestorage.googleapis.com/v0/b/bardbot-416320.appspot.com/o/music%2Fadventure.mp3?alt=media&token=e34b2876-7d8e-4530-8568-a4e0f3fa4202",
    actionDesc: "embark on a journey?",
  },
  {
    id: "beach",
    name: "Beach Ambiance",
    tags: expandedTags.beachAmbiance,
    url: "https://firebasestorage.googleapis.com/v0/b/bardbot-416320.appspot.com/o/music%2Fbeach.mp3?alt=media&token=4191f419-9e06-4ff5-805c-250ce1beb6dc",
    actionDesc: "hit the sandy shores?",
  },
  {
    id: "boss",
    name: "Boss Battle Music",
    tags: expandedTags.bossBattleMusic,
    url: "https://firebasestorage.googleapis.com/v0/b/bardbot-416320.appspot.com/o/music%2Fbattle.mp3?alt=media&token=dc76da0a-cb0c-4009-a284-5b98c738f05f",
    actionDesc: "amp up the adrenaline?",
  },
  {
    id: "castle",
    name: "Castle Ambiance",
    tags: expandedTags.castleAmbiance,
    url: "https://firebasestorage.googleapis.com/v0/b/bardbot-416320.appspot.com/o/music%2Fcastle.mp3?alt=media&token=38c5c5fc-bb8e-4096-a821-a6155eeabc8b",
    actionDesc: "enter the grand halls?",
  },
  {
    id: "cave",
    name: "Cave Ambiance",
    tags: expandedTags.caveAmbiance,
    url: "https://firebasestorage.googleapis.com/v0/b/bardbot-416320.appspot.com/o/music%2Fcave.mp3?alt=media&token=82827d17-3e81-44e9-af0c-505c08faff56",
    actionDesc: "explore the depths?",
  },
  {
    id: "city",
    name: "City Ambience",
    tags: expandedTags.cityNoises,
    url: "https://firebasestorage.googleapis.com/v0/b/bardbot-416320.appspot.com/o/music%2Fcity.mp3?alt=media&token=f0b5fff1-03fc-4e90-8f46-d2da578cb28d",
    actionDesc: "turn the hustle up?",
  },
  {
    id: "desert",
    name: "Desert Ambiance",
    tags: expandedTags.desertAmbiance,
    url: "https://firebasestorage.googleapis.com/v0/b/bardbot-416320.appspot.com/o/music%2Fdesert.mp3?alt=media&token=3526b119-0b00-417f-acbc-865d8f3cd407",
    actionDesc: "get lost in the dunes?",
  },
  {
    id: "forest",
    name: "Forest Ambiance",
    tags: expandedTags.forestAmbiance,
    url: "https://firebasestorage.googleapis.com/v0/b/bardbot-416320.appspot.com/o/music%2Fforest.mp3?alt=media&token=054792a1-4b10-491c-ba82-adba6ad32544",
    actionDesc: "immerse in nature?",
  },
  {
    id: "haunted",
    name: "Haunted House Ambiance",
    tags: expandedTags.hauntedHouseAmbiance,
    url: "https://firebasestorage.googleapis.com/v0/b/bardbot-416320.appspot.com/o/music%2Fhaunted.mp3?alt=media&token=f77e511d-b822-40ed-a06e-133baa8e78a1",
    actionDesc: "creep them out?",
  },
  {
    id: "happy",
    name: "Warm/Happy Music",
    tags: expandedTags.warmHappyMusic,
    url: "https://firebasestorage.googleapis.com/v0/b/bardbot-416320.appspot.com/o/music%2Fhappy.mp3?alt=media&token=b6bd3ede-3be6-4797-89d6-5fd088e6b533",
    actionDesc: "put a smile on their faces?",
  },
  {
    id: "magical",
    name: "Magical/Whimsical Music",
    tags: expandedTags.magicalWhimsical,
    url: "https://firebasestorage.googleapis.com/v0/b/bardbot-416320.appspot.com/o/music%2Fmagical.mp3?alt=media&token=5208e8c7-c1d9-4ca6-a04e-b5358faa15ff",
    actionDesc: "add a touch of magic?",
  },
  {
    id: "melancholic",
    name: "Cold/Sad Music",
    tags: expandedTags.coldSadMusic,
    url: "https://firebasestorage.googleapis.com/v0/b/bardbot-416320.appspot.com/o/music%2Fmelancholic.mp3?alt=media&token=869ad3b1-bdc1-4b46-832a-79c85f9c3435",
    actionDesc: "set a melancholic tone?",
  },
  {
    id: "mountain",
    name: "Mountain Ambiance",
    tags: expandedTags.mountainAmbiance,
    url: "https://firebasestorage.googleapis.com/v0/b/bardbot-416320.appspot.com/o/music%2Fmountain.mp3?alt=media&token=c542496e-a2f8-4ded-94c7-a1f4e2028a1d",
    actionDesc: "feel the mountain air?",
  },
  {
    id: "ominous",
    name: "Ominous/Mysterious Music",
    tags: expandedTags.ominousMusicMysterious,
    url: "https://firebasestorage.googleapis.com/v0/b/bardbot-416320.appspot.com/o/music%2Fominous.mp3?alt=media&token=90b8de86-a617-4f99-bde8-3a0c329162d2",
    actionDesc: "make it mysterious?",
  },
  {
    id: "prison",
    name: "Prison/Dungeon Noises",
    tags: expandedTags.prisonDungeonNoises,
    url: "https://firebasestorage.googleapis.com/v0/b/bardbot-416320.appspot.com/o/music%2Fprison.mp3?alt=media&token=8286afb1-a51b-435f-aae0-8a2cd7ee16db",
    actionDesc: "make it ominous?",
  },
  {
    id: "space",
    name: "Space Ambiance",
    tags: expandedTags.spaceAmbiance,
    url: "https://firebasestorage.googleapis.com/v0/b/bardbot-416320.appspot.com/o/music%2Fspace.mp3?alt=media&token=1fec1b6c-3ad6-451d-ba3a-aac8fd9acb9f",
    actionDesc: "blast off into space?",
  },
  {
    id: "tavern",
    name: "Tavern Ambiance",
    tags: expandedTags.tavernAmbiance,
    url: "https://firebasestorage.googleapis.com/v0/b/bardbot-416320.appspot.com/o/music%2Ftavern.mp3?alt=media&token=f13604c6-285c-4052-bc45-72a8ddb7bc93",
    actionDesc: "set the mood?",
  },
  {
    id: "underwater",
    name: "Underwater Ambiance",
    tags: expandedTags.underwaterAmbiance,
    url: "https://firebasestorage.googleapis.com/v0/b/bardbot-416320.appspot.com/o/music%2Funderwater.mp3?alt=media&token=ccf6b7ec-b12d-471d-9371-4a690ce51a9e",
    actionDesc: "dive into the depths?",
  },
  {
    id: "village",
    name: "Village Ambiance",
    tags: expandedTags.villageAmbiance,
    url: "https://firebasestorage.googleapis.com/v0/b/bardbot-416320.appspot.com/o/music%2Fvillage.mp3?alt=media&token=10177832-76fc-47b4-b43e-aa0ed5bdc126",
    actionDesc: "feel the village vibes?",
  },
  {
    id: "winter",
    name: "Winter Wonderland Ambiance",
    tags: expandedTags.winterWonderlandAmbiance,
    url: "https://firebasestorage.googleapis.com/v0/b/bardbot-416320.appspot.com/o/music%2Fwinter.mp3?alt=media&token=c5f8c007-f203-48bd-8694-9524298c74dc",
    actionDesc: "feel the frosty breeze?",
  },
];

module.exports = {
  Status,
  Color,
  settings: {
    listeningCooldown: 5_500,
    prefixCommands: ["control", "language", "prefix"],
    leaveEmptyVC: 60_000,
    validVoiceKeyWords: ["bot", "bard", "bard"],
  },
  tags: tags,
  audioList: audioList,
  Emojis,
};
