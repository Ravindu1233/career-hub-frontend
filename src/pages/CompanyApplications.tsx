import { useState } from "react";
import { Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search,
  Filter,
  Eye,
  Download,
  Mail,
  Phone,
  Calendar,
  MapPin,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  Briefcase,
  TrendingUp,
} from "lucide-react";

const mockApplications = [
  {
    id: "1",
    candidateName: "John Doe",
    candidateEmail: "john.doe@email.com",
    candidatePhone: "+1 234 567 890",
    candidateLocation: "New York, USA",
    candidateAvatar: "",
    jobTitle: "Senior Software Engineer",
    appliedDate: "2024-01-15",
    status: "under_review",
    experience: "5 years",
    education: "BS Computer Science",
    resumeUrl: "#",
    coverLetter: "I am excited to apply for this position...",
    skills: ["React", "TypeScript", "Node.js", "PostgreSQL"],
  },
  {
    id: "2",
    candidateName: "Jane Smith",
    candidateEmail: "jane.smith@email.com",
    candidatePhone: "+1 234 567 891",
    candidateLocation: "San Francisco, USA",
    candidateAvatar: "",
    jobTitle: "Senior Software Engineer",
    appliedDate: "2024-01-14",
    status: "shortlisted",
    experience: "7 years",
    education: "MS Computer Science",
    resumeUrl: "#",
    coverLetter: "With my extensive experience in full-stack development...",
    skills: ["React", "Python", "AWS", "Docker"],
  },
  {
    id: "3",
    candidateName: "Mike Johnson",
    candidateEmail: "mike.j@email.com",
    candidatePhone: "+1 234 567 892",
    candidateLocation: "Austin, USA",
    candidateAvatar: "",
    jobTitle: "Product Manager",
    appliedDate: "2024-01-13",
    status: "interview_scheduled",
    experience: "4 years",
    education: "MBA",
    resumeUrl: "#",
    coverLetter: "I bring a unique blend of technical and business skills...",
    skills: ["Product Strategy", "Agile", "Data Analysis", "Leadership"],
  },
  {
    id: "4",
    candidateName: "Sarah Williams",
    candidateEmail: "sarah.w@email.com",
    candidatePhone: "+1 234 567 893",
    candidateLocation: "Seattle, USA",
    candidateAvatar: "",
    jobTitle: "UX Designer",
    appliedDate: "2024-01-12",
    status: "rejected",
    experience: "3 years",
    education: "BFA Design",
    resumeUrl: "#",
    coverLetter: "My passion for user-centered design...",
    skills: ["Figma", "User Research", "Prototyping", "Design Systems"],
  },
  {
    id: "5",
    candidateName: "David Brown",
    candidateEmail: "david.b@email.com",
    candidatePhone: "+1 234 567 894",
    candidateLocation: "Chicago, USA",
    candidateAvatar: "",
    jobTitle: "Data Scientist",
    appliedDate: "2024-01-11",
    status: "hired",
    experience: "6 years",
    education: "PhD Statistics",
    resumeUrl: "#",
    coverLetter: "I am thrilled at the opportunity to contribute...",
    skills: ["Python", "Machine Learning", "TensorFlow", "SQL"],
  },
];

const statusConfig = {
  pending: { label: "Pending", color: "bg-muted text-muted-foreground", icon: Clock },
  under_review: { label: "Under Review", color: "bg-yellow-500/20 text-yellow-600", icon: Eye },
  shortlisted: { label: "Shortlisted", color: "bg-blue-500/20 text-blue-600", icon: TrendingUp },
  interview_scheduled: { label: "Interview Scheduled", color: "bg-purple-500/20 text-purple-600", icon: Calendar },
  hired: { label: "Hired", color: "bg-green-500/20 text-green-600", icon: CheckCircle },
  rejected: { label: "Rejected", color: "bg-destructive/20 text-destructive", icon: XCircle },
};

export default function CompanyApplications() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [jobFilter, setJobFilter] = useState("all");
  const [selectedApplication, setSelectedApplication] = useState<typeof mockApplications[0] | null>(null);

  const uniqueJobs = [...new Set(mockApplications.map((app) => app.jobTitle))];

  const filteredApplications = mockApplications.filter((app) => {
    const matchesSearch =
      app.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.candidateEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    const matchesJob = jobFilter === "all" || app.jobTitle === jobFilter;
    return matchesSearch && matchesStatus && matchesJob;
  });

  const stats = {
    total: mockApplications.length,
    underReview: mockApplications.filter((a) => a.status === "under_review").length,
    shortlisted: mockApplications.filter((a) => a.status === "shortlisted").length,
    hired: mockApplications.filter((a) => a.status === "hired").length,
  };

  const handleStatusChange = (applicationId: string, newStatus: string) => {
    console.log(`Updating application ${applicationId} to status: ${newStatus}`);
    // In real app, this would update the database
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Candidate Applications
          </h1>
          <p className="text-muted-foreground">
            Review and manage applications for your job postings
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-border/50">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total Applications</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-yellow-500/10">
                <Eye className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.underReview}</p>
                <p className="text-sm text-muted-foreground">Under Review</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-blue-500/10">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.shortlisted}</p>
                <p className="text-sm text-muted-foreground">Shortlisted</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-green-500/10">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.hired}</p>
                <p className="text-sm text-muted-foreground">Hired</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6 border-border/50">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or job title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="under_review">Under Review</SelectItem>
                  <SelectItem value="shortlisted">Shortlisted</SelectItem>
                  <SelectItem value="interview_scheduled">Interview Scheduled</SelectItem>
                  <SelectItem value="hired">Hired</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Select value={jobFilter} onValueChange={setJobFilter}>
                <SelectTrigger className="w-full md:w-56">
                  <Briefcase className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by job" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Jobs</SelectItem>
                  {uniqueJobs.map((job) => (
                    <SelectItem key={job} value={job}>
                      {job}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Applications Table */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">
              Applications ({filteredApplications.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Candidate</TableHead>
                    <TableHead>Job Position</TableHead>
                    <TableHead>Applied Date</TableHead>
                    <TableHead>Experience</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApplications.map((application) => {
                    const StatusIcon = statusConfig[application.status as keyof typeof statusConfig]?.icon || Clock;
                    return (
                      <TableRow key={application.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={application.candidateAvatar} />
                              <AvatarFallback className="bg-primary/10 text-primary">
                                {application.candidateName
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-foreground">
                                {application.candidateName}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {application.candidateEmail}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">{application.jobTitle}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-muted-foreground">
                            {new Date(application.appliedDate).toLocaleDateString()}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-muted-foreground">
                            {application.experience}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`${
                              statusConfig[application.status as keyof typeof statusConfig]?.color
                            } border-0 gap-1`}
                          >
                            <StatusIcon className="h-3 w-3" />
                            {statusConfig[application.status as keyof typeof statusConfig]?.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setSelectedApplication(application)}
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  View
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>Application Details</DialogTitle>
                                  <DialogDescription>
                                    Review candidate information and application
                                  </DialogDescription>
                                </DialogHeader>
                                {selectedApplication && (
                                  <div className="space-y-6 py-4">
                                    {/* Candidate Info */}
                                    <div className="flex items-start gap-4">
                                      <Avatar className="h-16 w-16">
                                        <AvatarImage src={selectedApplication.candidateAvatar} />
                                        <AvatarFallback className="bg-primary/10 text-primary text-xl">
                                          {selectedApplication.candidateName
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")}
                                        </AvatarFallback>
                                      </Avatar>
                                      <div className="flex-1">
                                        <h3 className="text-xl font-semibold text-foreground">
                                          {selectedApplication.candidateName}
                                        </h3>
                                        <p className="text-muted-foreground mb-2">
                                          Applying for: {selectedApplication.jobTitle}
                                        </p>
                                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                          <span className="flex items-center gap-1">
                                            <Mail className="h-4 w-4" />
                                            {selectedApplication.candidateEmail}
                                          </span>
                                          <span className="flex items-center gap-1">
                                            <Phone className="h-4 w-4" />
                                            {selectedApplication.candidatePhone}
                                          </span>
                                          <span className="flex items-center gap-1">
                                            <MapPin className="h-4 w-4" />
                                            {selectedApplication.candidateLocation}
                                          </span>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Details Grid */}
                                    <div className="grid grid-cols-2 gap-4">
                                      <div className="p-4 rounded-lg bg-muted/50">
                                        <p className="text-sm text-muted-foreground mb-1">
                                          Experience
                                        </p>
                                        <p className="font-medium text-foreground">
                                          {selectedApplication.experience}
                                        </p>
                                      </div>
                                      <div className="p-4 rounded-lg bg-muted/50">
                                        <p className="text-sm text-muted-foreground mb-1">
                                          Education
                                        </p>
                                        <p className="font-medium text-foreground">
                                          {selectedApplication.education}
                                        </p>
                                      </div>
                                    </div>

                                    {/* Skills */}
                                    <div>
                                      <h4 className="font-medium text-foreground mb-2">
                                        Skills
                                      </h4>
                                      <div className="flex flex-wrap gap-2">
                                        {selectedApplication.skills.map((skill) => (
                                          <Badge
                                            key={skill}
                                            variant="secondary"
                                            className="bg-primary/10 text-primary"
                                          >
                                            {skill}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>

                                    {/* Cover Letter */}
                                    <div>
                                      <h4 className="font-medium text-foreground mb-2">
                                        Cover Letter
                                      </h4>
                                      <p className="text-muted-foreground bg-muted/50 p-4 rounded-lg">
                                        {selectedApplication.coverLetter}
                                      </p>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-wrap gap-3 pt-4 border-t border-border">
                                      <Button variant="outline" className="gap-2">
                                        <Download className="h-4 w-4" />
                                        Download Resume
                                      </Button>
                                      <Button variant="outline" className="gap-2">
                                        <Mail className="h-4 w-4" />
                                        Send Email
                                      </Button>
                                      <Button variant="outline" className="gap-2">
                                        <Calendar className="h-4 w-4" />
                                        Schedule Interview
                                      </Button>
                                    </div>

                                    {/* Status Update */}
                                    <div className="pt-4 border-t border-border">
                                      <h4 className="font-medium text-foreground mb-3">
                                        Update Status
                                      </h4>
                                      <div className="flex flex-wrap gap-2">
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() =>
                                            handleStatusChange(selectedApplication.id, "shortlisted")
                                          }
                                          className="bg-blue-500/10 text-blue-600 border-blue-500/20 hover:bg-blue-500/20"
                                        >
                                          <TrendingUp className="h-4 w-4 mr-1" />
                                          Shortlist
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() =>
                                            handleStatusChange(
                                              selectedApplication.id,
                                              "interview_scheduled"
                                            )
                                          }
                                          className="bg-purple-500/10 text-purple-600 border-purple-500/20 hover:bg-purple-500/20"
                                        >
                                          <Calendar className="h-4 w-4 mr-1" />
                                          Schedule Interview
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() =>
                                            handleStatusChange(selectedApplication.id, "hired")
                                          }
                                          className="bg-green-500/10 text-green-600 border-green-500/20 hover:bg-green-500/20"
                                        >
                                          <CheckCircle className="h-4 w-4 mr-1" />
                                          Hire
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() =>
                                            handleStatusChange(selectedApplication.id, "rejected")
                                          }
                                          className="bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20"
                                        >
                                          <XCircle className="h-4 w-4 mr-1" />
                                          Reject
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {filteredApplications.length === 0 && (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  No applications found
                </h3>
                <p className="text-muted-foreground">
                  Try adjusting your filters or search query
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
