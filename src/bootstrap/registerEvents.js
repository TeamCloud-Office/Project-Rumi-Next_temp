module.exports = container => {
  container.events.on("message", require("../events/message")(container));
  for (const name of ["join", "leave", "kick", "deleteMessage", "hideMessage", "changeProfile", "error"]) {
    const eventName = name === "deleteMessage" ? "delete" : name === "hideMessage" ? "hide" : name;
    container.events.on(eventName, require(`../events/${name}`)(container));
  }
};
