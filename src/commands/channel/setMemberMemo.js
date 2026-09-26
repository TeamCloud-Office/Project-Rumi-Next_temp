const patterns = [/^(.+?)(?:에게|한테|께)\s*(.+?)(?:라고)?\s*메모(?:를)?\s*(?:적어줘|적어주세요|작성해줘|작성해주세요|저장해줘|저장해주세요|등록해줘|추가해줘|남겨줘)$/, /^(.+?)\s+메모(?:를)?\s+(?!(?:삭제|지워))(.+?)(?:\s*(?:저장|등록|추가|작성)(?:해줘|해주세요)?)?$/, /^메모(?:\s*(?:작성|등록|추가))?\s+(.+?)\s+(.+)$/];
const find = value => patterns.map(pattern => value.match(pattern)).find(Boolean);
module.exports = {
  name: "setMemberMemo", matches: ctx => ctx.hasPrefix && Boolean(find(ctx.command)),
  async execute(ctx) {
    if (!await ctx.rentalService.check()) return true;
    if (!await ctx.roleService.isHost(ctx.userId)) return ctx.send("방장만 메모를 작성할 수 있어요.");
    const match = find(ctx.command); const user = ctx.event.message?.mention?.id ? await ctx.userRepository.findByPrivateId(ctx.channelId, ctx.event.message.mention.id) : await ctx.lookupService.findOne(ctx.channelId, match[1].trim());
    if (!user) return ctx.send("대상 유저를 찾을 수 없어요.");
    await ctx.send(await ctx.memberMemoService.set(ctx.channelId, user.privateId, match[2].trim())); return true;
  },
};
