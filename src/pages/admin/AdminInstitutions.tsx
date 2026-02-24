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
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search, Ban, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

type Status = "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED";

interface ApiInstitution {
  id: string;
  name: string;
  email: string;
  location?: string;
  status: Status;
  rejectionReason?: string;
  user: { userId: number; email: string };
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

export default function AdminInstitutions() {
  const { toast } = useToast();
  const [institutions, setInstitutions] = useState<ApiInstitution[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [rejectDialog, setRejectDialog] = useState<{
    open: boolean;
    id: string;
  } | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const fetchInstitutions = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/institutions");
      setInstitutions(res.data);
    } catch {
      toast({ title: "Failed to load institutions", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstitutions();
  }, []);

  const approve = async (id: string) => {
    setActionLoading(true);
    try {
      await api.patch(`/admin/institutions/${id}/approve`);
      toast({ title: "Institution approved" });
      fetchInstitutions();
    } catch {
      toast({ title: "Failed to approve", variant: "destructive" });
    } finally {
      setActionLoading(false);
    }
  };

  const suspend = async (id: string) => {
    setActionLoading(true);
    try {
      await api.patch(`/admin/institutions/${id}/suspend`);
      toast({ title: "Institution suspended" });
      fetchInstitutions();
    } catch {
      toast({ title: "Failed to suspend", variant: "destructive" });
    } finally {
      setActionLoading(false);
    }
  };

  const reject = async () => {
    if (!rejectDialog || !rejectReason.trim()) return;
    setActionLoading(true);
    try {
      await api.patch(`/admin/institutions/${rejectDialog.id}/reject`, {
        rejectionReason: rejectReason.trim(),
      });
      toast({ title: "Institution rejected" });
      setRejectDialog(null);
      setRejectReason("");
      fetchInstitutions();
    } catch {
      toast({ title: "Failed to reject", variant: "destructive" });
    } finally {
      setActionLoading(false);
    }
  };

  const filtered = institutions.filter((i) => {
    const matchSearch = `${i.name} ${i.email}`
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchStatus =
      statusFilter === "all" || i.status === statusFilter.toUpperCase();
    return matchSearch && matchStatus;
  });

  return (
    <AdminLayout>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div>
              <CardTitle>Institution Management</CardTitle>
              <CardDescription>
                Review and approve educational institutions
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search institutions..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Institution</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((i) => (
                  <TableRow key={i.id}>
                    <TableCell>
                      <p className="font-medium">{i.name}</p>
                      <p className="text-sm text-muted-foreground">{i.email}</p>
                    </TableCell>
                    <TableCell>{i.location ?? "—"}</TableCell>
                    <TableCell>{i.user.email}</TableCell>
                    <TableCell>
                      <StatusBadge status={i.status} />
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-[160px] truncate">
                      {i.rejectionReason ?? "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        {i.status !== "APPROVED" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Approve"
                            disabled={actionLoading}
                            onClick={() => approve(i.id)}
                          >
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          </Button>
                        )}
                        {i.status !== "REJECTED" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Reject"
                            disabled={actionLoading}
                            onClick={() => {
                              setRejectDialog({ open: true, id: i.id });
                              setRejectReason("");
                            }}
                          >
                            <XCircle className="h-4 w-4 text-destructive" />
                          </Button>
                        )}
                        {i.status !== "SUSPENDED" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Suspend"
                            disabled={actionLoading}
                            onClick={() => suspend(i.id)}
                          >
                            <Ban className="h-4 w-4 text-orange-500" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center text-muted-foreground py-8"
                    >
                      No institutions found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={!!rejectDialog?.open}
        onOpenChange={() => setRejectDialog(null)}
      >
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
            <Button variant="outline" onClick={() => setRejectDialog(null)}>
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
