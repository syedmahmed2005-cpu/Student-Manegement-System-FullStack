import {
  NavLink,
  useNavigate
} from "react-router-dom";

function Navbar({ title, user, setUser }) {
  const navigate = useNavigate();

  const menuItems = {
    admin: [
      ["Dashboard", "/dashboard"],
      ["Students", "/students"],
      ["Faculty", "/faculty"],
      ["Courses", "/courses"],
      ["Classes", "/classes"],
      ["Enrollments", "/enrollments"],
      ["Attendance", "/attendance"],
      ["Grades", "/grades"],
      ["Assignments", "/assignments"],
      ["Announcements", "/announcements"],
      ["Settings", "/settings"]
    ],
    faculty: [
      ["Dashboard", "/dashboard"],
      ["Students", "/students"],
      ["Courses", "/courses"],
      ["Classes", "/classes"],
      ["Attendance", "/attendance"],
      ["My Attendance", "/faculty/attendance"],
      ["Grades", "/grades"],
      ["Assignments", "/assignments"],
      ["Announcements", "/announcements"],
      ["Settings", "/settings"]
    ],
    student: [
      ["Dashboard", "/dashboard"],
      ["My Attendance", "/students/attendance"],
      ["Grades", "/grades"],
      ["Assignments", "/assignments"],
      ["Announcements", "/announcements"],
      ["Settings", "/settings"]
    ]
  };

  async function handleLogout() {
    try {
      await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/logout`,
        {
          method: "POST",
          credentials: "include"
        }
      );
    } catch (error) {
      console.log(error);
    }

    setUser(null);
    navigate("/login");
  }

  return (
    <nav className="sticky top-0 z-20 border-b border-app-border bg-app-surface/90 shadow-sm backdrop-blur-xl transition-colors duration-200">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <NavLink
          to="/dashboard"
          className="flex items-center gap-2 font-bold"
        >
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-green-600 text-lg text-white shadow-sm">
            🎓
          </span>

          <span className="mr-2 text-2xl font-bold text-green-800 dark:text-green-400">
            {title}
          </span>
        </NavLink>

        <div className="order-2 flex items-center gap-3 md:order-3">
          <div className="hidden text-right text-sm sm:block">
            <p className="font-semibold text-app-text">
              {user.name}
            </p>

            <p className="capitalize text-app-text-muted">
              {user.role}
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg border border-green-200 px-3 py-2 text-sm font-semibold text-green-800 transition hover:bg-green-50 dark:border-green-800 dark:text-green-300 dark:hover:bg-green-950/50"
          >
            Logout
          </button>
        </div>

        <div className="order-3 flex w-full gap-1 overflow-x-auto text-sm font-medium md:order-2 md:w-auto">
          {(menuItems[user.role] || []).map(function (item) {
            return (
              <NavLink
                key={item[1]}
                to={item[1]}
                className={({ isActive }) =>
                  "whitespace-nowrap rounded-lg px-3 py-2 transition " +
                  (isActive
                    ? "bg-green-600 text-white shadow-sm"
                    : "text-app-text-muted hover:bg-green-50 hover:text-green-800 dark:hover:bg-green-950/50 dark:hover:text-green-300")
                }
              >
                {item[0]}
              </NavLink>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;