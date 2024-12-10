const { SlashCommandBuilder } = require("discord.js");
const User = require("../../mongo_models/User");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("logout")
    .setDescription("Unlink from 42Intra"),
  async execute(interaction) {
    const me = await User.findOne({ discord_id: interaction.user.id });
    console.log(me);
    if (!me) {
      return await interaction.reply({
        content: `You are not currently logged in.`,
        ephemeral: true,
      });
    }
    me.discord_id = null;
    me.token = null;
    await me.save();
    await interaction.reply({
      content: `Succesfully logged out!`,
      ephemeral: true,
    });
  },
};
