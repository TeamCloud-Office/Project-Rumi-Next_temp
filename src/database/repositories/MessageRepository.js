const schema = require("../schemas/messageSchema");
const path = require("node:path");

module.exports = class MessageRepository {
  constructor({ registry, paths }) { this.registry = registry; this.file = paths.messageDatabase || path.join(paths.db, "Message.db"); }
  database(table) { return this.registry.get(this.file, table, { autoCreate: true, schema }); }
  async find(table, name) { return name == null ? this.database(table).get() : this.database(table).get("name", String(name)); }
};
