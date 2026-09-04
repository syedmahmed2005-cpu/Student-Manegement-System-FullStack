import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

function EditAssignment({ showToast }) {
  const { assignmentId } = useParams();
  const navigate = useNavigate();

  const [classes, setClasses] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [classId, setClassId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [originalDueDate, setOriginalDueDate] = useState("");
  const [totalMarks, setTotalMarks] = useState("");
  const [status, setStatus] = useState("published");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(function () {
    async function loadPageData() {
      try {
        setLoading(true);
        setError("");

        const [assignmentResponse, classesResponse] =
          await Promise.all([
            fetch(
              `${import.meta.env.VITE_API_URL}/api/assignments/${assignmentId}`,
              {
                credentials: "include",
              }
            ),

            fetch(
              `${import.meta.env.VITE_API_URL}/api/classes/faculty/my-classes`,
              {
                credentials: "include",
              }
            ),
          ]);

        const assignmentData = await assignmentResponse.json();
        const classesData = await classesResponse.json();

        if (!assignmentResponse.ok) {
          setError(
            assignmentData.message ||
              "Assignment could not be loaded."
          );
          return;
        }

        if (!classesResponse.ok) {
          setError(
            classesData.message ||
              "Faculty classes could not be loaded."
          );
          return;
        }

        const assignment = assignmentData.assignment;
        const localDueDate = convertToLocalDateTime(
          assignment.dueDate
        );

        setClasses(classesData.classes || []);
        setTitle(assignment.title || "");
        setDescription(assignment.description || "");
        setClassId(assignment.classId || "");
        setDueDate(localDueDate);
        setOriginalDueDate(localDueDate);
        setTotalMarks(String(assignment.totalMarks || ""));
        setStatus(assignment.status || "published");
      } catch (requestError) {
        console.log(requestError);
        setError("Unable to connect to the server.");
      } finally {
        setLoading(false);
      }
    }

    loadPageData();
  }, [assignmentId]);

  function convertToLocalDateTime(dateValue) {
    const date = new Date(dateValue);

    date.setMinutes(
      date.getMinutes() - date.getTimezoneOffset()
    );

    return date.toISOString().slice(0, 16);
  }

  function getClassLabel(classItem) {
    const courseCode =
      classItem.courseCode || classItem.courseId || "Course";

    const courseName = classItem.courseName
      ? ` - ${classItem.courseName}`
      : "";

    return `${courseCode}${courseName} | Batch ${classItem.batchId} | Semester ${classItem.semester}`;
  }

  async function updateAssignment(event) {
    event.preventDefault();
    setError("");

    if (!title.trim() || !description.trim() || !classId) {
      setError("Please complete all required fields.");
      return;
    }

    const parsedMarks = Number(totalMarks);

    if (!Number.isFinite(parsedMarks) || parsedMarks <= 0) {
      setError("Total marks must be greater than zero.");
      return;
    }

    if (!dueDate) {
      setError("Please select a due date.");
      return;
    }

    const dueDateWasChanged = dueDate !== originalDueDate;

    if (
      dueDateWasChanged &&
      new Date(dueDate) <= new Date()
    ) {
      setError("The new due date must be in the future.");
      return;
    }

    const requestBody = {
      title: title.trim(),
      description: description.trim(),
      classId: classId,
      totalMarks: parsedMarks,
      status: status,
    };

    if (dueDateWasChanged) {
      requestBody.dueDate = new Date(dueDate).toISOString();
    }

    try {
      setSaving(true);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/assignments/${assignmentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(requestBody),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message || "Assignment could not be updated."
        );
        return;
      }

      showToast(
        "Assignment updated successfully.",
        "success"
      );

      navigate(`/assignments/${assignmentId}`);
    } catch (requestError) {
      console.log(requestError);
      setError("Unable to connect to the server.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="rounded-2xl border border-green-100 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-green-100 border-t-green-600"></div>

          <p className="font-medium text-slate-600">
            Loading assignment...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <Link
        to={`/assignments/${assignmentId}`}
        className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-green-700 hover:text-green-800"
      >
        ← Back to Assignment
      </Link>

      <section className="rounded-3xl border border-green-200/70 bg-gradient-to-br from-green-700 via-green-600 to-emerald-500 p-8 text-white shadow-xl shadow-green-900/10">
        <p className="text-sm font-semibold uppercase tracking-widest text-green-100">
          Faculty Workspace
        </p>

        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
          Edit Assignment
        </h1>

        <p className="mt-3 max-w-2xl text-green-50">
          Update the assignment instructions, deadline, marks or publishing status.
        </p>
      </section>

      {error && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      <form
        onSubmit={updateAssignment}
        className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
      >
        <div className="border-b border-slate-100 px-6 py-5">
          <h2 className="text-xl font-bold text-slate-800">
            Assignment Information
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Changes will become visible according to the selected publishing status.
          </p>
        </div>

        <div className="space-y-6 p-6">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Assigned Class
            </label>

            <select
              value={classId}
              onChange={function (event) {
                setClassId(event.target.value);
              }}
              required
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
            >
              <option value="">Select a class</option>

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
                onChange={function (event) {
                  setDueDate(event.target.value);
                }}
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
              />

              {dueDate !== originalDueDate && (
                <p className="mt-2 text-xs text-amber-600">
                  The deadline has been changed.
                </p>
              )}
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
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>

          <div className="rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-700">
            Setting the assignment to Draft hides it from students. Setting it to Closed keeps it visible but prevents new submissions.
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50 px-6 py-5 sm:flex-row sm:justify-end">
          <Link
            to={`/assignments/${assignmentId}`}
            className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-green-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving Changes..." : "Save Changes"}
          </button>
        </div>
      </form>
    </main>
  );
}

export default EditAssignment;