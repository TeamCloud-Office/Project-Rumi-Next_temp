const aliases = new Set(["ping", "핑"]);

module.exports = {
  name: "ping",

  matches(ctx) {
    return ctx.hasPrefix && aliases.has(String(ctx.command ?? "").toLowerCase());
  },

  async execute(ctx) {
    ctx.commandHistoryDescription = "핑 확인";
    await ctx.send("퐁!");
    return true;
  },
};
