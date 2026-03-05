import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import {
  BarChart3, Users, Building2, Briefcase, GraduationCap, Settings,
} from "lucide-react";

const navItems = [
  { label: "Overview", icon: BarChart3, path: "/admin/dashboard" },
  { label: "Users", icon: Users, path: "/admin/users", countKey: "users" },
  { label: "Companies", icon: Building2, path: "/admin/companies", countKey: "companies" },
  { label: "Jobs", icon: Briefcase, path: "/admin/jobs", countKey: "jobs" },
  { label: "Institutions", icon: GraduationCap, path: "/admin/institutions", countKey: "institutions" },
  { label: "Settings", icon: Settings, path: "/admin/settings" },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const isOverviewPage = pathname === "/admin/dashboard";
  const [counts, setCounts] = useState({
    users: 0,
    companies: 0,
    jobs: 0,
    institutions: 0,
  });

  useEffect(() => {
    const POLL_MS = 15_000;

    const loadSidebarCounts = async () => {
      try {
        const [u, c, j, i] = await Promise.all([
          api.get("/admin/users"),
          api.get("/admin/companies"),
          api.get("/admin/jobs"),
          api.get("/admin/institutions"),
        ]);

        const users = (u.data ?? []) as Array<{ status?: string }>;
        const companies = (c.data ?? []) as Array<{ status?: string }>;
        const jobs = (j.data ?? []) as Array<{ status?: string }>;
        const institutions = (i.data ?? []) as Array<{ status?: string }>;

        setCounts({
          users: users.filter((x) => x.status === "ACTIVE").length,
          companies: companies.filter((x) => x.status === "APPROVED").length,
          jobs: jobs.filter((x) => x.status === "APPROVED").length,
          institutions: institutions.filter((x) => x.status === "APPROVED")
            .length,
        });
      } catch {
        // Keep sidebar usable even if counts fail to load.
      }
    };

    loadSidebarCounts();
    const interval = setInterval(loadSidebarCounts, POLL_MS);
    const handleFocus = () => loadSidebarCounts();
    const handleVisible = () => {
      if (document.visibilityState === "visible") loadSidebarCounts();
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisible);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisible);
    };
  }, []);

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage users, companies, jobs, and institutions</p>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar Navigation */}
          <nav className="md:w-56 shrink-0">
            <div className="flex md:flex-col gap-1 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center justify-between gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors",
                    pathname === item.path || pathname.startsWith(`${item.path}/`)
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <span className="inline-flex items-center gap-2">
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </span>
                  {"countKey" in item && item.countKey && !isOverviewPage ? (
                    <span
                      className={cn(
                        "ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-semibold",
                        pathname === item.path || pathname.startsWith(`${item.path}/`)
                          ? "bg-white/20 text-primary-foreground"
                          : "bg-muted text-foreground"
                      )}
                    >
                      {counts[item.countKey as keyof typeof counts]}
                    </span>
                  ) : null}
                </Link>
              ))}
            </div>
          </nav>

          {/* Content */}
          <div className="flex-1 min-w-0 space-y-6">
            {children}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
