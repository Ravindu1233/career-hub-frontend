import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export default function AddInstitution() {
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

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post("/institutions", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-institutions"] });
      toast({
        title: "Institution created",
        description: `${formData.name} has been created successfully.`,
      });
      navigate("/user/institutions");
    },
    onError: (error: any) => {
      toast({
        title: "Failed to create institution",
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

    const submitData: any = { name: formData.name, email: formData.email };
    if (formData.logo) submitData.logo = formData.logo;
    if (formData.location) submitData.location = formData.location;
    if (formData.description) submitData.description = formData.description;
    if (formData.website) submitData.website = formData.website;
    if (formData.phone) submitData.phone = formData.phone;
    if (formData.founded) submitData.founded = formData.founded;
    if (formData.students) submitData.students = formData.students;

    createMutation.mutate(submitData);
  };

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
            <CardTitle>Add New Institution</CardTitle>
            <CardDescription>
              Create a new educational institution and start adding courses to
              it.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Institution Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g. Tech Academy Rwanda"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    disabled={createMutation.isPending}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="logo">Logo (initials or URL)</Label>
                  <Input
                    id="logo"
                    placeholder="e.g. TA"
                    value={formData.logo}
                    onChange={(e) => handleChange("logo", e.target.value)}
                    disabled={createMutation.isPending}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="e.g. Kigali, Rwanda"
                    value={formData.location}
                    onChange={(e) => handleChange("location", e.target.value)}
                    disabled={createMutation.isPending}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="info@institution.com"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    disabled={createMutation.isPending}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    placeholder="+250 788 000 000"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    disabled={createMutation.isPending}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    placeholder="https://institution.com"
                    value={formData.website}
                    onChange={(e) => handleChange("website", e.target.value)}
                    disabled={createMutation.isPending}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="founded">Year Founded</Label>
                  <Input
                    id="founded"
                    placeholder="e.g. 2018"
                    value={formData.founded}
                    onChange={(e) => handleChange("founded", e.target.value)}
                    disabled={createMutation.isPending}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="students">Student Count</Label>
                  <Input
                    id="students"
                    placeholder="e.g. 2,500+"
                    value={formData.students}
                    onChange={(e) => handleChange("students", e.target.value)}
                    disabled={createMutation.isPending}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of the institution..."
                  rows={4}
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  disabled={createMutation.isPending}
                />
              </div>
              <div className="flex gap-3 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/user/institutions")}
                  disabled={createMutation.isPending}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending
                    ? "Creating..."
                    : "Create Institution"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
