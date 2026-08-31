import { Link, useNavigate } from "react-router-dom";

function Navbar({ title, user, setUser }) {
  const navigate = useNavigate();

  const menuItems = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Students", path: "/students" },
    { label: "Courses", path: "/courses" },
    { label: "Classes", path: "/classes" },
    { label: "Faculty", path: "/faculty" },
    { label: "Enrollments", path: "/enrollments" },
    { label: "Attendance", path: "/attendance" },
    { label: "Settings", path: "/settings" },
  ];

  const handleLogout = async function () {
    try {
      await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.log(error);
    }

    setUser(null);
    navigate("/login");
  };

  return (
    <nav>
      <h2>{title}</h2>

      {menuItems.map(function (item) {
        return (
          <Link key={item.label} to={item.path}>
            {item.label}
          </Link>
        );
      })}

      {user && (
        <button onClick={handleLogout}>
          Logout
        </button>
      )}
    </nav>
  );
}

export default Navbar;