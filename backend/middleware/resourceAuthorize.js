const User = require("../models/User");

const authorizeStudent = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (user.role === "admin") {
            return next();
        }

        if (user.role !== "student") {
            return res.status(403).json({
                message: "Access denied"
            });
        }

        if (user.studentId !== req.params.studentId) {
            return res.status(403).json({
                message: "You can only access your own student data"
            });
        }

        next();

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


const authorizeFaculty = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (user.role === "admin") {
            return next();
        }

        if (user.role !== "faculty") {
            return res.status(403).json({
                message: "Access denied"
            });
        }

        if (user.facultyId !== req.params.facultyId) {
            return res.status(403).json({
                message: "You can only access your own faculty data"
            });
        }

        next();

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


module.exports = {
    authorizeStudent,
    authorizeFaculty
};