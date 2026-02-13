import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, FileText, Calendar, Users, ArrowRight } from "lucide-react";

type ApplicationFromAPI = {
  id: string;
  status: string;
};

export default function CompanyDashboard() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [applications, setApplications] = useState<ApplicationFromAPI[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [loadingApplications, setLoadingApplications] = useState(false);

  useEffect(() => {
    loadJobs();
    loadApplications();
  }, []);

  const loadJobs = async () => {
    setLoadingJobs(true);
    try {
      const res = await api.get("/jobs/company/me");
      setJobs(res.data);
    } finally {
      setLoadingJobs(false);
    }
  };

  const loadApplications = async () => {
    setLoadingApplications(true);
    try {
      const res = await api.get("/applications/company/all");
      setApplications(res.data);
    } finally {
      setLoadingApplications(false);
    }
  };

  // Mock interviews count (replace with API call when available)
  const scheduledInterviewsCount = 2;
  const shortlistedCount = applications.filter(
    (a) => a.status === "shortlisted",
  ).length;

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Company Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here's an overview of your recruitment activities
          </p>
        </div>

        {/* Quick Actions with Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Link to="/company/jobs">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Briefcase className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-foreground">
                        {loadingJobs ? "..." : jobs.length}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Active Jobs
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">
                  Manage Jobs
                </h3>
                <p className="text-sm text-muted-foreground">
                  Post, edit, and manage job listings
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/company/applications">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center">
                      <FileText className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-foreground">
                        {loadingApplications ? "..." : applications.length}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Applications
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">
                  Review Applications
                </h3>
                <p className="text-sm text-muted-foreground">
                  View and process candidate applications
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/company/interviews">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-warning/10 flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-warning" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-foreground">
                        {scheduledInterviewsCount}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Scheduled Interviews
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">
                  Interviews
                </h3>
                <p className="text-sm text-muted-foreground">
                  Schedule and manage interviews
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/company/profile">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-info/10 flex items-center justify-center">
                      <Users className="h-6 w-6 text-info" />
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">
                  Company Profile
                </h3>
                <p className="text-sm text-muted-foreground">
                  Update your company information
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Recent Activity Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Recent Activity
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Recent Jobs */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-foreground">Recent Jobs</h3>
                  <Link to="/company/jobs">
                    <Button variant="ghost" size="sm">
                      View all
                    </Button>
                  </Link>
                </div>
                <div className="space-y-3">
                  {loadingJobs ? (
                    <p className="text-sm text-muted-foreground">Loading...</p>
                  ) : jobs.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No jobs posted yet
                    </p>
                  ) : (
                    jobs.slice(0, 3).map((job) => (
                      <div
                        key={job.id}
                        className="flex items-center justify-between p-3 rounded-lg border bg-card"
                      >
                        <div>
                          <p className="font-medium text-sm">{job.jobTitle}</p>
                          <p className="text-xs text-muted-foreground">
                            {job.applications?.length ?? 0} applications
                          </p>
                        </div>
                        <Link to={`/company/jobs/${job.id}`}>
                          <Button variant="ghost" size="sm">
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recent Applications */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-foreground">
                    Recent Applications
                  </h3>
                  <Link to="/company/applications">
                    <Button variant="ghost" size="sm">
                      View all
                    </Button>
                  </Link>
                </div>
                <div className="space-y-3">
                  {loadingApplications ? (
                    <p className="text-sm text-muted-foreground">Loading...</p>
                  ) : applications.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No applications yet
                    </p>
                  ) : (
                    applications.slice(0, 3).map((app: any) => (
                      <div
                        key={app.id}
                        className="flex items-center justify-between p-3 rounded-lg border bg-card"
                      >
                        <div>
                          <p className="font-medium text-sm">
                            {app.user?.firstName} {app.user?.lastName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {app.job?.jobTitle}
                          </p>
                        </div>
                        <Link to="/company/applications">
                          <Button variant="ghost" size="sm">
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
