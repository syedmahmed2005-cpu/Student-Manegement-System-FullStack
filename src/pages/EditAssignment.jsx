import {
  useEffect,
  useRef,
  useState
} from "react";
import {
  Link,
  useNavigate,
  useParams
} from "react-router-dom";

function EditAssignment({ showToast }) {
  const { assignmentId } = useParams();
  const navigate = useNavigate();

  const [classes, setClasses] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [classId, setClassId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [originalDueDate, setOriginalDueDate] =
    useState("");
  const [totalMarks, setTotalMarks] = useState("");
  const [status, setStatus] = useState("published");

  const [existingAttachment, setExistingAttachment] =
    useState({
      url: "",
      name: ""
    });

  const [attachmentFile, setAttachmentFile] =
    useState(null);
  const [removeAttachment, setRemoveAttachment] =
    useState(false);
  const attachmentInputRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(
    function () {
      async function loadPageData() {
        try {
          setLoading(true);
          setError("");

          const [
            assignmentResponse,
            classesResponse
          ] = await Promise.all([
            fetch(
              `${import.meta.env.VITE_API_URL}/api/assignments/${assignmentId}`,
              {
                credentials: "include"
              }
            ),
            fetch(
              `${import.meta.env.VITE_API_URL}/api/classes/faculty/my-classes`,
              {
                credentials: "include"
              }
            )
          ]);

          const assignmentData =
            await assignmentResponse.json();

          const classesData =
            await classesResponse.json();

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

          const assignment =
            assignmentData.assignment;

          const localDueDate =
            convertToLocalDateTime(
              assignment.dueDate
            );

          setClasses(classesData.classes || []);
          setTitle(assignment.title || "");
          setDescription(
            assignment.description || ""
          );
          setClassId(assignment.classId || "");
          setDueDate(localDueDate);
          setOriginalDueDate(localDueDate);
          setTotalMarks(
            String(assignment.totalMarks || "")
          );
          setStatus(
            assignment.status || "published"
          );

          setExistingAttachment({
            url: assignment.attachmentUrl || "",
            name: assignment.attachmentName || ""
          });
        } catch (requestError) {
          console.log(requestError);
          setError(
            "Unable to connect to the server."
          );
        } finally {
          setLoading(false);
        }
      }

      loadPageData();
    },
    [assignmentId]
  );

  function convertToLocalDateTime(dateValue) {
    const date = new Date(dateValue);

    date.setMinutes(
      date.getMinutes() - date.getTimezoneOffset()
    );

    return date.toISOString().slice(0, 16);
  }

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
    setRemoveAttachment(false);
    setAttachmentFile(file);
  }

  async function updateAssignment(event) {
    event.preventDefault();
    setError("");

    if (
      !title.trim() ||
      !description.trim() ||
      !classId
    ) {
      setError(
        "Please complete all required fields."
      );
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

    if (!dueDate) {
      setError("Please select a due date.");
      return;
    }

    const dueDateWasChanged =
      dueDate !== originalDueDate;

    if (
      dueDateWasChanged &&
      new Date(dueDate) <= new Date()
    ) {
      setError(
        "The new due date must be in the future."
      );
      return;
    }

    const formData = new FormData();

    formData.append("title", title.trim());
    formData.append(
      "description",
      description.trim()
    );
    formData.append("classId", classId);
    formData.append(
      "totalMarks",
      String(parsedMarks)
    );
    formData.append("status", status);

    if (dueDateWasChanged) {
      formData.append(
        "dueDate",
        new Date(dueDate).toISOString()
      );
    }

    if (attachmentFile) {
      formData.append("file", attachmentFile);
    } else if (removeAttachment) {
      formData.append("removeAttachment", "true");
    }

    try {
      setSaving(true);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/assignments/${assignmentId}`,
        {
          method: "PUT",
          credentials: "include",
          body: formData
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Assignment could not be updated."
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
      <main className="mx-auto min-h-screen max-w-5xl bg-app-background px-4 py-8 sm:px-6">
        <div className="rounded-2xl border border-app-border bg-app-surface p-10 text-center shadow-sm">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-green-100 border-t-green-600 dark:border-green-950 dark:border-t-green-400" />

          <p className="font-medium text-app-text-muted">
            Loading assignment...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-5xl bg-app-background px-4 py-8 transition-colors duration-200 sm:px-6">
      <Link
        to={`/assignments/${assignmentId}`}
        className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-green-700 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
      >
        ← Back to Assignment
      </Link>

      <section className="rounded-3xl border border-green-200/70 bg-gradient-to-br from-green-700 via-green-600 to-emerald-500 p-8 text-white shadow-xl shadow-green-900/10 dark:border-green-800">
        <p className="text-sm font-semibold uppercase tracking-widest text-green-100">
          Faculty Workspace
        </p>

        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
          Edit Assignment
        </h1>

        <p className="mt-3 max-w-2xl text-green-50">
          Update the assignment instructions, deadline,
          marks or publishing status.
        </p>
      </section>

      {error && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300">
          {error}
        </div>
      )}

      <form
        onSubmit={updateAssignment}
        className="mt-8 overflow-hidden rounded-2xl border border-app-border bg-app-surface shadow-sm"
      >
        <div className="border-b border-app-border px-6 py-5">
          <h2 className="text-xl font-bold text-app-text">
            Assignment Information
          </h2>

          <p className="mt-1 text-sm text-app-text-muted">
            Changes will become visible according to the
            selected publishing status.
          </p>
        </div>

        <div className="space-y-6 p-6">
          <div>
            <label className="mb-2 block text-sm font-semibold text-app-text">
              Assigned Class
            </label>

            <select
              value={classId}
              onChange={function (event) {
                setClassId(event.target.value);
              }}
              required
              className="w-full rounded-xl border border-app-border bg-app-surface-soft px-4 py-3 text-sm text-app-text focus:border-green-500 focus:ring-2 focus:ring-green-100 dark:focus:ring-green-900/50"
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
            <label className="mb-2 block text-sm font-semibold text-app-text">
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
              className="w-full rounded-xl border border-app-border bg-app-surface-soft px-4 py-3 text-sm text-app-text focus:border-green-500 focus:ring-2 focus:ring-green-100 dark:focus:ring-green-900/50"
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
              required
              className="w-full resize-y rounded-xl border border-app-border bg-app-surface-soft px-4 py-3 text-sm leading-6 text-app-text focus:border-green-500 focus:ring-2 focus:ring-green-100 dark:focus:ring-green-900/50"
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
                onChange={function (event) {
                  setDueDate(event.target.value);
                }}
                required
                className="w-full rounded-xl border border-app-border bg-app-surface-soft px-4 py-3 text-sm text-app-text focus:border-green-500 focus:ring-2 focus:ring-green-100 dark:focus:ring-green-900/50"
              />

              {dueDate !== originalDueDate && (
                <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">
                  The deadline has been changed.
                </p>
              )}
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
                  Published
                </option>

                <option value="draft">Draft</option>

                <option value="closed">Closed</option>
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

            {existingAttachment.url &&
              !removeAttachment &&
              !attachmentFile && (
                <div className="mb-4 rounded-xl border border-blue-100 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/40">
                  <p className="text-xs font-semibold uppercase tracking-wide text-blue-500 dark:text-blue-400">
                    Current attachment
                  </p>

                  <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <a
                      href={existingAttachment.url}
                      target="_blank"
                      rel="noreferrer"
                      className="break-all font-semibold text-blue-700 hover:underline dark:text-blue-300"
                    >
                      📎{" "}
                      {existingAttachment.name ||
                        "Open current attachment"}
                    </a>

                    <button
                      type="button"
                      onClick={function () {
                        setRemoveAttachment(true);
                        setAttachmentFile(null);

                        if (
                          attachmentInputRef.current
                        ) {
                          attachmentInputRef.current.value =
                            "";
                        }
                      }}
                      className="text-sm font-semibold text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    >
                      Remove attachment
                    </button>
                  </div>
                </div>
              )}

            {removeAttachment && !attachmentFile && (
              <div className="mb-4 flex flex-col gap-3 rounded-xl border border-red-100 bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-red-900 dark:bg-red-950/50">
                <p className="text-sm font-medium text-red-700 dark:text-red-300">
                  The current attachment will be removed
                  when you save.
                </p>

                <button
                  type="button"
                  onClick={function () {
                    setRemoveAttachment(false);
                  }}
                  className="text-sm font-semibold text-green-700 dark:text-green-400"
                >
                  Keep attachment
                </button>
              </div>
            )}

            <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-green-200 bg-green-50/50 px-6 py-8 text-center transition hover:border-green-400 hover:bg-green-50 dark:border-green-900 dark:bg-green-950/30 dark:hover:border-green-700 dark:hover:bg-green-950/50">
              <span className="text-3xl">📎</span>

              <span className="mt-3 break-all font-semibold text-green-800 dark:text-green-300">
                {attachmentFile
                  ? attachmentFile.name
                  : existingAttachment.url
                    ? "Choose a replacement file"
                    : "Choose an assignment file"}
              </span>

              <span className="mt-1 text-sm text-app-text-muted">
                PDF, DOC, DOCX, TXT or ZIP — maximum 4 MB
              </span>

              <input
                ref={attachmentInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.txt,.zip"
                onChange={handleAttachmentChange}
                className="hidden"
              />
            </label>

            {attachmentFile && (
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <p className="text-sm text-amber-600 dark:text-amber-400">
                  {existingAttachment.url
                    ? "This file will replace the current attachment."
                    : "This file will be added to the assignment."}
                </p>

                <button
                  type="button"
                  onClick={function () {
                    setAttachmentFile(null);
                    setRemoveAttachment(false);

                    if (attachmentInputRef.current) {
                      attachmentInputRef.current.value =
                        "";
                    }
                  }}
                  className="text-sm font-semibold text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                >
                  Remove selected file
                </button>
              </div>
            )}
          </div>

          <div className="rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300">
            Setting the assignment to Draft hides it from
            students. Setting it to Closed keeps it
            visible but prevents new submissions.
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-app-border bg-app-surface-soft px-6 py-5 sm:flex-row sm:justify-end">
          <Link
            to={`/assignments/${assignmentId}`}
            className="rounded-xl border border-app-border bg-app-surface px-5 py-3 text-center text-sm font-semibold text-app-text transition hover:bg-app-surface-soft"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-green-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving
              ? "Saving Changes..."
              : "Save Changes"}
          </button>
        </div>
      </form>
    </main>
  );
}

export default EditAssignment;