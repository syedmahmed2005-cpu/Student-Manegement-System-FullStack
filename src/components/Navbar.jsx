import { NavLink, useNavigate } from "react-router-dom";

function Navbar({ title, user, setUser }) {
  const navigate = useNavigate();
  const menuItems = {
    admin: [["Dashboard", "/dashboard"], ["Students", "/students"], ["Faculty", "/faculty"], ["Courses", "/courses"], ["Classes", "/classes"], ["Enrollments", "/enrollments"], ["Attendance", "/attendance"],["Grades", "/grades"], ["Announcements", "/announcements"],["Settings", "/settings"]],
    faculty: [["Dashboard", "/dashboard"], ["Students", "/students"], ["Courses", "/courses"], ["Classes", "/classes"], ["Attendance", "/attendance"], ["My Attendance", "/faculty/attendance"],["Grades", "/grades"], ["Announcements", "/announcements"],["Settings", "/settings"]],
    student: [["Dashboard", "/dashboard"], ["My Attendance", "/students/attendance"],["Grades", "/grades"], ["Announcements", "/announcements"],["Settings", "/settings"]],
  };

  async function handleLogout() {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/auth/logout`, { method: "POST", credentials: "include" });
    } catch (error) {
      console.log(error);
    }

    setUser(null);
    navigate("/login");
  }

  return (
    <nav className="sticky top-0 z-20 border-b border-green-100/80 bg-white/85 backdrop-blur-xl shadow-sm">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <NavLink to="/dashboard" className="flex items-center gap-2 font-bold text-green-800">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-green-600 text-lg text-white shadow-sm">🎓</span>
          <span>{title}</span>
        </NavLink>
        <div className="order-3 flex w-full gap-1 overflow-x-auto text-sm font-medium md:order-2 md:w-auto">
          {menuItems[user.role].map(function (item) {
            return <NavLink key={item[1]} to={item[1]} className={({ isActive }) => "whitespace-nowrap rounded-lg px-3 py-2 transition " + (isActive ? "bg-green-600 text-white shadow-sm" : "text-slate-700 hover:bg-green-50 hover:text-green-800")}>{item[0]}</NavLink>;
          })}
        </div>
        <div className="order-2 flex items-center gap-3 md:order-3">
          <div className="hidden text-right text-sm sm:block"><p className="font-semibold text-slate-800">{user.name}</p><p className="capitalize text-slate-600">{user.role}</p></div>
          <button type="button" onClick={handleLogout} className="rounded-lg border border-green-200 px-3 py-2 text-sm font-semibold text-green-800 hover:bg-green-50">Logout</button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
