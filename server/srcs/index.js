const express = require('express');
const app = express();
var expressWs = require('express-ws')(app);

const mongoose = require('mongoose');
const Project = require('./mongo_models/Project');
const cron = require('node-cron');
const { router } = require('./router/router');
const { loadProjectUsers } = require('./intranet/loadProjetsUsers');
const { api42 } = require('./intranet/api42');

// Configure router
app.use("/", router);

// Connect to mongodb
const mongoURI = `${process.env.MONGO_URL}/${process.env.MONGO_DATABASE}`
mongoose.connect(mongoURI).then(async () => {
  console.log(`Connected to MongoDB: ${mongoURI}`);
  // Starts server
  const port = 4000;
  app.listen(port, () => console.log(`Server is running on port ${port}`));
  await loadExams();
  await addAlone();
  await loadProjectUsers();
  cron.schedule('* * * * *', loadProjectUsers); // Every minute
  // cron.schedule('* 9-15 * * 2', loadProjectUsers); //Tuesday Exam
  // cron.schedule('* 13-18 * * 4', loadProjectUsers); //Thursday Exam
})
.catch((err) => {
  console.error("MongoDB connection error:", err);
  process.exit(1);
});

async function loadExams() {
  let exams;
  try {
    exams = await api42.paginatedFetchEndpoint(`/v2/cursus/21/projects?filter[exam]=yes`);
    exams = exams.filter(exam => {
      return exam.campus.find(c => c.id == 9)
    });
    for (let exam of exams) {
      exam = await Project.findOneAndUpdate(
        { id: exam.id }, 
        { name: exam.name },
        { upsert: true, new: true }
        );
    }
  } catch (err) {
    console.error(`Failed to load exams: ${err}`);
  }
}

async function addAlone() {
	return await Project.findOneAndUpdate(
		{ id: 2310 }, 
		{ name: "Alone in the Dark" },
		{ upsert: true, new: true }
	  );
}
