require("dotenv").config();
const dns = require("dns");

dns.setServers(["8.8.8.8", "1.1.1.1"]);
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Student = require("./models/Student");
const Faculty = require("./models/Faculty");
const Course = require("./models/Course");
const Class = require("./models/Class");
const Enrollment = require("./models/Enrollment");
const Attendance = require("./models/Attendance");
const User = require("./models/User");

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected.");

    // CLEAR EXISTING DATA
    await Attendance.deleteMany({});
    await Enrollment.deleteMany({});
    await Class.deleteMany({});
    await Course.deleteMany({});
    await Student.deleteMany({});
    await Faculty.deleteMany({});
    await User.deleteMany({});

    console.log("Existing data cleared.");

    // --------------------------------------------------
    // ADMIN USER
    // --------------------------------------------------

    const password = await bcrypt.hash("Admin123", 10);

    await User.create({
      name: "System Administrator",
      email: "admin@sms.com",
      password: password,
      role: "admin",
      studentId: null,
      facultyId: null,
    });

    // --------------------------------------------------
    // FACULTY
    // --------------------------------------------------

    const facultyData = [
      {
        facultyId: "FAC-001",
        firstName: "Ahmed",
        lastName: "Khan",
        email: "ahmed.khan@sms.com",
        phoneNumber: "03001234567",
        department: "Computer Science",
        designation: "Assistant Professor",
        qualification: "MS Computer Science",
      },
      {
        facultyId: "FAC-002",
        firstName: "Sara",
        lastName: "Malik",
        email: "sara.malik@sms.com",
        phoneNumber: "03011234567",
        department: "Computer Science",
        designation: "Lecturer",
        qualification: "MS Computer Science",
      },
      {
        facultyId: "FAC-003",
        firstName: "Usman",
        lastName: "Raza",
        email: "usman.raza@sms.com",
        phoneNumber: "03021234567",
        department: "Software Engineering",
        designation: "Assistant Professor",
        qualification: "MS Software Engineering",
      },
      {
        facultyId: "FAC-004",
        firstName: "Ayesha",
        lastName: "Siddiqui",
        email: "ayesha.siddiqui@sms.com",
        phoneNumber: "03031234567",
        department: "Software Engineering",
        designation: "Lecturer",
        qualification: "MS Software Engineering",
      },
      {
        facultyId: "FAC-005",
        firstName: "Bilal",
        lastName: "Ahmed",
        email: "bilal.ahmed@sms.com",
        phoneNumber: "03041234567",
        department: "Electrical Engineering",
        designation: "Assistant Professor",
        qualification: "MS Electrical Engineering",
      },
      {
        facultyId: "FAC-006",
        firstName: "Hina",
        lastName: "Tariq",
        email: "hina.tariq@sms.com",
        phoneNumber: "03051234567",
        department: "Electrical Engineering",
        designation: "Lecturer",
        qualification: "MS Electrical Engineering",
      },
      {
        facultyId: "FAC-007",
        firstName: "Hamza",
        lastName: "Iqbal",
        email: "hamza.iqbal@sms.com",
        phoneNumber: "03061234567",
        department: "Psychology",
        designation: "Assistant Professor",
        qualification: "MS Psychology",
      },
      {
        facultyId: "FAC-008",
        firstName: "Maham",
        lastName: "Fatima",
        email: "maham.fatima@sms.com",
        phoneNumber: "03071234567",
        department: "Psychology",
        designation: "Lecturer",
        qualification: "MS Psychology",
      },
    ];

    const faculties = [];

    for (const data of facultyData) {
      const faculty = await Faculty.create({
        ...data,
        joiningDate: new Date("2022-08-15"),
        city: "Lahore",
        country: "Pakistan",
        address: "COMSATS University Lahore",
        status: "active",
      });

      faculties.push(faculty);

      await User.create({
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        password: password,
        role: "faculty",
        studentId: null,
        facultyId: data.facultyId,
      });
    }

    console.log("Faculty and faculty users created.");

    // --------------------------------------------------
    // COURSES
    // --------------------------------------------------

    const courseData = [
      {
        courseCode: "CSC101",
        courseName: "Programming Fundamentals",
        creditHours: 3,
        department: "Computer Science",
      },
      {
        courseCode: "CSC201",
        courseName: "Object Oriented Programming",
        creditHours: 3,
        department: "Computer Science",
      },
      {
        courseCode: "CSC301",
        courseName: "Database Systems",
        creditHours: 3,
        department: "Computer Science",
      },
      {
        courseCode: "CSC401",
        courseName: "Artificial Intelligence",
        creditHours: 3,
        department: "Computer Science",
      },

      {
        courseCode: "SWE101",
        courseName: "Software Engineering Fundamentals",
        creditHours: 3,
        department: "Software Engineering",
      },
      {
        courseCode: "SWE201",
        courseName: "Software Design and Architecture",
        creditHours: 3,
        department: "Software Engineering",
      },
      {
        courseCode: "SWE301",
        courseName: "Web Engineering",
        creditHours: 3,
        department: "Software Engineering",
      },
      {
        courseCode: "SWE401",
        courseName: "Software Project Management",
        creditHours: 3,
        department: "Software Engineering",
      },

      {
        courseCode: "EEE101",
        courseName: "Circuit Analysis",
        creditHours: 3,
        department: "Electrical Engineering",
      },
      {
        courseCode: "EEE201",
        courseName: "Digital Logic Design",
        creditHours: 3,
        department: "Electrical Engineering",
      },
      {
        courseCode: "EEE301",
        courseName: "Microprocessors",
        creditHours: 3,
        department: "Electrical Engineering",
      },
      {
        courseCode: "EEE401",
        courseName: "Power Systems",
        creditHours: 3,
        department: "Electrical Engineering",
      },

      {
        courseCode: "PSY101",
        courseName: "Introduction to Psychology",
        creditHours: 3,
        department: "Psychology",
      },
      {
        courseCode: "PSY201",
        courseName: "Cognitive Psychology",
        creditHours: 3,
        department: "Psychology",
      },
      {
        courseCode: "PSY301",
        courseName: "Social Psychology",
        creditHours: 3,
        department: "Psychology",
      },
      {
        courseCode: "PSY401",
        courseName: "Clinical Psychology",
        creditHours: 3,
        department: "Psychology",
      },
    ];

    const courses = await Course.insertMany(courseData);

    console.log("Courses created.");

    // --------------------------------------------------
    // STUDENTS
    // --------------------------------------------------

    const studentNames = [
      ["Ali", "Hassan"],
      ["Usman", "Khan"],
      ["Hamza", "Raza"],
      ["Ahmed", "Sheikh"],
      ["Zain", "Malik"],
      ["Bilal", "Ahmed"],

      ["Sara", "Khan"],
      ["Ayesha", "Raza"],
      ["Hira", "Malik"],
      ["Maham", "Ahmed"],
      ["Fatima", "Sheikh"],
      ["Iqra", "Khan"],

      ["Danish", "Raza"],
      ["Talha", "Ahmed"],
      ["Saad", "Malik"],
      ["Hassan", "Ali"],
      ["Omer", "Khan"],
      ["Hamza", "Sheikh"],

      ["Maryam", "Ahmed"],
      ["Noor", "Malik"],
      ["Laiba", "Raza"],
      ["Anaya", "Khan"],
      ["Zoya", "Ahmed"],
      ["Areeba", "Sheikh"],
    ];

    const departments = [
      "Computer Science",
      "Software Engineering",
      "Electrical Engineering",
      "Psychology",
    ];

    const students = [];

    for (let i = 0; i < studentNames.length; i++) {
      const department = departments[Math.floor(i / 6)];

      const student = new Student({
        firstName: studentNames[i][0],
        lastName: studentNames[i][1],
        batchId: "FA24",
        email: `student${i + 1}@sms.com`,
        phoneNumber: `0312${String(i + 1).padStart(7, "0")}`,
        gender: i % 2 === 0 ? "Male" : "Female",
        dob: new Date("2004-05-15"),
        department: department,
        city: "Lahore",
        country: "Pakistan",
        address: "Lahore, Pakistan",
        status: "active",
      });

      await student.save();

      students.push(student);

      await User.create({
        name: `${student.firstName} ${student.lastName}`,
        email: student.email,
        password: password,
        role: "student",
        studentId: student.studentId,
        facultyId: null,
      });
    }

    console.log("Students and student users created.");

    // --------------------------------------------------
    // CLASSES
    // --------------------------------------------------

    const classes = [];

    for (const department of departments) {
      const departmentCourses = courses.filter(
        function (course) {
          return course.department === department;
        }
      );

      const departmentFaculty = faculties.filter(
        function (faculty) {
          return faculty.department === department;
        }
      );

      for (let i = 0; i < departmentCourses.length; i++) {
        const classItem = await Class.create({
          courseId: departmentCourses[i].courseCode,
          facultyId: departmentFaculty[i % departmentFaculty.length].facultyId,
          batchId: "FA24",
          semester: String((i % 4) + 1),
        });

        classes.push(classItem);
      }
    }

    console.log("Classes created.");

    // --------------------------------------------------
    // ENROLLMENTS + ATTENDANCE
    // --------------------------------------------------

    let enrollmentCounter = 1;
    let attendanceCounter = 1;

    for (const department of departments) {
      const departmentStudents = students.filter(
        function (student) {
          return student.department === department;
        }
      );

      const departmentClasses = classes.filter(
        function (classItem) {
          const course = courses.find(
            function (courseItem) {
              return courseItem.courseCode === classItem.courseId;
            }
          );

          return course && course.department === department;
        }
      );

      for (const student of departmentStudents) {
        for (const classItem of departmentClasses) {
          const enrollment = await Enrollment.create({
            enrollmentId:
              "ENR-" + String(enrollmentCounter).padStart(3, "0"),
            studentId: student.studentId,
            classId: classItem._id.toString(),
          });

          enrollmentCounter++;

          // Create 5 attendance records for every enrollment
          for (let day = 1; day <= 5; day++) {
            const attendanceDate = new Date(
              `2026-08-${String(day).padStart(2, "0")}`
            );

            await Attendance.create({
              attendanceId:
                "ATT-" + String(attendanceCounter).padStart(4, "0"),
              studentId: student.studentId,
              classId: classItem._id.toString(),
              date: attendanceDate,
              status: day === 3 ? "absent" : "present",
            });

            attendanceCounter++;
          }
        }
      }
    }

    console.log("Enrollments and attendance records created.");

    console.log("");
    console.log("======================================");
    console.log("DATABASE SEEDED SUCCESSFULLY");
    console.log("======================================");
    console.log("");
    console.log("ADMIN LOGIN");
    console.log("Email: admin@sms.com");
    console.log("Password: Admin123");
    console.log("");
    console.log("FACULTY/STUDENT PASSWORD");
    console.log("Password for all seeded accounts: Admin123");
    console.log("");
    console.log("Students:");
    console.log("24 students created.");
    console.log("8 faculty members created.");
    console.log("16 courses created.");
    console.log(`${classes.length} classes created.`);
    console.log("Enrollments created for every student.");
    console.log("5 attendance records created per enrollment.");
    console.log("");
    
    await mongoose.connection.close();
  } catch (error) {
    console.error("SEED ERROR:");
    console.error(error);

    await mongoose.connection.close();
    process.exit(1);
  }
}

seedDatabase();