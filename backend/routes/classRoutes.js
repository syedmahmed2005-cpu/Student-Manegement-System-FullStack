const express = require("express");
const Class = require("../models/Class");

const router = express.Router();

router.post("/", async function (req, res) {
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
});

router.get("/", async function (req, res) {
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
});

router.get("/:id", async function (req, res) {
  try {
    const classItem = await Class.findById(req.params.id);
    if (!classItem) {
      return res.status(404).json({ message: "Class not found" });
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
});

router.delete("/:id", async function (req, res) {
  try {
    const classItem = await Class.findByIdAndDelete(req.params.id);
    if (!classItem) {
      return res.status(404).json({ message: "Class not found" });
    }
    res.status(200).json({
      message: "Class deleted successfully",
      class: classItem,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to delete class",
      error: error.message,
    });
  }
});

module.exports = router;
