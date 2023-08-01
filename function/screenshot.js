const ss = require("desktop-screenshot");
const path = require("path");
const fs = require("fs");

const screenshot = (req, res) => {
  res.setHeader("Content-Type", "image/png");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  ss("ss/screenshot.png", function (error, complete) {
    if (error) console.log("Screenshot failed", error);
    else console.log("Screenshot succeeded");
  });
  const imageData = fs.readFileSync(
    path.join(__dirname, "../", "ss", "screenshot.png")
  );
  res.status(200).write(imageData);
};
module.exports = screenshot;
