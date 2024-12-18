const Project = require("../mongo_models/Project");
const { dateMinutesAgo } = require("../dates/dateMinutesAgo");
const loadExam = require("./loadExam");
const { wsBroadcastProjects } = require("../websocket/websocket");
const { api42 } = require("./api42");
const { loadTeam } = require("./loadTeam");

const examOptions = {
  filter: { campus: 9 },
  range: {
    updated_at: [
      dateMinutesAgo(60 * 3).toISOString(),
      "2042-01-01T00:00:00.000Z",
    ],
  },
};

async function loadTrackedExams() {
  console.log("Loading exams...");
  const projects = await Project.find({ tracking: true, exam: true });
  try {
    for (const project of projects) {
      await loadExam(project, examOptions);
    }
  } catch (err) {
    console.error(`Failed to load tracked exams: ${err.message}`);
  }
}

async function loadTrackedProjects() {
  console.log("Loading projects...");
  const projects = await Project.find({ tracking: true, exam: false });
  const teams = await api42.fetch("/v2/teams", {
    pageSize: 100,
    filter: {
      primary_campus: 9,
      project_id: projects.map((project) => {
        if (project.tracking === true)
          return project.id;
      }).join(','),
      with_mark: true,
    },
    range: {
      updated_at: [dateMinutesAgo(5).toISOString(), "2042-01-01T00:00:00.000Z"],
    }
  });
  for (const team of teams) {
    await loadTeam(team);
  };
  wsBroadcastProjects();
}

module.exports = { loadTrackedExams, loadTrackedProjects };
