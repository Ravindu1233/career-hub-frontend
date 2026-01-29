import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Check,
  Upload,
  FileText,
  User,
  MapPin,
  Building2,
  X,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

const ApplyJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [jobLoading, setJobLoading] = useState(true);

  const [formData, setFormData] = useState({
    coverLetter: "",
    cvFile: null as File | null,
  });

  const [job, setJob] = useState<any>(null);

  // Load job details
  useEffect(() => {
    async function loadJob() {
      if (!id) return;

      try {
        setJobLoading(true);
        const res = await api.get(`/jobs/${id}`);
        setJob(res.data);
      } catch (error: any) {
        toast({
          title: "Error",
          description:
            error?.response?.data?.message || "Failed to load job details",
          variant: "destructive",
        });
        navigate("/jobs");
      } finally {
        setJobLoading(false);
      }
    }

    loadJob();
  }, [id, navigate, toast]);

  const steps = [
    { number: 1, title: "Upload CV", icon: FileText },
    { number: 2, title: "Review", icon: Check },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Validate file type
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF, DOC, or DOCX file",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "File size must be less than 10MB",
          variant: "destructive",
        });
        return;
      }

      setFormData({ ...formData, cvFile: file });
    }
  };

  const handleSubmit = async () => {
    if (!formData.cvFile) {
      toast({
        title: "CV Required",
        description: "Please upload your CV/Resume",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      const formDataToSend = new FormData();
      formDataToSend.append("cv", formData.cvFile);
      if (formData.coverLetter) {
        formDataToSend.append("coverLetter", formData.coverLetter);
      }

      await api.post(`/applications/apply/${id}`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast({
        title: "Application Submitted!",
        description: "Your application has been sent successfully.",
      });

      navigate("/my-applications");
    } catch (error: any) {
      toast({
        title: "Application Failed",
        description:
          error?.response?.data?.message || "Failed to submit application",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (jobLoading) {
    return (
      <MainLayout>
        <div className="bg-muted/30 min-h-screen py-8">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center text-muted-foreground">
              Loading job details...
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!job) {
    return (
      <MainLayout>
        <div className="bg-muted/30 min-h-screen py-8">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center text-destructive">Job not found</div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="bg-muted/30 min-h-screen py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Back Button */}
          <Link
            to={`/jobs/${id}`}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Job Details
          </Link>

          {/* Job Summary */}
          <div className="bg-card rounded-xl p-6 shadow-sm mb-8">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center">
                <Building2 className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-foreground">
                  {job.jobTitle}
                </h1>
                <p className="text-muted-foreground">
                  {job.company?.companyName}
                </p>
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {job.location}
                  </span>
                  <Badge variant="secondary">{job.jobType}</Badge>
                  <span className="font-semibold text-primary">
                    {job.salaryRange}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div
                  className={`flex items-center gap-2 ${currentStep >= step.number ? "text-primary" : "text-muted-foreground"}`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      currentStep > step.number
                        ? "bg-primary text-primary-foreground"
                        : currentStep === step.number
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {currentStep > step.number ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <step.icon className="w-5 h-5" />
                    )}
                  </div>
                  <span className="font-medium hidden sm:block">
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-16 h-1 mx-4 rounded ${
                      currentStep > step.number ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Form Steps */}
          <div className="bg-card rounded-xl p-8 shadow-sm">
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-foreground">
                  Application Documents
                </h2>

                {/* CV Upload */}
                <div>
                  <Label>Resume/CV *</Label>
                  <div className="mt-2 border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors">
                    <input
                      type="file"
                      id="cv"
                      className="hidden"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                    />
                    <label htmlFor="cv" className="cursor-pointer">
                      <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      {formData.cvFile ? (
                        <div className="flex items-center justify-center gap-2">
                          <p className="text-foreground font-medium">
                            {formData.cvFile.name}
                          </p>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              setFormData({ ...formData, cvFile: null });
                            }}
                            className="text-destructive hover:text-destructive/80"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <p className="text-foreground font-medium">
                            Click to upload your CV
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            PDF, DOC, DOCX (Max 10MB)
                          </p>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                {/* Cover Letter */}
                <div>
                  <Label htmlFor="coverLetter">Cover Letter (Optional)</Label>
                  <Textarea
                    id="coverLetter"
                    name="coverLetter"
                    placeholder="Write a brief cover letter explaining why you're the perfect fit for this role..."
                    className="min-h-[200px] mt-2"
                    value={formData.coverLetter}
                    onChange={(e) =>
                      setFormData({ ...formData, coverLetter: e.target.value })
                    }
                    maxLength={2000}
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    {formData.coverLetter.length}/2000 characters
                  </p>
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={() => setCurrentStep(2)}
                    disabled={!formData.cvFile}
                  >
                    Continue
                  </Button>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-foreground">
                  Review Your Application
                </h2>

                <div className="space-y-4">
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h3 className="font-semibold text-foreground mb-2">
                      Job Details
                    </h3>
                    <div className="text-sm space-y-1">
                      <p>
                        <span className="text-muted-foreground">Position:</span>{" "}
                        {job.jobTitle}
                      </p>
                      <p>
                        <span className="text-muted-foreground">Company:</span>{" "}
                        {job.company?.companyName}
                      </p>
                      <p>
                        <span className="text-muted-foreground">Location:</span>{" "}
                        {job.location}
                      </p>
                      <p>
                        <span className="text-muted-foreground">Type:</span>{" "}
                        {job.jobType}
                      </p>
                    </div>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-4">
                    <h3 className="font-semibold text-foreground mb-2">
                      Your Documents
                    </h3>
                    <div className="text-sm">
                      <p>
                        <span className="text-muted-foreground">CV:</span>{" "}
                        {formData.cvFile?.name || "Not uploaded"}
                      </p>
                      {formData.coverLetter && (
                        <>
                          <p className="mt-2">
                            <span className="text-muted-foreground">
                              Cover Letter:
                            </span>
                          </p>
                          <p className="mt-1 text-muted-foreground whitespace-pre-line">
                            {formData.coverLetter}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="terms"
                    className="rounded"
                    required
                  />
                  <Label htmlFor="terms" className="text-sm">
                    I confirm that all information provided is accurate and
                    complete.
                  </Label>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setCurrentStep(1)}>
                    Back
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    className="bg-primary"
                    disabled={loading}
                  >
                    {loading ? "Submitting..." : "Submit Application"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ApplyJob;
