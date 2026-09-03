const express = require("express");

const Grade = require("../models/Grade");
const Student = require("../models/Student");
const Course = require("../models/Course");
const Class = require("../models/Class");
const Faculty = require("../models/Faculty");
const User = require("../models/User");

const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");

const router = express.Router();


// CALCULATE GRADE
function calculateGrade(marks) {
  const total =
    Number(marks.assignmentMarks || 0) +
    Number(marks.quizMarks || 0) +
    Number(marks.midtermMarks || 0) +
    Number(marks.finalMarks || 0) +
    Number(marks.practicalMarks || 0) +
    Number(marks.participationMarks || 0);

  const percentage = total;

  let letterGrade;
  let gpaPoints;

  if (percentage >= 85) {
    letterGrade = "A";
    gpaPoints = 4.0;
  } else if (percentage >= 80) {
    letterGrade = "A-";
    gpaPoints = 3.7;
  } else if (percentage >= 75) {
    letterGrade = "B+";
    gpaPoints = 3.3;
  } else if (percentage >= 70) {
    letterGrade = "B";
    gpaPoints = 3.0;
  } else if (percentage >= 65) {
    letterGrade = "B-";
    gpaPoints = 2.7;
  } else if (percentage >= 60) {
    letterGrade = "C+";
    gpaPoints = 2.3;
  } else if (percentage >= 55) {
    letterGrade = "C";
    gpaPoints = 2.0;
  } else if (percentage >= 50) {
    letterGrade = "D";
    gpaPoints = 1.0;
  } else {
    letterGrade = "F";
    gpaPoints = 0.0;
  }

  return {
    totalMarks: total,
    percentage: percentage,
    letterGrade: letterGrade,
    gpaPoints: gpaPoints,
  };
}


// GET GRADES
router.get(
  "/",
  authenticate,
  authorize("admin", "faculty", "student"),
  async function (req, res) {
    try {
      let grades;

      if (req.user.role === "student") {
        const user = await User.findById(req.user.userId);

        if (!user || !user.studentId) {
          return res.status(404).json({
            message: "Student account not found",
          });
        }

        grades = await Grade.find({
          studentId: user.studentId,
          status: "Published",
        });
      } else if (req.user.role === "faculty") {
        const user = await User.findById(req.user.userId);

        if (!user || !user.facultyId) {
          return res.status(404).json({
            message: "Faculty account not found",
          });
        }

        grades = await Grade.find({
          facultyId: user.facultyId,
        });
      } else {
        grades = await Grade.find();
      }

      const enrichedGrades = await enrichGrades(grades);

      res.status(200).json(enrichedGrades);
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message: "Failed to retrieve grades",
        error: error.message,
      });
    }
  }
);


// GET STUDENT GRADES
router.get(
  "/student/:studentId",
  authenticate,
  authorize("admin", "faculty", "student"),
  async function (req, res) {
    try {
      if (req.user.role === "student") {
        const user = await User.findById(req.user.userId);

        if (!user || user.studentId !== req.params.studentId) {
          return res.status(403).json({
            message: "You are not allowed to view these grades",
          });
        }
      }

      const grades = await Grade.find({
        studentId: req.params.studentId,
        status: "Published",
      });

      const enrichedGrades = await enrichGrades(grades);

      res.status(200).json(enrichedGrades);
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message: "Failed to retrieve student grades",
        error: error.message,
      });
    }
  }
);


// CREATE OR UPDATE GRADE
router.post(
  "/",
  authenticate,
  authorize("admin", "faculty"),
  async function (req, res) {
    try {
      const {
        studentId,
        classId,
        assignmentMarks,
        quizMarks,
        midtermMarks,
        finalMarks,
        practicalMarks,
        participationMarks,
        remarks,
        status,
      } = req.body;

      const classItem = await Class.findById(classId);

      if (!classItem) {
        return res.status(404).json({
          message: "Class not found",
        });
      }

      let facultyId;

      if (req.user.role === "faculty") {
        const user = await User.findById(req.user.userId);

        if (!user || !user.facultyId) {
          return res.status(404).json({
            message: "Faculty account not found",
          });
        }

        if (classItem.facultyId !== user.facultyId) {
          return res.status(403).json({
            message: "You are not allowed to enter grades for this class",
          });
        }

        facultyId = user.facultyId;
      } else {
        facultyId = classItem.facultyId;
      }

      const student = await Student.findOne({
        studentId: studentId,
      });

      if (!student) {
        return res.status(404).json({
          message: "Student not found",
        });
      }

      const enrollment = await require("../models/Enrollment").findOne({
        studentId: studentId,
        classId: classId,
      });

      if (!enrollment) {
        return res.status(400).json({
          message: "Student is not enrolled in this class",
        });
      }

      const course = await Course.findOne({
        courseCode: classItem.courseId,
      });

      if (!course) {
        return res.status(404).json({
          message: "Course not found",
        });
      }

      const calculated = calculateGrade({
        assignmentMarks,
        quizMarks,
        midtermMarks,
        finalMarks,
        practicalMarks,
        participationMarks,
      });
        const markLimits = {
        assignmentMarks: 10,
        quizMarks: 10,
        midtermMarks: 25,
        finalMarks: 35,
        practicalMarks: 10,
        participationMarks: 10,
        };

        for (const field in markLimits) {
        const value = Number(req.body[field] || 0);

        if (value < 0 || value > markLimits[field]) {
            return res.status(400).json({
            message: `${field.replace("Marks", "")} marks must be between 0 and ${markLimits[field]}.`,
            });
        }
        }
      const grade = await Grade.findOneAndUpdate(
        {
          studentId: studentId,
          classId: classId,
        },
        {
          studentId: studentId,
          courseId: classItem.courseId,
          classId: classId,
          facultyId: facultyId,
          semester: classItem.semester,
          academicYear: new Date().getFullYear().toString(),

          assignmentMarks: Number(assignmentMarks || 0),
          quizMarks: Number(quizMarks || 0),
          midtermMarks: Number(midtermMarks || 0),
          finalMarks: Number(finalMarks || 0),
          practicalMarks: Number(practicalMarks || 0),
          participationMarks: Number(participationMarks || 0),

          totalMarks: calculated.totalMarks,
          percentage: calculated.percentage,
          letterGrade: calculated.letterGrade,
          gpaPoints: calculated.gpaPoints,

          remarks: remarks || "",
          status: status === "Published" ? "Published" : "Draft",
        },
        {
          new: true,
          upsert: true,
          runValidators: true,
        }
      );

      res.status(200).json({
        message: "Grade saved successfully",
        grade: grade,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message: "Failed to save grade",
        error: error.message,
      });
    }
  }
);


// DELETE GRADE
router.delete(
  "/:id",
  authenticate,
  authorize("admin", "faculty"),
  async function (req, res) {
    try {
      const grade = await Grade.findById(req.params.id);

      if (!grade) {
        return res.status(404).json({
          message: "Grade not found",
        });
      }

      if (req.user.role === "faculty") {
        const user = await User.findById(req.user.userId);

        if (!user || user.facultyId !== grade.facultyId) {
          return res.status(403).json({
            message: "You are not allowed to delete this grade",
          });
        }
      }

      await Grade.findByIdAndDelete(req.params.id);

      res.status(200).json({
        message: "Grade deleted successfully",
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message: "Failed to delete grade",
        error: error.message,
      });
    }
  }
);


// ENRICH GRADES WITH NAMES
async function enrichGrades(grades) {
  return Promise.all(
    grades.map(async function (grade) {
      const student = await Student.findOne({
        studentId: grade.studentId,
      }).lean();

      const course = await Course.findOne({
        courseCode: grade.courseId,
      }).lean();

      const classItem = await Class.findById(grade.classId).lean();

      const faculty = await Faculty.findOne({
        facultyId: grade.facultyId,
      }).lean();

      return {
        ...grade.toObject(),

        studentName: student
          ? `${student.firstName} ${student.lastName}`
          : grade.studentId,

        courseName: course
          ? course.courseName
          : grade.courseId,

        courseCode: course
          ? course.courseCode
          : grade.courseId,

        classInfo: classItem
          ? {
              id: classItem._id,
              batchId: classItem.batchId,
              semester: classItem.semester,
            }
          : null,

        facultyName: faculty
          ? `${faculty.firstName} ${faculty.lastName}`
          : grade.facultyId,
      };
    })
  );
}


module.exports = router;