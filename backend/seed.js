const dns = require("dns");

dns.setServers(["8.8.8.8", "1.1.1.1"]);

require("dotenv").config();
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const Student = require("./models/Student");
const Faculty = require("./models/Faculty");
const Course = require("./models/Course");
const Class = require("./models/Class");
const Enrollment = require("./models/Enrollment");
const Attendance = require("./models/Attendance");
const User = require("./models/User");

const batches = ["FA23", "FA24", "SP24"];
const studentNames = [
  ["Ahmed", "Khan"], ["Ayesha", "Malik"], ["Hamza", "Ahmed"],
  ["Hira", "Siddiqui"], ["Bilal", "Raza"], ["Mahnoor", "Ali"],
  ["Usman", "Tariq"], ["Zainab", "Aslam"], ["Saad", "Iqbal"],
  ["Laiba", "Farooq"], ["Danish", "Shah"], ["Iqra", "Nawaz"],
  ["Talha", "Hussain"], ["Sana", "Javed"], ["Fahad", "Butt"],
  ["Eman", "Yousaf"], ["Hassan", "Akram"], ["Maham", "Rashid"],
  ["Omer", "Saeed"], ["Areeba", "Qureshi"], ["Rafay", "Anwar"],
  ["Noor", "Zahid"], ["Arham", "Latif"], ["Mehak", "Sohail"],
  ["Taimoor", "Maqsood"],
];

const faculty = [
  ["FAC-001", "Dr. Salman", "Rauf", "salman.rauf@university.edu.pk", "Computer Science", "Associate Professor"],
  ["FAC-002", "Dr. Amina", "Khalid", "amina.khalid@university.edu.pk", "Computer Science", "Assistant Professor"],
  ["FAC-003", "Mr. Imran", "Sheikh", "imran.sheikh@university.edu.pk", "Computer Science", "Lecturer"],
  ["FAC-004", "Ms. Hina", "Arif", "hina.arif@university.edu.pk", "Computer Science", "Lecturer"],
  ["FAC-005", "Dr. Farhan", "Mirza", "farhan.mirza@university.edu.pk", "Software Engineering", "Associate Professor"],
  ["FAC-006", "Ms. Rabia", "Nadeem", "rabia.nadeem@university.edu.pk", "Software Engineering", "Lecturer"],
  ["FAC-007", "Dr. Waqas", "Naseer", "waqas.naseer@university.edu.pk", "Computer Science", "Assistant Professor"],
  ["FAC-008", "Mr. Ali", "Haider", "ali.haider@university.edu.pk", "Computer Science", "Lecturer"],
];

const courses = [
  ["CSC101", "Programming Fundamentals", 4], ["CSC102", "Object Oriented Programming", 4],
  ["CSC201", "Data Structures", 4], ["CSC202", "Database Systems", 3],
  ["CSC203", "Computer Networks", 3], ["CSC204", "Operating Systems", 4],
  ["CSC301", "Software Engineering", 3], ["CSC302", "Web Engineering", 3],
  ["CSC303", "Artificial Intelligence", 3], ["CSC304", "Data Mining", 3],
  ["CSC305", "Information Security", 3], ["CSC306", "Human Computer Interaction", 3],
];

async function seedDatabase() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is missing from the environment.");
  }

  await mongoose.connect(process.env.MONGODB_URI);

  await Promise.all([
    Attendance.deleteMany({}),
    Enrollment.deleteMany({}),
    Class.deleteMany({}),
    Course.deleteMany({}),
    Student.deleteMany({}),
    Faculty.deleteMany({}),
    User.deleteMany({ email: { $in: ["admin@test.com", "faculty@test.com", "student@test.com"] } }),
  ]);

  const createdFaculty = await Faculty.insertMany(faculty.map(function (item, index) {
    return {
      facultyId: item[0], firstName: item[1], lastName: item[2], email: item[3],
      phoneNumber: "0300-1000" + String(index + 1).padStart(3, "0"), department: item[4],
      designation: item[5], qualification: "MS Computer Science", joiningDate: new Date("2019-08-15"),
      city: "Lahore", country: "Pakistan", address: "University Road, Lahore", status: "active",
    };
  }));

  const createdCourses = await Course.insertMany(courses.map(function (item) {
    return { courseCode: item[0], courseName: item[1], creditHours: item[2], department: "Computer Science" };
  }));

  const createdStudents = await Student.insertMany(studentNames.map(function (name, index) {
    const number = String(index + 1).padStart(3, "0");
    return {
      studentId: "STU-" + number, firstName: name[0], lastName: name[1], batchId: batches[index % batches.length],
      email: name[0].toLowerCase() + "." + name[1].toLowerCase() + "@student.edu.pk",
      phoneNumber: "0301-200" + String(index + 1).padStart(4, "0"), rollNumber: "BCS-" + number,
      registrationNumber: "REG-2024-" + number, gender: index % 2 === 0 ? "male" : "female",
      dob: new Date(2002 + (index % 3), index % 12, (index % 27) + 1), department: "Computer Science",
      city: "Lahore", country: "Pakistan", address: "Model Town, Lahore", status: "active",
    };
  }));

  const classDocuments = [];
  batches.forEach(function (batch, batchIndex) {
    for (let index = 0; index < 4; index += 1) {
      classDocuments.push({
        courseId: createdCourses[(batchIndex * 4 + index) % createdCourses.length].courseCode,
        facultyId: createdFaculty[(batchIndex * 2 + index) % createdFaculty.length].facultyId,
        batchId: batch,
        semester: String(2 + batchIndex * 2),
      });
    }
  });
  const createdClasses = await Class.insertMany(classDocuments);

  const enrollmentDocuments = [];
  createdStudents.forEach(function (student, studentIndex) {
    const batchClasses = createdClasses.filter(function (classItem) { return classItem.batchId === student.batchId; });
    batchClasses.forEach(function (classItem, classIndex) {
      enrollmentDocuments.push({ enrollmentId: "ENR-" + String(studentIndex + 1).padStart(3, "0") + "-" + String(classIndex + 1), studentId: student.studentId, classId: classItem._id.toString() });
    });
  });
  const createdEnrollments = await Enrollment.insertMany(enrollmentDocuments);

  const attendanceDocuments = [];
  createdEnrollments.forEach(function (enrollment, enrollmentIndex) {
    for (let day = 0; day < 12; day += 1) {
      const date = new Date(2026, 0, 5 + day * 3);
      const absent = (enrollmentIndex * 3 + day * 5) % 13 < 2 + (enrollmentIndex % 4);
      attendanceDocuments.push({
        attendanceId: "ATT-" + enrollment._id + "-" + day,
        studentId: enrollment.studentId, classId: enrollment.classId, date: date,
        status: absent ? "absent" : "present",
      });
    }
  });
  const createdAttendance = await Attendance.insertMany(attendanceDocuments);

  const password = await bcrypt.hash("Test@12345", 10);
  await User.insertMany([
    { name: "System Admin", email: "admin@test.com", password: password, role: "admin" },
    { name: "Dr. Salman Rauf", email: "faculty@test.com", password: password, role: "faculty", facultyId: createdFaculty[0].facultyId },
    { name: createdStudents[0].firstName + " " + createdStudents[0].lastName, email: "student@test.com", password: password, role: "student", studentId: createdStudents[0].studentId },
  ]);

  console.log("Seed complete");
  console.log("Students created:", createdStudents.length);
  console.log("Faculty created:", createdFaculty.length);
  console.log("Courses created:", createdCourses.length);
  console.log("Classes created:", createdClasses.length);
  console.log("Enrollments created:", createdEnrollments.length);
  console.log("Attendance records created:", createdAttendance.length);
  console.log("Users created: 3");
  console.log("Test password: Test@12345");
}

seedDatabase()
  .catch(function (error) {
    console.error("Seed failed:", error.message);
    process.exitCode = 1;
  })
  .finally(function () {
    mongoose.connection.close();
  });
