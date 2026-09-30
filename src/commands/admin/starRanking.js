const { isAdmin } = require("./_helpers");
const current = new Set(["스타 랭킹", "스타랭킹", "스타 순위", "스타순위", "전체 스타 랭킹", "전체 스타 순위", "전체 사용자 스타 랭킹", "모든 사용자 스타 랭킹"]);
const pattern = /^(?:(?:전체\s*)?(?:사용자|유저)?\s*스타\s*(?:랭킹|순위)\s+(\d+)|(?:채팅방|채널|방)\s*(?:ID|아이디)?\s*(\d+)\s+(?:전체\s*)?(?:사용자|유저)?\s*스타\s*(?:랭킹|순위))$/i;
module.exports = {
  name: "adminStarRanking", matches: async ctx => ctx.hasPrefix && (current.has(ctx.command) || pattern.test(ctx.command)) && await isAdmin(ctx),
  async execute(ctx) {
    const match = ctx.command.match(pattern); const channelId = match?.[1] || match?.[2] || ctx.channelId;
    if (!await ctx.userRepository.hasChannel(channelId)) return ctx.send(`채팅방 ID [ ${channelId} ]의 사용자 데이터를 찾을 수 없어요.`);
    const users = (await ctx.userRepository.list(channelId)).sort((a, b) => Number(b.star || 0) - Number(a.star || 0) || String(a.name).localeCompare(String(b.name), "ko"));
    if (!users.length) return ctx.send(`채팅방 ID [ ${channelId} ]에는 스타 랭킹에 표시할 사용자가 없어요.`);
    await ctx.send([`⭐ 채팅방 ${channelId} 전체 사용자 스타 랭킹`, ...users.map((user, index) => `${index + 1}. ${user.name}(${user.privateId}) - ${Number(user.star || 0).toLocaleString()}스타`)].join("\n")); return true;
  },
};
