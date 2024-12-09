const DiscordGuild = require("./mongo_models/DiscordServer");

async function sendProjectMessages(client, payload) {
  const guilds = await DiscordGuild.find();
  for (team of payload) {
    const project = team.project.toLowerCase();
    let message;
    if (team.validated) {
      message = `### :tada: [${team.users.join(" | ")}](${
        team.link
      }) validated \`${project}\` with a grade of ${team.grade}!`;
    } else {
      message = `### :boom: [${team.users.join(" ")}](${
        team.link
      }) failed \`${project}\` with a grade of ${team.grade}.`;
    }
    for (const guild of guilds) {
      try {
        await client.channels.cache.get(guild.channel).send(message);
      } catch (err) {}
    }
  }
}

module.exports = { sendProjectMessages };
