const { api42 } = require("./api42");

module.exports.projectleaderboard = async function (project) {
  const leaderboard = [];
  const options = {
    campus: 9,
  };
  const query = await api42.getProjectProjectUsers(project.id, options);
  for (const entry of query) {
    if (entry.final_mark == null) continue;
    leaderboard.push({
      login: entry.user.login,
      grade: entry.final_mark,
    });
  }
  leaderboard.sort((a, b) => b.grade - a.grade);
  let rank = 1;
  leaderboard.forEach((user) =>
    console.log(
      (rank++).toString().padStart(3, " "),
      user.login.padStart(8, " "),
      user.grade.toString().padStart(3, " "),
    ),
  );
};
