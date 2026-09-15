const { cleanCommandText } = require("../utils/CommandUtils");
module.exports = class CommandParser {
  constructor(prefixes) { this.prefixes = [...prefixes].sort((a, b) => b.length - a.length); }
  parse(content) {
    const rawContent = cleanCommandText(content);
    const prefix = this.prefixes.find(value => rawContent.startsWith(value));
    return { rawContent, hasPrefix: Boolean(prefix), command: prefix ? cleanCommandText(rawContent.slice(prefix.length)) : rawContent };
  }
};
