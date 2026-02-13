import { Link } from "react-router-dom";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Edit, Eye, Trash2, CheckCircle, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const mockJobs = [
  { id: "1", title: "Senior Developer", company: "TechCorp Inc", status: "active", applications: 45, postedDate: "2024-03-01" },
  { id: "2", title: "UI/UX Designer", company: "DesignHub", status: "active", applications: 32, postedDate: "2024-03-05" },
  { id: "3", title: "Product Manager", company: "StartupXYZ", status: "pending", applications: 0, postedDate: "2024-04-01" },
  { id: "4", title: "Data Analyst", company: "GlobalCorp", status: "closed", applications: 78, postedDate: "2024-02-15" },
  { id: "5", title: "Marketing Lead", company: "TechCorp Inc", status: "flagged", applications: 12, postedDate: "2024-03-20" },
];

const getStatusBadge = (status: string) => {
  const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; className: string }> = {
    active: { variant: "default", className: "bg-primary/10 text-primary border-primary/20" },
    pending: { variant: "secondary", className: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20" },
    closed: { variant: "outline", className: "bg-muted text-muted-foreground" },
    flagged: { variant: "destructive", className: "bg-destructive/10 text-destructive border-destructive/20" },
  };
  const config = variants[status] || variants.pending;
  return <Badge variant={config.variant} className={config.className}>{status}</Badge>;
};

export default function AdminJobs() {
  const { toast } = useToast();

  const handleAction = (action: string, item: string) => {
    toast({ title: `${action} successful`, description: `${item} has been ${action.toLowerCase()}d.` });
  };

  return (
    <AdminLayout>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div>
              <CardTitle>Job Management</CardTitle>
              <CardDescription>Monitor and manage all job postings</CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search jobs..." className="pl-10 w-64" />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-32"><SelectValue placeholder="Filter" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="flagged">Flagged</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job Title</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Applications</TableHead>
                <TableHead>Posted</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockJobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell className="font-medium">{job.title}</TableCell>
                  <TableCell>{job.company}</TableCell>
                  <TableCell>{job.applications}</TableCell>
                  <TableCell>{job.postedDate}</TableCell>
                  <TableCell>{getStatusBadge(job.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link to={`/company/jobs/${job.id}`}>
                        <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
                      </Link>
                      <Link to={`/company/jobs/${job.id}/edit`}>
                        <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                      </Link>
                      {job.status === "pending" && (
                        <Button variant="ghost" size="icon" onClick={() => handleAction("Approve", job.title)}><CheckCircle className="h-4 w-4 text-primary" /></Button>
                      )}
                      {job.status === "flagged" && (
                        <Button variant="ghost" size="icon" onClick={() => handleAction("Review", job.title)}><AlertTriangle className="h-4 w-4 text-yellow-500" /></Button>
                      )}
                      <Button variant="ghost" size="icon" onClick={() => handleAction("Delete", job.title)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
