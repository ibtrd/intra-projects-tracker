const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const mongoose = require("mongoose");
const WebSocket = require('ws');
const { sendProjectMessages } = require('./validate');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Load slash commands
client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;
	const command = interaction.client.commands.get(interaction.commandName);
	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}
	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

// When the client is ready, run this code (only once).
client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

// Connect to mongodb
const mongoURI = `${process.env.MONGO_URL}/${process.env.MONGO_DATABASE}`;
mongoose
  .connect(mongoURI)
  .then(async () => {
    console.log(`Connected to MongoDB: ${mongoURI}`);
    // Log in to Discord
    client.login(process.env.DISCORD_TOKEN);
    // Initialize WebSocket connection
    connectWebSocket();
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

let ws;
const WS_URL = 'ws://server:3000/projects/notify'
let reconnectInterval = 5000;

function connectWebSocket() {
    ws = new WebSocket(WS_URL);

    // When WebSocket connection opens
    ws.on('open', () => {
        console.log('Connected to WebSocket server.');
    });

    // When WebSocket receives a message
    ws.on('message', (data) => {
        const message = JSON.parse(data);
        if (message.type === 'update') {
            console.log('Update received:', message.data);
        }
        sendProjectMessages(client, message.payload);
    });

    // When WebSocket connection closes
    ws.on('close', (code, reason) => {
        console.warn(`WebSocket closed: [${code}] ${reason}`);
        console.log(`Attempting to reconnect in ${reconnectInterval / 1000} seconds...`);
        setTimeout(connectWebSocket, reconnectInterval);
    });

    // When an error occurs
    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        ws.close();
    });
}
