import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { AdminLayout } from "@/components/layout/AdminLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Building,
  MapPin,
  DollarSign,
  Calendar,
  Users,
  CheckCircle,
  Ban,
  XCircle,
  Loader2,
  Briefcase,
  Clock,
  FileText,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

type Status = "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED";

interface ApiJob {
  id: string;
  jobTitle: string;
  jobType: string;
  location: string;
  salaryRange: string;
  jobDescription: string;
  responsibilities: string[];
  requiredSkills: string[];
  requirements: string;
  deadline?: string;
  jobDate: string;
  status: Status;
  rejectionReason?: string;
  reviewedAt?: string;
  company: {
    companyId: number;
    companyName: string;
  };
  applications?: { id: string; status: string }[];
}

function StatusBadge({ status }: { status: Status }) {
  const map: Record<Status, string> = {
    APPROVED: "bg-green-500/10 text-green-600 border-green-500/20",
    PENDING: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
    REJECTED: "bg-red-500/10 text-red-600 border-red-500/20",
    SUSPENDED: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  };
  return (
    <Badge variant="outline" className={map[status]}>
      {status}
    </Badge>
  );
}

// ─── State machine ─────────────────────────────────────────────────────────────
// PENDING   → Approve ✅  | Reject ✅  | Suspend ✗
// APPROVED  → Approve ✗   | Reject ✗   | Suspend ✅
// REJECTED  → Approve ✅  | Reject ✗   | Suspend ✗
// SUSPENDED → Approve ✅  | Reject ✅  | Suspend ✗
function getAllowedActions(status: Status) {
  return {
    canApprove:
      status === "PENDING" || status === "REJECTED" || status === "SUSPENDED",
    canReject: status === "PENDING" || status === "SUSPENDED",
    canSuspend: status === "APPROVED",
  };
}

export default function AdminViewJob() {
  const { id } = useParams();
  const { toast } = useToast();
  const [job, setJob] = useState<ApiJob | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectDialog, setRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const fetchJob = async () => {
    setLoading(true);
    try {
      // The admin GET /admin/jobs endpoint returns all jobs with company included.
      // Since there's no single-job endpoint, we fetch all and find by id.
      // If you later add GET /admin/jobs/:id on the backend, swap this out.
      const res = await api.get("/admin/jobs");
      const found = res.data.find((j: ApiJob) => j.id === id);
      if (!found) throw new Error("Not found");
      setJob(found);
    } catch {
      toast({ title: "Failed to load job", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJob();
  }, [id]);

  const approve = async () => {
    setActionLoading(true);
    try {
      await api.patch(`/admin/jobs/${id}/approve`);
      toast({ title: "Job approved" });
      fetchJob();
    } catch {
      toast({ title: "Failed to approve", variant: "destructive" });
    } finally {
      setActionLoading(false);
    }
  };

  const suspend = async () => {
    setActionLoading(true);
    try {
      await api.patch(`/admin/jobs/${id}/suspend`);
      toast({ title: "Job suspended" });
      fetchJob();
    } catch {
      toast({ title: "Failed to suspend", variant: "destructive" });
    } finally {
      setActionLoading(false);
    }
  };

  const reject = async () => {
    if (!rejectReason.trim()) return;
    setActionLoading(true);
    try {
      await api.patch(`/admin/jobs/${id}/reject`, {
        rejectionReason: rejectReason.trim(),
      });
      toast({ title: "Job rejected" });
      setRejectDialog(false);
      setRejectReason("");
      fetchJob();
    } catch {
      toast({ title: "Failed to reject", variant: "destructive" });
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  if (!job) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Job not found.</p>
          <Link to="/admin/jobs">
            <Button variant="outline" className="mt-4">
              Back to Jobs
            </Button>
          </Link>
        </div>
      </AdminLayout>
    );
  }

  const { canApprove, canReject, canSuspend } = getAllowedActions(job.status);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start gap-4 flex-wrap">
          <Link to="/admin/jobs">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold">{job.jobTitle}</h1>
            <p className="text-muted-foreground">{job.company.companyName}</p>
          </div>

          {/* Action buttons — state machine controlled */}
          <div className="flex gap-2 flex-wrap">
            {canApprove && (
              <Button
                onClick={approve}
                disabled={actionLoading}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {actionLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <CheckCircle className="h-4 w-4 mr-2" />
                )}
                {job.status === "SUSPENDED" ? "Reinstate" : "Approve"}
              </Button>
            )}
            {canReject && (
              <Button
                variant="destructive"
                onClick={() => {
                  setRejectDialog(true);
                  setRejectReason("");
                }}
                disabled={actionLoading}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject
              </Button>
            )}
            {canSuspend && (
              <Button
                variant="outline"
                onClick={suspend}
                disabled={actionLoading}
                className="border-orange-500 text-orange-600 hover:bg-orange-50"
              >
                <Ban className="h-4 w-4 mr-2" />
                Suspend
              </Button>
            )}
          </div>
        </div>

        {/* Status banners */}
        {job.status === "REJECTED" && job.rejectionReason && (
          <div className="rounded-lg px-4 py-3 text-sm border bg-red-500/10 border-red-500/20 text-red-700">
            <span className="font-medium">Rejected: </span>
            {job.rejectionReason}
          </div>
        )}
        {job.status === "SUSPENDED" && job.rejectionReason && (
          <div className="rounded-lg px-4 py-3 text-sm border bg-orange-500/10 border-orange-500/20 text-orange-700">
            <span className="font-medium">Suspended: </span>
            {job.rejectionReason}
          </div>
        )}
        {job.status === "PENDING" && (
          <div className="rounded-lg px-4 py-3 text-sm border bg-yellow-500/10 border-yellow-500/20 text-yellow-700">
            This job is awaiting review. Approve or reject below.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main info */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Job Details</CardTitle>
              <CardDescription>Full job posting information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Company</p>
                  <p className="font-medium flex items-center gap-1">
                    <Building className="h-3 w-3" /> {job.company.companyName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {job.location}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Job Type</p>
                  <p className="font-medium flex items-center gap-1">
                    <Briefcase className="h-3 w-3" /> {job.jobType}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Salary Range</p>
                  <p className="font-medium flex items-center gap-1">
                    <DollarSign className="h-3 w-3" /> {job.salaryRange}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Posted Date</p>
                  <p className="font-medium flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(job.jobDate).toLocaleDateString()}
                  </p>
                </div>
                {job.deadline && (
                  <div>
                    <p className="text-sm text-muted-foreground">Deadline</p>
                    <p className="font-medium flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(job.deadline).toLocaleDateString()}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <StatusBadge status={job.status} />
                </div>
                {job.reviewedAt && (
                  <div>
                    <p className="text-sm text-muted-foreground">Reviewed At</p>
                    <p className="font-medium">
                      {new Date(job.reviewedAt).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>

              <Separator />

              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Description
                </p>
                <p className="text-sm leading-relaxed">{job.jobDescription}</p>
              </div>

              {job.requirements && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Requirements
                    </p>
                    <p className="text-sm leading-relaxed">
                      {job.requirements}
                    </p>
                  </div>
                </>
              )}

              {job.responsibilities && job.responsibilities.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm font-medium mb-2">Responsibilities</p>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      {job.responsibilities.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                </>
              )}

              {job.requiredSkills && job.requiredSkills.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm font-medium mb-2">Required Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {job.requiredSkills.map((skill, i) => (
                        <Badge key={i} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Users className="h-3 w-3" /> Applications
                  </span>
                  <span className="font-medium">
                    {job.applications?.length ?? 0}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <FileText className="h-3 w-3" /> Skills Required
                  </span>
                  <span className="font-medium">
                    {job.requiredSkills?.length ?? 0}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <StatusBadge status={job.status} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Company</CardTitle>
              </CardHeader>
              <CardContent>
                <Link
                  to={`/admin/companies/${job.company.companyId}`}
                  className="text-primary hover:underline font-medium flex items-center gap-1 text-sm"
                >
                  <Building className="h-3 w-3" />
                  {job.company.companyName}
                </Link>
                <p className="text-xs text-muted-foreground mt-1">
                  Click to view company details
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Reject Dialog */}
      <Dialog open={rejectDialog} onOpenChange={setRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Job</DialogTitle>
            <DialogDescription>
              Provide a reason — this will be shown to the company.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="e.g. Job description violates platform guidelines..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            rows={3}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={!rejectReason.trim() || actionLoading}
              onClick={reject}
            >
              {actionLoading && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              Confirm Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
