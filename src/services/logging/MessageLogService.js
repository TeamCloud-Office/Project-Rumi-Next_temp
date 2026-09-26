module.exports = class MessageLogService {
  constructor(userLogService) { this.userLogService = userLogService; }
  async record(content) { return this.userLogService.logMessage(content); }
};
