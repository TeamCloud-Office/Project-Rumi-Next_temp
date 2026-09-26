module.exports = class UserSelectionService {
  constructor({ ttlMs = 60000 } = {}) { this.ttlMs = ttlMs; this.pending = new Map(); }
  key(channelId, userId) { return `${channelId}:${userId}`; }
  set(channelId, userId, value) {
    const key = this.key(channelId, userId);
    const previous = this.pending.get(key);
    if (previous?.timer) clearTimeout(previous.timer);
    const entry = { ...value, createdAt: Date.now() };
    entry.timer = setTimeout(() => this.pending.delete(key), this.ttlMs);
    entry.timer.unref?.();
    this.pending.set(key, entry);
    return entry;
  }
  take(channelId, userId, index) {
    const key = this.key(channelId, userId);
    const entry = this.pending.get(key);
    if (!entry || Date.now() - entry.createdAt > this.ttlMs) { this.clear(channelId, userId); return null; }
    const selected = entry.users?.[Number(index) - 1];
    if (!selected) return { entry, selected: null };
    this.clear(channelId, userId);
    return { entry, selected };
  }
  has(channelId, userId) { return this.pending.has(this.key(channelId, userId)); }
  clear(channelId, userId) {
    const key = this.key(channelId, userId);
    const entry = this.pending.get(key);
    if (entry?.timer) clearTimeout(entry.timer);
    this.pending.delete(key);
  }
};
