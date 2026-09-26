function invalid(message) {
  return Object.assign(new TypeError(message), { code: "INVALID_IRIS_WEBHOOK" });
}
function id(value) {
  if (typeof value === "number" && !Number.isSafeInteger(value)) throw invalid("Unsafe Iris ID");
  if (value === undefined || value === null || !/^\d+$/.test(String(value))) throw invalid("Invalid Iris ID");
  return String(value);
}
function object(value) {
  if (value && typeof value === "object") return value;
  if (typeof value === "string") { try { const parsed = JSON.parse(value); return parsed && typeof parsed === "object" ? parsed : {}; } catch {} }
  return {};
}
module.exports = async function parseIrisEvent(raw, gateway) {
  const data = raw?.json ?? raw;
  if (!data || typeof data !== "object" || Array.isArray(data)) throw invalid("Invalid Iris webhook");
  const type = String(data.type);
  if (type === "0") {
    let feed = data.message;
    if (typeof feed === "string") { try { feed = JSON.parse(feed); } catch { feed = {}; } }
    if (!feed || typeof feed !== "object") feed = {};
    const eventType = ({ 4: "join", 2: "leave", 6: "kick", 14: "delete", 26: "hide" })[Number(data.feedType ?? data.feed_type ?? feed.feedType ?? feed.feed_type)];
    if (!eventType) return null;
    const channelId = id(data.chat_id);
    const userId = id(data.user_id);
    const channel = { id: channelId, name: typeof raw?.room === "string" ? raw.room : null };
    const user = { id: userId, name: typeof raw?.sender === "string" ? raw.sender : null, type: data.user_type ?? null };
    const member = feed.member || {};
    if (eventType === "join" || eventType === "leave") return { type: eventType, channel, user: { id: member.userId == null ? userId : id(member.userId), name: member.nickName || user.name }, raw: data };
    if (eventType === "kick") return { type: eventType, channel, kickedUser: { id: member.userId == null ? null : id(member.userId), name: member.nickName || null }, kickerUser: user, raw: data };
    const targetId = feed.logId ?? feed.log_id ?? feed.messageId ?? feed.message_id;
    let content = "";
    if (targetId != null && gateway) { try { content = await gateway.getMessageContent(id(targetId)); } catch {} }
    return { type: eventType, channel, user, message: { id: targetId == null ? null : id(targetId), content }, raw: data };
  }
  if (type !== "1") return null;
  const channelId = id(data.chat_id);
  const userId = id(data.user_id);
  const messageId = data.id ?? data._id;
  const channel = { id: channelId, name: typeof raw?.room === "string" ? raw.room : null };
  const user = { id: userId, name: typeof raw?.sender === "string" ? raw.sender : null, type: data.user_type ?? null };
  // Iris's envelope exposes decrypted text in msg. Older envelopes can
  // contain encrypted chat_logs.message, which the fork reads via /query.
  let content = raw?.json && typeof raw.msg === "string" ? raw.msg : undefined;
  if (content === undefined && raw?.json && messageId != null && gateway) {
    content = await gateway.getMessageContent(id(messageId), data.id == null ? "_id" : "id");
  }
  content ??= data.message;
  if (typeof content !== "string") throw invalid("Invalid Iris message");
  const attachment = object(data.attachment ?? data.attachments);
  let mention = data.mention && typeof data.mention === "object" && data.mention.id != null
    ? { ...data.mention, id: id(data.mention.id) }
    : Array.isArray(attachment.mentions) && attachment.mentions.length === 1 && attachment.mentions[0]?.user_id != null
      ? { id: id(attachment.mentions[0].user_id), name: null } : null;
  let thread = data.thread && typeof data.thread === "object" ? data.thread : null;
  if (!thread && data.thread_id != null && gateway) {
    try {
      const row = await gateway.getMessage(id(data.thread_id));
      const previous = row?.prev_id == null ? null : await gateway.getMessage(id(row.prev_id));
      if (row) thread = { id: row.id == null ? id(data.thread_id) : id(row.id), content: row.message || null, prev: previous?.message || null, user: row.user_id == null ? null : { id: id(row.user_id), name: null }, raw: row };
    } catch {}
  }
  return {
    type: "message",
    raw: data,
    channel,
    user,
    message: {
      id: messageId == null ? null : id(messageId),
      content,
      type: data.message_type ?? data.type,
      mention,
    },
    thread,
  };
};
