function Navbar({ title, setPage }) {
  const menuItems = [
    { label: "Dashboard", page: "dashboard" },
    { label: "Students", page: "students" },
    { label: "Courses", page: "courses" },
    { label: "Classes", page: "classes" },
    { label: "Faculty", page: "faculty" },
    { label: "Enrollments", page: "enrollments" },
    { label: "Attendance", page: "attendance" },
    { label: "Settings", page: "settings" },
  ];

  return (
    <nav>
      <h2>{title}</h2>

      {menuItems.map(function (item) {
        return (
          <button
            key={item.label}
            onClick={function () {
              setPage(item.page);
            }}
          >
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}

export default Navbar;