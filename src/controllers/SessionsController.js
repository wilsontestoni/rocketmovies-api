const knex = require("../database/knex");
const { compare } = require("bcryptjs");
const AppError = require("../utils/AppError.js");
const { sign } = require("jsonwebtoken");
const authConfig = require("../config/auth.js");

class SessionsController {
  async create(req, res) {
    const { email, password } = req.body;

    if (!email)
      throw new AppError("É preciso informar o email para logar na plataforma");
    if (!password)
      throw new AppError("É preciso informar a senha para logar na plataforma");

    const user = await knex("users").where({ email }).first();
    if (!user) throw new AppError("Usuário não existe");

    const passwordMatched = await compare(password, user.password);
    if (!passwordMatched)
      throw new AppError("Senha incorreta, tente novamente");

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({}, secret, {
      subject: String(user.id),
      expiresIn,
    });

    res.json({ user, token });
  }
}

module.exports = SessionsController;
