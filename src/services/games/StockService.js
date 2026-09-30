const DEFAULTS = ["얼리언스", "블루라인", "에코그린", "쇼넥트"].map(name => ({ name, price: 500, diff: 0 }));
const parseInventory = value => { try { return JSON.parse(value || "{}") || {}; } catch { return {}; } };
module.exports = class StockService {
  constructor({ repository, userService, config, random = Math.random, now = () => new Date() }) { Object.assign(this, { repository, userService, config, random, now }); }
  async ensure() { if (!(await this.repository.list()).length) for (const stock of DEFAULTS) await this.repository.save({ ...stock, updatedAt: this.now().getTime() }); }
  isOpen(date = this.now()) { const hour = date.getHours(); return hour >= this.config.bankHours[0] && hour < this.config.bankHours[1]; }
  async updatePrices() {
    await this.ensure(); const now = this.now().getTime();
    for (const row of await this.repository.list()) {
      const steps = Math.min(144, Math.floor((now - Number(row.updatedAt || now)) / 600000)); if (steps <= 0) continue;
      let price = Number(row.price || 1), previous = price;
      for (let index = 0; index < steps; index += 1) price = Math.max(1, Math.floor(price + (this.random() - 0.5) * price * 0.3));
      await this.repository.save({ ...row, price, diff: price - previous, updatedAt: now });
    }
  }
  async list() { await this.updatePrices(); return this.repository.list(); }
  async trade(name, count, direction) {
    const quantity = Number(count); if (!Number.isSafeInteger(quantity) || quantity <= 0) throw new RangeError("거래 수량이 올바르지 않아요.");
    if (!this.isOpen()) throw new Error(`현재는 주식 거래 시간이 아니에요. 주식 거래 시간: ${this.config.bankHours[0]}시 ~ ${this.config.bankHours[1]}시`);
    await this.updatePrices(); const stock = await this.repository.find(name); if (!stock) throw new Error(`"${name}"은(는) 없는 주식이에요.`);
    const user = await this.userService.get(); const inventory = parseInventory(user.inventory); inventory.stockItem ||= {};
    const total = Number(stock.price) * quantity;
    if (direction === "buy") {
      if (Number(user.star || 0) < total) throw new Error("스타가 부족해요.");
      inventory.stockItem[name] = Number(inventory.stockItem[name] || 0) + quantity;
      await this.userService.update({ star: Number(user.star || 0) - total, inventory: JSON.stringify(inventory) });
    } else {
      if (Number(inventory.stockItem[name] || 0) < quantity) throw new Error(`소지하고 있는 "${name}" 주식이 부족해요.`);
      inventory.stockItem[name] -= quantity; if (!inventory.stockItem[name]) delete inventory.stockItem[name];
      await this.userService.update({ star: Number(user.star || 0) + total, inventory: JSON.stringify(inventory) });
    }
    return { stock, quantity, total, direction };
  }
};
