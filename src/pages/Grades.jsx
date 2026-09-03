import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
function Grades({ user }) {
  const [grades, setGrades] = useState([]);
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);

  const [selectedClass, setSelectedClass] = useState("");

  const [marks, setMarks] = useState({});

  const [search, setSearch] = useState("");
  const [semester, setSemester] = useState("All");

  const [loading, setLoading] = useState(true);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [savingStudent, setSavingStudent] = useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const isFaculty = user.role === "faculty";
  const isStudent = user.role === "student";
  const isAdmin = user.role === "admin";


  useEffect(function () {
    async function loadInitialData() {
      try {
        setLoading(true);
        setError("");

        const gradeResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/api/grades`,
          {
            credentials: "include",
          }
        );

        const gradeData = await gradeResponse.json();

        if (!gradeResponse.ok) {
          setError(gradeData.message || "Grades could not be loaded.");
          return;
        }

        setGrades(gradeData);

        if (isFaculty) {
          const classResponse = await fetch(
            `${import.meta.env.VITE_API_URL}/api/classes/faculty/my-classes`,
            {
              credentials: "include",
            }
          );

          const classData = await classResponse.json();

          if (!classResponse.ok) {
            setError(
              classData.message || "Faculty classes could not be loaded."
            );
            return;
          }

          setClasses(classData.classes || []);
        }

        if (isAdmin) {
          const classResponse = await fetch(
            `${import.meta.env.VITE_API_URL}/api/classes`,
            {
              credentials: "include",
            }
          );

          const classData = await classResponse.json();

          if (classResponse.ok) {
            setClasses(classData.classes || []);
          }
        }
      } catch (requestError) {
        console.log(requestError);
        setError("Unable to connect to the server.");
      } finally {
        setLoading(false);
      }
    }

    loadInitialData();
  }, [isFaculty, isAdmin]);


  async function handleClassChange(event) {
    const classId = event.target.value;

    setSelectedClass(classId);
    setStudents([]);
    setMarks({});
    setMessage("");
    setError("");

    if (!classId) {
      return;
    }

    try {
      setStudentsLoading(true);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/enrollments/class/${classId}`,
        {
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Students could not be loaded.");
        return;
      }

      setStudents(data.students || []);

      const existingGrades = grades.filter(function (grade) {
        return grade.classId === classId;
      });

      const initialMarks = {};

      data.students.forEach(function (student) {
        const existingGrade = existingGrades.find(function (grade) {
          return grade.studentId === student.studentId;
        });

        initialMarks[student.studentId] = {
          assignmentMarks: existingGrade?.assignmentMarks ?? "",
          quizMarks: existingGrade?.quizMarks ?? "",
          midtermMarks: existingGrade?.midtermMarks ?? "",
          finalMarks: existingGrade?.finalMarks ?? "",
          practicalMarks: existingGrade?.practicalMarks ?? "",
          participationMarks: existingGrade?.participationMarks ?? "",
          remarks: existingGrade?.remarks ?? "",
          status: existingGrade?.status ?? "Draft",
        };
      });

      setMarks(initialMarks);
    } catch (requestError) {
      console.log(requestError);
      setError("Unable to load students.");
    } finally {
      setStudentsLoading(false);
    }
  }


  function updateMark(studentId, field, value) {
    setMarks(function (currentMarks) {
      return {
        ...currentMarks,
        [studentId]: {
          ...currentMarks[studentId],
          [field]: value,
        },
      };
    });
  }


  function calculatePreview(studentId) {
    const studentMarks = marks[studentId];

    if (!studentMarks) {
      return {
        total: 0,
        percentage: 0,
        grade: "F",
        gpa: 0,
      };
    }

    const total =
      Number(studentMarks.assignmentMarks || 0) +
      Number(studentMarks.quizMarks || 0) +
      Number(studentMarks.midtermMarks || 0) +
      Number(studentMarks.finalMarks || 0) +
      Number(studentMarks.practicalMarks || 0) +
      Number(studentMarks.participationMarks || 0);

    let grade;
    let gpa;

    if (total >= 85) {
      grade = "A";
      gpa = 4.0;
    } else if (total >= 80) {
      grade = "A-";
      gpa = 3.7;
    } else if (total >= 75) {
      grade = "B+";
      gpa = 3.3;
    } else if (total >= 70) {
      grade = "B";
      gpa = 3.0;
    } else if (total >= 65) {
      grade = "B-";
      gpa = 2.7;
    } else if (total >= 60) {
      grade = "C+";
      gpa = 2.3;
    } else if (total >= 55) {
      grade = "C";
      gpa = 2.0;
    } else if (total >= 50) {
      grade = "D";
      gpa = 1.0;
    } else {
      grade = "F";
      gpa = 0.0;
    }

    return {
      total: total,
      percentage: total,
      grade: grade,
      gpa: gpa,
    };
  }


  async function saveGrade(studentId, status) {
    if (!selectedClass) {
      return;
    }

    try {
      setSavingStudent(studentId);
      setError("");
      setMessage("");

      const studentMarks = marks[studentId] || {};
      const markLimits = {
      assignmentMarks: 10,
      quizMarks: 10,
      midtermMarks: 25,
      finalMarks: 35,
      practicalMarks: 10,
      participationMarks: 10,
    };

    for (const field in markLimits) {
      const value = Number(studentMarks[field] || 0);

      if (value < 0 || value > markLimits[field]) {
        setError(
          `${field.replace("Marks", "")} marks must be between 0 and ${markLimits[field]}.`
        );
        return;
      }
    }
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/grades`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            studentId: studentId,
            classId: selectedClass,

            assignmentMarks: Number(studentMarks.assignmentMarks || 0),
            quizMarks: Number(studentMarks.quizMarks || 0),
            midtermMarks: Number(studentMarks.midtermMarks || 0),
            finalMarks: Number(studentMarks.finalMarks || 0),
            practicalMarks: Number(studentMarks.practicalMarks || 0),
            participationMarks: Number(
              studentMarks.participationMarks || 0
            ),

            remarks: studentMarks.remarks || "",
            status: status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Grade could not be saved.");
        return;
      }

      setGrades(function (currentGrades) {
        const withoutOld = currentGrades.filter(function (grade) {
          return grade._id !== data.grade._id;
        });

        return [...withoutOld, data.grade];
      });

      setMarks(function (currentMarks) {
        return {
          ...currentMarks,
          [studentId]: {
            ...currentMarks[studentId],
            status: status,
          },
        };
      });

      setMessage(
        status === "Published"
          ? "Grade published successfully."
          : "Grade saved as draft."
      );
    } catch (requestError) {
      console.log(requestError);
      setError("Unable to save the grade.");
    } finally {
      setSavingStudent("");
    }
  }


  const semesters = [
    "All",
    ...new Set(
      grades.map(function (grade) {
        return grade.semester;
      })
    ),
  ];


  const filteredGrades = grades.filter(function (grade) {
    const studentText = (
      grade.studentName || grade.studentId || ""
    ).toLowerCase();

    const courseText = (
      grade.courseName || grade.courseId || ""
    ).toLowerCase();

    const searchText = search.toLowerCase();

    const matchesSearch =
      studentText.includes(searchText) ||
      courseText.includes(searchText);

    const matchesSemester =
      semester === "All" || grade.semester === semester;

    return matchesSearch && matchesSemester;
  });

  //Export PDF
  function generateStudentGradePDF(grade) {
  const doc = new jsPDF();

  const studentName = grade.studentName || grade.studentId;
  const courseName = grade.courseName || grade.courseId;

  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("EDUCORE", 105, 20, { align: "center" });

  doc.setFontSize(14);
  doc.setFont("helvetica", "normal");
  doc.text("Academic Grade Report", 105, 29, { align: "center" });

  doc.setFontSize(10);
  doc.text(`Student: ${studentName}`, 20, 45);
  doc.text(`Student ID: ${grade.studentId}`, 20, 52);
  doc.text(`Course: ${courseName}`, 20, 59);
  doc.text(`Course Code: ${grade.courseCode || grade.courseId}`, 20, 66);
  doc.text(`Semester: ${grade.semester}`, 20, 73);
  doc.text(`Academic Year: ${grade.academicYear || "N/A"}`, 20, 80);

  autoTable(doc, {
    startY: 90,
    head: [["Component", "Marks"]],
    body: [
      ["Assignment", `${grade.assignmentMarks || 0} / 10`],
      ["Quiz", `${grade.quizMarks || 0} / 10`],
      ["Midterm", `${grade.midtermMarks || 0} / 25`],
      ["Final", `${grade.finalMarks || 0} / 35`],
      ["Practical", `${grade.practicalMarks || 0} / 10`],
      ["Participation", `${grade.participationMarks || 0} / 10`],
      ["Total", `${grade.totalMarks || 0} / 100`],
    ],
    theme: "grid",
    headStyles: {
      fillColor: [22, 101, 52],
    },
  });

  const finalY = doc.lastAutoTable.finalY + 15;

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");

  doc.text(`Percentage: ${grade.percentage || 0}%`, 20, finalY);
  doc.text(`Grade: ${grade.letterGrade || "N/A"}`, 20, finalY + 8);
  doc.text(
    `GPA: ${Number(grade.gpaPoints || 0).toFixed(1)}`,
    20,
    finalY + 16
  );

  if (grade.remarks) {
    doc.setFont("helvetica", "normal");
    doc.text("Remarks:", 20, finalY + 30);
    doc.text(grade.remarks, 20, finalY + 38);
  }

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(
    "Generated by EduCore • Academic Management System",
    105,
    285,
    { align: "center" }
  );

  const safeStudentName = studentName.replace(/[^a-z0-9]/gi, "_");

  doc.save(`EduCore-${safeStudentName}-Grade-Report.pdf`);
}

//export class report
function generateClassGradePDF(classItem, classGrades) {
  const doc = new jsPDF("landscape");

  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("EDUCORE", 148, 18, { align: "center" });

  doc.setFontSize(14);
  doc.setFont("helvetica", "normal");
  doc.text("Class Grade Report", 148, 27, { align: "center" });

  doc.setFontSize(10);

  doc.text(
    `Course: ${classItem.courseCode || classItem.courseId} - ${
      classItem.courseName || ""
    }`,
    14,
    40
  );

  doc.text(`Batch: ${classItem.batchId}`, 14, 47);
  doc.text(`Semester: ${classItem.semester}`, 14, 54);
  doc.text(`Academic Year: ${new Date().getFullYear()}`, 14, 61);

  const rows = classGrades.map(function (grade) {
    return [
      grade.studentId,
      grade.studentName || grade.studentId,
      grade.assignmentMarks || 0,
      grade.quizMarks || 0,
      grade.midtermMarks || 0,
      grade.finalMarks || 0,
      grade.practicalMarks || 0,
      grade.participationMarks || 0,
      grade.totalMarks || 0,
      `${grade.percentage || 0}%`,
      grade.letterGrade || "N/A",
      Number(grade.gpaPoints || 0).toFixed(1),
    ];
  });

  autoTable(doc, {
    startY: 70,
    head: [[
      "Student ID",
      "Student Name",
      "Assignment",
      "Quiz",
      "Midterm",
      "Final",
      "Practical",
      "Participation",
      "Total",
      "%",
      "Grade",
      "GPA",
    ]],
    body: rows,
    theme: "grid",
    styles: {
      fontSize: 7,
      cellPadding: 2,
    },
    headStyles: {
      fillColor: [22, 101, 52],
    },
  });

  const finalY = doc.lastAutoTable.finalY + 12;

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");

  doc.text(
    `Total Students: ${classGrades.length}`,
    14,
    finalY
  );

  doc.text(
    "Generated by EduCore • Academic Management System",
    148,
    200,
    { align: "center" }
  );

  const courseCode = classItem.courseCode || classItem.courseId;

  doc.save(
    `EduCore-${courseCode}-Class-Grade-Report.pdf`
  );
}

  function getGradeStyle(letterGrade) {
    if (letterGrade === "F") {
      return "bg-red-50 text-red-700 border-red-200";
    }

    if (["A", "A-"].includes(letterGrade)) {
      return "bg-green-50 text-green-700 border-green-200";
    }

    return "bg-amber-50 text-amber-700 border-amber-200";
  }


 function getClassLabel(classItem) {
  return `${classItem.courseCode} - ${classItem.courseName} | Batch ${classItem.batchId} | Semester ${classItem.semester}`;
}


  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">

      <section className="rounded-3xl border border-green-200/70 bg-gradient-to-br from-green-700 via-green-600 to-emerald-500 p-8 text-left text-white shadow-xl shadow-green-900/10">
        <p className="text-sm font-semibold uppercase tracking-widest text-green-100">
          Academic Performance
        </p>

        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
          Grades
        </h1>

        <p className="mt-3 max-w-2xl text-green-50">
          {isFaculty
            ? "Enter, calculate, and publish grades for your classes."
            : isStudent
            ? "View your published academic performance."
            : "View and manage academic performance, grades, and GPA records."}
        </p>
      </section>


      {error && (
        <p className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {error}
        </p>
      )}


      {message && (
        <p className="mt-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-green-700">
          {message}
        </p>
      )}


      {isFaculty && (
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white/85 p-6 shadow-sm backdrop-blur">

          <div>
            <h2 className="text-xl font-bold text-green-900">
              Grade Entry
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Select one of your classes to enter student grades.
            </p>
          </div>

          <select
            value={selectedClass}
            onChange={handleClassChange}
            className="mt-5 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
          >
            <option value="">Select a class</option>

            {classes.map(function (classItem) {
              return (
                <option key={classItem._id} value={classItem._id}>
                  {getClassLabel(classItem)}
                </option>
              );
            })}
          </select>

        </section>
      )}


      {isFaculty && selectedClass && (
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white/85 p-6 shadow-sm backdrop-blur">

          <div className="mb-6">
            <h2 className="text-xl font-bold text-green-900">
              Student Grade Entry
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Enter marks out of 100. Grades and GPA are calculated automatically.
            </p>
          </div>
            {selectedClass && (
            <button
                type="button"
                onClick={function () {
                const classGrades = grades.filter(function (grade) {
                    return grade.classId === selectedClass._id;
                });

                generateClassGradePDF(selectedClass, classGrades);
                }}
                className="mb-6 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:scale-[1.02] hover:shadow-lg"
            >
                Generate Class Report PDF
            </button>
            )}

          {studentsLoading ? (
            <div className="py-12 text-center text-slate-500">
              Loading enrolled students...
            </div>
          ) : students.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 py-12 text-center">
              <p className="font-semibold text-slate-700">
                No students enrolled
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Enroll students in this class before entering grades.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full min-w-[1250px] text-left">

                <thead>
                  <tr className="border-b border-slate-200 text-sm text-slate-500">
                    <th className="px-3 py-3 font-semibold">Student</th>
                    <th className="px-3 py-3 font-semibold">Assignment</th>
                    <th className="px-3 py-3 font-semibold">Quiz</th>
                    <th className="px-3 py-3 font-semibold">Midterm</th>
                    <th className="px-3 py-3 font-semibold">Final</th>
                    <th className="px-3 py-3 font-semibold">Practical</th>
                    <th className="px-3 py-3 font-semibold">Participation</th>
                    <th className="px-3 py-3 font-semibold">Total</th>
                    <th className="px-3 py-3 font-semibold">Grade</th>
                    <th className="px-3 py-3 font-semibold">GPA</th>
                    <th className="px-4 py-3 font-semibold">Report</th>
                    <th className="px-3 py-3 font-semibold">Action</th>
                  </tr>
                </thead>


                <tbody>

                  {students.map(function (student) {
                    const preview = calculatePreview(student.studentId);

                    return (
                      <tr
                        key={student.studentId}
                        className="border-b border-slate-100 hover:bg-green-50/40"
                      >

                        <td className="px-3 py-4">
                          <p className="font-semibold text-slate-800">
                            {student.firstName} {student.lastName}
                          </p>

                          <p className="text-xs text-slate-500">
                            {student.rollNumber}
                          </p>
                        </td>


                        {[
                          "assignmentMarks",
                          "quizMarks",
                          "midtermMarks",
                          "finalMarks",
                          "practicalMarks",
                          "participationMarks",
                        ].map(function (field) {
                          return (
                            <td
                              key={field}
                              className="px-2 py-4"
                            >
                              <input
                                type="number"
                                min="0"
                                value={marks[student.studentId]?.[field] ?? ""}
                                onChange={function (event) {
                                  updateMark(
                                    student.studentId,
                                    field,
                                    event.target.value
                                  );
                                }}
                                className="w-20 rounded-lg border border-slate-200 px-2 py-2 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                              />
                            </td>
                          );
                        })}


                        <td className="px-3 py-4 font-bold text-slate-800">
                          {preview.total}
                        </td>

                        <td className="px-3 py-4">
                          <span
                            className={`rounded-full border px-3 py-1 text-sm font-bold ${getGradeStyle(
                              preview.grade
                            )}`}
                          >
                            {preview.grade}
                          </span>
                        </td>

                        <td className="px-3 py-4 font-bold text-green-700">
                          {preview.gpa.toFixed(1)}
                        </td>

                        <td className="px-3 py-4">
                          <div className="flex gap-2">

                            <button
                              type="button"
                              disabled={savingStudent === student.studentId}
                              onClick={function () {
                                saveGrade(student.studentId, "Draft");
                              }}
                              className="rounded-lg border border-green-200 px-3 py-2 text-xs font-semibold text-green-800 transition hover:bg-green-50 disabled:opacity-50"
                            >
                              Draft
                            </button>

                            <button
                              type="button"
                              disabled={savingStudent === student.studentId}
                              onClick={function () {
                                saveGrade(student.studentId, "Published");
                              }}
                              className="rounded-lg bg-green-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-green-700 disabled:opacity-50"
                            >
                              Publish
                            </button>

                          </div>
                        </td>

                      </tr>
                    );
                  })}

                </tbody>

              </table>

            </div>
          )}

        </section>
      )}


      {(isAdmin || isStudent) && (
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white/85 p-6 shadow-sm backdrop-blur">

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

            <div>
              <h2 className="text-xl font-bold text-green-900">
                {isStudent ? "My Grades" : "Grade Records"}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {filteredGrades.length} record
                {filteredGrades.length !== 1 ? "s" : ""}
              </p>
            </div>


            <div className="flex flex-col gap-3 sm:flex-row">

              <input
                type="text"
                placeholder="Search student or course..."
                value={search}
                onChange={function (event) {
                  setSearch(event.target.value);
                }}
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
              />

              <select
                value={semester}
                onChange={function (event) {
                  setSemester(event.target.value);
                }}
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
              >
                {semesters.map(function (item) {
                  return (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  );
                })}
              </select>

            </div>

          </div>


          {loading ? (
            <div className="py-12 text-center text-slate-500">
              Loading grades...
            </div>
          ) : filteredGrades.length === 0 ? (
            <div className="mt-6 rounded-xl border border-dashed border-slate-200 py-12 text-center">
              <p className="text-lg font-semibold text-slate-700">
                No grades found
              </p>

              <p className="mt-1 text-sm text-slate-500">
                {isStudent
                  ? "Your published grades will appear here."
                  : "Grade records will appear here once they are added."}
              </p>
            </div>
          ) : (
            <div className="mt-6 overflow-x-auto">

              <table className="w-full min-w-[850px] text-left">

                <thead>
                  <tr className="border-b border-slate-200 text-sm text-slate-500">
                    <th className="px-4 py-3 font-semibold">Student</th>
                    <th className="px-4 py-3 font-semibold">Course</th>
                    <th className="px-4 py-3 font-semibold">Semester</th>
                    <th className="px-4 py-3 font-semibold">Total</th>
                    <th className="px-4 py-3 font-semibold">Percentage</th>
                    <th className="px-4 py-3 font-semibold">Grade</th>
                    <th className="px-4 py-3 font-semibold">GPA</th>
                  </tr>
                </thead>


                <tbody>

                  {filteredGrades.map(function (grade) {
                    return (
                      <tr
                        key={grade._id}
                        className="border-b border-slate-100 transition hover:bg-green-50/50"
                      >

                        <td className="px-4 py-4 font-semibold text-slate-800">
                          {grade.studentName || grade.studentId}
                        </td>

                        <td className="px-4 py-4 text-slate-600">
                          {grade.courseName || grade.courseId}
                        </td>

                        <td className="px-4 py-4 text-slate-600">
                          {grade.semester}
                        </td>

                        <td className="px-4 py-4 font-semibold text-slate-800">
                          {grade.totalMarks}
                        </td>

                        <td className="px-4 py-4 font-semibold text-slate-800">
                          {grade.percentage}%
                        </td>

                        <td className="px-4 py-4">
                          <span
                            className={`inline-flex rounded-full border px-3 py-1 text-sm font-bold ${getGradeStyle(
                              grade.letterGrade
                            )}`}
                          >
                            {grade.letterGrade}
                          </span>
                        </td>

                        <td className="px-4 py-4 font-bold text-green-700">
                          {Number(grade.gpaPoints || 0).toFixed(1)}
                        </td>
                        <td className="px-4 py-4">
                        <button
                            type="button"
                            onClick={function () {
                            generateStudentGradePDF(grade);
                            }}
                            className="rounded-lg border border-green-200 px-3 py-2 text-xs font-semibold text-green-800 transition hover:bg-green-50"
                        >
                            PDF
                        </button>
                        </td>

                      </tr>
                    );
                  })}

                </tbody>

              </table>

            </div>
          )}

        </section>
      )}

    </main>
  );
}

export default Grades;