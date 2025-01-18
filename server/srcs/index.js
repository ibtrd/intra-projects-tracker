const express = require("express");
var expressWs = require("express-ws");
const app = express();
expressWs(app);

const mongoose = require("mongoose");
const Project = require("./mongo_models/Project");
const cron = require("node-cron");
const { router } = require("./router/router");
const { api42 } = require("./intranet/api42");
const { loadTrackedExams, loadTrackedProjects } = require("./intranet/loadTrackedProjects");
const cors = require('cors');

// Enable CORS for all routes
app.use(cors());

// Configure router
app.use("/", router);

// Connect to mongodb
const mongoURI = `${process.env.MONGO_URL}/${process.env.MONGO_DATABASE}`;
mongoose
  .connect(mongoURI)
  .then(async () => {
    console.log(`Connected to MongoDB: ${mongoURI}`);
    // Starts server
    const port = 3000;
    app.listen(port, () => console.log(`Server is running on port ${port}`));
    if (process.env.API42_DEV == 'development') {
      api42.setDebugMode(true);
      if (!(await Project.find()).length) await loadIntraProjects();
      loadTrackedProjects();
      setInterval(loadTrackedExams, 30 * 1000); // Every 30seconds
      setInterval(loadTrackedProjects, 30 * 1000); // Every 30seconds
    } else {
      cron.schedule('* * * * *', loadTrackedProjects); // Every minute
      cron.schedule('* * * * *', loadTrackedExams); // Every minute
      cron.schedule('42 0 * * 4', loadIntraProjects); // 00:42 AM
    }    
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

async function loadIntraProjects() {
  let projects;
  try {
    // Load all projects from 42cursus
    projects = await api42.fetch(`/v2/cursus/21/projects`, { pageSize: 100 });
    projects = projects.filter((project) => {
      return project.campus.find((c) => c.id == 9);
    });
    for (let project of projects) {
      project = await Project.findOneAndUpdate(
        { id: project.id },
        { name: project.name, exam: project.exam },
        { upsert: true, new: true }
      );
    }
    // Load exams from C Piscine
    projects = await api42.fetch(`/v2/cursus/9/projects`, { pageSize: 100, filter: { exam: 'true' }});
    projects = projects.filter((project) => {
      return project.campus.find((c) => c.id == 9);
    });
    for (let project of projects) {
      project = await Project.findOneAndUpdate(
        { id: project.id },
        { name: project.name, exam: project.exam },
        { upsert: true, new: true }
      );
    }
  } catch (err) {
    console.error(`Failed to load exams: ${err.message}`);
  }
}
