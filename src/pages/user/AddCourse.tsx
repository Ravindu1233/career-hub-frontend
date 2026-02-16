import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export default function AddCourse() {
  const { id } = useParams(); // institution id
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: "",
    duration: "",
    startDate: "",
    price: "",
    type: "",
    spots: "",
    description: "",
  });

  // Fetch institution name for display
  const { data: institution } = useQuery({
    queryKey: ["institution", id],
    queryFn: async () => {
      const res = await api.get(`/institutions/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post(`/courses/institution/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses", id] });
      toast({
        title: "Course added",
        description: `${formData.name} has been added successfully.`,
      });
      navigate(`/user/institutions/${id}/courses`);
    },
    onError: (error: any) => {
      toast({
        title: "Failed to add course",
        description: error?.response?.data?.message || "An error occurred. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.duration || !formData.startDate || !formData.price || !formData.type) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const submitData: any = {
      name: formData.name,
      duration: formData.duration,
      startDate: formData.startDate,
      price: formData.price,
      type: formData.type,
    };
    if (formData.spots) submitData.spots = parseInt(formData.spots);
    if (formData.description) submitData.description = formData.description;

    createMutation.mutate(submitData);
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Button
          variant="ghost"
          onClick={() => navigate(`/user/institutions/${id}/courses`)}
          className="gap-2 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Courses
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Add New Course</CardTitle>
            <CardDescription>
              Add a new course to {institution?.name || "this institution"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="course-name">Course Name *</Label>
                <Input
                  id="course-name"
                  placeholder="e.g. Full Stack Web Development"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  disabled={createMutation.isPending}
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="course-type">Type *</Label>
                  <Input
                    id="course-type"
                    placeholder="e.g. Certificate"
                    value={formData.type}
                    onChange={(e) => handleChange("type", e.target.value)}
                    disabled={createMutation.isPending}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="course-duration">Duration *</Label>
                  <Input
                    id="course-duration"
                    placeholder="e.g. 6 months"
                    value={formData.duration}
                    onChange={(e) => handleChange("duration", e.target.value)}
                    disabled={createMutation.isPending}
                  />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="course-price">Price *</Label>
                  <Input
                    id="course-price"
                    placeholder="e.g. $500 or Free"
                    value={formData.price}
                    onChange={(e) => handleChange("price", e.target.value)}
                    disabled={createMutation.isPending}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="course-start">Start Date *</Label>
                  <Input
                    id="course-start"
                    placeholder="e.g. Feb 15, 2026"
                    value={formData.startDate}
                    onChange={(e) => handleChange("startDate", e.target.value)}
                    disabled={createMutation.isPending}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="course-spots">Available Spots</Label>
                <Input
                  id="course-spots"
                  type="number"
                  placeholder="e.g. 30"
                  value={formData.spots}
                  onChange={(e) => handleChange("spots", e.target.value)}
                  disabled={createMutation.isPending}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="course-desc">Description</Label>
                <Textarea
                  id="course-desc"
                  placeholder="What students will learn..."
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
                  onClick={() => navigate(`/user/institutions/${id}/courses`)}
                  disabled={createMutation.isPending}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending ? "Adding..." : "Add Course"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
