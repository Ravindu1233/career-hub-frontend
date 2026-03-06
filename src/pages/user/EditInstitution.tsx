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
import { ArrowLeft, Upload, X, ImageIcon, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function EditInstitution() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    email: "",
    phone: "",
    website: "",
    description: "",
    founded: "",
    students: "",
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const { data: institution, isLoading, isError } = useQuery({
    queryKey: ["institution", id],
    queryFn: async () => {
      if (!id) throw new Error("Missing institution id");
      const listRes = await api.get("/institutions/my-institutions");
      const list = Array.isArray(listRes.data) ? listRes.data : [];
      const found = list.find((inst: any) => String(inst.id) === String(id));
      if (found) return found;

      try {
        const res = await api.get(`/institutions/${id}`);
        return res.data;
      } catch (error: any) {
        if (error?.response?.status === 404) throw new Error("Not found");
        throw error;
      }
    },
    enabled: !!id,
    retry: false,
  });

  useEffect(() => {
    if (institution) {
      setFormData({
        name: institution.name || "",
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

  useEffect(() => {
    return () => {
      if (logoPreview) URL.revokeObjectURL(logoPreview);
    };
  }, [logoPreview]);

  const updateMutation = useMutation({
    mutationFn: async (payload: Record<string, string>) => {
      const res = await api.patch(`/institutions/${id}`, payload);
      return res.data;
    },
  });

  const logoMutation = useMutation({
    mutationFn: async (file: File) => {
      const form = new FormData();
      form.append("image", file);
      const res = await api.post(`/institutions/${id}/logo`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },
  });

  const deleteLogoMutation = useMutation({
    mutationFn: async () => {
      await api.delete(`/institutions/${id}/logo`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["institution", id] });
      queryClient.invalidateQueries({ queryKey: ["my-institutions"] });
      toast({ title: "Logo removed" });
    },
    onError: () => {
      toast({ title: "Failed to remove logo", variant: "destructive" });
    },
  });

  const handleChange = (field: string, value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setLogoFile(file);
    setLogoPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast({
        title: "Missing fields",
        description: "Please fill in name and email.",
        variant: "destructive",
      });
      return;
    }

    const payload: Record<string, string> = {
      ...(formData.name !== (institution?.name || "") && {
        name: formData.name,
      }),
      ...(formData.location !== (institution?.location || "") && {
        location: formData.location,
      }),
      ...(formData.email !== (institution?.email || "") && {
        email: formData.email,
      }),
      ...(formData.phone !== (institution?.phone || "") && {
        phone: formData.phone,
      }),
      ...(formData.website !== (institution?.website || "") && {
        website: formData.website,
      }),
      ...(formData.description !== (institution?.description || "") && {
        description: formData.description,
      }),
      ...(formData.founded !== (institution?.founded || "") && {
        founded: formData.founded,
      }),
      ...(formData.students !== (institution?.students || "") && {
        students: formData.students,
      }),
    };

    const hasFieldChanges = Object.keys(payload).length > 0;
    if (!hasFieldChanges && !logoFile) {
      toast({
        title: "No changes",
        description: "Please update at least one field before saving.",
      });
      return;
    }

    try {
      if (hasFieldChanges) await updateMutation.mutateAsync(payload);
      if (logoFile) await logoMutation.mutateAsync(logoFile);

      queryClient.invalidateQueries({ queryKey: ["my-institutions"] });
      queryClient.invalidateQueries({ queryKey: ["institution", id] });
      setLogoFile(null);
      setLogoPreview(null);
      toast({
        title: "Institution updated",
        description: `${formData.name} has been updated and is now pending re-approval by admin.`,
      });
      navigate("/user/institutions");
    } catch (error: any) {
      toast({
        title: "Failed to update institution",
        description: error?.response?.data?.message || "An error occurred.",
        variant: "destructive",
      });
    }
  };

  const currentLogoUrl = institution?.logo
    ? `${API_BASE}${institution.logo}`
    : null;
  const isSaving = updateMutation.isPending || logoMutation.isPending;
  const isLogoLoading = isSaving || deleteLogoMutation.isPending;

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
          <CardHeader>
            <CardTitle>Edit Institution</CardTitle>
            <CardDescription>Update your institution details.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label>Institution Logo</Label>
                <div className="flex items-start gap-4">
                  <div className="h-20 w-20 rounded-xl border-2 border-dashed border-border bg-muted flex items-center justify-center overflow-hidden shrink-0">
                    {logoPreview ? (
                      <img
                        src={logoPreview}
                        alt="New logo preview"
                        className="h-full w-full object-cover"
                      />
                    ) : currentLogoUrl ? (
                      <img
                        src={currentLogoUrl}
                        alt="Current logo"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="h-8 w-8 text-muted-foreground" />
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={handleLogoChange}
                        disabled={isLogoLoading}
                      />
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium border border-input rounded-md bg-background hover:bg-muted transition-colors cursor-pointer">
                        <Upload className="h-4 w-4" />
                        {logoFile
                          ? "Change selection"
                          : currentLogoUrl
                            ? "Replace Logo"
                            : "Upload Logo"}
                      </span>
                    </label>

                    {logoFile && (
                      <button
                        type="button"
                        onClick={() => {
                          setLogoFile(null);
                          setLogoPreview(null);
                        }}
                        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-3.5 w-3.5" /> Cancel
                      </button>
                    )}

                    {currentLogoUrl && !logoFile && (
                      <button
                        type="button"
                        onClick={() => deleteLogoMutation.mutate()}
                        disabled={isLogoLoading}
                        className="inline-flex items-center gap-1.5 text-sm text-destructive hover:opacity-80"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        {deleteLogoMutation.isPending
                          ? "Removing..."
                          : "Remove Logo"}
                      </button>
                    )}

                    <p className="text-xs text-muted-foreground">
                      {logoFile
                        ? `${logoFile.name} (will upload when you click Save Changes)`
                        : "JPG, PNG or WebP - max 5MB"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Institution Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    disabled={isSaving}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    disabled={isSaving}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleChange("location", e.target.value)}
                    disabled={isSaving}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    disabled={isSaving}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={formData.website}
                    onChange={(e) => handleChange("website", e.target.value)}
                    disabled={isSaving}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="founded">Year Founded</Label>
                  <Input
                    id="founded"
                    value={formData.founded}
                    onChange={(e) => handleChange("founded", e.target.value)}
                    disabled={isSaving}
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="students">Student Count</Label>
                  <Input
                    id="students"
                    value={formData.students}
                    onChange={(e) => handleChange("students", e.target.value)}
                    disabled={isSaving}
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
                  disabled={isSaving}
                />
              </div>

              <div className="flex gap-3 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/user/institutions")}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
