module.exports = class EventManager {
  constructor() { this.handlers = new Map(); }
  on(name, handler) {
    const handlers = this.handlers.get(name) || [];
    handlers.push(handler);
    this.handlers.set(name, handlers);
    return this;
  }
  async emit(name, event) {
    for (const handler of this.handlers.get(name) || []) await handler(event);
  }
};
