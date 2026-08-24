const express = require("express");
const Attendance = require("../models/Attendance");
const Enrollment = require("../models/Enrollment");
const Student = require("../models/Student");
const Class = require("../models/Class");

const router = express.Router();

router.post("/", async function (req, res) {
  try {
    const { studentId, classId, date, status } = req.body;
    const attendanceDate = new Date(date);

    if (!date || isNaN(attendanceDate.getTime())) {
      return res.status(400).json({ message: "A valid attendance date is required" });
    }

    if (status !== "present" && status !== "absent") {
      return res.status(400).json({ message: "Attendance status must be present or absent" });
    }

    const student = await Student.findOne({ studentId: studentId });
    if (!student) return res.status(404).json({ message: "Student not found" });

    const classItem = await Class.findById(classId);
    if (!classItem) return res.status(404).json({ message: "Class not found" });

    const enrollment = await Enrollment.findOne({ studentId: studentId, classId: classId });
    if (!enrollment) return res.status(400).json({ message: "Student is not enrolled in this class" });

    const existingAttendance = await Attendance.findOne({
      studentId: studentId,
      classId: classId,
      date: attendanceDate,
    });

    if (existingAttendance) {
      existingAttendance.status = status;
      await existingAttendance.save();
      return res.status(200).json({ message: "Attendance updated successfully", attendance: existingAttendance });
    }

    const attendance = await Attendance.create({
      attendanceId: "ATT-" + studentId + "-" + classId + "-" + date,
      studentId: studentId,
      classId: classId,
      date: attendanceDate,
      status: status,
    });

    res.status(201).json({ message: "Attendance created successfully", attendance: attendance });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to save attendance", error: error.message });
  }
});

router.get("/", async function (req, res) {
  try {
    const attendance = await Attendance.find();
    res.status(200).json({ message: "Attendance fetched successfully", attendance: attendance });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to retrieve attendance", error: error.message });
  }
});

router.get("/:id", async function (req, res) {
  try {
    const attendance = await Attendance.findById(req.params.id);
    if (!attendance) return res.status(404).json({ message: "Attendance not found" });
    res.status(200).json({ message: "Attendance retrieved successfully", attendance: attendance });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to retrieve attendance", error: error.message });
  }
});

router.delete("/:id", async function (req, res) {
  try {
    const attendance = await Attendance.findByIdAndDelete(req.params.id);
    if (!attendance) return res.status(404).json({ message: "Attendance not found" });
    res.status(200).json({ message: "Attendance deleted successfully", attendance: attendance });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to delete attendance", error: error.message });
  }
});

module.exports = router;
