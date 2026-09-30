class AttendanceService {
  constructor({
    channelId,
    userId,
    attendanceRepository,
    userService,
  }) {
    this.channelId = String(channelId);
    this.userId = String(userId);
    this.repository = attendanceRepository;
    this.userService = userService;
  }

  // 오늘 날짜
  getToday() {
    return new Date().toLocaleDateString("sv-SE", {
      timeZone: "Asia/Seoul",
    });
  }

  // 출석 체크
  async check() {
    if (!(await this.userService.get())) return "유저 정보를 찾을 수 없어요.";
    const today = this.getToday();

    const todayList = await this.repository.getTodayList(
      this.channelId,
      today,
    );

    if (todayList.includes(this.userId)) {
      return "이미 출석했어요.";
    }

    todayList.push(this.userId);

    await this.repository.saveTodayList(
      this.channelId,
      today,
      todayList,
    );

    const ranking = todayList.length;

    const stats =
      (await this.repository.getStats(
        this.channelId,
        this.userId,
      )) ?? {
        count: 0,
        firstCount: 0,
      };

    stats.today = today;
    stats.todayRanking = ranking;
    stats.count = Number(stats.count || 0) + 1;

    if (ranking === 1) {
      stats.firstCount = Number(stats.firstCount || 0) + 1;
    }

    await this.repository.saveStats(
      this.channelId,
      this.userId,
      stats,
    );

    await this.userService.addStar(100);

    return [
      "✅ 출석 완료!",
      `- 오늘 순위: ${ranking}등`,
      `- 누적 출석: ${stats.count}회`,
      `- 1등 횟수: ${stats.firstCount}회`,
      "⭐ +100스타",
    ].join("\n");
  }

  async list() {
    const ids = await this.repository.getTodayList(this.channelId, this.getToday());
    if (!ids.length) return "오늘 출석한 사람이 아직 없어요.";
    const names = await Promise.all(ids.map(async id => (await this.userService.repository.findByPrivateId(this.channelId, id))?.name || id));
    return [`오늘 ${ids.length}명이 출석했어요!`, ...names.map((name, index) => `${index + 1}. ${name}`)].join("\n");
  }

  async stats() {
    const stats = await this.repository.getStats(this.channelId, this.userId);
    if (!stats) return "출석 기록이 없어요.";
    const user = await this.userService.get();
    return [`${user?.name || this.userId}님의 출석 기록이에요!`, `- 총 출석 횟수: ${Number(stats.count || 0)}회`, `- 오늘 출석 순위: ${Number(stats.todayRanking || 0)}등`, `- 1등 횟수: ${Number(stats.firstCount || 0)}회`].join("\n");
  }
}

module.exports = AttendanceService;
