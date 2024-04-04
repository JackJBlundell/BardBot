const { Collection } = require("discord.js");

module.exports = async (client) => {
  client.commands = new Collection();
  client.queues = new Collection();
  client.commandResponses = new Collection();
  client.listenAbleUsers = new Set();
  client.connectedGuilds = new Set();
  client.noteModes = new Collection();
  client.autoModes = new Collection();
  // client.db = new Enmap({
  //     name: "maindb",
  //     dataDir: "./databases/main"
  // });
};
