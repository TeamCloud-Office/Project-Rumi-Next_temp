const { isCommand } = require("../../utils/CommandUtils");
const checkAliases = ["출석", "출석체크", "출석 체크해줘"];
const listAliases = ["출석 목록", "출석명단"];
const statsAliases = ["내 출석", "내 출석 확인해줘"];

module.exports = {
  name: "attendance",

  // 명령어 확인
  matches(ctx) {
    if (!ctx.hasPrefix) return false;
    return isCommand(ctx.command, [...checkAliases, ...listAliases, ...statsAliases]);
  },

  // 출석 처리
  async execute(ctx) {
    if (!(await ctx.channelService.isRented())) return true;
    if (!(await ctx.channelService.featureEnabled("attendance"))) return true;

    const listing = isCommand(ctx.command, listAliases);
    const statistics = isCommand(ctx.command, statsAliases);
    const result = listing ? await ctx.attendance.list() : statistics ? await ctx.attendance.stats() : await ctx.attendance.check();
    const rank = result.match(/오늘 순위: (\d+)등/)?.[1];
    ctx.commandHistoryDescription = listing ? "출석 목록 조회" : statistics ? "출석 기록 조회" : `출석 체크${rank ? ` - ${rank}등` : ""}`;
    await ctx.send(result);

    return true;
  },
};
