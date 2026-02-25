import { useEffect, useMemo, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { JobCard, Job } from "@/components/jobs/JobCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  MapPin,
  X,
  Grid3X3,
  List,
  ChevronDown,
  Filter,
} from "lucide-react";

const jobTypes: Job["type"][] = [
  "Full-time",
  "Part-time",
  "Internship",
  "Contract",
];

const API_BASE =
  (import.meta as any)?.env?.VITE_API_URL || "http://localhost:3000";

const JOBS_PER_PAGE = 10;

type JobType = Job["type"];
type SortOption = "latest" | "oldest";

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

function normalizeJobType(raw?: string): JobType {
  const v = (raw || "").trim().toLowerCase();
  if (v.includes("full")) return "Full-time";
  if (v.includes("part")) return "Part-time";
  if (v.includes("intern")) return "Internship";
  if (v.includes("contract") || v.includes("freelance")) return "Contract";
  return "Full-time";
}

function extractSkills(requirements?: string) {
  if (!requirements) return [];
  const parts = requirements
    .split(/,|\n|•|-|\||\//g)
    .map((s) => s.trim())
    .filter(Boolean);
  const cleaned = parts
    .map((p) => p.replace(/\s+/g, " "))
    .filter((p) => p.length >= 2 && p.length <= 24);
  const uniq: string[] = [];
  for (const s of cleaned) {
    const key = s.toLowerCase();
    if (!uniq.some((u) => u.toLowerCase() === key)) uniq.push(s);
    if (uniq.length >= 6) break;
  }
  return uniq;
}

export default function Jobs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<JobType[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>("latest");
  const [currentPage, setCurrentPage] = useState(1);

  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [jobsError, setJobsError] = useState<string>("");

  const activeFilters = selectedTypes.length;

  const clearFilters = () => {
    setSelectedTypes([]);
    setSearchQuery("");
    setLocationQuery("");
    setCurrentPage(1);
  };

  const toggleType = (type: JobType) => {
    setCurrentPage(1);
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

  useEffect(() => {
    let alive = true;
    async function loadJobs() {
      try {
        setLoadingJobs(true);
        setJobsError("");
        const res = await fetch(`${API_BASE}/jobs`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) {
          const txt = await res.text().catch(() => "");
          throw new Error(
            `Failed to load jobs (${res.status})${txt ? `: ${txt}` : ""}`,
          );
        }
        const data = await res.json();
        const mapped: Job[] = Array.isArray(data)
          ? data.map((j: any) => ({
              id: String(j?.id ?? ""),
              title: String(j?.jobTitle ?? ""),
              company: String(j?.company?.companyName ?? "Unknown Company"),
              location: String(j?.location ?? ""),
              type: normalizeJobType(j?.jobType),
              salary: String(j?.salaryRange ?? ""),
              postedAt: timeAgo(j?.jobDate),
              // ✅ Keep raw date for sorting
              _jobDate: j?.jobDate ?? "",
              skills: extractSkills(j?.requirements),
              featured: false,
              verified: true,
            }))
          : [];
        if (alive) setAllJobs(mapped);
      } catch (e: any) {
        if (!alive) return;
        setJobsError(e?.message || "Failed to load jobs");
        setAllJobs([]);
      } finally {
        if (alive) setLoadingJobs(false);
      }
    }
    loadJobs();
    return () => {
      alive = false;
    };
  }, []);

  // ✅ Filter then sort
  const filteredAndSorted = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    const lq = locationQuery.toLowerCase().trim();

    const filtered = allJobs.filter((job) => {
      const matchesSearch =
        !q ||
        job.title.toLowerCase().includes(q) ||
        job.company.toLowerCase().includes(q) ||
        job.skills.some((s) => s.toLowerCase().includes(q));
      const matchesLocation = !lq || job.location.toLowerCase().includes(lq);
      const matchesType =
        selectedTypes.length === 0 || selectedTypes.includes(job.type);
      return matchesSearch && matchesLocation && matchesType;
    });

    // ✅ Real sort by actual date
    return [...filtered].sort((a, b) => {
      const dateA = new Date((a as any)._jobDate).getTime() || 0;
      const dateB = new Date((b as any)._jobDate).getTime() || 0;
      return sortOption === "latest" ? dateB - dateA : dateA - dateB;
    });
  }, [allJobs, searchQuery, locationQuery, selectedTypes, sortOption]);

  // ✅ Real pagination
  const totalPages = Math.max(
    1,
    Math.ceil(filteredAndSorted.length / JOBS_PER_PAGE),
  );
  const paginatedJobs = useMemo(() => {
    const start = (currentPage - 1) * JOBS_PER_PAGE;
    return filteredAndSorted.slice(start, start + JOBS_PER_PAGE);
  }, [filteredAndSorted, currentPage]);

  // ✅ Reset to page 1 when search/filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, locationQuery, selectedTypes, sortOption]);

  // ✅ Build page numbers with ellipsis
  const pageNumbers = useMemo(() => {
    if (totalPages <= 7)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | "...")[] = [];
    pages.push(1);
    if (currentPage > 3) pages.push("...");
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
    return pages;
  }, [totalPages, currentPage]);

  const FilterSidebar = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Filters</h2>
        {activeFilters > 0 && (
          <button
            onClick={clearFilters}
            className="text-sm text-primary hover:underline"
            type="button"
          >
            Reset
          </button>
        )}
      </div>

      {/* ✅ Job Type — functional */}
      <div>
        <h3 className="text-sm font-medium text-foreground mb-3">Job Type</h3>
        <div className="space-y-2">
          {jobTypes.map((type) => (
            <label
              key={type}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={selectedTypes.includes(type)}
                onChange={() => toggleType(type)}
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary/20"
              />
              <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                {type}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <MainLayout>
      {/* Hero/Search Section */}
      <section className="bg-muted/30 border-b border-border/50 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-foreground mb-6">
            Browse Jobs
          </h1>

          {/* Search bar */}
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by title, company, or skill..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 pl-12 pr-4 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div className="lg:w-64 relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Location"
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                className="w-full h-12 pl-12 pr-4 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <Button size="lg" className="h-12 px-8" type="button">
              <Search className="h-5 w-5 mr-2" />
              Search
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-12 lg:hidden"
              onClick={() => setShowFilters(!showFilters)}
              type="button"
            >
              <Filter className="h-5 w-5 mr-2" />
              Filters
              {activeFilters > 0 && (
                <Badge variant="primary" className="ml-2">
                  {activeFilters}
                </Badge>
              )}
            </Button>
          </div>

          {/* Active filter badges */}
          {activeFilters > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <span className="text-sm text-muted-foreground">
                Active filters:
              </span>
              {selectedTypes.map((type) => (
                <Badge key={type} variant="secondary" className="gap-1.5">
                  {type}
                  <button onClick={() => toggleType(type)} type="button">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              <button
                onClick={clearFilters}
                className="text-sm text-primary hover:underline"
                type="button"
              >
                Clear all
              </button>
            </div>
          )}

          {jobsError && (
            <div className="mt-4 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              {jobsError}
            </div>
          )}
        </div>
      </section>

      {/* Main content */}
      <section className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            {/* Sidebar — Desktop */}
            <aside className="hidden lg:block w-72 flex-shrink-0">
              <div className="sticky top-24 bg-card rounded-2xl border border-border/50 p-6 shadow-card">
                <FilterSidebar />
              </div>
            </aside>

            {/* Mobile filters drawer */}
            {showFilters && (
              <div className="lg:hidden fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
                <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-background border-l border-border p-6 overflow-y-auto">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold">Filters</h2>
                    <button onClick={() => setShowFilters(false)} type="button">
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                  <FilterSidebar />
                  <div className="flex gap-3 mt-6">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={clearFilters}
                      type="button"
                    >
                      Reset
                    </Button>
                    <Button
                      className="flex-1"
                      onClick={() => setShowFilters(false)}
                      type="button"
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Job listings */}
            <div className="flex-1 min-w-0">
              {/* Results header */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-muted-foreground">
                  <span className="font-semibold text-foreground">
                    {filteredAndSorted.length}
                  </span>{" "}
                  jobs found
                  {totalPages > 1 && (
                    <span className="ml-1 text-sm">
                      — page {currentPage} of {totalPages}
                    </span>
                  )}
                </p>
                <div className="flex items-center gap-3">
                  {/* ✅ Real sort — latest / oldest */}
                  <div className="relative hidden sm:block">
                    <select
                      value={sortOption}
                      onChange={(e) =>
                        setSortOption(e.target.value as SortOption)
                      }
                      className="h-10 pl-4 pr-10 rounded-lg bg-background border border-border text-sm text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                    >
                      <option value="latest">Latest</option>
                      <option value="oldest">Oldest</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  </div>

                  {/* View toggle */}
                  <div className="flex items-center border border-border rounded-lg overflow-hidden">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 ${
                        viewMode === "grid"
                          ? "bg-primary text-primary-foreground"
                          : "bg-background text-muted-foreground hover:text-foreground"
                      }`}
                      type="button"
                    >
                      <Grid3X3 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 ${
                        viewMode === "list"
                          ? "bg-primary text-primary-foreground"
                          : "bg-background text-muted-foreground hover:text-foreground"
                      }`}
                      type="button"
                    >
                      <List className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Loading */}
              {loadingJobs && (
                <div className="py-10 text-center text-muted-foreground">
                  Loading jobs...
                </div>
              )}

              {/* Job cards */}
              {!loadingJobs && paginatedJobs.length > 0 && (
                <div
                  className={
                    viewMode === "grid"
                      ? "grid md:grid-cols-2 gap-6"
                      : "space-y-4"
                  }
                >
                  {paginatedJobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>
              )}

              {/* Empty state */}
              {!loadingJobs && filteredAndSorted.length === 0 && (
                <div className="text-center py-16">
                  <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                    <Search className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    No jobs found
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Try adjusting your search or filters
                  </p>
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    type="button"
                  >
                    Clear Filters
                  </Button>
                </div>
              )}

              {/* ✅ Real pagination */}
              {!loadingJobs && totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    type="button"
                  >
                    Previous
                  </Button>

                  {pageNumbers.map((page, idx) =>
                    page === "..." ? (
                      <span
                        key={`ellipsis-${idx}`}
                        className="px-2 text-muted-foreground"
                      >
                        ...
                      </span>
                    ) : (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        className="w-10 h-10 p-0"
                        onClick={() => setCurrentPage(page as number)}
                        type="button"
                      >
                        {page}
                      </Button>
                    ),
                  )}

                  <Button
                    variant="outline"
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    type="button"
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
