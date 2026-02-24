import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Users,
  Building2,
  Briefcase,
  GraduationCap,
  TrendingUp,
  AlertTriangle,
  FileText,
  Loader2,
} from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function AdminOverview() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCompanies: 0,
    totalJobs: 0,
    totalInstitutions: 0,
    totalApplications: 0,
    pendingApprovals: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const [u, c, j, i, a] = await Promise.all([
          api.get("/admin/users"),
          api.get("/admin/companies"),
          api.get("/admin/jobs"),
          api.get("/admin/institutions"),
          api.get("/admin/applications"),
        ]);

        const allItems = [...u.data, ...c.data, ...j.data, ...i.data];
        const pending = allItems.filter(
          (x: any) => x.status === "PENDING",
        ).length;

        setStats({
          totalUsers: u.data.length,
          totalCompanies: c.data.length,
          totalJobs: j.data.length,
          totalInstitutions: i.data.length,
          totalApplications: a.data.length,
          pendingApprovals: pending,
        });
      } catch {
        toast({ title: "Failed to load stats", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
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

  return (
    <AdminLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: "Total Users", value: stats.totalUsers, icon: Users },
          { label: "Companies", value: stats.totalCompanies, icon: Building2 },
          { label: "Jobs", value: stats.totalJobs, icon: Briefcase },
          {
            label: "Institutions",
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
              {!s.warn && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-primary" /> Live data
                </p>
              )}
              {s.warn && (
                <p className="text-xs text-muted-foreground">
                  Requires attention
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </AdminLayout>
  );
}
