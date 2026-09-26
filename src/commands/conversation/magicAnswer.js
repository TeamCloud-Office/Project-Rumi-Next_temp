const pattern = /^마법의\s*루미(?:님)?(?:아)?\s+(.+)$/;
module.exports = { name: "magicAnswer", matches: ctx => pattern.test(ctx.rawContent), async execute(ctx) { if (!await ctx.rentalService.check()) return true; ctx.commandHistoryDescription = `마법의 루미 - ${ctx.rawContent.match(pattern)[1].trim()}`; await ctx.send(await ctx.magicAnswerService.answer()); return true; } };
