const { Client, Interaction } = require("discord.js");
const User = require('../../schema/user');

function getRandomMikoin(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const dailyAmount = getRandomMikoin(420, 690);

module.exports = {
    name: 'daily',
    description: 'Collect your daily',

    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */
    

    callback: async (client, interaction) => {
        if (!interaction.inGuild()) {
            interaction.reply({
                content: 'You can only run this command in server.',
                ephemeral: true,
            });
            return;
        }

        try {
            await interaction.deferReply();

            const query = {
                userId: interaction.member.id,
                guildId: interaction.guild.id,
            }

            let user = await User.findOne(query);

            if (user) {
                const lastDailyDate = user.lastDaily.toDateString();
                const currentDate = new Date().toDateString();

                if (lastDailyDate === currentDate) {
                    await interaction.editReply(`You have claimed your daily today.\nPlease come back tomorrow.`);
                    return;
                }

                user.lastDaily = new Date();
            }else{
                user = new User({
                    ...query,
                    lastDaily: new Date(),
                });
            }

            user.balance += dailyAmount;
            await user.save();

            await interaction.editReply(
                `:coin: ${dailyAmount} Mikoin was added to your balance and your current balance is ${user.balance} Mikoin.`
            );
        } catch (error) {
            `There was error in daily ${error}`
        }
    }
}