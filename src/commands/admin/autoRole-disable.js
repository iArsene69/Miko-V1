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
                const autorolealready = {
                    color: 0xebeb15,
                    title: `:warning: Auto-role has not been configured`,
                    description: `Auto-role has not been configured for this server\nUse /autorole-configure to set up auto-role`,
                }
                await interaction.editReply({ embeds: [autorolealready] });
                return;
            }

            await AutoRole.findOneAndDelete({ guildId: interaction.guild.id });
            const autoroledisable = {
                color: 0x1fff01,
                title: `:white_check_mark: Successfully disabled`,
                description: `Role successfully disabled.\nTo reconfigure run /autorole-configure.`,
            }
            await interaction.editReply({ embeds: [autoroledisable] });
        } catch (error) {
            console.log(`There was an error at /autorole-disable ${error}`);
        }
    }
}