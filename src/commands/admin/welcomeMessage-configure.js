const { ApplicationCommandOptionType, PermissionFlagsBits, Client, Interaction } = require("discord.js");
const Welcome = require('../../schema/welcome');

module.exports = {
    name: 'set-welcome-message',
    description: 'Set welcome message for your server.',
    options: [
        {
            name: 'channel',
            description: 'The channel where you want to set up your welcome message.',
            type: ApplicationCommandOptionType.Channel,
            required: true,
        },
    ],
    permissionsRequired: [PermissionFlagsBits.Administrator],

    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */

    callback: async (client, interaction) => {
        if (!interaction.inGuild) {
            interaction.reply('You can only run this command inside a server');
            return;
        }

        const targetChannelId = interaction.options.get('channel').value;
        try {
            await interaction.deferReply();
            let welcomeCh = await Welcome.findOne({
                guildId: interaction.guild.id,
            });

            if(welcomeCh){
                if (welcomeCh.channelId === targetChannelId) {
                    await interaction.editReply('Welcome Message is already set up for this server.');
                    return;
                }
            }else{
                welcomeCh = new Welcome({
                    guildId: interaction.guild.id,
                    channelId: targetChannelId,
                });
            }
            await welcomeCh.save();
            await interaction.editReply(`Successfully configured`);

        } catch (error) {
            console.log(`There is an error at /set-welcome-message ${error}`)
        }
    }
}