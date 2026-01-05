import { useState } from "react";
import { Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Building2,
  Briefcase,
  Users,
  FileText,
  Plus,
  Edit3,
  Trash2,
  Eye,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Video,
  MapPin,
  Mail,
  Phone,
  Globe,
  Save,
  X,
  Send,
  UserCheck,
  UserX,
} from "lucide-react";

const mockCompanyProfile = {
  name: "TechCorp Inc.",
  email: "hr@techcorp.com",
  phone: "+1 (555) 987-6543",
  website: "https://techcorp.com",
  location: "San Francisco, CA",
  industry: "Technology",
  size: "500-1000 employees",
  founded: "2015",
  description:
    "TechCorp is a leading technology company specializing in cloud solutions and enterprise software. We're committed to innovation and building tools that help businesses thrive.",
  benefits: ["Health Insurance", "401k", "Remote Work", "Stock Options", "Unlimited PTO"],
};

const mockJobs = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    type: "Full-time",
    location: "San Francisco, CA",
    salary: "$120k - $160k",
    applications: 45,
    status: "active",
    postedDate: "2024-01-10",
  },
  {
    id: "2",
    title: "Backend Engineer",
    type: "Full-time",
    location: "Remote",
    salary: "$130k - $170k",
    applications: 32,
    status: "active",
    postedDate: "2024-01-08",
  },
  {
    id: "3",
    title: "Product Manager",
    type: "Full-time",
    location: "New York, NY",
    salary: "$140k - $180k",
    applications: 28,
    status: "paused",
    postedDate: "2024-01-05",
  },
  {
    id: "4",
    title: "UX Designer",
    type: "Contract",
    location: "Remote",
    salary: "$80 - $100/hr",
    applications: 19,
    status: "closed",
    postedDate: "2024-01-01",
  },
];

const mockApplications = [
  {
    id: "1",
    candidateName: "John Doe",
    candidateEmail: "john@example.com",
    jobTitle: "Senior Frontend Developer",
    appliedDate: "2024-01-15",
    status: "under_review",
    resume: "john_doe_resume.pdf",
    experience: "5 years",
  },
  {
    id: "2",
    candidateName: "Jane Smith",
    candidateEmail: "jane@example.com",
    jobTitle: "Backend Engineer",
    appliedDate: "2024-01-14",
    status: "interview_scheduled",
    resume: "jane_smith_resume.pdf",
    experience: "7 years",
    interviewDate: "2024-01-20",
    interviewTime: "10:00 AM",
  },
  {
    id: "3",
    candidateName: "Mike Johnson",
    candidateEmail: "mike@example.com",
    jobTitle: "Senior Frontend Developer",
    appliedDate: "2024-01-13",
    status: "shortlisted",
    resume: "mike_johnson_resume.pdf",
    experience: "4 years",
  },
  {
    id: "4",
    candidateName: "Sarah Williams",
    candidateEmail: "sarah@example.com",
    jobTitle: "Product Manager",
    appliedDate: "2024-01-12",
    status: "rejected",
    resume: "sarah_williams_resume.pdf",
    experience: "3 years",
  },
];

const mockInterviews = [
  {
    id: "1",
    candidateName: "Jane Smith",
    jobTitle: "Backend Engineer",
    date: "2024-01-20",
    time: "10:00 AM",
    type: "Video Call",
    status: "scheduled",
    notes: "Technical interview with engineering team",
  },
  {
    id: "2",
    candidateName: "Alex Brown",
    jobTitle: "Senior Frontend Developer",
    date: "2024-01-21",
    time: "2:00 PM",
    type: "In-person",
    status: "scheduled",
    notes: "Final round with CTO",
  },
  {
    id: "3",
    candidateName: "Emily Davis",
    jobTitle: "Product Manager",
    date: "2024-01-18",
    time: "11:00 AM",
    type: "Video Call",
    status: "completed",
    notes: "First round screening",
  },
];

const getStatusBadge = (status: string) => {
  const statusConfig: Record<
    string,
    { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
  > = {
    under_review: { label: "Under Review", variant: "secondary" },
    shortlisted: { label: "Shortlisted", variant: "default" },
    interview_scheduled: { label: "Interview Scheduled", variant: "default" },
    offered: { label: "Offered", variant: "default" },
    rejected: { label: "Rejected", variant: "destructive" },
    active: { label: "Active", variant: "default" },
    paused: { label: "Paused", variant: "secondary" },
    closed: { label: "Closed", variant: "outline" },
    scheduled: { label: "Scheduled", variant: "default" },
    completed: { label: "Completed", variant: "secondary" },
  };

  const config = statusConfig[status] || { label: status, variant: "secondary" as const };

  return <Badge variant={config.variant}>{config.label}</Badge>;
};

export default function CompanyDashboard() {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profile, setProfile] = useState(mockCompanyProfile);
  const [editedProfile, setEditedProfile] = useState(mockCompanyProfile);
  const [isAddJobOpen, setIsAddJobOpen] = useState(false);
  const [isScheduleInterviewOpen, setIsScheduleInterviewOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<typeof mockApplications[0] | null>(null);

  const handleSaveProfile = () => {
    setProfile(editedProfile);
    setIsEditingProfile(false);
  };

  const handleCancelEdit = () => {
    setEditedProfile(profile);
    setIsEditingProfile(false);
  };

  const openScheduleInterview = (candidate: typeof mockApplications[0]) => {
    setSelectedCandidate(candidate);
    setIsScheduleInterviewOpen(true);
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Company Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Manage your jobs, applications, and company profile
            </p>
          </div>
          <Dialog open={isAddJobOpen} onOpenChange={setIsAddJobOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Post New Job
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Post a New Job</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Job Title</label>
                    <Input placeholder="e.g., Senior Developer" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Job Type</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full-time">Full-time</SelectItem>
                        <SelectItem value="part-time">Part-time</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                        <SelectItem value="internship">Internship</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Location</label>
                    <Input placeholder="e.g., San Francisco, CA" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Salary Range</label>
                    <Input placeholder="e.g., $100k - $150k" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Job Description</label>
                  <Textarea placeholder="Describe the role and responsibilities..." rows={4} />
                </div>
                <div>
                  <label className="text-sm font-medium">Requirements</label>
                  <Textarea placeholder="List the required skills and qualifications..." rows={3} />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsAddJobOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsAddJobOpen(false)}>Post Job</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Briefcase className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{mockJobs.length}</p>
                  <p className="text-sm text-muted-foreground">Active Jobs</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{mockApplications.length}</p>
                  <p className="text-sm text-muted-foreground">Applications</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-warning/10 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {mockInterviews.filter((i) => i.status === "scheduled").length}
                  </p>
                  <p className="text-sm text-muted-foreground">Scheduled Interviews</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-info/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-info" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {mockApplications.filter((a) => a.status === "shortlisted").length}
                  </p>
                  <p className="text-sm text-muted-foreground">Shortlisted</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="jobs" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-flex">
            <TabsTrigger value="jobs" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              <span className="hidden sm:inline">Jobs</span>
            </TabsTrigger>
            <TabsTrigger value="applications" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Applications</span>
            </TabsTrigger>
            <TabsTrigger value="interviews" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Interviews</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
          </TabsList>

          {/* Jobs Tab */}
          <TabsContent value="jobs">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Job Listings</CardTitle>
                <Button size="sm" onClick={() => setIsAddJobOpen(true)}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Job
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockJobs.map((job) => (
                    <div
                      key={job.id}
                      className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors gap-4"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-semibold text-foreground">{job.title}</h3>
                          {getStatusBadge(job.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {job.type} • {job.location} • {job.salary}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Posted: {job.postedDate} • {job.applications} applications
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit3 className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Applications Tab */}
          <TabsContent value="applications">
            <Card>
              <CardHeader>
                <CardTitle>Candidate Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockApplications.map((application) => (
                    <div
                      key={application.id}
                      className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold text-primary">
                          {application.candidateName.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">
                            {application.candidateName}
                          </h3>
                          <p className="text-sm text-muted-foreground">{application.jobTitle}</p>
                          <p className="text-xs text-muted-foreground">
                            {application.experience} experience • Applied: {application.appliedDate}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {getStatusBadge(application.status)}
                        <div className="flex gap-1">
                          <Button variant="outline" size="sm" title="View Resume">
                            <FileText className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            title="Schedule Interview"
                            onClick={() => openScheduleInterview(application)}
                          >
                            <Calendar className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="text-accent" title="Shortlist">
                            <UserCheck className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="text-destructive" title="Reject">
                            <UserX className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 text-center">
                  <Link to="/company/applications">
                    <Button variant="outline">View All Applications</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Schedule Interview Dialog */}
            <Dialog open={isScheduleInterviewOpen} onOpenChange={setIsScheduleInterviewOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Schedule Interview</DialogTitle>
                </DialogHeader>
                {selectedCandidate && (
                  <div className="space-y-4 py-4">
                    <p className="text-sm text-muted-foreground">
                      Scheduling interview with <strong>{selectedCandidate.candidateName}</strong>{" "}
                      for <strong>{selectedCandidate.jobTitle}</strong>
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Date</label>
                        <Input type="date" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Time</label>
                        <Input type="time" />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Interview Type</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="video">Video Call</SelectItem>
                          <SelectItem value="phone">Phone Call</SelectItem>
                          <SelectItem value="in-person">In-person</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Notes</label>
                      <Textarea placeholder="Add any notes for the interview..." rows={2} />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsScheduleInterviewOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={() => setIsScheduleInterviewOpen(false)}>
                        <Send className="h-4 w-4 mr-1" />
                        Send Invite
                      </Button>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </TabsContent>

          {/* Interviews Tab */}
          <TabsContent value="interviews">
            <Card>
              <CardHeader>
                <CardTitle>Scheduled Interviews</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockInterviews.map((interview) => (
                    <div
                      key={interview.id}
                      className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          {interview.type === "Video Call" ? (
                            <Video className="h-6 w-6 text-primary" />
                          ) : (
                            <Users className="h-6 w-6 text-primary" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">
                            {interview.candidateName}
                          </h3>
                          <p className="text-sm text-muted-foreground">{interview.jobTitle}</p>
                          <p className="text-xs text-muted-foreground mt-1">{interview.notes}</p>
                        </div>
                      </div>
                      <div className="flex flex-col md:items-end gap-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{interview.date}</span>
                          <Clock className="h-4 w-4 text-muted-foreground ml-2" />
                          <span className="text-sm">{interview.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(interview.status)}
                          <Badge variant="outline">{interview.type}</Badge>
                        </div>
                        {interview.status === "scheduled" && (
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              Reschedule
                            </Button>
                            <Button size="sm">
                              <Video className="h-4 w-4 mr-1" />
                              Join
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Company Profile</CardTitle>
                {isEditingProfile ? (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleCancelEdit}>
                      <X className="h-4 w-4 mr-1" />
                      Cancel
                    </Button>
                    <Button size="sm" onClick={handleSaveProfile}>
                      <Save className="h-4 w-4 mr-1" />
                      Save
                    </Button>
                  </div>
                ) : (
                  <Button variant="outline" size="sm" onClick={() => setIsEditingProfile(true)}>
                    <Edit3 className="h-4 w-4 mr-1" />
                    Edit Profile
                  </Button>
                )}
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Logo */}
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-24 w-24 rounded-xl bg-primary/10 flex items-center justify-center text-3xl font-bold text-primary">
                      {profile.name.charAt(0)}
                    </div>
                    {isEditingProfile && (
                      <Button variant="outline" size="sm">
                        Change Logo
                      </Button>
                    )}
                  </div>

                  {/* Basic Info */}
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Company Name
                      </label>
                      {isEditingProfile ? (
                        <Input
                          value={editedProfile.name}
                          onChange={(e) =>
                            setEditedProfile({ ...editedProfile, name: e.target.value })
                          }
                        />
                      ) : (
                        <p className="text-foreground flex items-center gap-2 mt-1">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          {profile.name}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Email</label>
                      {isEditingProfile ? (
                        <Input
                          type="email"
                          value={editedProfile.email}
                          onChange={(e) =>
                            setEditedProfile({ ...editedProfile, email: e.target.value })
                          }
                        />
                      ) : (
                        <p className="text-foreground flex items-center gap-2 mt-1">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          {profile.email}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Phone</label>
                      {isEditingProfile ? (
                        <Input
                          value={editedProfile.phone}
                          onChange={(e) =>
                            setEditedProfile({ ...editedProfile, phone: e.target.value })
                          }
                        />
                      ) : (
                        <p className="text-foreground flex items-center gap-2 mt-1">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          {profile.phone}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Website</label>
                      {isEditingProfile ? (
                        <Input
                          value={editedProfile.website}
                          onChange={(e) =>
                            setEditedProfile({ ...editedProfile, website: e.target.value })
                          }
                        />
                      ) : (
                        <p className="text-foreground flex items-center gap-2 mt-1">
                          <Globe className="h-4 w-4 text-muted-foreground" />
                          {profile.website}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Location</label>
                      {isEditingProfile ? (
                        <Input
                          value={editedProfile.location}
                          onChange={(e) =>
                            setEditedProfile({ ...editedProfile, location: e.target.value })
                          }
                        />
                      ) : (
                        <p className="text-foreground flex items-center gap-2 mt-1">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          {profile.location}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Industry</label>
                      {isEditingProfile ? (
                        <Input
                          value={editedProfile.industry}
                          onChange={(e) =>
                            setEditedProfile({ ...editedProfile, industry: e.target.value })
                          }
                        />
                      ) : (
                        <p className="text-foreground mt-1">{profile.industry}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Company Size
                      </label>
                      {isEditingProfile ? (
                        <Input
                          value={editedProfile.size}
                          onChange={(e) =>
                            setEditedProfile({ ...editedProfile, size: e.target.value })
                          }
                        />
                      ) : (
                        <p className="text-foreground mt-1">{profile.size}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Founded</label>
                      {isEditingProfile ? (
                        <Input
                          value={editedProfile.founded}
                          onChange={(e) =>
                            setEditedProfile({ ...editedProfile, founded: e.target.value })
                          }
                        />
                      ) : (
                        <p className="text-foreground mt-1">{profile.founded}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Company Description
                  </label>
                  {isEditingProfile ? (
                    <Textarea
                      value={editedProfile.description}
                      onChange={(e) =>
                        setEditedProfile({ ...editedProfile, description: e.target.value })
                      }
                      rows={3}
                    />
                  ) : (
                    <p className="text-foreground mt-1">{profile.description}</p>
                  )}
                </div>

                {/* Benefits */}
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    Benefits & Perks
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {profile.benefits.map((benefit) => (
                      <Badge key={benefit} variant="secondary">
                        {benefit}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
