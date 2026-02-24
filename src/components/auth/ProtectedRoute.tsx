import React from "react";
import { Navigate } from "react-router-dom";

type AuthType = "USER" | "COMPANY" | "ADMIN";

const dashboardFor: Record<AuthType, string> = {
  USER: "/user/dashboard",
  COMPANY: "/company/dashboard",
  ADMIN: "/admin/dashboard",
};

export function ProtectedRoute({
  children,
  allow,
}: {
  children: React.ReactNode;
  allow: AuthType | AuthType[];
}) {
  const token = localStorage.getItem("token");
  const authType = localStorage.getItem("authType") as AuthType | null;

  // Not logged in → go to login
  if (!token) return <Navigate to="/login" replace />;

  const allowed = Array.isArray(allow) ? allow : [allow];

  // Wrong account type → redirect to THEIR dashboard (not login)
  if (!authType || !allowed.includes(authType)) {
    const redirect = authType ? dashboardFor[authType] : "/login";
    return <Navigate to={redirect} replace />;
  }

  return <>{children}</>;
}
