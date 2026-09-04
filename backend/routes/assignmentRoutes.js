const express = require("express");
const mongoose = require("mongoose");

const Assignment = require("../models/Assignment");
const Submission = require("../models/Submission");
const Class = require("../models/Class");
const Enrollment = require("../models/Enrollment");
const Student = require("../models/Student");
const User = require("../models/User");

const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");

const router = express.Router();
const documentUpload = require("../middleware/documentUpload");

const {
  uploadDocument,
  deleteDocument,
} = require("../utils/cloudinaryUpload");

// CREATE ASSIGNMENT
router.post(
  "/",
  authenticate,
  authorize("faculty"),
  documentUpload,
  async function (req, res) {
    let uploadedFile = null;
    let assignmentCreated = false;

    try {
      const {
        title,
        description,
        classId,
        dueDate,
        totalMarks,
        status,
      } = req.body;

      if (
        !title ||
        !description ||
        !classId ||
        !dueDate ||
        !totalMarks
      ) {
        return res.status(400).json({
          message:
            "Title, description, class, due date and total marks are required",
        });
      }

      if (!mongoose.isValidObjectId(classId)) {
        return res.status(400).json({
          message: "Invalid class ID",
        });
      }

      const currentUser = await User.findById(
        req.user.userId
      );

      if (!currentUser || !currentUser.facultyId) {
        return res.status(403).json({
          message: "Faculty account is not linked correctly",
        });
      }

      const classItem = await Class.findById(classId);

      if (!classItem) {
        return res.status(404).json({
          message: "Class not found",
        });
      }

      if (
        classItem.facultyId !== currentUser.facultyId
      ) {
        return res.status(403).json({
          message:
            "You can only create assignments for your own classes",
        });
      }

      const parsedDueDate = new Date(dueDate);

      if (
        Number.isNaN(parsedDueDate.getTime()) ||
        parsedDueDate <= new Date()
      ) {
        return res.status(400).json({
          message: "Due date must be a valid future date",
        });
      }

      const parsedMarks = Number(totalMarks);

      if (
        !Number.isFinite(parsedMarks) ||
        parsedMarks <= 0
      ) {
        return res.status(400).json({
          message: "Total marks must be greater than zero",
        });
      }

      const allowedStatuses = [
        "draft",
        "published",
        "closed",
      ];

      const assignmentStatus = status || "published";

      if (!allowedStatuses.includes(assignmentStatus)) {
        return res.status(400).json({
          message: "Invalid assignment status",
        });
      }

      if (req.file) {
        uploadedFile = await uploadDocument(
          req.file.buffer,
          "educore/assignment-files"
        );
      }

      const assignment = await Assignment.create({
        title: String(title).trim(),
        description: String(description).trim(),
        classId: classId,
        dueDate: parsedDueDate,
        totalMarks: parsedMarks,
        status: assignmentStatus,

        attachmentUrl: uploadedFile
          ? uploadedFile.fileUrl
          : "",

        attachmentName: req.file
          ? req.file.originalname
          : "",

        attachmentPublicId: uploadedFile
          ? uploadedFile.publicId
          : "",

        createdBy: currentUser._id,
      });

      assignmentCreated = true;

      await assignment.populate(
        "createdBy",
        "name role"
      );

      res.status(201).json({
        message: "Assignment created successfully",
        assignment: assignment,
      });
    } catch (error) {
      console.log("Create assignment error:", error);

      if (
        uploadedFile &&
        uploadedFile.publicId &&
        !assignmentCreated
      ) {
        try {
          await deleteDocument(uploadedFile.publicId);
        } catch (cleanupError) {
          console.log(
            "Assignment file cleanup error:",
            cleanupError.message
          );
        }
      }

      res.status(500).json({
        message: "Failed to create assignment",
        error: error.message,
      });
    }
  }
);

// GET ROLE-FILTERED ASSIGNMENTS
router.get("/", authenticate, async function (req, res) {
  try {
    const currentUser = await User.findById(req.user.userId);

    if (!currentUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    let filter = {};

    if (currentUser.role === "faculty") {
      if (!currentUser.facultyId) {
        return res.status(403).json({
          message: "Faculty account is not linked correctly",
        });
      }

      const classes = await Class.find({
        facultyId: currentUser.facultyId,
      })
        .select("_id")
        .lean();

      filter.classId = {
        $in: classes.map(function (classItem) {
          return classItem._id.toString();
        }),
      };
    } else if (currentUser.role === "student") {
      if (!currentUser.studentId) {
        return res.status(403).json({
          message: "Student account is not linked correctly",
        });
      }

      const enrollments = await Enrollment.find({
        studentId: currentUser.studentId,
      })
        .select("classId")
        .lean();

      filter.classId = {
        $in: enrollments.map(function (enrollment) {
          return enrollment.classId;
        }),
      };

      filter.status = {
        $in: ["published", "closed"],
      };
    } else if (currentUser.role !== "admin") {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    const assignments = await Assignment.find(filter)
  .populate("createdBy", "name role")
  .sort({ createdAt: -1 });

const classIds = [
  ...new Set(
    assignments.map(function (assignment) {
      return assignment.classId;
    })
  ),
];

const relatedClasses = await Class.find({
  _id: { $in: classIds },
}).lean();

const classMap = {};

relatedClasses.forEach(function (classItem) {
  classMap[classItem._id.toString()] = classItem;
});

const assignmentResults = assignments.map(function (assignment) {
  return {
    ...assignment.toObject(),
    classDetails: classMap[assignment.classId] || null,
  };
});

res.status(200).json({
  message: "Assignments fetched successfully",
  assignments: assignmentResults,
});
  } catch (error) {
    console.log("Get assignments error:", error);

    res.status(500).json({
      message: "Failed to retrieve assignments",
      error: error.message,
    });
  }
});


// SUBMIT OR UPDATE ASSIGNMENT
router.post(
  "/:id/submit",
  authenticate,
  authorize("student"),
  documentUpload,
  async function (req, res) {
    let uploadedFile = null;
    let submissionSaved = false;

    try {
      if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({
          message: "Invalid assignment ID",
        });
      }

      const currentUser = await User.findById(
        req.user.userId
      );

      if (!currentUser || !currentUser.studentId) {
        return res.status(403).json({
          message: "Student account is not linked correctly",
        });
      }

      const assignment = await Assignment.findById(
        req.params.id
      );

      if (!assignment) {
        return res.status(404).json({
          message: "Assignment not found",
        });
      }

      if (assignment.status !== "published") {
        return res.status(400).json({
          message:
            "This assignment is not accepting submissions",
        });
      }

      if (new Date() > assignment.dueDate) {
        return res.status(400).json({
          message: "The assignment deadline has passed",
        });
      }

      const enrollment = await Enrollment.findOne({
        studentId: currentUser.studentId,
        classId: assignment.classId,
      });

      if (!enrollment) {
        return res.status(403).json({
          message: "You are not enrolled in this class",
        });
      }

      const existingSubmission =
        await Submission.findOne({
          assignmentId: assignment._id,
          studentId: currentUser.studentId,
        });

      const submissionText = String(
        req.body.submissionText || ""
      ).trim();

      const hasExistingFile = Boolean(
        existingSubmission &&
          existingSubmission.fileUrl
      );

      if (
        !submissionText &&
        !req.file &&
        !hasExistingFile
      ) {
        return res.status(400).json({
          message:
            "Submission text or a file is required",
        });
      }

      if (req.file) {
        uploadedFile = await uploadDocument(
          req.file.buffer,
          "educore/submission-files"
        );
      }

      const updateData = {
        submissionText: submissionText,
        submittedAt: new Date(),
        status: "submitted",
        marks: null,
        feedback: "",
        gradedAt: null,
        gradedBy: null,
      };

      if (uploadedFile) {
        updateData.fileUrl = uploadedFile.fileUrl;
        updateData.fileName = req.file.originalname;
        updateData.filePublicId = uploadedFile.publicId;
      }

      const submission =
        await Submission.findOneAndUpdate(
          {
            assignmentId: assignment._id,
            studentId: currentUser.studentId,
          },
          {
            $set: updateData,

            $setOnInsert: {
              assignmentId: assignment._id,
              studentId: currentUser.studentId,
            },
          },
          {
            new: true,
            upsert: true,
            runValidators: true,
            setDefaultsOnInsert: true,
          }
        );

      submissionSaved = true;

      if (
        uploadedFile &&
        existingSubmission &&
        existingSubmission.filePublicId &&
        existingSubmission.filePublicId !==
          uploadedFile.publicId
      ) {
        try {
          await deleteDocument(
            existingSubmission.filePublicId
          );
        } catch (cleanupError) {
          console.log(
            "Old submission file cleanup error:",
            cleanupError.message
          );
        }
      }

      res.status(200).json({
        message: existingSubmission
          ? "Submission updated successfully"
          : "Assignment submitted successfully",

        submission: submission,
      });
    } catch (error) {
      console.log("Submit assignment error:", error);

      if (
        uploadedFile &&
        uploadedFile.publicId &&
        !submissionSaved
      ) {
        try {
          await deleteDocument(uploadedFile.publicId);
        } catch (cleanupError) {
          console.log(
            "New submission file cleanup error:",
            cleanupError.message
          );
        }
      }

      if (error.code === 11000) {
        return res.status(400).json({
          message:
            "A submission already exists for this assignment",
        });
      }

      res.status(500).json({
        message: "Failed to submit assignment",
        error: error.message,
      });
    }
  }
);

// GET CURRENT STUDENT'S SUBMISSION
router.get(
  "/:id/my-submission",
  authenticate,
  authorize("student"),
  async function (req, res) {
    try {
      if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({
          message: "Invalid assignment ID",
        });
      }

      const currentUser = await User.findById(req.user.userId);

      if (!currentUser || !currentUser.studentId) {
        return res.status(403).json({
          message: "Student account is not linked correctly",
        });
      }

      const assignment = await Assignment.findById(req.params.id);

      if (!assignment) {
        return res.status(404).json({
          message: "Assignment not found",
        });
      }

      const enrollment = await Enrollment.findOne({
        studentId: currentUser.studentId,
        classId: assignment.classId,
      });

      if (!enrollment || assignment.status === "draft") {
        return res.status(403).json({
          message: "You cannot access this assignment",
        });
      }

      const submission = await Submission.findOne({
        assignmentId: assignment._id,
        studentId: currentUser.studentId,
      }).populate("gradedBy", "name");

      res.status(200).json({
        message: "Submission fetched successfully",
        submission: submission,
      });
    } catch (error) {
      console.log("Get student submission error:", error);

      res.status(500).json({
        message: "Failed to retrieve submission",
        error: error.message,
      });
    }
  }
);


// GET ALL STUDENTS AND SUBMISSIONS FOR AN ASSIGNMENT
router.get(
  "/:id/submissions",
  authenticate,
  authorize("admin", "faculty"),
  async function (req, res) {
    try {
      if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({
          message: "Invalid assignment ID",
        });
      }

      const currentUser = await User.findById(req.user.userId);
      const assignment = await Assignment.findById(req.params.id);

      if (!currentUser) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      if (!assignment) {
        return res.status(404).json({
          message: "Assignment not found",
        });
      }

      if (
        currentUser.role === "faculty" &&
        assignment.createdBy.toString() !== currentUser._id.toString()
      ) {
        return res.status(403).json({
          message: "You can only view submissions for your assignments",
        });
      }

      const enrollments = await Enrollment.find({
        classId: assignment.classId,
      }).lean();

      const studentIds = enrollments.map(function (enrollment) {
        return enrollment.studentId;
      });

      const students = await Student.find({
        studentId: { $in: studentIds },
      })
        .select(
          "studentId firstName lastName rollNumber registrationNumber"
        )
        .lean();

      const submissions = await Submission.find({
        assignmentId: assignment._id,
      })
        .populate("gradedBy", "name")
        .sort({ submittedAt: -1 });

      const submissionMap = {};

      submissions.forEach(function (submission) {
        submissionMap[submission.studentId] = submission;
      });

      const records = students.map(function (student) {
        return {
          student: student,
          submission: submissionMap[student.studentId] || null,
        };
      });

      const submittedCount = records.filter(function (record) {
        return record.submission !== null;
      }).length;

      const gradedCount = records.filter(function (record) {
        return (
          record.submission &&
          record.submission.status === "graded"
        );
      }).length;

      res.status(200).json({
        message: "Assignment submissions fetched successfully",
        assignment: assignment,
        summary: {
          totalStudents: records.length,
          submitted: submittedCount,
          notSubmitted: records.length - submittedCount,
          graded: gradedCount,
        },
        records: records,
      });
    } catch (error) {
      console.log("Get assignment submissions error:", error);

      res.status(500).json({
        message: "Failed to retrieve assignment submissions",
        error: error.message,
      });
    }
  }
);


// GRADE A SUBMISSION
router.patch(
  "/submissions/:submissionId/grade",
  authenticate,
  authorize("faculty"),
  async function (req, res) {
    try {
      if (!mongoose.isValidObjectId(req.params.submissionId)) {
        return res.status(400).json({
          message: "Invalid submission ID",
        });
      }

      const currentUser = await User.findById(req.user.userId);
      const submission = await Submission.findById(
        req.params.submissionId
      );

      if (!currentUser) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      if (!submission) {
        return res.status(404).json({
          message: "Submission not found",
        });
      }

      const assignment = await Assignment.findById(
        submission.assignmentId
      );

      if (!assignment) {
        return res.status(404).json({
          message: "Assignment not found",
        });
      }

      if (
        assignment.createdBy.toString() !== currentUser._id.toString()
      ) {
        return res.status(403).json({
          message: "You can only grade submissions for your assignments",
        });
      }

      const marks = Number(req.body.marks);

      if (
        req.body.marks === undefined ||
        req.body.marks === null ||
        req.body.marks === "" ||
        !Number.isFinite(marks) ||
        marks < 0 ||
        marks > assignment.totalMarks
      ) {
        return res.status(400).json({
          message: `Marks must be between 0 and ${assignment.totalMarks}`,
        });
      }

      submission.marks = marks;
      submission.feedback = String(req.body.feedback || "").trim();
      submission.status = "graded";
      submission.gradedAt = new Date();
      submission.gradedBy = currentUser._id;

      await submission.save();
      await submission.populate("gradedBy", "name");

      res.status(200).json({
        message: "Submission graded successfully",
        submission: submission,
      });
    } catch (error) {
      console.log("Grade submission error:", error);

      res.status(500).json({
        message: "Failed to grade submission",
        error: error.message,
      });
    }
  }
);


// GET ONE ASSIGNMENT
router.get("/:id", authenticate, async function (req, res) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid assignment ID",
      });
    }

    const currentUser = await User.findById(req.user.userId);

    if (!currentUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const assignment = await Assignment.findById(req.params.id)
      .populate("createdBy", "name role");

    if (!assignment) {
      return res.status(404).json({
        message: "Assignment not found",
      });
    }

    const classItem = await Class.findById(assignment.classId);

    if (!classItem) {
      return res.status(404).json({
        message: "Related class not found",
      });
    }

    if (currentUser.role === "faculty") {
      if (classItem.facultyId !== currentUser.facultyId) {
        return res.status(403).json({
          message: "You cannot access this assignment",
        });
      }
    } else if (currentUser.role === "student") {
      const enrollment = await Enrollment.findOne({
        studentId: currentUser.studentId,
        classId: assignment.classId,
      });

      if (!enrollment || assignment.status === "draft") {
        return res.status(403).json({
          message: "You cannot access this assignment",
        });
      }
    } else if (currentUser.role !== "admin") {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    res.status(200).json({
      message: "Assignment fetched successfully",
      assignment: assignment,
      class: classItem,
    });
  } catch (error) {
    console.log("Get assignment error:", error);

    res.status(500).json({
      message: "Failed to retrieve assignment",
      error: error.message,
    });
  }
});


// UPDATE ASSIGNMENT
router.put(
  "/:id",
  authenticate,
  authorize("faculty"),
  documentUpload,
  async function (req, res) {
    let uploadedFile = null;
    let assignmentSaved = false;
    let previousPublicId = "";

    try {
      if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({
          message: "Invalid assignment ID",
        });
      }

      const currentUser = await User.findById(
        req.user.userId
      );

      const assignment = await Assignment.findById(
        req.params.id
      );

      if (!currentUser) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      if (!assignment) {
        return res.status(404).json({
          message: "Assignment not found",
        });
      }

      if (
        assignment.createdBy.toString() !==
        currentUser._id.toString()
      ) {
        return res.status(403).json({
          message:
            "You can only edit your own assignments",
        });
      }

      previousPublicId =
        assignment.attachmentPublicId || "";

      if (req.body.classId !== undefined) {
        if (
          !mongoose.isValidObjectId(req.body.classId)
        ) {
          return res.status(400).json({
            message: "Invalid class ID",
          });
        }

        const classItem = await Class.findById(
          req.body.classId
        );

        if (!classItem) {
          return res.status(404).json({
            message: "Class not found",
          });
        }

        if (
          classItem.facultyId !== currentUser.facultyId
        ) {
          return res.status(403).json({
            message: "You can only use your own classes",
          });
        }

        assignment.classId = req.body.classId;
      }

      if (req.body.title !== undefined) {
        const title = String(req.body.title).trim();

        if (!title) {
          return res.status(400).json({
            message: "Title cannot be empty",
          });
        }

        assignment.title = title;
      }

      if (req.body.description !== undefined) {
        const description = String(
          req.body.description
        ).trim();

        if (!description) {
          return res.status(400).json({
            message: "Description cannot be empty",
          });
        }

        assignment.description = description;
      }

      if (req.body.dueDate !== undefined) {
        const dueDate = new Date(req.body.dueDate);

        if (
          Number.isNaN(dueDate.getTime()) ||
          dueDate <= new Date()
        ) {
          return res.status(400).json({
            message:
              "Due date must be a valid future date",
          });
        }

        assignment.dueDate = dueDate;
      }

      if (req.body.totalMarks !== undefined) {
        const totalMarks = Number(
          req.body.totalMarks
        );

        if (
          !Number.isFinite(totalMarks) ||
          totalMarks <= 0
        ) {
          return res.status(400).json({
            message:
              "Total marks must be greater than zero",
          });
        }

        assignment.totalMarks = totalMarks;
      }

      if (req.body.status !== undefined) {
        const allowedStatuses = [
          "draft",
          "published",
          "closed",
        ];

        if (
          !allowedStatuses.includes(req.body.status)
        ) {
          return res.status(400).json({
            message: "Invalid assignment status",
          });
        }

        assignment.status = req.body.status;
      }

      const removeAttachment =
        req.body.removeAttachment === true ||
        req.body.removeAttachment === "true";

      if (req.file) {
        uploadedFile = await uploadDocument(
          req.file.buffer,
          "educore/assignment-files"
        );

        assignment.attachmentUrl =
          uploadedFile.fileUrl;

        assignment.attachmentName =
          req.file.originalname;

        assignment.attachmentPublicId =
          uploadedFile.publicId;
      } else if (removeAttachment) {
        assignment.attachmentUrl = "";
        assignment.attachmentName = "";
        assignment.attachmentPublicId = "";
      }

      await assignment.save();

      assignmentSaved = true;

      await assignment.populate(
        "createdBy",
        "name role"
      );

      const attachmentWasReplaced =
        uploadedFile &&
        previousPublicId &&
        previousPublicId !== uploadedFile.publicId;

      const attachmentWasRemoved =
        removeAttachment &&
        !uploadedFile &&
        previousPublicId;

      if (
        attachmentWasReplaced ||
        attachmentWasRemoved
      ) {
        try {
          await deleteDocument(previousPublicId);
        } catch (cleanupError) {
          console.log(
            "Old assignment file cleanup error:",
            cleanupError.message
          );
        }
      }

      res.status(200).json({
        message: "Assignment updated successfully",
        assignment: assignment,
      });
    } catch (error) {
      console.log("Update assignment error:", error);

      if (
        uploadedFile &&
        uploadedFile.publicId &&
        !assignmentSaved
      ) {
        try {
          await deleteDocument(uploadedFile.publicId);
        } catch (cleanupError) {
          console.log(
            "New assignment file cleanup error:",
            cleanupError.message
          );
        }
      }

      res.status(500).json({
        message: "Failed to update assignment",
        error: error.message,
      });
    }
  }
);

// DELETE ASSIGNMENT
router.delete(
  "/:id",
  authenticate,
  authorize("admin", "faculty"),
  async function (req, res) {
    try {
      if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({
          message: "Invalid assignment ID",
        });
      }

      const currentUser = await User.findById(
        req.user.userId
      );

      const assignment = await Assignment.findById(
        req.params.id
      );

      if (!currentUser) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      if (!assignment) {
        return res.status(404).json({
          message: "Assignment not found",
        });
      }

      if (
        currentUser.role === "faculty" &&
        assignment.createdBy.toString() !==
          currentUser._id.toString()
      ) {
        return res.status(403).json({
          message:
            "You can only delete your own assignments",
        });
      }

      const submissions = await Submission.find({
        assignmentId: assignment._id,
      })
        .select("filePublicId")
        .lean();

      const publicIds = submissions
        .map(function (submission) {
          return submission.filePublicId;
        })
        .filter(Boolean);

      if (assignment.attachmentPublicId) {
        publicIds.push(
          assignment.attachmentPublicId
        );
      }

      await Submission.deleteMany({
        assignmentId: assignment._id,
      });

      await assignment.deleteOne();

      const deletionResults = await Promise.allSettled(
        publicIds.map(function (publicId) {
          return deleteDocument(publicId);
        })
      );

      deletionResults.forEach(function (result) {
        if (result.status === "rejected") {
          console.log(
            "Cloudinary file cleanup error:",
            result.reason?.message || result.reason
          );
        }
      });

      res.status(200).json({
        message: "Assignment deleted successfully",
      });
    } catch (error) {
      console.log("Delete assignment error:", error);

      res.status(500).json({
        message: "Failed to delete assignment",
        error: error.message,
      });
    }
  }
);


module.exports = router;