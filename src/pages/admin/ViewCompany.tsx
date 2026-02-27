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
  Mail,
  Building,
  Users,
  Briefcase,
  CheckCircle,
  Ban,
  XCircle,
  Phone,
  MapPin,
  Globe,
  Loader2,
  Calendar,
  Gift,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

type Status = "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED";

interface ApiCompany {
  companyId: number;
  email: string;
  companyName: string;
  phone?: string;
  industry?: string;
  companySize?: string;
  location?: string;
  description?: string;
  benefitsAndPerks?: string; // ✅ added
  url?: string;
  founded?: string;
  profilePic?: string;
  status: Status;
  rejectionReason?: string;
  reviewedAt?: string;
  jobs?: { id: string; jobTitle: string; status: string }[];
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

function getAllowedActions(status: Status) {
  return {
    canApprove:
      status === "PENDING" || status === "REJECTED" || status === "SUSPENDED",
    canReject: status === "PENDING" || status === "SUSPENDED",
    canSuspend: status === "APPROVED",
  };
}

export default function ViewCompany() {
  const { id } = useParams();
  const { toast } = useToast();
  const [company, setCompany] = useState<ApiCompany | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectDialog, setRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const fetchCompany = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/companies/${id}`);
      setCompany(res.data);
    } catch {
      toast({ title: "Failed to load company", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompany();
  }, [id]);

  const approve = async () => {
    setActionLoading(true);
    try {
      await api.patch(`/admin/companies/${id}/approve`);
      toast({ title: "Company approved" });
      fetchCompany();
    } catch {
      toast({ title: "Failed to approve", variant: "destructive" });
    } finally {
      setActionLoading(false);
    }
  };

  const suspend = async () => {
    setActionLoading(true);
    try {
      await api.patch(`/admin/companies/${id}/suspend`);
      toast({ title: "Company suspended" });
      fetchCompany();
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
      await api.patch(`/admin/companies/${id}/reject`, {
        rejectionReason: rejectReason.trim(),
      });
      toast({ title: "Company rejected" });
      setRejectDialog(false);
      setRejectReason("");
      fetchCompany();
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

  if (!company) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Company not found.</p>
          <Link to="/admin/companies">
            <Button variant="outline" className="mt-4">
              Back to Companies
            </Button>
          </Link>
        </div>
      </AdminLayout>
    );
  }

  const { canApprove, canReject, canSuspend } = getAllowedActions(
    company.status,
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start gap-4 flex-wrap">
          <Link to="/admin/companies">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold">{company.companyName}</h1>
            <p className="text-muted-foreground">
              {company.industry ?? "No industry set"}
            </p>
          </div>

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
                {company.status === "SUSPENDED" ? "Reinstate" : "Approve"}
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
        {company.status === "REJECTED" && company.rejectionReason && (
          <div className="rounded-lg px-4 py-3 text-sm border bg-red-500/10 border-red-500/20 text-red-700">
            <span className="font-medium">Rejected: </span>
            {company.rejectionReason}
          </div>
        )}
        {company.status === "SUSPENDED" && company.rejectionReason && (
          <div className="rounded-lg px-4 py-3 text-sm border bg-orange-500/10 border-orange-500/20 text-orange-700">
            <span className="font-medium">Suspended: </span>
            {company.rejectionReason}
          </div>
        )}
        {company.status === "PENDING" && (
          <div className="rounded-lg px-4 py-3 text-sm border bg-yellow-500/10 border-yellow-500/20 text-yellow-700">
            This company is awaiting review. Approve or reject below.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main info */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>
                Details about the registered company
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Company Name</p>
                  <p className="font-medium">{company.companyName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium flex items-center gap-1">
                    <Mail className="h-3 w-3" /> {company.email}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Industry</p>
                  <p className="font-medium">{company.industry ?? "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Company Size</p>
                  <p className="font-medium flex items-center gap-1">
                    <Users className="h-3 w-3" /> {company.companySize ?? "—"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium flex items-center gap-1">
                    <Phone className="h-3 w-3" /> {company.phone ?? "—"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {company.location ?? "—"}
                  </p>
                </div>
                {company.url && (
                  <div>
                    <p className="text-sm text-muted-foreground">Website</p>
                    <a
                      href={company.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium flex items-center gap-1 text-primary hover:underline"
                    >
                      <Globe className="h-3 w-3" /> {company.url}
                    </a>
                  </div>
                )}
                {company.founded && (
                  <div>
                    <p className="text-sm text-muted-foreground">Founded</p>
                    <p className="font-medium flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> {company.founded}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <StatusBadge status={company.status} />
                </div>
                {company.reviewedAt && (
                  <div>
                    <p className="text-sm text-muted-foreground">Reviewed At</p>
                    <p className="font-medium">
                      {new Date(company.reviewedAt).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>

              {/* Description */}
              {company.description && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Description
                    </p>
                    <p className="text-sm leading-relaxed">
                      {company.description}
                    </p>
                  </div>
                </>
              )}

              {/* ✅ Benefits & Perks */}
              {company.benefitsAndPerks && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Benefits & Perks
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {company.benefitsAndPerks.split(",").map((perk, i) => (
                        <li key={i}>{perk.trim()}</li>
                      ))}
                    </ul>
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
                    <Users className="h-3 w-3" /> Employees
                  </span>
                  <span className="font-medium">
                    {company.companySize ?? "—"}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Briefcase className="h-3 w-3" /> Jobs Posted
                  </span>
                  <span className="font-medium">
                    {company.jobs?.length ?? 0}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Building className="h-3 w-3" /> Industry
                  </span>
                  <span className="font-medium">{company.industry ?? "—"}</span>
                </div>
              </CardContent>
            </Card>

            {company.jobs && company.jobs.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Job Postings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {company.jobs.slice(0, 5).map((job) => (
                    <div
                      key={job.id}
                      className="flex items-center justify-between text-sm"
                    >
                      <Link
                        to={`/admin/jobs/${job.id}`}
                        className="truncate flex-1 hover:underline text-primary"
                      >
                        {job.jobTitle}
                      </Link>
                      <Badge
                        variant="outline"
                        className="ml-2 text-xs shrink-0"
                      >
                        {job.status}
                      </Badge>
                    </div>
                  ))}
                  {company.jobs.length > 5 && (
                    <p className="text-xs text-muted-foreground">
                      +{company.jobs.length - 5} more
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Reject Dialog */}
      <Dialog open={rejectDialog} onOpenChange={setRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Company</DialogTitle>
            <DialogDescription>
              Provide a reason — this will be shown to the company.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="e.g. Missing business registration details..."
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
