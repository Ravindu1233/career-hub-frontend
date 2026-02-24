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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Globe,
  Users,
  GraduationCap,
  CheckCircle,
  Ban,
  XCircle,
  Loader2,
  Calendar,
  User,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

type Status = "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED";

interface ApiCourse {
  id: string;
  name: string;
  type: string;
  duration: string;
  startDate: string;
  price: string;
  spots?: number;
  description?: string;
}

interface ApiInstitution {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  description?: string;
  website?: string;
  logo?: string;
  founded?: string;
  students?: string;
  createdAt: string;
  status: Status;
  rejectionReason?: string;
  reviewedAt?: string;
  user: { userId: number; email: string };
  courses: ApiCourse[];
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

export default function AdminViewInstitution() {
  const { id } = useParams();
  const { toast } = useToast();
  const [institution, setInstitution] = useState<ApiInstitution | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectDialog, setRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const fetchInstitution = async () => {
    setLoading(true);
    try {
      // Fetch all and find by id until GET /admin/institutions/:id is added
      const res = await api.get("/admin/institutions");
      const found = res.data.find((inst: ApiInstitution) => inst.id === id);
      if (!found) throw new Error("Not found");
      setInstitution(found);
    } catch {
      toast({ title: "Failed to load institution", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstitution();
  }, [id]);

  const approve = async () => {
    setActionLoading(true);
    try {
      await api.patch(`/admin/institutions/${id}/approve`);
      toast({ title: "Institution approved" });
      fetchInstitution();
    } catch {
      toast({ title: "Failed to approve", variant: "destructive" });
    } finally {
      setActionLoading(false);
    }
  };

  const suspend = async () => {
    setActionLoading(true);
    try {
      await api.patch(`/admin/institutions/${id}/suspend`);
      toast({ title: "Institution suspended" });
      fetchInstitution();
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
      await api.patch(`/admin/institutions/${id}/reject`, {
        rejectionReason: rejectReason.trim(),
      });
      toast({ title: "Institution rejected" });
      setRejectDialog(false);
      setRejectReason("");
      fetchInstitution();
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

  if (!institution) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Institution not found.</p>
          <Link to="/admin/institutions">
            <Button variant="outline" className="mt-4">
              Back to Institutions
            </Button>
          </Link>
        </div>
      </AdminLayout>
    );
  }

  const { canApprove, canReject, canSuspend } = getAllowedActions(
    institution.status,
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start gap-4 flex-wrap">
          <Link to="/admin/institutions">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold">{institution.name}</h1>
            <p className="text-muted-foreground">
              {institution.location ?? "No location set"}
            </p>
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
                {institution.status === "SUSPENDED" ? "Reinstate" : "Approve"}
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
        {institution.status === "REJECTED" && institution.rejectionReason && (
          <div className="rounded-lg px-4 py-3 text-sm border bg-red-500/10 border-red-500/20 text-red-700">
            <span className="font-medium">Rejected: </span>
            {institution.rejectionReason}
          </div>
        )}
        {institution.status === "SUSPENDED" && institution.rejectionReason && (
          <div className="rounded-lg px-4 py-3 text-sm border bg-orange-500/10 border-orange-500/20 text-orange-700">
            <span className="font-medium">Suspended: </span>
            {institution.rejectionReason}
          </div>
        )}
        {institution.status === "PENDING" && (
          <div className="rounded-lg px-4 py-3 text-sm border bg-yellow-500/10 border-yellow-500/20 text-yellow-700">
            This institution is awaiting review. Approve or reject below.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main info */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Institution Information</CardTitle>
              <CardDescription>
                Details about the registered institution
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{institution.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium flex items-center gap-1">
                    <Mail className="h-3 w-3" /> {institution.email}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium flex items-center gap-1">
                    <Phone className="h-3 w-3" /> {institution.phone ?? "—"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {institution.location ?? "—"}
                  </p>
                </div>
                {institution.website && (
                  <div>
                    <p className="text-sm text-muted-foreground">Website</p>
                    <a
                      href={institution.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium flex items-center gap-1 text-primary hover:underline"
                    >
                      <Globe className="h-3 w-3" /> {institution.website}
                    </a>
                  </div>
                )}
                {institution.founded && (
                  <div>
                    <p className="text-sm text-muted-foreground">Founded</p>
                    <p className="font-medium flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> {institution.founded}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground">Submitted By</p>
                  <Link
                    to={`/admin/users/${institution.user.userId}`}
                    className="font-medium flex items-center gap-1 text-primary hover:underline"
                  >
                    <User className="h-3 w-3" /> {institution.user.email}
                  </Link>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Registered</p>
                  <p className="font-medium">
                    {new Date(institution.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <StatusBadge status={institution.status} />
                </div>
                {institution.reviewedAt && (
                  <div>
                    <p className="text-sm text-muted-foreground">Reviewed At</p>
                    <p className="font-medium">
                      {new Date(institution.reviewedAt).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>

              {institution.description && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Description
                    </p>
                    <p className="text-sm leading-relaxed">
                      {institution.description}
                    </p>
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
                    <Users className="h-3 w-3" /> Students
                  </span>
                  <span className="font-medium">
                    {institution.students ?? "—"}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <GraduationCap className="h-3 w-3" /> Courses
                  </span>
                  <span className="font-medium">
                    {institution.courses?.length ?? 0}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <StatusBadge status={institution.status} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Courses table */}
        {institution.courses && institution.courses.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Courses</CardTitle>
              <CardDescription>
                Courses offered by this institution
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Course Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Spots</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {institution.courses.map((course) => (
                    <TableRow key={course.id}>
                      <TableCell className="font-medium">
                        {course.name}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{course.type}</Badge>
                      </TableCell>
                      <TableCell>{course.duration}</TableCell>
                      <TableCell>{course.startDate}</TableCell>
                      <TableCell>{course.price}</TableCell>
                      <TableCell>{course.spots ?? "—"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Reject Dialog */}
      <Dialog open={rejectDialog} onOpenChange={setRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Institution</DialogTitle>
            <DialogDescription>
              Provide a reason — this will be shown to the institution owner.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="e.g. Missing accreditation documents..."
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
