const moment = require("moment");
const { hash, compare } = require("bcryptjs");
const AppError = require("../utils/AppError.js");
const knex = require("../database/knex");

class UsersController {
  async create(req, res) {
    const { name, email, password } = req.body;

    if (!name) {
      throw new AppError("É preciso informar o nome para cadastro");
    }
    if (!email) {
      throw new AppError("É preciso informar o email para cadastro");
    }
    if (!password) {
      throw new AppError("É preciso informar a senha para cadastro");
    }

    const emailExists = await knex("users").where({ email }).first();

    if (emailExists) {
      throw new AppError("E-mail já está cadastrado na plataforma");
    }

    const hashedPassword = await hash(password, 8);

    const momentOfCreation = moment().format("YYYY-MM-DD HH:mm:ss");

    await knex("users").insert({
      name,
      email,
      password: hashedPassword,
      created_at: momentOfCreation,
    });

    return res.status(201).json();
  }

  async update(req, res) {
    const { name, email, old_password, password } = req.body;
    const user_id = req.user.id;

    const user = await knex("users").where({ id: user_id }).first();

    if (!user) throw new AppError("Usuário não existe no sistema");

    if (email) {
      const otherUserWithTheNewEmail = await knex("users")
        .where({ email })
        .first();

      if (otherUserWithTheNewEmail && otherUserWithTheNewEmail.id !== user_id) {
        throw new AppError("Este e-mail já está sendo usado");
      }
    }

    user.name = name ?? user.name;
    user.email = email ?? user.email;

    if (password && !old_password) {
      throw new AppError(
        "É preciso informar a senha antiga para realizar a mudança de senha!"
      );
    }

    if (password && old_password) {
      const checkOldPassword = await compare(old_password, user.password);

      if (!checkOldPassword) {
        throw new AppError("A senha antiga não confere");
      }

      user.password = await hash(password, 8);
    }

    const momentOfAtualization = moment().format("YYYY-MM-DD HH:mm:ss");

    await knex("users").where({ id: user_id }).update({
      name: user.name,
      email: user.email,
      password: user.password,
      updated_at: momentOfAtualization,
    });

    res.json();
  }
}

module.exports = UsersController;
