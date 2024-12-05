const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  login: { type: String, required: true },
});

UserSchema.statics.getById = async function (intraUser) {
  const find = await this.findOne({ id: intraUser.id });
  return find
    ? find
    : await User.create({
        id: intraUser.id,
        login: intraUser.login,
      });
};

const User = mongoose.model("User", UserSchema);
module.exports = User;
