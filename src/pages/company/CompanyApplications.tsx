import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  Send,
} from "lucide-react";
import { toast } from "sonner";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

type ApplicationFromAPI = {
  id: string;
  jobId: string;
  userId: number;
  cvPath: string;
  coverLetter: string | null;
  status: string;
  createdAt: string;
  job: {
    id: string;
    jobTitle: string;
    jobType: string;
  };
  user: {
    userId: number;
    firstName: string;
    lastName: string;
    email: string;
    profilePic: string | null;
    mobile: string | null;
    bio: string | null;
    skills: string[];
    schools: string | null;
    certifications: string[];
    olPassCount: number | null;
  };
};

function toPublicResumeUrl(cvPath?: string | null) {
  if (!cvPath) return "";

  if (/^https?:\/\//i.test(cvPath)) return cvPath;

  const normalized = cvPath.replace(/\\/g, "/");
  const lower = normalized.toLowerCase();

  const withLeadingUploads = lower.indexOf("/uploads/");
  if (withLeadingUploads >= 0) {
    return `${API_BASE}${normalized.slice(withLeadingUploads)}`;
  }

  const withoutLeadingUploads = lower.indexOf("uploads/");
  if (withoutLeadingUploads >= 0) {
    return `${API_BASE}/${normalized.slice(withoutLeadingUploads)}`;
  }

  const fileName = normalized.split("/").filter(Boolean).pop();
  return fileName ? `${API_BASE}/uploads/cvs/${fileName}` : "";
}

const statusConfig = {
  PENDING: {
    label: "Pending",
    color: "bg-muted text-muted-foreground",
    icon: Clock,
  },
  SHORTLISTED: {
    label: "Shortlisted",
    color: "bg-blue-500/20 text-blue-600",
    icon: TrendingUp,
  },
  INTERVIEW_SCHEDULED: {
    label: "Interview Scheduled",
    color: "bg-purple-500/20 text-purple-600",
    icon: Calendar,
  },
  REJECTED: {
    label: "Rejected",
    color: "bg-destructive/20 text-destructive",
    icon: XCircle,
  },
};

export default function CompanyApplications() {
  const [applications, setApplications] = useState<ApplicationFromAPI[]>([]);
  const [loadingApplications, setLoadingApplications] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [jobFilter, setJobFilter] = useState("all");
  const [selectedApplication, setSelectedApplication] =
    useState<ApplicationFromAPI | null>(null);

  // ✅ Interview scheduling state
  const [isScheduleInterviewOpen, setIsScheduleInterviewOpen] = useState(false);
  const [interviewData, setInterviewData] = useState({
    interviewDate: "",
    interviewTime: "",
    interviewType: "",
    notes: "",
    meetingLink: "",
  });
  const [schedulingInterview, setSchedulingInterview] = useState(false);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    setLoadingApplications(true);
    setError(null);
    try {
      const res = await api.get("/applications/company/all");
      setApplications(res.data);
    } catch (e: any) {
      setError(e?.response?.data?.message || "Failed to load applications");
      toast.error("Failed to load applications");
    } finally {
      setLoadingApplications(false);
    }
  };

  const handleStatusChange = async (
    applicationId: string,
    newStatus: string,
  ) => {
    try {
      await api.patch(`/applications/${applicationId}/status`, {
        status: newStatus,
      });
      toast.success("Application status updated successfully");
      loadApplications();
      if (selectedApplication?.id === applicationId) {
        setSelectedApplication({
          ...selectedApplication,
          status: newStatus,
        });
      }
    } catch (e: any) {
      const errorMsg = e?.response?.data?.message || "Failed to update status";
      setError(errorMsg);
      toast.error(errorMsg);
    }
  };

  // ✅ Handle interview scheduling - Updated to use /interviews endpoint
  const handleScheduleInterview = async () => {
    if (!selectedApplication) return;
    if (String(selectedApplication.status || "").toUpperCase() !== "SHORTLISTED") {
      toast.error("Interview can only be scheduled for shortlisted candidates");
      return;
    }

    // Validation
    if (!interviewData.interviewDate || !interviewData.interviewTime) {
      toast.error("Please select date and time");
      return;
    }
    if (!interviewData.interviewType) {
      toast.error("Please select interview type");
      return;
    }

    setSchedulingInterview(true);
    try {
      // Combine date and time into ISO string
      const dateTimeString = `${interviewData.interviewDate}T${interviewData.interviewTime}:00`;

      // ✅ Use the interviews endpoint
      await api.post(`/interviews/application/${selectedApplication.id}`, {
        interviewDate: dateTimeString,
        interviewType: interviewData.interviewType,
        notes: interviewData.notes || undefined,
        meetingLink: interviewData.meetingLink || undefined,
      });

      toast.success("Interview scheduled successfully!");
      setIsScheduleInterviewOpen(false);

      // Reset form
      setInterviewData({
        interviewDate: "",
        interviewTime: "",
        interviewType: "",
        notes: "",
        meetingLink: "",
      });

      // Reload applications to get updated status
      loadApplications();
    } catch (e: any) {
      const errorMsg =
        e?.response?.data?.message || "Failed to schedule interview";
      toast.error(errorMsg);
    } finally {
      setSchedulingInterview(false);
    }
  };

  // Get unique jobs for filter
  const uniqueJobs = [...new Set(applications.map((app) => app.job.jobTitle))];

  // Filter applications
  const filteredApplications = applications.filter((app) => {
    const candidateName = `${app.user.firstName} ${app.user.lastName}`;
    const matchesSearch =
      candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.job.jobTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    const matchesJob = jobFilter === "all" || app.job.jobTitle === jobFilter;
    return matchesSearch && matchesStatus && matchesJob;
  });

  // Calculate stats
  const stats = {
    total: applications.length,
    pending: applications.filter((a) => a.status === "PENDING").length,
    shortlisted: applications.filter((a) => a.status === "SHORTLISTED").length,
    interviewed: applications.filter((a) => a.status === "INTERVIEW_SCHEDULED")
      .length,
  };

  const openResume = (cvPath?: string | null) => {
    const resumeUrl = toPublicResumeUrl(cvPath);
    if (!resumeUrl) {
      toast.error("Resume file path is not available");
      return;
    }
    window.open(resumeUrl, "_blank", "noopener,noreferrer");
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
                <p className="text-2xl font-bold text-foreground">
                  {stats.total}
                </p>
                <p className="text-sm text-muted-foreground">
                  Total Applications
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-yellow-500/10">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {stats.pending}
                </p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-blue-500/10">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {stats.shortlisted}
                </p>
                <p className="text-sm text-muted-foreground">Shortlisted</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-purple-500/10">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {stats.interviewed}
                </p>
                <p className="text-sm text-muted-foreground">Interviewed</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {error && (
          <div className="mb-4 p-3 border border-destructive/30 rounded-md bg-destructive/10">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

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
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="SHORTLISTED">Shortlisted</SelectItem>
                  <SelectItem value="INTERVIEW_SCHEDULED">
                    Interview Scheduled
                  </SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
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
            {loadingApplications ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading applications...</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Candidate</TableHead>
                        <TableHead>Job Position</TableHead>
                        <TableHead>Applied Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredApplications.map((application) => {
                        const StatusIcon =
                          statusConfig[
                            application.status as keyof typeof statusConfig
                          ]?.icon || Clock;
                        return (
                          <TableRow key={application.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                  <AvatarImage
                                    src={application.user.profilePic || ""}
                                  />
                                  <AvatarFallback className="bg-primary/10 text-primary">
                                    {application.user.firstName.charAt(0)}
                                    {application.user.lastName.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium text-foreground">
                                    {application.user.firstName}{" "}
                                    {application.user.lastName}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {application.user.email}
                                  </p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="font-medium">
                                {application.job.jobTitle}
                              </span>
                            </TableCell>
                            <TableCell>
                              <span className="text-muted-foreground">
                                {new Date(
                                  application.createdAt,
                                ).toLocaleDateString()}
                              </span>
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={`${
                                  statusConfig[
                                    application.status as keyof typeof statusConfig
                                  ]?.color
                                } border-0 gap-1`}
                              >
                                <StatusIcon className="h-3 w-3" />
                                {
                                  statusConfig[
                                    application.status as keyof typeof statusConfig
                                  ]?.label
                                }
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() =>
                                        setSelectedApplication(application)
                                      }
                                    >
                                      <Eye className="h-4 w-4 mr-1" />
                                      View
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                    <DialogHeader>
                                      <DialogTitle>
                                        Application Details
                                      </DialogTitle>
                                      <DialogDescription>
                                        Review candidate information and
                                        application
                                      </DialogDescription>
                                    </DialogHeader>
                                    {selectedApplication && (
                                      <div className="space-y-6 py-4">
                                        {/* Candidate Info */}
                                        <div className="flex items-start gap-4">
                                          <Avatar className="h-16 w-16">
                                            <AvatarImage
                                              src={
                                                selectedApplication.user
                                                  .profilePic || ""
                                              }
                                            />
                                            <AvatarFallback className="bg-primary/10 text-primary text-xl">
                                              {selectedApplication.user.firstName.charAt(
                                                0,
                                              )}
                                              {selectedApplication.user.lastName.charAt(
                                                0,
                                              )}
                                            </AvatarFallback>
                                          </Avatar>
                                          <div className="flex-1">
                                            <h3 className="text-xl font-semibold text-foreground">
                                              {
                                                selectedApplication.user
                                                  .firstName
                                              }{" "}
                                              {
                                                selectedApplication.user
                                                  .lastName
                                              }
                                            </h3>
                                            <p className="text-muted-foreground mb-2">
                                              Applying for:{" "}
                                              {selectedApplication.job.jobTitle}
                                            </p>
                                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                              <span className="flex items-center gap-1">
                                                <Mail className="h-4 w-4" />
                                                {selectedApplication.user.email}
                                              </span>
                                              {selectedApplication.user
                                                .mobile && (
                                                <span className="flex items-center gap-1">
                                                  <Phone className="h-4 w-4" />
                                                  {
                                                    selectedApplication.user
                                                      .mobile
                                                  }
                                                </span>
                                              )}
                                            </div>
                                          </div>
                                        </div>

                                        {/* Bio */}
                                        {selectedApplication.user.bio && (
                                          <div>
                                            <h4 className="font-medium text-foreground mb-2">
                                              Bio
                                            </h4>
                                            <p className="text-muted-foreground bg-muted/50 p-4 rounded-lg">
                                              {selectedApplication.user.bio}
                                            </p>
                                          </div>
                                        )}

                                        {/* Skills */}
                                        {selectedApplication.user.skills &&
                                          selectedApplication.user.skills
                                            .length > 0 && (
                                            <div>
                                              <h4 className="font-medium text-foreground mb-2">
                                                Skills
                                              </h4>
                                              <div className="flex flex-wrap gap-2">
                                                {selectedApplication.user.skills.map(
                                                  (skill, idx) => (
                                                    <Badge
                                                      key={idx}
                                                      variant="secondary"
                                                      className="bg-primary/10 text-primary"
                                                    >
                                                      {skill}
                                                    </Badge>
                                                  ),
                                                )}
                                              </div>
                                            </div>
                                          )}

                                        {/* Education */}
                                        {selectedApplication.user.schools && (
                                          <div className="p-4 rounded-lg bg-muted/50">
                                            <p className="text-sm text-muted-foreground mb-1">
                                              Education
                                            </p>
                                            <p className="font-medium text-foreground">
                                              {selectedApplication.user.schools}
                                            </p>
                                          </div>
                                        )}

                                        {/* Certifications */}
                                        {selectedApplication.user
                                          .certifications &&
                                          selectedApplication.user
                                            .certifications.length > 0 && (
                                            <div>
                                              <h4 className="font-medium text-foreground mb-2">
                                                Certifications
                                              </h4>
                                              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                                                {selectedApplication.user.certifications.map(
                                                  (cert, idx) => (
                                                    <li key={idx}>{cert}</li>
                                                  ),
                                                )}
                                              </ul>
                                            </div>
                                          )}

                                        {/* Cover Letter */}
                                        {selectedApplication.coverLetter && (
                                          <div>
                                            <h4 className="font-medium text-foreground mb-2">
                                              Cover Letter
                                            </h4>
                                            <p className="text-muted-foreground bg-muted/50 p-4 rounded-lg whitespace-pre-wrap">
                                              {selectedApplication.coverLetter}
                                            </p>
                                          </div>
                                        )}

                                        {/* Actions */}
                                        <div className="flex flex-wrap gap-3 pt-4 border-t border-border">
                                          <Button
                                            variant="outline"
                                            className="gap-2"
                                            onClick={() =>
                                              openResume(
                                                selectedApplication.cvPath,
                                              )
                                            }
                                          >
                                            <Download className="h-4 w-4" />
                                            Download Resume
                                          </Button>
                                          <Button
                                            variant="outline"
                                            className="gap-2"
                                            onClick={() => {
                                              window.location.href = `mailto:${selectedApplication.user.email}`;
                                            }}
                                          >
                                            <Mail className="h-4 w-4" />
                                            Send Email
                                          </Button>
                                          <Button
                                            variant="outline"
                                            className="gap-2"
                                            onClick={() => setIsScheduleInterviewOpen(true)}
                                            disabled={
                                              String(
                                                selectedApplication.status || "",
                                              ).toUpperCase() !== "SHORTLISTED"
                                            }
                                          >
                                            <Calendar className="h-4 w-4" />
                                            Schedule Interview
                                          </Button>
                                        </div>
                                        {String(
                                          selectedApplication.status || "",
                                        ).toUpperCase() !== "SHORTLISTED" && (
                                          <p className="text-sm text-muted-foreground">
                                            Interview scheduling is available only for shortlisted candidates.
                                          </p>
                                        )}

                                        {/* Status Update */}
                                        <div className="pt-4 border-t border-border">
                                          <h4 className="font-medium text-foreground mb-3">
                                            Update Status
                                          </h4>
                                          {String(
                                            selectedApplication.status || "",
                                          ).toUpperCase() === "PENDING" ? (
                                            <div className="flex flex-wrap gap-2">
                                              <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() =>
                                                  handleStatusChange(
                                                    selectedApplication.id,
                                                    "SHORTLISTED",
                                                  )
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
                                                    "REJECTED",
                                                  )
                                                }
                                                className="bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20"
                                              >
                                                <XCircle className="h-4 w-4 mr-1" />
                                                Reject
                                              </Button>
                                            </div>
                                          ) : (
                                            <p className="text-sm text-muted-foreground">
                                              Status already updated to{" "}
                                              <span className="font-medium">
                                                {selectedApplication.status}
                                              </span>
                                              .
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                    )}
                                  </DialogContent>
                                </Dialog>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => openResume(application.cvPath)}
                                >
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

                {filteredApplications.length === 0 && !loadingApplications && (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">
                      No applications found
                    </h3>
                    <p className="text-muted-foreground">
                      {applications.length === 0
                        ? "No applications received yet"
                        : "Try adjusting your filters or search query"}
                    </p>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* ✅ Schedule Interview Dialog */}
        <Dialog
          open={isScheduleInterviewOpen}
          onOpenChange={setIsScheduleInterviewOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Schedule Interview</DialogTitle>
              <DialogDescription>
                Schedule an interview with the candidate
              </DialogDescription>
            </DialogHeader>
            {selectedApplication && (
              <div className="space-y-4 py-4">
                <p className="text-sm text-muted-foreground">
                  Scheduling interview with{" "}
                  <strong>
                    {selectedApplication.user.firstName}{" "}
                    {selectedApplication.user.lastName}
                  </strong>{" "}
                  for <strong>{selectedApplication.job.jobTitle}</strong>
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Date</label>
                    <Input
                      type="date"
                      value={interviewData.interviewDate}
                      onChange={(e) =>
                        setInterviewData({
                          ...interviewData,
                          interviewDate: e.target.value,
                        })
                      }
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Time</label>
                    <Input
                      type="time"
                      value={interviewData.interviewTime}
                      onChange={(e) =>
                        setInterviewData({
                          ...interviewData,
                          interviewTime: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Interview Type</label>
                  <Select
                    value={interviewData.interviewType}
                    onValueChange={(value) =>
                      setInterviewData({
                        ...interviewData,
                        interviewType: value,
                      })
                    }
                  >
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

                {interviewData.interviewType === "video" && (
                  <div>
                    <label className="text-sm font-medium">
                      Meeting Link (Optional)
                    </label>
                    <Input
                      placeholder="https://meet.google.com/..."
                      value={interviewData.meetingLink}
                      onChange={(e) =>
                        setInterviewData({
                          ...interviewData,
                          meetingLink: e.target.value,
                        })
                      }
                    />
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium">
                    Notes (Optional)
                  </label>
                  <Textarea
                    placeholder="Add any notes for the interview..."
                    rows={3}
                    value={interviewData.notes}
                    onChange={(e) =>
                      setInterviewData({
                        ...interviewData,
                        notes: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsScheduleInterviewOpen(false);
                      setInterviewData({
                        interviewDate: "",
                        interviewTime: "",
                        interviewType: "",
                        notes: "",
                        meetingLink: "",
                      });
                    }}
                    disabled={schedulingInterview}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleScheduleInterview}
                    disabled={schedulingInterview}
                  >
                    {schedulingInterview ? (
                      <>Scheduling...</>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-1" />
                        Schedule Interview
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
