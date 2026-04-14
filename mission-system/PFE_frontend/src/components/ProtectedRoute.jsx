import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles }) {
  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch (e) {
    user = null;
  }

  if (!user) return <Navigate to="/" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" />;

  return children;
}

export default ProtectedRoute;