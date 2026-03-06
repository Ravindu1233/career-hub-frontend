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
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");

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

  // Derive unique filter options from data
  const locations = [
    ...new Set(institutions.map((i) => i.location).filter(Boolean)),
  ] as string[];

  const hasActiveFilters =
    search || statusFilter !== "all" || locationFilter !== "all";

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setLocationFilter("all");
  };

  const filtered = institutions
    .filter((i) => {
      const matchSearch =
        `${i.name} ${i.email} ${i.location ?? ""} ${i.user.email}`
          .toLowerCase()
          .includes(search.toLowerCase());
      const matchStatus = statusFilter === "all" || i.status === statusFilter;
      const matchLocation =
        locationFilter === "all" || i.location === locationFilter;
      return matchSearch && matchStatus && matchLocation;
    })
    .sort((a, b) => {
      if (a.status === "PENDING" && b.status !== "PENDING") return -1;
      if (a.status !== "PENDING" && b.status === "PENDING") return 1;
      return 0;
    });

  const pendingCount = institutions.filter(
    (i) => i.status === "PENDING",
  ).length;

  return (
    <AdminLayout>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                {pendingCount > 0 && (
                  <Badge className="bg-yellow-500 text-white text-xs">
                    {pendingCount} Pending
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
                placeholder="Search institutions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 w-56"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
                <SelectItem value="SUSPENDED">Suspended</SelectItem>
              </SelectContent>
            </Select>

            {locations.length > 0 && (
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {locations.map((loc) => (
                    <SelectItem key={loc} value={loc}>
                      {loc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

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
            Showing {filtered.length} of {institutions.length} institutions
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
                  <TableHead>Institution</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Status</TableHead>
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
                    <TableCell className="text-right">
                      <Link to={`/admin/institutions/${i.id}`}>
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
    </AdminLayout>
  );
}
