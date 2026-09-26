const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const Config = require("../../src/config/Config");
const { createApplication } = require("../../src/Main");
const DatabaseRegistry = require("../../src/database/DatabaseRegistry");
const UserRepository = require("../../src/database/repositories/UserRepository");
const parseIrisEvent = require("../../src/integrations/iris/IrisEventParser");

function testPaths(root) {
  return {
    root, data: root,
    users: path.join(root, "users"), channels: path.join(root, "channels"),
    games: path.join(root, "games"), db: path.join(root, "db"), etc: path.join(root, "etc"),
    messageDatabase: path.join(root, "db", "Message.db"), magicAnswers: path.join(root, "db", "MagicAnswer.json"),
  };
}

test("legacy rental, host feature control, duplicate-user selection, and member events work together", async t => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "rumi-next-legacy-"));
  const config = new Config({ HOST: "127.0.0.1", PORT: "0", DEV_CHANNEL_ID: "999", WATCHER_INTERVAL_MS: "60000" });
  config.paths = testPaths(root); config.bankHours = [0, 24];
  const replies = [];
  const { bot, container } = createApplication({ config, replyClient: { send: async (room, data) => replies.push({ room: String(room), data }) } });
  t.after(() => { container.registry.close(); return fs.rm(root, { recursive: true, force: true }); });
  const message = (userId, name, content) => ({ type: "message", channel: { id: "100", name: "레거시방" }, user: { id: String(userId), name }, message: { content } });

  await bot.handle(message(1, "관리자", "루미야 내 정보"));
  await container.userRepository.save("100", { ...(await container.userRepository.findByPrivateId("100", "1")), admin: 1 });
  await container.channelRepository.save({ ...(await container.channelRepository.find("100")), host: "1" });

  await bot.handle(message(1, "관리자", "루미야 방 등록 100 5"));
  assert.equal(Number((await container.channelRepository.find("100")).state), 1);
  await bot.handle(message(1, "관리자", "루미야 입장 기능 켜줘"));
  assert.equal(JSON.parse((await container.channelRepository.find("100")).function).join, true);
  await bot.handle(message(1, "관리자", "루미야 주식 기능 켜줘"));
  await bot.handle(message(1, "관리자", "루미야 베라31 기능 켜줘"));
  await bot.handle(message(1, "관리자", "루미야 주식"));
  assert.match(replies.at(-1).data, /얼리언스/);
  await bot.handle(message(1, "관리자", "루미야 베라31 참가"));
  await bot.handle(message(1, "관리자", "루미야 베라31 시작"));
  await bot.handle(message(1, "관리자", "1"));
  assert.match(replies.at(-1).data, /현재 숫자/);

  await bot.handle(message(2, "동명이인", "루미야 내 정보"));
  await bot.handle(message(3, "동명이인", "루미야 내 정보"));
  await bot.handle(message(1, "관리자", "루미야 유저 찾기 동명이인"));
  assert.match(replies.at(-1).data, /번호를 선택/);
  await bot.handle(message(1, "관리자", "2"));
  assert.match(replies.at(-1).data, /닉네임: 동명이인/);

  await bot.handle({ type: "join", channel: { id: "100", name: "레거시방" }, user: { id: "4", name: "새멤버" } });
  assert.match(replies.at(-1).data, /반가워요/);
  const log = await container.userLogRepository.find("100", "4");
  assert.equal(JSON.parse(log.join).count, 1);
});

test("tables sharing one SQLite file remain intact after reopening", async t => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "rumi-next-shared-db-"));
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  const paths = testPaths(root);
  const firstRegistry = new DatabaseRegistry();
  const first = new UserRepository({ registry: firstRegistry, paths });
  await first.save("100", { privateId: "1", publicId: "AAAAAA", name: "첫방", signupDate: "", star: 1, admin: 0, ban: 0, warn: 0, favorability: 0, inventory: "{}" });
  await first.save("200", { privateId: "2", publicId: "BBBBBB", name: "둘째방", signupDate: "", star: 2, admin: 0, ban: 0, warn: 0, favorability: 0, inventory: "{}" });
  firstRegistry.close();

  const secondRegistry = new DatabaseRegistry();
  const second = new UserRepository({ registry: secondRegistry, paths });
  assert.equal((await second.findByPrivateId("100", "1")).name, "첫방");
  assert.equal((await second.findByPrivateId("200", "2")).name, "둘째방");
  secondRegistry.close();
});

test("Iris feed payloads are mapped to member events with string IDs", async () => {
  const event = await parseIrisEvent({ room: "이벤트방", sender: "방장", json: { type: 0, chat_id: 9007199254740993123n.toString(), user_id: 9007199254740993124n.toString(), message: JSON.stringify({ feedType: 4, member: { userId: 9007199254740993125n.toString(), nickName: "입장자" } }) } });
  assert.equal(event.type, "join");
  assert.equal(event.channel.id, "9007199254740993123");
  assert.equal(event.user.id, "9007199254740993125");
  assert.equal(event.user.name, "입장자");
});
