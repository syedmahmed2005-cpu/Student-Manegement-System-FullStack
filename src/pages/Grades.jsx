import { useEffect, useState } from "react";

function Grades({ user }) {
  const [grades, setGrades] = useState([]);
  const [search, setSearch] = useState("");
  const [semester, setSemester] = useState("All");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(function () {
    async function loadGrades() {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/grades`,
          {
            credentials: "include",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Grades could not be loaded.");
          return;
        }

        setGrades(data);
      } catch (requestError) {
        console.log(requestError);
        setError("Unable to connect to the server.");
      } finally {
        setLoading(false);
      }
    }

    loadGrades();
  }, []);

  const semesters = ["All", ...new Set(grades.map(function (grade) {
    return grade.semester;
  }))];

  const filteredGrades = grades.filter(function (grade) {
    const matchesSearch =
      grade.studentId.toLowerCase().includes(search.toLowerCase()) ||
      grade.courseId.toLowerCase().includes(search.toLowerCase());

    const matchesSemester =
      semester === "All" || grade.semester === semester;

    return matchesSearch && matchesSemester;
  });

  function getGradeStyle(letterGrade) {
    if (letterGrade === "F") {
      return "bg-red-50 text-red-700 border-red-200";
    }

    if (["A", "A-"].includes(letterGrade)) {
      return "bg-green-50 text-green-700 border-green-200";
    }

    return "bg-amber-50 text-amber-700 border-amber-200";
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
          View and manage academic performance, grades, and GPA records.
        </p>
      </section>

      {error && (
        <p className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {error}
        </p>
      )}

      <section className="mt-8 rounded-2xl border border-slate-200 bg-white/85 p-6 shadow-sm backdrop-blur">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <div>
            <h2 className="text-xl font-bold text-green-900">
              Grade Records
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {filteredGrades.length} record{filteredGrades.length !== 1 ? "s" : ""}
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
              Grade records will appear here once they are added.
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
                        {grade.studentId}
                      </td>

                      <td className="px-4 py-4 text-slate-600">
                        {grade.courseId}
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
                        {grade.gpaPoints.toFixed(1)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

export default Grades;