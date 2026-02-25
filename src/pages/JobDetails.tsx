import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { JobCard, Job } from "@/components/jobs/JobCard";
import { api } from "@/lib/api";
import {
  MapPin,
  Clock,
  Bookmark,
  Building2,
  DollarSign,
  Calendar,
  Users,
  Globe,
  CheckCircle,
  Briefcase,
  ChevronRight,
  AlertCircle,
} from "lucide-react";

type JobType = Job["type"];

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
    if (uniq.length >= 10) break;
  }
  return uniq;
}

function splitToList(text?: string) {
  if (!text) return [];
  const parts = text
    .split(/\n|•|-/g)
    .map((s) => s.trim())
    .filter(Boolean);
  if (parts.length === 1 && parts[0].length > 140) return [parts[0]];
  return parts;
}

function formatDateShort(dateString?: string) {
  if (!dateString) return "—";
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function JobDetails() {
  const { id } = useParams();

  const [activeTab, setActiveTab] = useState<
    "overview" | "company" | "similar"
  >("overview");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const [jobRaw, setJobRaw] = useState<any>(null);
  const [jobCardModel, setJobCardModel] = useState<Job | null>(null);
  const [similarJobs, setSimilarJobs] = useState<Job[]>([]);

  useEffect(() => {
    let alive = true;

    async function load() {
      if (!id) return;
      try {
        setLoading(true);
        setError("");

        const jobRes = await api.get(`/jobs/${id}`);
        const j = jobRes.data;

        const listRes = await api.get(`/jobs`);
        const all = Array.isArray(listRes.data) ? listRes.data : [];

        const mappedCurrent: Job = {
          id: String(j?.id ?? ""),
          title: String(j?.jobTitle ?? ""),
          company: String(j?.company?.companyName ?? "Unknown Company"),
          location: String(j?.location ?? ""),
          type: normalizeJobType(j?.jobType),
          salary: String(j?.salaryRange ?? ""),
          postedAt: timeAgo(j?.jobDate),
          skills: extractSkills(j?.requirements),
          featured: false,
          verified: true,
        };

        const mappedSimilar: Job[] = all
          .filter((x: any) => String(x?.id ?? "") !== String(j?.id ?? ""))
          .filter(
            (x: any) => normalizeJobType(x?.jobType) === mappedCurrent.type,
          )
          .slice(0, 6)
          .map((x: any) => ({
            id: String(x?.id ?? ""),
            title: String(x?.jobTitle ?? ""),
            company: String(x?.company?.companyName ?? "Unknown Company"),
            location: String(x?.location ?? ""),
            type: normalizeJobType(x?.jobType),
            salary: String(x?.salaryRange ?? ""),
            postedAt: timeAgo(x?.jobDate),
            skills: extractSkills(x?.requirements),
            featured: false,
            verified: true,
          }));

        if (!alive) return;
        setJobRaw(j);
        setJobCardModel(mappedCurrent);
        setSimilarJobs(mappedSimilar);
      } catch (e: any) {
        if (!alive) return;
        setError(e?.message || "Failed to load job");
        setJobRaw(null);
        setJobCardModel(null);
        setSimilarJobs([]);
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, [id]);

  const description = useMemo(
    () => String(jobRaw?.jobDescription ?? ""),
    [jobRaw],
  );
  const responsibilities = useMemo(() => [], [jobRaw]);
  const requirementsList = useMemo(
    () => splitToList(String(jobRaw?.requirements ?? "")),
    [jobRaw],
  );
  const skills = useMemo(
    () => extractSkills(String(jobRaw?.requirements ?? "")),
    [jobRaw],
  );

  const company = jobRaw?.company || {};
  const companyName = String(
    company?.companyName ?? jobCardModel?.company ?? "Unknown Company",
  );
  const companyIndustry = String(company?.industry ?? "");
  const companySize = String(company?.companySize ?? "");
  const companyWebsite = String(company?.url ?? "");
  const companyDescription = String(company?.description ?? "");
  const companyBenefits = splitToList(String(company?.benefitsAndPerks ?? ""));

  const salaryText = String(jobRaw?.salaryRange ?? jobCardModel?.salary ?? "—");

  // ✅ Real values from backend
  const deadlineText = formatDateShort(jobRaw?.deadline);
  const applicantCount: number =
    jobRaw?.applicantCount ?? jobRaw?.applications?.length ?? 0;
  const maxApplicants: number | null = jobRaw?.maxApplicants ?? null;
  const isFull: boolean = jobRaw?.isFull ?? false;

  // Deadline warning — show if deadline is within 3 days
  const deadlineWarning = useMemo(() => {
    if (!jobRaw?.deadline) return false;
    const d = new Date(jobRaw.deadline);
    if (Number.isNaN(d.getTime())) return false;
    const diffDays = (d.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
    return diffDays > 0 && diffDays <= 3;
  }, [jobRaw]);

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 text-muted-foreground">
          Loading job...
        </div>
      </MainLayout>
    );
  }

  if (error || !jobCardModel) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-destructive">
            {error || "Job not found"}
          </div>
          <div className="mt-6">
            <Button asChild variant="outline">
              <Link to="/jobs">Back to Jobs</Link>
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Breadcrumb */}
      <div className="bg-muted/30 border-b border-border/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground">
              Home
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link to="/jobs" className="hover:text-foreground">
              Jobs
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">{jobCardModel.title}</span>
          </div>
        </div>
      </div>

      {/* Job Header */}
      <section className="bg-muted/30 pb-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* ✅ Full warning banner */}
          {isFull && (
            <div className="mb-4 pt-6 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 flex items-center gap-2 text-destructive text-sm">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>
                This job has reached its maximum number of applicants and is no
                longer accepting applications.
              </span>
            </div>
          )}

          {/* ✅ Deadline warning banner */}
          {deadlineWarning && !isFull && (
            <div className="mb-4 pt-6 rounded-xl border border-warning/30 bg-warning/5 px-4 py-3 flex items-center gap-2 text-warning text-sm">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>
                This job is closing soon — deadline is {deadlineText}.
              </span>
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-6 lg:items-start">
            {/* Left: Job info */}
            <div className="flex-1">
              <div className="flex items-start gap-4 mb-4">
                <div className="h-16 w-16 lg:h-20 lg:w-20 rounded-2xl bg-card border border-border/50 flex items-center justify-center flex-shrink-0 shadow-card">
                  <Building2 className="h-8 w-8 lg:h-10 lg:w-10 text-muted-foreground" />
                </div>
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
                    {jobCardModel.title}
                  </h1>
                  <div className="flex items-center gap-3 flex-wrap">
                    <Link
                      to="#"
                      className="text-lg text-primary hover:underline"
                    >
                      {companyName}
                    </Link>
                    <Badge variant="success" className="gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Verified Company
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Quick info */}
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{jobCardModel.location}</span>
                </div>
                <Badge variant="primary">{jobCardModel.type}</Badge>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Posted {jobCardModel.postedAt}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  {/* ✅ Show real count + max if set */}
                  <span>
                    {applicantCount}
                    {maxApplicants != null ? ` / ${maxApplicants}` : ""}{" "}
                    applicants
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3">
              {/* ✅ Disable Apply Now if full */}
              {isFull ? (
                <Button size="lg" className="flex-1 lg:w-48" disabled>
                  Applications Closed
                </Button>
              ) : (
                <Button size="lg" className="flex-1 lg:w-48" asChild>
                  <Link to={`/jobs/${id}/apply`}>Apply Now</Link>
                </Button>
              )}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="lg"
                  className={`flex-1 ${saved ? "text-warning border-warning" : ""}`}
                  onClick={() => setSaved(!saved)}
                  type="button"
                >
                  <Bookmark
                    className={`h-5 w-5 ${saved ? "fill-current" : ""}`}
                  />
                  {saved ? "Saved" : "Save"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left content */}
            <div className="flex-1">
              {/* Info cards */}
              <div className="grid sm:grid-cols-3 gap-4 mb-8">
                <div className="p-4 rounded-xl bg-card border border-border/50 shadow-card">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <DollarSign className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Salary</p>
                      <p className="text-lg font-bold text-foreground">
                        {salaryText}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-card border border-border/50 shadow-card">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                      <Briefcase className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Job Type</p>
                      <p className="text-lg font-bold text-foreground">
                        {jobCardModel.type}
                      </p>
                    </div>
                  </div>
                </div>

                {/* ✅ Real deadline */}
                <div className="p-4 rounded-xl bg-card border border-border/50 shadow-card">
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-10 w-10 rounded-lg flex items-center justify-center ${deadlineWarning ? "bg-warning/10" : "bg-warning/10"}`}
                    >
                      <Calendar
                        className={`h-5 w-5 ${deadlineWarning ? "text-destructive" : "text-warning"}`}
                      />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Deadline</p>
                      <p
                        className={`text-lg font-bold ${deadlineWarning ? "text-destructive" : "text-foreground"}`}
                      >
                        {deadlineText}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="border-b border-border/50 mb-8">
                <div className="flex gap-8">
                  {["overview", "company", "similar"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab as typeof activeTab)}
                      className={`pb-4 text-sm font-medium capitalize transition-colors relative ${
                        activeTab === tab
                          ? "text-primary"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                      type="button"
                    >
                      {tab === "similar" ? "Similar Jobs" : tab}
                      {activeTab === tab && (
                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab content */}
              {activeTab === "overview" && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground mb-4">
                      Job Description
                    </h2>
                    <p className="text-muted-foreground whitespace-pre-line">
                      {description || "—"}
                    </p>
                  </div>

                  {responsibilities.length > 0 && (
                    <div>
                      <h2 className="text-xl font-semibold text-foreground mb-4">
                        Responsibilities
                      </h2>
                      <ul className="space-y-3">
                        {responsibilities.map((item: string, index: number) => (
                          <li key={index} className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                            <span className="text-muted-foreground">
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div>
                    <h2 className="text-xl font-semibold text-foreground mb-4">
                      Requirements
                    </h2>
                    {requirementsList.length > 0 ? (
                      <ul className="space-y-3">
                        {requirementsList.map((item: string, index: number) => (
                          <li key={index} className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                            <span className="text-muted-foreground">
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted-foreground">—</p>
                    )}
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold text-foreground mb-4">
                      Required Skills
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {(skills.length ? skills : jobCardModel.skills).map(
                        (skill) => (
                          <Badge
                            key={skill}
                            variant="secondary"
                            className="px-4 py-1.5 text-sm"
                          >
                            {skill}
                          </Badge>
                        ),
                      )}
                    </div>
                  </div>

                  {companyBenefits.length > 0 && (
                    <div>
                      <h2 className="text-xl font-semibold text-foreground mb-4">
                        Benefits
                      </h2>
                      <div className="grid sm:grid-cols-2 gap-4">
                        {companyBenefits.map((text, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 p-4 rounded-xl bg-muted/50"
                          >
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                              <CheckCircle className="h-5 w-5 text-primary" />
                            </div>
                            <span className="text-sm text-foreground">
                              {text}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "company" && (
                <div className="space-y-6">
                  <div className="p-6 rounded-2xl bg-card border border-border/50 shadow-card">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center">
                        <Building2 className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-foreground">
                          {companyName}
                        </h3>
                        <p className="text-muted-foreground">
                          {companyIndustry || "—"}
                        </p>
                      </div>
                    </div>
                    <p className="text-muted-foreground mb-6">
                      {companyDescription || "—"}
                    </p>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3">
                        <Users className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm">{companySize || "—"}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Globe className="h-5 w-5 text-muted-foreground" />
                        {companyWebsite ? (
                          <a
                            href={companyWebsite}
                            className="text-sm text-primary hover:underline"
                            target="_blank"
                            rel="noreferrer"
                          >
                            Visit Website
                          </a>
                        ) : (
                          <span className="text-sm">—</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "similar" && (
                <div className="grid md:grid-cols-2 gap-6">
                  {similarJobs.length > 0 ? (
                    similarJobs.map((job) => <JobCard key={job.id} job={job} />)
                  ) : (
                    <div className="text-muted-foreground">
                      No similar jobs found.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right sidebar */}
            <aside className="lg:w-80 flex-shrink-0">
              <div className="sticky top-24 space-y-6">
                {/* Quick apply card */}
                <div className="p-6 rounded-2xl bg-card border border-border/50 shadow-card">
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    Quick Apply
                  </h3>
                  {isFull ? (
                    <>
                      <p className="text-sm text-destructive mb-4 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        This job is no longer accepting applications.
                      </p>
                      <Button className="w-full" size="lg" disabled>
                        Applications Closed
                      </Button>
                    </>
                  ) : (
                    <>
                      <p className="text-sm text-muted-foreground mb-4">
                        Submit your application in just a few clicks. Takes
                        about 2 minutes.
                      </p>
                      <Button className="w-full" size="lg" asChild>
                        <Link to={`/jobs/${id}/apply`}>Apply Now</Link>
                      </Button>
                    </>
                  )}
                </div>

                {/* Company card */}
                <div className="p-6 rounded-2xl bg-card border border-border/50 shadow-card">
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    About the Company
                  </h3>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        {companyName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {companyIndustry || "—"}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full" type="button">
                    View Company Profile
                  </Button>
                </div>

                {/* Job Details */}
                <div className="p-6 rounded-2xl bg-card border border-border/50 shadow-card">
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    Job Details
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span>Posted</span>
                      <span className="text-foreground">
                        {formatDateShort(jobRaw?.jobDate)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span>Deadline</span>
                      <span
                        className={`${deadlineWarning ? "text-destructive font-medium" : "text-foreground"}`}
                      >
                        {deadlineText}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span>Type</span>
                      <span className="text-foreground">
                        {jobCardModel.type}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span>Location</span>
                      <span className="text-foreground">
                        {jobCardModel.location}
                      </span>
                    </div>
                    {maxApplicants != null && (
                      <div className="flex items-center justify-between text-muted-foreground">
                        <span>Applicants</span>
                        <span
                          className={`${isFull ? "text-destructive font-medium" : "text-foreground"}`}
                        >
                          {applicantCount} / {maxApplicants}
                          {isFull && " (Full)"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
