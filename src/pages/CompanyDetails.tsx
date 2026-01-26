import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import {
  MapPin,
  Globe,
  Mail,
  Users,
  Building2,
  ArrowLeft,
  ExternalLink,
  CheckCircle,
  Calendar,
  Briefcase,
} from "lucide-react";

// ---- API Types (match your backend select) ----
type CompanyApi = {
  companyId: number;
  companyName: string;
  industry?: string | null;
  location?: string | null;
  companySize?: string | null;
  description?: string | null;
  url?: string | null;
  profilePic?: string | null;
  founded?: string | Date | null;
  benefitsAndPerks?: string | null;
  phone?: string | null;
  address?: string | null;
  email?: string | null;
  verified?: boolean | null; // optional (if you add later)
};

type JobApi = {
  id: string;
  companyId: number;
  jobTitle: string;
  jobType: string;
  location: string;
  salaryRange: string;
  jobDescription: string;
  requirements: string;
  jobDate: string; // ISO
};

function initials(name: string) {
  const parts = (name || "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "CO";
  const a = parts[0]?.[0] ?? "C";
  const b = parts.length > 1 ? (parts[1]?.[0] ?? "O") : (parts[0]?.[1] ?? "O");
  return (a + b).toUpperCase();
}

function parseBenefits(v?: string | null): string[] {
  if (!v) return [];
  return v
    .split(/[\n,]/g)
    .map((s) => s.trim())
    .filter(Boolean);
}

function yearOnly(d?: string | Date | null) {
  if (!d) return "—";
  const dt = typeof d === "string" ? new Date(d) : d;
  return Number.isNaN(dt.getTime()) ? "—" : String(dt.getFullYear());
}

export default function CompanyDetails() {
  const { id } = useParams(); // /companies/:id

  const companyId = useMemo(() => Number(id), [id]);

  const [company, setCompany] = useState<CompanyApi | null>(null);
  const [jobs, setJobs] = useState<JobApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 1) load company
  useEffect(() => {
    if (!Number.isFinite(companyId)) {
      setError("Invalid company id");
      setLoading(false);
      return;
    }

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/companies/${companyId}`);
        setCompany(res.data as CompanyApi);
      } catch (e: any) {
        setError(e?.response?.data?.message || "Failed to load company");
        setCompany(null);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [companyId]);

  // 2) load jobs for that company
  useEffect(() => {
    if (!Number.isFinite(companyId)) {
      setLoadingJobs(false);
      return;
    }

    const loadJobs = async () => {
      setLoadingJobs(true);
      try {
        // ✅ choose the endpoint you already have
        // Option A (recommended): implement GET /jobs/company/:id
        const res = await api.get(`/jobs/company/${companyId}`);

        // Option B (if your backend returns shape differently): adjust here
        const list = Array.isArray(res.data) ? (res.data as JobApi[]) : [];
        setJobs(list);
      } catch (e) {
        // Don't block page if jobs fail
        setJobs([]);
      } finally {
        setLoadingJobs(false);
      }
    };

    loadJobs();
  }, [companyId]);

  const ui = useMemo(() => {
    if (!company) return null;

    return {
      name: company.companyName ?? "",
      logoText: initials(company.companyName ?? ""),
      location: company.location ?? "—",
      industry: company.industry ?? "Unknown",
      size: company.companySize ?? "—",
      founded: yearOnly(company.founded),
      website: company.url ?? "",
      email: company.email ?? "",
      verified: Boolean(company.verified), // if not in DB, will be false
      description: company.description ?? "",
      benefits: parseBenefits(company.benefitsAndPerks),
    };
  }, [company]);

  return (
    <MainLayout>
      <div className="bg-muted/30 min-h-screen">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-12">
          <div className="container mx-auto px-4">
            <Link
              to="/companies"
              className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Companies
            </Link>

            {loading ? (
              <div className="text-primary-foreground/80">Loading...</div>
            ) : error ? (
              <div className="text-primary-foreground/90">
                <p className="font-semibold">Error</p>
                <p className="text-primary-foreground/80">{error}</p>
              </div>
            ) : !ui ? (
              <div className="text-primary-foreground/80">
                Company not found
              </div>
            ) : (
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="w-24 h-24 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center text-3xl font-bold overflow-hidden">
                  {/* If later you store a real logo URL in profilePic, you can render image here */}
                  {ui.logoText}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold">{ui.name}</h1>
                    {ui.verified && (
                      <Badge className="bg-white/20 text-white border-0">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-primary-foreground/80">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {ui.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Building2 className="w-4 h-4" />
                      {ui.industry}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {ui.size}
                    </span>
                  </div>
                </div>

                <Button
                  variant="secondary"
                  className="bg-white text-primary hover:bg-white/90"
                  asChild
                >
                  <a href={ui.email ? `mailto:${ui.email}` : "#"}>
                    <Mail className="w-4 h-4 mr-2" />
                    Contact Company
                  </a>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* About */}
              <div className="bg-card rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-foreground mb-4">
                  About {ui?.name || "Company"}
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {ui?.description || "—"}
                </p>
              </div>

              {/* Benefits */}
              <div className="bg-card rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-foreground mb-4">
                  Benefits & Perks
                </h2>

                {!ui || ui.benefits.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No benefits listed.
                  </p>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-3">
                    {ui.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                        <span className="text-muted-foreground">{benefit}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Open Positions (no JobCard dependency) */}
              <div className="bg-card rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-foreground">
                    Open Positions
                  </h2>
                  <Badge variant="secondary">{jobs.length} Jobs</Badge>
                </div>

                {loadingJobs ? (
                  <p className="text-sm text-muted-foreground">
                    Loading jobs...
                  </p>
                ) : jobs.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No jobs available.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {jobs.map((job) => (
                      <Link
                        key={job.id}
                        to={`/jobs/${job.id}`}
                        className="block p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <h3 className="font-semibold text-foreground truncate">
                              {job.jobTitle}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {job.jobType} • {job.location} • {job.salaryRange}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {job.jobDescription}
                            </p>
                          </div>
                          <Badge variant="outline">View</Badge>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Info */}
              <div className="bg-card rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-foreground mb-4">
                  Company Details
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Building2 className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Industry</p>
                      <p className="font-medium text-foreground">
                        {ui?.industry || "—"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Company Size
                      </p>
                      <p className="font-medium text-foreground">
                        {ui?.size || "—"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Founded</p>
                      <p className="font-medium text-foreground">
                        {ui?.founded || "—"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Briefcase className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Open Positions
                      </p>
                      <p className="font-medium text-foreground">
                        {jobs.length} Jobs
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div className="bg-card rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-foreground mb-4">Contact</h3>
                <div className="space-y-3">
                  {ui?.email ? (
                    <a
                      href={`mailto:${ui.email}`}
                      className="flex items-center gap-3 text-muted-foreground hover:text-primary"
                    >
                      <Mail className="w-5 h-5" />
                      <span className="text-sm">{ui.email}</span>
                    </a>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No email provided.
                    </p>
                  )}

                  {ui?.website ? (
                    <a
                      href={ui.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-muted-foreground hover:text-primary"
                    >
                      <Globe className="w-5 h-5" />
                      <span className="text-sm">Visit Website</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No website provided.
                    </p>
                  )}
                </div>
              </div>

              {/* Follow */}
              <div className="bg-card rounded-xl p-6 shadow-sm">
                <Button className="w-full">Follow Company</Button>
                <p className="text-sm text-muted-foreground text-center mt-2">
                  Get notified about new jobs
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
