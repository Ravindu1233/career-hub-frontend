import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Briefcase, Mail, Lock, Eye, EyeOff, ArrowLeft, CheckCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

type Step = "email" | "otp" | "password";

function getErrorMessage(err: any, fallback: string) {
  const msg = err?.response?.data?.message;
  if (Array.isArray(msg)) return msg.join(", ");
  if (typeof msg === "string") return msg;
  return fallback;
}

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const getStepNumber = () => {
    if (step === "email") return 1;
    if (step === "otp") return 2;
    return 3;
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({ title: "Missing email", description: "Please enter your email address.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      await api.post("/auth/user/send-otp", { email });
      toast({
        title: "OTP sent",
        description: "If your account exists, a verification code has been sent to your email.",
      });
      setStep("otp");
    } catch (err: any) {
      toast({
        title: "Failed to send OTP",
        description: getErrorMessage(err, "Please try again."),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast({ title: "Invalid OTP", description: "Please enter the 6-digit OTP.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      await api.post("/auth/user/verify-otp", { email, otp });
      toast({ title: "OTP verified", description: "You can now set a new password." });
      setStep("password");
    } catch (err: any) {
      toast({
        title: "OTP verification failed",
        description: getErrorMessage(err, "Invalid or expired OTP."),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      toast({ title: "Weak password", description: "Password must be at least 6 characters.", variant: "destructive" });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({ title: "Mismatch", description: "Passwords do not match.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      await api.post("/auth/user/reset-password", { email, newPassword });
      toast({ title: "Password reset successful", description: "Please sign in with your new password." });
      navigate("/login");
    } catch (err: any) {
      toast({
        title: "Reset failed",
        description: getErrorMessage(err, "Failed to reset password."),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email) return;
    setIsLoading(true);
    try {
      await api.post("/auth/user/send-otp", { email });
      toast({ title: "OTP resent", description: "Check your email for the new code." });
    } catch (err: any) {
      toast({
        title: "Resend failed",
        description: getErrorMessage(err, "Please try again."),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
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

          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">Reset your password securely</h1>
          <p className="text-xl text-white/80 mb-12">
            Complete the 3-step verification flow to recover your account access.
          </p>

          <div className="space-y-4">
            {["Enter your account email", "Verify OTP from your inbox", "Set a new password"].map((item) => (
              <div key={item} className="flex items-center gap-3 text-white/90">
                <CheckCircle className="h-5 w-5 text-white" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-background">
        <div className="w-full max-w-md">
          <Link to="/" className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <Briefcase className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">
              Career<span className="text-primary">Hub</span>
            </span>
          </Link>

          <div className="text-center lg:text-left mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">Forgot Password</h2>
            <p className="text-muted-foreground">Step {getStepNumber()} of 3</p>
          </div>

          <div className="flex items-center justify-center lg:justify-start gap-2 mb-8">
            {[1, 2, 3].map((num) => (
              <div key={num} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                    getStepNumber() >= num
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {getStepNumber() > num ? <CheckCircle className="w-5 h-5" /> : num}
                </div>
                {num < 3 && (
                  <div
                    className={`w-10 h-1 mx-1 transition-colors ${
                      getStepNumber() > num ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {step === "email" && (
            <form onSubmit={handleSendOtp} className="space-y-5">
              <div>
                <Label htmlFor="email" className="block mb-2">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="h-12 pl-12"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                {isLoading ? "Sending..." : "Send Verification Code"}
              </Button>
            </form>
          )}

          {step === "otp" && (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Enter the 6-digit code sent to {email}</p>
              </div>

              <div className="flex justify-center">
                <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                {isLoading ? "Verifying..." : "Verify Code"}
              </Button>

              <Button type="button" variant="ghost" className="w-full" onClick={handleResendOtp} disabled={isLoading}>
                Resend Code
              </Button>
            </form>
          )}

          {step === "password" && (
            <form onSubmit={handleResetPassword} className="space-y-5">
              <div>
                <Label htmlFor="newPassword" className="block mb-2">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    className="h-12 pl-12 pr-12"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword((v) => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div>
                <Label htmlFor="confirmPassword" className="block mb-2">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    className="h-12 pl-12 pr-12"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                {isLoading ? "Resetting..." : "Reset Password"}
              </Button>
            </form>
          )}

          <div className="text-center mt-8">
            <Link to="/login" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
