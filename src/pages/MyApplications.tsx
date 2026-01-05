import { useState } from "react";
import { Link } from "react-router-dom";
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
  List
} from "lucide-react";

const MyApplications = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Mock applications data
  const applications = [
    {
      id: "1",
      jobTitle: "Senior Frontend Developer",
      company: "TechCorp Inc.",
      companyLogo: "TC",
      location: "New York, NY",
      appliedDate: "Jan 2, 2026",
      status: "shortlisted",
      salary: "$120,000 - $150,000",
      timeline: [
        { step: "Applied", date: "Jan 2, 2026", completed: true },
        { step: "Viewed", date: "Jan 3, 2026", completed: true },
        { step: "Shortlisted", date: "Jan 4, 2026", completed: true },
        { step: "Interview", date: null, completed: false }
      ]
    },
    {
      id: "2",
      jobTitle: "Product Designer",
      company: "DesignHub",
      companyLogo: "DH",
      location: "Remote",
      appliedDate: "Dec 28, 2025",
      status: "interview",
      salary: "$90,000 - $120,000",
      timeline: [
        { step: "Applied", date: "Dec 28, 2025", completed: true },
        { step: "Viewed", date: "Dec 29, 2025", completed: true },
        { step: "Shortlisted", date: "Dec 30, 2025", completed: true },
        { step: "Interview", date: "Jan 8, 2026", completed: true }
      ]
    },
    {
      id: "3",
      jobTitle: "Backend Engineer",
      company: "DataFlow",
      companyLogo: "DF",
      location: "San Francisco, CA",
      appliedDate: "Dec 20, 2025",
      status: "rejected",
      salary: "$130,000 - $160,000",
      timeline: [
        { step: "Applied", date: "Dec 20, 2025", completed: true },
        { step: "Viewed", date: "Dec 21, 2025", completed: true },
        { step: "Rejected", date: "Dec 25, 2025", completed: true }
      ]
    },
    {
      id: "4",
      jobTitle: "Marketing Manager",
      company: "GrowthLabs",
      companyLogo: "GL",
      location: "Boston, MA",
      appliedDate: "Jan 1, 2026",
      status: "applied",
      salary: "$85,000 - $100,000",
      timeline: [
        { step: "Applied", date: "Jan 1, 2026", completed: true },
        { step: "Under Review", date: null, completed: false }
      ]
    }
  ];

  const statusFilters = [
    { value: "all", label: "All", count: applications.length },
    { value: "applied", label: "Applied", count: applications.filter(a => a.status === "applied").length },
    { value: "shortlisted", label: "Shortlisted", count: applications.filter(a => a.status === "shortlisted").length },
    { value: "interview", label: "Interview", count: applications.filter(a => a.status === "interview").length },
    { value: "rejected", label: "Rejected", count: applications.filter(a => a.status === "rejected").length }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "applied":
        return <Badge variant="info"><Clock className="w-3 h-3 mr-1" />Applied</Badge>;
      case "shortlisted":
        return <Badge variant="success"><CheckCircle className="w-3 h-3 mr-1" />Shortlisted</Badge>;
      case "interview":
        return <Badge variant="primary"><Calendar className="w-3 h-3 mr-1" />Interview</Badge>;
      case "rejected":
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          app.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <MainLayout>
      <div className="bg-muted/30 min-h-screen py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">My Applications</h1>
            <p className="text-muted-foreground">Track and manage your job applications</p>
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
                    variant={statusFilter === filter.value ? "default" : "outline"}
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
            <div className={viewMode === "grid" ? "grid md:grid-cols-2 gap-6" : "space-y-4"}>
              {filteredApplications.map((application) => (
                <div 
                  key={application.id} 
                  className="bg-card rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center text-lg font-bold text-primary flex-shrink-0">
                      {application.companyLogo}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <Link 
                            to={`/jobs/${application.id}`}
                            className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-1"
                          >
                            {application.jobTitle}
                          </Link>
                          <p className="text-sm text-muted-foreground">{application.company}</p>
                        </div>
                        {getStatusBadge(application.status)}
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {application.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Applied: {application.appliedDate}
                        </span>
                      </div>

                      <p className="text-primary font-semibold mt-2">{application.salary}</p>

                      {/* Timeline */}
                      <div className="mt-4 pt-4 border-t border-border">
                        <div className="flex items-center gap-2">
                          {application.timeline.map((step, index) => (
                            <div key={index} className="flex items-center">
                              <div className={`w-2 h-2 rounded-full ${
                                step.completed ? 'bg-primary' : 'bg-muted-foreground/30'
                              }`} />
                              {index < application.timeline.length - 1 && (
                                <div className={`w-8 h-0.5 ${
                                  step.completed && application.timeline[index + 1]?.completed 
                                    ? 'bg-primary' 
                                    : 'bg-muted-foreground/30'
                                }`} />
                              )}
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-between mt-1">
                          <span className="text-xs text-muted-foreground">
                            {application.timeline[0].step}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {application.timeline[application.timeline.length - 1].step}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 mt-4">
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/jobs/${application.id}`}>
                            <Eye className="w-4 h-4 mr-1" />
                            View Job
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm">
                          <FileText className="w-4 h-4 mr-1" />
                          View Application
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-card rounded-xl p-12 text-center">
              <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No Applications Found</h3>
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
