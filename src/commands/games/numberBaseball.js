module.exports = {
  name: "numberBaseball",
  matches: ctx => (ctx.hasPrefix && /^(?:숫자\s*야구)(?:\s+(?:시작|시작해줘|끝|끝내줘|종료))?$/.test(ctx.command)) || (/^\d{3}$/.test(ctx.rawContent) && ctx.numberBaseball.isPlaying()),
  async execute(ctx) {
    if (!(await ctx.channelService.isRented()) || !(await ctx.channelService.featureEnabled("numGame"))) return true;
    const result = /^\d{3}$/.test(ctx.rawContent) ? ctx.numberBaseball.guess(ctx.rawContent) : /(?:끝|끝내줘|종료)$/.test(ctx.command) ? ctx.numberBaseball.end() : ctx.numberBaseball.start();
    if (result) await ctx.send(result);
    return Boolean(result);
  },
};
