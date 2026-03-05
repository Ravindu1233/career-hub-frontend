import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin,
  Save,
  X,
  Edit3,
  AlertCircle,
  Clock,
  CheckCircle,
  ImageIcon,
  ArrowLeft,
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

type CompanyMeApi = {
  companyId: number;
  companyName: string;
  email: string;
  phone: string | null;
  address: string | null;
  industry: string | null;
  description: string | null;
  url: string | null;
  location: string | null;
  companySize: string | null;
  founded: string | null;
  benefitsAndPerks: string | null;
  profilePic: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED" | "ACTIVE";
  rejectionReason: string | null;
};

type CompanyProfileUI = {
  name: string;
  email: string;
  phone: string;
  website: string;
  location: string;
  industry: string;
  size: string;
  founded: string;
  description: string;
  benefits: string[];
  profilePic: string;
  status: CompanyMeApi["status"];
  rejectionReason: string;
};

function parseBenefits(v?: string | null): string[] {
  if (!v) return [];
  return v
    .split(/[\n,]/g)
    .map((s) => s.trim())
    .filter(Boolean);
}

function toUI(apiData: CompanyMeApi): CompanyProfileUI {
  return {
    name: apiData.companyName ?? "",
    email: apiData.email ?? "",
    phone: apiData.phone ?? "",
    website: apiData.url ?? "",
    location: apiData.location ?? "",
    industry: apiData.industry ?? "",
    size: apiData.companySize ?? "",
    founded: apiData.founded
      ? new Date(apiData.founded).getFullYear().toString()
      : "",
    description: apiData.description ?? "",
    benefits: parseBenefits(apiData.benefitsAndPerks),
    profilePic: apiData.profilePic ?? "",
    status: apiData.status,
    rejectionReason: apiData.rejectionReason ?? "",
  };
}

function resolveImageUrl(path?: string | null): string {
  if (!path) return "";
  const value = path.trim();
  if (!value) return "";
  if (/^https?:\/\//i.test(value) || value.startsWith("data:")) return value;
  return `${API_BASE}${value.startsWith("/") ? value : `/${value}`}`;
}

function StatusBanner({
  status,
  rejectionReason,
}: {
  status: CompanyMeApi["status"];
  rejectionReason: string;
}) {
  if (status === "APPROVED" || status === "ACTIVE") {
    return (
      <div className="mb-6 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 flex items-center gap-2 text-green-700 dark:text-green-400 text-sm">
        <CheckCircle className="h-4 w-4 shrink-0" />
        <span>
          Your company is approved. You can edit your profile anytime.
        </span>
      </div>
    );
  }

  if (status === "PENDING") {
    return (
      <div className="mb-6 rounded-xl border border-yellow-500/30 bg-yellow-500/10 px-4 py-3 flex items-center gap-2 text-yellow-700 dark:text-yellow-400 text-sm">
        <Clock className="h-4 w-4 shrink-0" />
        <span>
          Your company is pending admin approval. Profile editing is disabled
          until approved. Your jobs are also hidden from public until
          re-approved.
        </span>
      </div>
    );
  }

  if (status === "REJECTED") {
    return (
      <div className="mb-6 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 flex items-start gap-2 text-destructive text-sm">
        <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
        <div>
          <p className="font-medium">Your company application was rejected.</p>
          {rejectionReason && (
            <p className="mt-1 text-destructive/80">
              Reason: {rejectionReason}
            </p>
          )}
        </div>
      </div>
    );
  }

  if (status === "SUSPENDED") {
    return (
      <div className="mb-6 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 flex items-start gap-2 text-destructive text-sm">
        <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
        <div>
          <p className="font-medium">
            Your company account has been suspended.
          </p>
          {rejectionReason && (
            <p className="mt-1 text-destructive/80">
              Reason: {rejectionReason}
            </p>
          )}
        </div>
      </div>
    );
  }

  return null;
}

export default function CompanyProfile() {
  const logoInputRef = useRef<HTMLInputElement | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profile, setProfile] = useState<CompanyProfileUI>({
    name: "",
    email: "",
    phone: "",
    website: "",
    location: "",
    industry: "",
    size: "",
    founded: "",
    description: "",
    benefits: [],
    profilePic: "",
    status: "PENDING",
    rejectionReason: "",
  });

  const [editedProfile, setEditedProfile] = useState<CompanyProfileUI>(profile);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [benefitInput, setBenefitInput] = useState("");

  // ✅ Only APPROVED or ACTIVE companies can edit
  // ✅ After save, backend returns status: PENDING so this becomes false immediately
  const canEdit = profile.status === "APPROVED" || profile.status === "ACTIVE";

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async (silent = false) => {
    if (!silent) setLoadingProfile(true);
    setError(null);
    try {
      const res = await api.get("/companies/me");
      const ui = toUI(res.data as CompanyMeApi);
      setProfile(ui);
      setEditedProfile(ui);
    } catch (e: any) {
      setError(e?.response?.data?.message || "Failed to load profile");
    } finally {
      if (!silent) setLoadingProfile(false);
    }
  };

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    setError(null);
    try {
      const payload: Record<string, any> = {
        companyName: editedProfile.name || undefined,
        phone: editedProfile.phone || undefined,
        url: editedProfile.website || undefined,
        location: editedProfile.location || undefined,
        industry: editedProfile.industry || undefined,
        companySize: editedProfile.size || undefined,
        description: editedProfile.description || undefined,
        benefitsAndPerks: editedProfile.benefits.join(", ") || undefined,
      };

      if (editedProfile.founded?.match(/^\d{4}$/)) {
        payload.founded = `${editedProfile.founded}-01-01`;
      }

      const res = await api.patch("/companies/me", payload);

      // ✅ Backend returns status: PENDING after edit
      // ✅ toUI maps it into profile.status = "PENDING"
      // ✅ canEdit becomes false → Edit button disappears immediately
      // ✅ StatusBanner switches to yellow PENDING banner automatically
      const ui = toUI(res.data as CompanyMeApi);
      setProfile(ui);
      setEditedProfile(ui);
      setIsEditingProfile(false);
    } catch (e: any) {
      setError(e?.response?.data?.message || "Failed to save profile");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedProfile(profile);
    setIsEditingProfile(false);
    setError(null);
  };

  const addBenefit = () => {
    const v = benefitInput.trim();
    if (!v) return;
    setEditedProfile((p) => ({
      ...p,
      benefits: Array.from(new Set([...(p.benefits || []), v])),
    }));
    setBenefitInput("");
  };

  const removeBenefit = (value: string) => {
    setEditedProfile((p) => ({
      ...p,
      benefits: (p.benefits || []).filter((b) => b !== value),
    }));
  };

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    setError(null);
    try {
      const form = new FormData();
      form.append("image", file);
      await api.post("/profile/company/image", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      await loadProfile(true);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to upload company logo");
    } finally {
      setUploadingLogo(false);
      e.currentTarget.value = "";
    }
  };

  if (loadingProfile) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <Link to="/company/dashboard">
          <Button variant="ghost" className="gap-2 mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Company Profile
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your company information and details
          </p>
        </div>

        {/* ✅ Status banner — always visible, updates immediately after save */}
        <StatusBanner
          status={profile.status}
          rejectionReason={profile.rejectionReason}
        />

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Profile Information</CardTitle>
            {/* ✅ Edit button only shows when APPROVED/ACTIVE */}
            {/* ✅ Disappears immediately after save (status → PENDING) */}
            {canEdit &&
              (isEditingProfile ? (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancelEdit}
                    disabled={savingProfile}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSaveProfile}
                    disabled={savingProfile}
                  >
                    <Save className="h-4 w-4 mr-1" />
                    {savingProfile ? "Saving..." : "Save"}
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditingProfile(true)}
                >
                  <Edit3 className="h-4 w-4 mr-1" />
                  Edit Profile
                </Button>
              ))}
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <div className="p-3 border border-destructive/30 rounded-md bg-destructive/10">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <div className="flex flex-col md:flex-row gap-6">
              {/* Logo */}
              <div className="flex flex-col items-center gap-3">
                <div className="h-24 w-24 rounded-xl bg-primary/10 overflow-hidden flex items-center justify-center text-3xl font-bold text-primary">
                  {profile.profilePic ? (
                    <img
                      src={resolveImageUrl(profile.profilePic)}
                      alt={`${profile.name} logo`}
                      className="h-full w-full object-cover"
                      onError={(evt) => {
                        (evt.currentTarget as HTMLImageElement).style.display =
                          "none";
                      }}
                    />
                  ) : profile.name ? (
                    profile.name.charAt(0)
                  ) : (
                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
                  )}
                </div>
                {isEditingProfile && (
                  <>
                    <input
                      ref={logoInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleLogoChange}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => logoInputRef.current?.click()}
                      disabled={uploadingLogo || savingProfile}
                    >
                      {uploadingLogo ? "Uploading..." : "Change Logo"}
                    </Button>
                  </>
                )}
              </div>

              {/* Basic Info Grid */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Company Name
                  </label>
                  {isEditingProfile ? (
                    <Input
                      value={editedProfile.name}
                      onChange={(e) =>
                        setEditedProfile({
                          ...editedProfile,
                          name: e.target.value,
                        })
                      }
                    />
                  ) : (
                    <p className="text-foreground flex items-center gap-2 mt-1">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      {profile.name || "—"}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Email
                  </label>
                  {/* ✅ Email never editable — it's the login identity */}
                  <p className="text-foreground flex items-center gap-2 mt-1">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    {profile.email || "—"}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Phone
                  </label>
                  {isEditingProfile ? (
                    <Input
                      value={editedProfile.phone}
                      onChange={(e) =>
                        setEditedProfile({
                          ...editedProfile,
                          phone: e.target.value,
                        })
                      }
                    />
                  ) : (
                    <p className="text-foreground flex items-center gap-2 mt-1">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      {profile.phone || "—"}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Website
                  </label>
                  {isEditingProfile ? (
                    <Input
                      value={editedProfile.website}
                      onChange={(e) =>
                        setEditedProfile({
                          ...editedProfile,
                          website: e.target.value,
                        })
                      }
                    />
                  ) : (
                    <p className="text-foreground flex items-center gap-2 mt-1">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      {profile.website || "—"}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Location
                  </label>
                  {isEditingProfile ? (
                    <Input
                      value={editedProfile.location}
                      onChange={(e) =>
                        setEditedProfile({
                          ...editedProfile,
                          location: e.target.value,
                        })
                      }
                    />
                  ) : (
                    <p className="text-foreground flex items-center gap-2 mt-1">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      {profile.location || "—"}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Industry
                  </label>
                  {isEditingProfile ? (
                    <Input
                      value={editedProfile.industry}
                      onChange={(e) =>
                        setEditedProfile({
                          ...editedProfile,
                          industry: e.target.value,
                        })
                      }
                    />
                  ) : (
                    <p className="text-foreground mt-1">
                      {profile.industry || "—"}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Company Size
                  </label>
                  {isEditingProfile ? (
                    <Input
                      value={editedProfile.size}
                      onChange={(e) =>
                        setEditedProfile({
                          ...editedProfile,
                          size: e.target.value,
                        })
                      }
                    />
                  ) : (
                    <p className="text-foreground mt-1">
                      {profile.size || "—"}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Founded (Year)
                  </label>
                  {isEditingProfile ? (
                    <Input
                      value={editedProfile.founded}
                      placeholder="e.g. 2010"
                      maxLength={4}
                      onChange={(e) => {
                        const val = e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 4);
                        setEditedProfile({ ...editedProfile, founded: val });
                      }}
                    />
                  ) : (
                    <p className="text-foreground mt-1">
                      {profile.founded || "—"}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Company Description
              </label>
              {isEditingProfile ? (
                <Textarea
                  value={editedProfile.description}
                  onChange={(e) =>
                    setEditedProfile({
                      ...editedProfile,
                      description: e.target.value,
                    })
                  }
                  rows={3}
                  className="mt-1"
                />
              ) : (
                <p className="text-foreground mt-1">
                  {profile.description || "—"}
                </p>
              )}
            </div>

            {/* Benefits */}
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                Benefits & Perks
              </label>

              {isEditingProfile && (
                <div className="flex gap-2 mb-3">
                  <Input
                    value={benefitInput}
                    onChange={(e) => setBenefitInput(e.target.value)}
                    placeholder="Type a benefit (e.g., Remote Work)"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addBenefit();
                      }
                    }}
                  />
                  <Button type="button" onClick={addBenefit}>
                    Add
                  </Button>
                </div>
              )}

              {(isEditingProfile ? editedProfile.benefits : profile.benefits)
                .length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No benefits added yet.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {(isEditingProfile
                    ? editedProfile.benefits
                    : profile.benefits
                  ).map((benefit, idx) => (
                    <span
                      key={`${benefit}-${idx}`}
                      className="inline-flex items-center rounded-full border bg-muted px-3 py-1 text-sm font-medium text-foreground"
                    >
                      {benefit}
                      {isEditingProfile && (
                        <button
                          type="button"
                          onClick={() => removeBenefit(benefit)}
                          className="ml-2 text-muted-foreground hover:text-foreground"
                          aria-label={`Remove ${benefit}`}
                        >
                          ✕
                        </button>
                      )}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
