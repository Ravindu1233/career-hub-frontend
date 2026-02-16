import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export default function EditInstitution() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: "",
    logo: "",
    location: "",
    email: "",
    phone: "",
    website: "",
    description: "",
    founded: "",
    students: "",
  });

  // Fetch institution
  const { data: institution, isLoading } = useQuery({
    queryKey: ["institution", id],
    queryFn: async () => {
      const res = await api.get(`/institutions/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  // Populate form when data loads
  useEffect(() => {
    if (institution) {
      setFormData({
        name: institution.name || "",
        logo: institution.logo || "",
        location: institution.location || "",
        email: institution.email || "",
        phone: institution.phone || "",
        website: institution.website || "",
        description: institution.description || "",
        founded: institution.founded || "",
        students: institution.students || "",
      });
    }
  }, [institution]);

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await api.patch(`/institutions/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-institutions"] });
      queryClient.invalidateQueries({ queryKey: ["institution", id] });
      toast({
        title: "Institution updated",
        description: `${formData.name} has been updated successfully.`,
      });
      navigate("/user/institutions");
    },
    onError: (error: any) => {
      toast({
        title: "Failed to update institution",
        description:
          error?.response?.data?.message ||
          "An error occurred. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast({
        title: "Missing fields",
        description: "Please fill in name and email.",
        variant: "destructive",
      });
      return;
    }

    const submitData: any = {};
    if (formData.name !== institution?.name) submitData.name = formData.name;
    if (formData.logo !== (institution?.logo || ""))
      submitData.logo = formData.logo;
    if (formData.location !== (institution?.location || ""))
      submitData.location = formData.location;
    if (formData.email !== institution?.email)
      submitData.email = formData.email;
    if (formData.phone !== (institution?.phone || ""))
      submitData.phone = formData.phone;
    if (formData.website !== (institution?.website || ""))
      submitData.website = formData.website;
    if (formData.description !== (institution?.description || ""))
      submitData.description = formData.description;
    if (formData.founded !== (institution?.founded || ""))
      submitData.founded = formData.founded;
    if (formData.students !== (institution?.students || ""))
      submitData.students = formData.students;

    updateMutation.mutate(submitData);
  };

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

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Button
          variant="ghost"
          onClick={() => navigate("/user/institutions")}
          className="gap-2 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to My Institutions
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Edit Institution</CardTitle>
            <CardDescription>Update your institution details.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Institution Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    disabled={updateMutation.isPending}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="logo">Logo (initials or URL)</Label>
                  <Input
                    id="logo"
                    value={formData.logo}
                    onChange={(e) => handleChange("logo", e.target.value)}
                    disabled={updateMutation.isPending}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleChange("location", e.target.value)}
                    disabled={updateMutation.isPending}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    disabled={updateMutation.isPending}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    disabled={updateMutation.isPending}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={formData.website}
                    onChange={(e) => handleChange("website", e.target.value)}
                    disabled={updateMutation.isPending}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="founded">Year Founded</Label>
                  <Input
                    id="founded"
                    value={formData.founded}
                    onChange={(e) => handleChange("founded", e.target.value)}
                    disabled={updateMutation.isPending}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="students">Student Count</Label>
                  <Input
                    id="students"
                    value={formData.students}
                    onChange={(e) => handleChange("students", e.target.value)}
                    disabled={updateMutation.isPending}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  rows={4}
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  disabled={updateMutation.isPending}
                />
              </div>
              <div className="flex gap-3 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/user/institutions")}
                  disabled={updateMutation.isPending}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
