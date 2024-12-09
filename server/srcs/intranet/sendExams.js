const Project = require("../mongo_models/Project");

async function sendExams(req, res) {
    const exams = await Project.find({ exam: true });
    if (exams) {
        return res.send(exams.map(exam => {
            return {
                name: exam.name,
                id: exam.id,
            }
        }));
    }
    res.sendStatus(400);
}

module.exports = { sendExams };