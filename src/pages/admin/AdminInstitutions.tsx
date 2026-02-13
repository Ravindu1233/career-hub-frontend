import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Edit, Eye, Trash2, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const mockInstitutions = [
  { id: "1", name: "State University", type: "University", location: "New York", status: "verified", students: 25000 },
  { id: "2", name: "Tech Institute", type: "Technical", location: "San Francisco", status: "verified", students: 8000 },
  { id: "3", name: "Business College", type: "College", location: "Chicago", status: "pending", students: 5000 },
  { id: "4", name: "Design Academy", type: "Academy", location: "Los Angeles", status: "verified", students: 2000 },
];

const getStatusBadge = (status: string) => {
  const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; className: string }> = {
    verified: { variant: "default", className: "bg-primary/10 text-primary border-primary/20" },
    pending: { variant: "secondary", className: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20" },
  };
  const config = variants[status] || variants.pending;
  return <Badge variant={config.variant} className={config.className}>{status}</Badge>;
};

export default function AdminInstitutions() {
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
              <CardTitle>Institution Management</CardTitle>
              <CardDescription>Manage educational institutions</CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search institutions..." className="pl-10 w-64" />
              </div>
              <Button>Add Institution</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Institution</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockInstitutions.map((inst) => (
                <TableRow key={inst.id}>
                  <TableCell className="font-medium">{inst.name}</TableCell>
                  <TableCell>{inst.type}</TableCell>
                  <TableCell>{inst.location}</TableCell>
                  <TableCell>{inst.students.toLocaleString()}</TableCell>
                  <TableCell>{getStatusBadge(inst.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleAction("View", inst.name)}><Eye className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleAction("Edit", inst.name)}><Edit className="h-4 w-4" /></Button>
                      {inst.status === "pending" && (
                        <Button variant="ghost" size="icon" onClick={() => handleAction("Verify", inst.name)}><CheckCircle className="h-4 w-4 text-primary" /></Button>
                      )}
                      <Button variant="ghost" size="icon" onClick={() => handleAction("Delete", inst.name)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
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
