module.exports = class IrisReplyClient {
  constructor(client) { this.client = client; }
  async send(channelId, text) {
    return this.client.post("/reply", { type: "text", room: String(channelId), data: text });
  }
};
