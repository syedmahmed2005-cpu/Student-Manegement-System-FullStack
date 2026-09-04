const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    classId: {
      type: String,
      required: true,
      trim: true,
    },

    dueDate: {
      type: Date,
      required: true,
    },

    totalMarks: {
      type: Number,
      required: true,
      min: 1,
    },

    attachmentUrl: {
      type: String,
      default: "",
      trim: true,
    },

    attachmentName: {
      type: String,
      default: "",
      trim: true,
    },

    status: {
      type: String,
      enum: ["draft", "published", "closed"],
      default: "published",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

assignmentSchema.index({ classId: 1, createdAt: -1 });

module.exports = mongoose.model("Assignment", assignmentSchema);