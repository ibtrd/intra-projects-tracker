const { SlashCommandBuilder } = require('discord.js');
const User = require('../../mongo_models/User');

module.exports = {
    data: new SlashCommandBuilder()
	    .setName('ping')
	    .setDescription('Replies with Pong!'),
    async execute(interaction) {
        const me = await User.findOne({ discord_id: interaction.user.id });
        if (me) {
            return await interaction.reply(`Pong!\nlogged in as \`${me.login}\``);
        }
        await interaction.reply('Pong!');
    },
};
