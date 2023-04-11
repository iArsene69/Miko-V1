const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: 'ping',
    description: 'Pong!',
    //devOnly: ,
    //testOnly: ,
    //options: ,

    callback: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: true });

        const reply = await interaction.fetchReply();

        const ping = reply.createdTimestamp - interaction.createdTimestamp;

        const pong = new EmbedBuilder()
        .setTitle(`Pong!`)
        .setDescription(`Client: ${ping}ms | Web Socket: ${client.ws.ping}ms`)
        .setColor('Random');

        await interaction.editReply({ embeds: [pong] });
    },
}