import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api";
import {
  Search,
  MapPin,
  Users,
  Briefcase,
  CheckCircle,
  Building2,
  Star,
} from "lucide-react";

// ✅ Keep your UI filter options (same as before)
const industries = [
  "All Industries",
  "Technology",
  "Software",
  "Digital Marketing",
  "Cloud Computing",
  "Data Science",
  "Finance",
  "Healthcare",
  "Education",
];

const companySizes = [
  "All Sizes",
  "1-50",
  "50-100",
  "100-500",
  "500-1000",
  "1000-5000",
  "5000+",
];

// ---- Types ----
type CompanyApi = {
  companyId: number;
  companyName: string;
  industry?: string | null;
  location?: string | null;
  companySize?: string | null;
  description?: string | null;
  verified?: boolean | null;
  rating?: number | null;
  openJobs?: number | null;
};

type CompanyUI = {
  id: number;
  name: string;
  logo: string;
  industry: string;
  location: string;
  size: string;
  openJobs: number;
  rating: number;
  verified: boolean;
  description: string;
};

function initials(name: string) {
  const parts = (name || "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "CO";
  const a = parts[0]?.[0] ?? "C";
  const b = parts.length > 1 ? (parts[1]?.[0] ?? "O") : (parts[0]?.[1] ?? "O");
  return (a + b).toUpperCase();
}

function toUI(c: CompanyApi): CompanyUI {
  return {
    id: c.companyId,
    name: c.companyName ?? "",
    logo: initials(c.companyName ?? ""),
    industry: c.industry ?? "Unknown",
    location: c.location ?? "—",
    size: c.companySize ?? "—",
    openJobs: Number.isFinite(c.openJobs as number)
      ? (c.openJobs as number)
      : 0,
    rating: Number.isFinite(c.rating as number) ? (c.rating as number) : 0,
    verified: Boolean(c.verified),
    description: c.description ?? "",
  };
}

export default function Companies() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("All Industries");
  const [selectedSize, setSelectedSize] = useState("All Sizes");

  // ✅ data from backend (no dummy)
  const [companies, setCompanies] = useState<CompanyUI[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCompanies = async () => {
      setLoading(true);
      setError(null);
      try {
        // ✅ IMPORTANT:
        // Your backend should have a route like GET /companies
        // that returns an array of companies.
        const res = await api.get("/companies");
        const list = Array.isArray(res.data) ? (res.data as CompanyApi[]) : [];
        setCompanies(list.map(toUI));
      } catch (e: any) {
        setError(e?.response?.data?.message || "Failed to load companies");
        setCompanies([]);
      } finally {
        setLoading(false);
      }
    };

    loadCompanies();
  }, []);

  const filteredCompanies = useMemo(() => {
    return companies.filter((company) => {
      const matchesSearch =
        company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesIndustry =
        selectedIndustry === "All Industries" ||
        company.industry === selectedIndustry;

      const matchesSize =
        selectedSize === "All Sizes" || company.size === selectedSize;

      return matchesSearch && matchesIndustry && matchesSize;
    });
  }, [companies, searchQuery, selectedIndustry, selectedSize]);

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center text-primary-foreground mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Discover Top Companies
            </h1>
            <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
              Explore verified employers and find your perfect workplace
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-4xl mx-auto">
            <div className="glass rounded-2xl p-4 md:p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Search companies..."
                    className="pl-10 h-12 bg-background"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <Select
                  value={selectedIndustry}
                  onValueChange={setSelectedIndustry}
                >
                  <SelectTrigger className="w-full md:w-48 h-12 bg-background">
                    <SelectValue placeholder="Industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedSize} onValueChange={setSelectedSize}>
                  <SelectTrigger className="w-full md:w-48 h-12 bg-background">
                    <SelectValue placeholder="Company Size" />
                  </SelectTrigger>
                  <SelectContent>
                    {companySizes.map((size) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <p className="text-muted-foreground">
              Showing{" "}
              <span className="font-semibold text-foreground">
                {filteredCompanies.length}
              </span>{" "}
              companies
            </p>
          </div>

          {/* Optional (minimal) status text */}
          {loading && (
            <p className="text-sm text-muted-foreground mb-6">
              Loading companies...
            </p>
          )}
          {error && <p className="text-sm text-destructive mb-6">{error}</p>}

          {/* Companies Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanies.map((company) => (
              <Link
                key={company.id}
                to={`/companies/${company.id}`}
                className="group bg-card rounded-xl border border-border p-6 card-hover"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                    {company.logo}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                        {company.name}
                      </h3>
                      {company.verified && (
                        <CheckCircle className="h-5 w-5 text-success fill-success/20" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {company.industry}
                    </p>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {company.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {company.location}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    {company.size}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-warning fill-warning" />
                    <span className="font-medium">{company.rating}</span>
                  </div>
                  <Badge variant="primary">
                    <Briefcase className="h-3 w-3 mr-1" />
                    {company.openJobs} Open Jobs
                  </Badge>
                </div>
              </Link>
            ))}
          </div>

          {!loading && filteredCompanies.length === 0 && (
            <div className="text-center py-16">
              <Building2 className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No companies found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
}
