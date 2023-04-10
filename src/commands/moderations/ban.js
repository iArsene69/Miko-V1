const { ApplicationCommandOptionType, PermissionFlagsBits } = require("discord.js");

module.exports = {
    name: 'ban',
    description: 'Ban users from this server',
    devOnly: true,
    //testOnly: ,
    options: [
        {
            name: 'user',
            description: 'The user you wants to ban',
            require: true,
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

    callback: (client, interaction) => {
        interaction.reply(`Ban...`);
    },
}