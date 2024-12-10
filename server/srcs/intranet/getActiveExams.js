const ActiveExam = require("../mongo_models/ActiveExam");

async function getActiveExams(project) {
    const teams = await ActiveExam.find();
    const results = await Promise.all(
        teams.map(async team => {
        await team.populate('user');
        if (team.project._id.equals(project._id)) {
            return {
                login: team.user.login,
                grade: team.grade,
            }
        }
        return null;
    }));
    return results.filter(result => result !== null);
}

module.exports = { getActiveExams };
