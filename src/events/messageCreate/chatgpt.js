require('dotenv').config();
const { Client, Message } = require('discord.js');
const { Configuration, OpenAIApi } = require('openai');


const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
    organization: 'org-7LhkrEK9MaYkhB64vM1qLKep',
});
const openai = new OpenAIApi(configuration);
const response = openai.listEngines();


/**
 * 
 * @param {Client} client 
 * @param {Message} message 
 * @returns 
 */

module.exports = async (client, message) => {
    if (message.author.bot) return;
    if (message.channel.id !== process.env.CHANNEL_ID) return;
    if (message.content.startsWith('$')) return;

    let conversationLog = [{ role: 'system', content: 'You are a cute chatbot.' }];

    try {
        await message.channel.sendTyping();

        let prevMsg = await message.channel.messages.fetch({ limit: 15 });
        prevMsg.reverse();

        prevMsg.forEach((msg) => {
            if (message.content.startsWith('$')) return;
            if (msg.author.id !== client.user.id && message.author.bot) return;
            if (msg.author.id !== message.author.id) return;

            conversationLog.push({
                role: 'user',
                content: msg.content,
            });
        });

        const result = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages: conversationLog,
            // max_tokens: 4096,
            // n: 1,
            // stop: ['\n', ' Human:'],
        })
            .catch((e) => {
                console.log(`ERR: ${e}`);
            });


        message.reply(result.data.choices[0].message);

    } catch (error) {
        console.log(`You have an error with your chatgpt ERR: ${error}`);
        message.reply(`ChatGPT is currently unavailable, please come back later.`);
    }

}