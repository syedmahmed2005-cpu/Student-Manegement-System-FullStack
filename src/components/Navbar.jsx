import {Link} from "react-router-dom";
function Navbar({ title }) {
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
    </nav>
  );
}

export default Navbar;