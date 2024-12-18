const mongoose = require("mongoose");

const TeamSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600, // Document expires after 3600 seconds (1 hour)
  },
});

const Team = mongoose.model("Team", TeamSchema);

module.exports = Team;
