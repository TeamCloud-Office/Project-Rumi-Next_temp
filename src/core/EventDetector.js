const FEED_TYPES = Object.freeze({ 4: "join", 2: "leave", 6: "kick", 14: "delete", 26: "hide" });
module.exports = class EventDetector {
  detect(data, message = null) {
    if (String(data?.type) === "1") return "message";
    if (String(data?.type) !== "0") return null;
    let feed = data?.message ?? message?.message;
    if (typeof feed === "string") { try { feed = JSON.parse(feed); } catch { feed = {}; } }
    return FEED_TYPES[Number(data?.feedType ?? data?.feed_type ?? feed?.feedType ?? feed?.feed_type)] || null;
  }
};
module.exports.FEED_TYPES = FEED_TYPES;
