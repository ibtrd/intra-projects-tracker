const express = require("express");
const projectsRouter = require("./projectsRouter");
const ongoingRouter = require("./ongoingRouter");
const examsRouter = require("./examsRouter.js");
const authRouter = require("./authRouter.js");
const router = express.Router();

router.use("/auth", authRouter)
router.use("/projects", projectsRouter);
router.use("/exams", examsRouter);
router.use("/ongoing", ongoingRouter);

router.use("/", (req, res) => res.sendStatus(404));

module.exports = { router };
