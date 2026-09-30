const {
  isAdmin
} = require("./_helpers");
module.exports = {
  name: "eval",
  matches: async ctx => ctx.config.enableEval && ctx.hasPrefix && ctx.command.startsWith("eval ") && await isAdmin(ctx),
  async execute(ctx) {
    await ctx.send(`Project-Rumi-Next\n${eval(ctx.command.slice(5))}`);
    return true;
  }
};