require('dotenv').config();
const { REST, Routes, ApplicationCommandOptionType } = require('discord.js');

const commands = [
    {
        name: 'test',
        description: 'toast',
    },
    {
        name: 'sum',
        description: 'Simply adds 2 numbers',
        options: [
            {
                name: 'first-number',
                description: 'Insert the first number',
                type: ApplicationCommandOptionType.Number,
                required: true,
            },
            {
                name: 'second-number',
                description: 'Insert the second number',
                type: ApplicationCommandOptionType.Number,
                required: true,
            },
        ],
    },
    {
        name: 'help',
        description: 'Show all of my commands',
    },
];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log('Registering Commands...');
        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commands }
        )
        console.log('Commands registered successfully');
    } catch (error) {
        console.log(`Errors detected: ${error}`)
    }
})();