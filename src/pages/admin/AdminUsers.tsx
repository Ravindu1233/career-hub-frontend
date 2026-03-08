import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Loader2, Eye, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

type Status = "ACTIVE" | "SUSPENDED" | "REJECTED";

interface ApiUser {
  userId: number;
  email: string;
  firstName?: string;
  lastName?: string;
  mobile?: string;
  status: Status;
  rejectionReason?: string;
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

export default function AdminUsers() {
  const { toast } = useToast();
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data);
    } catch {
      toast({ title: "Failed to load users", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const hasActiveFilters = search || statusFilter !== "all";

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
  };

  const filtered = users
    .filter((u) => {
      const matchSearch =
        `${u.firstName ?? ""} ${u.lastName ?? ""} ${u.email} ${u.mobile ?? ""}`
          .toLowerCase()
          .includes(search.toLowerCase());
      const matchStatus = statusFilter === "all" || u.status === statusFilter;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => {
      // Suspended users float to top for visibility
      if (a.status === "SUSPENDED" && b.status !== "SUSPENDED") return -1;
      if (a.status !== "SUSPENDED" && b.status === "SUSPENDED") return 1;
      return 0;
    });

  const suspendedCount = users.filter((u) => u.status === "SUSPENDED").length;

  return (
    <AdminLayout>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                {suspendedCount > 0 && (
                  <Badge className="bg-orange-500 text-white text-xs">
                    {suspendedCount} Suspended
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Filters Row */}
          <div className="flex flex-wrap gap-2 pt-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email or mobile..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 w-64"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="SUSPENDED">Suspended</SelectItem>
              </SelectContent>
            </Select>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-10 px-3 text-muted-foreground"
              >
                <X className="h-4 w-4 mr-1" /> Clear
              </Button>
            )}
          </div>

          <p className="text-xs text-muted-foreground pt-1">
            Showing {filtered.length} of {users.length} users
          </p>
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
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Mobile</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((u) => (
                  <TableRow key={u.userId}>
                    <TableCell className="font-medium">
                      {[u.firstName, u.lastName].filter(Boolean).join(" ") ||
                        "—"}
                    </TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>{u.mobile ?? "—"}</TableCell>
                    <TableCell>
                      <StatusBadge status={u.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Link to={`/admin/users/${u.userId}`}>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="View details"
                        >
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center text-muted-foreground py-8"
                    >
                      No users found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
