const { EmbedBuilder } = require("discord.js")

module.exports = {
    name: 'help',
    description: "I'll be happy helping you!",

    callback: async (client, interaction) => {
        await interaction.deferReply();

        const help = new EmbedBuilder()
            .setTitle('Miko V1 Commands')
            .setDescription('Here are my commands, feel free to use it!')
            .setColor('Random')
            .setAuthor({
                name: 'Miko v1',
                iconURL: 'https://media.discordapp.net/attachments/1094527698900107315/1094601168182853713/Miko_Yotsuya_Icon.jpg?width=605&height=605',
            })
            .addFields(
                {
                    name: `:mega: /ping`,
                    value: 'Pong!',
                },
                {
                    name: `:sos: /help`,
                    value: 'Get help.',
                },
                {
                    name: `:no_entry: /ban`,
                    value: 'Bans a user from this server.',

                },
                {
                    name: `:anger: /kick`,
                    value: 'Kicks a user from this server.',
                },
                {
                    name: `:stopwatch: /timeout`,
                    value: 'Timeout a user.',
                },
            )
            .setTimestamp()

        await interaction.editReply({ embeds: [help] });
    }
}