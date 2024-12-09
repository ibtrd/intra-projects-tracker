const { SlashCommandBuilder, PermissionFlagsBits, InteractionContextType } = require("discord.js");
const DiscordGuild = require("../../mongo_models/DiscordServer");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("untrack")
    .setDescription("Disable project tracking for this server")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .setContexts(InteractionContextType.Guild),
  async execute(interaction) {
    if (
      !interaction.member
        .permissionsIn(interaction.channel)
        .has(PermissionFlagsBits.ManageChannels)
    ) {
      return await interaction.reply({
        content: "You do not have permission to manage this channel.",
        ephemeral: true,
      });
    }
    const guild = await DiscordGuild.findOne({ id: interaction.guild.id });
    if (!guild) {
      return await await interaction.reply({
        content: "No project tracking is currently enabled on this server.",
        ephemeral: true,
      });
    }
    const deletion = await guild.deleteOne();
    if (deletion.acknowledged === true && deletion.deletedCount === 1)
      await interaction.reply(
        `Project tracking has been successfully disabled for this server.`
      );
    else
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
  },
};
