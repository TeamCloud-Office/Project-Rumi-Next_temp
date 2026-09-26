const { parseInteger } = require("../../utils/CommandUtils");
async function isAdmin(ctx) { return Boolean((await ctx.userService.get())?.admin); }
async function resolve(ctx, channelId, value) { return ctx.userAdminService.resolve(String(channelId), String(value)); }
function enabled(value) { return ["true", "설정", "추가", "지정", "켜"].includes(String(value).toLowerCase()); }
module.exports = { isAdmin, resolve, enabled, parseInteger };
