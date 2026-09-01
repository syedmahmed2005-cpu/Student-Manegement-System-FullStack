const express = require("express");

const router = express.Router();
const Student = require("../models/Student");
const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");
const Enrollment = require("../models/Enrollment");
const Attendance = require("../models/Attendance");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const sendStudentCredentials = require("../services/emailService");



// CREATE STUDENT
router.post(
  "/",
  authenticate,
  authorize("admin"),
  async function (req, res) {
    try {
      const { email, firstName, lastName } = req.body;

      // Check if email already belongs to a login account
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res.status(400).json({
          message: "A user account with this email already exists",
        });
      }

      // Check if email already belongs to another student
      const existingStudent = await Student.findOne({ email });

      if (existingStudent) {
        return res.status(400).json({
          message: "A student with this email already exists",
        });
      }

      // Generate temporary password
      const temporaryPassword = crypto
        .randomBytes(6)
        .toString("base64")
        .replace(/[^a-zA-Z0-9]/g, "")
        .slice(0, 10);

      // Create student
      const student = await Student.create(req.body);

      try {
        // Hash password
        const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

        // Create login account
        await User.create({
          name: `${firstName} ${lastName}`,
          email: email,
          password: hashedPassword,
          role: "student",
          studentId: student.studentId,
        });

        // Send credentials
        await sendStudentCredentials(
          email,
          `${firstName} ${lastName}`,
          student.studentId,
          temporaryPassword
        );
      } catch (accountError) {
        // Remove student if account/email process fails
        await Student.findByIdAndDelete(student._id);

        throw accountError;
      }

      res.status(201).json({
        message: "Student created and login credentials sent successfully",
        student: student,
      });
    } catch (error) {
      console.log(error);

      // Duplicate key error
      if (error.code === 11000) {
        return res.status(400).json({
          message: "A student with one of these unique details already exists",
          error: error.message,
        });
      }

      res.status(500).json({
        message: "Failed to create student",
        error: error.message,
      });
    }
  }
);

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
    const student = await Student.findById(req.params.studentId);

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    // Delete related enrollments
    await Enrollment.deleteMany({
      studentId: student.studentId,
    });

    // Delete related attendance records
    await Attendance.deleteMany({
      studentId: student.studentId,
    });

    // Delete student login account
    await User.deleteOne({
      studentId: student.studentId,
    });

    // Delete student
    await Student.findByIdAndDelete(req.params.studentId);

    res.status(200).json({
      message: "Student and related records deleted successfully",
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
