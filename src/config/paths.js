const path = require("node:path");
const root = path.resolve(__dirname, "../..");
const data = path.resolve(process.env.RUMI_DATA_PATH || path.join(root, "data"));
module.exports = {
  root,
  data,
  envFile: path.join(root, ".env"),
  users: path.join(data, "users"),
  channels: path.join(data, "channels"),
  games: path.join(data, "games"),
  db: path.join(data, "db"),
  etc: path.join(data, "etc"),
  userDatabase: path.join(data, "users", "UserData.db"),
  userLogDatabase: path.join(data, "users", "UserJLLog.db"),
  channelDatabase: path.join(data, "channels", "ChannelJLLog.db"),
  attendanceDatabase: path.join(data, "users", "games", "AttendanceData.db"),
  messageDatabase: path.join(data, "db", "Message.db"),
  magicAnswers: path.join(data, "db", "MagicAnswer.json"),
};
