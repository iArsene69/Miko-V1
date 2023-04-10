require('dotenv').config();
const { Client, IntentsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
});

const roles = [
    {
        id: '1094850362214731836',
        label: 'PDI-P'
    },
    {
        id: '1094850622647443477',
        label: 'Demokrat'
    },
    {
        id: '1094850724480962630',
        label: 'Golkar'
    },
];

client.on('ready', async (c) => {
   try {
    const channel = await client.channels.cache.get('1094527698900107315');
    if(!channel) return;

    const row = new ActionRowBuilder();
    roles.forEach((role) => {
        row.components.push(
            new ButtonBuilder().setCustomId(role.id).setLabel(role.label).setStyle(
                ButtonStyle.Primary
            )
        )
    });

    await channel.send({
        content: 'Claim or remove a role below.',
        components: [row],
    });
    process.exit();
   } catch (error) {
    console.log(error);
   }
});

client.login(process.env.TOKEN);