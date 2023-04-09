require('dotenv').config();
const { Client, IntentsBitField, EmbedBuilder } = require("discord.js");

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
});

client.on('ready', (c) => {
    console.log(`✅ ${c.user.tag} is online!`);
});

client.on('interactionCreate', (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'test') {
        interaction.reply('toast');
    }

    if (interaction.commandName === 'sum') {
        const num1 = interaction.options.get('first-number').value;
        const num2 = interaction.options.get('second-number').value;

        interaction.reply(`The sum is ${num1 + num2}`);
    }

    if (interaction.commandName === 'help') {
        const help = new EmbedBuilder()
            .setTitle('Miko V1 Commands')
            .setDescription('Here are my commands, feel free to use it!')
            .setColor('Random')
            .setAuthor({
                name: 'M I K O  P O S T I N G',
                iconURL: 'https://cdn.discordapp.com/attachments/1094527698900107315/1094601167868276787/Mieruko.jpg',
            })
            .addFields(
                {
                    name: '/test',
                    value: 'Return toast as a response',
                    inline: true,
                },
                {
                   name: '/sum',
                   value: 'Be an Asian',
                   inline:true, 
                }
            )
            .setImage('https://media.discordapp.net/attachments/1094527698900107315/1094601168182853713/Miko_Yotsuya_Icon.jpg?width=605&height=605')
            .setTimestamp()
            .setFooter({
                text: 'Made with love.'
            });

        interaction.reply({embeds: [help]});
    }
});

client.login(process.env.TOKEN);