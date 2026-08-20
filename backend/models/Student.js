const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
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
});

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;