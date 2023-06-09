const { ApplicationCommandOptionType, Client, Interaction, PermissionFlagsBits } = require("discord.js");
const AutoRole = require('../../schema/autoRole');


module.exports = {
    name: 'autorole-configure',
    description: 'Configure auto-role for your server',
    options: [
        {
            name: 'role',
            description: 'The role you want to assign to user when they join.',
            type: ApplicationCommandOptionType.Role,
            required: true,
        }
    ],

    permissionsRequired: [PermissionFlagsBits.Administrator],
    botPermissions: [PermissionFlagsBits.ManageRoles],

    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */

    callback: async (client, interaction) => {
        if(!interaction.inGuild){
            interaction.reply('You can only run this command inside a server');
            return;
        }

        const targetRoleId = interaction.options.get('role').value;

        try {
            await interaction.deferReply();
            let autoRole = await AutoRole.findOne({
                guildId: interaction.guild.id,
            });

            if (autoRole) {
                if (autoRole.roleId === targetRoleId) {
                    const autorolealready = {
                        color: 0xebeb15,
                        title: `:warning: Auto role has been configured`,
                        description: `Auto role has already been configured for that role.\nTo disable run /autorole-disable.`,
                    }
                    await interaction.editReply({ embeds: [autorolealready] });
                    return;
                }

                autoRole.roleId = targetRoleId;
            }else{
                autoRole = new AutoRole({
                    guildId: interaction.guild.id,
                    roleId: targetRoleId,
                });
            }

            await autoRole.save();
            const autoroleconfig = {
                color: 0x1fff01,
                title: `:white_check_mark: Successfully configured`,
                description: `Role ${targetRoleId} successfully configured.\nTo disable run /autorole-disable.`,
            }
            await interaction.editReply({ embeds: [autoroleconfig] });
        } catch (error) {
            console.log(`There was an error in /autorole-configure ${error}`)
        }
    }
}