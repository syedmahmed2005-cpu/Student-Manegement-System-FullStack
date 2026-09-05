import {
  useEffect,
  useRef,
  useState
} from "react";
import { Link, useParams } from "react-router-dom";

function ViewAssignment({ user, showToast }) {
  const { assignmentId } = useParams();

  const [assignment, setAssignment] = useState(null);
  const [classDetails, setClassDetails] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [submissionText, setSubmissionText] =
    useState("");
  const [submissionFile, setSubmissionFile] =
    useState(null);
  const submissionFileInputRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const isAdmin = user.role === "admin";
  const isFaculty = user.role === "faculty";
  const isStudent = user.role === "student";

  useEffect(
    function () {
      async function loadAssignment() {
        try {
          setLoading(true);
          setError("");

          const assignmentResponse = await fetch(
            `${import.meta.env.VITE_API_URL}/api/assignments/${assignmentId}`,
            {
              credentials: "include"
            }
          );

          const assignmentData =
            await assignmentResponse.json();

          if (!assignmentResponse.ok) {
            setError(
              assignmentData.message ||
                "Assignment could not be loaded."
            );
            return;
          }

          setAssignment(assignmentData.assignment);
          setClassDetails(
            assignmentData.class || null
          );

          if (isStudent) {
            const submissionResponse = await fetch(
              `${import.meta.env.VITE_API_URL}/api/assignments/${assignmentId}/my-submission`,
              {
                credentials: "include"
              }
            );

            const submissionData =
              await submissionResponse.json();

            if (!submissionResponse.ok) {
              setError(
                submissionData.message ||
                  "Your submission could not be loaded."
              );
              return;
            }

            setSubmission(
              submissionData.submission || null
            );

            setSubmissionText(
              submissionData.submission
                ?.submissionText || ""
            );
          }
        } catch (requestError) {
          console.log(requestError);
          setError(
            "Unable to connect to the server."
          );
        } finally {
          setLoading(false);
        }
      }

      loadAssignment();
    },
    [assignmentId, isStudent]
  );

  function handleSubmissionFileChange(event) {
    const file = event.target.files[0];

    if (!file) {
      setSubmissionFile(null);
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
      setSubmissionFile(null);
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      setError("File size cannot exceed 4 MB.");

      event.target.value = "";
      setSubmissionFile(null);
      return;
    }

    setError("");
    setSubmissionFile(file);
  }

  async function submitAssignment(event) {
    event.preventDefault();

    const cleanText = submissionText.trim();
    const hasExistingFile = Boolean(
      submission?.fileUrl
    );

    if (
      !cleanText &&
      !submissionFile &&
      !hasExistingFile
    ) {
      setError(
        "Please enter a response or select a file."
      );
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const formData = new FormData();

      formData.append(
        "submissionText",
        cleanText
      );

      if (submissionFile) {
        formData.append("file", submissionFile);
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/assignments/${assignmentId}/submit`,
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
            "Assignment could not be submitted."
        );
        return;
      }

      const wasPreviouslySubmitted =
        submission !== null;

      setSubmission(data.submission);
      setSubmissionFile(null);

      if (submissionFileInputRef.current) {
        submissionFileInputRef.current.value = "";
      }

      showToast(
        wasPreviouslySubmitted
          ? "Submission updated successfully."
          : "Assignment submitted successfully.",
        "success"
      );
    } catch (requestError) {
      console.log(requestError);
      setError("Unable to connect to the server.");
    } finally {
      setSubmitting(false);
    }
  }

  function getStatusStyle(status) {
    if (status === "published") {
      return "border-green-200 bg-green-50 text-green-700 dark:border-green-900 dark:bg-green-950/50 dark:text-green-300";
    }

    if (status === "closed") {
      return "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300";
    }

    return "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-300";
  }

  function formatDate(date) {
    return new Date(date).toLocaleString([], {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit"
    });
  }

  if (loading) {
    return (
      <main className="mx-auto min-h-screen max-w-6xl bg-app-background px-4 py-8 sm:px-6">
        <div className="rounded-2xl border border-app-border bg-app-surface p-10 text-center shadow-sm">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-green-100 border-t-green-600 dark:border-green-950 dark:border-t-green-400" />

          <p className="font-medium text-app-text-muted">
            Loading assignment...
          </p>
        </div>
      </main>
    );
  }

  if (!assignment) {
    return (
      <main className="mx-auto min-h-screen max-w-6xl bg-app-background px-4 py-8 sm:px-6">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-900 dark:bg-red-950/50">
          <h1 className="text-xl font-bold text-red-700 dark:text-red-300">
            Assignment unavailable
          </h1>

          <p className="mt-2 text-red-600 dark:text-red-400">
            {error ||
              "The assignment could not be found."}
          </p>

          <Link
            to="/assignments"
            className="mt-5 inline-block rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
          >
            Back to Assignments
          </Link>
        </div>
      </main>
    );
  }

  const deadlinePassed =
    new Date() > new Date(assignment.dueDate);

  const canSubmit =
    isStudent &&
    assignment.status === "published" &&
    !deadlinePassed;

  return (
    <main className="mx-auto min-h-screen max-w-6xl bg-app-background px-4 py-8 transition-colors duration-200 sm:px-6">
      <Link
        to="/assignments"
        className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-green-700 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
      >
        ← Back to Assignments
      </Link>

      <section className="rounded-3xl border border-green-200/70 bg-gradient-to-br from-green-700 via-green-600 to-emerald-500 p-8 text-white shadow-xl shadow-green-900/10 dark:border-green-800">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-green-100">
              {classDetails?.courseId ||
                "Course Assignment"}
            </p>

            <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
              {assignment.title}
            </h1>

            <p className="mt-3 text-green-50">
              Created by{" "}
              {assignment.createdBy?.name ||
                "Faculty"}
            </p>
          </div>

          <span
            className={`self-start rounded-full border px-4 py-2 text-sm font-bold capitalize ${getStatusStyle(
              assignment.status
            )}`}
          >
            {assignment.status}
          </span>
        </div>
      </section>

      {error && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300">
          {error}
        </div>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-app-border bg-app-surface p-6 shadow-sm">
            <h2 className="text-xl font-bold text-app-text">
              Assignment Instructions
            </h2>

            <p className="mt-4 whitespace-pre-wrap leading-7 text-app-text-muted">
              {assignment.description}
            </p>

            {assignment.attachmentUrl && (
              <div className="mt-6 border-t border-app-border pt-5">
                <a
                  href={assignment.attachmentUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700 transition hover:bg-green-100 dark:border-green-900 dark:bg-green-950/40 dark:text-green-300 dark:hover:bg-green-950/60"
                >
                  📎{" "}
                  {assignment.attachmentName ||
                    "Open assignment attachment"}
                </a>
              </div>
            )}
          </section>

          {isStudent && (
            <section className="rounded-2xl border border-app-border bg-app-surface shadow-sm">
              <div className="border-b border-app-border px-6 py-5">
                <h2 className="text-xl font-bold text-app-text">
                  Your Submission
                </h2>

                <p className="mt-1 text-sm text-app-text-muted">
                  {submission
                    ? "You can update your response before the deadline."
                    : "Enter your completed work below."}
                </p>
              </div>

              {canSubmit ? (
                <form
                  onSubmit={submitAssignment}
                  className="p-6"
                >
                  <label className="mb-2 block text-sm font-semibold text-app-text">
                    Submission Response
                  </label>

                  <textarea
                    value={submissionText}
                    onChange={function (event) {
                      setSubmissionText(
                        event.target.value
                      );
                    }}
                    rows="9"
                    placeholder="Enter your assignment response..."
                    className="w-full resize-y rounded-xl border border-app-border bg-app-surface-soft px-4 py-3 text-sm leading-6 text-app-text placeholder:text-app-text-muted focus:border-green-500 focus:ring-2 focus:ring-green-100 dark:focus:ring-green-900/50"
                  />

                  <div className="mt-5">
                    <label className="mb-2 block text-sm font-semibold text-app-text">
                      Submission File

                      <span className="ml-1 font-normal text-app-text-muted">
                        (Optional)
                      </span>
                    </label>

                    <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-green-200 bg-green-50/50 px-6 py-7 text-center transition hover:border-green-400 hover:bg-green-50 dark:border-green-900 dark:bg-green-950/30 dark:hover:border-green-700 dark:hover:bg-green-950/50">
                      <span className="text-3xl">
                        📤
                      </span>

                      <span className="mt-3 break-all font-semibold text-green-800 dark:text-green-300">
                        {submissionFile
                          ? submissionFile.name
                          : "Choose your completed assignment"}
                      </span>

                      <span className="mt-1 text-sm text-app-text-muted">
                        PDF, DOC, DOCX, TXT or ZIP —
                        maximum 4 MB
                      </span>

                      <input
                        ref={submissionFileInputRef}
                        type="file"
                        accept=".pdf,.doc,.docx,.txt,.zip"
                        onChange={
                          handleSubmissionFileChange
                        }
                        className="hidden"
                      />
                    </label>

                    {submissionFile && (
                      <div className="mt-3 flex flex-wrap items-center gap-3">
                        <p className="text-sm text-amber-600 dark:text-amber-400">
                          {submission?.fileUrl
                            ? "This will replace your previously submitted file."
                            : "This file will be uploaded with your submission."}
                        </p>

                        <button
                          type="button"
                          onClick={function () {
                            setSubmissionFile(null);

                            if (
                              submissionFileInputRef.current
                            ) {
                              submissionFileInputRef.current.value =
                                "";
                            }
                          }}
                          className="text-sm font-semibold text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        >
                          Remove selected file
                        </button>
                      </div>
                    )}

                    {!submissionFile &&
                      submission?.fileUrl && (
                        <div className="mt-3 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 dark:border-blue-900 dark:bg-blue-950/40">
                          <p className="text-xs font-semibold uppercase tracking-wide text-blue-500 dark:text-blue-400">
                            Current submitted file
                          </p>

                          <a
                            href={submission.fileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-1 inline-block text-sm font-semibold text-blue-700 hover:underline dark:text-blue-300"
                          >
                            📎{" "}
                            {submission.fileName ||
                              "Open submitted file"}
                          </a>
                        </div>
                      )}
                  </div>

                  <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-app-text-muted">
                      {submission
                        ? `Last submitted: ${formatDate(
                            submission.submittedAt
                          )}`
                        : "No submission has been made yet."}
                    </p>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="rounded-xl bg-green-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {submitting
                        ? "Submitting..."
                        : submission
                          ? "Update Submission"
                          : "Submit Assignment"}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="p-6">
                  {submission ? (
                    <div>
                      <div className="rounded-xl bg-app-surface-soft p-5">
                        <p className="whitespace-pre-wrap leading-7 text-app-text">
                          {submission.submissionText ||
                            "No written response was provided."}
                        </p>
                      </div>

                      {submission.fileUrl && (
                        <a
                          href={submission.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-4 inline-flex rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700 dark:border-green-900 dark:bg-green-950/40 dark:text-green-300"
                        >
                          📎{" "}
                          {submission.fileName ||
                            "Open submitted file"}
                        </a>
                      )}

                      <p className="mt-3 text-sm text-app-text-muted">
                        Submitted on{" "}
                        {formatDate(
                          submission.submittedAt
                        )}
                      </p>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-red-100 bg-red-50 p-5 text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300">
                      {deadlinePassed
                        ? "The deadline has passed and no submission was made."
                        : "This assignment is not currently accepting submissions."}
                    </div>
                  )}
                </div>
              )}

              {submission?.status === "graded" && (
                <div className="border-t border-app-border p-6">
                  <h3 className="font-bold text-app-text">
                    Faculty Evaluation
                  </h3>

                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-xl border border-green-100 bg-green-50 p-4 dark:border-green-900 dark:bg-green-950/40">
                      <p className="text-sm font-medium text-green-700 dark:text-green-300">
                        Marks
                      </p>

                      <p className="mt-1 text-2xl font-bold text-green-800 dark:text-green-200">
                        {submission.marks} /{" "}
                        {assignment.totalMarks}
                      </p>
                    </div>

                    <div className="rounded-xl border border-app-border bg-app-surface-soft p-4">
                      <p className="text-sm font-medium text-app-text-muted">
                        Feedback
                      </p>

                      <p className="mt-1 text-app-text">
                        {submission.feedback ||
                          "No written feedback provided."}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </section>
          )}
        </div>

        <aside className="space-y-6">
          <section className="rounded-2xl border border-app-border bg-app-surface p-6 shadow-sm">
            <h2 className="text-lg font-bold text-app-text">
              Assignment Details
            </h2>

            <div className="mt-5 space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-app-text-muted">
                  Course
                </p>

                <p className="mt-1 font-semibold text-app-text">
                  {classDetails?.courseId || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-app-text-muted">
                  Batch
                </p>

                <p className="mt-1 font-semibold text-app-text">
                  {classDetails?.batchId || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-app-text-muted">
                  Semester
                </p>

                <p className="mt-1 font-semibold text-app-text">
                  {classDetails?.semester || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-app-text-muted">
                  Total Marks
                </p>

                <p className="mt-1 font-semibold text-app-text">
                  {assignment.totalMarks}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-app-text-muted">
                  Deadline
                </p>

                <p
                  className={`mt-1 font-semibold ${
                    deadlinePassed
                      ? "text-red-600 dark:text-red-400"
                      : "text-app-text"
                  }`}
                >
                  {formatDate(assignment.dueDate)}
                </p>
              </div>
            </div>
          </section>

          {(isFaculty || isAdmin) && (
            <section className="rounded-2xl border border-green-100 bg-green-50 p-6 dark:border-green-900 dark:bg-green-950/40">
              <h2 className="font-bold text-green-900 dark:text-green-200">
                Assignment Management
              </h2>

              <div className="mt-4 space-y-3">
                {isFaculty && (
                  <Link
                    to={`/assignments/${assignment._id}/edit`}
                    className="block rounded-xl bg-app-surface px-4 py-3 text-center text-sm font-semibold text-green-700 shadow-sm transition hover:shadow-md dark:text-green-300"
                  >
                    Edit Assignment
                  </Link>
                )}

                <Link
                  to={`/assignments/${assignment._id}/submissions`}
                  className="block rounded-xl bg-green-600 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-green-700"
                >
                  View Student Submissions
                </Link>
              </div>
            </section>
          )}
        </aside>
      </div>
    </main>
  );
}

export default ViewAssignment;