const express = require("express");
const { api42 } = require("../intranet/api42");
const authRouter = express.Router();
const crypto = require("crypto");
const User = require("../mongo_models/User");

let pending = [];

authRouter.post("/", (req, res) => {
  const { id } = req.query;
  const state = crypto.randomBytes(16).toString("hex");
  pending.push({ id, state, expire_at: new Date(Date.now() + 5 * 60 * 1000) });
  res.json({ success: true, url: `${api42.getOAuthUrl()}&state=${state}` });
});

authRouter.get("/callback/", async function (req, res) {
  const { code, state } = req.query;
  try {
    const token = await api42.generateUserToken(code);
    var attempt;
    pending = pending.filter((current) => {
      if (Date.now() >= current.expire_at) {
        return false;
      } else if (current.state === state) {
        attempt = current;
        return false;
      }
      return true;
    });
    if (!attempt) {
      return res.status(400).send("Authentification timeout, please try again");
    }
    const me = await api42.whoAmI(token);
    const user = await User.findOneAndUpdate(
      { id: me.id },
      { login: me.login, discord_id: attempt.id, token: token }
    );
    res.send(`Succesfully loged in as ${user.login}.`);
  } catch (err) {
    console.log(err);
    res.status(400).send("Authentification failure");
  }
});

module.exports = authRouter;
