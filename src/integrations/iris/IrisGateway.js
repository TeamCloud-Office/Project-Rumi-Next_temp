module.exports = class IrisGateway {
  constructor(queryClient) { this.queryClient = queryClient; }
  async getMessageContent(messageId, key = "id") {
    // SELECT * includes user_id and encryption metadata required by Iris.
    const query = key === "_id" ? "SELECT * FROM chat_logs WHERE _id = ?" : "SELECT * FROM chat_logs WHERE id = ?";
    const rows = await this.queryClient.query(query, [messageId]);
    if (typeof rows[0]?.message !== "string") throw new Error("Iris chat_logs message not found");
    return rows[0].message;
  }
};
