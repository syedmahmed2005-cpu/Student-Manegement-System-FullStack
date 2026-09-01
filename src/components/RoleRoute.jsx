import { Navigate, Outlet, useLocation } from "react-router-dom";

function RoleRoute({ user }) {
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const adminOnlyPaths = [
    "/students/add",
    "/faculty/add",
    "/courses/add",
    "/classes/add",
    "/enrollments/add",
  ];

  const studentRestrictedPaths = [
    "/students",
    "/faculty",
    "/courses",
    "/classes",
    "/enrollments",
  ];

  const studentAttendancePath = "/students/attendance";
  const facultyAttendancePath = "/faculty/attendance";

  const isAdminOnly = adminOnlyPaths.some(function (path) {
    return (
      location.pathname === path ||
      location.pathname.endsWith("/edit")
    );
  });

  const isStudentRestricted = studentRestrictedPaths.some(function (path) {
    return (
      (location.pathname === path ||
        location.pathname.startsWith(path + "/")) &&
      location.pathname !== studentAttendancePath
    );
  });

  if (isAdminOnly && user.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  if (isStudentRestricted && user.role === "student") {
    return <Navigate to="/dashboard" replace />;
  }

  if (
    location.pathname === studentAttendancePath &&
    user.role !== "admin" &&
    user.role !== "student"
  ) {
    return <Navigate to="/dashboard" replace />;
  }

  if (
    location.pathname.startsWith(facultyAttendancePath) &&
    user.role !== "admin" &&
    user.role !== "faculty"
  ) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

export default RoleRoute;