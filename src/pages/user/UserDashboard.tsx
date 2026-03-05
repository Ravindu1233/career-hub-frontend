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
  CheckCircle2,
  Circle,
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
  mobile?: string | null;
  address?: string | null;
  bio?: string | null;
  skills?: string[] | null;
  schools?: string | null;
  dob?: string | null;
  certifications?: string[];
  olPassCount?: number | null;
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
// Profile Strength Calculator
// =============================
type ProfileCheckItem = {
  label: string;
  done: boolean;
};

function calcProfileStrength(user: BackendUser | undefined): {
  percent: number;
  checks: ProfileCheckItem[];
} {
  const checks: ProfileCheckItem[] = [
    {
      label: "Basic information added",
      done: !!(user?.firstName?.trim() || user?.lastName?.trim()),
    },
    {
      label: "Contact details added",
      done: !!user?.mobile?.trim(),
    },
    {
      label: "Location added",
      done: !!user?.address?.trim(),
    },
    {
      label: "Bio written",
      done: !!user?.bio?.trim(),
    },
    {
      label: "Skills added",
      done: Array.isArray(user?.skills) && user.skills.length > 0,
    },
    {
      label: "Certifications added",
      done:
        Array.isArray(user?.certifications) && user.certifications.length > 0,
    },
    {
      label: "Education added",
      done: !!user?.schools?.trim(),
    },
    {
      label: "Profile photo uploaded",
      done: !!user?.profilePic,
    },
  ];

  const done = checks.filter((c) => c.done).length;
  const percent = Math.round((done / checks.length) * 100);

  return { percent, checks };
}

function strengthLabel(percent: number): { text: string; color: string } {
  if (percent >= 80) return { text: "Strong", color: "text-green-600" };
  if (percent >= 50) return { text: "Good", color: "text-yellow-600" };
  return { text: "Needs work", color: "text-red-500" };
}

function strengthBarColor(percent: number): string {
  if (percent >= 80) return "bg-green-500";
  if (percent >= 50) return "bg-yellow-500";
  return "bg-red-500";
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

  const { data: savedJobs } = useQuery({
    queryKey: ["saved-jobs"],
    queryFn: async () => {
      const res = await api.get("/saved-jobs");
      return (res.data ?? []) as any[];
    },
  });

  const apps = applications ?? [];
  const insts = institutions ?? [];

  const userName =
    `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() || "User";

  const { percent, checks } = calcProfileStrength(user);
  const { text: strengthText, color: strengthColor } = strengthLabel(percent);
  const barColor = strengthBarColor(percent);

  // Show top incomplete items (max 3) so the card stays compact
  const incompleteChecks = checks.filter((c) => !c.done).slice(0, 3);
  const completedCount = checks.filter((c) => c.done).length;

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
                    <p className="text-2xl font-bold">
                      {savedJobs?.length ?? 0}
                    </p>
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

          {/* Profile Strength — now uses real data */}
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
              {userLoading ? (
                <p className="text-sm text-muted-foreground">Loading...</p>
              ) : (
                <div className="space-y-4">
                  {/* Bar */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">
                        Profile Completion
                      </span>
                      <span
                        className={`text-sm font-semibold ${strengthColor}`}
                      >
                        {percent}% — {strengthText}
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {completedCount} of {checks.length} items completed
                    </p>
                  </div>

                  {/* Checklist */}
                  <div className="space-y-1">
                    {/* Show all completed items first (up to 3) */}
                    {checks
                      .filter((c) => c.done)
                      .slice(0, 3)
                      .map((c) => (
                        <div
                          key={c.label}
                          className="flex items-center gap-2 text-sm"
                        >
                          <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                          <span>{c.label}</span>
                        </div>
                      ))}

                    {/* Then show incomplete items (up to 3) */}
                    {incompleteChecks.map((c) => (
                      <div
                        key={c.label}
                        className="flex items-center gap-2 text-sm text-muted-foreground"
                      >
                        <Circle className="h-4 w-4 shrink-0" />
                        <span>{c.label}</span>
                      </div>
                    ))}
                  </div>

                  {percent < 100 && (
                    <p className="text-xs text-muted-foreground">
                      Complete your profile to increase your visibility to
                      employers.
                    </p>
                  )}

                  {percent === 100 && (
                    <p className="text-xs text-green-600 font-medium">
                      🎉 Your profile is 100% complete!
                    </p>
                  )}
                </div>
              )}
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
