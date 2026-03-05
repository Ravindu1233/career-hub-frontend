import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Save, X, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Job = {
  id: string;
  jobTitle: string;
  jobType: string;
  location: string;
  salaryRange: string;
  jobDescription: string;
  requirements: string;
  deadline: string;
  responsibilities: string[];
  requiredSkills: string[];
};

export default function EditJob() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    jobTitle: "",
    jobType: "",
    location: "",
    salaryRange: "",
    jobDescription: "",
    requirements: "",
    deadline: "",
    responsibilities: [""],
    requiredSkills: [""],
  });

  useEffect(() => {
    const fetchJob = async () => {
      if (!id) return;

      setLoading(true);
      setError(null);

      try {
        const response = await api.get("/jobs/company/me");
        const jobs = Array.isArray(response.data) ? response.data : [];
        const job = jobs.find((item: Job) => item.id === id) as Job | undefined;

        if (!job) {
          throw new Error("Job not found");
        }

        // Format deadline for input[type="date"]
        const deadlineDate = job.deadline
          ? new Date(job.deadline).toISOString().split("T")[0]
          : "";

        setFormData({
          jobTitle: job.jobTitle || "",
          jobType: job.jobType || "",
          location: job.location || "",
          salaryRange: job.salaryRange || "",
          jobDescription: job.jobDescription || "",
          requirements: job.requirements || "",
          deadline: deadlineDate,
          responsibilities:
            job.responsibilities && job.responsibilities.length > 0
              ? job.responsibilities
              : [""],
          requiredSkills:
            job.requiredSkills && job.requiredSkills.length > 0
              ? job.requiredSkills
              : [""],
        });
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load job details");
        toast({
          title: "Error",
          description: "Failed to load job details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id, toast]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleListItemChange = (
    field: "responsibilities" | "requiredSkills",
    index: number,
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  const addListItem = (field: "responsibilities" | "requiredSkills") => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const removeListItem = (
    field: "responsibilities" | "requiredSkills",
    index: number,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    if (!id) return;

    setSaving(true);
    setError(null);

    try {
      // Filter out empty values
      const cleanedResponsibilities = formData.responsibilities
        .map((r) => r.trim())
        .filter(Boolean);

      const cleanedSkills = formData.requiredSkills
        .map((s) => s.trim())
        .filter(Boolean);

      // Validate required fields
      if (
        !formData.jobTitle.trim() ||
        !formData.jobType.trim() ||
        !formData.location.trim() ||
        !formData.salaryRange.trim() ||
        !formData.jobDescription.trim() ||
        !formData.requirements.trim() ||
        !formData.deadline.trim() ||
        cleanedResponsibilities.length === 0 ||
        cleanedSkills.length === 0
      ) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        setSaving(false);
        return;
      }

      const payload = {
        jobTitle: formData.jobTitle.trim(),
        jobType: formData.jobType.trim(),
        location: formData.location.trim(),
        salaryRange: formData.salaryRange.trim(),
        jobDescription: formData.jobDescription.trim(),
        requirements: formData.requirements.trim(),
        deadline: formData.deadline
          ? new Date(formData.deadline).toISOString()
          : undefined,
        responsibilities: cleanedResponsibilities,
        requiredSkills: cleanedSkills,
      };

      await api.patch(`/jobs/${id}`, payload);

      toast({
        title: "Success",
        description: "Job updated successfully",
      });

      navigate("/company/jobs");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to update job");
      toast({
        title: "Error",
        description: err?.response?.data?.message || "Failed to update job",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate("/company/jobs");
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground">
            Loading job details...
          </p>
        </div>
      </MainLayout>
    );
  }

  if (error && !formData.jobTitle) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-destructive">{error}</p>
          <div className="text-center mt-4">
            <Link to="/company/jobs">
              <Button variant="outline">Back to Jobs</Button>
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/company/jobs">Jobs</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Edit</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Link to="/company/jobs">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Edit Job</h1>
              <p className="text-muted-foreground mt-1">
                Update job listing details
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleCancel} disabled={saving}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Basic Info */}
          <div className="space-y-6">
            {/* Basic Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Basic Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Job Title</label>
                  <Input
                    value={formData.jobTitle}
                    onChange={(e) =>
                      handleInputChange("jobTitle", e.target.value)
                    }
                    placeholder="e.g., Senior Developer"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Job Type</label>
                  <Select
                    value={formData.jobType}
                    onValueChange={(value) =>
                      handleInputChange("jobType", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full-time">Full-time</SelectItem>
                      <SelectItem value="part-time">Part-time</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="internship">Internship</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Location & Salary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Location & Compensation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Location</label>
                  <Input
                    value={formData.location}
                    onChange={(e) =>
                      handleInputChange("location", e.target.value)
                    }
                    placeholder="e.g., San Francisco, CA or Remote"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Salary Range</label>
                  <Input
                    value={formData.salaryRange}
                    onChange={(e) =>
                      handleInputChange("salaryRange", e.target.value)
                    }
                    placeholder="e.g., LKR 100k - LKR 150k" // Change here
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Deadline</label>
                  <Input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) =>
                      handleInputChange("deadline", e.target.value)
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Required Skills</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {formData.requiredSkills.map((skill, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={skill}
                        onChange={(e) =>
                          handleListItemChange(
                            "requiredSkills",
                            index,
                            e.target.value,
                          )
                        }
                        placeholder={`Skill ${index + 1}`}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeListItem("requiredSkills", index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => addListItem("requiredSkills")}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Skill
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Detailed Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Job Description</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={formData.jobDescription}
                  onChange={(e) =>
                    handleInputChange("jobDescription", e.target.value)
                  }
                  placeholder="Describe the role and what makes it exciting..."
                  rows={5}
                />
              </CardContent>
            </Card>

            {/* Responsibilities */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Responsibilities</CardTitle>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => addListItem("responsibilities")}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {formData.responsibilities.map((item, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={item}
                        onChange={(e) =>
                          handleListItemChange(
                            "responsibilities",
                            index,
                            e.target.value,
                          )
                        }
                        placeholder="Enter responsibility..."
                      />
                      <Button
                        size="icon"
                        variant="outline"
                        className="text-destructive shrink-0"
                        onClick={() =>
                          removeListItem("responsibilities", index)
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={formData.requirements}
                  onChange={(e) =>
                    handleInputChange("requirements", e.target.value)
                  }
                  placeholder="List the required skills and qualifications..."
                  rows={5}
                />
              </CardContent>
            </Card>

            {error && (
              <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-md">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
