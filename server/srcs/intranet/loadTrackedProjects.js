const Project = require("../mongo_models/Project");
const { dateMinutesAgo } = require("../dates/dateMinutesAgo");
const loadExam = require("./loadExam");
const loadProject = require("./loadProject");
const { wsBroadcastProjects } = require("../websocket/websocket");

const examOptions = {
  filter: { campus: 9 },
  range: {
    updated_at: [dateMinutesAgo(5).toISOString(), "2042-01-01T00:00:00.000Z"],
  },
};

async function loadTrackedExams() {
  const projects = await Project.find({ tracking: true, exam: true });
  try {
    for (const project of projects) {
      await loadExam(project, examOptions);
    }
  } catch (err) {
    console.error(`Failed to load tracked exams: ${err.message}`);
  }
}

const projectOptions = {
  filter: { campus: 9 },
  range: {
    updated_at: [dateMinutesAgo(5000).toISOString(), "2042-01-01T00:00:00.000Z"],
  },
};

async function loadTrackedProjects() {
  const projects = await Project.find({ tracking: true, exam: false });
  for (const project of projects) {
    try {
      await loadProject(project, projectOptions);
    } catch (err) {
      console.error(`Failed to load tracked projects: ${err}`);
    }
  }
  wsBroadcastProjects();
};

module.exports = { loadTrackedExams, loadTrackedProjects };
