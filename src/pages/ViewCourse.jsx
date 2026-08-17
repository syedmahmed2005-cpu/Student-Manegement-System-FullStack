function ViewCourse({ course, setPage }) {
  return (
    <div className="p-6">
      <div className="bg-white rounded-2xl shadow-lg p-6 max-w-4xl mx-auto">

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">
            Course Details
          </h1>

          <button
            type="button"
            onClick={function () {
              setPage("courses");
            }}
            className="px-4 py-2 rounded-lg border border-gray-300"
          >
            Back
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">

          <div>
            <p className="text-gray-500">Course Code</p>
            <p className="font-semibold">{course.courseCode}</p>
          </div>

          <div>
            <p className="text-gray-500">Course Name</p>
            <p className="font-semibold">{course.courseName}</p>
          </div>

          <div>
            <p className="text-gray-500">Credit Hours</p>
            <p className="font-semibold">{course.creditHours}</p>
          </div>

          <div>
            <p className="text-gray-500">Department</p>
            <p className="font-semibold">{course.department}</p>
          </div>

          <div>
            <p className="text-gray-500">Semester</p>
            <p className="font-semibold">{course.semester}</p>
          </div>

          <div>
            <p className="text-gray-500">Assigned Faculty</p>
            <p className="font-semibold">{course.facultyName}</p>
          </div>

          <div>
            <p className="text-gray-500">Course ID</p>
            <p className="font-semibold">{course.courseId}</p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ViewCourse;