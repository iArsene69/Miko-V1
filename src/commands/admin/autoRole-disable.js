const { ApplicationCommandOptionType, Client, Interaction, PermissionFlagsBits } = require("discord.js");
const AutoRole = require('../../schema/autoRole');

module.exports = {
    name: 'autorole-disable',
    description: 'Disable auto-role in this server',
    permissionsRequired: [PermissionFlagsBits.Administrator],


    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */

    callback: async (client, interaction) => {
        try {
            await interaction.deferReply();

            if (!(await AutoRole.exists({ guildId: interaction.guild.id, }))) {
                await interaction.editReply(`Auto-role has not been configured for this server\nUse /autorole-configure to set up auto-role`);
                return;
            }

            await AutoRole.findOneAndDelete({ guildId: interaction.guild.id });
            await interaction.editReply(`Auto-role has been successfully disabled.\nUse /autorole-configure to reconfigure it again.`);
        } catch (error) {
            console.log(`There was an error at /autorole-disable ${error}`);
        }
    }
}