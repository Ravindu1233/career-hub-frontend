import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Users,
  Building2,
  Briefcase,
  GraduationCap,
  Search,
  Trash2,
  Eye,
  Ban,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  FileText,
  XCircle,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

// ─── Types ────────────────────────────────────────────────────────────────────

type Status = "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED";

interface ApiUser {
  userId: number;
  email: string;
  firstName?: string;
  lastName?: string;
  mobile?: string;
  status: Status;
  rejectionReason?: string;
}

interface ApiCompany {
  companyId: number;
  email: string;
  companyName: string;
  phone?: string;
  industry?: string;
  companySize?: string;
  status: Status;
  rejectionReason?: string;
}

interface ApiJob {
  id: string;
  jobTitle: string;
  jobType: string;
  location: string;
  jobDate: string;
  status: Status;
  rejectionReason?: string;
  company: { companyId: number; companyName: string };
  applications?: { id: string }[];
}

interface ApiInstitution {
  id: string;
  name: string;
  email: string;
  location?: string;
  status: Status;
  rejectionReason?: string;
  user: { userId: number; email: string };
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    APPROVED: "bg-green-500/10 text-green-600 border-green-500/20",
    PENDING: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
    REJECTED: "bg-red-500/10 text-red-600 border-red-500/20",
    SUSPENDED: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  };
  return (
    <Badge variant="outline" className={map[status] ?? map.PENDING}>
      {status}
    </Badge>
  );
}

// ─── Reject Dialog ────────────────────────────────────────────────────────────

function RejectDialog({
  open,
  onClose,
  onConfirm,
  loading,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  loading: boolean;
}) {
  const [reason, setReason] = useState("");
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reject — provide a reason</DialogTitle>
          <DialogDescription>
            This reason will be shown to the account holder.
          </DialogDescription>
        </DialogHeader>
        <Textarea
          placeholder="e.g. Incomplete information provided..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={3}
        />
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={!reason.trim() || loading}
            onClick={() => onConfirm(reason.trim())}
          >
            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Confirm Reject
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const AdminDashboard = () => {
  const { toast } = useToast();

  // Data
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [companies, setCompanies] = useState<ApiCompany[]>([]);
  const [jobs, setJobs] = useState<ApiJob[]>([]);
  const [institutions, setInstitutions] = useState<ApiInstitution[]>([]);
  const [loading, setLoading] = useState(true);

  // Search
  const [userSearch, setUserSearch] = useState("");
  const [companySearch, setCompanySearch] = useState("");
  const [jobSearch, setJobSearch] = useState("");
  const [institutionSearch, setInstitutionSearch] = useState("");

  // Reject dialog state
  const [rejectDialog, setRejectDialog] = useState<{
    open: boolean;
    type: "users" | "companies" | "jobs" | "institutions";
    id: string | number;
  } | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // ── Fetch all data ──────────────────────────────────────────────────────────
  const fetchAll = async () => {
    setLoading(true);
    try {
      const [u, c, j, i] = await Promise.all([
        api.get("/admin/users"),
        api.get("/admin/companies"),
        api.get("/admin/jobs"),
        api.get("/admin/institutions"),
      ]);
      setUsers(u.data);
      setCompanies(c.data);
      setJobs(j.data);
      setInstitutions(i.data);
    } catch {
      toast({ title: "Failed to load data", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // ── Stats derived from real data ────────────────────────────────────────────
  const stats = {
    totalUsers: users.length,
    totalCompanies: companies.length,
    totalJobs: jobs.length,
    totalInstitutions: institutions.length,
    pendingApprovals: [...users, ...companies, ...jobs, ...institutions].filter(
      (x: any) => x.status === "PENDING",
    ).length,
  };

  // ── Action helpers ──────────────────────────────────────────────────────────
  const approve = async (type: string, id: string | number) => {
    setActionLoading(true);
    try {
      await api.patch(`/admin/${type}/${id}/approve`);
      toast({ title: "Approved successfully" });
      fetchAll();
    } catch {
      toast({ title: "Failed to approve", variant: "destructive" });
    } finally {
      setActionLoading(false);
    }
  };

  const suspend = async (type: string, id: string | number) => {
    setActionLoading(true);
    try {
      await api.patch(`/admin/${type}/${id}/suspend`);
      toast({ title: "Suspended successfully" });
      fetchAll();
    } catch {
      toast({ title: "Failed to suspend", variant: "destructive" });
    } finally {
      setActionLoading(false);
    }
  };

  const reject = async (type: string, id: string | number, reason: string) => {
    setActionLoading(true);
    try {
      await api.patch(`/admin/${type}/${id}/reject`, {
        rejectionReason: reason,
      });
      toast({ title: "Rejected" });
      setRejectDialog(null);
      fetchAll();
    } catch {
      toast({ title: "Failed to reject", variant: "destructive" });
    } finally {
      setActionLoading(false);
    }
  };

  // ── Filter helpers ──────────────────────────────────────────────────────────
  const filteredUsers = users.filter((u) =>
    `${u.firstName} ${u.lastName} ${u.email}`
      .toLowerCase()
      .includes(userSearch.toLowerCase()),
  );
  const filteredCompanies = companies.filter((c) =>
    `${c.companyName} ${c.email}`
      .toLowerCase()
      .includes(companySearch.toLowerCase()),
  );
  const filteredJobs = jobs.filter((j) =>
    `${j.jobTitle} ${j.company.companyName}`
      .toLowerCase()
      .includes(jobSearch.toLowerCase()),
  );
  const filteredInstitutions = institutions.filter((i) =>
    `${i.name} ${i.email}`
      .toLowerCase()
      .includes(institutionSearch.toLowerCase()),
  );

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
      {/* ── Stats ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
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
              <div className="text-2xl font-bold">{s.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Users ── */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div>
              <CardTitle>Users</CardTitle>
              <CardDescription>
                Approve, reject or suspend user accounts
              </CardDescription>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((u) => (
                <TableRow key={u.userId}>
                  <TableCell className="font-medium">
                    {u.firstName || u.lastName
                      ? `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim()
                      : "—"}
                  </TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>
                    <StatusBadge status={u.status} />
                    {u.rejectionReason && (
                      <p className="text-xs text-muted-foreground mt-1 max-w-[200px] truncate">
                        {u.rejectionReason}
                      </p>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      {u.status !== "APPROVED" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Approve"
                          onClick={() => approve("users", u.userId)}
                        >
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        </Button>
                      )}
                      {u.status !== "REJECTED" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Reject"
                          onClick={() =>
                            setRejectDialog({
                              open: true,
                              type: "users",
                              id: u.userId,
                            })
                          }
                        >
                          <XCircle className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                      {u.status !== "SUSPENDED" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Suspend"
                          onClick={() => suspend("users", u.userId)}
                        >
                          <Ban className="h-4 w-4 text-orange-500" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredUsers.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center text-muted-foreground py-8"
                  >
                    No users found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* ── Companies ── */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div>
              <CardTitle>Companies</CardTitle>
              <CardDescription>
                Approve, reject or suspend companies
              </CardDescription>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search companies..."
                value={companySearch}
                onChange={(e) => setCompanySearch(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Industry</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCompanies.map((c) => (
                <TableRow key={c.companyId}>
                  <TableCell>
                    <p className="font-medium">{c.companyName}</p>
                    <p className="text-sm text-muted-foreground">{c.email}</p>
                  </TableCell>
                  <TableCell>{c.industry ?? "—"}</TableCell>
                  <TableCell>
                    <StatusBadge status={c.status} />
                    {c.rejectionReason && (
                      <p className="text-xs text-muted-foreground mt-1 max-w-[200px] truncate">
                        {c.rejectionReason}
                      </p>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      {c.status !== "APPROVED" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Approve"
                          onClick={() => approve("companies", c.companyId)}
                        >
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        </Button>
                      )}
                      {c.status !== "REJECTED" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Reject"
                          onClick={() =>
                            setRejectDialog({
                              open: true,
                              type: "companies",
                              id: c.companyId,
                            })
                          }
                        >
                          <XCircle className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                      {c.status !== "SUSPENDED" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Suspend"
                          onClick={() => suspend("companies", c.companyId)}
                        >
                          <Ban className="h-4 w-4 text-orange-500" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredCompanies.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center text-muted-foreground py-8"
                  >
                    No companies found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* ── Jobs ── */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div>
              <CardTitle>Jobs</CardTitle>
              <CardDescription>Review and approve job postings</CardDescription>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search jobs..."
                value={jobSearch}
                onChange={(e) => setJobSearch(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job Title</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Posted</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredJobs.map((j) => (
                <TableRow key={j.id}>
                  <TableCell className="font-medium">{j.jobTitle}</TableCell>
                  <TableCell>{j.company.companyName}</TableCell>
                  <TableCell>
                    {new Date(j.jobDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={j.status} />
                    {j.rejectionReason && (
                      <p className="text-xs text-muted-foreground mt-1 max-w-[200px] truncate">
                        {j.rejectionReason}
                      </p>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      {j.status !== "APPROVED" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Approve"
                          onClick={() => approve("jobs", j.id)}
                        >
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        </Button>
                      )}
                      {j.status !== "REJECTED" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Reject"
                          onClick={() =>
                            setRejectDialog({
                              open: true,
                              type: "jobs",
                              id: j.id,
                            })
                          }
                        >
                          <XCircle className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                      {j.status !== "SUSPENDED" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Suspend"
                          onClick={() => suspend("jobs", j.id)}
                        >
                          <Ban className="h-4 w-4 text-orange-500" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredJobs.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-muted-foreground py-8"
                  >
                    No jobs found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* ── Institutions ── */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div>
              <CardTitle>Institutions</CardTitle>
              <CardDescription>
                Review and approve educational institutions
              </CardDescription>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search institutions..."
                value={institutionSearch}
                onChange={(e) => setInstitutionSearch(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Institution</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInstitutions.map((i) => (
                <TableRow key={i.id}>
                  <TableCell>
                    <p className="font-medium">{i.name}</p>
                    <p className="text-sm text-muted-foreground">{i.email}</p>
                  </TableCell>
                  <TableCell>{i.location ?? "—"}</TableCell>
                  <TableCell>{i.user.email}</TableCell>
                  <TableCell>
                    <StatusBadge status={i.status} />
                    {i.rejectionReason && (
                      <p className="text-xs text-muted-foreground mt-1 max-w-[200px] truncate">
                        {i.rejectionReason}
                      </p>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      {i.status !== "APPROVED" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Approve"
                          onClick={() => approve("institutions", i.id)}
                        >
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        </Button>
                      )}
                      {i.status !== "REJECTED" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Reject"
                          onClick={() =>
                            setRejectDialog({
                              open: true,
                              type: "institutions",
                              id: i.id,
                            })
                          }
                        >
                          <XCircle className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                      {i.status !== "SUSPENDED" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Suspend"
                          onClick={() => suspend("institutions", i.id)}
                        >
                          <Ban className="h-4 w-4 text-orange-500" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredInstitutions.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-muted-foreground py-8"
                  >
                    No institutions found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* ── Reject Dialog ── */}
      {rejectDialog && (
        <RejectDialog
          open={rejectDialog.open}
          onClose={() => setRejectDialog(null)}
          loading={actionLoading}
          onConfirm={(reason) =>
            reject(rejectDialog.type, rejectDialog.id, reason)
          }
        />
      )}
    </AdminLayout>
  );
};

export default AdminDashboard;
