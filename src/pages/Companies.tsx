import { useState } from "react";
import { Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  MapPin,
  Users,
  Briefcase,
  CheckCircle,
  Building2,
  Globe,
  Star,
} from "lucide-react";

const companies = [
  {
    id: 1,
    name: "TechCorp Global",
    logo: "TC",
    industry: "Technology",
    location: "San Francisco, CA",
    size: "1000-5000",
    openJobs: 24,
    rating: 4.5,
    verified: true,
    description: "Leading technology company specializing in cloud solutions and AI-powered applications.",
    founded: "2010",
  },
  {
    id: 2,
    name: "InnovateTech Solutions",
    logo: "IT",
    industry: "Software",
    location: "New York, NY",
    size: "500-1000",
    openJobs: 18,
    rating: 4.3,
    verified: true,
    description: "Innovative software development company building next-generation enterprise solutions.",
    founded: "2015",
  },
  {
    id: 3,
    name: "Digital Dynamics",
    logo: "DD",
    industry: "Digital Marketing",
    location: "Los Angeles, CA",
    size: "100-500",
    openJobs: 12,
    rating: 4.7,
    verified: true,
    description: "Full-service digital marketing agency helping brands grow their online presence.",
    founded: "2018",
  },
  {
    id: 4,
    name: "CloudFirst Inc",
    logo: "CF",
    industry: "Cloud Computing",
    location: "Seattle, WA",
    size: "500-1000",
    openJobs: 31,
    rating: 4.6,
    verified: true,
    description: "Enterprise cloud infrastructure and services provider.",
    founded: "2012",
  },
  {
    id: 5,
    name: "DataFlow Analytics",
    logo: "DA",
    industry: "Data Science",
    location: "Boston, MA",
    size: "100-500",
    openJobs: 8,
    rating: 4.4,
    verified: false,
    description: "Data analytics and business intelligence solutions for modern enterprises.",
    founded: "2019",
  },
  {
    id: 6,
    name: "FinanceHub",
    logo: "FH",
    industry: "Finance",
    location: "Chicago, IL",
    size: "1000-5000",
    openJobs: 15,
    rating: 4.2,
    verified: true,
    description: "Financial technology company revolutionizing personal and business finance.",
    founded: "2014",
  },
];

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

export default function Companies() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("All Industries");
  const [selectedSize, setSelectedSize] = useState("All Sizes");

  const filteredCompanies = companies.filter((company) => {
    const matchesSearch = company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesIndustry = selectedIndustry === "All Industries" || company.industry === selectedIndustry;
    const matchesSize = selectedSize === "All Sizes" || company.size === selectedSize;
    return matchesSearch && matchesIndustry && matchesSize;
  });

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
                <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
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
              Showing <span className="font-semibold text-foreground">{filteredCompanies.length}</span> companies
            </p>
          </div>

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
                    <p className="text-sm text-muted-foreground">{company.industry}</p>
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

          {filteredCompanies.length === 0 && (
            <div className="text-center py-16">
              <Building2 className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No companies found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
}
