require("express-async-errors");
const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const AppError = require("./utils/AppError");
const multerConfig = require("./config/multerConfig");

const app = express();
app.use(express.json());
app.use(cors());

app.use("/files", express.static(multerConfig.UPLOAD_FOLDER));
app.use(routes);

app.use((error, req, res, next) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      status: "error",
      message: error.message,
    });
  }

  console.error(error);

  return res.status(500).json({
    status: "error",
    message: "Erro interno no servidor",
  });
});

const PORT = 3333;

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
