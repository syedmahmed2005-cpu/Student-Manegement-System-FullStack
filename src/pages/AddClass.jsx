import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AddClass({
  courses,
  faculty,
  students,
  setCourses,
  setFaculty,
  setStudents,
  showToast,
}) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    courseId: "",
    facultyId: "",
    batchId: "",
    semester: "",
  });

  useEffect(function () {
    async function fetchDependencies() {
      try {
        const responses = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/api/courses`),
          fetch(`${import.meta.env.VITE_API_URL}/api/faculty`),
          fetch(`${import.meta.env.VITE_API_URL}/api/students`),
        ]);
        const data = await Promise.all(responses.map(function (response) { return response.json(); }));
        if (!responses[0].ok || !responses[1].ok || !responses[2].ok) {
          showToast("Failed to retrieve class data.", "error");
          return;
        }
        setCourses(data[0].courses);
        setFaculty(data[1].faculty);
        setStudents(data[2].students);
      } catch (error) {
        console.log(error);
        showToast("Unable to connect to the server.", "error");
      }
    }
    fetchDependencies();
  }, [setCourses, setFaculty, setStudents]);

  function handleChange(event) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  }

  async function handleSave() {
    if (
      formData.courseId === "" ||
      formData.facultyId === "" ||
      formData.batchId === "" ||
      formData.semester === ""
    ) {
      showToast("Please fill all required fields.", "warning");
      return;
    }

    const selectedCourse = courses.find(function (course) {
      return course.courseCode === formData.courseId;
    });

    const selectedFaculty = faculty.find(function (member) {
      return member.facultyId === formData.facultyId;
    });

    if (!selectedCourse || !selectedFaculty) {
      showToast("Invalid course or faculty selection.", "warning");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/classes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) {
        showToast(data.message || "Failed to create class.", "error");
        return;
      }
      showToast("Class created successfully.", "success");
      navigate("/classes");
    } catch (error) {
      console.log(error);
      showToast("Unable to connect to the server.", "error");
    }
  }

  return (
    <main className="p-5">

      <div className="bg-gradient-to-r from-green-700 to-green-500 rounded-2xl shadow-lg p-8 text-white mb-8">
        <h1 className="text-4xl font-bold">🏫 Add Class</h1>

        <p className="mt-2 text-green-100">
          Create a class by connecting a course, faculty member, and batch.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Course */}
          <div>
            <label className="block font-semibold mb-2">
              Course
            </label>

            <select
              name="courseId"
              value={formData.courseId}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2"
            >
              <option value="">
                Select Course
              </option>

              {courses.map(function (course) {
                return (
                  <option
                    key={course._id}
                    value={course.courseCode}
                  >
                    {course.courseCode} - {course.courseName}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Faculty */}
          <div>
            <label className="block font-semibold mb-2">
              Faculty
            </label>

            <select
              name="facultyId"
              value={formData.facultyId}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2"
            >
              <option value="">
                Select Faculty
              </option>

              {faculty.map(function (member) {
                return (
                  <option
                    key={member._id}
                    value={member.facultyId}
                  >
                    {member.firstName} {member.lastName}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Batch */}
          <div>
            <label className="block font-semibold mb-2">
              Batch
            </label>

            <select
              name="batchId"
              value={formData.batchId}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2"
            >
              <option value="">
                Select Batch
              </option>

              {Array.from(
                new Set(
                  students.map(function (student) {
                    return student.batchId;
                  })
                )
              ).map(function (batchId) {
                return (
                  <option key={batchId} value={batchId}>
                    {batchId}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Semester */}
          <div>
            <label className="block font-semibold mb-2">
              Semester
            </label>

            <select
              name="semester"
              value={formData.semester}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2"
            >
              <option value="">
                Select Semester
              </option>

              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
            </select>
          </div>

        </div>

        <div className="flex justify-between mt-8">

          <button
            type="button"
            onClick={function () {
              navigate("/classes");
            }}
            className="bg-gray-500 text-white px-6 py-3 rounded-lg"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700"
          >
            Create Class
          </button>

        </div>

      </div>

    </main>
  );
}

export default AddClass;
