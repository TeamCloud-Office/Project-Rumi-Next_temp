module.exports = function createMessageHandler({ contextFactory, commandManager }) {
  return async event => {
    const ctx = await contextFactory.create(event);
    let handled = false;
    if (ctx.isBanned) {
      const attempted = ctx.hasPrefix || /^\d+$/.test(ctx.rawContent) || /^마법의\s*루미/.test(ctx.rawContent);
      try {
        if (attempted) {
          const user = await ctx.userService.get();
          await ctx.send([`${user.banDate || "알 수 없는 날짜"}부터 명령어 사용이 정지되었어요.`, `정지 사유: ${user.banReason || "등록된 사유 없음"}`, "이의 신청은 14일 이내 support@teamcloud.kr로 접수할 수 있습니다."].join("\n"));
        }
        return attempted;
      } finally { if (ctx.userLog) await ctx.userLog.logMessage(ctx.rawContent); }
    }
    try { handled = await commandManager.execute(ctx); return handled; }
    catch (error) {
      console.error("Message command failed:", error);
      await ctx.send(`명령을 처리하지 못했어요.\n오류: ${error.message || "알 수 없는 오류"}`);
      return true;
    } finally {
      if (ctx.userLog) {
        try {
          await ctx.userLog.logMessage(ctx.rawContent);
          if (handled || ctx.commandResponses.length) await ctx.userLog.logCommand(ctx.commandHistoryDescription || ctx.command || ctx.rawContent, ctx.excludeCommandResponsesFromHistory ? [] : ctx.commandResponses);
        } catch (error) { console.error("Message logging failed:", error); }
      }
    }
  };
};
