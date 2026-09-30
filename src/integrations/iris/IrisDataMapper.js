function safeId(value) {
  if (value == null || !/^\d+$/.test(String(value))) return null;
  return String(value);
}
module.exports = class IrisDataMapper {
  user(row) { return row ? { id: safeId(row.user_id), name: row.nickname || null, type: row.link_member_type ?? null, profile: row.original_profile_image_url || null, raw: row } : null; }
  channel(row, name = null) { return row ? { id: safeId(row.id), name: name || null, members: row.members || null, raw: row } : null; }
  message(row) { return row ? { id: safeId(row.id), content: typeof row.message === "string" ? row.message : null, type: row.type ?? null, raw: row } : null; }
};
