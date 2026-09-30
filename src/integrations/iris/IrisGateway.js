module.exports = class IrisGateway {
  constructor(queryClient) { this.queryClient = queryClient; }
  async getMessageContent(messageId, key = "id") {
    // SELECT * includes user_id and encryption metadata required by Iris.
    const query = key === "_id" ? "SELECT * FROM chat_logs WHERE _id = ?" : "SELECT * FROM chat_logs WHERE id = ?";
    const rows = await this.queryClient.query(query, [messageId]);
    if (typeof rows[0]?.message !== "string") throw new Error("Iris chat_logs message not found");
    return rows[0].message;
  }
  async getMessage(messageId, key = "id") {
    const column = key === "_id" ? "_id" : "id";
    return (await this.queryClient.query(`SELECT * FROM chat_logs WHERE ${column} = ?`, [messageId]))[0] || null;
  }
  async getChannelsRoles(channelIds) {
    const ids = [...new Set(channelIds.map(String).filter(Boolean))];
    if (!ids.length) return new Map();
    const rows = await this.queryClient.query(`SELECT involved_chat_id, user_id, link_member_type FROM open_chat_member WHERE involved_chat_id IN (${ids.map(() => "?").join(",")}) AND link_member_type IN (1,4)`, ids);
    const result = new Map(ids.map(channelId => [channelId, { hostId: null, subHostIds: [] }]));
    for (const row of rows) {
      const channelId = String(row.involved_chat_id ?? ""); if (!result.has(channelId)) continue;
      if (Number(row.link_member_type) === 1) result.get(channelId).hostId = row.user_id == null ? null : String(row.user_id);
      if (Number(row.link_member_type) === 4 && row.user_id != null) result.get(channelId).subHostIds.push(String(row.user_id));
    }
    return result;
  }
  async getMemberProfiles() {
    return this.queryClient.query("SELECT involved_chat_id, user_id, nickname, original_profile_image_url FROM open_chat_member", []);
  }
};
