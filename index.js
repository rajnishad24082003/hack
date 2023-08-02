const express = require("express");
const http = require("http");
const fs = require("fs");
const socketIO = require("socket.io");
const path = require("path");
const ss = require("desktop-screenshot");
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const PORT = 3000;

io.on("connection", (socket) => {
  console.log("A client connected");
  //sockets-start
  socket.on("RepeatScreenShotTake", (data) => {
    ss("ss/screenshot.png", (error) => {
      if (error) {
        console.log(error);
      } else {
        const imageData = fs.readFileSync(
          path.join(__dirname, "ss", "screenshot.png")
        );
        io.emit("RepeatScreenShotGet", imageData);
      }
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
app.get("/screenshot", (req, res) => {
  ss("ss/screenshot.png", (error) => {
    if (error) {
      return res.status(500).send(error);
    }
  });
  res.sendFile(path.join(__dirname, "public", "screenshot.html"));
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
