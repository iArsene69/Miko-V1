const { ApplicationCommandOptionType, PermissionFlagsBits, Client, Interaction } = require("discord.js");

module.exports = {
    /**
     * 
     * @param { Client } client
     * @param { Interaction } interaction
     */

    name: 'kick',
    description: 'Kick users from this server',
    devOnly: true,
    //testOnly: true,
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
        const reason = interaction.options.get('reason')?.value || "No specific reason (it's probably personal lol).";

        await interaction.deferReply();

        const targetUser = await interaction.guild.members.fetch(targetUserId);

        if (!targetUser) {
            await interaction.editReply("User is not exist in the server.");
            return;
        }

        if (targetUser.id === interaction.guild.ownerId) {
            await interaction.editReply("Bro... you serious? the user you want to kick is literally the one above all in this server..");
            return;
        }

        const targetUserRolePosition = targetUser.roles.highest.position;
        const requestUserRolePosition = interaction.member.roles.highest.position;
        const botRolePosition = interaction.guild.members.me.roles.highest.position;

        if (targetUserRolePosition >= requestUserRolePosition) {
            await interaction.editReply("Failed to kick. The user you try to kick have the same or higher role position than you.");
            return;
        }

        if (targetUserRolePosition >= botRolePosition) {
            await interaction.editReply("Failed to kick. The user you try to kick have the same or higher role position than me.");
            return;
        }

        try {
            await targetUser.kick({ reason });
            await interaction.editReply(`User ${targetUser} was kicked\nReason: ${reason}`);
        } catch (error) {
            console.log(`Oops! there was an error: ${error}`);
        }
    },
}