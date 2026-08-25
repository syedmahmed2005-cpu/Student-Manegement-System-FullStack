const express = require("express");
const Attendance = require("../models/Attendance");
const Enrollment = require("../models/Enrollment");
const Student = require("../models/Student");
const Class = require("../models/Class");
const Faculty = require("../models/Faculty");
const Course = require("../models/Course");

const router = express.Router();

router.post("/", async function (req, res) {
  try {
    const { studentId, classId, date, status } = req.body;
    const attendanceDate = new Date(date);

    if (!date || isNaN(attendanceDate.getTime())) {
      return res.status(400).json({ message: "A valid attendance date is required" });
    }

    if (status !== "present" && status !== "absent") {
      return res.status(400).json({ message: "Attendance status must be present or absent" });
    }

    let student = await Student.findOne({ studentId: studentId });

    if (!student) {
      try {
        student = await Student.findById(studentId);
      } catch (error) {
        student = null;
      }
    }
    if (!student) return res.status(404).json({ message: "Student not found" });

    const classItem = await Class.findById(classId);
    if (!classItem) return res.status(404).json({ message: "Class not found" });

    const enrollment = await Enrollment.findOne({ studentId: studentId, classId: classId });
    if (!enrollment) return res.status(400).json({ message: "Student is not enrolled in this class" });

    const existingAttendance = await Attendance.findOne({
      studentId: studentId,
      classId: classId,
      date: attendanceDate,
    });

    if (existingAttendance) {
      existingAttendance.status = status;
      await existingAttendance.save();
      return res.status(200).json({ message: "Attendance updated successfully", attendance: existingAttendance });
    }

    const attendance = await Attendance.create({
      attendanceId: "ATT-" + studentId + "-" + classId + "-" + date,
      studentId: studentId,
      classId: classId,
      date: attendanceDate,
      status: status,
    });

    res.status(201).json({ message: "Attendance created successfully", attendance: attendance });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to save attendance", error: error.message });
  }
});

router.get("/", async function (req, res) {
  try {
    const attendance = await Attendance.find();
    res.status(200).json({ message: "Attendance fetched successfully", attendance: attendance });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to retrieve attendance", error: error.message });
  }
});

router.get("/faculty/:facultyId", async function (req, res) {
  try {
    const faculty = await Faculty.findOne({ facultyId: req.params.facultyId });

    if (!faculty) {
      return res.status(404).json({ message: "Faculty member not found" });
    }

    const classes = await Class.find({ facultyId: faculty.facultyId });
    const classIds = classes.map(function (classItem) {
      return classItem._id.toString();
    });
    const courseCodes = classes.map(function (classItem) {
      return classItem.courseId;
    });
    const courses = await Course.find({ courseCode: { $in: courseCodes } });
    const enrollments = await Enrollment.find({ classId: { $in: classIds } });
    const attendance = await Attendance.find({ classId: { $in: classIds } });

    const classAttendance = classes.map(function (classItem) {
      const classId = classItem._id.toString();
      const records = attendance.filter(function (record) {
        return record.classId === classId;
      });
      const presentCount = records.filter(function (record) {
        return record.status === "present";
      }).length;
      const course = courses.find(function (courseItem) {
        return courseItem.courseCode === classItem.courseId;
      });

      return {
        class: classItem,
        course: course || null,
        enrolledStudents: enrollments.filter(function (enrollment) {
          return enrollment.classId === classId;
        }).length,
        presentCount: presentCount,
        absentCount: records.length - presentCount,
        attendancePercentage: records.length === 0
          ? 0
          : Math.round((presentCount / records.length) * 100),
      };
    });

    res.status(200).json({
      message: "Faculty attendance fetched successfully",
      faculty: faculty,
      classes: classAttendance,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to retrieve faculty attendance",
      error: error.message,
    });
  }
});

router.get("/faculty/:facultyId/class/:classId", async function (req, res) {
  try {
    const faculty = await Faculty.findOne({ facultyId: req.params.facultyId });

    if (!faculty) {
      return res.status(404).json({ message: "Faculty member not found" });
    }

    const classItem = await Class.findById(req.params.classId);

    if (!classItem) {
      return res.status(404).json({ message: "Class not found" });
    }

    if (classItem.facultyId !== faculty.facultyId) {
      return res.status(403).json({
        message: "This class is not assigned to the selected faculty member",
      });
    }

    const course = await Course.findOne({ courseCode: classItem.courseId });
    const enrollments = await Enrollment.find({
      classId: classItem._id.toString(),
    });
    const studentIds = enrollments.map(function (enrollment) {
      return enrollment.studentId;
    });
    const students = await Student.find({ studentId: { $in: studentIds } });
    const attendance = await Attendance.find({
      classId: classItem._id.toString(),
    }).sort({ date: 1 });

    const studentAttendance = enrollments.map(function (enrollment) {
      const records = attendance.filter(function (record) {
        return record.studentId === enrollment.studentId;
      });
      const presentCount = records.filter(function (record) {
        return record.status === "present";
      }).length;

      return {
        student: students.find(function (student) {
          return student.studentId === enrollment.studentId;
        }) || null,
        attendance: records,
        presentCount: presentCount,
        absentCount: records.length - presentCount,
        attendancePercentage: records.length === 0
          ? 0
          : Math.round((presentCount / records.length) * 100),
      };
    });

    res.status(200).json({
      message: "Class attendance fetched successfully",
      faculty: faculty,
      class: classItem,
      course: course || null,
      students: studentAttendance,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to retrieve class attendance",
      error: error.message,
    });
  }
});

router.get("/student/:studentId", async function (req, res) {
  try {
    const student = await Student.findOne({ studentId: req.params.studentId });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const enrollments = await Enrollment.find({ studentId: student.studentId });
    const classIds = enrollments.map(function (enrollment) {
      return enrollment.classId;
    });
    const classes = await Class.find({ _id: { $in: classIds } });
    const courseCodes = classes.map(function (classItem) {
      return classItem.courseId;
    });
    const courses = await Course.find({ courseCode: { $in: courseCodes } });
    const attendance = await Attendance.find({ studentId: student.studentId })
      .sort({ date: 1 });

    const classAttendance = enrollments.map(function (enrollment) {
      const classItem = classes.find(function (item) {
        return item._id.toString() === enrollment.classId;
      });

      if (!classItem) {
        return null;
      }

      const records = attendance.filter(function (record) {
        return record.classId === enrollment.classId;
      });
      const presentCount = records.filter(function (record) {
        return record.status === "present";
      }).length;

      return {
        class: classItem,
        course: courses.find(function (course) {
          return course.courseCode === classItem.courseId;
        }) || null,
        attendance: records,
        presentCount: presentCount,
        absentCount: records.length - presentCount,
        attendancePercentage: records.length === 0
          ? 0
          : Math.round((presentCount / records.length) * 100),
      };
    }).filter(function (item) {
      return item !== null;
    });

    res.status(200).json({
      message: "Student attendance fetched successfully",
      student: student,
      classes: classAttendance,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to retrieve student attendance",
      error: error.message,
    });
  }
});

router.get("/:id", async function (req, res) {
  try {
    const attendance = await Attendance.findById(req.params.id);
    if (!attendance) return res.status(404).json({ message: "Attendance not found" });
    res.status(200).json({ message: "Attendance retrieved successfully", attendance: attendance });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to retrieve attendance", error: error.message });
  }
});

router.delete("/:id", async function (req, res) {
  try {
    const attendance = await Attendance.findByIdAndDelete(req.params.id);
    if (!attendance) return res.status(404).json({ message: "Attendance not found" });
    res.status(200).json({ message: "Attendance deleted successfully", attendance: attendance });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to delete attendance", error: error.message });
  }
});

module.exports = router;
