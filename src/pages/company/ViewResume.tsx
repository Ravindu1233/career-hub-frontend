import { useParams, Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  ArrowLeft,
  Download,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  GraduationCap,
  Award,
  ExternalLink,
  UserCheck,
  UserX,
  MessageSquare,
} from "lucide-react";

// Mock candidate data - in real app this would come from API
const mockCandidateData: Record<string, {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  appliedPosition: string;
  appliedDate: string;
  status: string;
  resumeUrl: string;
  summary: string;
  experience: Array<{
    title: string;
    company: string;
    location: string;
    period: string;
    description: string;
  }>;
  education: Array<{
    degree: string;
    school: string;
    year: string;
  }>;
  skills: string[];
  certifications: string[];
  portfolio: string;
  linkedin: string;
}> = {
  "1": {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    appliedPosition: "Senior Frontend Developer",
    appliedDate: "2024-01-15",
    status: "under_review",
    resumeUrl: "/resumes/john_doe_resume.pdf",
    summary: "Passionate frontend developer with 5+ years of experience building modern web applications. Specialized in React, TypeScript, and performance optimization. Strong advocate for clean code and user-centric design.",
    experience: [
      {
        title: "Senior Frontend Developer",
        company: "WebTech Solutions",
        location: "San Francisco, CA",
        period: "2021 - Present",
        description: "Led the frontend team in developing a large-scale SaaS platform. Implemented micro-frontend architecture, reducing build times by 60%. Mentored junior developers and established coding standards."
      },
      {
        title: "Frontend Developer",
        company: "StartupXYZ",
        location: "Remote",
        period: "2019 - 2021",
        description: "Built responsive web applications using React and Redux. Collaborated with UX designers to implement pixel-perfect interfaces. Improved page load performance by 40%."
      },
      {
        title: "Junior Developer",
        company: "Digital Agency Co",
        location: "Los Angeles, CA",
        period: "2018 - 2019",
        description: "Developed client websites and maintained existing applications. Learned modern JavaScript frameworks and best practices."
      }
    ],
    education: [
      {
        degree: "B.S. Computer Science",
        school: "University of California, Berkeley",
        year: "2018"
      }
    ],
    skills: ["React", "TypeScript", "JavaScript", "Node.js", "GraphQL", "CSS/SCSS", "Git", "AWS", "Docker", "Jest"],
    certifications: ["AWS Certified Developer", "Google Cloud Professional"],
    portfolio: "https://johndoe.dev",
    linkedin: "https://linkedin.com/in/johndoe"
  },
  "2": {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "+1 (555) 234-5678",
    location: "New York, NY",
    appliedPosition: "Backend Engineer",
    appliedDate: "2024-01-14",
    status: "interview_scheduled",
    resumeUrl: "/resumes/jane_smith_resume.pdf",
    summary: "Backend engineer with 7 years of experience in distributed systems and cloud architecture. Expert in Python, Go, and microservices. Passionate about building scalable and reliable systems.",
    experience: [
      {
        title: "Senior Backend Engineer",
        company: "CloudScale Inc",
        location: "New York, NY",
        period: "2020 - Present",
        description: "Designed and implemented microservices architecture handling 10M+ daily requests. Led database optimization projects reducing query times by 80%."
      },
      {
        title: "Backend Developer",
        company: "DataFlow Systems",
        location: "Boston, MA",
        period: "2017 - 2020",
        description: "Built RESTful APIs and data pipelines. Implemented CI/CD workflows and automated testing frameworks."
      }
    ],
    education: [
      {
        degree: "M.S. Computer Science",
        school: "MIT",
        year: "2017"
      },
      {
        degree: "B.S. Software Engineering",
        school: "Boston University",
        year: "2015"
      }
    ],
    skills: ["Python", "Go", "PostgreSQL", "Redis", "Kubernetes", "gRPC", "AWS", "Terraform", "Linux", "Docker"],
    certifications: ["Kubernetes Administrator", "AWS Solutions Architect"],
    portfolio: "https://janesmith.io",
    linkedin: "https://linkedin.com/in/janesmith"
  }
};

const getStatusBadge = (status: string) => {
  const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
    under_review: { label: "Under Review", variant: "secondary" },
    shortlisted: { label: "Shortlisted", variant: "default" },
    interview_scheduled: { label: "Interview Scheduled", variant: "default" },
    offered: { label: "Offered", variant: "default" },
    rejected: { label: "Rejected", variant: "destructive" },
  };
  const config = statusConfig[status] || { label: status, variant: "secondary" as const };
  return <Badge variant={config.variant}>{config.label}</Badge>;
};

export default function ViewResume() {
  const { id } = useParams<{ id: string }>();
  const candidate = mockCandidateData[id || "1"] || mockCandidateData["1"];

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/company/dashboard">Dashboard</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/company/dashboard">Applications</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{candidate.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Link to="/company/dashboard">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground">{candidate.name}</h1>
              <p className="text-muted-foreground mt-1">
                Applied for {candidate.appliedPosition}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download Resume
            </Button>
            <Button variant="outline" className="text-accent">
              <UserCheck className="h-4 w-4 mr-2" />
              Shortlist
            </Button>
            <Button variant="outline" className="text-destructive">
              <UserX className="h-4 w-4 mr-2" />
              Reject
            </Button>
            <Button>
              <MessageSquare className="h-4 w-4 mr-2" />
              Contact
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Contact & Quick Info */}
          <div className="space-y-6">
            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a href={`mailto:${candidate.email}`} className="text-sm text-primary hover:underline">
                    {candidate.email}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{candidate.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{candidate.location}</span>
                </div>
                {candidate.portfolio && (
                  <div className="flex items-center gap-3">
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    <a href={candidate.portfolio} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                      Portfolio
                    </a>
                  </div>
                )}
                {candidate.linkedin && (
                  <div className="flex items-center gap-3">
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    <a href={candidate.linkedin} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                      LinkedIn
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Application Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Application Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  {getStatusBadge(candidate.status)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Applied Date</span>
                  <span className="text-sm">{candidate.appliedDate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Position</span>
                  <span className="text-sm font-medium">{candidate.appliedPosition}</span>
                </div>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {candidate.skills.map((skill) => (
                    <Badge key={skill} variant="secondary">{skill}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Certifications */}
            {candidate.certifications.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    Certifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {candidate.certifications.map((cert) => (
                      <li key={cert} className="text-sm flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        {cert}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Professional Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {candidate.summary}
                </p>
              </CardContent>
            </Card>

            {/* Experience */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  Work Experience
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {candidate.experience.map((exp, index) => (
                    <div key={index} className="relative pl-6 border-l-2 border-muted">
                      <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-primary" />
                      <h4 className="font-semibold text-foreground">{exp.title}</h4>
                      <p className="text-sm text-primary">{exp.company}</p>
                      <p className="text-xs text-muted-foreground mb-2">
                        {exp.location} • {exp.period}
                      </p>
                      <p className="text-sm text-muted-foreground">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Education */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" />
                  Education
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {candidate.education.map((edu, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <GraduationCap className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">{edu.degree}</h4>
                        <p className="text-sm text-muted-foreground">{edu.school}</p>
                        <p className="text-xs text-muted-foreground">{edu.year}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
