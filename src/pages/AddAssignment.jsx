import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function AddAssignment({ showToast }) {
  const navigate = useNavigate();

  const [classes, setClasses] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [classId, setClassId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [totalMarks, setTotalMarks] = useState("10");
  const [status, setStatus] = useState("published");

  const [loadingClasses, setLoadingClasses] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(function () {
    async function fetchFacultyClasses() {
      try {
        setLoadingClasses(true);
        setError("");

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/classes/faculty/my-classes`,
          {
            credentials: "include",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          setError(
            data.message || "Faculty classes could not be loaded."
          );
          return;
        }

        setClasses(data.classes || []);
      } catch (requestError) {
        console.log(requestError);
        setError("Unable to connect to the server.");
      } finally {
        setLoadingClasses(false);
      }
    }

    fetchFacultyClasses();
  }, []);

  function getClassLabel(classItem) {
    const courseCode =
      classItem.courseCode || classItem.courseId || "Course";

    const courseName = classItem.courseName
      ? ` - ${classItem.courseName}`
      : "";

    return `${courseCode}${courseName} | Batch ${classItem.batchId} | Semester ${classItem.semester}`;
  }

  function getMinimumDateTime() {
    const date = new Date();

    date.setMinutes(
      date.getMinutes() - date.getTimezoneOffset()
    );

    return date.toISOString().slice(0, 16);
  }

  async function createAssignment(event) {
    event.preventDefault();
    setError("");

    if (!classId) {
      setError("Please select a class.");
      return;
    }

    if (!dueDate) {
      setError("Please select a due date.");
      return;
    }

    const parsedMarks = Number(totalMarks);

    if (!Number.isFinite(parsedMarks) || parsedMarks <= 0) {
      setError("Total marks must be greater than zero.");
      return;
    }

    if (new Date(dueDate) <= new Date()) {
      setError("Due date must be in the future.");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/assignments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            title: title.trim(),
            description: description.trim(),
            classId: classId,
            dueDate: new Date(dueDate).toISOString(),
            totalMarks: parsedMarks,
            status: status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message || "Assignment could not be created."
        );
        return;
      }

      showToast(
        status === "draft"
          ? "Assignment saved as draft."
          : "Assignment published successfully.",
        "success"
      );

      navigate("/assignments");
    } catch (requestError) {
      console.log(requestError);
      setError("Unable to connect to the server.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <section className="rounded-3xl border border-green-200/70 bg-gradient-to-br from-green-700 via-green-600 to-emerald-500 p-8 text-white shadow-xl shadow-green-900/10">
        <p className="text-sm font-semibold uppercase tracking-widest text-green-100">
          Faculty Workspace
        </p>

        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
          Create Assignment
        </h1>

        <p className="mt-3 max-w-2xl text-green-50">
          Create coursework for one of your assigned classes and set its deadline and marks.
        </p>
      </section>

      {error && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      <form
        onSubmit={createAssignment}
        className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
      >
        <div className="border-b border-slate-100 px-6 py-5">
          <h2 className="text-xl font-bold text-slate-800">
            Assignment Information
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Complete the details below before publishing the assignment.
          </p>
        </div>

        <div className="space-y-6 p-6">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Assigned Class
            </label>

            <select
              value={classId}
              disabled={loadingClasses}
              onChange={function (event) {
                setClassId(event.target.value);
              }}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100 disabled:bg-slate-100"
              required
            >
              <option value="">
                {loadingClasses
                  ? "Loading your classes..."
                  : "Select a class"}
              </option>

              {classes.map(function (classItem) {
                return (
                  <option
                    key={classItem._id}
                    value={classItem._id}
                  >
                    {getClassLabel(classItem)}
                  </option>
                );
              })}
            </select>

            {!loadingClasses && classes.length === 0 && (
              <p className="mt-2 text-sm text-amber-600">
                You do not currently have any assigned classes.
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Assignment Title
            </label>

            <input
              type="text"
              value={title}
              onChange={function (event) {
                setTitle(event.target.value);
              }}
              placeholder="For example: React Components Assignment"
              maxLength="150"
              required
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Description
            </label>

            <textarea
              value={description}
              onChange={function (event) {
                setDescription(event.target.value);
              }}
              rows="7"
              placeholder="Explain the assignment requirements, instructions and expected work..."
              required
              className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm leading-6 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
            ></textarea>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Due Date
              </label>

              <input
                type="datetime-local"
                value={dueDate}
                min={getMinimumDateTime()}
                onChange={function (event) {
                  setDueDate(event.target.value);
                }}
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Total Marks
              </label>

              <input
                type="number"
                min="1"
                step="1"
                value={totalMarks}
                onChange={function (event) {
                  setTotalMarks(event.target.value);
                }}
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Publishing Status
              </label>

              <select
                value={status}
                onChange={function (event) {
                  setStatus(event.target.value);
                }}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
              >
                <option value="published">Publish now</option>
                <option value="draft">Save as draft</option>
              </select>
            </div>
          </div>

          <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700">
            File attachments will be added after the core assignment and submission workflow has been verified.
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50 px-6 py-5 sm:flex-row sm:justify-end">
          <Link
            to="/assignments"
            className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={
              saving ||
              loadingClasses ||
              classes.length === 0
            }
            className="rounded-xl bg-green-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving
              ? "Saving Assignment..."
              : status === "draft"
              ? "Save as Draft"
              : "Publish Assignment"}
          </button>
        </div>
      </form>
    </main>
  );
}

export default AddAssignment;