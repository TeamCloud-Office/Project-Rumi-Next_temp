module.exports = (error, req, res, next) => {
  console.error("HTTP request failed:", error);
  if (res.headersSent) return next(error);
  const status = error.status === 413 ? 413 : 500;
  res.status(status).json({ ok: false, error: status === 413 ? "Payload too large" : "Internal server error" });
};
