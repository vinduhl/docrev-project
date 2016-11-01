const express = require("express");
const session = require("express-session");
const { json } = require("body-parser");
const multer = require("multer");
const mongoose = require("mongoose");
const cors = require("cors");

const port = 3000;

const app = express();
app.use(express.static("./public"));
app.use(json());
app.use(cors());

app.listen(port, function() {
  console.log(`Express running. Port: ${port}`);
});
