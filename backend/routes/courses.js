const express = require("express");
const Course = require("../models/Course");
const Class = require("../models/Class");
const Enrollment = require("../models/Enrollment");
const Attendance = require("../models/Attendance");
const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");

const router = express.Router();



// CREATE COURSE
router.post(
  "/",
  authenticate,
  authorize("admin"),
  async function (req, res) {
    try {
      const course = await Course.create(req.body);

      res.status(201).json({
        message: "Course created successfully",
        course: course,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message: "Failed to create course",
        error: error.message,
      });
    }
  }
);


// GET ALL COURSES
router.get(
  "/",
  authenticate,
  authorize("admin", "faculty", "student"),
  async function (req, res) {
    try {
      const courses = await Course.find();

      res.status(200).json({
        message: "Courses fetched successfully",
        courses: courses,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message: "Failed to retrieve courses",
        error: error.message,
      });
    }
  }
);


// GET ONE COURSE
router.get(
  "/:id",
  authenticate,
  authorize("admin", "faculty", "student"),
  async function (req, res) {
    try {
      const course = await Course.findById(req.params.id);

      if (!course) {
        return res.status(404).json({
          message: "Course not found",
        });
      }

      res.status(200).json({
        message: "Course retrieved successfully",
        course: course,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message: "Failed to retrieve course",
        error: error.message,
      });
    }
  }
);


// DELETE COURSE
router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  async function (req, res) {
    try {
      const course = await Course.findById(req.params.id);

      if (!course) {
        return res.status(404).json({
          message: "Course not found",
        });
      }

      // Find all classes using this course
      const classes = await Class.find({
        courseId: course.courseCode,
      });

      const classIds = classes.map(function (classItem) {
        return classItem._id;
      });

      // Delete attendance for these classes
      await Attendance.deleteMany({
        classId: { $in: classIds },
      });

      // Delete enrollments for these classes
      await Enrollment.deleteMany({
        classId: { $in: classIds },
      });

      // Delete the classes
      await Class.deleteMany({
        courseId: course.courseCode,
      });

      // Delete the course
      await Course.findByIdAndDelete(req.params.id);

      res.status(200).json({
      message: "Course and related records deleted successfully",
        course: course,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message: "Failed to delete course",
        error: error.message,
      });
    }
  }
);

module.exports = router;