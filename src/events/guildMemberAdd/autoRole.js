const { Client, GuildMember } = require("discord.js");
const AutoRole = require('../../schema/autoRole');

/**
 * 
 * @param {Client} client 
 * @param {GuildMember} members 
 */


module.exports = async (client, members) => {
    try {
        let guild = members.guild;
        if (!guild) return;
        
        const autoRole = await AutoRole.findOne({ guildId: guild.id });
        if(!autoRole) return;

        await members.roles.add(autoRole.roleId);
        
    } catch (error) {
        console.log(`Error giving role ${error}`);
    }
}