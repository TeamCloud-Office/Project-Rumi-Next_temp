module.exports = {
  name: "ranking",
  matches: ctx => ctx.hasPrefix && ["랭킹", "전체 랭킹", "스타 랭킹"].includes(ctx.command),
  async execute(ctx) {
    const users = await ctx.ranking.get(ctx.channelId);
    await ctx.send(users.length ? ["스타 랭킹", ...users.map((user, index) => `${index + 1}. ${user.name} - ${Number(user.star || 0).toLocaleString()}스타`)].join("\n") : "등록된 사용자가 없어요.");
    return true;
  },
};
