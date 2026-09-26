const pattern = /^(.+?)\s*(?:기능|감지)?\s*(켜줘|켜주세요|켜|활성화|활성화해줘|활성화해주세요|꺼줘|꺼주세요|꺼|비활성화|비활성화해줘|비활성화해주세요)$/;
const { resolveFeatureKey } = require("../../config/featureCatalog");
module.exports = {
  name: "featureToggle", matches: ctx => ctx.hasPrefix && pattern.test(ctx.command) && Boolean(resolveFeatureKey(ctx.command.match(pattern)[1])),
  async execute(ctx) {
    if (!await ctx.rentalService.check()) return true;
    const match = ctx.command.match(pattern); const enabled = /^(켜|켜줘|켜주세요|활성화|활성화해줘|활성화해주세요)$/.test(match[2]);
    if (!await ctx.roleService.isHost(ctx.userId)) return ctx.send(`방장만 기능을 ${enabled ? "켤" : "끌"} 수 있어요.`);
    await ctx.send(await ctx.featureService.set(match[1].trim(), enabled)); return true;
  },
};
