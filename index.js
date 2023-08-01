const fs = require("fs");
const path = require("path");
const express = require("express");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 3948;

app.get("/", (req, res) => {
  res.status(200).send("home page");
});
app.listen(PORT, () => {
  console.log(`server listing on port ${PORT}`);
});
