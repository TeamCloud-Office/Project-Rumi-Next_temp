const fs = require("node:fs");
const path = require("node:path");
const initSqlJs = require("sql.js");
const paths = require("../src/config/paths");

const files = [
  path.join(paths.users, "UserData.db"),
  path.join(paths.users, "UserJLLog.db"),
  path.join(paths.channels, "ChannelJLLog.db"),
  path.join(paths.users, "games", "AttendanceData.db"),
  path.join(paths.users, "games", "BeraData.db"),
  path.join(paths.games, "StockData.db"),
  path.join(paths.db, "Message.db"),
];

async function inspectLegacyData() {
  const SQL = await initSqlJs();
  return files.map(file => {
    if (!fs.existsSync(file)) return { file, exists: false, tables: [] };
    const database = new SQL.Database(fs.readFileSync(file));
    try {
      const result = database.exec("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name")[0];
      const tables = (result?.values || []).map(([name]) => {
        const quoted = String(name).replaceAll('"', '""');
        const count = database.exec(`SELECT COUNT(*) FROM "${quoted}"`)[0]?.values[0][0] || 0;
        return { name: String(name), rows: Number(count) };
      });
      return { file, exists: true, size: fs.statSync(file).size, tables };
    } finally { database.close(); }
  });
}

if (require.main === module) {
  inspectLegacyData().then(result => console.log(JSON.stringify(result, null, 2))).catch(error => { console.error(error); process.exitCode = 1; });
}

module.exports = inspectLegacyData;
