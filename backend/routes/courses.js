const express = require("express");
const Course = require("../models/Course");

const router = express.Router();

router.post("/", async function (req, res) {
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
});

router.get("/", async function (req, res) {
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
});

router.get("/:id", async function (req, res) {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
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
});

router.delete("/:id", async function (req, res) {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json({
      message: "Course deleted successfully",
      course: course,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to delete course",
      error: error.message,
    });
  }
});

module.exports = router;
