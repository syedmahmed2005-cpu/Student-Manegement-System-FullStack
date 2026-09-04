import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Assignments({ user, showToast }) {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [error, setError] = useState("");

  const isAdmin = user.role === "admin";
  const isFaculty = user.role === "faculty";
  const isStudent = user.role === "student";

  useEffect(function () {
    async function fetchAssignments() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/assignments`,
          {
            credentials: "include",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Assignments could not be loaded.");
          return;
        }

        setAssignments(data.assignments || []);
      } catch (requestError) {
        console.log(requestError);
        setError("Unable to connect to the server.");
      } finally {
        setLoading(false);
      }
    }

    fetchAssignments();
  }, []);

  async function deleteAssignment(assignmentId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this assignment? Its submissions will also be deleted."
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(assignmentId);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/assignments/${assignmentId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        showToast(
          data.message || "Assignment could not be deleted.",
          "error"
        );
        return;
      }

      setAssignments(function (currentAssignments) {
        return currentAssignments.filter(function (assignment) {
          return assignment._id !== assignmentId;
        });
      });

      showToast("Assignment deleted successfully.", "success");
    } catch (requestError) {
      console.log(requestError);
      showToast("Unable to connect to the server.", "error");
    } finally {
      setDeletingId("");
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

  function getDeadlineDetails(assignment) {
    if (assignment.status === "closed") {
      return {
        label: "Closed",
        style: "text-red-600",
      };
    }

    const deadline = new Date(assignment.dueDate);
    const difference = deadline.getTime() - Date.now();
    const days = Math.ceil(difference / (1000 * 60 * 60 * 24));

    if (difference < 0) {
      return {
        label: "Deadline passed",
        style: "text-red-600",
      };
    }

    if (days === 0) {
      return {
        label: "Due today",
        style: "text-amber-600",
      };
    }

    if (days === 1) {
      return {
        label: "1 day remaining",
        style: "text-amber-600",
      };
    }

    return {
      label: `${days} days remaining`,
      style: days <= 3 ? "text-amber-600" : "text-green-700",
    };
  }

  const filteredAssignments = assignments.filter(function (assignment) {
    const classDetails = assignment.classDetails || {};

    const searchableText = [
      assignment.title,
      assignment.description,
      classDetails.courseId,
      classDetails.batchId,
      classDetails.semester,
      assignment.createdBy?.name,
    ]
      .join(" ")
      .toLowerCase();

    const matchesSearch = searchableText.includes(
      search.toLowerCase().trim()
    );

    const matchesStatus =
      statusFilter === "all" ||
      assignment.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="rounded-2xl border border-green-100 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-green-100 border-t-green-600"></div>

          <p className="font-medium text-slate-600">
            Loading assignments...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <section className="rounded-3xl border border-green-200/70 bg-gradient-to-br from-green-700 via-green-600 to-emerald-500 p-8 text-white shadow-xl shadow-green-900/10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-green-100">
              Coursework
            </p>

            <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
              Assignments
            </h1>

            <p className="mt-3 max-w-2xl text-green-50">
              {isFaculty
                ? "Create coursework, manage deadlines, and review student submissions."
                : isStudent
                ? "View and submit coursework for your enrolled classes."
                : "Monitor assignments and coursework across all classes."}
            </p>
          </div>

          {isFaculty && (
            <Link
              to="/assignments/add"
              className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-bold text-green-700 shadow-md transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              + Create Assignment
            </Link>
          )}
        </div>
      </section>

      {error && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      <section className="mt-8 rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm">
        <div className="grid gap-4 md:grid-cols-[1fr_220px]">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Search assignments
            </label>

            <input
              type="search"
              value={search}
              onChange={function (event) {
                setSearch(event.target.value);
              }}
              placeholder="Search by title, course, batch or semester"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Status
            </label>

            <select
              value={statusFilter}
              onChange={function (event) {
                setStatusFilter(event.target.value);
              }}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
            >
              <option value="all">All statuses</option>
              <option value="published">Published</option>

              {!isStudent && (
                <option value="draft">Draft</option>
              )}

              <option value="closed">Closed</option>
            </select>
          </div>
        </div>
      </section>

      <div className="mt-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800">
          {isStudent ? "Your Assignments" : "Assignment Records"}
        </h2>

        <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
          {filteredAssignments.length}{" "}
          {filteredAssignments.length === 1
            ? "Assignment"
            : "Assignments"}
        </span>
      </div>

      {filteredAssignments.length === 0 ? (
        <section className="mt-5 rounded-2xl border border-dashed border-green-200 bg-white p-12 text-center shadow-sm">
          <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-green-50 text-3xl">
            📝
          </div>

          <h3 className="text-lg font-bold text-slate-800">
            No assignments found
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
            {isFaculty
              ? "Create an assignment for one of your classes to get started."
              : isStudent
              ? "Assignments for your enrolled classes will appear here."
              : "No assignments have been created yet."}
          </p>
        </section>
      ) : (
        <section className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredAssignments.map(function (assignment) {
            const classDetails = assignment.classDetails || {};
            const deadline = getDeadlineDetails(assignment);

            return (
              <article
                key={assignment._id}
                className="flex flex-col rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-green-200 hover:shadow-lg"
              >
                <div className="flex-1 p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-green-50 text-xl">
                      📚
                    </div>

                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-bold capitalize ${getStatusStyle(
                        assignment.status
                      )}`}
                    >
                      {assignment.status}
                    </span>
                  </div>

                  <div className="mt-5">
                    <p className="text-xs font-bold uppercase tracking-wide text-green-600">
                      {classDetails.courseId || "Course"}
                    </p>

                    <h3 className="mt-1 text-xl font-bold text-slate-800">
                      {assignment.title}
                    </h3>

                    <p className="mt-3 line-clamp-3 leading-6 text-slate-600">
                      {assignment.description}
                    </p>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-xs font-medium text-slate-500">
                        Batch
                      </p>

                      <p className="mt-1 font-semibold text-slate-800">
                        {classDetails.batchId || "N/A"}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-xs font-medium text-slate-500">
                        Semester
                      </p>

                      <p className="mt-1 font-semibold text-slate-800">
                        {classDetails.semester || "N/A"}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-xs font-medium text-slate-500">
                        Total Marks
                      </p>

                      <p className="mt-1 font-semibold text-slate-800">
                        {assignment.totalMarks}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-xs font-medium text-slate-500">
                        Due Date
                      </p>

                      <p className="mt-1 text-sm font-semibold text-slate-800">
                        {new Date(
                          assignment.dueDate
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 border-t border-slate-100 pt-4">
                    <p className={`text-sm font-semibold ${deadline.style}`}>
                      {deadline.label}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Created by{" "}
                      {assignment.createdBy?.name || "Faculty"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 border-t border-slate-100 p-4">
                  <Link
                    to={`/assignments/${assignment._id}`}
                    className="flex-1 rounded-xl bg-green-600 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-green-700"
                  >
                    {isStudent ? "View & Submit" : "View Details"}
                  </Link>

                  {isFaculty && (
                    <Link
                      to={`/assignments/${assignment._id}/edit`}
                      className="rounded-xl border border-green-200 px-4 py-2.5 text-sm font-semibold text-green-700 transition hover:bg-green-50"
                    >
                      Edit
                    </Link>
                  )}

                  {(isAdmin || isFaculty) && (
                    <button
                      type="button"
                      disabled={deletingId === assignment._id}
                      onClick={function () {
                        deleteAssignment(assignment._id);
                      }}
                      className="rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {deletingId === assignment._id
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
}

export default Assignments;