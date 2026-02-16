import { useNavigate, useParams } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit3 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Link } from "react-router-dom";

export default function ViewInstitution() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch institution
  const { data: institution, isLoading } = useQuery({
    queryKey: ["institution", id],
    queryFn: async () => {
      const res = await api.get(`/institutions/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8 max-w-3xl">
          <p className="text-center text-muted-foreground">Loading institution...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Button variant="ghost" onClick={() => navigate("/user/institutions")} className="gap-2 mb-4">
          <ArrowLeft className="h-4 w-4" />
          Back to My Institutions
        </Button>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>View Institution</CardTitle>
              <CardDescription>Institution details (read-only)</CardDescription>
            </div>
            <Link to={`/user/institutions/${id}/edit`}>
              <Button className="gap-2">
                <Edit3 className="h-4 w-4" />
                Edit Institution
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Institution Name</label>
                  <p className="text-base">{institution?.name || "—"}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Logo</label>
                  <p className="text-base">{institution?.logo || "—"}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Location</label>
                  <p className="text-base">{institution?.location || "—"}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="text-base">{institution?.email || "—"}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Phone</label>
                  <p className="text-base">{institution?.phone || "—"}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Website</label>
                  <p className="text-base">
                    {institution?.website ? (
                      <a href={institution.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        {institution.website}
                      </a>
                    ) : (
                      "—"
                    )}
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Year Founded</label>
                  <p className="text-base">{institution?.founded || "—"}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Student Count</label>
                  <p className="text-base">{institution?.students || "—"}</p>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Description</label>
                <p className="text-base whitespace-pre-wrap">{institution?.description || "—"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
