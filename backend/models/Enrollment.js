const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema(
  {
    enrollmentId: {
      type: String,
      unique: true,
      required: true,
    },
    studentId: {
      type: String,
      required: true,
      trim: true,
    },
    classId: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

enrollmentSchema.index({ studentId: 1, classId: 1 }, { unique: true });

enrollmentSchema.pre("validate", async function (next) {
  if (!this.enrollmentId) {
    this.enrollmentId = "ENR-" + Date.now();
  }
  next();
});

const Enrollment = mongoose.model("Enrollment", enrollmentSchema);

module.exports = Enrollment;
