const { ApplicationCommandOptionType, PermissionFlagsBits, Client, Interaction } = require("discord.js");

module.exports = {
    /**
     * 
     * @param { Client } client
     * @param { Interaction } interaction
     */

    name: 'kick',
    description: 'Kick users from this server',
    options: [
        {
            name: 'user',
            description: 'The user you wants to kick',
            required: true,
            type: ApplicationCommandOptionType.Mentionable,
        },
        {
            name: 'reason',
            description: 'The reason of kick',
            type: ApplicationCommandOptionType.String,
        },
    ],
    permissionsRequired: [
        PermissionFlagsBits.KickMembers,
    ],
    botPermissions: [
        PermissionFlagsBits.KickMembers,
    ],

    callback: async (client, interaction) => {
        const targetUserId = interaction.options.get('user').value;
        const reason = interaction.options.get('reason')?.value || "No specific reason given.";

        await interaction.deferReply();

        const targetUser = await interaction.guild.members.fetch(targetUserId);

        if (!targetUser) {
            const userNotExist = {
                color: 0xff0404,
                title: `:x: Failed to Kick`,
                description: "User doesn't exist in the server."
            }
            await interaction.editReply({
                embeds: [userNotExist],
            });
            return;
        }

        if (targetUser.id === interaction.guild.ownerId) {
            const userIsOwner = {
                color: 0xff0404,
                title: `:x: Failed to Kick`,
                description: `${targetUser} is the owner of the server.`
            }
            await interaction.editReply({
                embeds: [userIsOwner],
            });
            return;
        }

        const targetUserRolePosition = targetUser.roles.highest.position;
        const requestUserRolePosition = interaction.member.roles.highest.position;
        const botRolePosition = interaction.guild.members.me.roles.highest.position;

        if (targetUserRolePosition >= requestUserRolePosition) {
            const userHasHigherRole = {
                color: 0xff0404,
                title: `:x: Failed to Kick`,
                description: `${targetUser} have the same or higher role position than you.`
            }
            await interaction.editReply({
                embeds: [userHasHigherRole],
            });
            return;
        }

        if (targetUserRolePosition >= botRolePosition) {
            const userHigherThanBot = {
                color: 0xff0404,
                title: `:x: Failed to Kick`,
                description: `${targetUser} have the same or higher role position than me.`
            }
            await interaction.editReply({
                embeds: [userHigherThanBot],
            });
            return;
        }

        try {
            await targetUser.kick({ reason });
            const kicked = {
                color: 0x1fff01,
                title: `:white_check_mark: Successfully kicked`,
                description: `${targetUser} was kicked.\nReason: ${reason}`,
            }
            await interaction.editReply({ embeds: [kicked] });
        } catch (error) {
            console.log(`Oops! there was an error: ${error}`);
        }
    },
}