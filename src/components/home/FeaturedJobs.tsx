import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { JobCard, Job } from "@/components/jobs/JobCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { api } from "@/lib/api";

type ApiJob = {
  id?: string | number;
  jobTitle?: string;
  location?: string;
  jobType?: string;
  salaryRange?: string;
  jobDate?: string;
  company?: {
    companyName?: string;
    status?: string;
  };
};

function normalizeJobType(raw?: string): Job["type"] {
  const v = (raw || "").trim().toLowerCase();
  if (v.includes("part")) return "Part-time";
  if (v.includes("intern")) return "Internship";
  if (v.includes("contract") || v.includes("freelance")) return "Contract";
  return "Full-time";
}

function timeAgo(dateString?: string) {
  if (!dateString) return "Recently";
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return "Recently";
  const diffMs = Date.now() - d.getTime();
  const diffMin = Math.floor(diffMs / (1000 * 60));
  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin} min ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr} hours ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return `${diffDay} days ago`;
  const diffWeek = Math.floor(diffDay / 7);
  if (diffWeek < 5) return `${diffWeek} weeks ago`;
  const diffMonth = Math.floor(diffDay / 30);
  if (diffMonth < 12) return `${diffMonth} months ago`;
  const diffYear = Math.floor(diffDay / 365);
  return `${diffYear} years ago`;
}

function shuffle<T>(list: T[]) {
  const arr = [...list];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function FeaturedJobs() {
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [featuredJobs, setFeaturedJobs] = useState<Job[]>([]);

  useEffect(() => {
    let alive = true;

    const loadJobs = async () => {
      try {
        const res = await api.get("/jobs");
        const list = Array.isArray(res.data) ? (res.data as ApiJob[]) : [];
        const mapped: Job[] = list
          .filter((job) => job?.id !== undefined && job?.id !== null)
          .map((job) => ({
            id: String(job.id),
            title: String(job.jobTitle ?? "Untitled Role"),
            company: String(job.company?.companyName ?? "Unknown Company"),
            location: String(job.location ?? "Remote"),
            type: normalizeJobType(job.jobType),
            salary: String(job.salaryRange ?? "Negotiable"),
            postedAt: timeAgo(job.jobDate),
            skills: [],
            featured: true,
            verified:
              !job.company?.status ||
              job.company.status.toUpperCase() === "APPROVED",
          }));

        if (!alive) return;
        setAllJobs(mapped);
        setFeaturedJobs(shuffle(mapped).slice(0, 6));
      } catch {
        if (!alive) return;
        setAllJobs([]);
        setFeaturedJobs([]);
      }
    };

    loadJobs();
    return () => {
      alive = false;
    };
  }, []);

  const remainingJobs = useMemo(
    () => Math.max(allJobs.length - featuredJobs.length, 0),
    [allJobs.length, featuredJobs.length],
  );

  return (
    <section className="py-20 lg:py-28 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
              Featured Opportunities
            </h2>
            <p className="text-lg text-muted-foreground">
              Discover hand-picked jobs from top companies
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link to="/jobs">
              View All Jobs
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>

        {/* Jobs Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Don't see the right fit? We have {formatNumber(remainingJobs)} more
            opportunities waiting for you.
          </p>
          <Button size="lg" asChild>
            <Link to="/jobs">Explore All Jobs</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function formatNumber(num: number) {
  return num.toLocaleString();
}
