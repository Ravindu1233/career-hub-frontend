import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { Search, MapPin, Briefcase, ChevronDown, Building2, GraduationCap, BookOpen } from "lucide-react";

type CounterStats = {
  jobs: number;
  companies: number;
  institutions: number;
  courses: number;
};

type InstitutionSummary = {
  courses?: unknown[] | null;
};

const HERO_STATS_CACHE_KEY = "hero_stats_cache_v1";
const DEFAULT_COUNTERS: CounterStats = {
  jobs: 0,
  companies: 0,
  institutions: 0,
  courses: 0,
};

function parseCachedCounters(): CounterStats {
  try {
    const raw = localStorage.getItem(HERO_STATS_CACHE_KEY);
    if (!raw) return DEFAULT_COUNTERS;
    const parsed = JSON.parse(raw) as Partial<CounterStats>;
    return {
      jobs: Number.isFinite(parsed.jobs) ? Number(parsed.jobs) : 0,
      companies: Number.isFinite(parsed.companies) ? Number(parsed.companies) : 0,
      institutions: Number.isFinite(parsed.institutions) ? Number(parsed.institutions) : 0,
      courses: Number.isFinite(parsed.courses) ? Number(parsed.courses) : 0,
    };
  } catch {
    return DEFAULT_COUNTERS;
  }
}

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [counters, setCounters] = useState<CounterStats>(() => parseCachedCounters());

  useEffect(() => {
    let alive = true;

    const loadHeroStats = async () => {
      try {
        const [jobsRes, companiesRes, institutionsRes] = await Promise.all([
          api.get("/jobs"),
          api.get("/companies"),
          api.get("/institutions"),
        ]);

        const jobs = Array.isArray(jobsRes.data) ? jobsRes.data : [];
        const companies = Array.isArray(companiesRes.data) ? companiesRes.data : [];
        const institutions = Array.isArray(institutionsRes.data)
          ? (institutionsRes.data as InstitutionSummary[])
          : [];
        const totalCourses = institutions.reduce((sum, institution) => {
          const count = Array.isArray(institution?.courses) ? institution.courses.length : 0;
          return sum + count;
        }, 0);

        if (!alive) return;

        const nextCounters: CounterStats = {
          jobs: jobs.length,
          companies: companies.length,
          institutions: institutions.length,
          courses: totalCourses,
        };

        setCounters(nextCounters);
        localStorage.setItem(HERO_STATS_CACHE_KEY, JSON.stringify(nextCounters));
      } catch {
        if (alive) {
          setCounters(parseCachedCounters());
        }
      }
    };

    loadHeroStats();
    return () => {
      alive = false;
    };
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K+`;
    return num.toString();
  };

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 gradient-hero opacity-95" />
      
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 rounded-full blur-3xl" />
      </div>
      
      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm font-medium mb-8 animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
            </span>
            Trusted by {formatNumber(counters.companies)} companies worldwide
          </div>

          {/* Main heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 animate-slide-up">
            Connect Talent with{" "}
            <span className="relative">
              <span className="relative z-10">Opportunity</span>
              <span className="absolute bottom-2 left-0 w-full h-3 bg-white/20 -skew-x-3 rounded" />
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: "0.1s" }}>
            Your complete platform for job seekers, employers, and career guidance. Find your dream job or perfect candidate today.
          </p>

          {/* Search bar */}
          <div className="glass rounded-2xl p-2 max-w-3xl mx-auto mb-10 animate-scale-in" style={{ animationDelay: "0.2s" }}>
            <div className="flex flex-col md:flex-row gap-2">
              {/* Job search input */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Job title, skills, or company"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-12 pl-12 pr-4 rounded-xl bg-background border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Location input */}
              <div className="flex-1 relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="City or remote"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full h-12 pl-12 pr-4 rounded-xl bg-background border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Job type dropdown */}
              <div className="relative md:w-48">
                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <select className="w-full h-12 pl-12 pr-10 rounded-xl bg-background border-0 text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer">
                  <option value="">Job Type</option>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="internship">Internship</option>
                  <option value="contract">Contract</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
              </div>

              {/* Search button */}
              <Button variant="warning" size="lg" className="h-12 px-8">
                <Search className="h-5 w-5 mr-2" />
                Search Jobs
              </Button>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <Button variant="hero" size="xl" asChild>
              <Link to="/jobs">Find Jobs</Link>
            </Button>
            <Button variant="hero-outline" size="xl" asChild>
              <Link to="/register?role=employer">Post a Job</Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: "0.4s" }}>
            {[
              { label: "Active Jobs", value: formatNumber(counters.jobs), icon: Briefcase },
              { label: "Companies", value: formatNumber(counters.companies), icon: Building2 },
              { label: "Institutions", value: formatNumber(counters.institutions), icon: GraduationCap },
              { label: "Courses", value: formatNumber(counters.courses), icon: BookOpen },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-white/10 backdrop-blur-sm mb-3">
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-white/70">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-subtle">
        <div className="w-8 h-12 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
          <div className="w-1.5 h-3 rounded-full bg-white/50 animate-pulse" />
        </div>
      </div>
    </section>
  );
}
