const { Router } = require("express");
const multer = require("multer");
const multerConfig = require("../config/multerConfig");

const upload = multer(multerConfig.MULTER);

const usersRoutes = Router();
const UsersController = require("../controllers/UsersController");
const UserAvatarController = require("../controllers/UserAvatarController");

const checkAutentication = require("../middleware/checkAutentication");

const userAvatarController = new UserAvatarController();
const usersController = new UsersController();

usersRoutes.post("/", usersController.create);
usersRoutes.put("/", checkAutentication, usersController.update);
usersRoutes.patch(
  "/",
  checkAutentication,
  upload.single("avatar"),
  userAvatarController.update
);

module.exports = usersRoutes;
