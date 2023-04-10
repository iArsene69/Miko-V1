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

client.on('interactionCreate', async (interaction) => {
    if (interaction.isChatInputCommand()) {

        if (interaction.commandName === 'test') {
            await interaction.deferReply({ ephemeral: true });
            await interaction.editReply('toast');
        }

        if (interaction.commandName === 'sum') {
            const num1 = interaction.options.get('first-number').value;
            const num2 = interaction.options.get('second-number').value;

            const sum = new EmbedBuilder()
                .setColor('Random')
                .addFields(
                    {
                        name: `The Result of ${num1} + ${num2} is:`,
                        value: `${num1 + num2}`,
                    }
                )
                .setTimestamp();
            await interaction.reply({ embeds: [sum] });
        }

        if (interaction.commandName === 'help') {
            const help = new EmbedBuilder()
                .setTitle('Miko V1 Commands')
                .setDescription('Here are my commands, feel free to use it!')
                .setColor('Random')
                .setAuthor({
                    name: 'M I K O  P O S T I N G',
                    iconURL: 'https://cdn.discordapp.com/attachments/1094527698900107315/1094601167868276787/Mieruko.jpg',
                    url: 'https://www.discordapp.com/users/1094232703869653112'
                })
                .addFields(
                    {
                        name: `:loudspeaker: /test`,
                        value: 'Return toast as a response',
                        inline: true,
                    },
                    {
                        name: `:1234: /sum`,
                        value: 'Be an Asian',
                        inline: true,
                    }
                )
                .setImage('https://media.discordapp.net/attachments/1094527698900107315/1094601168182853713/Miko_Yotsuya_Icon.jpg?width=605&height=605')
                .setTimestamp()
                .setFooter({
                    text: 'Made with love.'
                });

            await interaction.reply({ embeds: [help] });
        }
    }

    try {
        if (interaction.isButton()) {
            await interaction.deferReply({ ephemeral: true, });
            const role = interaction.guild.roles.cache.get(interaction.customId);
            if (!role) {
                interaction.editReply({
                    content: "I couldn't find the role"
                });
                return;
            }

            const hasRole = interaction.member.roles.cache.has(role.id);

            if (hasRole) {
                await interaction.member.roles.remove(role);
                await interaction.editReply(`The role ${role} has been removed.`);
                return;
            }

            await interaction.member.roles.add(role);
            await interaction.editReply(`The role ${role} has been added.`);
        }
    } catch (error) {
        console.log(error);
    }
});

client.login(process.env.TOKEN);