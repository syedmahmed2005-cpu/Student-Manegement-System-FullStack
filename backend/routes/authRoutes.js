const express = require("express");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const User=require("../models/User");
const authenticate = require("../middleware/authMiddleware");


const router = express.Router();

router.post("/register", async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            role,
            studentId,
            facultyId
        } = req.body;

        const existingUser = await User.findOne({ email });

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
            name,
            email,
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
        console.log(error);

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
});
//LOGIN
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

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

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 60 * 60 * 1000
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
        res.status(500).json({
            message: "Server error"
        });
    }
});

//LOGOUT
router.post("/logout", (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        sameSite: "lax",
        secure: false
    });

    res.json({
        message: "Logout Successful"
    });
});

//CURRENT USER
router.get("/me", authenticate, async (req, res) => {
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
        res.status(500).json({
            message: "Server error"
        });
    }
});


//Testing 
router.get("/test", authenticate, (req, res) => {
    res.json({
        message: "Authentication successful",
        user: req.user
    });
});
const authorize = require("../middleware/authorize");

router.get(
    "/admin-test",
    authenticate,
    authorize("faculty"),
    (req, res) => {
        res.json({
            message: "Admin access granted",
            user: req.user
        });
    }
);

module.exports = router;
