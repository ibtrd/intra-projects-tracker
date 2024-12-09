const mongoose = require("mongoose");

const DiscordGuildSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  channel: { type: String, default: null },
});

const DiscordGuild = mongoose.model("DiscordGuild", DiscordGuildSchema);
module.exports = DiscordGuild;
