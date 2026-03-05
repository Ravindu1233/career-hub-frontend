import { Link, useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BookmarkCheck,
  Briefcase,
  MapPin,
  Building2,
  Trash2,
  ArrowLeft,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

type SavedJobItem = {
  id: string;
  savedAt: string;
  job: {
    id: string;
    jobTitle: string;
    jobType: string;
    location: string;
    salaryRange: string;
    company: {
      companyId: number;
      companyName: string;
      profilePic?: string | null;
      location?: string | null;
      industry?: string | null;
    };
  };
};

export default function SavedJobs() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["saved-jobs"],
    queryFn: async () => {
      const res = await api.get("/saved-jobs");
      return (res.data ?? []) as SavedJobItem[];
    },
  });

  const unsaveMutation = useMutation({
    mutationFn: async (jobId: string) => {
      await api.delete(`/saved-jobs/${jobId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-jobs"] });
    },
  });

  const savedJobs = data ?? [];

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Back button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/user/dashboard")}
          className="gap-2 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Saved Jobs</h1>
          <p className="text-muted-foreground mt-1">
            Jobs you've bookmarked for later
          </p>
        </div>

        {/* Count card */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-warning/10 flex items-center justify-center">
                <BookmarkCheck className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">{savedJobs.length}</p>
                <p className="text-sm text-muted-foreground">Saved Jobs</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* List */}
        <Card>
          <CardHeader>
            <CardTitle>Your Bookmarks</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-12 text-muted-foreground">
                <p>Loading...</p>
              </div>
            ) : isError ? (
              <div className="text-center py-12 text-destructive">
                <p>Failed to load saved jobs.</p>
              </div>
            ) : savedJobs.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <BookmarkCheck className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="mb-2">No saved jobs yet.</p>
                <p className="text-sm mb-4">
                  Browse jobs and click the bookmark icon to save them for later
                </p>
                <Link to="/jobs">
                  <Button variant="outline">
                    <Briefcase className="h-4 w-4 mr-2" />
                    Browse Jobs
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {savedJobs.map(({ id, savedAt, job }) => (
                  <div
                    key={id}
                    className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-lg font-bold text-primary shrink-0">
                        {job.company.companyName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {job.jobTitle}
                        </h3>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                          <span className="flex items-center gap-1">
                            <Building2 className="h-3 w-3" />
                            {job.company.companyName}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {job.location}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          LKR {job.salaryRange}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Saved: {new Date(savedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Link to={`/jobs/${job.id}`}>
                        <Button variant="default" size="sm">
                          View Job
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => unsaveMutation.mutate(job.id)}
                        disabled={unsaveMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
