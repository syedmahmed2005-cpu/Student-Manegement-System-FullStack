const express = require("express");
const Announcement = require("../models/Announcement");
const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");

const router = express.Router();

router.get("/", authenticate, async function (req, res) {
  try {
    const announcements = await Announcement.find()
      .populate("createdBy", "name")
      .sort({ createdAt: -1 });

    res.json({ announcements });
  } catch (error) {
    console.log("Get announcements error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
});

router.post("/", authenticate, authorize("admin"), async function (req, res) {
  try {
    const { title, message, targetAudience } = req.body;

    if (!title || !message) {
      return res.status(400).json({
        message: "Title and message are required"
      });
    }

    const announcement = await Announcement.create({
      title,
      message,
      targetAudience: targetAudience || "all",
      createdBy: req.user.userId
    });

    res.status(201).json({
      message: "Announcement created successfully",
      announcement
    });
  } catch (error) {
    console.log("Create announcement error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
});

router.delete("/:id", authenticate, authorize("admin"), async function (req, res) {
  try {
    const announcement = await Announcement.findByIdAndDelete(req.params.id);

    if (!announcement) {
      return res.status(404).json({
        message: "Announcement not found"
      });
    }

    res.json({
      message: "Announcement deleted successfully"
    });
  } catch (error) {
    console.log("Delete announcement error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
});

module.exports = router;