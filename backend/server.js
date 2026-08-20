const dns = require("dns");

dns.setServers(["8.8.8.8", "1.1.1.1"]);


require("dotenv").config();

console.log("MONGODB_URI exists:", !!process.env.MONGODB_URI);
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

const studentRoutes = require("./routes/students");

app.get("/", function (req, res) {
  res.send("Student Management System Backend Server is running");
});

app.use("/api/students", studentRoutes);

app.listen(5000, function () {
  console.log("Backend server is running on port 5000");
});