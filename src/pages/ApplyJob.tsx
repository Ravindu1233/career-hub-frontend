import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Check, 
  Upload, 
  FileText, 
  User, 
  Briefcase,
  MapPin,
  Building2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ApplyJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    phone: "",
    linkedin: "",
    portfolio: "",
    coverLetter: "",
    expectedSalary: "",
    availability: "",
    cvFile: null as File | null
  });

  // Mock job data
  const job = {
    id: id,
    title: "Senior Frontend Developer",
    company: "TechCorp Inc.",
    location: "New York, NY",
    type: "Full-time",
    salary: "$120,000 - $150,000"
  };

  const steps = [
    { number: 1, title: "Personal Info", icon: User },
    { number: 2, title: "Documents", icon: FileText },
    { number: 3, title: "Review", icon: Check }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, cvFile: e.target.files[0] });
    }
  };

  const handleSubmit = () => {
    toast({
      title: "Application Submitted!",
      description: "Your application has been sent successfully.",
    });
    navigate("/my-applications");
  };

  return (
    <MainLayout>
      <div className="bg-muted/30 min-h-screen py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Back Button */}
          <Link to={`/jobs/${id}`} className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
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
                <h1 className="text-2xl font-bold text-foreground">{job.title}</h1>
                <p className="text-muted-foreground">{job.company}</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {job.location}
                  </span>
                  <Badge variant="secondary">{job.type}</Badge>
                  <span className="font-semibold text-primary">{job.salary}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`flex items-center gap-2 ${currentStep >= step.number ? 'text-primary' : 'text-muted-foreground'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    currentStep > step.number 
                      ? 'bg-primary text-primary-foreground' 
                      : currentStep === step.number 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted text-muted-foreground'
                  }`}>
                    {currentStep > step.number ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <step.icon className="w-5 h-5" />
                    )}
                  </div>
                  <span className="font-medium hidden sm:block">{step.title}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-1 mx-4 rounded ${
                    currentStep > step.number ? 'bg-primary' : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Form Steps */}
          <div className="bg-card rounded-xl p-8 shadow-sm">
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-foreground">Personal Information</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone" 
                      name="phone"
                      placeholder="+1 (555) 000-0000"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="linkedin">LinkedIn Profile (Optional)</Label>
                    <Input 
                      id="linkedin" 
                      name="linkedin"
                      placeholder="https://linkedin.com/in/yourprofile"
                      value={formData.linkedin}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="portfolio">Portfolio/Website (Optional)</Label>
                    <Input 
                      id="portfolio" 
                      name="portfolio"
                      placeholder="https://yourportfolio.com"
                      value={formData.portfolio}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button onClick={() => setCurrentStep(2)}>
                    Continue
                  </Button>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-foreground">Documents</h2>
                
                {/* CV Upload */}
                <div>
                  <Label>Resume/CV</Label>
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
                        <p className="text-foreground font-medium">{formData.cvFile.name}</p>
                      ) : (
                        <>
                          <p className="text-foreground font-medium">Click to upload your CV</p>
                          <p className="text-sm text-muted-foreground mt-1">PDF, DOC, DOCX (Max 10MB)</p>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                {/* Cover Letter */}
                <div>
                  <Label htmlFor="coverLetter">Cover Letter</Label>
                  <Textarea 
                    id="coverLetter"
                    name="coverLetter"
                    placeholder="Write a brief cover letter explaining why you're the perfect fit for this role..."
                    className="min-h-[200px] mt-2"
                    value={formData.coverLetter}
                    onChange={handleInputChange}
                  />
                  <p className="text-sm text-muted-foreground mt-1">{formData.coverLetter.length}/1000 characters</p>
                </div>

                {/* Additional Questions */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="expectedSalary">Expected Salary</Label>
                    <Input 
                      id="expectedSalary"
                      name="expectedSalary"
                      placeholder="e.g., $130,000"
                      value={formData.expectedSalary}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="availability">Availability / Start Date</Label>
                    <Input 
                      id="availability"
                      name="availability"
                      type="date"
                      value={formData.availability}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setCurrentStep(1)}>
                    Back
                  </Button>
                  <Button onClick={() => setCurrentStep(3)}>
                    Continue
                  </Button>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-foreground">Review Your Application</h2>
                
                <div className="space-y-4">
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h3 className="font-semibold text-foreground mb-2">Personal Information</h3>
                    <div className="grid md:grid-cols-2 gap-2 text-sm">
                      <p><span className="text-muted-foreground">Phone:</span> {formData.phone || "Not provided"}</p>
                      <p><span className="text-muted-foreground">LinkedIn:</span> {formData.linkedin || "Not provided"}</p>
                      <p><span className="text-muted-foreground">Portfolio:</span> {formData.portfolio || "Not provided"}</p>
                    </div>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-4">
                    <h3 className="font-semibold text-foreground mb-2">Documents</h3>
                    <div className="text-sm">
                      <p><span className="text-muted-foreground">CV:</span> {formData.cvFile?.name || "Not uploaded"}</p>
                      <p className="mt-2"><span className="text-muted-foreground">Cover Letter:</span></p>
                      <p className="mt-1 text-muted-foreground">{formData.coverLetter || "Not provided"}</p>
                    </div>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-4">
                    <h3 className="font-semibold text-foreground mb-2">Additional Details</h3>
                    <div className="grid md:grid-cols-2 gap-2 text-sm">
                      <p><span className="text-muted-foreground">Expected Salary:</span> {formData.expectedSalary || "Not provided"}</p>
                      <p><span className="text-muted-foreground">Start Date:</span> {formData.availability || "Not provided"}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input type="checkbox" id="terms" className="rounded" />
                  <Label htmlFor="terms" className="text-sm">
                    I confirm that all information provided is accurate and complete.
                  </Label>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setCurrentStep(2)}>
                    Back
                  </Button>
                  <Button onClick={handleSubmit} className="bg-primary">
                    Submit Application
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
