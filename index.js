const express = require("express");
const http = require("http");
const fs = require("fs");
const socketIO = require("socket.io");
const path = require("path");
const sharp = require("sharp");
const screenshot = require("screenshot-desktop");
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const PORT = 3000;

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

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
