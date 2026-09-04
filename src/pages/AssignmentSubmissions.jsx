import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

function AssignmentSubmissions({ user, showToast }) {
  const { assignmentId } = useParams();

  const [assignment, setAssignment] = useState(null);
  const [classDetails, setClassDetails] = useState(null);
  const [records, setRecords] = useState([]);

  const [summary, setSummary] = useState({
    totalStudents: 0,
    submitted: 0,
    notSubmitted: 0,
    graded: 0,
  });

  const [gradeValues, setGradeValues] = useState({});
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [loading, setLoading] = useState(true);
  const [savingSubmission, setSavingSubmission] = useState("");
  const [error, setError] = useState("");

  const isFaculty = user.role === "faculty";
  const isAdmin = user.role === "admin";

  useEffect(function () {
    async function loadSubmissions() {
      try {
        setLoading(true);
        setError("");

        const [assignmentResponse, submissionsResponse] =
          await Promise.all([
            fetch(
              `${import.meta.env.VITE_API_URL}/api/assignments/${assignmentId}`,
              {
                credentials: "include",
              }
            ),

            fetch(
              `${import.meta.env.VITE_API_URL}/api/assignments/${assignmentId}/submissions`,
              {
                credentials: "include",
              }
            ),
          ]);

        const assignmentData = await assignmentResponse.json();
        const submissionsData = await submissionsResponse.json();

        if (!assignmentResponse.ok) {
          setError(
            assignmentData.message ||
              "Assignment could not be loaded."
          );
          return;
        }

        if (!submissionsResponse.ok) {
          setError(
            submissionsData.message ||
              "Submissions could not be loaded."
          );
          return;
        }

        setAssignment(assignmentData.assignment);
        setClassDetails(assignmentData.class || null);
        setRecords(submissionsData.records || []);

        setSummary(
          submissionsData.summary || {
            totalStudents: 0,
            submitted: 0,
            notSubmitted: 0,
            graded: 0,
          }
        );

        const initialGradeValues = {};

        (submissionsData.records || []).forEach(function (record) {
          if (record.submission) {
            initialGradeValues[record.submission._id] = {
              marks: record.submission.marks ?? "",
              feedback: record.submission.feedback || "",
            };
          }
        });

        setGradeValues(initialGradeValues);
      } catch (requestError) {
        console.log(requestError);
        setError("Unable to connect to the server.");
      } finally {
        setLoading(false);
      }
    }

    loadSubmissions();
  }, [assignmentId]);

  function updateGradeValue(submissionId, field, value) {
    setGradeValues(function (currentValues) {
      return {
        ...currentValues,
        [submissionId]: {
          ...currentValues[submissionId],
          [field]: value,
        },
      };
    });
  }

  async function saveGrade(submissionId) {
    const values = gradeValues[submissionId] || {};
    const marks = Number(values.marks);

    if (
      values.marks === "" ||
      !Number.isFinite(marks) ||
      marks < 0 ||
      marks > assignment.totalMarks
    ) {
      setError(
        `Marks must be between 0 and ${assignment.totalMarks}.`
      );
      return;
    }

    const existingRecord = records.find(function (record) {
      return record.submission?._id === submissionId;
    });

    const wasAlreadyGraded =
      existingRecord?.submission?.status === "graded";

    try {
      setSavingSubmission(submissionId);
      setError("");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/assignments/submissions/${submissionId}/grade`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            marks: marks,
            feedback: String(values.feedback || "").trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message || "Submission could not be graded."
        );
        return;
      }

      setRecords(function (currentRecords) {
        return currentRecords.map(function (record) {
          if (record.submission?._id === submissionId) {
            return {
              ...record,
              submission: data.submission,
            };
          }

          return record;
        });
      });

      if (!wasAlreadyGraded) {
        setSummary(function (currentSummary) {
          return {
            ...currentSummary,
            graded: currentSummary.graded + 1,
          };
        });
      }

      showToast("Submission graded successfully.", "success");
    } catch (requestError) {
      console.log(requestError);
      setError("Unable to connect to the server.");
    } finally {
      setSavingSubmission("");
    }
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

  function getSubmissionStatus(record) {
    if (!record.submission) {
      return "not-submitted";
    }

    if (record.submission.status === "graded") {
      return "graded";
    }

    return "submitted";
  }

  function getStatusBadge(record) {
    const status = getSubmissionStatus(record);

    if (status === "graded") {
      return {
        label: "Graded",
        style: "border-green-200 bg-green-50 text-green-700",
      };
    }

    if (status === "submitted") {
      return {
        label: "Submitted",
        style: "border-blue-200 bg-blue-50 text-blue-700",
      };
    }

    return {
      label: "Not Submitted",
      style: "border-red-200 bg-red-50 text-red-700",
    };
  }

  const filteredRecords = records.filter(function (record) {
    const student = record.student || {};

    const searchableText = [
      student.firstName,
      student.lastName,
      student.studentId,
      student.rollNumber,
      student.registrationNumber,
    ]
      .join(" ")
      .toLowerCase();

    const matchesSearch = searchableText.includes(
      search.toLowerCase().trim()
    );

    const recordStatus = getSubmissionStatus(record);

    let matchesStatus = true;

    if (statusFilter === "submitted") {
      matchesStatus = record.submission !== null;
    } else if (statusFilter === "not-submitted") {
      matchesStatus = record.submission === null;
    } else if (statusFilter === "graded") {
      matchesStatus = recordStatus === "graded";
    } else if (statusFilter === "ungraded") {
      matchesStatus = recordStatus === "submitted";
    }

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="rounded-2xl border border-green-100 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-green-100 border-t-green-600"></div>

          <p className="font-medium text-slate-600">
            Loading student submissions...
          </p>
        </div>
      </main>
    );
  }

  if (!assignment) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
          <h1 className="text-xl font-bold text-red-700">
            Submissions unavailable
          </h1>

          <p className="mt-2 text-red-600">
            {error || "Assignment could not be found."}
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

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <Link
        to={`/assignments/${assignmentId}`}
        className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-green-700 hover:text-green-800"
      >
        ← Back to Assignment
      </Link>

      <section className="rounded-3xl border border-green-200/70 bg-gradient-to-br from-green-700 via-green-600 to-emerald-500 p-8 text-white shadow-xl shadow-green-900/10">
        <p className="text-sm font-semibold uppercase tracking-widest text-green-100">
          {classDetails?.courseId || "Assignment Review"}
        </p>

        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
          Student Submissions
        </h1>

        <p className="mt-3 max-w-2xl text-green-50">
          {assignment.title}
        </p>

        <p className="mt-2 text-sm text-green-100">
          Total marks: {assignment.totalMarks}
        </p>
      </section>

      {error && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Enrolled Students
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-800">
            {summary.totalStudents}
          </p>
        </div>

        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5 shadow-sm">
          <p className="text-sm font-medium text-blue-600">
            Submitted
          </p>

          <p className="mt-2 text-3xl font-bold text-blue-800">
            {summary.submitted}
          </p>
        </div>

        <div className="rounded-2xl border border-red-100 bg-red-50 p-5 shadow-sm">
          <p className="text-sm font-medium text-red-600">
            Not Submitted
          </p>

          <p className="mt-2 text-3xl font-bold text-red-800">
            {summary.notSubmitted}
          </p>
        </div>

        <div className="rounded-2xl border border-green-100 bg-green-50 p-5 shadow-sm">
          <p className="text-sm font-medium text-green-600">
            Graded
          </p>

          <p className="mt-2 text-3xl font-bold text-green-800">
            {summary.graded}
          </p>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-4 md:grid-cols-[1fr_220px]">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Search students
            </label>

            <input
              type="search"
              value={search}
              onChange={function (event) {
                setSearch(event.target.value);
              }}
              placeholder="Search by name, student ID or roll number"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Submission Status
            </label>

            <select
              value={statusFilter}
              onChange={function (event) {
                setStatusFilter(event.target.value);
              }}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
            >
              <option value="all">All students</option>
              <option value="submitted">Submitted</option>
              <option value="not-submitted">Not submitted</option>
              <option value="graded">Graded</option>
              <option value="ungraded">Awaiting grading</option>
            </select>
          </div>
        </div>
      </section>

      {filteredRecords.length === 0 ? (
        <section className="mt-6 rounded-2xl border border-dashed border-green-200 bg-white p-12 text-center shadow-sm">
          <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-green-50 text-3xl">
            📥
          </div>

          <h2 className="text-lg font-bold text-slate-800">
            No student records found
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Student submissions will appear here.
          </p>
        </section>
      ) : (
        <section className="mt-6 space-y-5">
          {filteredRecords.map(function (record) {
            const student = record.student || {};
            const submission = record.submission;
            const badge = getStatusBadge(record);

            return (
              <article
                key={student.studentId}
                className="rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                <div className="flex flex-col gap-4 border-b border-slate-100 p-6 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-slate-800">
                      {student.firstName} {student.lastName}
                    </h2>

                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
                      <span>{student.studentId}</span>
                      <span>{student.rollNumber}</span>
                      <span>{student.registrationNumber}</span>
                    </div>
                  </div>

                  <span
                    className={`self-start rounded-full border px-3 py-1 text-xs font-bold ${badge.style}`}
                  >
                    {badge.label}
                  </span>
                </div>

                {!submission ? (
                  <div className="p-6">
                    <p className="text-sm text-slate-500">
                      This student has not submitted the assignment.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-6 p-6 lg:grid-cols-[1fr_360px]">
                    <div>
                      <h3 className="font-bold text-slate-800">
                        Submitted Work
                      </h3>

                      <div className="mt-3 rounded-xl bg-slate-50 p-5">
                        <p className="whitespace-pre-wrap leading-7 text-slate-700">
                          {submission.submissionText ||
                            "No written response provided."}
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

                      <p className="mt-4 text-xs text-slate-400">
                        Submitted on{" "}
                        {formatDate(submission.submittedAt)}
                      </p>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                      <h3 className="font-bold text-slate-800">
                        Evaluation
                      </h3>

                      {isFaculty ? (
                        <div className="mt-4 space-y-4">
                          <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                              Marks out of {assignment.totalMarks}
                            </label>

                            <input
                              type="number"
                              min="0"
                              max={assignment.totalMarks}
                              step="0.5"
                              value={
                                gradeValues[submission._id]?.marks ??
                                ""
                              }
                              onChange={function (event) {
                                updateGradeValue(
                                  submission._id,
                                  "marks",
                                  event.target.value
                                );
                              }}
                              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                            />
                          </div>

                          <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                              Feedback
                            </label>

                            <textarea
                              rows="4"
                              value={
                                gradeValues[submission._id]
                                  ?.feedback ?? ""
                              }
                              onChange={function (event) {
                                updateGradeValue(
                                  submission._id,
                                  "feedback",
                                  event.target.value
                                );
                              }}
                              placeholder="Write feedback for the student..."
                              className="w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                            ></textarea>
                          </div>

                          <button
                            type="button"
                            disabled={
                              savingSubmission === submission._id
                            }
                            onClick={function () {
                              saveGrade(submission._id);
                            }}
                            className="w-full rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {savingSubmission === submission._id
                              ? "Saving Grade..."
                              : submission.status === "graded"
                              ? "Update Grade"
                              : "Save Grade"}
                          </button>
                        </div>
                      ) : (
                        <div className="mt-4">
                          {submission.status === "graded" ? (
                            <>
                              <p className="text-3xl font-bold text-green-700">
                                {submission.marks} /{" "}
                                {assignment.totalMarks}
                              </p>

                              <p className="mt-3 text-sm leading-6 text-slate-600">
                                {submission.feedback ||
                                  "No written feedback provided."}
                              </p>
                            </>
                          ) : (
                            <p className="text-sm text-slate-500">
                              This submission has not been graded yet.
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </section>
      )}

      {isAdmin && (
        <p className="mt-6 text-center text-sm text-slate-500">
          Administrators can monitor submissions. Grades must be entered by the assigned faculty member.
        </p>
      )}
    </main>
  );
}

export default AssignmentSubmissions;