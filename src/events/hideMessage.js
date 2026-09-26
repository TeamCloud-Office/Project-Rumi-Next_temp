const createHandler = require("./messageModerationEvent");
module.exports = container => createHandler(container, "hide");
