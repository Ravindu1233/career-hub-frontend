import { Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  User,
  Briefcase,
  GraduationCap,
  BookmarkCheck,
  FileText,
  ArrowRight,
  Bell,
  Settings,
  TrendingUp,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

// =============================
// API Endpoints
// =============================
const API_USER_ME = "/users/me";
const API_MY_APPLICATIONS = "/applications/my-applications";
const API_MY_INSTITUTIONS = "/institutions/my-institutions";

// =============================
// Backend Types
// =============================
type BackendUser = {
  userId: number;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  profilePic?: string | null;
};

type BackendApplication = {
  id: string;
  status: string;
  createdAt: string;
};

type BackendInstitution = {
  id: string;
  name: string;
  location?: string | null;
  courses?: any[];
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
  return "under_review";
}

// =============================
// Main Component
// =============================
export default function UserDashboard() {
  // Fetch user
  const {
    data: user,
    isLoading: userLoading,
    isError: userError,
  } = useQuery({
    queryKey: ["user-me"],
    queryFn: async () => {
      const res = await api.get(API_USER_ME);
      return res.data as BackendUser;
    },
  });

  // Fetch applications
  const {
    data: applications,
    isLoading: appsLoading,
    isError: appsError,
  } = useQuery({
    queryKey: ["my-applications"],
    queryFn: async () => {
      const res = await api.get(API_MY_APPLICATIONS);
      return (res.data ?? []) as BackendApplication[];
    },
  });

  // Fetch institutions
  const {
    data: institutions,
    isLoading: institutionsLoading,
    isError: institutionsError,
  } = useQuery({
    queryKey: ["my-institutions"],
    queryFn: async () => {
      const res = await api.get(API_MY_INSTITUTIONS);
      return (res.data ?? []) as BackendInstitution[];
    },
  });

  const apps = applications ?? [];
  const insts = institutions ?? [];

  const userName =
    `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() || "User";

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Welcome back, {userName}!
            </h1>
            <p className="text-muted-foreground mt-1">
              Here's what's happening with your job search
            </p>

            {(userLoading || appsLoading || institutionsLoading) && (
              <p className="text-xs text-muted-foreground mt-2">Loading...</p>
            )}
            {(userError || appsError || institutionsError) && (
              <p className="text-xs text-destructive mt-2">
                Failed to load dashboard data.
              </p>
            )}
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

        {/* Stats Overview - 4 cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Link to="/user/profile" className="block">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">Profile</p>
                    <p className="text-sm text-muted-foreground">View & Edit</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/user/applications" className="block">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Briefcase className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{apps.length}</p>
                    <p className="text-sm text-muted-foreground">
                      Applications
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/user/saved-jobs" className="block">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-warning/10 flex items-center justify-center">
                    <BookmarkCheck className="h-6 w-6 text-warning" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">0</p>
                    <p className="text-sm text-muted-foreground">Saved Jobs</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/user/institutions" className="block">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-info/10 flex items-center justify-center">
                    <GraduationCap className="h-6 w-6 text-info" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{insts.length}</p>
                    <p className="text-sm text-muted-foreground">
                      Institutions
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Recent Applications */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Recent Applications
              </CardTitle>
              <Link to="/user/applications">
                <Button variant="ghost" size="sm">
                  View All
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {apps.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No applications yet</p>
                  <Link to="/jobs">
                    <Button variant="outline" size="sm" className="mt-4">
                      Browse Jobs
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {apps.slice(0, 3).map((app) => (
                    <div
                      key={app.id}
                      className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                    >
                      <div>
                        <p className="font-medium">Application #{app.id}</p>
                        <p className="text-sm text-muted-foreground">
                          {normalizeStatus(app.status).replace("_", " ")}
                        </p>
                      </div>
                      <Link to="/user/applications">
                        <Button variant="ghost" size="sm">
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Profile Completion */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Profile Strength
              </CardTitle>
              <Link to="/user/profile">
                <Button variant="ghost" size="sm">
                  Edit Profile
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">
                      Profile Completion
                    </span>
                    <span className="text-sm text-muted-foreground">75%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: "75%" }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Complete your profile to increase your visibility to
                    employers
                  </p>
                  <ul className="text-sm space-y-1">
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      <span>Basic information added</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      <span>Contact details added</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-muted" />
                      <span className="text-muted-foreground">
                        Add skills and certifications
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          <Link to="/user/saved-jobs" className="block">
            <Card className="hover:shadow-lg transition-shadow h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookmarkCheck className="h-5 w-5" />
                  Saved Jobs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Access your bookmarked job opportunities
                </p>
                <Button variant="outline" className="w-full">
                  View Saved Jobs
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link to="/user/institutions" className="block">
            <Card className="hover:shadow-lg transition-shadow h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  My Institutions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Manage your educational institutions and courses
                </p>
                <Button variant="outline" className="w-full">
                  View Institutions
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </MainLayout>
  );
}
