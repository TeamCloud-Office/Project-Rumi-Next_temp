const UserLogService = require("./UserLogService");
module.exports = class MemberHistoryService {
  constructor(dependencies) { this.log = new UserLogService(dependencies); }
  async record(type) { return this.log.recordMemberEvent(type); }
  async summary() { return this.log.summary(); }
};
