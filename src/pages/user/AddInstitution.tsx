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
import { ArrowLeft, Upload, X, ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export default function AddInstitution() {
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

  const createMutation = useMutation({
    mutationFn: async () => {
      // Step 1: create institution with JSON (backend POST /institutions does NOT accept files)
      const res = await api.post("/institutions", {
        name: formData.name,
        email: formData.email,
        ...(formData.location && { location: formData.location }),
        ...(formData.description && { description: formData.description }),
        ...(formData.website && { website: formData.website }),
        ...(formData.phone && { phone: formData.phone }),
        ...(formData.founded && { founded: formData.founded }),
        ...(formData.students && { students: formData.students }),
      });
      return res.data;
    },
    onSuccess: async (created) => {
      // Step 2: upload logo to separate endpoint if selected
      if (logoFile && created?.id) {
        try {
          const form = new FormData();
          form.append("image", logoFile); // must match FileInterceptor('image')
          await api.post(`/institutions/${created.id}/logo`, form, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        } catch {
          toast({
            title: "Institution created",
            description:
              "Institution created but logo upload failed. You can upload it from the edit page.",
            variant: "destructive",
          });
          queryClient.invalidateQueries({ queryKey: ["my-institutions"] });
          navigate("/user/institutions");
          return;
        }
      }
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

  const handleChange = (field: string, value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setLogoFile(file);
    setLogoPreview(file ? URL.createObjectURL(file) : null);
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
    createMutation.mutate();
  };

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
            <CardTitle>Add New Institution</CardTitle>
            <CardDescription>
              Create a new educational institution and start adding courses to
              it.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* ── Logo Upload ─────────────────────────────────── */}
              <div className="space-y-2">
                <Label>Institution Logo</Label>
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 rounded-xl border-2 border-dashed border-border bg-muted flex items-center justify-center overflow-hidden shrink-0">
                    {logoPreview ? (
                      <img
                        src={logoPreview}
                        alt="Preview"
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
                        disabled={createMutation.isPending}
                      />
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium border border-input rounded-md bg-background hover:bg-muted transition-colors cursor-pointer">
                        <Upload className="h-4 w-4" />
                        {logoFile ? "Change Logo" : "Upload Logo"}
                      </span>
                    </label>
                    {logoFile && (
                      <button
                        type="button"
                        onClick={() => {
                          setLogoFile(null);
                          setLogoPreview(null);
                        }}
                        className="inline-flex items-center gap-1.5 text-sm text-destructive hover:opacity-80"
                      >
                        <X className="h-3.5 w-3.5" /> Remove
                      </button>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {logoFile ? logoFile.name : "JPG, PNG or WebP — max 5MB"}
                    </p>
                  </div>
                </div>
              </div>

              {/* ── Fields ──────────────────────────────────────── */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Institution Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g. Tech Academy"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
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
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="e.g. Colombo, Sri Lanka"
                    value={formData.location}
                    onChange={(e) => handleChange("location", e.target.value)}
                    disabled={createMutation.isPending}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    placeholder="+94 11 000 0000"
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
                <div className="space-y-2 sm:col-span-2">
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
