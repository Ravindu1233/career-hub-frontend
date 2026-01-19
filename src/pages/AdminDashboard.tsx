import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Users, Building2, Briefcase, GraduationCap, BarChart3, Settings,
  Search, Edit, Trash2, Eye, Ban, CheckCircle, AlertTriangle,
  TrendingUp, UserCheck, Building, FileText
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data
const mockUsers = [
  { id: "1", name: "John Doe", email: "john@example.com", role: "user", status: "active", joinedDate: "2024-01-15" },
  { id: "2", name: "Jane Smith", email: "jane@example.com", role: "user", status: "active", joinedDate: "2024-02-20" },
  { id: "3", name: "Bob Wilson", email: "bob@example.com", role: "user", status: "suspended", joinedDate: "2024-03-10" },
  { id: "4", name: "Alice Brown", email: "alice@example.com", role: "company", status: "active", joinedDate: "2024-01-25" },
  { id: "5", name: "Charlie Davis", email: "charlie@example.com", role: "company", status: "pending", joinedDate: "2024-04-01" },
];

const mockCompanies = [
  { id: "1", name: "TechCorp Inc", email: "hr@techcorp.com", industry: "Technology", status: "verified", jobsPosted: 12, employees: "500-1000" },
  { id: "2", name: "DesignHub", email: "jobs@designhub.com", industry: "Design", status: "verified", jobsPosted: 8, employees: "50-100" },
  { id: "3", name: "StartupXYZ", email: "careers@startupxyz.com", industry: "Fintech", status: "pending", jobsPosted: 3, employees: "10-50" },
  { id: "4", name: "GlobalCorp", email: "hr@globalcorp.com", industry: "Consulting", status: "verified", jobsPosted: 25, employees: "1000+" },
];

const mockJobs = [
  { id: "1", title: "Senior Developer", company: "TechCorp Inc", status: "active", applications: 45, postedDate: "2024-03-01" },
  { id: "2", title: "UI/UX Designer", company: "DesignHub", status: "active", applications: 32, postedDate: "2024-03-05" },
  { id: "3", title: "Product Manager", company: "StartupXYZ", status: "pending", applications: 0, postedDate: "2024-04-01" },
  { id: "4", title: "Data Analyst", company: "GlobalCorp", status: "closed", applications: 78, postedDate: "2024-02-15" },
  { id: "5", title: "Marketing Lead", company: "TechCorp Inc", status: "flagged", applications: 12, postedDate: "2024-03-20" },
];

const mockInstitutions = [
  { id: "1", name: "State University", type: "University", location: "New York", status: "verified", students: 25000 },
  { id: "2", name: "Tech Institute", type: "Technical", location: "San Francisco", status: "verified", students: 8000 },
  { id: "3", name: "Business College", type: "College", location: "Chicago", status: "pending", students: 5000 },
  { id: "4", name: "Design Academy", type: "Academy", location: "Los Angeles", status: "verified", students: 2000 },
];

const AdminDashboard = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("overview");

  const stats = {
    totalUsers: 1250,
    totalCompanies: 89,
    totalJobs: 342,
    totalInstitutions: 45,
    activeApplications: 1876,
    pendingApprovals: 23,
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; className: string }> = {
      active: { variant: "default", className: "bg-green-500/10 text-green-600 border-green-500/20" },
      verified: { variant: "default", className: "bg-green-500/10 text-green-600 border-green-500/20" },
      pending: { variant: "secondary", className: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20" },
      suspended: { variant: "destructive", className: "bg-red-500/10 text-red-600 border-red-500/20" },
      closed: { variant: "outline", className: "bg-muted text-muted-foreground" },
      flagged: { variant: "destructive", className: "bg-orange-500/10 text-orange-600 border-orange-500/20" },
    };
    const config = variants[status] || variants.pending;
    return <Badge variant={config.variant} className={config.className}>{status}</Badge>;
  };

  const handleAction = (action: string, item: string) => {
    toast({
      title: `${action} successful`,
      description: `${item} has been ${action.toLowerCase()}d.`,
    });
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage users, companies, jobs, and institutions</p>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid grid-cols-2 md:grid-cols-6 gap-2 h-auto p-1">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Users</span>
            </TabsTrigger>
            <TabsTrigger value="companies" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              <span className="hidden sm:inline">Companies</span>
            </TabsTrigger>
            <TabsTrigger value="jobs" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              <span className="hidden sm:inline">Jobs</span>
            </TabsTrigger>
            <TabsTrigger value="institutions" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              <span className="hidden sm:inline">Institutions</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 text-green-500" />
                    +12% from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Companies</CardTitle>
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalCompanies}</div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 text-green-500" />
                    +8% from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalJobs}</div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 text-green-500" />
                    +15% from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Institutions</CardTitle>
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalInstitutions}</div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 text-green-500" />
                    +5% from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Applications</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.activeApplications.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 text-green-500" />
                    +22% from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.pendingApprovals}</div>
                  <p className="text-xs text-muted-foreground">Requires attention</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest actions across the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { icon: UserCheck, text: "New user registration: john.doe@email.com", time: "2 minutes ago" },
                    { icon: Building, text: "Company verified: TechStartup Inc", time: "15 minutes ago" },
                    { icon: Briefcase, text: "New job posted: Senior Developer at DesignHub", time: "1 hour ago" },
                    { icon: AlertTriangle, text: "Job flagged for review: Marketing Position", time: "2 hours ago" },
                    { icon: GraduationCap, text: "New institution registered: Tech Academy", time: "3 hours ago" },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                      <activity.icon className="h-5 w-5 text-primary" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.text}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
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
                      <Input
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <Select defaultValue="all">
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Filter" />
                      </SelectTrigger>
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
                        <TableCell>
                          <Badge variant="outline">{user.role}</Badge>
                        </TableCell>
                        <TableCell>{getStatusBadge(user.status)}</TableCell>
                        <TableCell>{user.joinedDate}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleAction("View", user.name)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleAction("Edit", user.name)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            {user.status === "active" ? (
                              <Button variant="ghost" size="icon" onClick={() => handleAction("Suspend", user.name)}>
                                <Ban className="h-4 w-4 text-destructive" />
                              </Button>
                            ) : (
                              <Button variant="ghost" size="icon" onClick={() => handleAction("Activate", user.name)}>
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Companies Tab */}
          <TabsContent value="companies" className="space-y-4">
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
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Filter" />
                      </SelectTrigger>
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
                            <Button variant="ghost" size="icon" onClick={() => handleAction("View", company.name)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleAction("Edit", company.name)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            {company.status === "pending" && (
                              <Button variant="ghost" size="icon" onClick={() => handleAction("Verify", company.name)}>
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              </Button>
                            )}
                            <Button variant="ghost" size="icon" onClick={() => handleAction("Delete", company.name)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Jobs Tab */}
          <TabsContent value="jobs" className="space-y-4">
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
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Filter" />
                      </SelectTrigger>
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
                            <Button variant="ghost" size="icon" onClick={() => handleAction("View", job.title)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleAction("Edit", job.title)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            {job.status === "pending" && (
                              <Button variant="ghost" size="icon" onClick={() => handleAction("Approve", job.title)}>
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              </Button>
                            )}
                            {job.status === "flagged" && (
                              <Button variant="ghost" size="icon" onClick={() => handleAction("Review", job.title)}>
                                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                              </Button>
                            )}
                            <Button variant="ghost" size="icon" onClick={() => handleAction("Delete", job.title)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Institutions Tab */}
          <TabsContent value="institutions" className="space-y-4">
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
                            <Button variant="ghost" size="icon" onClick={() => handleAction("View", inst.name)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleAction("Edit", inst.name)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            {inst.status === "pending" && (
                              <Button variant="ghost" size="icon" onClick={() => handleAction("Verify", inst.name)}>
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              </Button>
                            )}
                            <Button variant="ghost" size="icon" onClick={() => handleAction("Delete", inst.name)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Settings</CardTitle>
                  <CardDescription>Configure general platform settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Platform Name</label>
                    <Input defaultValue="JobPortal" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Support Email</label>
                    <Input defaultValue="support@jobportal.com" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Max Jobs Per Company</label>
                    <Input type="number" defaultValue="50" />
                  </div>
                  <Button onClick={() => handleAction("Save", "Settings")}>Save Settings</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Moderation Settings</CardTitle>
                  <CardDescription>Configure content moderation rules</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Auto-approve verified companies</p>
                      <p className="text-sm text-muted-foreground">Skip manual review for verified companies</p>
                    </div>
                    <Button variant="outline">Enabled</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Job posting review</p>
                      <p className="text-sm text-muted-foreground">Require manual approval for new jobs</p>
                    </div>
                    <Button variant="outline">Disabled</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Content filtering</p>
                      <p className="text-sm text-muted-foreground">Auto-flag inappropriate content</p>
                    </div>
                    <Button variant="outline">Enabled</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default AdminDashboard;
