const fs = require("fs");
const path = require("path");
const multerConfig = require("../config/multerConfig");

class DiskStorage {
  async saveFile(file) {
    await fs.promises.rename(
      path.resolve(multerConfig.TMP_FOLDER, file),
      path.resolve(multerConfig.UPLOAD_FOLDER, file)
    );

    return file;
  }

  async deleteFile(file) {
    const filePath = path.resolve(multerConfig.UPLOAD_FOLDER, file);

    console.log(filePath)

    try {
      await fs.promises.stat(file.path);
    } catch (error) {
      console.error(error);
      return;
    }

    await fs.promises.unlink(filePath);
  }
}

module.exports = DiskStorage;
