import { useNavigate, useParams, Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Plus,
  Edit3,
  Trash2,
  BookOpen,
  Clock,
  DollarSign,
  Eye,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export default function ManageCourses() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch institution
  const { data: institution } = useQuery({
    queryKey: ["institution", id],
    queryFn: async () => {
      const res = await api.get(`/institutions/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  // Fetch courses
  const { data: courses = [], isLoading } = useQuery({
    queryKey: ["courses", id],
    queryFn: async () => {
      const res = await api.get(`/courses/institution/${id}`);
      return res.data || [];
    },
    enabled: !!id,
  });

  // Delete course mutation
  const deleteMutation = useMutation({
    mutationFn: async (courseId: string) => {
      await api.delete(`/courses/${courseId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses", id] });
      toast({
        title: "Course deleted",
        description: "Course has been removed.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to delete course",
        description: error?.response?.data?.message || "An error occurred.",
        variant: "destructive",
      });
    },
  });

  const handleDelete = (courseId: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteMutation.mutate(courseId);
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/user/institutions")}
          className="gap-2 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to My Institutions
        </Button>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Manage Courses
            </h1>
            <p className="text-muted-foreground mt-1">
              {institution?.name || "Institution"} — {courses.length} courses
            </p>
          </div>
          <Link to={`/user/institutions/${id}/courses/add`}>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Course
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <Card>
            <CardContent className="py-16 text-center">
              <p className="text-muted-foreground">Loading courses...</p>
            </CardContent>
          </Card>
        ) : courses.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No courses yet
              </h3>
              <p className="text-muted-foreground mb-4">
                Add your first course to this institution
              </p>
              <Link to={`/user/institutions/${id}/courses/add`}>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Course
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((course: any) => (
              <Card
                key={course.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{course.name}</CardTitle>
                      <Badge variant="secondary" className="mt-1">
                        {course.type}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {course.description}
                  </p>
                  <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {course.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="h-3.5 w-3.5" />
                      {course.price}
                    </span>
                    {course.spots && (
                      <span className="flex items-center gap-1">
                        {course.spots} spots
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Link
                      to={`/user/institutions/${id}/courses/${course.id}/view`}
                    >
                      <Button variant="outline" size="sm" className="gap-1">
                        <Eye className="h-3.5 w-3.5" />
                        View
                      </Button>
                    </Link>
                    <Link
                      to={`/user/institutions/${id}/courses/${course.id}/edit`}
                    >
                      <Button variant="outline" size="sm" className="gap-1">
                        <Edit3 className="h-3.5 w-3.5" />
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(course.id, course.name)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
