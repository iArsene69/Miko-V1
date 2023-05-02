const { Client, GuildMember, AttachmentBuilder } = require("discord.js");
const Welcome = require('../../schema/welcome');
const Canvas = require('canvas');
const Discord = require('discord.js');




/**
 * 
 * @param {Client} client 
 * @param {GuildMember} member
*/

const bg = "https://ibb.co/L0kXthr";

const dim = {
    height: 675,
    width: 1200,
    margin: 50
}

const av = {
    size: 256,
    x: 480,
    y: 170
}


const generateImg = async (member) => {
    
    let username = member.user.username;
    let discriminator = member.user.discriminator;
    let avatarUrl = member.user.displayAvatarURL({
        format: "jpg",
        dynamic: false,
        size: av.size
    });
    const canvas = Canvas.createCanvas(dim.width, dim.height);
    const context = canvas.getContext('2d');

    const backgroundImg = await Canvas.loadImage(bg);
    context.drawImage(backgroundImg, 0, 0);

    context.fillStyle = "rgba(0,0,0,0)"
    context.fillRect(dim.margin, dim.margin, dim.width - 2 * dim.margin, dim.height - 2 * dim.margin);

    const avImg = await Canvas.loadImage(avatarUrl);
    context.save();

    context.beginPath();
    context.arc(av.x + av.size / 2, av.y + av.size / 2, av.size / 2, 0, Math.PI * 2, true);
    context.closePath();
    context.clip();

    context.drawImage(avImg, av.x, av.y);
    context.restore();

    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome.png');
    return attachment;
}


module.exports = async (client, member) => {
    try {
        let guild = member.guild;
        if (!guild) return;

        const welcome = await Welcome.findOne({
            guildId: guild.id
        });
        if (!welcome) return;

        const channel = client.channels.cache.get(welcome.channelId);

        const img = await generateImg(member);



        await channel.send(
            {
                content: `Hello`,
                files: [img],
            },
        );

    } catch (error) {
        console.log(`There was error sending greeting card ${error}`);
    }
}

