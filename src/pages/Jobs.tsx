import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { JobCard, Job } from "@/components/jobs/JobCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  MapPin, 
  SlidersHorizontal, 
  X, 
  Grid3X3, 
  List,
  ChevronDown,
  Filter
} from "lucide-react";

const allJobs: Job[] = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    company: "TechCorp Inc.",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$120K - $180K",
    postedAt: "2 days ago",
    skills: ["React", "TypeScript", "Tailwind CSS"],
    featured: true,
    verified: true,
  },
  {
    id: "2",
    title: "Product Designer",
    company: "DesignHub",
    location: "Remote",
    type: "Full-time",
    salary: "$90K - $130K",
    postedAt: "1 day ago",
    skills: ["Figma", "UI/UX", "Design Systems"],
    verified: true,
  },
  {
    id: "3",
    title: "Marketing Intern",
    company: "GrowthStartup",
    location: "New York, NY",
    type: "Internship",
    salary: "$25/hour",
    postedAt: "3 days ago",
    skills: ["Social Media", "Content Writing", "Analytics"],
  },
  {
    id: "4",
    title: "Backend Engineer",
    company: "CloudScale",
    location: "Seattle, WA",
    type: "Full-time",
    salary: "$140K - $200K",
    postedAt: "5 hours ago",
    skills: ["Node.js", "Python", "AWS"],
    featured: true,
    verified: true,
  },
  {
    id: "5",
    title: "Data Analyst",
    company: "DataDriven Co.",
    location: "Chicago, IL",
    type: "Part-time",
    salary: "$50K - $70K",
    postedAt: "1 week ago",
    skills: ["SQL", "Python", "Tableau"],
  },
  {
    id: "6",
    title: "DevOps Engineer",
    company: "InfraCloud",
    location: "Remote",
    type: "Contract",
    salary: "$100/hour",
    postedAt: "4 days ago",
    skills: ["Kubernetes", "Docker", "CI/CD"],
    verified: true,
  },
  {
    id: "7",
    title: "UX Researcher",
    company: "UserFirst",
    location: "Boston, MA",
    type: "Full-time",
    salary: "$85K - $120K",
    postedAt: "6 hours ago",
    skills: ["User Research", "Interviews", "Analytics"],
  },
  {
    id: "8",
    title: "Mobile Developer",
    company: "AppWorks",
    location: "Austin, TX",
    type: "Full-time",
    salary: "$110K - $160K",
    postedAt: "2 days ago",
    skills: ["React Native", "iOS", "Android"],
    verified: true,
  },
  {
    id: "9",
    title: "Content Writer",
    company: "MediaPro",
    location: "Remote",
    type: "Part-time",
    salary: "$30/hour",
    postedAt: "5 days ago",
    skills: ["Copywriting", "SEO", "Research"],
  },
];

const jobTypes = ["Full-time", "Part-time", "Internship", "Contract"];
const experienceLevels = ["Entry Level", "Mid Level", "Senior", "Executive"];

export default function Jobs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  const activeFilters = selectedTypes.length;

  const clearFilters = () => {
    setSelectedTypes([]);
    setSearchQuery("");
    setLocationQuery("");
  };

  const toggleType = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const filteredJobs = allJobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          job.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesLocation = !locationQuery || job.location.toLowerCase().includes(locationQuery.toLowerCase());
    const matchesType = selectedTypes.length === 0 || selectedTypes.includes(job.type);
    return matchesSearch && matchesLocation && matchesType;
  });

  return (
    <MainLayout>
      {/* Hero/Search Section */}
      <section className="bg-muted/30 border-b border-border/50 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-foreground mb-6">Browse Jobs</h1>
          
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
            <Button size="lg" className="h-12 px-8">
              <Search className="h-5 w-5 mr-2" />
              Search
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="h-12 lg:hidden"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-5 w-5 mr-2" />
              Filters
              {activeFilters > 0 && (
                <Badge variant="primary" className="ml-2">{activeFilters}</Badge>
              )}
            </Button>
          </div>

          {/* Active filters */}
          {activeFilters > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {selectedTypes.map(type => (
                <Badge key={type} variant="secondary" className="gap-1.5">
                  {type}
                  <button onClick={() => toggleType(type)}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              <button 
                onClick={clearFilters}
                className="text-sm text-primary hover:underline"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Main content */}
      <section className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            {/* Sidebar filters - Desktop */}
            <aside className="hidden lg:block w-72 flex-shrink-0">
              <div className="sticky top-24 bg-card rounded-2xl border border-border/50 p-6 shadow-card">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-foreground">Filters</h2>
                  {activeFilters > 0 && (
                    <button onClick={clearFilters} className="text-sm text-primary hover:underline">
                      Reset
                    </button>
                  )}
                </div>

                {/* Job Type */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-foreground mb-3">Job Type</h3>
                  <div className="space-y-2">
                    {jobTypes.map(type => (
                      <label key={type} className="flex items-center gap-3 cursor-pointer group">
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

                {/* Experience Level */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-foreground mb-3">Experience Level</h3>
                  <div className="space-y-2">
                    {experienceLevels.map(level => (
                      <label key={level} className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="radio"
                          name="experience"
                          className="h-4 w-4 border-border text-primary focus:ring-primary/20"
                        />
                        <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                          {level}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Salary Range */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-foreground mb-3">Salary Range</h3>
                  <div className="space-y-3">
                    <input
                      type="range"
                      min="0"
                      max="300000"
                      className="w-full accent-primary"
                    />
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>$0</span>
                      <span>$300K+</span>
                    </div>
                  </div>
                </div>

                <Button className="w-full">Apply Filters</Button>
              </div>
            </aside>

            {/* Mobile filters */}
            {showFilters && (
              <div className="lg:hidden fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
                <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-background border-l border-border p-6 overflow-y-auto animate-slide-in-right">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold">Filters</h2>
                    <button onClick={() => setShowFilters(false)}>
                      <X className="h-6 w-6" />
                    </button>
                  </div>

                  {/* Job Type */}
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-foreground mb-3">Job Type</h3>
                    <div className="space-y-2">
                      {jobTypes.map(type => (
                        <label key={type} className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedTypes.includes(type)}
                            onChange={() => toggleType(type)}
                            className="h-4 w-4 rounded border-border text-primary"
                          />
                          <span className="text-sm text-muted-foreground">{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" className="flex-1" onClick={clearFilters}>
                      Reset
                    </Button>
                    <Button className="flex-1" onClick={() => setShowFilters(false)}>
                      Apply
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Job listings */}
            <div className="flex-1">
              {/* Results header */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-muted-foreground">
                  <span className="font-semibold text-foreground">{filteredJobs.length}</span> jobs found
                </p>
                <div className="flex items-center gap-3">
                  {/* Sort dropdown */}
                  <div className="relative hidden sm:block">
                    <select className="h-10 pl-4 pr-10 rounded-lg bg-background border border-border text-sm text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20">
                      <option>Latest</option>
                      <option>Salary: High to Low</option>
                      <option>Salary: Low to High</option>
                      <option>Most Relevant</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  </div>
                  {/* View toggle */}
                  <div className="flex items-center border border-border rounded-lg overflow-hidden">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 ${viewMode === "grid" ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:text-foreground"}`}
                    >
                      <Grid3X3 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 ${viewMode === "list" ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:text-foreground"}`}
                    >
                      <List className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Jobs grid */}
              {filteredJobs.length > 0 ? (
                <div className={viewMode === "grid" ? "grid md:grid-cols-2 gap-6" : "space-y-4"}>
                  {filteredJobs.map(job => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                    <Search className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">No jobs found</h3>
                  <p className="text-muted-foreground mb-6">Try adjusting your search or filters</p>
                  <Button variant="outline" onClick={clearFilters}>Clear Filters</Button>
                </div>
              )}

              {/* Pagination */}
              {filteredJobs.length > 0 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  <Button variant="outline" disabled>Previous</Button>
                  <Button variant="default" className="w-10 h-10 p-0">1</Button>
                  <Button variant="outline" className="w-10 h-10 p-0">2</Button>
                  <Button variant="outline" className="w-10 h-10 p-0">3</Button>
                  <span className="px-2 text-muted-foreground">...</span>
                  <Button variant="outline" className="w-10 h-10 p-0">10</Button>
                  <Button variant="outline">Next</Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
