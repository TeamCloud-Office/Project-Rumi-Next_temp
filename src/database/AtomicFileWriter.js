const fs = require("node:fs/promises");
const path = require("node:path");

module.exports = class AtomicFileWriter {
  async write(file, data) {
    await fs.mkdir(path.dirname(file), { recursive: true });
    const temporary = `${file}.${process.pid}.${Date.now()}.tmp`;
    try {
      await fs.writeFile(temporary, data);
      await fs.rename(temporary, file);
    } catch (error) {
      await fs.rm(temporary, { force: true }).catch(() => {});
      throw error;
    }
  }
};
