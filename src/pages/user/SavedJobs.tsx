import { Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookmarkCheck, Briefcase, MapPin, Building2, Trash2 } from "lucide-react";

// =============================
// Types (placeholder for future implementation)
// =============================
type SavedJob = {
  id: string;
  jobTitle: string;
  companyName: string;
  location: string;
  salary?: string;
  savedAt: string;
};

// =============================
// Main Component
// =============================
export default function SavedJobs() {
  // TODO: Replace with actual API call when backend is ready
  const savedJobs: SavedJob[] = [];
  const isLoading = false;

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Saved Jobs</h1>
          <p className="text-muted-foreground mt-1">
            Jobs you've bookmarked for later
          </p>
        </div>

        {/* Saved Jobs Count */}
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

        {/* Saved Jobs List */}
        <Card>
          <CardHeader>
            <CardTitle>Your Bookmarks</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-12 text-muted-foreground">
                <p>Loading...</p>
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
                {savedJobs.map((job) => (
                  <div
                    key={job.id}
                    className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-lg font-bold text-primary">
                        {job.companyName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {job.jobTitle}
                        </h3>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                          <span className="flex items-center gap-1">
                            <Building2 className="h-3 w-3" />
                            {job.companyName}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {job.location}
                          </span>
                        </div>
                        {job.salary && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {job.salary}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          Saved: {new Date(job.savedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link to={`/jobs/${job.id}`}>
                        <Button variant="default" size="sm">
                          View Job
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive"
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
