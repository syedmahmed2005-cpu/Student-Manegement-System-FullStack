import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams
} from "react-router-dom";

function ViewClass() {
  const { classId } = useParams();
  const navigate = useNavigate();

  const [classItem, setClassItem] = useState(null);
  const [courses, setCourses] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] =
    useState("");

  useEffect(
    function () {
      async function fetchClassData() {
        try {
          const responses = await Promise.all([
            fetch(
              `${import.meta.env.VITE_API_URL}/api/classes/${classId}`,
              {
                credentials: "include"
              }
            ),
            fetch(
              `${import.meta.env.VITE_API_URL}/api/courses`,
              {
                credentials: "include"
              }
            ),
            fetch(
              `${import.meta.env.VITE_API_URL}/api/faculty`,
              {
                credentials: "include"
              }
            )
          ]);

          const data = await Promise.all(
            responses.map(function (response) {
              return response.json();
            })
          );

          if (!responses[0].ok) {
            setErrorMessage(
              data[0].message || "Class not found."
            );
            return;
          }

          if (
            !responses[1].ok ||
            !responses[2].ok
          ) {
            setErrorMessage(
              "Failed to retrieve class details."
            );
            return;
          }

          setClassItem(data[0].class);
          setCourses(data[1].courses);
          setFaculty(data[2].faculty);
        } catch (error) {
          console.log(error);

          setErrorMessage(
            "Unable to connect to the server."
          );
        } finally {
          setLoading(false);
        }
      }

      fetchClassData();
    },
    [classId]
  );

  if (loading) {
    return (
      <main className="min-h-screen bg-app-background p-6">
        <div className="mx-auto max-w-4xl rounded-2xl border border-app-border bg-app-surface p-8 text-center shadow-lg">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-green-100 border-t-green-600 dark:border-green-950 dark:border-t-green-400" />

          <p className="text-app-text-muted">
            Loading class...
          </p>
        </div>
      </main>
    );
  }

  if (!classItem) {
    return (
      <main className="min-h-screen bg-app-background p-6">
        <div className="mx-auto max-w-4xl rounded-2xl border border-app-border bg-app-surface p-8 text-center shadow-lg">
          <h1 className="text-2xl font-bold text-app-text">
            Class not found
          </h1>

          <p className="mt-2 text-app-text-muted">
            {errorMessage}
          </p>

          <button
            type="button"
            onClick={function () {
              navigate("/classes");
            }}
            className="mt-6 rounded-lg bg-green-600 px-5 py-2 text-white transition hover:bg-green-700"
          >
            Back to Classes
          </button>
        </div>
      </main>
    );
  }

  const course = courses.find(function (item) {
    return item.courseCode === classItem.courseId;
  });

  const facultyMember = faculty.find(
    function (item) {
      return (
        item.facultyId === classItem.facultyId
      );
    }
  );

  const details = [
    ["Class ID", classItem._id],
    [
      "Course",
      course
        ? course.courseCode +
          " - " +
          course.courseName
        : "Unknown Course"
    ],
    [
      "Faculty",
      facultyMember
        ? facultyMember.firstName +
          " " +
          facultyMember.lastName
        : "Unknown Faculty"
    ],
    ["Batch", classItem.batchId],
    ["Semester", classItem.semester]
  ];

  return (
    <main className="min-h-screen bg-app-background p-5 transition-colors duration-200 sm:p-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 rounded-2xl bg-gradient-to-r from-green-700 to-green-500 p-8 text-white shadow-lg">
          <h1 className="text-3xl font-bold sm:text-4xl">
            🏫 Class Details
          </h1>

          <p className="mt-2 text-green-100">
            View the course, assigned faculty, batch and
            semester.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-app-border bg-app-surface shadow-lg">
          <div className="flex flex-col gap-4 border-b border-app-border px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-green-600 dark:text-green-400">
                {course?.courseCode ||
                  classItem.courseId}
              </p>

              <h2 className="mt-1 text-2xl font-bold text-app-text">
                {course?.courseName ||
                  "Class Information"}
              </h2>
            </div>

            <button
              type="button"
              onClick={function () {
                navigate("/classes");
              }}
              className="rounded-lg border border-app-border bg-app-surface-soft px-4 py-2 font-semibold text-app-text transition hover:border-green-300 dark:hover:border-green-800"
            >
              ← Back
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
            {details.map(function (detail) {
              return (
                <div
                  key={detail[0]}
                  className="rounded-xl border border-app-border bg-app-surface-soft p-4"
                >
                  <p className="text-sm text-app-text-muted">
                    {detail[0]}
                  </p>

                  <p className="mt-1 break-words font-semibold text-app-text">
                    {detail[1]}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}

export default ViewClass;