const { EmbedBuilder, Client, Interaction } = require("discord.js")

module.exports = {
    name: 'help',
    description: "I'll be happy helping you!",

    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */

    callback: async (client, interaction) => {
        await interaction.deferReply();

        const targetUserId = interaction.member.id;
        const targetUser = await interaction.guild.members.fetch(targetUserId);

        const help = new EmbedBuilder()
            .setTitle('Miko V1 Commands')
            .setDescription(`:wave: Hello ${targetUser}! Here are my commands, feel free to use it!`)
            .setColor('Random')
            .setAuthor({
                name: `${client.user.tag}`,
                iconURL: `${client.user.avatarURL()}`,
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
                    name: `:crossed_swords: /level`,
                    value: `Shows your level or someone else's level.`,
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