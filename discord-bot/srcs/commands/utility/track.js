const { SlashCommandBuilder, PermissionFlagsBits, InteractionContextType } = require("discord.js");
const DiscordGuild = require("../../mongo_models/DiscordServer");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("track")
    .setDescription("Enable project tracking in this channel")
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
    const currentGuild = await DiscordGuild.findOne({
      id: interaction.guild.id,
    });
    if (currentGuild) {
      return await interaction.reply({
        content: "Project tracking is already enabled for this server.",
        ephemeral: true,
      });
    }
    await DiscordGuild.create({
      id: interaction.guild.id,
      name: interaction.guild.name,
      channel: interaction.channel.id,
    });
    await interaction.reply(
      "Project tracking has been successfully enabled for this channel."
    );
  },
};
