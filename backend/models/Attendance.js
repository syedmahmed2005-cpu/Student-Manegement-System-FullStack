const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    attendanceId: { type: String, unique: true, required: true },
    studentId: { type: String, required: true, trim: true },
    classId: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    status: { type: String, required: true, enum: ["present", "absent"] },
  },
  { timestamps: true }
);

attendanceSchema.index({ studentId: 1, classId: 1, date: 1 }, { unique: true });

const Attendance = mongoose.model("Attendance", attendanceSchema);

module.exports = Attendance;
