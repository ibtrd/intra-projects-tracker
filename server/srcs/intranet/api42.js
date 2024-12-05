const { Api42 } = require("@ibertran/api42");

module.exports.api42 = new Api42(
  process.env.API42_UID,
  process.env.API42_SECRET,
  process.env.API42_REDIRECT_URI,
);
