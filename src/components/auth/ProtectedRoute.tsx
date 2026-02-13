import React from "react";
import { Navigate } from "react-router-dom";

type AuthType = "USER" | "COMPANY" | "ADMIN";

export function ProtectedRoute({
  children,
  allow,
}: {
  children: React.ReactNode;
  allow: AuthType | AuthType[]; // ✅ allow single role or multiple
}) {
  const token = localStorage.getItem("token");
  const authType = localStorage.getItem("authType") as AuthType | null;

  if (!token) return <Navigate to="/login" replace />;

  const allowed = Array.isArray(allow) ? allow : [allow];
  if (!authType || !allowed.includes(authType)) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
