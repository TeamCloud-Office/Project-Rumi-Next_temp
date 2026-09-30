const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const DatabaseRegistry = require("../../src/database/DatabaseRegistry");
const AttendanceRepository = require("../../src/database/repositories/AttendanceRepository");
const UserRepository = require("../../src/database/repositories/UserRepository");
const UserService = require("../../src/services/account/UserService");
const AttendanceService = require("../../src/services/games/AttendanceService");
const GamblingService = require("../../src/services/games/GamblingService");
const attendanceCommand = require("../../src/commands/games/attendance");
const gamblingCommand = require("../../src/commands/games/gambling");

test("attendance preserves rewards, daily ranking, aliases and SQLite records", async t => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "rumi-attendance-"));
  let registry = new DatabaseRegistry();
  t.after(async () => { registry.close(); await fs.rm(root, { recursive: true, force: true }); });
  const paths = { users: path.join(root, "users") };
  const repository = new AttendanceRepository({ registry, paths });
  const users = new UserRepository({ registry, paths });
  const first = new UserService({ repository: users, channelId: "room", userId: "9007199254740993123" });
  const second = new UserService({ repository: users, channelId: "room", userId: "second" });
  await first.create("첫째");
  await second.create("둘째");
  const attendance = new AttendanceService({ channelId: "room", userId: first.userId, attendanceRepository: repository, userService: first });
  const other = new AttendanceService({ channelId: "room", userId: second.userId, attendanceRepository: repository, userService: second });
  attendance.getToday = other.getToday = () => "2026-09-27";
  const replies = [];
  const ctx = { hasPrefix: true, command: "출석 체크", attendance, channelService: { isRented: async () => true, featureEnabled: async () => true }, send: async text => replies.push(text) };
  assert.equal(attendanceCommand.matches(ctx), true);
  await attendanceCommand.execute(ctx);
  assert.equal(ctx.commandHistoryDescription, "출석 체크 - 1등");
  assert.match(replies.at(-1), /100스타/);
  assert.equal(await attendance.check(), "이미 출석했어요.");
  assert.equal((await first.get()).star, 100);
  assert.match(await other.check(), /2등/);
  ctx.command = "출석목록";
  await attendanceCommand.execute(ctx);
  assert.equal(ctx.commandHistoryDescription, "출석 목록 조회");
  assert.match(replies.at(-1), /1\. 첫째\n2\. 둘째/);
  ctx.command = "내출석";
  await attendanceCommand.execute(ctx);
  assert.equal(ctx.commandHistoryDescription, "출석 기록 조회");
  attendance.getToday = () => "2026-09-28";
  assert.match(await attendance.check(), /누적 출석: 2회/);
  assert.equal((await first.get()).star, 200);
  registry.close();
  registry = new DatabaseRegistry();
  const reopened = new AttendanceRepository({ registry, paths });
  assert.deepEqual(await reopened.getTodayList("room", "2026-09-28"), [first.userId]);
  assert.equal((await reopened.getStats("room", first.userId)).count, 2);
});

test("gambling preserves legacy payouts and validates wagers before changing balances", async () => {
  let star = 1000;
  const userService = { get: async () => ({ star }), addStar: async delta => ({ star: star += delta }) };
  const black = new GamblingService({ userService, random: () => 0 });
  const white = new GamblingService({ userService, random: () => 0.99 });
  assert.equal((await black.bet("흑", 100)).delta, 100);
  assert.equal((await white.bet("백", 100)).delta, 100);
  assert.equal((await white.bet("흑", 100)).delta, -100);
  assert.equal((await black.bet("0", 100)).delta, 300);
  assert.equal((await white.bet("4", 100)).delta, 300);
  assert.equal((await white.bet("0", 100)).delta, -100);
  const before = star;
  for (const amount of [0, -1, 1.5, NaN, Number.MAX_SAFE_INTEGER + 1, before + 1]) {
    await assert.rejects(black.bet("흑", amount));
    assert.equal(star, before);
  }
  await assert.rejects(black.bet("5", 100), /대상/);
  assert.equal(star, before);
  const replies = [];
  for (const command of ["흑에 1,000스타 도박해줘", "도박 흑 100스타", "도박 0 100"]) {
    const ctx = { hasPrefix: true, command, gambling: black, channelService: { isRented: async () => true, featureEnabled: async () => true }, send: async text => replies.push(text) };
    assert.equal(gamblingCommand.matches(ctx), true);
    await gamblingCommand.execute(ctx);
    assert.match(replies.at(-1), /승리/);
  }
  star = Number.MAX_SAFE_INTEGER;
  await assert.rejects(black.bet("0", 100), /범위/);
  await assert.rejects(black.play(100), /범위/);
  assert.equal(star, Number.MAX_SAFE_INTEGER);
});

test("attendance and gambling respect prefix, rental and feature gates", async () => {
  for (const [handler, command] of [[attendanceCommand, "출석"], [gamblingCommand, "도박 흑 100"]]) {
    assert.equal(handler.matches({ hasPrefix: false, command }), false);
    for (const [rented, enabled] of [[false, true], [true, false]]) {
      await handler.execute({ command, channelService: { isRented: async () => rented, featureEnabled: async () => enabled }, send: async () => assert.fail("disabled command sent a reply") });
    }
  }
});
