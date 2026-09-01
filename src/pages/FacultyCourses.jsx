import { useEffect, useState } from "react";

function FacultyCourses({
  faculty,
  setPage,
}) {
  const [classes, setClasses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(function () {
    async function fetchFacultyCourses() {
      try {
        const responses = await Promise.all([
          fetch("/api/classes", {
            credentials: "include"
          }),
          fetch("/api/courses", {
            credentials: "include"
          })
        ]);

        const data = await Promise.all(
          responses.map(function (response) {
            return response.json();
          })
        );

        if (
          !responses[0].ok ||
          !responses[1].ok
        ) {
          return;
        }

        setClasses(data[0].classes);
        setCourses(data[1].courses);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    fetchFacultyCourses();
  }, []);

  const facultyClasses = classes.filter(function (classItem) {
    return classItem.facultyId === faculty.facultyId;
  });

  const assignedCourses = facultyClasses
    .map(function (classItem) {
      const course = courses.find(function (course) {
        return course.courseCode === classItem.courseId;
      });

      return {
        classItem: classItem,
        course: course,
      };
    })
    .filter(function (item) {
      return item.course !== undefined;
    });

  return (
    <main className="p-5">

      <div className="bg-gradient-to-r from-green-700 to-green-500 rounded-2xl shadow-lg p-8 text-white mb-8">
        <h1 className="text-4xl font-bold">
          📚 Assigned Courses
        </h1>

        <p className="mt-2 text-green-100">
          Courses assigned to {faculty.firstName} {faculty.lastName}
        </p>
      </div>

      <button
        type="button"
        onClick={function () {
          setPage("faculty");
        }}
        className="mb-6 px-5 py-2 rounded-lg border border-gray-300"
      >
        ← Back to Faculty
      </button>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">

        {loading ? (
          <p className="p-6 text-gray-500">
            Loading courses...
          </p>
        ) : assignedCourses.length === 0 ? (
          <p className="p-6 text-gray-500">
            No courses are currently assigned to this faculty member.
          </p>
        ) : (
          <table className="w-full">

            <thead className="bg-gray-100">
              <tr>

                <th className="px-4 py-3 text-left">
                  Course Code
                </th>

                <th className="px-4 py-3 text-left">
                  Course Name
                </th>

                <th className="px-4 py-3 text-left">
                  Credit Hours
                </th>

                <th className="px-4 py-3 text-left">
                  Department
                </th>

                <th className="px-4 py-3 text-left">
                  Batch
                </th>

                <th className="px-4 py-3 text-left">
                  Semester
                </th>

              </tr>
            </thead>

            <tbody>

              {assignedCourses.map(function (item) {
                const course = item.course;
                const classItem = item.classItem;

                return (
                  <tr
                    key={classItem._id}
                    className="border-t hover:bg-gray-50"
                  >

                    <td className="px-4 py-3">
                      {course.courseCode}
                    </td>

                    <td className="px-4 py-3 font-medium">
                      {course.courseName}
                    </td>

                    <td className="px-4 py-3">
                      {course.creditHours}
                    </td>

                    <td className="px-4 py-3">
                      {course.department}
                    </td>

                    <td className="px-4 py-3">
                      {classItem.batchId}
                    </td>

                    <td className="px-4 py-3">
                      {classItem.semester}
                    </td>

                  </tr>
                );
              })}

            </tbody>

          </table>
        )}

      </div>

    </main>
  );
}

export default FacultyCourses;