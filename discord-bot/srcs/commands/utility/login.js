const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("login")
    .setDescription("Authenticate with 42Intra"),
  async execute(interaction) {
    const params = new URLSearchParams({ id: interaction.user.id });
    const response = await fetch(`http://server:3000/auth?${params.toString()}`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.API_MASTER_KEY
      },
    });
    if (!response.ok) {
      console.error(response);
      return await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
    const data = await response.json();
    await interaction.reply({
      content: `Login with [42intra](${data.url})`,
      ephemeral: true,
    });
  },
};
