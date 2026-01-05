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
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Building2,
  GraduationCap,
  FileText,
  Edit3,
  Save,
  X,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  ExternalLink,
  BookmarkCheck,
  Settings,
  Bell,
  Plus,
} from "lucide-react";

const mockProfile = {
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+1 (555) 123-4567",
  location: "San Francisco, CA",
  bio: "Experienced software developer with 5+ years in React and TypeScript. Passionate about building scalable web applications.",
  skills: ["React", "TypeScript", "Node.js", "Python", "AWS", "Docker"],
  experience: "5 years",
  education: "B.S. Computer Science, Stanford University",
  resume: "john_doe_resume.pdf",
};

const mockApplications = [
  {
    id: "1",
    jobTitle: "Senior Frontend Developer",
    company: "TechCorp Inc.",
    companyLogo: "T",
    status: "under_review",
    appliedDate: "2024-01-15",
    location: "San Francisco, CA",
  },
  {
    id: "2",
    jobTitle: "Full Stack Engineer",
    company: "InnovateTech",
    companyLogo: "I",
    status: "interview_scheduled",
    appliedDate: "2024-01-10",
    location: "Remote",
    interviewDate: "2024-01-25",
  },
  {
    id: "3",
    jobTitle: "React Developer",
    company: "StartupXYZ",
    companyLogo: "S",
    status: "rejected",
    appliedDate: "2024-01-05",
    location: "New York, NY",
  },
  {
    id: "4",
    jobTitle: "Software Engineer",
    company: "MegaSoft",
    companyLogo: "M",
    status: "offered",
    appliedDate: "2024-01-01",
    location: "Seattle, WA",
  },
];

const mockSavedJobs = [
  {
    id: "1",
    title: "Product Manager",
    company: "Google",
    location: "Mountain View, CA",
    salary: "$150k - $200k",
  },
  {
    id: "2",
    title: "UX Designer",
    company: "Apple",
    location: "Cupertino, CA",
    salary: "$120k - $160k",
  },
  {
    id: "3",
    title: "Data Scientist",
    company: "Meta",
    location: "Remote",
    salary: "$140k - $180k",
  },
];

const mockSavedCompanies = [
  { id: "1", name: "TechCorp Inc.", industry: "Technology", jobs: 24 },
  { id: "2", name: "InnovateTech", industry: "Software", jobs: 12 },
  { id: "3", name: "StartupXYZ", industry: "Fintech", jobs: 8 },
];

const getStatusBadge = (status: string) => {
  const statusConfig: Record<
    string,
    { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon: typeof Clock }
  > = {
    under_review: { label: "Under Review", variant: "secondary", icon: Clock },
    interview_scheduled: { label: "Interview Scheduled", variant: "default", icon: Calendar },
    offered: { label: "Offered", variant: "default", icon: CheckCircle },
    rejected: { label: "Rejected", variant: "destructive", icon: XCircle },
    accepted: { label: "Accepted", variant: "default", icon: CheckCircle },
  };

  const config = statusConfig[status] || statusConfig.under_review;
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className="flex items-center gap-1">
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
};

export default function UserDashboard() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(mockProfile);
  const [editedProfile, setEditedProfile] = useState(mockProfile);
  const [newSkill, setNewSkill] = useState("");

  const handleSave = () => {
    setProfile(editedProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const addSkill = () => {
    if (newSkill.trim() && !editedProfile.skills.includes(newSkill.trim())) {
      setEditedProfile({
        ...editedProfile,
        skills: [...editedProfile.skills, newSkill.trim()],
      });
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setEditedProfile({
      ...editedProfile,
      skills: editedProfile.skills.filter((s) => s !== skill),
    });
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Manage your profile, applications, and saved items
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
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
                  <p className="text-2xl font-bold">{mockApplications.length}</p>
                  <p className="text-sm text-muted-foreground">Applications</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {mockApplications.filter((a) => a.status === "interview_scheduled").length}
                  </p>
                  <p className="text-sm text-muted-foreground">Interviews</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-warning/10 flex items-center justify-center">
                  <BookmarkCheck className="h-6 w-6 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{mockSavedJobs.length}</p>
                  <p className="text-sm text-muted-foreground">Saved Jobs</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-info/10 flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-info" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{mockSavedCompanies.length}</p>
                  <p className="text-sm text-muted-foreground">Followed Companies</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-flex">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="applications" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Applications</span>
            </TabsTrigger>
            <TabsTrigger value="saved" className="flex items-center gap-2">
              <BookmarkCheck className="h-4 w-4" />
              <span className="hidden sm:inline">Saved</span>
            </TabsTrigger>
            <TabsTrigger value="browse" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              <span className="hidden sm:inline">Browse</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Profile Information</CardTitle>
                {isEditing ? (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleCancel}>
                      <X className="h-4 w-4 mr-1" />
                      Cancel
                    </Button>
                    <Button size="sm" onClick={handleSave}>
                      <Save className="h-4 w-4 mr-1" />
                      Save
                    </Button>
                  </div>
                ) : (
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                    <Edit3 className="h-4 w-4 mr-1" />
                    Edit Profile
                  </Button>
                )}
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Avatar */}
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-3xl font-bold text-primary">
                      {profile.name.charAt(0)}
                    </div>
                    {isEditing && (
                      <Button variant="outline" size="sm">
                        Change Photo
                      </Button>
                    )}
                  </div>

                  {/* Basic Info */}
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Full Name
                      </label>
                      {isEditing ? (
                        <Input
                          value={editedProfile.name}
                          onChange={(e) =>
                            setEditedProfile({ ...editedProfile, name: e.target.value })
                          }
                        />
                      ) : (
                        <p className="text-foreground flex items-center gap-2 mt-1">
                          <User className="h-4 w-4 text-muted-foreground" />
                          {profile.name}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Email</label>
                      {isEditing ? (
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
                      {isEditing ? (
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
                      <label className="text-sm font-medium text-muted-foreground">Location</label>
                      {isEditing ? (
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
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Bio</label>
                  {isEditing ? (
                    <Textarea
                      value={editedProfile.bio}
                      onChange={(e) =>
                        setEditedProfile({ ...editedProfile, bio: e.target.value })
                      }
                      rows={3}
                    />
                  ) : (
                    <p className="text-foreground mt-1">{profile.bio}</p>
                  )}
                </div>

                {/* Skills */}
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    Skills
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {(isEditing ? editedProfile : profile).skills.map((skill) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className={isEditing ? "pr-1" : ""}
                      >
                        {skill}
                        {isEditing && (
                          <button
                            onClick={() => removeSkill(skill)}
                            className="ml-1 hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        )}
                      </Badge>
                    ))}
                    {isEditing && (
                      <div className="flex gap-1">
                        <Input
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          placeholder="Add skill"
                          className="w-32 h-6 text-sm"
                          onKeyDown={(e) => e.key === "Enter" && addSkill()}
                        />
                        <Button size="sm" variant="ghost" onClick={addSkill} className="h-6 w-6 p-0">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Experience & Education */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Experience
                    </label>
                    {isEditing ? (
                      <Input
                        value={editedProfile.experience}
                        onChange={(e) =>
                          setEditedProfile({ ...editedProfile, experience: e.target.value })
                        }
                      />
                    ) : (
                      <p className="text-foreground flex items-center gap-2 mt-1">
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                        {profile.experience}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Education</label>
                    {isEditing ? (
                      <Input
                        value={editedProfile.education}
                        onChange={(e) =>
                          setEditedProfile({ ...editedProfile, education: e.target.value })
                        }
                      />
                    ) : (
                      <p className="text-foreground flex items-center gap-2 mt-1">
                        <GraduationCap className="h-4 w-4 text-muted-foreground" />
                        {profile.education}
                      </p>
                    )}
                  </div>
                </div>

                {/* Resume */}
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Resume</label>
                  <div className="flex items-center gap-3 mt-1">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <span className="text-foreground">{profile.resume}</span>
                    {isEditing && (
                      <Button variant="outline" size="sm">
                        Upload New
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Applications Tab */}
          <TabsContent value="applications">
            <Card>
              <CardHeader>
                <CardTitle>My Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockApplications.map((application) => (
                    <div
                      key={application.id}
                      className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-lg font-bold text-primary">
                          {application.companyLogo}
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">
                            {application.jobTitle}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {application.company} • {application.location}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Applied: {application.appliedDate}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {getStatusBadge(application.status)}
                        <Link to={`/jobs/${application.id}`}>
                          <Button variant="outline" size="sm">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 text-center">
                  <Link to="/my-applications">
                    <Button variant="outline">View All Applications</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Saved Tab */}
          <TabsContent value="saved">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Saved Jobs */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    Saved Jobs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockSavedJobs.map((job) => (
                      <div
                        key={job.id}
                        className="p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                      >
                        <h4 className="font-medium text-foreground">{job.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {job.company} • {job.location}
                        </p>
                        <p className="text-sm font-medium text-primary mt-1">{job.salary}</p>
                      </div>
                    ))}
                  </div>
                  <Link to="/jobs" className="block mt-4">
                    <Button variant="outline" className="w-full">
                      Browse More Jobs
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Followed Companies */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Followed Companies
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockSavedCompanies.map((company) => (
                      <div
                        key={company.id}
                        className="p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                      >
                        <h4 className="font-medium text-foreground">{company.name}</h4>
                        <p className="text-sm text-muted-foreground">{company.industry}</p>
                        <p className="text-sm text-primary mt-1">{company.jobs} open positions</p>
                      </div>
                    ))}
                  </div>
                  <Link to="/companies" className="block mt-4">
                    <Button variant="outline" className="w-full">
                      Explore Companies
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Browse Tab */}
          <TabsContent value="browse">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="card-hover">
                <CardContent className="pt-6 text-center">
                  <div className="h-16 w-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4">
                    <Briefcase className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Browse Jobs</h3>
                  <p className="text-muted-foreground mb-4">
                    Explore thousands of job opportunities
                  </p>
                  <Link to="/jobs">
                    <Button className="w-full">View Jobs</Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="card-hover">
                <CardContent className="pt-6 text-center">
                  <div className="h-16 w-16 rounded-2xl gradient-accent flex items-center justify-center mx-auto mb-4">
                    <Building2 className="h-8 w-8 text-accent-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Companies</h3>
                  <p className="text-muted-foreground mb-4">
                    Discover top employers in your field
                  </p>
                  <Link to="/companies">
                    <Button variant="outline" className="w-full">View Companies</Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="card-hover">
                <CardContent className="pt-6 text-center">
                  <div className="h-16 w-16 rounded-2xl gradient-warm flex items-center justify-center mx-auto mb-4">
                    <GraduationCap className="h-8 w-8 text-warning-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Institutions</h3>
                  <p className="text-muted-foreground mb-4">
                    Find courses and training programs
                  </p>
                  <Link to="/institutions">
                    <Button variant="outline" className="w-full">View Institutions</Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
