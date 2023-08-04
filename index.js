const express = require("express");
const http = require("http");
const fs = require("fs");
const socketIO = require("socket.io");
const path = require("path");
const sharp = require("sharp");
const screenshot = require("screenshot-desktop");
const app = express();
const NodeWebcam = require("node-webcam");
const server = http.createServer(app);
const io = socketIO(server);
const PORT = 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "assets")));
app.use(express.static(path.join(__dirname, "pictures")));
const opts = {
  width: 1280,
  height: 720,
  quality: 100,
  delay: 0,
  output: "png",
  device: false,
  callbackReturn: "base64",
};
const Webcam = NodeWebcam.create(opts);
function captureAndServeImage(res) {
  Webcam.capture(
    path.join(__dirname, "pictures", "cameraImage"),
    (err, data) => {
      if (err) {
        console.error("Error capturing image:", err);
        res.writeHead(500);
        res.end("Error capturing image");
      } else {
        res.status(200).sendFile(path.join(__dirname, "public", "camera.html"));
      }
    }
  );
}
io.on("connection", (socket) => {
  console.log("A client connected");
  //sockets-start
  socket.on("RepeatScreenShotTake", (data) => {
    screenshot({ format: "png" })
      .then((imgBuffer) => {
        sharp(imgBuffer)
          .toFormat("webp", { quality: 50 })
          .toBuffer()
          .then((webpBuffer) => {
            io.emit("RepeatScreenShotGet", webpBuffer);
          })
          .catch((err) => {
            console.error("Error converting to WebP:", err);
          });
      })
      .catch((err) => {
        console.error("Error taking screenshot:", err);
      });
  });
  //sockets-end
  socket.on("disconnect", () => {
    console.log("A client disconnected");
  });
});
app.get("/", (req, res) => {
  res.status(200).end("home page");
});
app.get("/screenshot", async (req, res) => {
  res.sendFile(path.join(__dirname, "public", "screenshot.html"));
});
app.get("/files", async (req, res) => {
  try {
    let checker = await fs.promises.stat(req.query.path);
    if (checker.isDirectory()) {
      let result = [];
      try {
        const files = await fs.promises.readdir(req.query.path);
        let pathChecker = req.query.path;
        for (let i = 0; i < files.length; i++) {
          try {
            let filePath;
            if (pathChecker != "/") {
              filePath = `${pathChecker}/${files[i]}`;
            } else {
              filePath = `/${files[i]}`;
            }
            const fileStats = await fs.promises.stat(filePath);
            if (fileStats.isDirectory()) {
              result.push({
                name: files[i],
                isFile: false,
                notAcessible: false,
              });
            } else {
              result.push({
                name: files[i],
                isFile: true,
                notAcessible: false,
              });
            }
          } catch (error) {
            result.push({ name: files[i], isFile: true, notAcessible: true });
          }
        }
        let resultObj = { wholeData: result };
        res.render("files", resultObj);
      } catch (err) {
        console.error("Error reading folder:", err);
        res.status(500).send("Error reading folder");
      }
    } else {
      fs.readFile(req.query.path, (err, data) => {
        if (err) {
          res.status(400).end("error");
        }
        res.send(data);
      });
    }
  } catch (error) {
    res.send(error.message);
  }
});
app.get("/camera", (req, res) => {
  captureAndServeImage(res);
});
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
