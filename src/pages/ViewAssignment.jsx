import { useEffect,useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";

function ViewAssignment({ user, showToast }) {
  const { assignmentId } = useParams();

  const [assignment, setAssignment] = useState(null);
  const [classDetails, setClassDetails] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [submissionText, setSubmissionText] = useState("");
  const [submissionFile, setSubmissionFile] = useState(null);
  const submissionFileInputRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const isAdmin = user.role === "admin";
  const isFaculty = user.role === "faculty";
  const isStudent = user.role === "student";

  useEffect(function () {
    async function loadAssignment() {
      try {
        setLoading(true);
        setError("");

        const assignmentResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/api/assignments/${assignmentId}`,
          {
            credentials: "include",
          }
        );

        const assignmentData = await assignmentResponse.json();

        if (!assignmentResponse.ok) {
          setError(
            assignmentData.message || "Assignment could not be loaded."
          );
          return;
        }

        setAssignment(assignmentData.assignment);
        setClassDetails(assignmentData.class || null);

        if (isStudent) {
          const submissionResponse = await fetch(
            `${import.meta.env.VITE_API_URL}/api/assignments/${assignmentId}/my-submission`,
            {
              credentials: "include",
            }
          );

          const submissionData = await submissionResponse.json();

          if (!submissionResponse.ok) {
            setError(
              submissionData.message ||
                "Your submission could not be loaded."
            );
            return;
          }

          setSubmission(submissionData.submission || null);
          setSubmissionText(
            submissionData.submission?.submissionText || ""
          );
        }
      } catch (requestError) {
        console.log(requestError);
        setError("Unable to connect to the server.");
      } finally {
        setLoading(false);
      }
    }

    loadAssignment();
  }, [assignmentId, isStudent]);


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
    "zip",
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

    const hasExistingFile = Boolean(submission?.fileUrl);

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

formData.append("submissionText", cleanText);

if (submissionFile) {
  formData.append("file", submissionFile);
}

const response = await fetch(
  `${import.meta.env.VITE_API_URL}/api/assignments/${assignmentId}/submit`,
  {
    method: "POST",
    credentials: "include",
    body: formData,
  }
);

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message || "Assignment could not be submitted."
        );
        return;
      }

      const wasPreviouslySubmitted = submission !== null;

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
      return "border-green-200 bg-green-50 text-green-700";
    }

    if (status === "closed") {
      return "border-red-200 bg-red-50 text-red-700";
    }

    return "border-amber-200 bg-amber-50 text-amber-700";
  }

  function formatDate(date) {
    return new Date(date).toLocaleString([], {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="rounded-2xl border border-green-100 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-green-100 border-t-green-600"></div>

          <p className="font-medium text-slate-600">
            Loading assignment...
          </p>
        </div>
      </main>
    );
  }

  if (!assignment) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
          <h1 className="text-xl font-bold text-red-700">
            Assignment unavailable
          </h1>

          <p className="mt-2 text-red-600">
            {error || "The assignment could not be found."}
          </p>

          <Link
            to="/assignments"
            className="mt-5 inline-block rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white"
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
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <Link
        to="/assignments"
        className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-green-700 hover:text-green-800"
      >
        ← Back to Assignments
      </Link>

      <section className="rounded-3xl border border-green-200/70 bg-gradient-to-br from-green-700 via-green-600 to-emerald-500 p-8 text-white shadow-xl shadow-green-900/10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-green-100">
              {classDetails?.courseId || "Course Assignment"}
            </p>

            <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
              {assignment.title}
            </h1>

            <p className="mt-3 text-green-50">
              Created by{" "}
              {assignment.createdBy?.name || "Faculty"}
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
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-800">
              Assignment Instructions
            </h2>

            <p className="mt-4 whitespace-pre-wrap leading-7 text-slate-600">
              {assignment.description}
            </p>

            {assignment.attachmentUrl && (
              <div className="mt-6 border-t border-slate-100 pt-5">
                <a
                  href={assignment.attachmentUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700 transition hover:bg-green-100"
                >
                  📎{" "}
                  {assignment.attachmentName ||
                    "Open assignment attachment"}
                </a>
              </div>
            )}
          </section>

          {isStudent && (
            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-6 py-5">
                <h2 className="text-xl font-bold text-slate-800">
                  Your Submission
                </h2>

                <p className="mt-1 text-sm text-slate-500">
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
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Submission Response
                  </label>

                  <textarea
                    value={submissionText}
                    onChange={function (event) {
                      setSubmissionText(event.target.value);
                    }}
                    rows="9"
                    placeholder="Enter your assignment response..."
                    className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm leading-6 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                  ></textarea>
                    <div className="mt-5">
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Submission File
                        <span className="ml-1 font-normal text-slate-400">
                        (Optional)
                        </span>
                    </label>

                    <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-green-200 bg-green-50/50 px-6 py-7 text-center transition hover:border-green-400 hover:bg-green-50">
                        <span className="text-3xl">📤</span>

                        <span className="mt-3 font-semibold text-green-800">
                        {submissionFile
                            ? submissionFile.name
                            : "Choose your completed assignment"}
                        </span>

                        <span className="mt-1 text-sm text-slate-500">
                        PDF, DOC, DOCX, TXT or ZIP — maximum 4 MB
                        </span>

                        <input
                        ref={submissionFileInputRef}
                        type="file"
                        accept=".pdf,.doc,.docx,.txt,.zip"
                        onChange={handleSubmissionFileChange}
                        className="hidden"
                        />
                    </label>

                    {submissionFile && (
                        <div className="mt-3 flex flex-wrap items-center gap-3">
                        <p className="text-sm text-amber-600">
                            {submission?.fileUrl
                            ? "This will replace your previously submitted file."
                            : "This file will be uploaded with your submission."}
                        </p>

                        <button
                            type="button"
                            onClick={function () {
                            setSubmissionFile(null);

                            if (submissionFileInputRef.current) {
                                submissionFileInputRef.current.value = "";
                            }
                            }}
                            className="text-sm font-semibold text-red-600 hover:text-red-700"
                        >
                            Remove selected file
                        </button>
                        </div>
                    )}

                    {!submissionFile && submission?.fileUrl && (
                        <div className="mt-3 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-blue-500">
                            Current submitted file
                        </p>

                        <a
                            href={submission.fileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-1 inline-block text-sm font-semibold text-blue-700 hover:underline"
                        >
                            📎 {submission.fileName || "Open submitted file"}
                        </a>
                        </div>
                    )}
                    </div>
                  <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-slate-500">
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
    <div className="rounded-xl bg-slate-50 p-5">
      <p className="whitespace-pre-wrap leading-7 text-slate-700">
        {submission.submissionText ||
          "No written response was provided."}
      </p>
    </div>

    {submission.fileUrl && (
      <a
        href={submission.fileUrl}
        target="_blank"
        rel="noreferrer"
        className="mt-4 inline-flex rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700"
      >
        📎{" "}
        {submission.fileName ||
          "Open submitted file"}
      </a>
    )}

    <p className="mt-3 text-sm text-slate-500">
      Submitted on{" "}
      {formatDate(submission.submittedAt)}
    </p>
  </div>
) : (
      <div className="rounded-xl border border-red-100 bg-red-50 p-5 text-red-700">
                      {deadlinePassed
                        ? "The deadline has passed and no submission was made."
                        : "This assignment is not currently accepting submissions."}
                    </div>
                  )}
                </div>
              )}

              {submission?.status === "graded" && (
                <div className="border-t border-slate-100 p-6">
                  <h3 className="font-bold text-slate-800">
                    Faculty Evaluation
                  </h3>

                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-xl border border-green-100 bg-green-50 p-4">
                      <p className="text-sm font-medium text-green-700">
                        Marks
                      </p>

                      <p className="mt-1 text-2xl font-bold text-green-800">
                        {submission.marks} / {assignment.totalMarks}
                      </p>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-sm font-medium text-slate-500">
                        Feedback
                      </p>

                      <p className="mt-1 text-slate-700">
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
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800">
              Assignment Details
            </h2>

            <div className="mt-5 space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Course
                </p>

                <p className="mt-1 font-semibold text-slate-800">
                  {classDetails?.courseId || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Batch
                </p>

                <p className="mt-1 font-semibold text-slate-800">
                  {classDetails?.batchId || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Semester
                </p>

                <p className="mt-1 font-semibold text-slate-800">
                  {classDetails?.semester || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Total Marks
                </p>

                <p className="mt-1 font-semibold text-slate-800">
                  {assignment.totalMarks}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Deadline
                </p>

                <p
                  className={`mt-1 font-semibold ${
                    deadlinePassed
                      ? "text-red-600"
                      : "text-slate-800"
                  }`}
                >
                  {formatDate(assignment.dueDate)}
                </p>
              </div>
            </div>
          </section>

          {(isFaculty || isAdmin) && (
            <section className="rounded-2xl border border-green-100 bg-green-50 p-6">
              <h2 className="font-bold text-green-900">
                Assignment Management
              </h2>

              <div className="mt-4 space-y-3">
                {isFaculty && (
                  <Link
                    to={`/assignments/${assignment._id}/edit`}
                    className="block rounded-xl bg-white px-4 py-3 text-center text-sm font-semibold text-green-700 shadow-sm transition hover:shadow-md"
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