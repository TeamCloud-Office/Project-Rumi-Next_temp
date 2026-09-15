module.exports = class CommandManager {
  constructor() { this.commands = []; }
  register(command) {
    if (!command.name || typeof command.matches !== "function" || typeof command.execute !== "function") {
      throw new TypeError("Invalid command");
    }
    if (this.commands.some(item => item.name === command.name)) throw new Error(`Duplicate command: ${command.name}`);
    this.commands.push(command);
  }
  async execute(ctx) {
    for (const command of this.commands) {
      if (await command.matches(ctx)) { await command.execute(ctx); return true; }
    }
    return false;
  }
};
