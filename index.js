// index.js
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const runJob = require("./agent");

const app = express();
app.use(bodyParser.json());

// Webhook route
app.post("/webhook", async (req, res) => {
  console.log("⚡ Webhook received:", req.body);
  res.sendStatus(202);                 // Immediate 202 Accepted
  try { await runJob(req.body); }      // Fire-and-forget
  catch (e) { console.error(e); }
});

const port = process.env.PORT || 4000;
app.listen(port, () =>
  console.log(`🚀  Server listening on http://localhost:${port}`)
);
