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
  Phone,
  MapPin,
  Ban,
  RotateCcw,
  Loader2,
  Calendar,
  User,
  Briefcase,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

type Status = "ACTIVE" | "SUSPENDED" | "REJECTED";

interface ApiUser {
  userId: number;
  email: string;
  firstName?: string;
  lastName?: string;
  mobile?: string;
  address?: string;
  bio?: string;
  skills?: string[];
  schools?: string;
  profilePic?: string;
  dob?: string;
  status: Status;
  rejectionReason?: string;
  reviewedAt?: string;
  applications?: { id: string; status: string; job: { jobTitle: string } }[];
}

function StatusBadge({ status }: { status: Status }) {
  const map: Record<Status, string> = {
    ACTIVE: "bg-green-500/10 text-green-600 border-green-500/20",
    SUSPENDED: "bg-orange-500/10 text-orange-600 border-orange-500/20",
    REJECTED: "bg-red-500/10 text-red-600 border-red-500/20",
  };
  return (
    <Badge variant="outline" className={map[status]}>
      {status}
    </Badge>
  );
}

function getAllowedActions(status: Status) {
  return {
    canSuspend: status !== "SUSPENDED",
    canReinstate: status === "SUSPENDED",
  };
}

export default function ViewUser() {
  const { id } = useParams();
  const { toast } = useToast();
  const [user, setUser] = useState<ApiUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [suspendDialog, setSuspendDialog] = useState(false);
  const [suspendReason, setSuspendReason] = useState("");

  const fetchUser = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/users/${id}`);
      setUser(res.data);
    } catch {
      toast({ title: "Failed to load user", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

  const suspend = async () => {
    setActionLoading(true);
    try {
      await api.patch(`/admin/users/${id}/suspend`, {
        rejectionReason: suspendReason.trim() || undefined,
      });
      toast({ title: "User suspended" });
      setSuspendDialog(false);
      setSuspendReason("");
      fetchUser();
    } catch {
      toast({ title: "Failed to suspend", variant: "destructive" });
    } finally {
      setActionLoading(false);
    }
  };

  const reinstate = async () => {
    setActionLoading(true);
    try {
      await api.patch(`/admin/users/${id}/reinstate`);
      toast({ title: "User reinstated" });
      fetchUser();
    } catch {
      toast({ title: "Failed to reinstate", variant: "destructive" });
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

  if (!user) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">User not found.</p>
          <Link to="/admin/users">
            <Button variant="outline" className="mt-4">
              Back to Users
            </Button>
          </Link>
        </div>
      </AdminLayout>
    );
  }

  const { canSuspend, canReinstate } = getAllowedActions(user.status);
  const fullName =
    [user.firstName, user.lastName].filter(Boolean).join(" ") || "No name";

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <Link to="/admin/users">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          {/* Action buttons — suspend / reinstate only */}
          <div className="flex gap-2 flex-wrap">
            {canReinstate && (
              <Button
                onClick={reinstate}
                disabled={actionLoading}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {actionLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <RotateCcw className="h-4 w-4 mr-2" />
                )}
                Reinstate
              </Button>
            )}
            {canSuspend && (
              <Button
                variant="outline"
                onClick={() => {
                  setSuspendDialog(true);
                  setSuspendReason("");
                }}
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
        {user.status === "SUSPENDED" && (
          <div className="rounded-lg px-4 py-3 text-sm border bg-orange-500/10 border-orange-500/20 text-orange-700">
            <span className="font-medium">Suspended</span>
            {user.rejectionReason && <span>: {user.rejectionReason}</span>}
          </div>
        )}
        {user.status === "REJECTED" && (
          <div className="rounded-lg px-4 py-3 text-sm border bg-red-500/10 border-red-500/20 text-red-700">
            <span className="font-medium">Rejected</span>
            {user.rejectionReason && <span>: {user.rejectionReason}</span>}
          </div>
        )}
        {user.status === "ACTIVE" && (
          <div className="rounded-lg px-4 py-3 text-sm border bg-green-500/10 border-green-500/20 text-green-700">
            This user's account is active. You can suspend them if needed.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main info */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>User Information</CardTitle>
              <CardDescription>
                Details about the registered user
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Full Name</p>
                  <p className="font-medium flex items-center gap-1">
                    <User className="h-3 w-3" /> {fullName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium flex items-center gap-1">
                    <Mail className="h-3 w-3" /> {user.email}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium flex items-center gap-1">
                    <Phone className="h-3 w-3" /> {user.mobile ?? "—"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="font-medium flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {user.address ?? "—"}
                  </p>
                </div>
                {user.dob && (
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Date of Birth
                    </p>
                    <p className="font-medium flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(user.dob).toLocaleDateString()}
                    </p>
                  </div>
                )}
                {user.schools && (
                  <div>
                    <p className="text-sm text-muted-foreground">Education</p>
                    <p className="font-medium">{user.schools}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <StatusBadge status={user.status} />
                </div>
                {user.reviewedAt && (
                  <div>
                    <p className="text-sm text-muted-foreground">Last Action</p>
                    <p className="font-medium">
                      {new Date(user.reviewedAt).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>

              {user.bio && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Bio</p>
                    <p className="text-sm leading-relaxed">{user.bio}</p>
                  </div>
                </>
              )}

              {user.skills && user.skills.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {user.skills.map((skill, i) => (
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
                    <Briefcase className="h-3 w-3" /> Applications
                  </span>
                  <span className="font-medium">
                    {user.applications?.length ?? 0}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <User className="h-3 w-3" /> Skills
                  </span>
                  <span className="font-medium">
                    {user.skills?.length ?? 0}
                  </span>
                </div>
              </CardContent>
            </Card>

            {user.applications && user.applications.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Applications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {user.applications.slice(0, 5).map((app) => (
                    <div
                      key={app.id}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="truncate flex-1">
                        {app.job.jobTitle}
                      </span>
                      <Badge
                        variant="outline"
                        className="ml-2 text-xs shrink-0"
                      >
                        {app.status}
                      </Badge>
                    </div>
                  ))}
                  {user.applications.length > 5 && (
                    <p className="text-xs text-muted-foreground">
                      +{user.applications.length - 5} more
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Suspend Dialog */}
      <Dialog open={suspendDialog} onOpenChange={setSuspendDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Suspend User</DialogTitle>
            <DialogDescription>
              Optionally provide a reason for the suspension.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="e.g. Violation of platform terms of service... (optional)"
            value={suspendReason}
            onChange={(e) => setSuspendReason(e.target.value)}
            rows={3}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setSuspendDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={actionLoading}
              onClick={suspend}
            >
              {actionLoading && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              Confirm Suspend
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
