const pattern = /^끝말(?:잇기)?\s*(참가|참여|나가기|탈퇴|시작)$/;
module.exports = {
  name: "wordChain", matches: ctx => (ctx.hasPrefix && pattern.test(ctx.command)) || (/^[가-힣]{2,}$/.test(ctx.rawContent) && ctx.wordChain.isPlaying()),
  async execute(ctx) {
    if (!await ctx.executionPolicy.allows("word")) return true;
    if (/^[가-힣]{2,}$/.test(ctx.rawContent) && ctx.wordChain.isPlaying()) { const response = await ctx.wordChain.input(ctx.rawContent); if (response) await ctx.send(response); return true; }
    const action = ctx.command.match(pattern)[1]; const response = ["참가", "참여"].includes(action) ? await ctx.wordChain.participate() : ["나가기", "탈퇴"].includes(action) ? await ctx.wordChain.exit() : ctx.wordChain.start(); await ctx.send(response); return true;
  },
};
