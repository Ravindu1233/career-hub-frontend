import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export default function EditCourse() {
  const { id: institutionId, courseId } = useParams();
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

  // Fetch course
  const { data: course, isLoading } = useQuery({
    queryKey: ["course", courseId],
    queryFn: async () => {
      const res = await api.get(`/courses/${courseId}`);
      return res.data;
    },
    enabled: !!courseId,
  });

  // Populate form when data loads
  useEffect(() => {
    if (course) {
      setFormData({
        name: course.name || "",
        duration: course.duration || "",
        startDate: course.startDate || "",
        price: course.price || "",
        type: course.type || "",
        spots: course.spots?.toString() || "",
        description: course.description || "",
      });
    }
  }, [course]);

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await api.patch(`/courses/${courseId}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses", institutionId] });
      queryClient.invalidateQueries({ queryKey: ["course", courseId] });
      toast({
        title: "Course updated",
        description: `${formData.name} has been updated successfully.`,
      });
      navigate(`/user/institutions/${institutionId}/courses`);
    },
    onError: (error: any) => {
      toast({
        title: "Failed to update course",
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

    const submitData: any = {};
    if (formData.name !== course?.name) submitData.name = formData.name;
    if (formData.duration !== course?.duration) submitData.duration = formData.duration;
    if (formData.startDate !== course?.startDate) submitData.startDate = formData.startDate;
    if (formData.price !== course?.price) submitData.price = formData.price;
    if (formData.type !== course?.type) submitData.type = formData.type;
    if (formData.spots !== (course?.spots?.toString() || "")) submitData.spots = parseInt(formData.spots) || null;
    if (formData.description !== (course?.description || "")) submitData.description = formData.description;

    updateMutation.mutate(submitData);
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8 max-w-3xl">
          <p className="text-center text-muted-foreground">Loading course...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Button
          variant="ghost"
          onClick={() => navigate(`/user/institutions/${institutionId}/courses`)}
          className="gap-2 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Courses
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Edit Course</CardTitle>
            <CardDescription>Update the course details</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="course-name">Course Name *</Label>
                <Input
                  id="course-name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  disabled={updateMutation.isPending}
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="course-type">Type *</Label>
                  <Input
                    id="course-type"
                    value={formData.type}
                    onChange={(e) => handleChange("type", e.target.value)}
                    disabled={updateMutation.isPending}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="course-duration">Duration *</Label>
                  <Input
                    id="course-duration"
                    value={formData.duration}
                    onChange={(e) => handleChange("duration", e.target.value)}
                    disabled={updateMutation.isPending}
                  />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="course-price">Price *</Label>
                  <Input
                    id="course-price"
                    value={formData.price}
                    onChange={(e) => handleChange("price", e.target.value)}
                    disabled={updateMutation.isPending}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="course-start">Start Date *</Label>
                  <Input
                    id="course-start"
                    value={formData.startDate}
                    onChange={(e) => handleChange("startDate", e.target.value)}
                    disabled={updateMutation.isPending}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="course-spots">Available Spots</Label>
                <Input
                  id="course-spots"
                  type="number"
                  value={formData.spots}
                  onChange={(e) => handleChange("spots", e.target.value)}
                  disabled={updateMutation.isPending}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="course-desc">Description</Label>
                <Textarea
                  id="course-desc"
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
                  onClick={() => navigate(`/user/institutions/${institutionId}/courses`)}
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
