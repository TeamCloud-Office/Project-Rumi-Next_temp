module.exports = class Bot {
  constructor({ app, config, events }) { Object.assign(this, { app, config, events }); this.server = null; this.startHooks = []; this.stopHooks = []; }
  async handle(event) { await this.events.emit(event.type || "message", event); }
  onStart(hook) { this.startHooks.push(hook); return this; }
  onStop(hook) { this.stopHooks.push(hook); return this; }
  async start() {
    if (this.server) throw new Error("Bot already started");
    await new Promise((resolve, reject) => {
      this.server = this.app.listen(this.config.port, this.config.host);
      this.server.once("error", error => { this.server = null; reject(error); });
      this.server.once("listening", resolve);
    });
    for (const hook of this.startHooks) await hook();
    return this.server.address();
  }
  async stop({ graceMs = 5000 } = {}) {
    if (!this.server) return;
    if (this.stopping) return this.stopping;
    if (!Number.isInteger(graceMs) || graceMs < 0) throw new TypeError("Invalid shutdown grace period");
    const server = this.server;
    this.stopping = new Promise((resolve, reject) => {
      // Allow active requests to finish, then release stalled connections.
      const timer = setTimeout(() => server.closeAllConnections(), graceMs);
      timer.unref();
      server.close(error => {
        clearTimeout(timer);
        if (error) reject(error); else resolve();
      });
    });
    try { await this.stopping; for (const hook of this.stopHooks) await hook(); }
    finally { this.server = null; this.stopping = null; }
  }
};
