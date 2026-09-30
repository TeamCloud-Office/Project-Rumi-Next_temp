const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const Config = require("../../src/config/Config");
const { createApplication } = require("../../src/Main");

test("migrated account, attendance, and transfer commands use isolated legacy-compatible data", async t => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "rumi-next-"));
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  const config = new Config({ HOST: "127.0.0.1", PORT: "0" });
  config.paths = {
    data: root,
    users: path.join(root, "users"),
    channels: path.join(root, "channels"),
    games: path.join(root, "games"),
    db: path.join(root, "db"),
    etc: path.join(root, "etc"),
  };
  config.bankHours = [0, 24];
  const replies = [];
  const { bot, container } = createApplication({ config, replyClient: { send: async (room, data) => replies.push({ room, data }) } });
  t.after(() => container.registry.close());
  const event = (userId, name, content) => ({ channel: { id: "room-1", name: "테스트방" }, user: { id: userId, name }, message: { content } });

  await bot.handle(event("user-1", "첫째", "루미야 내 정보"));
  await bot.handle(event("user-2", "둘째", "루미야 내 정보"));
  assert.match(replies[0].data, /닉네임: 첫째/);

  const channel = await container.channelRepository.find("room-1");
  await container.channelRepository.save({ ...channel, state: 1, function: JSON.stringify({ attendance: true, remittance: true }) });
  await bot.handle(event("user-1", "첫째", "루미야 출석"));
  await bot.handle(event("user-1", "첫째", "루미야 출석"));
  assert.match(replies[2].data, /출석 완료/);
  assert.equal(replies[3].data, "이미 출석했어요.");

  const first = await container.userRepository.findByPrivateId("room-1", "user-1");
  const second = await container.userRepository.findByPrivateId("room-1", "user-2");
  assert.equal(Number(first.star), 100);
  await bot.handle(event("user-1", "첫째", `루미야 송금 ${second.publicId} 50`));
  assert.match(replies.at(-1).data, /50스타를 송금/);
  assert.equal(Number((await container.userRepository.findByPrivateId("room-1", "user-1")).star), 50);
  assert.equal(Number((await container.userRepository.findByPrivateId("room-1", "user-2")).star), 50);
});
