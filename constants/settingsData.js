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
    "alley",
    "guildhall",
    "mage",
    "blacksmith",
    "temple",
    "library",
    "festival",
    "barracks",
    "theater",
    "arena",
    "graveyard",
    "apothecary",
    "marketplace",
    "caravan",
    "academy",
    "mansion",
  ],
  tavernAmbiance: [
    "tavern",
    "inn",
    "pub",
    "bar",
    "alehouse",
    "taproom",
    "drinks",
    "mugs",
    "cheers",
    "tankard",
    "barkeep",
    "bartender",
    "patrons",
    "tables",
    "chairs",
    "fireplace",
    "smoke",
    "lively",
    "music",
    "raucous",
    "intimate",
    "boisterous",
    "festive",
    "merriment",
    "conversations",
    "laughter",
    "rumors",
    "lore",
    "stories",
    "companions",
    "drinkers",
    "rum",
    "whiskey",
    "beer",
    "wine",
    "mead",
    "spirits",
    "tavernkeep",
    "barstool",
    "drunken",
    "gambling",
    "cards",
    "dice",
    "tavernmaid",
    "wench",
    "stout",
    "ale",
    "cider",
    "brews",
    "taverngoers",
    "smiles",
    "toasts",
    "brandy",
    "bets",
    "bard",
    "minstrel",
    "entertainment",
    "songs",
    "performer",
    "brawls",
    "thieves",
    "guards",
    "secrets",
    "shadows",
    "dark",
    "cosy",
    "shouts",
    "atmosphere",
    "mug",
    "guild",
    "bounty",
    "barstools",
    "weapons",
    "deals",
    "gossip",
    "revelry",
    "drinking",
    "fellowship",
  ],
  prisonDungeonNoises: [
    "prison",
    "dungeon",
    "cell",
    "guard",
    "warden",
    "inmate",
    "chains",
    "bars",
    "locks",
    "shackles",
    "torture",
    "wails",
    "captivity",
    "sentence",
    "restraint",
    "solitary",
    "block",
    "key",
    "grate",
    "penitentiary",
    "cuffs",
    "patrol",
    "purgatory",
    "lockup",
    "detainee",
    "lockdown",
    "confinement",
    "perpetrator",
    "detention",
  ],
  bossBattleMusic: [
    "battle",
    "fight",
    "combat",
    "boss",
    "dragon",
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
    "foes",
    "confrontation",
    "champion",
    "heroic",
  ],
  coldSadMusic: [
    "sad",
    "depressed",
    "melancholy",
    "gloomy",
    "sorrowful",
    "despairing",
    "tearful",
    "heartbroken",
    "mournful",
    "weeping",
    "bereaved",
    "grief-stricken",
    "blue",
    "downcast",
    "disheartened",
    "disconsolate",
    "despondent",
    "dismal",
    "forlorn",
    "crestfallen",
    "anguished",
    "pensive",
    "woeful",
    "morose",
    "doleful",
    "regretful",
    "wistful",
    "lamenting",
    "unhappy",
    "troubled",
    "brokenhearted",
    "bittersweet",
    "lonely",
    "sullen",
    "heavy-hearted",
    "wretched",
    "tormented",
    "dejected",
    "morbid",
    "weepy",
    "dolorous",
    "sombre",
    "wailing",
    "grieved",
    "plaintive",
    "angsty",
    "bleak",
    "dreary",
    "miserable",
    "sombre",
    "downhearted",
    "heartrending",
    "unconsolable",
    "aching",
    "morbid",
    "sighing",
    "lachrymose",
    "funereal",
    "sepulchral",
    "oppressed",
    "woebegone",
    "tragic",
    "drear",
    "melancholic",
    "heavyhearted",
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
    "odyssey",
    "excursion",
    "voyage",
    "pilgrimage",
    "trek",
    "safari",
    "jaunt",
    "ramble",
    "peregrination",
    "hike",
    "odyssey",
    "pursuit",
    "roaming",
    "questing",
    "venture",
    "campaign",
    "traverse",
    "expedition",
    "excursion",
    "perambulation",
    "stroll",
    "wandering",
    "itinerary",
    "expedition",
    "outing",
    "enterprise",
    "crossing",
    "sailing",
    "wander",
    "tramping",
    "trekking",
    "errand",
    "progress",
    "expedition",
    "jaunt",
    "ramble",
    "promenade",
    "safari",
    "tour",
    "excursion",
    "pilgrimage",
    "traversal",
    "trek",
    "turn",
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
    "creepy",
    "macabre",
    "forlorn",
    "nebulous",
    "oppressive",
    "intimidating",
    "unsettling",
    "chilling",
    "unnerving",
    "malevolent",
    "spooky",
    "peculiar",
    "strange",
    "weird",
    "unearthly",
    "otherworldly",
    "occult",
    "shrouded",
    "dreadful",
    "ghastly",
    "phantasmal",
    "phantom",
    "supernatural",
    "gloomy",
    "sinister",
    "macabre",
    "gloaming",
    "foggy",
    "muffled",
    "crepuscular",
    "hazy",
    "sombre",
    "forbidding",
    "harrowing",
    "nefarious",
    "furtive",
    "mysterious",
    "shadowed",
    "murmuring",
    "shadow",
    "death",
    "sinister",
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
    "fairy",
    "wonderland",
    "sorcery",
    "charm",
    "magic",
    "spellbound",
    "wondrous",
    "charming",
    "enraptured",
    "mesmerizing",
    "bewitching",
    "captivating",
    "enchanted",
    "mythical",
    "spellbound",
    "wizardry",
    "miraculous",
    "divine",
    "celestial",
    "supernatural",
    "enchanted",
    "surreal",
    "utopian",
    "dreamy",
    "whimsy",
    "ethereal",
    "otherworldly",
    "elven",
    "sylvan",
    "fanciful",
    "mystic",
    "bewitched",
    "transcendent",
    "charismatic",
    "enrapturing",
    "magical",
    "enigmatic",
    "glamorous",
    "fabled",
    "arcane",
    "radiant",
    "glorious",
    "heavenly",
    "arcanic",
  ],
  forestAmbiance: [
    "forest",
    "dark",
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
    "lush",
    "thicket",
    "foliage",
    "twigs",
    "branches",
    "vines",
    "shadows",
    "dappled",
    "hush",
    "shade",
    "clearing",
    "scent",
    "woodland",
    "dense",
    "glimmer",
    "glade",
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
    "craggy",
    "rocky",
    "forested",
    "elevation",
    "lofty",
    "peak",
    "precipice",
    "promontory",
    "sheer",
    "crater",
    "basin",
    "canyon",
    "rugged",
    "cascading",
    "mountaineering",
    "summit",
    "treacherous",
    "perilous",
    "looming",
    "boulder",
    "jagged",
    "abyss",
    "expanse",
    "vista",
    "climbing",
    "descent",
    "horizon",
    "barren",
    "sublime",
    "spire",
    "hollow",
    "rockface",
    "crevasse",
  ],
  beachAmbiance: [
    "beach",
    "shore",
    "waves",
    "seagulls",
    "breeze",
    "seashore",
    "sea",
    "sand",
    "ocean",
    "coastal",
    "tide",
    "surf",
    "sunbathing",
    "seashells",
    "vacation",
    "tanning",
    "umbrella",
    "boardwalk",
    "sunset",
    "swimming",
    "shell",
    "coastline",
    "sandy",
    "crashing",
    "footprints",
    "tidal",
    "tranquil",
    "dunes",
    "seaside",
    "seabreeze",
    "splashing",
    "saltwater",
    "beachcombing",
    "seclusion",
    "lifeguard",
    "sandcastle",
    "deckchair",
    "shoreline",
    "reef",
    "sailboat",
    "paradise",
    "wetsuit",
    "tideline",
    "mermaid",
    "treasure",
    "shipwreck",
    "island",
    "clam",
    "crab",
    "coral",
    "seafoam",
    "maritime",
    "pirate",
    "flotsam",
    "jetsam",
    "lagoon",
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
    "tunnel",
    "gloom",
    "depths",
    "minerals",
    "chasm",
    "gloomy",
    "crystal",
    "labyrinth",
    "depth",
    "cavernous",
    "dripping",
    "encounter",
    "hollow",
    "lurking",
    "ancient",
    "fathomless",
    "limestone",
    "pit",
    "mystery",
    "quiet",
    "crawling",
    "ominously",
    "subdued",
    "spear",
    "hiding",
    "dungeon",
    "slime",
    "passageway",
    "underworld",
    "burrow",
    "forgotten",
    "fissure",
    "underneath",
    "depth",
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
    "keep",
    "battlements",
    "fortification",
    "sentries",
    "lord",
    "lady",
    "aristocracy",
    "bastion",
    "heraldry",
    "banner",
    "feudal",
    "manor",
    "stronghold",
    "gatehouse",
    "armory",
    "siege",
    "chamber",
    "fortified",
    "drawbridge",
    "hallway",
    "banner",
    "rampart",
    "parapet",
    "portcullis",
    "catapult",
    "bannerman",
    "armored",
    "squire",
    "vassal",
    "serf",
    "armor",
    "spear",
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
    "tavern",
    "inn",
    "church",
    "bustling",
    "marketplace",
    "fields",
    "orchards",
    "pastures",
    "blacksmith",
    "villagers",
    "baker",
    "butcher",
    "weaver",
    "carpenter",
    "miller",
    "potter",
    "tailor",
    "stable",
    "well",
    "path",
    "bridges",
    "fountain",
    "barn",
    "grain",
    "harvest",
    "fishing",
    "trader",
    "merchant",
    "townsfolk",
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
    "sumberge",
    "currents",
    "abyss",
    "creatures",
    "treasure",
    "secrets",
    "mysterious",
    "glowing",
    "bioluminescent",
    "tide",
    "underworld",
    "sunlight",
    "blue",
    "serenity",
    "crustaceans",
    "jellyfish",
    "sharks",
    "dolphins",
    "secrets",
    "seabed",
    "sponge",
    "lagoon",
    "tidal",
    "urchins",
    "anemones",
    "shipwreck",
    "galleon",
    "octopus",
    "school",
    "shoal",
    "nautical",
    "waves",
  ],
  desertAmbiance: [
    "desert",
    "dunes",
    "oasis",
    "sand",
    "heat",
    "mirage",
    "camels",
    "arid",
    "scorching",
    "sahara",
    "sunburn",
    "cacti",
    "searing",
    "dry",
    "blazing",
    "sands",
    "wasteland",
    "parched",
    "dust",
    "expanse",
    "heatwave",
    "drought",
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
    "graveyard",
    "screams",
    "cursed",
    "fog",
    "gloom",
    "dread",
    "unearthly",
    "whispers",
    "vortex",
    "sinister",
    "mysterious",
    "ominous",
    "decaying",
    "nightmare",
    "possessed",
    "phantasm",
    "gloomy",
    "demonic",
    "enchanted",
    "chilling",
    "unholy",
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
    "void",
    "infinity",
    "cosmos",
    "constellation",
    "outerspace",
    "asteroids",
    "comets",
    "cosmonaut",
    "spaceship",
    "lunar",
    "satellite",
    "stellar",
    "warp",
    "mysterious",
    "astronomical",
    "intergalactic",
    "supernova",
    "galactic",
    "infinity",
    "cosmos",
    "unexplored",
    "astronomy",
    "spacecraft",
    "telescope",
    "cosmonaut",
    "cosmology",
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
    "snowdrift",
    "snowflakes",
    "chilly",
    "whiteout",
    "frostbite",
    "snowstorm",
    "icicles",
    "snowscape",
    "polar",
    "hibernation",
    "snowbound",
    "snowy",
    "avalanche",
    "snowcapped",
    "winterland",
    "mitten",
    "scarf",
    "frozen",
    "crisp",
    "snowbank",
    "powder",
    "slush",
    "penguin",
    "snowshoe",
  ],
};

const triggerKeywords = [
  {
    word: "in",
    related: [
      { word: "distance", rank: 1 },
      { word: "the", rank: 2 },
    ],
  }, // "in" and its related words
  {
    word: "the",
    related: [{ word: "distance", rank: 1 }],
  }, // "the" and its related words
  { word: "suddenly", related: [] }, // "suddenly" has no related words
  {
    word: "stepping",
    related: [
      { word: "into", rank: 1 },
      { word: "in", rank: 1 },
      { word: "through", rank: 1 },
    ],
  },
  {
    word: "you",
    related: [
      { word: "walk", rank: 1 },
      { word: "run", rank: 1 },
      { word: "hear", rank: 1 },
      { word: "see", rank: 1 },
      { word: "teleport", rank: 1 },
      { word: "feel", rank: 1 },
      { word: "transport", rank: 1 },
      { word: "wander", rank: 1 },
      { word: "tiptoe", rank: 1 },
      { word: "roam", rank: 1 },
      { word: "enter", rank: 1 },
      { word: "storm", rank: 1 },
      { word: "explore", rank: 1 },
      { word: "trek", rank: 1 },
      { word: "traverse", rank: 1 },
      { word: "stroll", rank: 1 },
      { word: "ramble", rank: 1 },
      { word: "journey", rank: 1 },
      { word: "ambulate", rank: 1 },
      { word: "navigate", rank: 1 },
      { word: "rove", rank: 1 },
      { word: "saunter", rank: 1 },
      { word: "tramp", rank: 1 },
      { word: "perambulate", rank: 1 },
      { word: "prowl", rank: 1 },
      { word: "amble", rank: 1 },
      { word: "trudge", rank: 1 },
      { word: "stride", rank: 1 },
      { word: "approach", rank: 1 },
      { word: "hike", rank: 1 },
    ],
  }, // "your" and its related words
  // Add more keywords and related words as needed
];

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
    url: "haunted.mp3",
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
    listeningCooldown: 5_000,
    prefixCommands: ["control", "language", "prefix"],
    leaveEmptyVC: 60_000,
    validVoiceKeyWords: ["bot", "bard", "bard"],
  },
  tags,
  audioList,
  soundboard,
  Emojis,
  triggerKeywords,
};