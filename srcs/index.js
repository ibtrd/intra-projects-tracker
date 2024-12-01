const express = require('express');
const mongoose = require('mongoose');
const Project = require('./mongo_models/Project');
const router = require('./router/router');

const app = express();

// Configure router
app.use("/", router);

// Connect to mongodb
mongoose.connect(process.env.MONGO_URI).then(async () => {
  console.log(`Connected to MongoDB: ${process.env.MONGO_URI}`);
  // Starts server
  const port = 4000;
  app.listen(port, () => console.log(`Server is running on port ${port}`));
  const alone = await addAlone();
})
.catch((err) => {
  console.error("MongoDB connection error:", err);
  process.exit(1);
});

async function addAlone() {
	return await Project.findOneAndUpdate(
		{ id: 2310 }, 
		{ name: "Alone in the Dark" },
		{ upsert: true, new: true }
	  );
}
