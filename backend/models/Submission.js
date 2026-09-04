const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
  {
    assignmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
    },

    studentId: {
      type: String,
      required: true,
      trim: true,
    },

    submissionText: {
      type: String,
      default: "",
      trim: true,
    },

    fileUrl: {
      type: String,
      default: "",
      trim: true,
    },

    fileName: {
      type: String,
      default: "",
      trim: true,
    },
    filePublicId: {
    type: String,
    default: "",
    trim: true,
    },

    submittedAt: {
      type: Date,
      default: Date.now,
    },

    status: {
      type: String,
      enum: ["submitted", "graded"],
      default: "submitted",
    },

    marks: {
      type: Number,
      min: 0,
      default: null,
    },

    feedback: {
      type: String,
      default: "",
      trim: true,
    },

    gradedAt: {
      type: Date,
      default: null,
    },

    gradedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

submissionSchema.index(
  {
    assignmentId: 1,
    studentId: 1,
  },
  {
    unique: true,
  }
);

submissionSchema.pre("validate", async function () {
  if (!this.submissionText && !this.fileUrl) {
    throw new Error(
      "Submission must contain text or an uploaded file"
    );
  }
});

module.exports = mongoose.model("Submission", submissionSchema);