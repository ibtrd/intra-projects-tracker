const express = require("express");
const projectsRouter = require("./projectsRouter");
const ongoingRouter = require("./ongoingRouter");
const examsRouter = require("./examsRouter.js");
const authRouter = require("./authRouter.js");
const router = express.Router();

router.use("/auth", authRouter);
router.use("/projects", projectsRouter);
router.use("/exams", examsRouter);
router.use("/ongoing", ongoingRouter);

// const { wsAddtoPayload, wsBroadcastExam } = require("../websocket/websocket.js");

// router.get("/begin/:login", (req, res) => {
//   wsAddtoPayload(1320, {
//     type: "begin",
//     login: req.params.login,
//     grade: 0,
//     closed_at: null,
//   });
//   wsBroadcastExam(1320);
//   res.send("OK!");
// });

// router.get("/update/:login/:grade", (req, res) => {
//   wsAddtoPayload(1320, {
//     type: "update",
//     login: req.params.login,
//     grade: req.params.grade,
//     closed_at: null,
//   });
//   wsBroadcastExam(1320);
//   res.send("OK!");
// });

// router.get("/end/:login/:grade", (req, res) => {
//   wsAddtoPayload(1320, {
//     type: "end",
//     login: req.params.login,
//     grade: req.params.grade,
//     closed_at: Date.now(),
//   });
//   wsBroadcastExam(1320);
//   res.send("OK!");
// });

router.use("/", (req, res) => res.sendStatus(404));

module.exports = { router };
