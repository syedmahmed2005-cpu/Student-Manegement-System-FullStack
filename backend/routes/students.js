const express = require("express");

const router = express.Router();
const Student = require("../models/Student");

//CREATE STUDENT
router.post("/", async function (req, res) {
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

//GET ALL STUDENTS
router.get("/", async function (req, res) {
    try {  
        const students= await Student.find();
        res.status(200).json({
            message:"Students fetched successfully",
            students:students
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
router.get("/:id", async function (req, res) {
  try {
    const student = await Student.findById(req.params.id);

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
router.put("/:id", async function (req, res) {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
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
router.delete("/:id", async function (req, res) {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);

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