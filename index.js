const path = require("path");
const fs = require("fs");
const express = require("express");
const app = express();
const PORT = 3000;
app.use(express.static(path.join(__dirname, "assets")));
const camera = require("./function/camera");
const screenshot = require("./function/screenshot");

app.get("/", (req, res) => {
  res.send("home page");
});
app.get("/camera", (req, res) => {
  camera(req, res);
});
app.get("/screenshot", (req, res) => {
  screenshot(req, res);
});

app.listen(PORT, () => {
  console.log(`server listening on port : ${PORT}`);
});
