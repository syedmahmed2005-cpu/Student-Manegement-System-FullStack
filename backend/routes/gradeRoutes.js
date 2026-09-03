const express = require("express");
const Grade = require("../models/Grade");
const Student = require("../models/Student");
const Course = require("../models/Course");
const Class = require("../models/Class");
const Faculty = require("../models/Faculty");

const router = express.Router();


// Calculate grade details
function calculateGrade(marks) {
  const total =
    Number(marks.assignmentMarks) +
    Number(marks.quizMarks) +
    Number(marks.midtermMarks) +
    Number(marks.finalMarks) +
    Number(marks.practicalMarks) +
    Number(marks.participationMarks);

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
    percentage,
    letterGrade,
    gpaPoints,
  };
}


// Add student, course, class and faculty information
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


// GET all grades
router.get("/", async function (req, res) {
  try {
    const grades = await Grade.find().sort({ createdAt: -1 });

    const enrichedGrades = await enrichGrades(grades);

    res.json(enrichedGrades);
  } catch (error) {
    console.error("Error fetching grades:", error);

    res.status(500).json({
      message: "Failed to fetch grades",
    });
  }
});


// GET grades for a specific student
router.get("/student/:studentId", async function (req, res) {
  try {
    const grades = await Grade.find({
      studentId: req.params.studentId,
    }).sort({ createdAt: -1 });

    const enrichedGrades = await enrichGrades(grades);

    res.json(enrichedGrades);
  } catch (error) {
    console.error("Error fetching student grades:", error);

    res.status(500).json({
      message: "Failed to fetch student grades",
    });
  }
});


// POST a new grade
router.post("/", async function (req, res) {
  try {
    const {
      studentId,
      courseId,
      classId,
      facultyId,
      semester,
      academicYear,
      assignmentMarks = 0,
      quizMarks = 0,
      midtermMarks = 0,
      finalMarks = 0,
      practicalMarks = 0,
      participationMarks = 0,
      remarks = "",
      status = "Draft",
    } = req.body;

    if (
      !studentId ||
      !courseId ||
      !classId ||
      !facultyId ||
      !semester ||
      !academicYear
    ) {
      return res.status(400).json({
        message: "All required grade information must be provided",
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

    const grade = await Grade.create({
      studentId,
      courseId,
      classId,
      facultyId,
      semester,
      academicYear,
      assignmentMarks,
      quizMarks,
      midtermMarks,
      finalMarks,
      practicalMarks,
      participationMarks,
      ...calculated,
      remarks,
      status,
    });

    res.status(201).json(grade);
  } catch (error) {
    console.error("Error creating grade:", error);

    res.status(500).json({
      message: "Failed to create grade",
    });
  }
});


// PUT update a grade
router.put("/:id", async function (req, res) {
  try {
    const {
      assignmentMarks = 0,
      quizMarks = 0,
      midtermMarks = 0,
      finalMarks = 0,
      practicalMarks = 0,
      participationMarks = 0,
      remarks = "",
      status,
    } = req.body;

    const calculated = calculateGrade({
      assignmentMarks,
      quizMarks,
      midtermMarks,
      finalMarks,
      practicalMarks,
      participationMarks,
    });

    const updatedGrade = await Grade.findByIdAndUpdate(
      req.params.id,
      {
        assignmentMarks,
        quizMarks,
        midtermMarks,
        finalMarks,
        practicalMarks,
        participationMarks,
        ...calculated,
        remarks,
        ...(status && { status }),
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedGrade) {
      return res.status(404).json({
        message: "Grade not found",
      });
    }

    res.json(updatedGrade);
  } catch (error) {
    console.error("Error updating grade:", error);

    res.status(500).json({
      message: "Failed to update grade",
    });
  }
});


// DELETE a grade
router.delete("/:id", async function (req, res) {
  try {
    const deletedGrade = await Grade.findByIdAndDelete(req.params.id);

    if (!deletedGrade) {
      return res.status(404).json({
        message: "Grade not found",
      });
    }

    res.json({
      message: "Grade deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting grade:", error);

    res.status(500).json({
      message: "Grade deleted successfully",
    });
  }
});


module.exports = router;