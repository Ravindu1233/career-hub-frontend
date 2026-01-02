import { Link } from "react-router-dom";
import { JobCard, Job } from "@/components/jobs/JobCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const featuredJobs: Job[] = [
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
];

export function FeaturedJobs() {
  return (
    <section className="py-20 lg:py-28 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
              Featured <span className="text-gradient">Opportunities</span>
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
            Don't see the right fit? We have {formatNumber(10000)} more opportunities waiting for you.
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
