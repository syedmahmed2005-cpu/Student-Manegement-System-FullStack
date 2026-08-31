const dns = require("dns");

dns.setServers(["8.8.8.8", "1.1.1.1"]);


require("dotenv").config();

console.log("MONGODB_URI exists:", !!process.env.MONGODB_URI);
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");

const app = express();
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

connectDB();

const studentRoutes = require("./routes/students");
const facultyRoutes = require("./routes/faculty");
const courseRoutes = require("./routes/courses");
const classRoutes = require("./routes/classRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const authRoutes = require("./routes/authRoutes");

app.get("/", function (req, res) {
  res.send("Student Management System Backend Server is running");
});

app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/faculty", facultyRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/attendance", attendanceRoutes);

app.listen(5000, function () {
  console.log("Backend server is running on port 5000");
});
