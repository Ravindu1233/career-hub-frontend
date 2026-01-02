import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { JobCard, Job } from "@/components/jobs/JobCard";
import {
  MapPin,
  Clock,
  Bookmark,
  Share2,
  Building2,
  DollarSign,
  Calendar,
  Users,
  Globe,
  CheckCircle,
  Briefcase,
  GraduationCap,
  Heart,
  Coffee,
  Laptop,
  Plane,
  ChevronRight,
} from "lucide-react";

// Mock data
const jobData = {
  id: "1",
  title: "Senior Frontend Developer",
  company: "TechCorp Inc.",
  companyLogo: "",
  location: "San Francisco, CA",
  type: "Full-time" as const,
  salary: "$120K - $180K",
  postedAt: "2 days ago",
  deadline: "Jan 15, 2026",
  applicants: 47,
  skills: ["React", "TypeScript", "Tailwind CSS", "Node.js", "GraphQL"],
  featured: true,
  verified: true,
  description: `We are looking for an experienced Senior Frontend Developer to join our growing team. You will be responsible for building and maintaining our web applications, working closely with designers and backend developers to deliver exceptional user experiences.

This is an exciting opportunity to work on cutting-edge technologies and make a significant impact on our product. You'll be joining a team of passionate engineers who care deeply about code quality and user experience.`,
  responsibilities: [
    "Develop and maintain responsive web applications using React and TypeScript",
    "Collaborate with UI/UX designers to implement pixel-perfect designs",
    "Write clean, maintainable, and well-documented code",
    "Participate in code reviews and provide constructive feedback",
    "Optimize applications for maximum speed and scalability",
    "Stay up-to-date with the latest frontend technologies and best practices",
  ],
  requirements: [
    "5+ years of experience in frontend development",
    "Strong proficiency in React, TypeScript, and modern CSS",
    "Experience with state management solutions (Redux, Zustand, etc.)",
    "Familiarity with testing frameworks (Jest, React Testing Library)",
    "Excellent problem-solving and communication skills",
    "Bachelor's degree in Computer Science or related field (or equivalent experience)",
  ],
  benefits: [
    { icon: Heart, text: "Comprehensive health, dental, and vision insurance" },
    { icon: Coffee, text: "Unlimited PTO and flexible working hours" },
    { icon: Laptop, text: "Remote-first culture with optional office access" },
    { icon: Plane, text: "Annual learning budget and conference attendance" },
    { icon: DollarSign, text: "Competitive salary with equity options" },
  ],
  companyInfo: {
    name: "TechCorp Inc.",
    size: "500-1000 employees",
    industry: "Technology",
    website: "https://techcorp.example.com",
    description: "TechCorp is a leading technology company focused on building innovative solutions for enterprises. We're passionate about creating products that make a difference.",
  },
};

const similarJobs: Job[] = [
  {
    id: "2",
    title: "Frontend Engineer",
    company: "StartupXYZ",
    location: "Remote",
    type: "Full-time",
    salary: "$100K - $140K",
    postedAt: "1 day ago",
    skills: ["React", "Vue", "JavaScript"],
    verified: true,
  },
  {
    id: "3",
    title: "React Developer",
    company: "WebAgency",
    location: "New York, NY",
    type: "Full-time",
    salary: "$90K - $130K",
    postedAt: "3 days ago",
    skills: ["React", "Redux", "CSS"],
  },
  {
    id: "4",
    title: "UI Engineer",
    company: "DesignTech",
    location: "Austin, TX",
    type: "Full-time",
    salary: "$110K - $160K",
    postedAt: "5 hours ago",
    skills: ["React", "Figma", "Storybook"],
    featured: true,
    verified: true,
  },
];

export default function JobDetails() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<"overview" | "company" | "similar">("overview");
  const [saved, setSaved] = useState(false);

  return (
    <MainLayout>
      {/* Breadcrumb */}
      <div className="bg-muted/30 border-b border-border/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground">Home</Link>
            <ChevronRight className="h-4 w-4" />
            <Link to="/jobs" className="hover:text-foreground">Jobs</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">{jobData.title}</span>
          </div>
        </div>
      </div>

      {/* Job Header */}
      <section className="bg-muted/30 pb-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6 lg:items-start">
            {/* Left: Job info */}
            <div className="flex-1">
              <div className="flex items-start gap-4 mb-4">
                {/* Company logo */}
                <div className="h-16 w-16 lg:h-20 lg:w-20 rounded-2xl bg-card border border-border/50 flex items-center justify-center flex-shrink-0 shadow-card">
                  {jobData.companyLogo ? (
                    <img src={jobData.companyLogo} alt={jobData.company} className="h-full w-full object-cover rounded-2xl" />
                  ) : (
                    <Building2 className="h-8 w-8 lg:h-10 lg:w-10 text-muted-foreground" />
                  )}
                </div>

                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">{jobData.title}</h1>
                  <div className="flex items-center gap-3 flex-wrap">
                    <Link to="#" className="text-lg text-primary hover:underline">{jobData.company}</Link>
                    {jobData.verified && (
                      <Badge variant="success" className="gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Verified Company
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick info */}
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{jobData.location}</span>
                </div>
                <Badge variant="primary">{jobData.type}</Badge>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Posted {jobData.postedAt}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{jobData.applicants} applicants</span>
                </div>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3">
              <Button size="lg" className="flex-1 lg:w-48" asChild>
                <Link to={`/jobs/${id}/apply`}>Apply Now</Link>
              </Button>
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className={`flex-1 ${saved ? "text-warning border-warning" : ""}`}
                  onClick={() => setSaved(!saved)}
                >
                  <Bookmark className={`h-5 w-5 ${saved ? "fill-current" : ""}`} />
                  {saved ? "Saved" : "Save"}
                </Button>
                <Button variant="outline" size="lg" className="flex-1">
                  <Share2 className="h-5 w-5" />
                  Share
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
                      <p className="text-lg font-bold text-foreground">{jobData.salary}</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-card border border-border/50 shadow-card">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                      <Briefcase className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Experience</p>
                      <p className="text-lg font-bold text-foreground">5+ years</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-card border border-border/50 shadow-card">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-warning" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Deadline</p>
                      <p className="text-lg font-bold text-foreground">{jobData.deadline}</p>
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
                  {/* Description */}
                  <div>
                    <h2 className="text-xl font-semibold text-foreground mb-4">Job Description</h2>
                    <p className="text-muted-foreground whitespace-pre-line">{jobData.description}</p>
                  </div>

                  {/* Responsibilities */}
                  <div>
                    <h2 className="text-xl font-semibold text-foreground mb-4">Responsibilities</h2>
                    <ul className="space-y-3">
                      {jobData.responsibilities.map((item, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Requirements */}
                  <div>
                    <h2 className="text-xl font-semibold text-foreground mb-4">Requirements</h2>
                    <ul className="space-y-3">
                      {jobData.requirements.map((item, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Skills */}
                  <div>
                    <h2 className="text-xl font-semibold text-foreground mb-4">Required Skills</h2>
                    <div className="flex flex-wrap gap-2">
                      {jobData.skills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="px-4 py-1.5 text-sm">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Benefits */}
                  <div>
                    <h2 className="text-xl font-semibold text-foreground mb-4">Benefits</h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {jobData.benefits.map((benefit, index) => (
                        <div key={index} className="flex items-center gap-3 p-4 rounded-xl bg-muted/50">
                          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <benefit.icon className="h-5 w-5 text-primary" />
                          </div>
                          <span className="text-sm text-foreground">{benefit.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
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
                        <h3 className="text-xl font-semibold text-foreground">{jobData.companyInfo.name}</h3>
                        <p className="text-muted-foreground">{jobData.companyInfo.industry}</p>
                      </div>
                    </div>
                    <p className="text-muted-foreground mb-6">{jobData.companyInfo.description}</p>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3">
                        <Users className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm">{jobData.companyInfo.size}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Globe className="h-5 w-5 text-muted-foreground" />
                        <a href={jobData.companyInfo.website} className="text-sm text-primary hover:underline">
                          Visit Website
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "similar" && (
                <div className="grid md:grid-cols-2 gap-6">
                  {similarJobs.map(job => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>
              )}
            </div>

            {/* Right sidebar */}
            <aside className="lg:w-80 flex-shrink-0">
              <div className="sticky top-24 space-y-6">
                {/* Quick apply card */}
                <div className="p-6 rounded-2xl bg-card border border-border/50 shadow-card">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Quick Apply</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Submit your application in just a few clicks. Takes about 2 minutes.
                  </p>
                  <Button className="w-full" size="lg" asChild>
                    <Link to={`/jobs/${id}/apply`}>Apply Now</Link>
                  </Button>
                </div>

                {/* Company card */}
                <div className="p-6 rounded-2xl bg-card border border-border/50 shadow-card">
                  <h3 className="text-lg font-semibold text-foreground mb-4">About the Company</h3>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{jobData.company}</p>
                      <p className="text-sm text-muted-foreground">{jobData.companyInfo.industry}</p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">View Company Profile</Button>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
