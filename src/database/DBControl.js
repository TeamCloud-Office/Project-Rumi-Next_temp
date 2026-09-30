const fs = require("node:fs");
const path = require("node:path");
const initSqlJs = require("sql.js");
const AtomicFileWriter = require("./AtomicFileWriter");

const locateFile = file => require.resolve(`sql.js/dist/${file}`);

module.exports = class DBControl {
  constructor(file, table, { autoCreate = false, schema = null, writeQueue, writer, store = null } = {}) {
    if (!file) throw new TypeError("DB file is required");
    this.file = path.resolve(file);
    this.tableName = table ? String(table) : null;
    this.autoCreate = autoCreate;
    this.schema = schema;
    this.writeQueue = writeQueue;
    this.writer = writer || new AtomicFileWriter();
    this.store = store || { file: this.file, db: null, ready: null };
    this.columns = [];
    this.firstColumn = null;
    this.ready = this.initialize();
  }

  async initialize() {
    if (!this.store.ready) {
      this.store.ready = (async () => {
        const SQL = await initSqlJs({ locateFile });
        const bytes = fs.existsSync(this.file) ? fs.readFileSync(this.file) : null;
        this.store.db = bytes?.length ? new SQL.Database(bytes) : new SQL.Database();
      })();
    }
    await this.store.ready;
    this.db = this.store.db;
    if (!this.tableName) this.tableName = this.tableNames()[0] || null;
    if (this.tableName && !this.tableNames().includes(this.tableName)) {
      if (!this.autoCreate || !this.schema) throw new Error(`Missing table: ${this.tableName}`);
      this.createTableSync(this.tableName, this.schema);
      await this.persist();
    }
    if (this.tableName) {
      this.loadSchema();
      if (this.schema) await this.ensureSchema(this.schema);
    }
  }

  quote(value) { return `"${String(value).replaceAll('"', '""')}"`; }
  tableNames() {
    return this.db.exec("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'")[0]?.values.map(row => String(row[0])) || [];
  }
  loadSchema() {
    const result = this.db.exec(`PRAGMA table_info(${this.quote(this.tableName)})`)[0];
    this.columns = result?.values.map(row => String(row[1])) || [];
    this.firstColumn = this.columns[0] || null;
  }
  createTableSync(name, schema) {
    const columns = Object.entries(schema).map(([key, definition]) => {
      const value = typeof definition === "string" ? { type: definition } : definition;
      return [this.quote(key), value.type || "TEXT", value.primary ? "PRIMARY KEY" : "", value.autoIncrement ? "AUTOINCREMENT" : "", value.notNull ? "NOT NULL" : "", value.unique ? "UNIQUE" : ""].filter(Boolean).join(" ");
    });
    this.db.run(`CREATE TABLE IF NOT EXISTS ${this.quote(name)} (${columns.join(", ")})`);
  }
  async persist() {
    const write = () => this.writer.write(this.file, Buffer.from(this.db.export()));
    return this.writeQueue ? this.writeQueue.run(this.file, write) : write();
  }
  rows(sql, values = []) {
    const statement = this.db.prepare(sql);
    try {
      statement.bind(values.map(value => value ?? null));
      const rows = [];
      while (statement.step()) rows.push(statement.getAsObject());
      return rows;
    } finally { statement.free(); }
  }
  assertTable() {
    if (!this.tableName || !this.firstColumn) throw new Error("No table selected");
  }

  async tables() { await this.ready; return this.tableNames(); }
  async use(name) {
    await this.ready;
    if (!this.tableNames().includes(String(name))) {
      if (!this.autoCreate || !this.schema) throw new Error(`Missing table: ${name}`);
      this.createTableSync(String(name), this.schema);
      await this.persist();
    }
    this.tableName = String(name);
    this.loadSchema();
    if (this.schema) await this.ensureSchema(this.schema);
    return this;
  }
  async ensureSchema(schema) {
    const existing = new Set(this.columns);
    let changed = false;
    for (const [name, definition] of Object.entries(schema)) {
      if (existing.has(name)) continue;
      const type = typeof definition === "string" ? definition : definition.type || "TEXT";
      this.db.run(`ALTER TABLE ${this.quote(this.tableName)} ADD COLUMN ${this.quote(name)} ${type}`);
      changed = true;
    }
    if (changed) { this.loadSchema(); await this.persist(); }
  }
  async get(...args) {
    await this.ready; this.assertTable();
    if (!args.length) return this.rows(`SELECT * FROM ${this.quote(this.tableName)}`);
    const column = args.length === 1 ? this.firstColumn : String(args[0]);
    const value = args.length === 1 ? args[0] : args[1];
    if (!this.columns.includes(column)) throw new Error(`Unknown column: ${column}`);
    return this.rows(`SELECT * FROM ${this.quote(this.tableName)} WHERE ${this.quote(column)}=?`, [value]);
  }
  async set(data) {
    await this.ready; this.assertTable();
    const clean = Object.fromEntries(Object.entries(data).filter(([key]) => this.columns.includes(key)));
    const key = this.firstColumn;
    if (clean[key] === undefined || clean[key] === null || clean[key] === "") throw new Error(`Missing key: ${key}`);
    const exists = this.rows(`SELECT 1 FROM ${this.quote(this.tableName)} WHERE ${this.quote(key)}=? LIMIT 1`, [clean[key]]).length > 0;
    const names = Object.keys(clean);
    if (exists) {
      const updates = names.filter(name => name !== key);
      if (!updates.length) return;
      this.db.run(`UPDATE ${this.quote(this.tableName)} SET ${updates.map(name => `${this.quote(name)}=?`).join(", ")} WHERE ${this.quote(key)}=?`, [...updates.map(name => clean[name] ?? null), clean[key]]);
    } else {
      this.db.run(`INSERT INTO ${this.quote(this.tableName)} (${names.map(name => this.quote(name)).join(",")}) VALUES (${names.map(() => "?").join(",")})`, names.map(name => clean[name] ?? null));
    }
    await this.persist();
  }
  async delete(value) {
    await this.ready; this.assertTable();
    this.db.run(`DELETE FROM ${this.quote(this.tableName)} WHERE ${this.quote(this.firstColumn)}=?`, [value]);
    await this.persist();
  }
  close() { this.db = null; }
};
