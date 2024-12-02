const express = require("express");
const projectsRouter = require("./projectsRouter");
const ongoingRouter = require("./ongoingRouter");
const router = express.Router();

router.use('/projects', projectsRouter);
router.use('/ongoing', ongoingRouter);

router.use('/', (req, res) => res.sendStatus(404));

module.exports = router;
