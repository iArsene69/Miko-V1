const { PermissionFlagsBits, Client, Interaction } = require("discord.js");
const Welcome = require('../../schema/welcome');

module.exports = {
    name: 'disable-welcome-message',
    description: 'Disable welcome message on your server.',
    permissionsRequired: [PermissionFlagsBits.Administrator],

    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */
    callback: async (client, interaction) => {
        try {
            await interaction.deferReply();
            if(!(await Welcome.exists({ guildId: interaction.guild.id }))){
                await interaction.editReply("You hasn't set up welcome message yet.");
                return;
            }

            await Welcome.findOneAndDelete({ guildId: interaction.guild.id });
            await interaction.editReply(`Welcome message successfully disabled`);
            
        } catch (error) {
            console.log(`You have an error at /disable-welcome-message ${error}`);
        }
    }
}