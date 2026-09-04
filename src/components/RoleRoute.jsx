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

  const isAssignmentCreatePath =
    location.pathname === "/assignments/add";

  const isAssignmentEditPath =
    location.pathname.startsWith("/assignments/") &&
    location.pathname.endsWith("/edit");

  const isAssignmentSubmissionsPath =
    location.pathname.startsWith("/assignments/") &&
    location.pathname.endsWith("/submissions");

  const isAdminOnly = adminOnlyPaths.some(function (path) {
    return location.pathname === path;
  }) || (
    location.pathname.endsWith("/edit") &&
    !isAssignmentEditPath
  );

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
    (isAssignmentCreatePath || isAssignmentEditPath) &&
    user.role !== "faculty"
  ) {
    return <Navigate to="/assignments" replace />;
  }

  if (
    isAssignmentSubmissionsPath &&
    user.role !== "admin" &&
    user.role !== "faculty"
  ) {
    return <Navigate to="/assignments" replace />;
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