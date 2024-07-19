const DiskStorage = require("../provider/diskStorage");
const AppError = require("../utils/AppError");
const knex = require("../database/knex");

const diskStorage = new DiskStorage();

class UserAvatarController {
  async update(req, res) {
    const file = req.file.filename;
    const user_id = req.user.id;

    const user = await knex("users").where({ id: user_id }).first();

    if (!user) {
      throw new AppError(
        "Apenas usuários autenticados podem mudar o avatar",
        401
      );
    }

    if (user.avatar) {
      await diskStorage.deleteFile(user.file);
    }

    const filename = await diskStorage.saveFile(file);
    user.avatar = filename;

    await knex("users").update(user).where({ id: user_id });

    return res.json(user);
  }
}

module.exports = UserAvatarController;
