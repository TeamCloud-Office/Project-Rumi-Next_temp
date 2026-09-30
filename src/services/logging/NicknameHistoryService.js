const UserLogService = require("./UserLogService");
module.exports = class NicknameHistoryService {
  constructor(dependencies) { this.log = new UserLogService(dependencies); }
  async record(name) { return this.log.recordNickname(name); }
  async format() { return this.log.nicknameHistoryText(); }
};
