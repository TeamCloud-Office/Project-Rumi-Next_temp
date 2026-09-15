const express = require("express");
const JSONBigInt = require("json-bigint")({ storeAsString: true, strict: true });
module.exports = [
  express.raw({ type: () => true, limit: "4mb" }),
  (req, res, next) => {
    if (!Buffer.isBuffer(req.body)) return res.status(400).json({ ok: false, error: "Expected JSON body" });
    try { req.body = JSONBigInt.parse(req.body.toString("utf8")); next(); }
    catch { console.warn("Invalid Iris webhook: invalid JSON"); res.status(400).json({ ok: false, error: "Invalid JSON" }); }
  },
];
