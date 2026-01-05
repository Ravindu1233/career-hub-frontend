import { Navigate } from "react-router-dom";

export function ProtectedRoute({
  children,
  allow,
}: {
  children: React.ReactNode;
  allow: "USER" | "COMPANY";
}) {
  const token = localStorage.getItem("token");
  const authType = localStorage.getItem("authType");

  if (!token) return <Navigate to="/login" replace />;
  if (authType !== allow) return <Navigate to="/login" replace />;

  return <>{children}</>;
}
