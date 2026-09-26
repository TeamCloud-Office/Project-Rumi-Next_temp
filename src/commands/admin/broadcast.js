const { isAdmin } = require("./_helpers");
const pattern = /^(?:전체[ \t]*메시지|전체[ \t]*공지|전체공지|공지|방송)(?:[ \t]*\r?\n|[ \t]+)?([\s\S]*)$/;
module.exports = {
  name: "broadcast", matches: async ctx => ctx.hasPrefix && pattern.test(ctx.rawCommand || ctx.command) && await isAdmin(ctx),
  async execute(ctx) {
    const message = (ctx.rawCommand || ctx.command).match(pattern)[1].replace(/\\n/g, "\n").trim();
    const result = await ctx.broadcastService.send(message);
    if (result.error) return ctx.send(result.error);
    await ctx.send(["공지를 전송했어요.", `대상: ${result.total}개 채널`, `성공: ${result.success.length}개`, `실패: ${result.failed.length}개`, ...result.failed.map(channel => `- ${channel.name} (${channel.id}): ${channel.error}`)].join("\n")); return true;
  },
};
