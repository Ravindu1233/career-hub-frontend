import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Bookmark, Building2 } from "lucide-react";
import { api } from "@/lib/api";

export interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  type: "Full-time" | "Part-time" | "Internship" | "Contract";
  salary: string;
  postedAt: string;
  skills: string[];
  featured?: boolean;
  verified?: boolean;
}

interface JobCardProps {
  job: Job;
}

// Check if the user is logged in as a USER (has a JWT token)
function isUserLoggedIn(): boolean {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");
  return !!token;
}

export function JobCard({ job }: JobCardProps) {
  const [saved, setSaved] = useState(false);
  const [savingLoading, setSavingLoading] = useState(false);
  const loggedIn = isUserLoggedIn();

  // Check initial saved status on mount (only if logged in)
  useEffect(() => {
    if (!loggedIn) return;
    api
      .get(`/saved-jobs/${job.id}/status`)
      .then((res) => setSaved(res.data?.isSaved ?? false))
      .catch(() => {}); // silently ignore — user might not be a USER role
  }, [job.id, loggedIn]);

  const handleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault(); // prevent navigating to job detail
    e.stopPropagation();

    if (!loggedIn) {
      window.location.href = "/login";
      return;
    }

    setSavingLoading(true);
    try {
      if (saved) {
        await api.delete(`/saved-jobs/${job.id}`);
        setSaved(false);
      } else {
        await api.post(`/saved-jobs/${job.id}`);
        setSaved(true);
      }
    } catch {
      // silently ignore — e.g. company/admin accounts can't save jobs
    } finally {
      setSavingLoading(false);
    }
  };

  return (
    <div className="group relative bg-card rounded-2xl border border-border/50 p-6 shadow-card transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary/20">
      {/* Featured badge */}
      {job.featured && (
        <Badge variant="featured" className="absolute -top-2 right-4">
          Featured
        </Badge>
      )}

      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        {/* Company logo */}
        <div className="h-14 w-14 rounded-xl bg-muted flex items-center justify-center flex-shrink-0 overflow-hidden">
          {job.companyLogo ? (
            <img
              src={job.companyLogo}
              alt={job.company}
              className="h-full w-full object-cover"
            />
          ) : (
            <Building2 className="h-7 w-7 text-muted-foreground" />
          )}
        </div>

        {/* Bookmark button */}
        <button
          onClick={handleBookmark}
          disabled={savingLoading}
          title={saved ? "Remove from saved" : "Save job"}
          className={`absolute top-6 right-6 p-2 rounded-lg transition-colors
            ${
              saved
                ? "text-warning bg-warning/10 hover:bg-warning/20"
                : "text-muted-foreground hover:text-warning hover:bg-warning/10"
            }
            ${savingLoading ? "opacity-50 cursor-not-allowed" : ""}
          `}
        >
          <Bookmark className={`h-5 w-5 ${saved ? "fill-current" : ""}`} />
        </button>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <Link to={`/jobs/${job.id}`}>
            <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
              {job.title}
            </h3>
          </Link>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm text-muted-foreground">{job.company}</span>
            {job.verified && (
              <Badge variant="success" className="px-1.5 py-0 text-[10px]">
                ✓ Verified
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-4">
        <div className="flex items-center gap-1.5">
          <MapPin className="h-4 w-4" />
          <span>{job.location}</span>
        </div>
        <Badge variant="primary">{job.type}</Badge>
      </div>

      {/* Skills */}
      <div className="flex flex-wrap gap-2 mb-4">
        {job.skills.slice(0, 3).map((skill) => (
          <span
            key={skill}
            className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium"
          >
            {skill}
          </span>
        ))}
        {job.skills.length > 3 && (
          <span className="px-3 py-1 rounded-full bg-secondary text-muted-foreground text-xs">
            +{job.skills.length - 3}
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-border/50">
        <div className="flex items-center gap-1.5">
          <span className="text-primary">LKR</span>
          <span className="text-lg font-bold text-foreground">
            {job.salary}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          <span>{job.postedAt}</span>
        </div>
      </div>

      {/* Apply button */}
      <Button className="w-full mt-4" asChild>
        <Link to={`/jobs/${job.id}`}>Apply Now</Link>
      </Button>
    </div>
  );
}
