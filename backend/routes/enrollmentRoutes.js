const express = require("express");
const Enrollment = require("../models/Enrollment");
const Student = require("../models/Student");
const Class = require("../models/Class");

const router = express.Router();

router.post("/", async function (req, res) {
  try {
    let student = await Student.findOne({ studentId: req.body.studentId });

    if (!student) {
      try {
        student = await Student.findById(req.body.studentId);
      } catch (error) {
        student = null;
      }
    }
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const classItem = await Class.findById(req.body.classId);
    if (!classItem) {
      return res.status(404).json({ message: "Class not found" });
    }

    if (student.batchId !== classItem.batchId) {
      return res.status(400).json({
        message: "Student does not belong to the batch of this class",
      });
    }

    const existingEnrollment = await Enrollment.findOne({
      studentId: req.body.studentId,
      classId: req.body.classId,
    });

    if (existingEnrollment) {
      return res.status(400).json({
        message: "Student is already enrolled in this class",
      });
    }

    const enrollment = await Enrollment.create({
      studentId: student.studentId || student._id.toString(),
      classId: req.body.classId,
    });

    res.status(201).json({
      message: "Student enrolled successfully",
      enrollment: enrollment,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to create enrollment",
      error: error.message,
    });
  }
});

router.get("/", async function (req, res) {
  try {
    const enrollments = await Enrollment.find();
    res.status(200).json({
      message: "Enrollments fetched successfully",
      enrollments: enrollments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to retrieve enrollments", error: error.message });
  }
});

router.get("/:id", async function (req, res) {
  try {
    const enrollment = await Enrollment.findById(req.params.id);
    if (!enrollment) return res.status(404).json({ message: "Enrollment not found" });
    res.status(200).json({ message: "Enrollment retrieved successfully", enrollment: enrollment });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to retrieve enrollment", error: error.message });
  }
});

router.delete("/:id", async function (req, res) {
  try {
    const enrollment = await Enrollment.findByIdAndDelete(req.params.id);
    if (!enrollment) return res.status(404).json({ message: "Enrollment not found" });
    res.status(200).json({ message: "Enrollment removed successfully", enrollment: enrollment });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to delete enrollment", error: error.message });
  }
});

module.exports = router;
