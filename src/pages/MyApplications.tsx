import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Search,
  Building2,
  MapPin,
  Calendar,
  Clock,
  Eye,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  LayoutGrid,
  List,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

interface Application {
  id: string;
  jobId: string;
  userId: number;
  cvPath: string;
  status: string;
  coverLetter: string | null;
  createdAt: string;
  job: {
    id: string;
    jobTitle: string;
    jobType: string;
    location: string;
    salaryRange: string;
    deadline: string | null;
    company: {
      companyId: number;
      companyName: string;
      profilePic: string | null;
    };
  };
}

const MyApplications = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<Application[]>([]);

  // Load applications
  useEffect(() => {
    async function loadApplications() {
      const token = localStorage.getItem("token");
      if (!token) {
        toast({
          title: "Authentication Required",
          description: "Please log in to view your applications",
          variant: "destructive",
        });
        navigate("/login", { state: { from: "/my-applications" } });
        return;
      }

      try {
        setLoading(true);
        const response = await api.get("/applications/my-applications");
        setApplications(response.data);
      } catch (error: any) {
        console.error("Failed to load applications:", error);

        if (error.response?.status === 401) {
          toast({
            title: "Session Expired",
            description: "Please log in again",
            variant: "destructive",
          });
          navigate("/login", { state: { from: "/my-applications" } });
        } else {
          toast({
            title: "Error",
            description:
              error?.response?.data?.message || "Failed to load applications",
            variant: "destructive",
          });
        }
      } finally {
        setLoading(false);
      }
    }

    loadApplications();
  }, [navigate, toast]);

  // Calculate status counts
  const statusCounts = {
    all: applications.length,
    APPLIED: applications.filter((a) => a.status === "APPLIED").length,
    REVIEWED: applications.filter((a) => a.status === "REVIEWED").length,
    SHORTLISTED: applications.filter((a) => a.status === "SHORTLISTED").length,
    ACCEPTED: applications.filter((a) => a.status === "ACCEPTED").length,
    REJECTED: applications.filter((a) => a.status === "REJECTED").length,
  };

  const statusFilters = [
    { value: "all", label: "All", count: statusCounts.all },
    { value: "APPLIED", label: "Applied", count: statusCounts.APPLIED },
    { value: "REVIEWED", label: "Reviewed", count: statusCounts.REVIEWED },
    {
      value: "SHORTLISTED",
      label: "Shortlisted",
      count: statusCounts.SHORTLISTED,
    },
    { value: "ACCEPTED", label: "Accepted", count: statusCounts.ACCEPTED },
    { value: "REJECTED", label: "Rejected", count: statusCounts.REJECTED },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPLIED":
        return (
          <Badge variant="info">
            <Clock className="w-3 h-3 mr-1" />
            Applied
          </Badge>
        );
      case "REVIEWED":
        return (
          <Badge variant="secondary">
            <Eye className="w-3 h-3 mr-1" />
            Reviewed
          </Badge>
        );
      case "SHORTLISTED":
        return (
          <Badge variant="success">
            <CheckCircle className="w-3 h-3 mr-1" />
            Shortlisted
          </Badge>
        );
      case "ACCEPTED":
        return (
          <Badge variant="primary">
            <CheckCircle className="w-3 h-3 mr-1" />
            Accepted
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge variant="destructive">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getTimeline = (status: string, appliedDate: string) => {
    const timeline = [{ step: "Applied", date: appliedDate, completed: true }];

    if (
      status === "REVIEWED" ||
      status === "SHORTLISTED" ||
      status === "ACCEPTED" ||
      status === "REJECTED"
    ) {
      timeline.push({ step: "Reviewed", date: appliedDate, completed: true });
    } else {
      timeline.push({ step: "Review", date: null, completed: false });
    }

    if (status === "SHORTLISTED" || status === "ACCEPTED") {
      timeline.push({
        step: "Shortlisted",
        date: appliedDate,
        completed: true,
      });
    } else if (status !== "REJECTED") {
      timeline.push({ step: "Shortlist", date: null, completed: false });
    }

    if (status === "ACCEPTED") {
      timeline.push({ step: "Accepted", date: appliedDate, completed: true });
    } else if (status === "REJECTED") {
      timeline.push({ step: "Rejected", date: appliedDate, completed: true });
    } else if (status === "SHORTLISTED") {
      timeline.push({ step: "Decision", date: null, completed: false });
    }

    return timeline;
  };

  const getCompanyInitials = (companyName: string) => {
    return companyName
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.job.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.job.company.companyName
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleWithdraw = async (applicationId: string, jobTitle: string) => {
    if (
      !confirm(
        `Are you sure you want to withdraw your application for "${jobTitle}"?`,
      )
    ) {
      return;
    }

    try {
      await api.delete(`/applications/${applicationId}`);

      toast({
        title: "Application Withdrawn",
        description: "Your application has been withdrawn successfully",
      });

      // Remove from local state
      setApplications((prev) => prev.filter((app) => app.id !== applicationId));
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error?.response?.data?.message || "Failed to withdraw application",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="bg-muted/30 min-h-screen py-8">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="ml-3 text-muted-foreground">
                Loading applications...
              </span>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="bg-muted/30 min-h-screen py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              My Applications
            </h1>
            <p className="text-muted-foreground">
              Track and manage your job applications
            </p>
          </div>

          {/* Filters */}
          <div className="bg-card rounded-xl p-4 shadow-sm mb-6">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              {/* Search */}
              <div className="relative w-full lg:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search applications..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Status Filters */}
              <div className="flex flex-wrap gap-2">
                {statusFilters.map((filter) => (
                  <Button
                    key={filter.value}
                    variant={
                      statusFilter === filter.value ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setStatusFilter(filter.value)}
                  >
                    {filter.label}
                    <span className="ml-1 text-xs">({filter.count})</span>
                  </Button>
                ))}
              </div>

              {/* View Toggle */}
              <div className="flex gap-1 bg-muted p-1 rounded-lg">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <LayoutGrid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Applications */}
          {filteredApplications.length > 0 ? (
            <div
              className={
                viewMode === "grid" ? "grid md:grid-cols-2 gap-6" : "space-y-4"
              }
            >
              {filteredApplications.map((application) => {
                const timeline = getTimeline(
                  application.status,
                  application.createdAt,
                );
                const companyInitials = getCompanyInitials(
                  application.job.company.companyName,
                );

                return (
                  <div
                    key={application.id}
                    className="bg-card rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center text-lg font-bold text-primary flex-shrink-0">
                        {application.job.company.profilePic ? (
                          <img
                            src={application.job.company.profilePic}
                            alt={application.job.company.companyName}
                            className="w-full h-full object-cover rounded-xl"
                          />
                        ) : (
                          companyInitials
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <Link
                              to={`/jobs/${application.job.id}`}
                              className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-1"
                            >
                              {application.job.jobTitle}
                            </Link>
                            <p className="text-sm text-muted-foreground">
                              {application.job.company.companyName}
                            </p>
                          </div>
                          {getStatusBadge(application.status)}
                        </div>

                        <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {application.job.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Applied: {formatDate(application.createdAt)}
                          </span>
                        </div>

                        <p className="text-primary font-semibold mt-2">
                          {application.job.salaryRange}
                        </p>

                        {/* Timeline */}
                        <div className="mt-4 pt-4 border-t border-border">
                          <div className="flex items-center gap-2">
                            {timeline.map((step, index) => (
                              <div key={index} className="flex items-center">
                                <div
                                  className={`w-2 h-2 rounded-full ${
                                    step.completed
                                      ? "bg-primary"
                                      : "bg-muted-foreground/30"
                                  }`}
                                />
                                {index < timeline.length - 1 && (
                                  <div
                                    className={`w-8 h-0.5 ${
                                      step.completed &&
                                      timeline[index + 1]?.completed
                                        ? "bg-primary"
                                        : "bg-muted-foreground/30"
                                    }`}
                                  />
                                )}
                              </div>
                            ))}
                          </div>
                          <div className="flex justify-between mt-1">
                            <span className="text-xs text-muted-foreground">
                              {timeline[0].step}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {timeline[timeline.length - 1].step}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 mt-4">
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/jobs/${application.job.id}`}>
                              <Eye className="w-4 h-4 mr-1" />
                              View Job
                            </Link>
                          </Button>
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/applications/${application.id}`}>
                              <FileText className="w-4 h-4 mr-1" />
                              View Application
                            </Link>
                          </Button>
                          {application.status === "APPLIED" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleWithdraw(
                                  application.id,
                                  application.job.jobTitle,
                                )
                              }
                              className="text-destructive hover:text-destructive"
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Withdraw
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-card rounded-xl p-12 text-center">
              <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No Applications Found
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery || statusFilter !== "all"
                  ? "Try adjusting your filters"
                  : "Start applying to jobs to track your applications here"}
              </p>
              <Button asChild>
                <Link to="/jobs">Browse Jobs</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default MyApplications;
