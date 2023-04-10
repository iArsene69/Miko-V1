module.exports = {
    name: 'ping',
    description: 'Pong!',
    //devOnly: ,
    //testOnly: ,
    //options: ,

    callback: (client, interaction) => {
        interaction.reply(`Pong! ${client.ws.ping}ms`);
    },
}