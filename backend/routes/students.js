const express = require("express");

const router = express.Router();
const Student = require("../models/Student");
const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");

// CREATE STUDENT
router.post("/",
  authenticate,
  authorize("admin"),
   async function (req, res) {
  try {
    const student = await Student.create(req.body);

    res.status(201).json({
      message: "Student created successfully",
      student: student,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to create student",
      error: error.message,
    });
  }
});

// GET ALL STUDENTS
router.get("/",
  authenticate,
  authorize("admin", "faculty"),
  async function (req, res) {
  try {
    const students = await Student.find();

    res.status(200).json({
      message: "Students fetched successfully",
      students: students,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to retrieve students",
      error: error.message,
    });
  }
});

// GET ONE STUDENT
router.get("/:studentId", authenticate, authorize("admin", "faculty"), async function (req, res) {
  try {
    const student = await Student.findById(req.params.studentId);

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    res.status(200).json({
      message: "Student retrieved successfully",
      student: student,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to retrieve student",
      error: error.message,
    });
  }
});

// UPDATE STUDENT
router.put("/:studentId",
  authenticate,
  authorize("admin"),
  async function (req, res) {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.studentId,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    res.status(200).json({
      message: "Student updated successfully",
      student: student,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to update student",
      error: error.message,
    });
  }
});

// DELETE STUDENT
router.delete("/:studentId", authenticate, authorize("admin"), async function (req, res) {
  try {
    const student = await Student.findByIdAndDelete(req.params.studentId);

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    res.status(200).json({
      message: "Student deleted successfully",
      student: student,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to delete student",
      error: error.message,
    });
  }
});

module.exports = router;
