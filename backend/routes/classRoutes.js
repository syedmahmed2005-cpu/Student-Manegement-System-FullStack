const express = require("express");

const Class = require("../models/Class");
const Enrollment = require("../models/Enrollment");
const Attendance = require("../models/Attendance");
const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");

const router = express.Router();


// CREATE CLASS
router.post(
  "/",
  authenticate,
  authorize("admin"),
  async function (req, res) {
    try {
      const classItem = await Class.create(req.body);

      res.status(201).json({
        message: "Class created successfully",
        class: classItem,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message: "Failed to create class",
        error: error.message,
      });
    }
  }
);


// GET ALL CLASSES
router.get(
  "/",
  authenticate,
  authorize("admin", "faculty", "student"),
  async function (req, res) {
    try {
      const classes = await Class.find();

      res.status(200).json({
        message: "Classes fetched successfully",
        classes: classes,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message: "Failed to retrieve classes",
        error: error.message,
      });
    }
  }
);


// GET ONE CLASS
router.get(
  "/:id",
  authenticate,
  authorize("admin", "faculty", "student"),
  async function (req, res) {
    try {
      const classItem = await Class.findById(req.params.id);

      if (!classItem) {
        return res.status(404).json({
          message: "Class not found",
        });
      }

      res.status(200).json({
        message: "Class retrieved successfully",
        class: classItem,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message: "Failed to retrieve class",
        error: error.message,
      });
    }
  }
);


// DELETE CLASS
router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  async function (req, res) {
    try {
      const classItem = await Class.findById(req.params.id);

      if (!classItem) {
        return res.status(404).json({
          message: "Class not found",
        });
      }

      // Delete attendance records for this class
      await Attendance.deleteMany({
        classId: classItem._id.toString(),
      });

      // Delete enrollments for this class
      await Enrollment.deleteMany({
        classId: classItem._id.toString(),
      });

      // Delete the class
      await Class.findByIdAndDelete(req.params.id);

      res.status(200).json({
        message: "Class and related records deleted successfully",
        class: classItem,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message: "Failed to delete class",
        error: error.message,
      });
    }
  }
);

module.exports = router;