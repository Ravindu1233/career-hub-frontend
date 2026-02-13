import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Edit3, Trash2, Eye } from "lucide-react";

const getStatusBadge = (status: string) => {
  const statusConfig: Record<
    string,
    {
      label: string;
      variant: "default" | "secondary" | "destructive" | "outline";
    }
  > = {
    active: { label: "Active", variant: "default" },
    paused: { label: "Paused", variant: "secondary" },
    closed: { label: "Closed", variant: "outline" },
  };

  const config = statusConfig[status] || {
    label: status,
    variant: "secondary" as const,
  };

  return <Badge variant={config.variant}>{config.label}</Badge>;
};

export default function CompanyJobs() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAddJobOpen, setIsAddJobOpen] = useState(false);
  const [postingJob, setPostingJob] = useState(false);

  const [newJob, setNewJob] = useState({
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
    loadJobs();
  }, []);

  const loadJobs = async () => {
    setLoadingJobs(true);
    try {
      const res = await api.get("/jobs/company/me");
      setJobs(res.data);
    } catch (e: any) {
      setError(e?.response?.data?.message || "Failed to load jobs");
    } finally {
      setLoadingJobs(false);
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm("Are you sure you want to delete this job?")) return;

    try {
      await api.delete(`/jobs/${jobId}`);
      loadJobs();
    } catch (e: any) {
      setError(e?.response?.data?.message || "Failed to delete job");
    }
  };

  const handlePostJob = async () => {
    setPostingJob(true);
    setError(null);

    try {
      await api.post("/jobs", {
        jobTitle: newJob.jobTitle.trim(),
        jobType: newJob.jobType.trim(),
        location: newJob.location.trim(),
        salaryRange: newJob.salaryRange.trim(),
        jobDescription: newJob.jobDescription.trim(),
        requirements: newJob.requirements.trim(),
        deadline: newJob.deadline ? new Date(newJob.deadline).toISOString() : undefined,
        responsibilities: newJob.responsibilities.map((x) => x.trim()).filter(Boolean),
        requiredSkills: newJob.requiredSkills.map((x) => x.trim()).filter(Boolean),
      });

      loadJobs();
      setIsAddJobOpen(false);
      resetForm();
    } catch (e: any) {
      setError(e?.response?.data?.message || "Failed to post job");
    } finally {
      setPostingJob(false);
    }
  };

  const resetForm = () => {
    setNewJob({
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
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Job Listings</h1>
            <p className="text-muted-foreground mt-1">
              Manage your job postings and track applications
            </p>
          </div>

          <Dialog
            open={isAddJobOpen}
            onOpenChange={(open) => {
              setIsAddJobOpen(open);
              if (!open) resetForm();
            }}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Post New Job
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Post a New Job</DialogTitle>
              </DialogHeader>

              <div className="space-y-4 py-4">
                {/* Row 1 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Job Title</label>
                    <Input
                      placeholder="e.g., Senior Developer"
                      value={newJob.jobTitle}
                      onChange={(e) =>
                        setNewJob((p) => ({ ...p, jobTitle: e.target.value }))
                      }
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Job Type</label>
                    <Select
                      value={newJob.jobType}
                      onValueChange={(v) => setNewJob((p) => ({ ...p, jobType: v }))}
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
                </div>

                {/* Row 2 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Location</label>
                    <Input
                      placeholder="e.g., San Francisco, CA"
                      value={newJob.location}
                      onChange={(e) =>
                        setNewJob((p) => ({ ...p, location: e.target.value }))
                      }
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Salary Range</label>
                    <Input
                      placeholder="e.g., LKR 100k - LKR 150k"
                      value={newJob.salaryRange}
                      onChange={(e) =>
                        setNewJob((p) => ({ ...p, salaryRange: e.target.value }))
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Deadline</label>
                  <Input
                    type="date"
                    value={newJob.deadline}
                    onChange={(e) =>
                      setNewJob((p) => ({ ...p, deadline: e.target.value }))
                    }
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="text-sm font-medium">Job Description</label>
                  <Textarea
                    placeholder="Describe the role and responsibilities..."
                    rows={4}
                    value={newJob.jobDescription}
                    onChange={(e) =>
                      setNewJob((p) => ({ ...p, jobDescription: e.target.value }))
                    }
                  />
                </div>

                {/* Responsibilities */}
                <div>
                  <label className="text-sm font-medium">Responsibilities</label>
                  <div className="space-y-2 mt-2">
                    {newJob.responsibilities.map((item, idx) => (
                      <div key={idx} className="flex gap-2">
                        <Input
                          placeholder={`Responsibility ${idx + 1}`}
                          value={item}
                          onChange={(e) => {
                            const v = e.target.value;
                            setNewJob((p) => {
                              const next = [...p.responsibilities];
                              next[idx] = v;
                              return { ...p, responsibilities: next };
                            });
                          }}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setNewJob((p) => {
                              const next = p.responsibilities.filter((_, i) => i !== idx);
                              return {
                                ...p,
                                responsibilities: next.length ? next : [""],
                              };
                            });
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-2"
                    onClick={() =>
                      setNewJob((p) => ({
                        ...p,
                        responsibilities: [...p.responsibilities, ""],
                      }))
                    }
                  >
                    + Add Responsibility
                  </Button>
                </div>

                {/* Required Skills */}
                <div>
                  <label className="text-sm font-medium">Required Skills</label>
                  <div className="space-y-2 mt-2">
                    {newJob.requiredSkills.map((item, idx) => (
                      <div key={idx} className="flex gap-2">
                        <Input
                          placeholder={`Skill ${idx + 1} (e.g., React)`}
                          value={item}
                          onChange={(e) => {
                            const v = e.target.value;
                            setNewJob((p) => {
                              const next = [...p.requiredSkills];
                              next[idx] = v;
                              return { ...p, requiredSkills: next };
                            });
                          }}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setNewJob((p) => {
                              const next = p.requiredSkills.filter((_, i) => i !== idx);
                              return {
                                ...p,
                                requiredSkills: next.length ? next : [""],
                              };
                            });
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-2"
                    onClick={() =>
                      setNewJob((p) => ({
                        ...p,
                        requiredSkills: [...p.requiredSkills, ""],
                      }))
                    }
                  >
                    + Add Skill
                  </Button>
                </div>

                {/* Requirements */}
                <div>
                  <label className="text-sm font-medium">Requirements</label>
                  <Textarea
                    placeholder="List the required skills and qualifications..."
                    rows={3}
                    value={newJob.requirements}
                    onChange={(e) =>
                      setNewJob((p) => ({ ...p, requirements: e.target.value }))
                    }
                  />
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsAddJobOpen(false)}>
                    Cancel
                  </Button>

                  <Button
                    disabled={
                      postingJob ||
                      !newJob.jobTitle.trim() ||
                      !newJob.jobType.trim() ||
                      !newJob.location.trim() ||
                      !newJob.salaryRange.trim() ||
                      !newJob.jobDescription.trim() ||
                      !newJob.requirements.trim() ||
                      !newJob.deadline.trim() ||
                      newJob.responsibilities.filter((x) => x.trim()).length === 0 ||
                      newJob.requiredSkills.filter((x) => x.trim()).length === 0
                    }
                    onClick={handlePostJob}
                  >
                    Post Job
                  </Button>
                </div>

                {error && (
                  <p className="text-sm text-destructive border border-destructive/30 rounded-md p-2">
                    {error}
                  </p>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Jobs List */}
        <Card>
          <CardHeader>
            <CardTitle>All Job Listings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loadingJobs ? (
                <p className="text-sm text-muted-foreground">Loading jobs...</p>
              ) : jobs.length === 0 ? (
                <p className="text-sm text-muted-foreground">No jobs posted yet.</p>
              ) : (
                jobs.map((job) => (
                  <div
                    key={job.id}
                    className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors gap-4"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold text-foreground">{job.jobTitle}</h3>
                        {getStatusBadge("active")}
                      </div>

                      <p className="text-sm text-muted-foreground">
                        {job.jobType} • {job.location} • LKR {job.salaryRange}
                      </p>

                      <p className="text-xs text-muted-foreground mt-1">
                        Posted:{" "}
                        {job.jobDate
                          ? new Date(job.jobDate).toLocaleDateString()
                          : "N/A"}{" "}
                        • {job.applications?.length ?? 0} applications
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link to={`/company/jobs/${job.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </Link>

                      <Link to={`/company/jobs/${job.id}/edit`}>
                        <Button variant="outline" size="sm">
                          <Edit3 className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </Link>

                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDeleteJob(job.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
