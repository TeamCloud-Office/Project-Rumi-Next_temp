const { cleanCommandText } = require("../utils/CommandUtils");
module.exports = class CommandParser {
  constructor(prefixes) { this.prefixes = [...prefixes].sort((a, b) => b.length - a.length); }
  parse(content) {
    const originalContent = String(content ?? "").trim();
    const rawContent = cleanCommandText(originalContent);
    const prefix = this.prefixes.find(value => rawContent.startsWith(value));
    const originalPrefix = this.prefixes.find(value => originalContent.startsWith(value));
    return { originalContent, rawContent, rawCommand: originalPrefix ? originalContent.slice(originalPrefix.length).trim() : originalContent, hasPrefix: Boolean(prefix), command: prefix ? cleanCommandText(rawContent.slice(prefix.length)) : rawContent };
  }
};
