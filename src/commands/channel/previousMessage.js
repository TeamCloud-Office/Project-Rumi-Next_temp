const { isCommand } = require("../../utils/CommandUtils");
const aliases = ["윗메", "윗메 알려줘", "윗 메시지", "윗 메시지 알려줘", "위 메시지", "위 메시지 알려줘", "이전 메시지", "이전 메시지 알려줘", "답장 원문", "답장 원문 알려줘"];
module.exports = {
  name: "previousMessage", matches: ctx => ctx.hasPrefix && isCommand(ctx.command, aliases),
  async execute(ctx) {
    if (!await ctx.rentalService.check()) return true;
    if (!await ctx.roleService.isHost(ctx.userId)) return ctx.send("방장만 윗메를 확인할 수 있어요.");
    if (!ctx.event.thread) return ctx.send("답장을 해야 해요.");
    await ctx.send(`윗메는 "${ctx.event.thread.prev === "inaccessible" ? "접근 불가" : ctx.event.thread.prev || "내용 없음"}" 이에요.`); return true;
  },
};
