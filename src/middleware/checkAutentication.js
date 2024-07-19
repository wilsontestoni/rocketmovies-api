const { verify } = require("jsonwebtoken");
const AppError = require("../utils/AppError.js");
const auth = require("../config/auth");

function checkAutentication(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) throw new AppError("Token não informado", 401);

  const [, token] = authHeader.split(" ");

  try {
    const validToken = verify(token, auth.jwt.secret);

    req.user = {
      id: Number(validToken.sub),
    };

    console.log(req.user);

    return next();
  } catch {
    throw new AppError("Sessão expirada! faça o login novamente", 401);
  }
}

module.exports = checkAutentication;
