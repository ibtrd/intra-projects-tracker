const DiscordGuild = require("./mongo_models/DiscordServer");

async function sendProjectMessages(client, payload) {
  const guilds = await DiscordGuild.find();
  for (team of payload) {
    let message;
    if (team.validated) {
      message = `### :tada: [${team.users.join(" | ")}](${
        team.link
      }) validated \`${team.project}\` with a grade of ${team.grade}!`;
    } else {
      message = `### :boom: [${team.users.join(" | ")}](${
        team.link
      }) failed \`${team.project}\` with a grade of ${team.grade}.`;
    }
    for (const guild of guilds) {
      try {
        await client.channels.cache.get(guild.channel).send(message);
      } catch (err) {}
    }
  }
}

module.exports = { sendProjectMessages };
