import { useState } from "react";

function EnrollStudent({
  students,
  classes,
  courses,
  faculty,
  enrollments,
  setEnrollments,
  setPage,
  showToast,
}) {
  const [formData, setFormData] = useState({
    studentId: "",
    classId: "",
  });

  function handleChange(event) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  }

  function handleEnroll() {
    if (
      formData.studentId === "" ||
      formData.classId === ""
    ) {
      showToast(
        "Please select a student and a class.",
        "warning"
      );
      return;
    }

    const selectedStudent = students.find(function (student) {
      return student.studentId === formData.studentId;
    });

    const selectedClass = classes.find(function (classItem) {
      return classItem.classId === formData.classId;
    });

    if (!selectedStudent || !selectedClass) {
      showToast(
        "Invalid student or class selection.",
        "warning"
      );
      return;
    }

    /*
      A student can only be enrolled in a class
      belonging to their own batch.
    */
    if (selectedStudent.batchId !== selectedClass.batchId) {
      showToast(
        "This student does not belong to the batch of this class.",
        "warning"
      );
      return;
    }

    const alreadyEnrolled = enrollments.some(
      function (enrollment) {
        return (
          enrollment.studentId === formData.studentId &&
          enrollment.classId === formData.classId
        );
      }
    );

    if (alreadyEnrolled) {
      showToast(
        "Student is already enrolled in this class.",
        "warning"
      );
      return;
    }

    const newEnrollment = {
      enrollmentId: "ENR-" + Date.now(),
      studentId: formData.studentId,
      classId: formData.classId,
    };

    setEnrollments(function (currentEnrollments) {
      return [...currentEnrollments, newEnrollment];
    });

    showToast(
      "Student enrolled successfully.",
      "success"
    );

    setPage("enrollments");
  }

  return (
    <main className="p-5">

      <div className="bg-gradient-to-r from-green-700 to-green-500 rounded-2xl shadow-lg p-8 text-white mb-8">

        <h1 className="text-4xl font-bold">
          🎓 Enroll Student
        </h1>

        <p className="mt-2 text-green-100">
          Enroll a student into a specific class.
        </p>

      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 max-w-2xl">

        {/* Student */}

        <div className="mb-5">

          <label className="block font-semibold mb-2">
            Student
          </label>

          <select
            name="studentId"
            value={formData.studentId}
            onChange={handleChange}
            className="border rounded-lg px-4 py-2 w-full"
          >

            <option value="">
              Select Student
            </option>

            {students.map(function (student) {

              return (
                <option
                  key={student.studentId}
                  value={student.studentId}
                >
                  {student.firstName} {student.lastName} -{" "}
                  {student.rollNumber} - {student.batchId}
                </option>
              );

            })}

          </select>

        </div>

        {/* Class */}

        <div className="mb-6">

          <label className="block font-semibold mb-2">
            Class
          </label>

          <select
            name="classId"
            value={formData.classId}
            onChange={handleChange}
            className="border rounded-lg px-4 py-2 w-full"
          >

            <option value="">
              Select Class
            </option>

            {classes.map(function (classItem) {

              const selectedCourse = courses.find(
                function (course) {
                  return (
                    course.courseId ===
                    classItem.courseId
                  );
                }
              );

              const selectedFaculty = faculty.find(
                function (member) {
                  return (
                    member.facultyId ===
                    classItem.facultyId
                  );
                }
              );

              return (
                <option
                  key={classItem.classId}
                  value={classItem.classId}
                >
                  {selectedCourse
                    ? selectedCourse.courseCode
                    : "Unknown Course"}{" "}
                  -{" "}
                  {selectedCourse
                    ? selectedCourse.courseName
                    : "Unknown Course"}{" "}
                  |{" "}
                  {classItem.batchId} | Semester{" "}
                  {classItem.semester} |{" "}
                  {selectedFaculty
                    ? selectedFaculty.firstName +
                      " " +
                      selectedFaculty.lastName
                    : "Unknown Faculty"}
                </option>
              );

            })}

          </select>

        </div>

        {/* Buttons */}

        <div className="flex justify-between">

          <button
            type="button"
            onClick={function () {
              setPage("students");
            }}
            className="px-5 py-2 rounded-lg border border-gray-300"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleEnroll}
            className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700"
          >
            Enroll Student
          </button>

        </div>

      </div>

    </main>
  );
}

export default EnrollStudent;