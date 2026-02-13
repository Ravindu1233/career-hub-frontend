import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Edit, Eye, Ban, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const mockUsers = [
  { id: "1", name: "John Doe", email: "john@example.com", role: "user", status: "active", joinedDate: "2024-01-15" },
  { id: "2", name: "Jane Smith", email: "jane@example.com", role: "user", status: "active", joinedDate: "2024-02-20" },
  { id: "3", name: "Bob Wilson", email: "bob@example.com", role: "user", status: "suspended", joinedDate: "2024-03-10" },
  { id: "4", name: "Alice Brown", email: "alice@example.com", role: "company", status: "active", joinedDate: "2024-01-25" },
  { id: "5", name: "Charlie Davis", email: "charlie@example.com", role: "company", status: "pending", joinedDate: "2024-04-01" },
];

const getStatusBadge = (status: string) => {
  const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; className: string }> = {
    active: { variant: "default", className: "bg-primary/10 text-primary border-primary/20" },
    pending: { variant: "secondary", className: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20" },
    suspended: { variant: "destructive", className: "bg-destructive/10 text-destructive border-destructive/20" },
  };
  const config = variants[status] || variants.pending;
  return <Badge variant={config.variant} className={config.className}>{status}</Badge>;
};

export default function AdminUsers() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");

  const handleAction = (action: string, item: string) => {
    toast({ title: `${action} successful`, description: `${item} has been ${action.toLowerCase()}d.` });
  };

  return (
    <AdminLayout>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div>
              <CardTitle>User Management</CardTitle>
              <CardDescription>View and manage all registered users</CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search users..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 w-64" />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-32"><SelectValue placeholder="Filter" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
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
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell><Badge variant="outline">{user.role}</Badge></TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell>{user.joinedDate}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleAction("View", user.name)}><Eye className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleAction("Edit", user.name)}><Edit className="h-4 w-4" /></Button>
                      {user.status === "active" ? (
                        <Button variant="ghost" size="icon" onClick={() => handleAction("Suspend", user.name)}><Ban className="h-4 w-4 text-destructive" /></Button>
                      ) : (
                        <Button variant="ghost" size="icon" onClick={() => handleAction("Activate", user.name)}><CheckCircle className="h-4 w-4 text-primary" /></Button>
                      )}
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
