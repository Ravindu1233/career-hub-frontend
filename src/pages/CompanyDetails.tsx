import { useParams, Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { JobCard } from "@/components/jobs/JobCard";
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
  Briefcase
} from "lucide-react";

const CompanyDetails = () => {
  const { id } = useParams();

  // Mock company data
  const company = {
    id: id,
    name: "TechCorp Inc.",
    logo: "TC",
    location: "New York, NY",
    industry: "Technology",
    size: "500-1000 employees",
    founded: "2010",
    website: "https://techcorp.com",
    email: "careers@techcorp.com",
    verified: true,
    description: "TechCorp Inc. is a leading technology company specializing in innovative software solutions for businesses worldwide. We're committed to creating cutting-edge products that transform how organizations operate.",
    culture: "At TechCorp, we believe in fostering a collaborative and inclusive work environment. Our team members are passionate about technology and driven to make a difference. We offer flexible work arrangements, continuous learning opportunities, and a supportive community.",
    benefits: [
      "Competitive salary & equity",
      "Health, dental, and vision insurance",
      "Unlimited PTO",
      "Remote work options",
      "Professional development budget",
      "401(k) matching"
    ],
    jobs: [
      {
        id: "1",
        title: "Senior Frontend Developer",
        company: "TechCorp Inc.",
        location: "New York, NY",
        type: "Full-time" as const,
        salary: "$120,000 - $150,000",
        postedAt: "2 days ago",
        skills: ["React", "TypeScript", "Tailwind"],
        featured: true
      },
      {
        id: "2",
        title: "Backend Engineer",
        company: "TechCorp Inc.",
        location: "New York, NY",
        type: "Full-time" as const,
        salary: "$130,000 - $160,000",
        postedAt: "3 days ago",
        skills: ["Node.js", "PostgreSQL", "AWS"],
        featured: false
      },
      {
        id: "3",
        title: "Product Designer",
        company: "TechCorp Inc.",
        location: "Remote",
        type: "Full-time" as const,
        salary: "$100,000 - $130,000",
        postedAt: "1 week ago",
        skills: ["Figma", "UI/UX", "Design Systems"],
        featured: false
      }
    ]
  };

  return (
    <MainLayout>
      <div className="bg-muted/30 min-h-screen">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-12">
          <div className="container mx-auto px-4">
            <Link to="/companies" className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground mb-6">
              <ArrowLeft className="w-4 h-4" />
              Back to Companies
            </Link>

            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="w-24 h-24 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center text-3xl font-bold">
                {company.logo}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold">{company.name}</h1>
                  {company.verified && (
                    <Badge className="bg-white/20 text-white border-0">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-4 text-primary-foreground/80">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {company.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Building2 className="w-4 h-4" />
                    {company.industry}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {company.size}
                  </span>
                </div>
              </div>
              <Button variant="secondary" className="bg-white text-primary hover:bg-white/90">
                <Mail className="w-4 h-4 mr-2" />
                Contact Company
              </Button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* About */}
              <div className="bg-card rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-foreground mb-4">About {company.name}</h2>
                <p className="text-muted-foreground leading-relaxed">{company.description}</p>
              </div>

              {/* Culture */}
              <div className="bg-card rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-foreground mb-4">Company Culture</h2>
                <p className="text-muted-foreground leading-relaxed">{company.culture}</p>
              </div>

              {/* Benefits */}
              <div className="bg-card rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-foreground mb-4">Benefits & Perks</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {company.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-muted-foreground">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Open Positions */}
              <div className="bg-card rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-foreground">Open Positions</h2>
                  <Badge variant="secondary">{company.jobs.length} Jobs</Badge>
                </div>
                <div className="space-y-4">
                  {company.jobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Info */}
              <div className="bg-card rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-foreground mb-4">Company Details</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Building2 className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Industry</p>
                      <p className="font-medium text-foreground">{company.industry}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Company Size</p>
                      <p className="font-medium text-foreground">{company.size}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Founded</p>
                      <p className="font-medium text-foreground">{company.founded}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Briefcase className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Open Positions</p>
                      <p className="font-medium text-foreground">{company.jobs.length} Jobs</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div className="bg-card rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-foreground mb-4">Contact</h3>
                <div className="space-y-3">
                  <a href={`mailto:${company.email}`} className="flex items-center gap-3 text-muted-foreground hover:text-primary">
                    <Mail className="w-5 h-5" />
                    <span className="text-sm">{company.email}</span>
                  </a>
                  <a href={company.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-muted-foreground hover:text-primary">
                    <Globe className="w-5 h-5" />
                    <span className="text-sm">Visit Website</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Follow */}
              <div className="bg-card rounded-xl p-6 shadow-sm">
                <Button className="w-full">
                  Follow Company
                </Button>
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
};

export default CompanyDetails;
