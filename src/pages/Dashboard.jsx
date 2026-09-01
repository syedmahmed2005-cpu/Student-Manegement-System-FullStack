import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Dashboard({ user }) {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(function () {
    async function loadDashboard() {
      try {
        const requests = [
  fetch(`${import.meta.env.VITE_API_URL}/api/courses`, {
    credentials: "include",
  }),
  fetch(`${import.meta.env.VITE_API_URL}/api/classes`, {
    credentials: "include",
  }),
];

if (user.role !== "student") {
  requests.push(
    fetch(`${import.meta.env.VITE_API_URL}/api/attendance`, {
      credentials: "include",
    })
  );

  requests.push(
    fetch(`${import.meta.env.VITE_API_URL}/api/enrollments`, {
      credentials: "include",
    })
  );

  requests.unshift(
    fetch(`${import.meta.env.VITE_API_URL}/api/students`, {
      credentials: "include",
    }),
    fetch(`${import.meta.env.VITE_API_URL}/api/faculty`, {
      credentials: "include",
    })
  );
}

        const responses = await Promise.all(requests);
        const data = await Promise.all(responses.map(function (response) { return response.json(); }));

        if (responses.some(function (response) { return !response.ok; })) {
          setError("Dashboard data could not be loaded.");
          return;
        }

        const attendanceData = data.find(function (item) { return item.attendance; })?.attendance || [];
        const presentCount = attendanceData.filter(function (record) { return record.status === "present"; }).length;
        setStats({
          students: data.find(function (item) { return item.students; })?.students.length || 0,
          faculty: data.find(function (item) { return item.faculty; })?.faculty.length || 0,
          courses: data.find(function (item) { return item.courses; })?.courses.length || 0,
          classes: data.find(function (item) { return item.classes; })?.classes.length || 0,
          enrollments: data.find(function (item) { return item.enrollments; })?.enrollments.length || 0,
          attendance: attendanceData.length ? Math.round((presentCount / attendanceData.length) * 100) : 0,
        });
      } catch (requestError) {
        console.log(requestError);
        setError("Unable to connect to the server.");
      }
    }

    loadDashboard();
  }, [user.role]);

  const cards = [
    ["👨‍🎓", "Students", stats?.students, "Registered learners", "/students"],
    ["👩‍🏫", "Faculty", stats?.faculty, "Teaching staff", "/faculty"],
    ["📚", "Courses", stats?.courses, "Course catalog", "/courses"],
    ["🏫", "Classes", stats?.classes, "Active class groups", "/classes"],
    ["↗", "Enrollments", stats?.enrollments, "Active registrations", "/enrollments"],
    ["✓", "Attendance", stats ? stats.attendance + "%" : "—", "Overall present rate", "/attendance"],
  ].filter(function (card) { return user.role !== "student" || ["Courses", "Classes"].includes(card[1]); });

  return <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
    <section className="rounded-3xl border border-green-200/70 bg-gradient-to-br from-green-700 via-green-600 to-emerald-500 p-8 text-left text-white shadow-xl shadow-green-900/10">
      <p className="text-sm font-semibold uppercase tracking-widest text-green-100">{user.role} portal</p>
      <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Welcome back, {user.name}</h1>
      <p className="mt-3 max-w-2xl text-green-50">Here is a live overview of your academic workspace.</p>
      {user.role === "admin" && <Link to="/students/add" className="mt-6 inline-flex rounded-xl bg-white px-5 py-3 font-semibold text-green-800 shadow-sm hover:bg-green-50">Add Student</Link>}
    </section>
    {error && <p className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">{error}</p>}
    <section className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-5">
      {cards.map(function (card) { return <Link key={card[1]} to={card[4]} className="rounded-2xl border border-white/70 bg-white/80 p-5 text-left shadow-sm backdrop-blur transition hover:-translate-y-1 hover:shadow-lg"><span className="text-3xl">{card[0]}</span><p className="mt-4 font-semibold text-slate-700">{card[1]}</p><p className="mt-1 text-3xl font-bold text-slate-900">{stats ? card[2] : "…"}</p><p className="mt-2 text-sm text-slate-600">{card[3]}</p></Link>; })}
    </section>
    <section className="mt-8 grid gap-6 lg:grid-cols-3">
      <div className="rounded-2xl border border-slate-200 bg-white/85 p-6 shadow-sm backdrop-blur lg:col-span-2">
        <div className="flex items-center justify-between"><h2 className="text-xl font-bold text-green-900">Recent Activity</h2><span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">Live data</span></div>
        <div className="mt-5 space-y-4">
          {[
            ["👨‍🎓", stats?.students || 0, "students registered"],
            ["📚", stats?.courses || 0, "courses available"],
            ["🏫", stats?.classes || 0, "active classes"],
            ["✓", stats?.attendance ? stats.attendance + "%" : "—", "overall attendance"],
          ].map(function (activity) { return <div key={activity[2]} className="flex items-center gap-4 rounded-xl border border-slate-100 px-4 py-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-green-50 text-lg">{activity[0]}</span><p className="text-slate-700"><strong className="text-slate-900">{activity[1]}</strong> {activity[2]}</p></div>; })}
        </div>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white/85 p-6 shadow-sm backdrop-blur">
        <h2 className="text-xl font-bold text-green-800">Quick Actions</h2>
        <div className="mt-5 grid gap-3">
          {(user.role === "admin" ? [["Add Student", "/students/add"], ["Add Faculty", "/faculty/add"], ["Add Course", "/courses/add"], ["Mark Attendance", "/attendance"]] : user.role === "faculty" ? [["My Attendance", "/faculty/attendance"], ["View Classes", "/classes"], ["Mark Attendance", "/attendance"]] : [["My Attendance", "/students/attendance"], ["View Courses", "/courses"]]).map(function (action) { return <Link key={action[0]} to={action[1]} className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 font-semibold text-green-800 transition hover:bg-green-600 hover:text-white">{action[0]} →</Link>; })}
        </div>
      </div>
    </section>
  </main>;
}

export default Dashboard;
