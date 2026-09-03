const mongoose = require("mongoose");

const gradeSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
      required: true,
      trim: true,
    },

    courseId: {
      type: String,
      required: true,
      trim: true,
    },

    classId: {
      type: String,
      required: true,
      trim: true,
    },

    facultyId: {
      type: String,
      required: true,
      trim: true,
    },

    semester: {
      type: String,
      required: true,
      trim: true,
    },

    academicYear: {
      type: String,
      required: true,
      trim: true,
    },

    assignmentMarks: {
      type: Number,
      default: 0,
      min: 0,
    },

    quizMarks: {
      type: Number,
      default: 0,
      min: 0,
    },

    midtermMarks: {
      type: Number,
      default: 0,
      min: 0,
    },

    finalMarks: {
      type: Number,
      default: 0,
      min: 0,
    },

    practicalMarks: {
      type: Number,
      default: 0,
      min: 0,
    },

    participationMarks: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalMarks: {
      type: Number,
      default: 0,
    },

    percentage: {
      type: Number,
      default: 0,
    },

    letterGrade: {
      type: String,
      default: null,
    },

    gpaPoints: {
      type: Number,
      default: 0,
    },

    remarks: {
      type: String,
      default: "",
      trim: true,
    },

    status: {
      type: String,
      enum: ["Draft", "Published"],
      default: "Draft",
    },
  },
  {
    timestamps: true,
  }
);

gradeSchema.index(
  { studentId: 1, classId: 1 },
  { unique: true }
);

module.exports = mongoose.model("Grade", gradeSchema);