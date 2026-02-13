import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Edit, Eye, Trash2, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const mockCompanies = [
  { id: "1", name: "TechCorp Inc", email: "hr@techcorp.com", industry: "Technology", status: "verified", jobsPosted: 12, employees: "500-1000" },
  { id: "2", name: "DesignHub", email: "jobs@designhub.com", industry: "Design", status: "verified", jobsPosted: 8, employees: "50-100" },
  { id: "3", name: "StartupXYZ", email: "careers@startupxyz.com", industry: "Fintech", status: "pending", jobsPosted: 3, employees: "10-50" },
  { id: "4", name: "GlobalCorp", email: "hr@globalcorp.com", industry: "Consulting", status: "verified", jobsPosted: 25, employees: "1000+" },
];

const getStatusBadge = (status: string) => {
  const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; className: string }> = {
    verified: { variant: "default", className: "bg-primary/10 text-primary border-primary/20" },
    pending: { variant: "secondary", className: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20" },
  };
  const config = variants[status] || variants.pending;
  return <Badge variant={config.variant} className={config.className}>{status}</Badge>;
};

export default function AdminCompanies() {
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
              <CardTitle>Company Management</CardTitle>
              <CardDescription>Manage registered companies and their verification status</CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search companies..." className="pl-10 w-64" />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-32"><SelectValue placeholder="Filter" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Industry</TableHead>
                <TableHead>Employees</TableHead>
                <TableHead>Jobs Posted</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockCompanies.map((company) => (
                <TableRow key={company.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{company.name}</p>
                      <p className="text-sm text-muted-foreground">{company.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>{company.industry}</TableCell>
                  <TableCell>{company.employees}</TableCell>
                  <TableCell>{company.jobsPosted}</TableCell>
                  <TableCell>{getStatusBadge(company.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleAction("View", company.name)}><Eye className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleAction("Edit", company.name)}><Edit className="h-4 w-4" /></Button>
                      {company.status === "pending" && (
                        <Button variant="ghost" size="icon" onClick={() => handleAction("Verify", company.name)}><CheckCircle className="h-4 w-4 text-primary" /></Button>
                      )}
                      <Button variant="ghost" size="icon" onClick={() => handleAction("Delete", company.name)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
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
