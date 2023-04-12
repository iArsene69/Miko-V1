const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const ms = require('ms');

module.exports = {
    /**
     * 
     * @param {Client} client
     * @param {Interaction} interaction
     */

    name: 'timeout',
    description: 'Timeout a user.',
    options: [
        {
            name: 'user',
            description: 'User you want to timeout.',
            type: ApplicationCommandOptionType.Mentionable,
            required: true,
        },
        {
            name: 'duration',
            description: 'Duration of timeout (5s, 10m, 2h, 3d, etc. | Min: 5s | Max: 28d)',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: 'reason',
            description: 'Reason of timeout.',
            type: ApplicationCommandOptionType.String,
        },
    ],
    permissionsRequired: [PermissionFlagsBits.MuteMembers],
    botPermissions: [PermissionFlagsBits.MuteMembers],

    callback: async (client, interaction) => {
        const mentionable = interaction.options.get('user').value;
        const duration = interaction.options.get('duration').value;
        const reason = interaction.options.get('reason')?.value || "No specific reason.";

        await interaction.deferReply();

        const targetUser = await interaction.guild.members.fetch(mentionable);
        if (!targetUser) {
            const userNotExist = {
                color: 0xff0404,
                title: `:x: Failed to Timeout`,
                description: "User doesn't exist in the server."
            }
            await interaction.editReply({
                embeds: [userNotExist],
            });
            return;
        }

        if (targetUser.user.bot) {
            const userIsBot = {
                color: 0xff0404,
                title: `:x: Failed to Timeout`,
                description: "I can't timeout a bot."
            }
            await interaction.editReply({
                embeds: [userIsBot],
            });
            return;
        }

        const msDuration = ms(duration);
        if (isNaN(msDuration)) {
            const durationInvalid = {
                color: 0xebeb15,
                title: `:warning: Cannot set timeout duration`,
                description: `Please provide a valid timeout duration.`,
            }
            await interaction.editReply({ embeds: [durationInvalid] });
            return;
        }

        if (msDuration < 5000 || msDuration > 2.419e+9) {
            const durationLimit = {
                color: 0xebeb15,
                title: `:warning: Cannot set timeout duration`,
                description: `Timeout duration can't be less than 5 seconds or more than 28 days.`,
            }
            await interaction.editReply({ embeds: [durationLimit] });
            return;
        }

        if (targetUser.id === interaction.guild.ownerId) {
            const userIsOwner = {
                color: 0xff0404,
                title: `:x: Failed to Timeout`,
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
                title: `:x: Failed to Timeout`,
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
                title: `:x: Failed to Timeout`,
                description: `${targetUser} have the same or higher role position than me.`
            }
            await interaction.editReply({
                embeds: [userHigherThanBot],
            });
            return;
        }

        try {
            const { default: prettyMs } = await import('pretty-ms');

            
            if (targetUser.isCommunicationDisabled()) {
                await targetUser.timeout(msDuration, reason);
                const timeoutUpdated = {
                    color: 0x1fff01,
                    title: `:white_check_mark: Successfully timed out`,
                    description: `${targetUser}'s timeout duration has been updated to **${prettyMs(msDuration, {verbose: true})}**\nReason: ${reason}`,
                }
                await interaction.editReply({ embeds: [timeoutUpdated] });
                return;
            }
            
            await targetUser.timeout(msDuration, reason);
            const timeout = {
                color: 0x1fff01,
                title: `:white_check_mark: Successfully timed out`,
                description: `${targetUser} was timed out for **${prettyMs(msDuration, {verbose: true})}**\nReason: ${reason}`,
            }
            await interaction.editReply({ embeds: [timeout] });
            
        } catch (error) {
            console.log(`Oops! you have an error: ${error}`);
        }
    },
}