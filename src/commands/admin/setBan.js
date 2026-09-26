const { isAdmin, enabled } = require("./_helpers");
const pattern = /^(?:밴|차단)\s+(\d+)\s+(\S+)\s+(true|false|설정|추가|지정|해제|제거|켜|꺼)(?:\s+(.+))?$/i;
module.exports = {
  name: "setBan", matches: async ctx => ctx.hasPrefix && pattern.test(ctx.command) && await isAdmin(ctx),
  async execute(ctx) { const match = ctx.command.match(pattern), value = enabled(match[3]), reason = String(match[4] || "").trim(); if (value && !reason) return ctx.send("밴 사유를 입력해 주세요.\n형식: 밴 {채널 ID} {사용자 ID} true {사유}"); const result = await ctx.userAdminService.setBan(match[1], match[2], value, reason); await ctx.send(result ? (value ? `성공적으로 밴 처리했어요.\n사유: ${reason}` : "성공적으로 밴을 해제했어요.") : "사용자를 찾을 수 없어요."); return true; },
};
