const express = require("express");
const Faculty = require("../models/Faculty");
const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");

const router = express.Router();

router.post("/",
  authenticate,
  authorize("admin"),
  async function (req, res) {
  try {
    const faculty = await Faculty.create(req.body);
    res.status(201).json({ message: "Faculty created successfully", faculty: faculty });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to create faculty", error: error.message });
  }
});

router.get("/",
  authenticate,
  authorize("admin", "faculty"),
  async function (req, res) {
  try {
    const faculty = await Faculty.find();
    res.status(200).json({ message: "Faculty fetched successfully", faculty: faculty });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to retrieve faculty", error: error.message });
  }
});

router.get("/:facultyId",
  authenticate,
  authorize("admin", "faculty"),
  async function (req, res) {
  try {
    const faculty = await Faculty.findById(req.params.facultyId);
    if (!faculty) return res.status(404).json({ message: "Faculty member not found" });
    res.status(200).json({ message: "Faculty retrieved successfully", faculty: faculty });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to retrieve faculty", error: error.message });
  }
});

router.put("/:facultyId",
  authenticate,
  authorize("admin"),
  async function (req, res) {
  try {
    const faculty = await Faculty.findByIdAndUpdate(req.params.facultyId, req.body, { new: true, runValidators: true });
    if (!faculty) return res.status(404).json({ message: "Faculty member not found" });
    res.status(200).json({ message: "Faculty updated successfully", faculty: faculty });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to update faculty", error: error.message });
  }
});

router.delete("/:facultyId",
  authenticate,
  authorize("admin"),
  async function (req, res) {
  try {
    const faculty = await Faculty.findByIdAndDelete(req.params.facultyId);
    if (!faculty) return res.status(404).json({ message: "Faculty member not found" });
    res.status(200).json({ message: "Faculty deleted successfully", faculty: faculty });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to delete faculty", error: error.message });
  }
});

module.exports = router;
