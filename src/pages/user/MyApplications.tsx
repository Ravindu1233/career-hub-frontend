import { Link, useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  ExternalLink,
  Search,
  Video,
  Phone,
  MapPin as LocationIcon,
  Eye,
  ArrowLeft,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// =============================
// API Endpoints
// =============================
const API_MY_APPLICATIONS = "/applications/my-applications";
const API_MY_INTERVIEWS = "/interviews/my-interviews";

// =============================
// Backend Types
// =============================
type BackendCompany = {
  companyId: number;
  companyName: string;
  email: string;
  profilePic?: string | null;
  phone?: string | null;
};

type BackendJob = {
  id: string;
  jobTitle: string;
  location?: string | null;
  company?: BackendCompany | null;
};

type BackendApplication = {
  id: string;
  status: string;
  createdAt: string;
  job?: BackendJob | null;
};

type Interview = {
  id: string;
  interviewDate: string;
  interviewType: string;
  status: string;
  notes?: string | null;
  meetingLink?: string | null;
  application: {
    id: string;
    job: {
      id: string;
      jobTitle: string;
      company: {
        companyName: string;
        email: string;
        phone?: string | null;
      };
    };
  };
};

// =============================
// Status Utilities
// =============================
function normalizeStatus(status: string) {
  const s = (status || "").toUpperCase();
  if (s === "APPLIED") return "under_review";
  if (s === "UNDER_REVIEW") return "under_review";
  if (s === "INTERVIEW_SCHEDULED" || s === "INTERVIEW")
    return "interview_scheduled";
  if (s === "OFFERED") return "offered";
  if (s === "REJECTED") return "rejected";
  if (s === "ACCEPTED") return "accepted";
  return "other";
}

const getStatusBadge = (status: string) => {
  const statusConfig: Record<
    string,
    {
      label: string;
      variant: "default" | "secondary" | "destructive" | "outline";
      icon: typeof Clock;
    }
  > = {
    under_review: { label: "Under Review", variant: "secondary", icon: Clock },
    interview_scheduled: {
      label: "Interview Scheduled",
      variant: "default",
      icon: Calendar,
    },
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

function formatDate(iso?: string) {
  if (!iso) return "-";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString();
}

function formatDateTime(iso?: string) {
  if (!iso) return "-";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleString();
}

const getInterviewIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case "video":
      return Video;
    case "phone":
      return Phone;
    case "in-person":
      return LocationIcon;
    default:
      return Calendar;
  }
};

// =============================
// Main Component
// =============================
export default function MyApplications() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(
    null,
  );

  // Fetch applications
  const {
    data: applications,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["my-applications"],
    queryFn: async () => {
      const res = await api.get(API_MY_APPLICATIONS);
      return (res.data ?? []) as BackendApplication[];
    },
  });

  // Fetch interviews
  const { data: interviews } = useQuery({
    queryKey: ["my-interviews"],
    queryFn: async () => {
      const res = await api.get(API_MY_INTERVIEWS);
      return (res.data ?? []) as Interview[];
    },
  });

  const apps = applications ?? [];
  const interviewsList = interviews ?? [];

  // Filter applications
  const filteredApps = apps.filter((app) => {
    const jobTitle = app.job?.jobTitle?.toLowerCase() || "";
    const companyName = app.job?.company?.companyName?.toLowerCase() || "";
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      jobTitle.includes(query) || companyName.includes(query);

    const status = normalizeStatus(app.status);
    const matchesStatus = statusFilter === "all" || status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Stats - Updated to show Total, Pending, Interviews
  const stats = {
    total: apps.length,
    pending: apps.filter((a) => normalizeStatus(a.status) === "under_review")
      .length,
    interviews: apps.filter(
      (a) => normalizeStatus(a.status) === "interview_scheduled",
    ).length,
  };

  // Get interview for application
  const getInterviewForApplication = (applicationId: string) => {
    return interviewsList.find((i) => i.application.id === applicationId);
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            My Applications
          </h1>
          <Button
            variant="ghost"
            onClick={() => navigate("/user/dashboard")}
            className="gap-2 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <p className="text-muted-foreground mt-1">
            Track and manage all your job applications
          </p>

          {isLoading && (
            <p className="text-xs text-muted-foreground mt-2">Loading...</p>
          )}
          {isError && (
            <p className="text-xs text-destructive mt-2">
              Failed to load applications.
            </p>
          )}
        </div>

        {/* Stats Overview - Updated to 3 cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-sm text-muted-foreground">Total</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-warning/10 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.pending}</p>
                  <p className="text-sm text-muted-foreground">Pending</p>
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
                  <p className="text-2xl font-bold">{stats.interviews}</p>
                  <p className="text-sm text-muted-foreground">Interviews</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by job title or company..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={statusFilter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("all")}
                >
                  All
                </Button>
                <Button
                  variant={
                    statusFilter === "under_review" ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setStatusFilter("under_review")}
                >
                  <Clock className="h-4 w-4 mr-1" />
                  Review
                </Button>
                <Button
                  variant={
                    statusFilter === "interview_scheduled"
                      ? "default"
                      : "outline"
                  }
                  size="sm"
                  onClick={() => setStatusFilter("interview_scheduled")}
                >
                  <Calendar className="h-4 w-4 mr-1" />
                  Interview
                </Button>
                <Button
                  variant={statusFilter === "offered" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("offered")}
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Offered
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Applications List */}
        <Card>
          <CardHeader>
            <CardTitle>Applications ({filteredApps.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredApps.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  {apps.length === 0 ? (
                    <>
                      <p>No applications yet.</p>
                      <Link to="/jobs">
                        <Button variant="outline" className="mt-4">
                          Browse Jobs
                        </Button>
                      </Link>
                    </>
                  ) : (
                    <p>No applications match your filters.</p>
                  )}
                </div>
              ) : (
                filteredApps.map((a) => {
                  const jobTitle = a.job?.jobTitle ?? "Job";
                  const companyName = a.job?.company?.companyName ?? "Company";
                  const location = a.job?.location ?? "-";
                  const status = normalizeStatus(a.status);
                  const appliedDate = formatDate(a.createdAt);
                  const interview = getInterviewForApplication(a.id);

                  const companyLogoLetter = (companyName || "C")
                    .charAt(0)
                    .toUpperCase();

                  return (
                    <div
                      key={a.id}
                      className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-lg font-bold text-primary">
                          {companyLogoLetter}
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">
                            {jobTitle}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {companyName} • {location}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Applied: {appliedDate}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {getStatusBadge(status)}

                        {interview && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedInterview(interview)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Interview
                          </Button>
                        )}

                        {a.job?.id ? (
                          <Link to={`/jobs/${a.job.id}`}>
                            <Button variant="outline" size="sm">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </Link>
                        ) : (
                          <Button variant="outline" size="sm" disabled>
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>

        {/* Interview Details Modal */}
        <Dialog
          open={selectedInterview !== null}
          onOpenChange={() => setSelectedInterview(null)}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Interview Details</DialogTitle>
            </DialogHeader>

            {selectedInterview && (
              <div className="space-y-6">
                {/* Job Info */}
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    {selectedInterview.application.job.jobTitle}
                  </h3>
                  <p className="text-muted-foreground">
                    {selectedInterview.application.job.company.companyName}
                  </p>
                </div>

                {/* Interview Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Interview Date & Time
                    </label>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="h-4 w-4 text-primary" />
                      <p className="text-foreground">
                        {formatDateTime(selectedInterview.interviewDate)}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Interview Type
                    </label>
                    <div className="flex items-center gap-2 mt-1">
                      {(() => {
                        const Icon = getInterviewIcon(
                          selectedInterview.interviewType,
                        );
                        return <Icon className="h-4 w-4 text-primary" />;
                      })()}
                      <p className="text-foreground capitalize">
                        {selectedInterview.interviewType}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Status
                    </label>
                    <p className="text-foreground mt-1">
                      <Badge
                        variant={
                          selectedInterview.status === "SCHEDULED"
                            ? "default"
                            : selectedInterview.status === "COMPLETED"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {selectedInterview.status}
                      </Badge>
                    </p>
                  </div>

                  {selectedInterview.meetingLink && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Meeting Link
                      </label>
                      <a
                        href={selectedInterview.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline flex items-center gap-1 mt-1"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Join Meeting
                      </a>
                    </div>
                  )}
                </div>

                {/* Company Contact */}
                <div>
                  <label className="text-sm font-medium text-muted-foreground block mb-2">
                    Company Contact
                  </label>
                  <div className="space-y-1">
                    <p className="text-sm">
                      Email:{" "}
                      <a
                        href={`mailto:${selectedInterview.application.job.company.email}`}
                        className="text-primary hover:underline"
                      >
                        {selectedInterview.application.job.company.email}
                      </a>
                    </p>
                    {selectedInterview.application.job.company.phone && (
                      <p className="text-sm">
                        Phone:{" "}
                        <a
                          href={`tel:${selectedInterview.application.job.company.phone}`}
                          className="text-primary hover:underline"
                        >
                          {selectedInterview.application.job.company.phone}
                        </a>
                      </p>
                    )}
                  </div>
                </div>

                {/* Notes */}
                {selectedInterview.notes && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground block mb-2">
                      Notes
                    </label>
                    <p className="text-sm text-foreground bg-muted p-3 rounded-lg">
                      {selectedInterview.notes}
                    </p>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
