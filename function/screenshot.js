const ss = require("desktop-screenshot");
const path = require("path");
const fs = require("fs");

const screenshot = (req, res) => {
  ss("ss/screenshot.png", (error) => {
    if (error) {
      return res.status(500).send(error);
    }
    const imagePath = path.join(__dirname, "../", "ss", "screenshot.png");
    const imageData = fs.createReadStream(imagePath);
    imageData.on("data", (chunks) => {
      res.write(chunks);
    });
    imageData.on("end", () => {
      console.log("done");
      //screenshot(req, res);
      //res.send("done");
    });
  });
};

module.exports = screenshot;
