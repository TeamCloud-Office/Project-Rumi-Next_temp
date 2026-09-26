const { pick } = require("../../utils/random");
module.exports = class MagicAnswerService {
  constructor(repository) { this.repository = repository; }
  async answer() { return pick(await this.repository.list()) || "답변을 찾을 수 없어요."; }
};
