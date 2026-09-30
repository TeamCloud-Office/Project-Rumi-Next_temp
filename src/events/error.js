module.exports = () => async event => { console.error(`[Rumi ${event.event || "event"}]`, event.error || event); };
