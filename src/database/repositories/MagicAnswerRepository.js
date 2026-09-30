const fs = require("node:fs/promises");
const path = require("node:path");

module.exports = class MagicAnswerRepository {
  constructor({ paths }) { this.file = paths.magicAnswers || path.join(paths.db, "MagicAnswer.json"); }
  async list() {
    try {
      const value = JSON.parse(await fs.readFile(this.file, "utf8"));
      return Array.isArray(value) ? value.map(String).filter(Boolean) : [];
    } catch (error) {
      if (error.code === "ENOENT") return [];
      throw error;
    }
  }
};
