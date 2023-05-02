require('dotenv').config();
const { Client, IntentsBitField } = require("discord.js");
const eventHandler = require('./handlers/eventHandler');
const mongoose = require('mongoose');

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildPresences,
        IntentsBitField.Flags.MessageContent,
    ],
});

(async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, { keepAlive: true });
        console.log('Connected to MongoDB');

        eventHandler(client);
        client.login(process.env.TOKEN);
    } catch (error) {
        console.log(error);
    }
})();

