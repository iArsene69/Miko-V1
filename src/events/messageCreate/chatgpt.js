require('dotenv').config();
const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
    apiKey: process.env.GPT_API_KEY,
});
const openai = new OpenAIApi(configuration);

module.exports = async (client, message) => {
    if(message.author.bot) return;
    if(message.channel.id !== process.env.CHANNEL_ID) return;
    if(message.content.startsWith('$')) return; 

    let conversationLog = [{ role: 'system', content: 'You are a cute chatbot.' }];

    try {
        await message.channel.sendTyping();
    
        let prevMsg = await message.channel.messages.fetch({ limit: 7 });
        prevMsg.reverse();
    
        prevMsg.forEach((msg) => {
            if(message.content.startsWith('$')) return;
            if(msg.author.id !== client.user.id && message.author.bot) return;
            if(msg.author.id !== message.author.id) return;
    
            conversationLog.push({
                role: 'user',
                content: msg.content,
            });
        });
    
        const result = await openai.createChatCompletion({
            model: 'text-davinci-002',
            prompt: conversationLog,
            max_tokens: 128,
            n: 1,
            stop: ['\n', ' Human:'],
        });
    
        if(result && result.data && result.data.choices && result.data.choices.length > 0) {
            message.reply(result.data.choices[0].text);
        } else {
            console.log('OpenAI API response is invalid:', result);
        }
    
    } catch (error) {
        console.log(`You have an error with your chatgpt ERR: ${error}`);
    }
    
}