const express = require("express");
const Enrollment = require("../models/Enrollment");
const Student = require("../models/Student");
const Class = require("../models/Class");

const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");

const router = express.Router();


// CREATE ENROLLMENT
router.post(
  "/",
  authenticate,
  authorize("admin"),
  async function (req, res) {
    try {
      let student = await Student.findOne({
        studentId: req.body.studentId,
      });

      if (!student) {
        try {
          student = await Student.findById(req.body.studentId);
        } catch (error) {
          student = null;
        }
      }

      if (!student) {
        return res.status(404).json({
          message: "Student not found",
        });
      }

      const classItem = await Class.findById(req.body.classId);

      if (!classItem) {
        return res.status(404).json({
          message: "Class not found",
        });
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
  }
);


// GET ALL ENROLLMENTS
router.get(
  "/",
  authenticate,
  authorize("admin", "faculty"),
  async function (req, res) {
    try {
      const enrollments = await Enrollment.find();

      res.status(200).json({
        message: "Enrollments fetched successfully",
        enrollments: enrollments,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message: "Failed to retrieve enrollments",
        error: error.message,
      });
    }
  }
);
// GET STUDENTS ENROLLED IN A CLASS
router.get(
  "/class/:classId",
  authenticate,
  authorize("admin", "faculty"),
  async function (req, res) {
    try {
      const enrollments = await Enrollment.find({
        classId: req.params.classId,
      });

      const students = await Promise.all(
        enrollments.map(async function (enrollment) {
          const student = await Student.findOne({
            studentId: enrollment.studentId,
          });

          if (!student) {
            return null;
          }

          return {
            studentId: student.studentId,
            firstName: student.firstName,
            lastName: student.lastName,
            rollNumber: student.rollNumber,
            registrationNumber: student.registrationNumber,
          };
        })
      );

      res.status(200).json({
        message: "Class students fetched successfully",
        students: students.filter(function (student) {
          return student !== null;
        }),
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message: "Failed to retrieve class students",
        error: error.message,
      });
    }
  }
);

// GET ONE ENROLLMENT
router.get(
  "/:id",
  authenticate,
  authorize("admin", "faculty"),
  async function (req, res) {
    try {
      const enrollment = await Enrollment.findById(req.params.id);

      if (!enrollment) {
        return res.status(404).json({
          message: "Enrollment not found",
        });
      }

      res.status(200).json({
        message: "Enrollment retrieved successfully",
        enrollment: enrollment,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message: "Failed to retrieve enrollment",
        error: error.message,
      });
    }
  }
);


// DELETE ENROLLMENT
router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  async function (req, res) {
    try {
      const enrollment = await Enrollment.findByIdAndDelete(req.params.id);

      if (!enrollment) {
        return res.status(404).json({
          message: "Enrollment not found",
        });
      }

      res.status(200).json({
        message: "Enrollment removed successfully",
        enrollment: enrollment,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message: "Failed to delete enrollment",
        error: error.message,
      });
    }
  }
);


module.exports = router;