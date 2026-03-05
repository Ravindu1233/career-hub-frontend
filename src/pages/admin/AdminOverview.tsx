import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  Building2,
  Briefcase,
  GraduationCap,
  TrendingUp,
  AlertTriangle,
  FileText,
  Loader2,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

type ItemStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "SUSPENDED"
  | "ACTIVE";
type Company = { status?: ItemStatus };
type Job = { status?: ItemStatus };
type Institution = { status?: ItemStatus };
type User = { status?: ItemStatus };
type Application = Record<string, unknown>;

type StatsState = {
  totalUsers: number;
  totalCompanies: number;
  totalJobs: number;
  totalInstitutions: number;
  totalApplications: number;
  pendingApprovals: number;
  pendingCompanies: number;
  pendingJobs: number;
  pendingInstitutions: number;
  pendingUsers: number;
};

const defaultStats: StatsState = {
  totalUsers: 0,
  totalCompanies: 0,
  totalJobs: 0,
  totalInstitutions: 0,
  totalApplications: 0,
  pendingApprovals: 0,
  pendingCompanies: 0,
  pendingJobs: 0,
  pendingInstitutions: 0,
  pendingUsers: 0,
};

// Radial arc SVG for each card
function RadialProgress({
  value,
  max,
  color,
}: {
  value: number;
  max: number;
  color: string;
}) {
  const pct = max === 0 ? 0 : Math.min(value / max, 1);
  const r = 28;
  const circ = 2 * Math.PI * r;
  const dash = pct * circ;
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" className="shrink-0">
      {/* Track */}
      <circle
        cx="36"
        cy="36"
        r={r}
        fill="none"
        stroke="currentColor"
        strokeWidth="6"
        className="text-white/20"
      />
      {/* Progress */}
      <circle
        cx="36"
        cy="36"
        r={r}
        fill="none"
        stroke="white"
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={`${dash} ${circ}`}
        strokeDashoffset={circ / 4}
        style={{ transition: "stroke-dasharray 0.6s ease" }}
      />
      <text
        x="36"
        y="40"
        textAnchor="middle"
        className="text-base font-bold"
        fill="white"
        fontSize="18"
        fontWeight="700"
      >
        {value}
      </text>
    </svg>
  );
}

export default function AdminOverview() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<StatsState>(defaultStats);

  const fetchStats = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const [u, c, j, i, a] = await Promise.all([
        api.get("/admin/users"),
        api.get("/admin/companies"),
        api.get("/admin/jobs"),
        api.get("/admin/institutions"),
        api.get("/admin/applications"),
      ]);

      const users = (u.data ?? []) as User[];
      const companies = (c.data ?? []) as Company[];
      const jobs = (j.data ?? []) as Job[];
      const institutions = (i.data ?? []) as Institution[];
      const applications = (a.data ?? []) as Application[];

      const activeUsers = users.filter((x) => x.status === "ACTIVE").length;
      const approvedCompanies = companies.filter(
        (x) => x.status === "APPROVED",
      ).length;
      const approvedJobs = jobs.filter((x) => x.status === "APPROVED").length;
      const approvedInstitutions = institutions.filter(
        (x) => x.status === "APPROVED",
      ).length;

      const pendingUsers = users.filter((x) => x.status === "PENDING").length;
      const pendingCompanies = companies.filter(
        (x) => x.status === "PENDING",
      ).length;
      const pendingJobs = jobs.filter((x) => x.status === "PENDING").length;
      const pendingInstitutions = institutions.filter(
        (x) => x.status === "PENDING",
      ).length;

      setStats({
        totalUsers: activeUsers,
        totalCompanies: approvedCompanies,
        totalJobs: approvedJobs,
        totalInstitutions: approvedInstitutions,
        totalApplications: applications.length,
        pendingApprovals:
          pendingUsers + pendingCompanies + pendingJobs + pendingInstitutions,
        pendingUsers,
        pendingCompanies,
        pendingJobs,
        pendingInstitutions,
      });
    } catch {
      toast({ title: "Failed to load stats", variant: "destructive" });
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(() => fetchStats(true), 15_000);
    const handleFocus = () => fetchStats(true);
    const handleVisible = () => {
      if (document.visibilityState === "visible") fetchStats(true);
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisible);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisible);
    };
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  const maxPending = Math.max(
    stats.pendingCompanies,
    stats.pendingJobs,
    stats.pendingInstitutions,
    stats.pendingUsers,
    1,
  );

  const pendingCards = [
    {
      label: "Companies",
      count: stats.pendingCompanies,
      total: stats.totalCompanies,
      totalLabel: "approved",
      icon: Building2,
      route: "/admin/companies",
      gradient: "from-blue-500 to-blue-700",
      shadow: "shadow-blue-500/30",
    },
    {
      label: "Jobs",
      count: stats.pendingJobs,
      total: stats.totalJobs,
      totalLabel: "approved",
      icon: Briefcase,
      route: "/admin/jobs",
      gradient: "from-amber-400 to-orange-500",
      shadow: "shadow-amber-400/30",
    },
    {
      label: "Institutions",
      count: stats.pendingInstitutions,
      total: stats.totalInstitutions,
      totalLabel: "approved",
      icon: GraduationCap,
      route: "/admin/institutions",
      gradient: "from-emerald-500 to-teal-600",
      shadow: "shadow-emerald-500/30",
    },
    {
      label: "Users",
      count: stats.pendingUsers,
      total: stats.totalUsers,
      totalLabel: "active",
      icon: Users,
      route: "/admin/users",
      gradient: "from-violet-500 to-purple-700",
      shadow: "shadow-violet-500/30",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* ── Top stat cards ───────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { label: "Active Users", value: stats.totalUsers, icon: Users },
            {
              label: "Approved Companies",
              value: stats.totalCompanies,
              icon: Building2,
            },
            { label: "Approved Jobs", value: stats.totalJobs, icon: Briefcase },
            {
              label: "Approved Institutions",
              value: stats.totalInstitutions,
              icon: GraduationCap,
            },
            {
              label: "Applications",
              value: stats.totalApplications,
              icon: FileText,
            },
            {
              label: "Pending Approvals",
              value: stats.pendingApprovals,
              icon: AlertTriangle,
              warn: true,
            },
          ].map((s) => (
            <Card key={s.label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{s.label}</CardTitle>
                <s.icon
                  className={`h-4 w-4 ${s.warn ? "text-yellow-500" : "text-muted-foreground"}`}
                />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {s.value.toLocaleString()}
                </div>
                {!s.warn ? (
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 text-primary" /> Live data
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Review required
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ── Pending Review Section ───────────────────────────── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold">Pending Review Queue</h2>
              <p className="text-sm text-muted-foreground">
                {stats.pendingApprovals > 0
                  ? `${stats.pendingApprovals} item${stats.pendingApprovals > 1 ? "s" : ""} need your attention`
                  : "All queues are clear — nothing to review"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {pendingCards.map((card) => {
              const Icon = card.icon;
              const allClear = card.count === 0;

              return (
                <div
                  key={card.label}
                  className={`relative rounded-2xl bg-gradient-to-br ${card.gradient} ${card.shadow} shadow-lg overflow-hidden`}
                >
                  {/* Decorative circle blobs */}
                  <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-white/10" />
                  <div className="absolute -bottom-4 -left-4 h-16 w-16 rounded-full bg-white/10" />

                  <div className="relative p-5 flex flex-col gap-4">
                    {/* Top row: icon + label */}
                    <div className="flex items-center justify-between">
                      <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center">
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      {allClear && (
                        <CheckCircle2 className="h-5 w-5 text-white/80" />
                      )}
                    </div>

                    {/* Radial progress + count */}
                    <div className="flex items-center gap-3">
                      <RadialProgress
                        value={card.count}
                        max={maxPending}
                        color="white"
                      />
                      <div>
                        <p className="text-white font-bold text-lg leading-tight">
                          {card.label}
                        </p>
                        <p className="text-white/70 text-xs">
                          {allClear ? "All clear" : `${card.count} pending`}
                        </p>
                        <p className="text-white/50 text-xs">
                          {card.total} {card.totalLabel}
                        </p>
                      </div>
                    </div>

                    {/* CTA */}
                    <Button
                      size="sm"
                      onClick={() => navigate(card.route)}
                      className="w-full bg-white/20 hover:bg-white/30 text-white border-0 gap-1 text-xs font-medium backdrop-blur-sm"
                    >
                      {allClear ? "View All" : "Review Now"}
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
