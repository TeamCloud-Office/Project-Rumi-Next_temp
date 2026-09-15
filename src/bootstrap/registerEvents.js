module.exports = container => container.events.on("message", require("../events/message")(container));
