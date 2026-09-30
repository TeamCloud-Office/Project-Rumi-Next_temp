const crypto = require("node:crypto");

const emptyInventory = () => ({ badgeItem: [], foodItem: {}, ticketItem: {}, stockItem: {} });
const parseInventory = value => {
  try { return { ...emptyInventory(), ...(JSON.parse(value || "{}") || {}) }; }
  catch { return emptyInventory(); }
};

module.exports = class UserService {
  constructor({ repository, channelId, userId }) {
    this.repository = repository;
    this.channelId = String(channelId);
    this.userId = String(userId);
  }
  async get() { return this.repository.findByPrivateId(this.channelId, this.userId); }
  async create(name) {
    if (await this.get()) return { created: false, user: await this.get() };
    let publicId;
    do { publicId = crypto.randomBytes(5).toString("base64url").slice(0, 6).toUpperCase(); }
    while (await this.repository.findByPublicId(this.channelId, publicId));
    const date = new Intl.DateTimeFormat("ko-KR", { timeZone: "Asia/Seoul", dateStyle: "long" }).format(new Date());
    const user = { privateId: this.userId, publicId, name: String(name || this.userId), signupDate: date, star: 0, admin: 0, ban: 0, banReason: null, banDate: null, warn: 0, favorability: 0, inventory: JSON.stringify(emptyInventory()) };
    await this.repository.save(this.channelId, user);
    return { created: true, user };
  }
  async update(patch) {
    const user = await this.get();
    if (!user) return null;
    await this.repository.save(this.channelId, { ...user, ...patch, privateId: this.userId });
    return this.get();
  }
  async addStar(amount) {
    const user = await this.get();
    if (!user) return null;
    return this.update({ star: Number(user.star || 0) + Number(amount) });
  }
  async setBan(value, reason = null, date = new Date()) {
    const { formatKoreanDate, formatDateTime } = require("../../utils/dateTime");
    return this.update({
      ban: value ? 1 : 0,
      banReason: value ? String(reason || "").trim() || null : null,
      banDate: value ? `${formatKoreanDate(date)} ${formatDateTime(date).slice(11, 16)}` : null,
    });
  }
  async setAdmin(value) { return this.update({ admin: value ? 1 : 0 }); }
  async setWarning(value) { return this.update({ warn: Number(value) }); }
  async setFavorability(value) { return this.update({ favorability: Number(value) }); }
  async info() {
    const user = await this.get();
    if (!user) return null;
    const badges = parseInventory(user.inventory).badgeItem;
    return { ...user, star: Number(user.star || 0), warn: Number(user.warn || 0), favorability: Number(user.favorability || 0), admin: Boolean(user.admin), ban: Boolean(user.ban), badges: Array.isArray(badges) ? badges : [] };
  }
};
