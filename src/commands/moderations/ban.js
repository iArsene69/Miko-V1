const { ApplicationCommandOptionType, PermissionFlagsBits, Client, Interaction } = require("discord.js");

module.exports = {
    /**
     * 
     * @param { Client } client
     * @param { Interaction } interaction
     */

    name: 'ban',
    description: 'Ban users from this server',
    devOnly: true,
    //testOnly: true,
    options: [
        {
            name: 'user',
            description: 'The user you wants to ban',
            required: true,
            type: ApplicationCommandOptionType.Mentionable,
        },
        {
            name: 'reason',
            description: 'The reason of banning',
            type: ApplicationCommandOptionType.String,
        },
    ],
    permissionsRequired: [
        PermissionFlagsBits.Administrator,
    ],
    botPermissions: [
        PermissionFlagsBits.Administrator,
    ],

    callback: async (client, interaction) => {
        const targetUserId = interaction.options.get('user').value;
        const reason = interaction.options.get('reason')?.value || "No specific reason given.";

        await interaction.deferReply();

        const targetUser = await interaction.guild.members.fetch(targetUserId);

        if (!targetUser) {
            const userNotExist = {
                color: 0xff0404,
                title: `:x: Failed to Ban`,
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
                title: `:x: Failed to Ban`,
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
                title: `:x: Failed to Ban`,
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
                title: `:x: Failed to Ban`,
                description: `${targetUser} have the same or higher role position than me.`
            }
            await interaction.editReply({
                embeds: [userHigherThanBot],
            });
            return;
        }

        try {
            await targetUser.ban({ reason });
            const banned = {
                color: 0x1fff01,
                title: `:white_check_mark: Successfully banned.`,
                description: `${targetUser} was banned.\nReason: ${reason}`,
            }
            await interaction.editReply({ embeds: [banned] });
        } catch (error) {
            console.log(`Oops! there was an error: ${error}`);
        }
    },
}