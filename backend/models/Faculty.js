const mongoose = require("mongoose");

const facultySchema = new mongoose.Schema(
  {
    facultyId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    phoneNumber: { type: String, required: true, trim: true },
    department: { type: String, required: true, trim: true },
    designation: { type: String, required: true, trim: true },
    qualification: { type: String, required: true, trim: true },
    joiningDate: { type: Date, required: true },
    city: { type: String, trim: true },
    country: { type: String, trim: true },
    address: { type: String, trim: true },
    status: { type: String, default: "active" },
  },
  { timestamps: true }
);

const Faculty = mongoose.model("Faculty", facultySchema);

module.exports = Faculty;
