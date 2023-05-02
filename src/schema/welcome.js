const { Schema, model } = require('mongoose');

const WelcomeMsg = new Schema({
    guildId: {
        type: String,
        required: true,
    },
    channelId: {
        type: String,
        required: true,
    },
});

module.exports = model('welcome', WelcomeMsg);