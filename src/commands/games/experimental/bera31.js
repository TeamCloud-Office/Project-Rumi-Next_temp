const pattern = /^베라\s*31\s*(참가|참여|나가기|탈퇴|시작|랭킹|순위)$/;
module.exports = {
  name: "bera31", matches: ctx => (ctx.hasPrefix && pattern.test(ctx.command)) || (/^\d{1,2}$/.test(ctx.rawContent) && ctx.bera.isPlaying()),
  async execute(ctx) {
    if (!await ctx.executionPolicy.allows("bera")) return true;
    if (/^\d{1,2}$/.test(ctx.rawContent) && ctx.bera.isPlaying()) { const response = await ctx.bera.input(ctx.rawContent); if (response) await ctx.send(response); return true; }
    const action = ctx.command.match(pattern)[1]; const response = ["참가", "참여"].includes(action) ? await ctx.bera.participate() : ["나가기", "탈퇴"].includes(action) ? await ctx.bera.exit() : action === "시작" ? await ctx.bera.start() : await ctx.bera.ranking(); await ctx.send(response); return true;
  },
};
