import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Briefcase,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Building2,
  Phone,
  ArrowRight,
  CheckCircle,
  Check,
} from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

type UserType = "jobseeker" | "employer";

const passwordRequirements = [
  {
    id: "length",
    label: "At least 8 characters",
    check: (p: string) => p.length >= 8,
  },
  {
    id: "uppercase",
    label: "One uppercase letter",
    check: (p: string) => /[A-Z]/.test(p),
  },
  { id: "number", label: "One number", check: (p: string) => /[0-9]/.test(p) },
  {
    id: "special",
    label: "One special character",
    check: (p: string) => /[!@#$%^&*]/.test(p),
  },
];

function splitName(fullName: string) {
  const cleaned = fullName.trim().replace(/\s+/g, " ");
  if (!cleaned) return { firstName: "", lastName: "" };
  const parts = cleaned.split(" ");
  const firstName = parts[0] ?? "";
  const lastName = parts.slice(1).join(" ") || null;
  return { firstName, lastName };
}

function getErrorMessage(err: any): string {
  // NestJS common error formats:
  // { message: "..." } or { message: ["..."] }
  const msg = err?.response?.data?.message;
  if (Array.isArray(msg)) return msg.join(", ");
  if (typeof msg === "string") return msg;
  return "Something went wrong. Please try again.";
}

export default function Register() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [userType, setUserType] = useState<UserType>("jobseeker");
  const [formData, setFormData] = useState({
    fullName: "",
    companyName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // simple inline feedback without changing UI layout much
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const passwordOk = useMemo(
    () => passwordRequirements.every((r) => r.check(formData.password)),
    [formData.password],
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // basic frontend validations
    if (formData.password !== formData.confirmPassword) {
      const message = "Passwords do not match.";
      setError(message);
      toast({
        title: "Registration failed",
        description: message,
        variant: "destructive",
      });
      return;
    }
    if (!passwordOk) {
      const message = "Please meet all password requirements.";
      setError(message);
      toast({
        title: "Registration failed",
        description: message,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      if (userType === "jobseeker") {
        const { firstName, lastName } = splitName(formData.fullName);

        const payload = {
          email: formData.email,
          password: formData.password,
          firstName: firstName || undefined,
          lastName: lastName || undefined,
          mobile: formData.phone || undefined,
        };

        const res = await api.post("/auth/user/register", payload);

        // backend returns { token, user }
        if (res?.data?.token) localStorage.setItem("token", res.data.token);
        localStorage.setItem("authType", "USER");

        setSuccess("Account created successfully!");
        toast({
          title: "Registration successful",
          description: "Your account has been created. Please log in.",
        });
        // go to login or dashboard
        navigate("/login");
      } else {
        // employer
        const payload = {
          email: formData.email,
          password: formData.password,
          companyName: formData.companyName,
          phone: formData.phone || undefined, // ✅ FIX
        };

        const res = await api.post("/auth/company/register", payload);

        // backend returns { token, company }
        if (res?.data?.token) localStorage.setItem("token", res.data.token);
        localStorage.setItem("authType", "COMPANY");

        setSuccess("Company account created successfully!");
        toast({
          title: "Registration successful",
          description: "Your company account has been created. Please log in.",
        });
        navigate("/login");
      }
    } catch (err: any) {
      const message = getErrorMessage(err);
      setError(message);
      toast({
        title: "Registration failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Brand */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col justify-center px-12 lg:px-20">
          <Link to="/" className="flex items-center gap-2 mb-12">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Briefcase className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">
              Career<span className="text-white/80">Hub</span>
            </span>
          </Link>

          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Start your journey with us today
          </h1>
          <p className="text-xl text-white/80 mb-12">
            {userType === "jobseeker"
              ? "Create an account to access thousands of job opportunities and career resources."
              : "Post jobs, find top talent, and build your dream team with our recruitment tools."}
          </p>

          <div className="space-y-4">
            {(userType === "jobseeker"
              ? [
                  "Browse thousands of verified job listings",
                  "Get matched with relevant opportunities",
                  "Track applications and interview schedules",
                ]
              : [
                  "Post unlimited job listings",
                  "Access a pool of qualified candidates",
                  "Streamlined recruitment process",
                ]
            ).map((feature) => (
              <div
                key={feature}
                className="flex items-center gap-3 text-white/90"
              >
                <CheckCircle className="h-5 w-5 text-white" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-background overflow-y-auto">
        <div className="w-full max-w-lg">
          {/* Mobile logo */}
          <Link to="/" className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <Briefcase className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">
              Career<span className="text-primary">Hub</span>
            </span>
          </Link>

          <div className="text-center lg:text-left mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
              Create Account
            </h2>
            <p className="text-muted-foreground">
              Get started with your free account
            </p>
          </div>

          {/* ✅ error/success (small, not changing UI structure) */}
          {error && (
            <div className="mb-4 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-600">
              {success}
            </div>
          )}

          {/* User type selection */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <button
              type="button"
              onClick={() => setUserType("jobseeker")}
              className={`p-4 rounded-xl border-2 transition-all ${
                userType === "jobseeker"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/30"
              }`}
            >
              <div
                className={`h-12 w-12 rounded-xl mx-auto mb-3 flex items-center justify-center ${
                  userType === "jobseeker" ? "bg-primary/10" : "bg-muted"
                }`}
              >
                <User
                  className={`h-6 w-6 ${
                    userType === "jobseeker"
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                />
              </div>
              <p
                className={`font-medium ${
                  userType === "jobseeker"
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                Job Seeker
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Looking for opportunities
              </p>
            </button>

            <button
              type="button"
              onClick={() => setUserType("employer")}
              className={`p-4 rounded-xl border-2 transition-all ${
                userType === "employer"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/30"
              }`}
            >
              <div
                className={`h-12 w-12 rounded-xl mx-auto mb-3 flex items-center justify-center ${
                  userType === "employer" ? "bg-primary/10" : "bg-muted"
                }`}
              >
                <Building2
                  className={`h-6 w-6 ${
                    userType === "employer"
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                />
              </div>
              <p
                className={`font-medium ${
                  userType === "employer"
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                Employer
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Hiring talent
              </p>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Company name (employer only) */}
            {userType === "employer" && (
              <div>
                <label
                  htmlFor="companyName"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Company Name
                </label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    id="companyName"
                    name="companyName"
                    type="text"
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="Your Company"
                    className="w-full h-12 pl-12 pr-4 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    required
                  />
                </div>
              </div>
            )}

            {/* Full name (jobseeker only) */}
            {userType === "jobseeker" && (
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full h-12 pl-12 pr-4 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    required
                  />
                </div>
              </div>
            )}

            {/* Email & Phone row */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full h-12 pl-12 pr-4 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    required
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Phone
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 000-0000"
                    className="w-full h-12 pl-12 pr-4 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  className="w-full h-12 pl-12 pr-12 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>

              {/* Password requirements */}
              <div className="grid grid-cols-2 gap-2 mt-3">
                {passwordRequirements.map((req) => (
                  <div key={req.id} className="flex items-center gap-2">
                    <div
                      className={`h-4 w-4 rounded-full flex items-center justify-center ${
                        req.check(formData.password) ? "bg-success" : "bg-muted"
                      }`}
                    >
                      {req.check(formData.password) && (
                        <Check className="h-3 w-3 text-white" />
                      )}
                    </div>
                    <span
                      className={`text-xs ${
                        req.check(formData.password)
                          ? "text-success"
                          : "text-muted-foreground"
                      }`}
                    >
                      {req.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Confirm password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className="w-full h-12 pl-12 pr-12 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3">
              <input
                id="terms"
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="h-4 w-4 mt-0.5 rounded border-border text-primary focus:ring-primary/20"
                required
              />
              <label htmlFor="terms" className="text-sm text-muted-foreground">
                I agree to the{" "}
                <Link to="/terms" className="text-primary hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Submit button */}
            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={isLoading || !agreed}
            >
              {isLoading ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Create Account
                  <ArrowRight className="h-5 w-5 ml-2" />
                </>
              )}
            </Button>
          </form>

          {/* Sign in link */}
          <p className="text-center mt-8 text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
