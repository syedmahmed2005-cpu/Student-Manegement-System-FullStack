import { useEffect, useState } from "react";
import {
  Link,
  useNavigate
} from "react-router-dom";

function AddAssignment({ showToast }) {
  const navigate = useNavigate();

  const [classes, setClasses] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [classId, setClassId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [totalMarks, setTotalMarks] = useState("10");
  const [status, setStatus] = useState("published");
  const [attachmentFile, setAttachmentFile] =
    useState(null);
  const [loadingClasses, setLoadingClasses] =
    useState(true);
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
            credentials: "include"
          }
        );

        const data = await response.json();

        if (!response.ok) {
          setError(
            data.message ||
              "Faculty classes could not be loaded."
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
      classItem.courseCode ||
      classItem.courseId ||
      "Course";

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

  function handleAttachmentChange(event) {
    const file = event.target.files[0];

    if (!file) {
      setAttachmentFile(null);
      return;
    }

    const allowedExtensions = [
      "pdf",
      "doc",
      "docx",
      "txt",
      "zip"
    ];

    const extension = file.name
      .split(".")
      .pop()
      .toLowerCase();

    if (!allowedExtensions.includes(extension)) {
      setError(
        "Only PDF, DOC, DOCX, TXT and ZIP files are allowed."
      );

      event.target.value = "";
      setAttachmentFile(null);
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      setError("File size cannot exceed 4 MB.");

      event.target.value = "";
      setAttachmentFile(null);
      return;
    }

    setError("");
    setAttachmentFile(file);
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

    if (
      !Number.isFinite(parsedMarks) ||
      parsedMarks <= 0
    ) {
      setError(
        "Total marks must be greater than zero."
      );
      return;
    }

    if (new Date(dueDate) <= new Date()) {
      setError("Due date must be in the future.");
      return;
    }

    try {
      setSaving(true);

      const formData = new FormData();

      formData.append("title", title.trim());
      formData.append(
        "description",
        description.trim()
      );
      formData.append("classId", classId);

      formData.append(
        "dueDate",
        new Date(dueDate).toISOString()
      );

      formData.append(
        "totalMarks",
        String(parsedMarks)
      );

      formData.append("status", status);

      if (attachmentFile) {
        formData.append("file", attachmentFile);
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/assignments`,
        {
          method: "POST",
          credentials: "include",
          body: formData
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Assignment could not be created."
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
    <main className="mx-auto min-h-screen max-w-5xl bg-app-background px-4 py-8 transition-colors duration-200 sm:px-6">
      <section className="rounded-3xl border border-green-200/70 bg-gradient-to-br from-green-700 via-green-600 to-emerald-500 p-8 text-white shadow-xl shadow-green-900/10 dark:border-green-800">
        <p className="text-sm font-semibold uppercase tracking-widest text-green-100">
          Faculty Workspace
        </p>

        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
          Create Assignment
        </h1>

        <p className="mt-3 max-w-2xl text-green-50">
          Create coursework for one of your assigned
          classes and set its deadline and marks.
        </p>
      </section>

      {error && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300">
          {error}
        </div>
      )}

      <form
        onSubmit={createAssignment}
        className="mt-8 overflow-hidden rounded-2xl border border-app-border bg-app-surface shadow-sm"
      >
        <div className="border-b border-app-border px-6 py-5">
          <h2 className="text-xl font-bold text-app-text">
            Assignment Information
          </h2>

          <p className="mt-1 text-sm text-app-text-muted">
            Complete the details below before publishing
            the assignment.
          </p>
        </div>

        <div className="space-y-6 p-6">
          <div>
            <label className="mb-2 block text-sm font-semibold text-app-text">
              Assigned Class
            </label>

            <select
              value={classId}
              disabled={loadingClasses}
              onChange={function (event) {
                setClassId(event.target.value);
              }}
              className="w-full rounded-xl border border-app-border bg-app-surface-soft px-4 py-3 text-sm text-app-text focus:border-green-500 focus:ring-2 focus:ring-green-100 disabled:opacity-60 dark:focus:ring-green-900/50"
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

            {!loadingClasses &&
              classes.length === 0 && (
                <p className="mt-2 text-sm text-amber-600 dark:text-amber-400">
                  You do not currently have any assigned
                  classes.
                </p>
              )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-app-text">
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
              className="w-full rounded-xl border border-app-border bg-app-surface-soft px-4 py-3 text-sm text-app-text placeholder:text-app-text-muted focus:border-green-500 focus:ring-2 focus:ring-green-100 dark:focus:ring-green-900/50"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-app-text">
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
              className="w-full resize-y rounded-xl border border-app-border bg-app-surface-soft px-4 py-3 text-sm leading-6 text-app-text placeholder:text-app-text-muted focus:border-green-500 focus:ring-2 focus:ring-green-100 dark:focus:ring-green-900/50"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-semibold text-app-text">
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
                className="w-full rounded-xl border border-app-border bg-app-surface-soft px-4 py-3 text-sm text-app-text focus:border-green-500 focus:ring-2 focus:ring-green-100 dark:focus:ring-green-900/50"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-app-text">
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
                className="w-full rounded-xl border border-app-border bg-app-surface-soft px-4 py-3 text-sm text-app-text focus:border-green-500 focus:ring-2 focus:ring-green-100 dark:focus:ring-green-900/50"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-app-text">
                Publishing Status
              </label>

              <select
                value={status}
                onChange={function (event) {
                  setStatus(event.target.value);
                }}
                className="w-full rounded-xl border border-app-border bg-app-surface-soft px-4 py-3 text-sm text-app-text focus:border-green-500 focus:ring-2 focus:ring-green-100 dark:focus:ring-green-900/50"
              >
                <option value="published">
                  Publish now
                </option>

                <option value="draft">
                  Save as draft
                </option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-app-text">
              Assignment Attachment

              <span className="ml-1 font-normal text-app-text-muted">
                (Optional)
              </span>
            </label>

            <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-green-200 bg-green-50/50 px-6 py-8 text-center transition hover:border-green-400 hover:bg-green-50 dark:border-green-900 dark:bg-green-950/30 dark:hover:border-green-700 dark:hover:bg-green-950/50">
              <span className="text-3xl">📎</span>

              <span className="mt-3 break-all font-semibold text-green-800 dark:text-green-300">
                {attachmentFile
                  ? attachmentFile.name
                  : "Choose an assignment file"}
              </span>

              <span className="mt-1 text-sm text-app-text-muted">
                PDF, DOC, DOCX, TXT or ZIP — maximum 4 MB
              </span>

              <input
                type="file"
                accept=".pdf,.doc,.docx,.txt,.zip"
                onChange={handleAttachmentChange}
                className="hidden"
              />
            </label>

            {attachmentFile && (
              <button
                type="button"
                onClick={function () {
                  setAttachmentFile(null);
                }}
                className="mt-3 text-sm font-semibold text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                Remove selected file
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-app-border bg-app-surface-soft px-6 py-5 sm:flex-row sm:justify-end">
          <Link
            to="/assignments"
            className="rounded-xl border border-app-border bg-app-surface px-5 py-3 text-center text-sm font-semibold text-app-text transition hover:bg-app-surface-soft"
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