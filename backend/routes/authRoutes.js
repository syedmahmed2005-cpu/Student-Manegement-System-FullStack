
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authenticate = require("../middleware/authMiddleware");

const router = express.Router();

// REGISTER
router.post("/register", async function (req, res) {
  try {
    const {
      name,
      email,
      password,
      role,
      studentId,
      facultyId
    } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        message: "Name, email, password and role are required"
      });
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase().trim()
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    // Student must have a studentId
    if (role === "student" && !studentId) {
      return res.status(400).json({
        message: "studentId is required for student accounts"
      });
    }

    // Faculty must have a facultyId
    if (role === "faculty" && !facultyId) {
      return res.status(400).json({
        message: "facultyId is required for faculty accounts"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role,
      studentId: role === "student" ? studentId : null,
      facultyId: role === "faculty" ? facultyId : null
    });

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        studentId: user.studentId,
        facultyId: user.facultyId
      }
    });

  } catch (error) {
    console.log("Registration error:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        message: "A user with these details already exists"
      });
    }

    res.status(500).json({
      message: "Server error"
    });
  }
});


// LOGIN
router.post("/login", async function (req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not configured");

      return res.status(500).json({
        message: "Server configuration error"
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim()
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h"
      }
    );

   const isProduction = process.env.NODE_ENV === "production";

res.cookie("token", token, {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  path: "/",
  maxAge: 60 * 60 * 1000,
});
    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        studentId: user.studentId,
        facultyId: user.facultyId
      }
    });

  } catch (error) {
    console.log("Login error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
});


// LOGOUT
router.post("/logout", function (req, res) {
  res.clearCookie("token", {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  path: "/"
});

  res.json({
    message: "Logout successful"
  });
});


// CURRENT USER
router.get("/me", authenticate, async function (req, res) {
  try {
    const user = await User.findById(req.user.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        studentId: user.studentId,
        facultyId: user.facultyId
      }
    });

  } catch (error) {
    console.log("Current user error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
});

//CHANGE PASSWORD
router.put("/change-password", authenticate, async function (req, res) {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Current password and new password are required"
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "New password must be at least 6 characters"
      });
    }

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Current password is incorrect"
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);

    await user.save();

    res.json({
      message: "Password changed successfully"
    });

  } catch (error) {
    console.log("Change password error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
});

module.exports = router;