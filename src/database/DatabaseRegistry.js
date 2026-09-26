const DBControl = require("./DBControl");
const FileWriteQueue = require("./FileWriteQueue");
const path = require("node:path");

module.exports = class DatabaseRegistry {
  constructor() {
    this.instances = new Map();
    this.stores = new Map();
    this.writeQueue = new FileWriteQueue();
  }

  get(file, table, options = {}) {
    const resolved = path.resolve(file);
    const key = `${resolved}::${table || ""}`;
    if (!this.stores.has(resolved)) this.stores.set(resolved, { file: resolved, db: null, ready: null });
    if (!this.instances.has(key)) {
      this.instances.set(key, new DBControl(resolved, table, { ...options, store: this.stores.get(resolved), writeQueue: this.writeQueue }));
    }
    return this.instances.get(key);
  }

  close() {
    for (const store of this.stores.values()) store.db?.close();
    this.instances.clear();
    this.stores.clear();
  }
};
