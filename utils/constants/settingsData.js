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
    "downtown",
    "sidewalk",
    "bustliung",
    "pedestrians",
    "hustling",
    "skyscrapers",
    "business",
    "cafes",
    "restaurants",
    "shops",
    "streets",
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
    "bartender",
    "patrons",
    "songs",
    "tankards",
    "tables",
    "hustle",
    "bustle",
    "games",
    "barkeep",
    "alehouse",
    "stool",
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
    "guard",
    "iron bars",
    "locks",
    "torture chamber",
    "wails",
    "flickering torches",
    "jail",
    "confinement",
    "penitentiary",
    "captivity",
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
    "victory",
    "clash",
    "warrior",
    "swords",
    "shields",
    "armor",
    "roll",
    "initiative",
    "foes",
    "confrontation",
    "champion",
    "heroic",
  ],
  coldSadMusic: [
    "sad",
    "lonely",
    "melancholy",
    "desolate",
    "gloomy",
    "tears",
    "heartbreak",
    "depression",
    "sorrow",
    "grief",
    "anguish",
    "solitude",
    "lament",
    "blue",
    "regret",
    "mournful",
    "despair",
    "loss",
    "tragedy",
    "emptiness",
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
    "optimistic",
    "smiles",
    "laughter",
    "positivity",
    "contentment",
    "happiness",
    "gratitude",
    "new",
    "begins",
    "day",
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
    "quest",
    "expedition",
    "wanderlust",
    "road trip",
    "odyssey",
    "excursion",
    "expedition",
    "journey",
    "road trip",
    "odyssey",
    "excursion",
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
    "enigmatic",
    "shadowy",
    "cryptic",
    "foreboding",
    "sinister",
    "ghostly",
    "grim",
    "brooding",
    "miasma",
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
    "wonder",
    "dreams",
    "enchantment",
    "ethereal",
    "imaginary",
    "fairy tale",
    "wonderland",
    "sorcery",
    "charm",
    "magic",
    "spellbound",
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
    "wildlife",
    "greenery",
    "leaves",
    "breeze",
    "sunlight",
    "canopy",
    "moss",
    "undergrowth",
    "river",
    "stream",
    "pathway",
  ],
  mountainAmbiance: [
    "mountain",
    "peaks",
    "summit",
    "cliffs",
    "wind",
    "scenic",
    "mountainous",
    "wilderness",
    "crags",
    "terrain",
    "hiking",
    "alpine",
    "valleys",
    "valley",
    "ridge",
    "altitude",
    "plateau",
    "wilderness",
    "avalanche",
    "glacier",
    "avalanche",
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
    "coastal",
    "tide",
    "surf",
    "sunbathing",
    "seashells",
    "bikini",
    "vacation",
    "tanning",
    "umbrella",
    "boardwalk",
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
    "damp",
    "underground",
    "subterranean",
    "crevice",
    "bat",
    "grotto",
    "echo",
    "abyss",
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
    "throne",
    "moat",
    "turrets",
    "king",
    "queen",
    "crown",
    "court",
    "medieval",
    "chivalry",
    "knights",
    "joust",
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
    "rural",
    "gathering",
    "festivity",
    "cottage",
    "farm",
    "countryside",
    "square",
    "tradition",
    "gathering",
    "fair",
    "fete",
    "parish",
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
    "marine",
    "aquatic",
    "coral",
    "seaweed",
    "diving",
    "shipwreck",
    "scuba",
    "atlantis",
    "undersea",
    "submarine",
    "reef",
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
    "arid",
    "scorching",
    "sahara",
    "sunburn",
    "cacti",
    "searing",
    "dry",
    "oasis",
    "mirage",
    "oasis",
    "mirage",
    "oasis",
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
    "spooky",
    "paranormal",
    "eerie",
    "supernatural",
    "phantom",
    "apparition",
    "haunting",
    "specter",
    "poltergeist",
    "abandoned",
    "macabre",
    "horror",
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
    "planets",
    "galaxy",
    "astronaut",
    "gravity",
    "orbit",
    "celestial",
    "alien",
    "exploration",
    "interstellar",
    "black",
    "nebula",
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
    "blizzard",
    "snowman",
    "sleigh",
    "igloo",
    "skiing",
  ],
};

// Soundboard
const combat = [
  {
    keywords: [
      "fly",
      "whizz",
      "past",
      "miss",
      "swift",
      "flies",
      "soars",
      "soar",
    ],
    required: "arrow",
    url: "arrowFlying.mp3",
  },
  {
    keywords: ["swing", "blade", "slash", "cut", "attack"],
    required: "sword",
    url: "path_to_sword_swing.mp3",
  },
  {
    keywords: ["clash", "clang", "metal", "impact", "parry"],
    required: "sword",
    url: "path_to_sword_clash.mp3",
  },
  {
    keywords: ["thud", "strike", "blow", "hit", "pound"],
    required: null,
    url: "path_to_blunt_impact.mp3",
  },
  {
    keywords: ["crack", "pierce", "penetrate", "stab", "thrust"],
    required: null,
    url: "path_to_piercing_impact.mp3",
  },
  {
    keywords: ["thud", "crash", "strike", "smash", "collision"],
    required: null,
    url: "path_to_heavy_impact.mp3",
  },
  {
    keywords: ["hit", "devastating", "strike", "damage", "lethal"],
    required: null,
    url: "path_to_critical_hit.mp3",
  },
  {
    keywords: ["draw", "metallic", "scrape", "unsheathe", "ready"],
    required: "weapon",
    url: "path_to_weapon_draw.mp3",
  },
  {
    keywords: ["movement", "clank", "rustle", "shift", "gear"],
    required: "armor",
    url: "path_to_armor_movement.mp3",
  },
  {
    keywords: ["block", "clang", "parry", "defend", "guard"],
    required: "shield",
    url: "path_to_shield_block.mp3",
  },
  {
    keywords: ["bash", "thud", "strike", "push", "assault"],
    required: "shield",
    url: "path_to_shield_bash.mp3",
  },
  {
    keywords: ["sunder", "rend", "metal", "break", "destroy"],
    required: "armor",
    url: "path_to_armor_sunder.mp3",
  },
];

const soundboard = { combat };

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
    url: "adventure.mp3",
    actionDesc: "embark on a journey?",
  },
  {
    id: "beach",
    name: "Beach Ambiance",
    tags: expandedTags.beachAmbiance,
    url: "beach.mp3",
    actionDesc: "hit the sandy shores?",
  },
  {
    id: "boss",
    name: "Boss Battle Music",
    tags: expandedTags.bossBattleMusic,
    url: "battle.mp3",
    actionDesc: "amp up the adrenaline?",
  },
  {
    id: "castle",
    name: "Castle Ambiance",
    tags: expandedTags.castleAmbiance,
    url: "castle.mp3",
    actionDesc: "enter the grand halls?",
  },
  {
    id: "cave",
    name: "Cave Ambiance",
    tags: expandedTags.caveAmbiance,
    url: "cave.mp3",
    actionDesc: "explore the depths?",
  },
  {
    id: "city",
    name: "City Ambience",
    tags: expandedTags.cityNoises,
    url: "city.mp3",
    actionDesc: "turn the hustle up?",
  },
  {
    id: "desert",
    name: "Desert Ambiance",
    tags: expandedTags.desertAmbiance,
    url: "desert.mp3",
    actionDesc: "get lost in the dunes?",
  },
  {
    id: "forest",
    name: "Forest Ambiance",
    tags: expandedTags.forestAmbiance,
    url: "forest.mp3",
    actionDesc: "immerse in nature?",
  },
  {
    id: "haunted",
    name: "Haunted House Ambiance",
    tags: expandedTags.hauntedHouseAmbiance,
    url: "hanuted.mp3",
    actionDesc: "creep them out?",
  },
  {
    id: "happy",
    name: "Warm/Happy Music",
    tags: expandedTags.warmHappyMusic,
    url: "happy.mp3",
    actionDesc: "put a smile on their faces?",
  },
  {
    id: "magical",
    name: "Magical/Whimsical Music",
    tags: expandedTags.magicalWhimsical,
    url: "adventure.mp3",
    actionDesc: "add a touch of magic?",
  },
  {
    id: "melancholic",
    name: "Cold/Sad Music",
    tags: expandedTags.coldSadMusic,
    url: "melancholic.mp3",
    actionDesc: "set a melancholic tone?",
  },
  {
    id: "mountain",
    name: "Mountain Ambiance",
    tags: expandedTags.mountainAmbiance,
    url: "mountain.mp3",
    actionDesc: "feel the mountain air?",
  },
  {
    id: "ominous",
    name: "Ominous/Mysterious Music",
    tags: expandedTags.ominousMusicMysterious,
    url: "ominous.mp3",
    actionDesc: "make it mysterious?",
  },
  {
    id: "prison",
    name: "Prison/Dungeon Noises",
    tags: expandedTags.prisonDungeonNoises,
    url: "prison.mp3",
    actionDesc: "make it ominous?",
  },
  {
    id: "space",
    name: "Space Ambiance",
    tags: expandedTags.spaceAmbiance,
    url: "space.mp3",
    actionDesc: "blast off into space?",
  },
  {
    id: "tavern",
    name: "Tavern Ambiance",
    tags: expandedTags.tavernAmbiance,
    url: "tavern.mp3",
    actionDesc: "set the mood?",
  },
  {
    id: "underwater",
    name: "Underwater Ambiance",
    tags: expandedTags.underwaterAmbiance,
    url: "underwater.mp3",
    actionDesc: "dive into the depths?",
  },
  {
    id: "village",
    name: "Village Ambiance",
    tags: expandedTags.villageAmbiance,
    url: "village.mp3",
    actionDesc: "feel the village vibes?",
  },
  {
    id: "winter",
    name: "Winter Wonderland Ambiance",
    tags: expandedTags.winterWonderlandAmbiance,
    url: "winter.mp3",
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
  tags,
  audioList,
  soundboard,
  Emojis,
};
