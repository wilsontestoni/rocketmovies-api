const Router = require("express");
const usersRouter = Router();

const SessionsController = require("../controllers/SessionsController.js");
const sessionsController = new SessionsController();

usersRouter.post("/", sessionsController.create);

module.exports = usersRouter;
