import { useNavigate, useParams, Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit3, ImageIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

type Institution = {
  id: string;
  name?: string;
  logo?: string | null;
  location?: string | null;
  email?: string | null;
  phone?: string | null;
  website?: string | null;
  description?: string | null;
  founded?: string | null;
  students?: string | null;
  status?: "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED";
  rejectionReason?: string | null;
};

export default function ViewInstitution() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: institution, isLoading, isError } = useQuery({
    queryKey: ["institution", id],
    queryFn: async () => {
      if (!id) throw new Error("Missing institution id");
      const listRes = await api.get("/institutions/my-institutions");
      const list = Array.isArray(listRes.data)
        ? (listRes.data as Institution[])
        : [];
      const found = list.find((inst) => String(inst.id) === String(id));
      if (found) return found;

      try {
        const res = await api.get(`/institutions/${id}`);
        return res.data as Institution;
      } catch (error: any) {
        if (error?.response?.status === 404) throw new Error("Not found");
        throw error;
      }
    },
    enabled: !!id,
    retry: false,
  });

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8 max-w-3xl">
          <p className="text-center text-muted-foreground">
            Loading institution...
          </p>
        </div>
      </MainLayout>
    );
  }

  if (isError || !institution) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8 max-w-3xl">
          <Button
            variant="ghost"
            onClick={() => navigate("/user/institutions")}
            className="gap-2 mb-4"
          >
            <ArrowLeft className="h-4 w-4" /> Back to My Institutions
          </Button>
          <Card>
            <CardContent className="py-10 text-center space-y-3">
              <p className="text-destructive font-medium">
                Institution not found or not accessible.
              </p>
              <p className="text-sm text-muted-foreground">
                It may have been removed or is no longer available.
              </p>
              <Button onClick={() => navigate("/user/institutions")}>
                Go to My Institutions
              </Button>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  const logoUrl = institution.logo ? `${API_BASE}${institution.logo}` : null;

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Button
          variant="ghost"
          onClick={() => navigate("/user/institutions")}
          className="gap-2 mb-4"
        >
          <ArrowLeft className="h-4 w-4" /> Back to My Institutions
        </Button>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>View Institution</CardTitle>
              <CardDescription>Institution details (read-only)</CardDescription>
            </div>
            <Link to={`/user/institutions/${id}/edit`}>
              <Button className="gap-2">
                <Edit3 className="h-4 w-4" /> Edit Institution
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {String(institution.status || "").toUpperCase() === "REJECTED" && (
                <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3">
                  <p className="text-sm font-medium text-destructive">
                    This institution is rejected.
                  </p>
                  <p className="text-sm text-destructive/90 mt-1">
                    Reason: {institution.rejectionReason || "No reason provided."}
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Logo
                </label>
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 rounded-xl border border-border bg-muted flex items-center justify-center overflow-hidden shrink-0">
                    {logoUrl ? (
                      <img
                        src={logoUrl}
                        alt={`${institution.name} logo`}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <ImageIcon className="h-8 w-8 text-muted-foreground" />
                    )}
                  </div>
                  {!logoUrl && (
                    <p className="text-sm text-muted-foreground">
                      No logo uploaded
                    </p>
                  )}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-muted-foreground">
                    Institution Name
                  </label>
                  <p className="text-base">{institution.name || "-"}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-muted-foreground">
                    Email
                  </label>
                  <p className="text-base">{institution.email || "-"}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-muted-foreground">
                    Location
                  </label>
                  <p className="text-base">{institution.location || "-"}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-muted-foreground">
                    Phone
                  </label>
                  <p className="text-base">{institution.phone || "-"}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-muted-foreground">
                    Website
                  </label>
                  <p className="text-base">
                    {institution.website ? (
                      <a
                        href={institution.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {institution.website}
                      </a>
                    ) : (
                      "-"
                    )}
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-muted-foreground">
                    Year Founded
                  </label>
                  <p className="text-base">{institution.founded || "-"}</p>
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Student Count
                  </label>
                  <p className="text-base">{institution.students || "-"}</p>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-muted-foreground">
                  Description
                </label>
                <p className="text-base whitespace-pre-wrap">
                  {institution.description || "-"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
