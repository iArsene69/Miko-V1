const { ApplicationCommandOptionType, Client, Interaction } = require("discord.js");
const User = require('../../schema/user');

module.exports = {
    name: 'wallet',
    description: "Check your or someone else's balance.",
    options: [
        {
            name: 'user',
            description: 'The user you want to check',
            type: ApplicationCommandOptionType.User,
        }
    ],

    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */

    callback: async (client, interaction) => {
        if (!interaction.inGuild) {
            await interaction.reply({
                content: 'This command can only be used inside a server.',
                ephemeral: true,
            });
            return;
        }

        const targetUserId = interaction.options.get('user')?.value || interaction.member.id;

        await interaction.deferReply();

        const user = await User.findOne({ userId: targetUserId, guildId: interaction.guild.id });

        if(!user){
            await interaction.editReply(`${targetUserId} doesn't have profile yet.`);
            return;
        }

        await interaction.editReply(
            targetUserId === interaction.member.id
            ? `Your balance is **${user.balance} Mikoins**`
            : `<@${targetUserId}>'s balance is **${user.balance} Mikoins**`
        );


    }
}