const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
      unique: true,
      required: true,
    },

    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    batchId: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },

    rollNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    registrationNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    gender: {
      type: String,
      required: true,
    },

    dob: {
      type: Date,
      required: true,
    },

    department: {
      type: String,
      required: true,
      trim: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },

    country: {
      type: String,
      required: true,
      trim: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);


// Automatically generate student ID, roll number and registration number
studentSchema.pre("validate", async function () {

  // Generate global student ID
  if (!this.studentId) {
    const students = await mongoose
      .model("Student")
      .find({}, { studentId: 1 })
      .lean();

    let highestNumber = 0;

    students.forEach(function (student) {
      if (student.studentId) {
        const number = parseInt(
          student.studentId.replace("STU-", ""),
          10
        );

        if (!isNaN(number) && number > highestNumber) {
          highestNumber = number;
        }
      }
    });

    this.studentId =
      "STU-" + String(highestNumber + 1).padStart(3, "0");
  }


  // Generate department prefix
  const departmentPrefixes = {
    "Computer Science": "BCS",
    "Software Engineering": "BSE",
    "Electrical Engineering": "BEE",
    "Psychology": "PSY",
  };

  const prefix = departmentPrefixes[this.department];

  if (!prefix) {
    throw new Error(
      "Unsupported department. Use Computer Science, Software Engineering, Electrical Engineering, or Psychology."
    );
  }


  // Generate roll number and registration number
  if (!this.rollNumber || !this.registrationNumber) {

    const students = await mongoose
      .model("Student")
      .find(
        {
          department: this.department,
        },
        {
          rollNumber: 1,
        }
      )
      .lean();

    let highestNumber = 0;

    students.forEach(function (student) {
      if (student.rollNumber) {

        const number = parseInt(
          student.rollNumber.replace(prefix + "-", ""),
          10
        );

        if (!isNaN(number) && number > highestNumber) {
          highestNumber = number;
        }
      }
    });

    const nextNumber = String(highestNumber + 1).padStart(3, "0");

    this.rollNumber = prefix + "-" + nextNumber;

    this.registrationNumber =
      "REG-" + prefix + "-" + nextNumber;
  }
});


const Student = mongoose.model("Student", studentSchema);

module.exports = Student;