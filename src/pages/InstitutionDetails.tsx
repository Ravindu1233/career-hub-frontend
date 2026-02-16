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
  CheckCircle,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

// =============================
// API Endpoints
// =============================
const API_INSTITUTION = (id: string) => `/institutions/${id}`;

const InstitutionDetails = () => {
  const { id } = useParams();

  // Fetch institution
  const {
    data: institution,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["institution", id],
    queryFn: async () => {
      const res = await api.get(API_INSTITUTION(id!));
      return res.data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-muted-foreground">Loading institution...</p>
        </div>
      </MainLayout>
    );
  }

  if (isError || !institution) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Institution not found</h2>
          <Link to="/institutions">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Institutions
            </Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  const courses = institution.courses || [];

  return (
    <MainLayout>
      <div className="bg-muted/30 min-h-screen">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-12">
          <div className="container mx-auto px-4">
            <Link
              to="/institutions"
              className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Institutions
            </Link>

            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="w-24 h-24 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center text-3xl font-bold">
                {institution.logo || institution.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold">{institution.name}</h1>
                </div>
                {institution.location && (
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="w-4 h-4" />
                    <span>{institution.location}</span>
                  </div>
                )}
                {institution.description && (
                  <p className="text-primary-foreground/90 max-w-2xl">
                    {institution.description}
                  </p>
                )}
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
                <h2 className="text-xl font-bold text-foreground mb-6">
                  Available Courses
                </h2>
                {courses.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No courses available yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {courses.map((course: any) => (
                      <div
                        key={course.id}
                        className="border border-border rounded-lg p-4 hover:border-primary/50 transition-colors"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-foreground">
                                {course.name}
                              </h3>
                              <Badge
                                variant={
                                  course.price?.toLowerCase().includes("free")
                                    ? "success"
                                    : "secondary"
                                }
                              >
                                {course.price}
                              </Badge>
                            </div>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                              {course.duration && (
                                <span className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {course.duration}
                                </span>
                              )}
                              {course.type && (
                                <span className="flex items-center gap-1">
                                  <BookOpen className="w-4 h-4" />
                                  {course.type}
                                </span>
                              )}
                              {course.spots && (
                                <span className="flex items-center gap-1">
                                  <Users className="w-4 h-4" />
                                  {course.spots} spots
                                </span>
                              )}
                            </div>
                            {course.startDate && (
                              <p className="text-sm text-muted-foreground mt-1">
                                Starts: {course.startDate}
                              </p>
                            )}
                          </div>
                          <Button>Enroll Now</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Info */}
              <div className="bg-card rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-foreground mb-4">
                  Quick Info
                </h3>
                <div className="space-y-4">
                  {institution.students && (
                    <div className="flex items-center gap-3">
                      <GraduationCap className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Students
                        </p>
                        <p className="font-medium text-foreground">
                          {institution.students}
                        </p>
                      </div>
                    </div>
                  )}
                  {institution.founded && (
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Founded</p>
                        <p className="font-medium text-foreground">
                          {institution.founded}
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Courses</p>
                      <p className="font-medium text-foreground">
                        {courses.length} Available
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div className="bg-card rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-foreground mb-4">
                  Contact Information
                </h3>
                <div className="space-y-3">
                  {institution.email && (
                    <a
                      href={`mailto:${institution.email}`}
                      className="flex items-center gap-3 text-muted-foreground hover:text-primary"
                    >
                      <Mail className="w-5 h-5" />
                      <span className="text-sm">{institution.email}</span>
                    </a>
                  )}
                  {institution.phone && (
                    <a
                      href={`tel:${institution.phone}`}
                      className="flex items-center gap-3 text-muted-foreground hover:text-primary"
                    >
                      <Phone className="w-5 h-5" />
                      <span className="text-sm">{institution.phone}</span>
                    </a>
                  )}
                  {institution.website && (
                    <a
                      href={institution.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-muted-foreground hover:text-primary"
                    >
                      <Globe className="w-5 h-5" />
                      <span className="text-sm">Visit Website</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
                {institution.email && (
                  <Button className="w-full mt-4" asChild>
                    <a href={`mailto:${institution.email}`}>
                      <Mail className="w-4 h-4 mr-2" />
                      Contact Institution
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default InstitutionDetails;
