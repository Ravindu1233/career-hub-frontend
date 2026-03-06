import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap,
  Plus,
  Edit3,
  Trash2,
  BookOpen,
  MapPin,
  ArrowLeft,
  Eye,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

// =============================
// API Endpoints
// =============================
const API_MY_INSTITUTIONS = "/institutions/my-institutions";
const API_DELETE_INSTITUTION = (id: string) => `/institutions/${id}`;
const API_USER_ME = "/users/me";
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

// =============================
// Types
// =============================
interface Institution {
  id: string;
  name: string;
  logo?: string | null;
  location?: string | null;
  email: string;
  phone?: string | null;
  website?: string | null;
  description?: string | null;
  founded?: string | null;
  students?: string | null;
  createdAt: string;
  courses?: any[];
  status?: "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED";
  rejectionReason?: string | null;
}

interface UserMe {
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  mobile?: string | null;
  address?: string | null;
  dob?: string | null;
}

export default function MyInstitutions() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [brokenLogoIds, setBrokenLogoIds] = useState<Record<string, true>>({});

  const resolveLogoUrl = (logo?: string | null) => {
    if (!logo) return null;
    const trimmed = logo.trim();
    if (!trimmed) return null;
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    if (trimmed.startsWith("data:")) return trimmed;
    return `${API_BASE}${trimmed.startsWith("/") ? trimmed : `/${trimmed}`}`;
  };

  // Fetch institutions
  const {
    data: institutions = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["my-institutions"],
    queryFn: async () => {
      const res = await api.get(API_MY_INSTITUTIONS);
      return (res.data ?? []) as Institution[];
    },
  });

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["user-me"],
    queryFn: async () => {
      const res = await api.get(API_USER_ME);
      return res.data as UserMe;
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(API_DELETE_INSTITUTION(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-institutions"] });
      toast({
        title: "Institution deleted",
        description: "Institution has been removed successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to delete",
        description:
          error?.response?.data?.message ||
          "An error occurred. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  const getInstitutionStatusBadge = (status?: Institution["status"]) => {
    const s = String(status || "PENDING").toUpperCase();
    if (s === "APPROVED") {
      return <Badge className="bg-green-500/10 text-green-600">Approved</Badge>;
    }
    if (s === "REJECTED") {
      return (
        <Badge className="bg-destructive/10 text-destructive">Rejected</Badge>
      );
    }
    if (s === "SUSPENDED") {
      return <Badge className="bg-orange-500/10 text-orange-600">Suspended</Badge>;
    }
    return <Badge className="bg-muted text-muted-foreground">Pending</Badge>;
  };

  const getMissingProfileFields = () => {
    const fullName = `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim();
    const missing: string[] = [];

    if (!fullName) missing.push("Full Name");
    if (!user?.email?.trim()) missing.push("Email");
    if (!user?.mobile?.trim()) missing.push("Phone");
    if (!user?.address?.trim()) missing.push("Location");
    if (!user?.dob?.trim()) missing.push("Date of Birth");

    return missing;
  };

  const handleAddInstitutionClick = () => {
    if (userLoading) {
      toast({
        title: "Please wait",
        description: "Loading your profile details...",
      });
      return;
    }

    const missing = getMissingProfileFields();
    if (missing.length > 0) {
      toast({
        title: "Complete your profile first",
        description: `Please fill: ${missing.join(", ")}`,
        variant: "destructive",
      });
      navigate("/user/profile");
      return;
    }

    navigate("/user/institutions/add");
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              My Institutions
            </h1>
            <Button
              variant="ghost"
              onClick={() => navigate("/user/dashboard")}
              className="gap-2 mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
            <p className="text-muted-foreground mt-1">
              Manage your educational institutions and their courses
            </p>
          </div>
          <Button className="gap-2" onClick={handleAddInstitutionClick}>
              <Plus className="h-4 w-4" />
              Add Institution
          </Button>
        </div>

        {isLoading ? (
          <Card>
            <CardContent className="py-16 text-center">
              <p className="text-muted-foreground">Loading institutions...</p>
            </CardContent>
          </Card>
        ) : isError ? (
          <Card>
            <CardContent className="py-16 text-center">
              <p className="text-destructive mb-4">
                Failed to load institutions. Please try again.
              </p>
              <Button
                variant="outline"
                onClick={() =>
                  queryClient.invalidateQueries({
                    queryKey: ["my-institutions"],
                  })
                }
              >
                Retry
              </Button>
            </CardContent>
          </Card>
        ) : institutions.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <GraduationCap className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No institutions yet
              </h3>
              <p className="text-muted-foreground mb-4">
                Start by adding your first educational institution
              </p>
              <Button className="gap-2" onClick={handleAddInstitutionClick}>
                  <Plus className="h-4 w-4" />
                  Add Institution
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {institutions.map((inst) => {
              const coursesCount = inst.courses?.length || 0;
              const logoUrl = resolveLogoUrl(inst.logo);
              return (
                <Card
                  key={inst.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 text-xl font-bold text-primary">
                          {logoUrl && !brokenLogoIds[inst.id] ? (
                            <img
                              src={logoUrl}
                              alt={`${inst.name} logo`}
                              className="h-full w-full object-cover rounded-xl"
                              onError={() =>
                                setBrokenLogoIds((prev) => ({
                                  ...prev,
                                  [inst.id]: true,
                                }))
                              }
                            />
                          ) : (
                            inst.name.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">
                            {inst.name}
                          </h3>
                          <div className="mt-1">
                            {getInstitutionStatusBadge(inst.status)}
                          </div>
                          <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-muted-foreground">
                            {inst.location && (
                              <>
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3.5 w-3.5" />
                                  {inst.location}
                                </span>
                                <span>•</span>
                              </>
                            )}
                            <span className="flex items-center gap-1">
                              <BookOpen className="h-3.5 w-3.5" />
                              {coursesCount}{" "}
                              {coursesCount === 1 ? "course" : "courses"}
                            </span>
                            {inst.students && (
                              <>
                                <span>•</span>
                                <span>{inst.students} students</span>
                              </>
                            )}
                          </div>
                          {inst.description && (
                            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                              {inst.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Link to={`/user/institutions/${inst.id}/view`}>
                          <Button variant="outline" size="sm" className="gap-1">
                            <Eye className="h-4 w-4" />
                            View
                          </Button>
                        </Link>

                        <Link to={`/user/institutions/${inst.id}/edit`}>
                          <Button variant="outline" size="sm" className="gap-1">
                            <Edit3 className="h-4 w-4" />
                            Edit
                          </Button>
                        </Link>

                        <Link to={`/user/institutions/${inst.id}/courses`}>
                          <Button variant="outline" size="sm" className="gap-1">
                            <BookOpen className="h-4 w-4" />
                            Courses
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1 text-destructive hover:text-destructive"
                          onClick={() => handleDelete(inst.id, inst.name)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
