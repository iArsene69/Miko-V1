const { Client, Message } = require('discord.js');
const Level = require('../../schema/level');
const calculateLvXp = require('../../utils/calculateLvXp');
const Cooldown = new Set();

function getRandomXp(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 
 * @param {Client} client 
 * @param {Message} message 
 */

module.exports = async (client, message) => { 
    if(!message.inGuild() || message.author.bot || Cooldown.has(message.author.id)) return;

    const expToGive = getRandomXp(5, 30);

    const query = {
        userId: message.author.id,
        guildId: message.guild.id,
    }

    try {
        const level = await Level.findOne(query);

        if (level) {
            level.exp += expToGive;

            if (level.exp > calculateLvXp(level.level)) {
                level.exp = 0;
                level.level += 1;

                message.channel.send(`${message.member} you have leveled up to **level ${level.level}**.`)
            }

            await level.save().catch((e) => {
                console.log(`Error saving updated level: ${e}`);
                return;
            })

            Cooldown.add(message.author.id);
            setTimeout(() => {
                Cooldown.delete(message.author.id);
            }, 60000);
        }
        
        else{
            const newLevel = new Level({
                userId: message.author.id,
                guildId: message.guild.id,
                exp: expToGive,
            });

            await newLevel.save();
            Cooldown.add(message.author.id);
            setTimeout(() => {
                Cooldown.delete(message.author.id);
            }, 60000);
        }
    } catch (error) {
        console.log(`There was an error giving exp ${error}`);
    }
}