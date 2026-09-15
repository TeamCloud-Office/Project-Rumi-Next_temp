// 출석 명령어
const aliases = new Set(["출석", "출석체크", "출석 체크해줘"]);

module.exports = {
  name: "attendance",

  // 명령어 확인
  matches(ctx) {
    if (!ctx.hasPrefix) return false;
    return aliases.has(ctx.command);
  },

  // 출석 처리
  async execute(ctx) {
    if (!(await ctx.isRentedRoom())) return true;
    if (!(await ctx.CHANNELLOG.getStateFunc("출석"))) return true;

    const result = await ctx.attendance.check();

    ctx.commandHistoryDescription = "출석 체크";
    await ctx.send(result);

    return true;
  },
};