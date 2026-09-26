const { showUser } = require("./userLookup");
module.exports = {
  name: "userSelection",
  matches: ctx => /^\d+$/.test(ctx.rawContent) && ctx.selectionService.has(ctx.channelId, ctx.userId),
  async execute(ctx) {
    const result = ctx.selectionService.take(ctx.channelId, ctx.userId, Number(ctx.rawContent));
    if (!result?.selected) {
      const count = result?.entry?.users?.length || 0;
      await ctx.send(count ? `1부터 ${count} 사이의 번호를 선택해 주세요.` : "선택할 사용자가 없어요.");
      return true;
    }
    await showUser(ctx, result.selected, result.entry);
    return true;
  },
};
