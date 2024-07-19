const { Router } = require("express");

const usersRoutes = require("./user.routes.js");
const moviesRoutes = require("./movies.routes.js");
const sessionsRoutes = require("./sessions.routes.js");

const routes = Router();

routes.use("/sessions", sessionsRoutes);
routes.use("/users", usersRoutes);
routes.use("/movies", moviesRoutes);

module.exports = routes;
