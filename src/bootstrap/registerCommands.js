// Register only implemented commands; attendance needs its repositories first.
module.exports = ({ commandManager }) => commandManager.register(require("../commands/system/ping"));
