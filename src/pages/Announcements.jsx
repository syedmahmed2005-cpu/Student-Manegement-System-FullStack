import { useEffect, useState } from "react";

function Announcements({ user, showToast }) {
  const [announcements, setAnnouncements] = useState([]);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [targetAudience, setTargetAudience] = useState("all");
  const [loading, setLoading] = useState(true);

  async function fetchAnnouncements() {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/announcements`,
        {
          credentials: "include"
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load announcements");
      }

      setAnnouncements(data.announcements);
    } catch (error) {
      console.log(error);
      showToast("Unable to load announcements.", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(function () {
    fetchAnnouncements();
  }, []);

  async function createAnnouncement(event) {
    event.preventDefault();

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/announcements`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include",
          body: JSON.stringify({
            title,
            message,
            targetAudience
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        showToast(
          data.message || "Failed to create announcement.",
          "error"
        );
        return;
      }

      setAnnouncements([data.announcement, ...announcements]);
      setTitle("");
      setMessage("");
      setTargetAudience("all");

      showToast(
        "Announcement published successfully.",
        "success"
      );
    } catch (error) {
      console.log(error);
      showToast("Unable to connect to the server.", "error");
    }
  }

  async function deleteAnnouncement(id) {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/announcements/${id}`,
        {
          method: "DELETE",
          credentials: "include"
        }
      );

      const data = await response.json();

      if (!response.ok) {
        showToast(
          data.message || "Failed to delete announcement.",
          "error"
        );
        return;
      }

      setAnnouncements(
        announcements.filter(function (announcement) {
          return announcement._id !== id;
        })
      );

      showToast(
        "Announcement deleted successfully.",
        "success"
      );
    } catch (error) {
      console.log(error);
      showToast("Unable to connect to the server.", "error");
    }
  }

  if (loading) {
    return (
      <div className="min-h-[70vh] bg-slate-50 px-4 py-8">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-2xl border border-green-100 bg-white p-8 text-center shadow-sm">
            <p className="font-medium text-slate-600">
              Loading announcements...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-6xl">

        <div className="mb-8">
          <p className="mb-1 text-sm font-semibold uppercase tracking-wide text-green-600">
            Communication
          </p>

          <h1 className="text-3xl font-bold text-slate-800">
            Announcements
          </h1>

          <p className="mt-2 text-slate-500">
            Stay updated with the latest announcements and important notices.
          </p>
        </div>

        {user && user.role === "admin" && (
          <div className="mb-8 rounded-2xl border border-green-100 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-6 py-5">
              <h2 className="text-lg font-bold text-slate-800">
                Create Announcement
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Publish an important notice for students or faculty.
              </p>
            </div>

            <form onSubmit={createAnnouncement} className="p-6">

              <div className="grid gap-5 md:grid-cols-2">

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Announcement Title
                  </label>

                  <input
                    type="text"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                    placeholder="Enter announcement title"
                    value={title}
                    onChange={function (event) {
                      setTitle(event.target.value);
                    }}
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Message
                  </label>

                  <textarea
                    className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                    rows="4"
                    placeholder="Write your announcement..."
                    value={message}
                    onChange={function (event) {
                      setMessage(event.target.value);
                    }}
                    required
                  ></textarea>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Audience
                  </label>

                  <select
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                    value={targetAudience}
                    onChange={function (event) {
                      setTargetAudience(event.target.value);
                    }}
                  >
                    <option value="all">Everyone</option>
                    <option value="students">Students</option>
                    <option value="faculty">Faculty</option>
                  </select>
                </div>

              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  className="rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700 hover:shadow-md"
                >
                  Publish Announcement
                </button>
              </div>

            </form>
          </div>
        )}

        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800">
            Latest Announcements
          </h2>

          <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
            {announcements.length}{" "}
            {announcements.length === 1
              ? "Announcement"
              : "Announcements"}
          </span>
        </div>

        {announcements.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-green-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-green-50 text-2xl">
              📢
            </div>

            <h3 className="font-semibold text-slate-800">
              No announcements yet
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Important announcements will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {announcements.map(function (announcement) {
              return (
                <div
                  className="rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  key={announcement._id}
                >
                  <div className="p-6">

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                      <div className="flex gap-4">

                        <div className="hidden h-11 w-11 shrink-0 place-items-center rounded-xl bg-green-50 text-xl sm:grid">
                          📢
                        </div>

                        <div>
                          <h3 className="text-lg font-bold text-slate-800">
                            {announcement.title}
                          </h3>

                          <p className="mt-1 text-xs font-medium text-green-600">
                            {announcement.targetAudience === "all"
                              ? "Everyone"
                              : announcement.targetAudience === "students"
                              ? "Students"
                              : "Faculty"}
                          </p>
                        </div>

                      </div>

                      {user && user.role === "admin" && (
                        <button
                          type="button"
                          className="self-start rounded-lg border border-red-100 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                          onClick={function () {
                            deleteAnnouncement(announcement._id);
                          }}
                        >
                          Delete
                        </button>
                      )}

                    </div>

                    <p className="mt-5 whitespace-pre-wrap leading-7 text-slate-600">
                      {announcement.message}
                    </p>

                    <div className="mt-5 border-t border-slate-100 pt-4">
                      <p className="text-xs text-slate-400">
                        Posted on{" "}
                        {new Date(
                          announcement.createdAt
                        ).toLocaleDateString()}
                      </p>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}

export default Announcements;