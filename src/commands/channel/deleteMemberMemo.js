const pattern = /^(?:(.+?)(?:의|에게|한테)?\s*메모(?:를)?\s*(?:삭제|지워)(?:해줘|해주세요|줘|주세요)?|메모\s*(?:삭제|지우기)\s+(.+))$/;
module.exports = {
  name: "deleteMemberMemo", matches: ctx => ctx.hasPrefix && pattern.test(ctx.command),
  async execute(ctx) {
    if (!await ctx.rentalService.check()) return true;
    if (!await ctx.roleService.isHost(ctx.userId)) return ctx.send("방장만 메모를 삭제할 수 있어요.");
    const value = ctx.command.match(pattern).slice(1).find(Boolean); const user = ctx.event.message?.mention?.id ? await ctx.userRepository.findByPrivateId(ctx.channelId, ctx.event.message.mention.id) : await ctx.lookupService.findOne(ctx.channelId, value.trim());
    if (!user) return ctx.send("대상 유저를 찾을 수 없어요.");
    await ctx.send(await ctx.memberMemoService.clear(ctx.channelId, user.privateId)); return true;
  },
};
