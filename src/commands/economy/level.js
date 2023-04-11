const { ApplicationCommandOptionType, Client, Interaction, AttachmentBuilder } = require("discord.js");
const canvacord = require('canvacord');
const Level = require('../../schema/level');
const calculateLvXp = require('../../utils/calculateLvXp');


module.exports = {

    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */

    callback: async (client, interaction) => {
        if (!interaction.inGuild()) {
            interaction.reply(`You can only use this command at a server.`);
            return;
        }
        await interaction.deferReply();
        const mentionUserId = interaction.options.get('user')?.value;
        const targetUserId = mentionUserId || interaction.member.id;
        const targetUserObj = await interaction.guild.members.fetch(targetUserId);

        const fetchedLevel = await Level.findOne({
            userId: targetUserId,
            guildId: interaction.guild.id,
        });

        if (!fetchedLevel) {
            interaction.editReply(
                mentionUserId ? `${targetUserObj.user.tag} doesn't have any level yet. Try again when they chat a little more.` : `You don't have level yet. Chat a little more and try again.`
            );
            return;
        }

        let allLevels = await Level.find({ guildId: interaction.guild.id }).select('-_id userId level exp');

        allLevels.sort((a, b) => {
            if (a.level === b.level) {
                return b.exp - a.exp;
            } else {
                return b.level - a.level;
            }
        });

        let currentRank = allLevels.findIndex((lvl) => lvl.userId === targetUserId) + 1;

        const rank = new canvacord.Rank()
        .setAvatar(targetUserObj.user.displayAvatarURL( {size: 256} ))
        .setRank(currentRank)
        .setLevel(fetchedLevel.level)
        .setCurrentXP(fetchedLevel.exp)
        .setRequiredXP(calculateLvXp(fetchedLevel.level))
        .setStatus(targetUserObj.presence.status)
        .setProgressBar([
            '#ff0404',
            '#8e00fd'
        ], 'GRADIENT')
        .setUsername(targetUserObj.user.username)
        .setDiscriminator(targetUserObj.user.discriminator);

        const data = await rank.build();
        const attachment = new AttachmentBuilder(data);

        await interaction.editReply({ files: [attachment] });

    },
    name: 'level',
    description: "Shows your or someone's level",
    options: [
        {
            name: 'user',
            description: 'User you want to check the level',
            type: ApplicationCommandOptionType.Mentionable,
        }
    ],


}