import { useParams, Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Globe, 
  Mail, 
  Phone, 
  Clock, 
  Users, 
  BookOpen,
  GraduationCap,
  ArrowLeft,
  ExternalLink,
  Star,
  CheckCircle
} from "lucide-react";

const InstitutionDetails = () => {
  const { id } = useParams();

  // Mock institution data
  const institution = {
    id: id,
    name: "Tech Academy Rwanda",
    logo: "TA",
    location: "Kigali, Rwanda",
    description: "Tech Academy Rwanda is a leading technology education institution dedicated to empowering the next generation of tech professionals. We offer comprehensive programs in software development, data science, and digital marketing.",
    website: "https://techacademy.rw",
    email: "info@techacademy.rw",
    phone: "+250 788 000 000",
    founded: "2018",
    students: "2,500+",
    rating: 4.8,
    verified: true,
    courses: [
      {
        id: 1,
        name: "Full-Stack Web Development",
        duration: "6 months",
        startDate: "Feb 15, 2026",
        price: "Free",
        type: "Certificate",
        spots: 30
      },
      {
        id: 2,
        name: "Data Science & Analytics",
        duration: "4 months",
        startDate: "Mar 1, 2026",
        price: "$500",
        type: "Diploma",
        spots: 25
      },
      {
        id: 3,
        name: "Mobile App Development",
        duration: "5 months",
        startDate: "Feb 20, 2026",
        price: "$300",
        type: "Certificate",
        spots: 20
      },
      {
        id: 4,
        name: "Digital Marketing",
        duration: "3 months",
        startDate: "Mar 10, 2026",
        price: "Free",
        type: "Certificate",
        spots: 40
      }
    ],
    features: [
      "Industry-experienced instructors",
      "Hands-on project-based learning",
      "Job placement assistance",
      "Modern learning facilities",
      "Flexible schedule options",
      "Career mentorship program"
    ]
  };

  return (
    <MainLayout>
      <div className="bg-muted/30 min-h-screen">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-12">
          <div className="container mx-auto px-4">
            <Link to="/institutions" className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground mb-6">
              <ArrowLeft className="w-4 h-4" />
              Back to Institutions
            </Link>

            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="w-24 h-24 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center text-3xl font-bold">
                {institution.logo}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold">{institution.name}</h1>
                  {institution.verified && (
                    <Badge className="bg-white/20 text-white border-0">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-4 h-4" />
                  <span>{institution.location}</span>
                  <span className="mx-2">•</span>
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>{institution.rating} rating</span>
                </div>
                <p className="text-primary-foreground/90 max-w-2xl">{institution.description}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Courses */}
              <div className="bg-card rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-foreground mb-6">Available Courses</h2>
                <div className="space-y-4">
                  {institution.courses.map((course) => (
                    <div key={course.id} className="border border-border rounded-lg p-4 hover:border-primary/50 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-foreground">{course.name}</h3>
                            <Badge variant={course.price === "Free" ? "success" : "secondary"}>
                              {course.price}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {course.duration}
                            </span>
                            <span className="flex items-center gap-1">
                              <BookOpen className="w-4 h-4" />
                              {course.type}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {course.spots} spots
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            Starts: {course.startDate}
                          </p>
                        </div>
                        <Button>Enroll Now</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div className="bg-card rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-foreground mb-6">Why Choose Us</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {institution.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Info */}
              <div className="bg-card rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-foreground mb-4">Quick Info</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <GraduationCap className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Students</p>
                      <p className="font-medium text-foreground">{institution.students}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Founded</p>
                      <p className="font-medium text-foreground">{institution.founded}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Courses</p>
                      <p className="font-medium text-foreground">{institution.courses.length} Available</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div className="bg-card rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-foreground mb-4">Contact Information</h3>
                <div className="space-y-3">
                  <a href={`mailto:${institution.email}`} className="flex items-center gap-3 text-muted-foreground hover:text-primary">
                    <Mail className="w-5 h-5" />
                    <span className="text-sm">{institution.email}</span>
                  </a>
                  <a href={`tel:${institution.phone}`} className="flex items-center gap-3 text-muted-foreground hover:text-primary">
                    <Phone className="w-5 h-5" />
                    <span className="text-sm">{institution.phone}</span>
                  </a>
                  <a href={institution.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-muted-foreground hover:text-primary">
                    <Globe className="w-5 h-5" />
                    <span className="text-sm">Visit Website</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <Button className="w-full mt-4">
                  <Mail className="w-4 h-4 mr-2" />
                  Contact Institution
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default InstitutionDetails;
