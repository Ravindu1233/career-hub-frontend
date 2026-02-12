import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Bookmark, Building2, DollarSign } from "lucide-react";

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

export function JobCard({ job }: JobCardProps) {
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
        <button className="absolute top-6 right-6 p-2 rounded-lg text-muted-foreground hover:text-warning hover:bg-warning/10 transition-colors">
          <Bookmark className="h-5 w-5" />
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
