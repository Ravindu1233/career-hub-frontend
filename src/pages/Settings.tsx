import { FormEvent, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { Bell, Lock, Save, UserCog } from "lucide-react";

const NOTIFICATION_PREF_KEY = "settings:email-notifications";

type AuthType = "USER" | "COMPANY";

function getAuthType(): AuthType {
  const value = localStorage.getItem("authType");
  return value === "COMPANY" ? "COMPANY" : "USER";
}

function getProfilePath(authType: AuthType) {
  return authType === "COMPANY" ? "/company/profile" : "/user/profile";
}

function getDashboardPath(authType: AuthType) {
  return authType === "COMPANY" ? "/company/dashboard" : "/user/dashboard";
}

function getDisplayName(authType: AuthType) {
  if (authType === "COMPANY") {
    const raw = localStorage.getItem("company");
    if (!raw) return "Company";
    try {
      const company = JSON.parse(raw);
      return company?.companyName || company?.email || "Company";
    } catch {
      return "Company";
    }
  }

  const raw = localStorage.getItem("user");
  if (!raw) return "User";
  try {
    const user = JSON.parse(raw);
    return user?.firstName
      ? `${user.firstName}${user.lastName ? ` ${user.lastName}` : ""}`
      : user?.email || "User";
  } catch {
    return "User";
  }
}

type ApiErrorShape = {
  response?: {
    data?: {
      message?: string | string[];
    };
  };
};

function getErrorMessage(err: unknown, fallback: string) {
  const maybeError = err as ApiErrorShape;
  const msg = maybeError?.response?.data?.message;
  if (Array.isArray(msg)) return msg.join(", ");
  if (typeof msg === "string") return msg;
  return fallback;
}

export default function Settings() {
  const { toast } = useToast();
  const authType = getAuthType();
  const displayName = useMemo(() => getDisplayName(authType), [authType]);
  const profilePath = useMemo(() => getProfilePath(authType), [authType]);
  const dashboardPath = useMemo(() => getDashboardPath(authType), [authType]);

  const [emailNotifications, setEmailNotifications] = useState(
    localStorage.getItem(NOTIFICATION_PREF_KEY) !== "false",
  );
  const [savingNotifications, setSavingNotifications] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  const saveNotificationPreference = async () => {
    setSavingNotifications(true);
    try {
      localStorage.setItem(
        NOTIFICATION_PREF_KEY,
        emailNotifications ? "true" : "false",
      );
      toast({
        title: "Settings saved",
        description: "Notification preference updated.",
      });
    } finally {
      setSavingNotifications(false);
    }
  };

  const updatePassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: "Missing fields",
        description: "Fill in all password fields.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 8) {
      toast({
        title: "Password too short",
        description: "New password must be at least 8 characters.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "New password and confirm password do not match.",
        variant: "destructive",
      });
      return;
    }

    setSavingPassword(true);
    try {
      const endpoint =
        authType === "COMPANY"
          ? "/companies/me/change-password"
          : "/users/me/change-password";

      await api.patch(endpoint, {
        currentPassword,
        newPassword,
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      toast({
        title: "Password updated",
        description: "Your password has been changed successfully.",
      });
    } catch (err: unknown) {
      toast({
        title: "Failed to update password",
        description: getErrorMessage(
          err,
          "Password update endpoint is unavailable or the current password is incorrect.",
        ),
        variant: "destructive",
      });
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage account security and personal preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notifications
                </CardTitle>
                <CardDescription>
                  Choose how CareerHub should notify you
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <Label className="text-base font-medium">
                      Email notifications
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Receive important updates by email
                    </p>
                  </div>
                  <Switch
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={saveNotificationPreference}
                    disabled={savingNotifications}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {savingNotifications ? "Saving..." : "Save preference"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Security
                </CardTitle>
                <CardDescription>Change your account password</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4" onSubmit={updatePassword}>
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current password</Label>
                    <Input
                      id="current-password"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-password">New password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="At least 8 characters"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter new password"
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" disabled={savingPassword}>
                      {savingPassword ? "Updating..." : "Update password"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCog className="h-5 w-5" />
                  Account
                </CardTitle>
                <CardDescription>Quick account actions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="rounded-lg border p-3">
                  <p className="text-sm text-muted-foreground">Signed in as</p>
                  <p className="font-medium text-foreground">{displayName}</p>
                </div>

                <Link to={profilePath}>
                  <Button variant="outline" className="w-full">
                    Open Profile
                  </Button>
                </Link>
                <Link to={dashboardPath}>
                  <Button variant="outline" className="w-full">
                    Back to Dashboard
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
