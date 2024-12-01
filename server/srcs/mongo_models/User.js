const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    login: { type: String, required: true }
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
