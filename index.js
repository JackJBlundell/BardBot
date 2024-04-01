const { createAudioResource } = require("@discordjs/voice");
const { Client, Routes, REST } = require("discord.js");
const { readdirSync } = require("fs");
const { clientData } = require("./utils/constants/clientData.js");
require("dotenv").config();
const path = require("path");

// Initialize Discord client
const client = new Client(clientData);

// Load extenders
readdirSync(`./extenders`)
  .filter((x) => x.endsWith(".js"))
  .forEach((fileName) => require(`./extenders/${fileName}`)(client));

// Load events
readdirSync(`./events`)
  .filter((x) => x.endsWith(".js"))
  .forEach((fileName) => require(`./events/${fileName}`)(client));

readdirSync(`./commands`)
  .filter((x) => x.endsWith(".js"))
  .forEach((fileName) =>
    client.commands.set(
      fileName.toLowerCase().replace(".js", ""),
      require(`./commands/${fileName}`)
    )
  );
readdirSync(`./commandResponses`)
  .filter((x) => x.endsWith(".mp3"))
  .forEach((fileName) =>
    client.commandResponses.set(fileName.toLowerCase().replace(".mp3", ""), {
      title: "infoActionAudio",
      resource: createAudioResource(`./commandResponses/${fileName}`),
    })
  );
// Load commands
const commandsPath = path.join(__dirname, "commands");
const commands = [];
console.log(`Checking directory: ${commandsPath}`);

try {
  const commandFiles = readdirSync(commandsPath);

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    console.log(`Checking file: ${filePath}`);

    try {
      const command = require(filePath);

      // Validate command structure
      if ("data" in command && "execute" in command) {
        commands.push(command.data.toJSON());
      } else {
        console.log(
          `[WARNING] The command in ${filePath} is missing a required "data" or "execute" property.`
        );
      }
    } catch (error) {
      console.error(`Error loading command file: ${filePath}`, error);
    }
  }
} catch (err) {
  console.error(`Error reading directory: ${commandsPath}`, err);
}

// Initialize Discord REST API
const rest = new REST().setToken(process.env.DISCORD_TOKEN);

// Deploy commands to Discord
(async () => {
  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    );

    // Update application commands
    const data = await rest.put(
      Routes.applicationCommands(process.env.DISCORD_CLIENT_ID),
      { body: commands }
    );

    console.log(
      `Successfully reloaded ${data.length} application (/) commands.`
    );
  } catch (error) {
    console.error(error);
  }
})();

// Log in to Discord
client.login(process.env.DISCORD_TOKEN);
