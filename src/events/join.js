const createMemberHandler = require("./memberEvent");
module.exports = container => createMemberHandler(container, "join");
