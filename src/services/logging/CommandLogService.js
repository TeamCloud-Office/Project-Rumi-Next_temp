module.exports = class CommandLogService {
  constructor(userLogService) { this.userLogService = userLogService; }
  async record(description, responses) { return this.userLogService.logCommand(description, responses); }
  async format() { return this.userLogService.commandHistoryText(); }
};
