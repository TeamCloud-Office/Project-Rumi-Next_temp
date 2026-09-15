function invalid(message) {
  return Object.assign(new TypeError(message), { code: "INVALID_IRIS_WEBHOOK" });
}
function id(value) {
  if (typeof value === "number" && !Number.isSafeInteger(value)) throw invalid("Unsafe Iris ID");
  if (value === undefined || value === null || !/^\d+$/.test(String(value))) throw invalid("Invalid Iris ID");
  return String(value);
}
module.exports = async function parseIrisEvent(raw, gateway) {
  const data = raw?.json ?? raw;
  if (!data || typeof data !== "object" || Array.isArray(data)) throw invalid("Invalid Iris webhook");
  if (String(data.type) !== "1") return null;
  const channelId = id(data.chat_id);
  const userId = id(data.user_id);
  const messageId = data.id ?? data._id;
  // Iris's envelope exposes decrypted text in msg. Older envelopes can
  // contain encrypted chat_logs.message, which the fork reads via /query.
  let content = raw?.json && typeof raw.msg === "string" ? raw.msg : undefined;
  if (content === undefined && raw?.json && messageId != null && gateway) {
    content = await gateway.getMessageContent(id(messageId), data.id == null ? "_id" : "id");
  }
  content ??= data.message;
  if (typeof content !== "string") throw invalid("Invalid Iris message");
  return {
    raw: data,
    channel: { id: channelId },
    user: { id: userId },
    message: { id: messageId == null ? null : id(messageId), content },
  };
};
