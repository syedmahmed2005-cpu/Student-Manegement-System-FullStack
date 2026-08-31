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
  const facultyPaths = ["/students", "/faculty", "/enrollments"];
  const studentAttendancePath = "/students/attendance";
  const facultyAttendancePath = "/faculty/attendance";

  const isAdminOnly = adminOnlyPaths.some(function (path) {
    return location.pathname === path || location.pathname.endsWith("/edit");
  });
  const isFacultyPath = facultyPaths.some(function (path) {
    return location.pathname === path || location.pathname.startsWith(path + "/");
  });

  if (
    (isAdminOnly && user.role !== "admin") ||
    (isFacultyPath &&
      location.pathname !== studentAttendancePath &&
      user.role === "student") ||
    (location.pathname === studentAttendancePath &&
      user.role !== "admin" &&
      user.role !== "student") ||
    (location.pathname.startsWith(facultyAttendancePath) &&
      user.role !== "admin" &&
      user.role !== "faculty")
  ) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

export default RoleRoute;
