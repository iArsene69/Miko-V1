const { Client, GuildMember, AttachmentBuilder } = require("discord.js");
const Welcome = require("../../schema/welcome");
const { drawCard, LinearGradient } = require("discord-welcome-card");

/**
 *
 * @param {Client} client
 * @param {GuildMember} member
 */

// const bg = "https://ibb.co/L0kXthr";

// const dim = {
//     height: 675,
//     width: 1200,
//     margin: 50
// }

// const av = {
//     size: 256,
//     x: 480,
//     y: 170
// }

// const generateImg = async (member) => {

//     let username = member.user.username;
//     let discriminator = member.user.discriminator;
//     let avatarUrl = member.user.displayAvatarURL({
//         format: "png",
//         dynamic: false,
//         size: av.size
//     });
//     const canvas = Canvas.createCanvas(dim.width, dim.height);
//     const context = canvas.getContext('2d');

//     const backgroundImg = await Canvas.loadImage(bg);
//     context.drawImage(backgroundImg, 0, 0);

//     context.fillStyle = "rgba(0,0,0,0)"
//     context.fillRect(dim.margin, dim.margin, dim.width - 2 * dim.margin, dim.height - 2 * dim.margin);

//     const avImg = await Canvas.loadImage(avatarUrl);
//     context.save();

//     context.beginPath();
//     context.arc(av.x + av.size / 2, av.y + av.size / 2, av.size / 2, 0, Math.PI * 2, true);
//     context.closePath();
//     context.clip();

//     context.drawImage(avImg, av.x, av.y);
//     context.restore();

//     const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome.png');
//     return attachment;
// }

module.exports = async (client, member) => {
  try {
    const welcomeCard = await drawCard({
      theme: "dark",
      text: {
        title: `Welcome to ${member.guild.name}`,
        text: member.user.tag,
        subtitle: "Please read and follow the rules",
        color: `#88f`,
      },
      avatar: {
        image: member.user.displayAvatarURL({ extension: "png" }),
        outlineWidth: 6,
        outlineColor: new LinearGradient([0, "#33f"], [1, "#f33"]),
      },
      blur: 2,
      border: true,
      rounded: true,
    });

    let guild = member.guild;
    if (!guild) return;

    const welcome = await Welcome.findOne({
      guildId: guild.id,
    });
    if (!welcome) return;

    const channel = client.channels.cache.get(welcome.channelId);

    await channel.send({
      content: `Welcome ${member.user.username}`,
      files: [welcomeCard],
    });
  } catch (error) {
    console.log(`There was error sending greeting card ${error}`);
  }
};
