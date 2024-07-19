const { Router } = require("express");
const MoviesController = require("../controllers/MoviesController");
const moviesRoutes = Router();

const checkAutentication = require("../middleware/checkAutentication");

moviesRoutes.use(checkAutentication);

const moviesController = new MoviesController();

moviesRoutes.get("/", moviesController.index);
moviesRoutes.get("/:id", moviesController.show);
moviesRoutes.post("/", moviesController.create);
moviesRoutes.delete("/:id", moviesController.delete);
moviesRoutes.put("/:movie_id", moviesController.update);

module.exports = moviesRoutes;
