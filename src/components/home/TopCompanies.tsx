import { useEffect, useMemo, useState } from "react";
import { CheckCircle } from "lucide-react";
import { api } from "@/lib/api";

type CompanyApi = {
  companyId?: number | string;
  id?: number | string;
  companyName?: string;
  name?: string;
  status?: string;
  openJobs?: number;
};

export function TopCompanies() {
  const [companies, setCompanies] = useState<CompanyApi[]>([]);
  const [jobsCount, setJobsCount] = useState(0);

  useEffect(() => {
    let alive = true;

    const loadData = async () => {
      try {
        const [companiesRes, jobsRes] = await Promise.all([
          api.get("/companies"),
          api.get("/jobs"),
        ]);

        const companiesData = Array.isArray(companiesRes.data)
          ? (companiesRes.data as CompanyApi[])
          : [];
        const jobsData = Array.isArray(jobsRes.data) ? jobsRes.data : [];

        if (!alive) return;
        setCompanies(companiesData);
        setJobsCount(jobsData.length);
      } catch {
        if (!alive) return;
        setCompanies([]);
        setJobsCount(0);
      }
    };

    loadData();
    return () => {
      alive = false;
    };
  }, []);

  const topCompanies = useMemo(() => companies.slice(0, 6), [companies]);
  const totalOpenRoles = useMemo(
    () =>
      companies.reduce((sum, company) => {
        const openJobs =
          typeof company.openJobs === "number" &&
          Number.isFinite(company.openJobs)
            ? company.openJobs
            : 0;
        return sum + Math.max(0, openJobs);
      }, 0),
    [companies],
  );

  const formatCount = (value: number) => {
    if (value >= 1000) return `${Math.round(value / 1000)}K+`;
    return value.toString();
  };

  return (
    <section className="py-16 bg-background border-y border-border/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
            Trusted by Leading Companies
          </h2>
          <p className="text-muted-foreground">
            Join thousands of top employers already hiring on our platform
          </p>
        </div>

        {/* Company logos grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {topCompanies.map((company) => {
            const companyName =
              company.companyName || company.name || "Company";
            const verified =
              !company.status || company.status.toUpperCase() === "APPROVED";
            const key = company.companyId ?? company.id ?? companyName;
            return (
              <div
                key={String(key)}
                className="group relative flex flex-col items-center justify-center p-6 rounded-2xl border border-border/50 bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                {/* Placeholder for company logo */}
                <div className="h-12 w-32 bg-muted rounded-lg flex items-center justify-center mb-3 grayscale group-hover:grayscale-0 transition-all duration-300">
                  <span className="px-2 text-center text-sm font-bold leading-tight text-muted-foreground group-hover:text-foreground transition-colors line-clamp-2 break-words">
                    {companyName}
                  </span>
                </div>

                {verified && (
                  <div className="flex items-center gap-1 text-xs text-success">
                    <CheckCircle className="h-3.5 w-3.5" />
                    <span>Verified</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Stats */}
        <div className="flex flex-wrap items-center justify-center gap-8 mt-12 pt-12 border-t border-border/50">
          {[
            {
              value: formatCount(companies.length),
              label: "Enterprise Partners",
            },
            {
              value: formatCount(jobsCount),
              label: "Active Job Postings",
            },
            {
              value: formatCount(totalOpenRoles),
              label: "Open Roles",
            },
          ].map((stat) => (
            <div key={stat.label} className="text-center px-8">
              <div className="text-3xl font-bold text-primary mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
