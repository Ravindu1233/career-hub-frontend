import { useEffect, useMemo, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Edit3,
  Save,
  X,
  Calendar,
  Plus,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

// =============================
// API Endpoints
// =============================
const API_USER_ME = "/users/me";
const API_USER_UPDATE = "/users/me";
const API_USER_IMAGE_UPLOAD = "/profile/user/image";
const API_USER_IMAGE_DELETE = "/profile/user/image";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

// =============================
// Backend Types
// =============================
type BackendUser = {
  userId: number;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  mobile?: string | null;
  address?: string | null;
  bio?: string | null;
  skills?: string[] | null;
  schools?: string | null;
  dob?: string | null;
  certifications?: string[];
  olPassCount?: number | null;
  profilePic?: string | null;
};

// =============================
// UI Profile Model
// =============================
type UiProfile = {
  name: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  skills: string[];
  schools: string;
  olPassCount: string;
  dob?: string;
  certifications: string[];
};

// =============================
// Conversion Functions
// =============================
function toUiProfile(u: BackendUser): UiProfile {
  const name = `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim() || "User";

  return {
    name,
    email: u.email ?? "",
    phone: u.mobile ?? "",
    location: u.address ?? "",
    bio: u.bio ?? "",
    skills: Array.isArray(u.skills) ? u.skills : [],
    schools: u.schools ?? "",
    olPassCount: u.olPassCount != null ? String(u.olPassCount) : "",
    dob: u.dob ?? "",
    certifications: Array.isArray(u.certifications) ? u.certifications : [],
  };
}

function toBackendUpdatePayload(p: UiProfile) {
  const [firstName, ...rest] = (p.name || "").trim().split(" ");
  const lastName = rest.join(" ").trim();

  const olPassNumber =
    p.olPassCount && String(p.olPassCount).trim() !== ""
      ? Number(p.olPassCount)
      : null;

  return {
    firstName: firstName || null,
    lastName: lastName || null,
    mobile: p.phone || null,
    address: p.location || null,
    bio: p.bio || null,
    skills: Array.isArray(p.skills) ? p.skills : [],
    schools: p.schools || null,
    certifications: p.certifications || [],
    dob: p.dob || null,
    olPassCount: Number.isFinite(olPassNumber as any) ? olPassNumber : null,
  };
}

function formatDate(iso?: string) {
  if (!iso) return "-";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString();
}

// =============================
// Main Component
// =============================
export default function UserProfile() {
  const queryClient = useQueryClient();

  const [isEditing, setIsEditing] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [newCertification, setNewCertification] = useState("");

  // Fetch user
  const {
    data: user,
    isLoading: userLoading,
    isError: userError,
  } = useQuery({
    queryKey: ["user-me"],
    queryFn: async () => {
      const res = await api.get(API_USER_ME);
      return res.data as BackendUser;
    },
  });

  const baseProfile = useMemo(() => (user ? toUiProfile(user) : null), [user]);

  const [profile, setProfile] = useState<UiProfile | null>(null);
  const [editedProfile, setEditedProfile] = useState<UiProfile | null>(null);
  const [uploadingPic, setUploadingPic] = useState(false);

  useEffect(() => {
    if (baseProfile) {
      setProfile(baseProfile);
      setEditedProfile(baseProfile);
    }
  }, [baseProfile]);

  const updateMutation = useMutation({
    mutationFn: async (payload: ReturnType<typeof toBackendUpdatePayload>) => {
      console.log("Sending update payload:", payload);
      const res = await api.patch(API_USER_UPDATE, payload);
      console.log("Update response:", res.data);
      return res.data as BackendUser;
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(["user-me"], updated);
      const ui = toUiProfile(updated);
      setProfile(ui);
      setEditedProfile(ui);
      setIsEditing(false);
    },
    onError: (error) => {
      console.error("Update error:", error);
    },
  });

  const handleSave = () => {
    if (!editedProfile) return;
    const payload = toBackendUpdatePayload(editedProfile);
    console.log("Skills being saved:", payload.skills);
    updateMutation.mutate(payload);
  };

  const handleCancel = () => {
    if (!profile) return;
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const addSkill = () => {
    if (!editedProfile) return;
    const s = newSkill.trim();
    if (!s) return;
    if (editedProfile.skills.includes(s)) return;

    setEditedProfile({
      ...editedProfile,
      skills: [...editedProfile.skills, s],
    });
    setNewSkill("");
  };

  const removeSkill = (skill: string) => {
    if (!editedProfile) return;
    setEditedProfile({
      ...editedProfile,
      skills: editedProfile.skills.filter((s) => s !== skill),
    });
  };

  const addCertification = () => {
    if (!editedProfile) return;
    const cert = newCertification.trim();
    if (!cert) return;
    if (editedProfile.certifications.includes(cert)) return;

    setEditedProfile({
      ...editedProfile,
      certifications: [...editedProfile.certifications, cert],
    });
    setNewCertification("");
  };

  const removeCertification = (certification: string) => {
    if (!editedProfile) return;
    setEditedProfile({
      ...editedProfile,
      certifications: editedProfile.certifications.filter(
        (c) => c !== certification,
      ),
    });
  };

  const uploadProfilePic = async (file: File) => {
    setUploadingPic(true);
    try {
      const form = new FormData();
      form.append("image", file);

      await api.post(API_USER_IMAGE_UPLOAD, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      await queryClient.invalidateQueries({ queryKey: ["user-me"] });
    } finally {
      setUploadingPic(false);
    }
  };

  const deleteProfilePic = async () => {
    setUploadingPic(true);
    try {
      await api.delete(API_USER_IMAGE_DELETE);
      await queryClient.invalidateQueries({ queryKey: ["user-me"] });
    } finally {
      setUploadingPic(false);
    }
  };

  const safeProfile: UiProfile = profile ?? {
    name: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
    skills: [],
    schools: "",
    olPassCount: "",
    dob: "",
    certifications: [],
  };
  const safeEdited: UiProfile = editedProfile ?? safeProfile;

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
            <p className="text-muted-foreground mt-1">
              Manage your personal information and preferences
            </p>

            {userLoading && (
              <p className="text-xs text-muted-foreground mt-2">Loading...</p>
            )}
            {userError && (
              <p className="text-xs text-destructive mt-2">
                Failed to load profile data.
              </p>
            )}
          </div>
        </div>

        {/* Profile Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Profile Information</CardTitle>
            {isEditing ? (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCancel}>
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={updateMutation.isPending}
                >
                  <Save className="h-4 w-4 mr-1" />
                  {updateMutation.isPending ? "Saving..." : "Save"}
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                <Edit3 className="h-4 w-4 mr-1" />
                Edit Profile
              </Button>
            )}
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Avatar */}
              <div className="flex flex-col items-center gap-3">
                <div className="h-24 w-24 rounded-full bg-primary/10 overflow-hidden flex items-center justify-center">
                  {user?.profilePic ? (
                    <img
                      src={`${API_BASE}${user.profilePic}`}
                      alt="Profile"
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display =
                          "none";
                      }}
                    />
                  ) : (
                    <div className="text-3xl font-bold text-primary">
                      {(safeProfile.name || "U").charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                {isEditing && (
                  <div className="flex flex-col gap-2 items-center">
                    <label className="w-full">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) uploadProfilePic(file);
                          e.currentTarget.value = "";
                        }}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        disabled={uploadingPic}
                        asChild
                      >
                        <span>
                          {uploadingPic ? "Uploading..." : "Change Photo"}
                        </span>
                      </Button>
                    </label>

                    {user?.profilePic && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-destructive"
                        onClick={deleteProfilePic}
                        disabled={uploadingPic}
                      >
                        Remove Photo
                      </Button>
                    )}
                  </div>
                )}
              </div>

              {/* Basic Info */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Full Name
                  </label>
                  {isEditing ? (
                    <Input
                      value={safeEdited.name}
                      onChange={(e) =>
                        setEditedProfile({
                          ...safeEdited,
                          name: e.target.value,
                        })
                      }
                    />
                  ) : (
                    <p className="text-foreground flex items-center gap-2 mt-1">
                      <User className="h-4 w-4 text-muted-foreground" />
                      {safeProfile.name || "-"}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Email
                  </label>
                  {isEditing ? (
                    <Input value={safeEdited.email} disabled />
                  ) : (
                    <p className="text-foreground flex items-center gap-2 mt-1">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      {safeProfile.email || "-"}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Phone
                  </label>
                  {isEditing ? (
                    <Input
                      value={safeEdited.phone}
                      onChange={(e) =>
                        setEditedProfile({
                          ...safeEdited,
                          phone: e.target.value,
                        })
                      }
                    />
                  ) : (
                    <p className="text-foreground flex items-center gap-2 mt-1">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      {safeProfile.phone || "-"}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Location
                  </label>
                  {isEditing ? (
                    <Input
                      value={safeEdited.location}
                      onChange={(e) =>
                        setEditedProfile({
                          ...safeEdited,
                          location: e.target.value,
                        })
                      }
                    />
                  ) : (
                    <p className="text-foreground flex items-center gap-2 mt-1">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      {safeProfile.location || "-"}
                    </p>
                  )}
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Date of Birth
                  </label>
                  {isEditing ? (
                    <Input
                      type="date"
                      value={
                        safeEdited.dob ? safeEdited.dob.split("T")[0] : ""
                      }
                      onChange={(e) =>
                        setEditedProfile({
                          ...safeEdited,
                          dob: e.target.value,
                        })
                      }
                    />
                  ) : (
                    <p className="text-foreground flex items-center gap-2 mt-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {formatDate(safeProfile.dob) || "-"}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Bio
              </label>
              {isEditing ? (
                <Textarea
                  value={safeEdited.bio}
                  onChange={(e) =>
                    setEditedProfile({ ...safeEdited, bio: e.target.value })
                  }
                  rows={3}
                  placeholder="Tell us about yourself..."
                />
              ) : (
                <p className="text-foreground mt-1">
                  {safeProfile.bio || "-"}
                </p>
              )}
            </div>

            {/* Skills */}
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                Skills
              </label>
              <div className="flex flex-wrap gap-2">
                {(isEditing ? safeEdited : safeProfile).skills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className={isEditing ? "pr-1" : ""}
                  >
                    {skill}
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </Badge>
                ))}

                {isEditing && (
                  <div className="flex gap-1">
                    <Input
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Add skill"
                      className="w-32 h-6 text-sm"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addSkill();
                        }
                      }}
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={addSkill}
                      className="h-6 w-6 p-0"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                {!isEditing && safeProfile.skills.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No skills added yet.
                  </p>
                )}
              </div>
            </div>

            {/* Certifications */}
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                Certifications
              </label>
              <div className="flex flex-wrap gap-2">
                {(isEditing ? safeEdited : safeProfile).certifications.map(
                  (cert) => (
                    <Badge
                      key={cert}
                      variant="secondary"
                      className={isEditing ? "pr-1" : ""}
                    >
                      {cert}
                      {isEditing && (
                        <button
                          type="button"
                          onClick={() => removeCertification(cert)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </Badge>
                  ),
                )}

                {isEditing && (
                  <div className="flex gap-1">
                    <Input
                      value={newCertification}
                      onChange={(e) => setNewCertification(e.target.value)}
                      placeholder="Add certification"
                      className="w-32 h-6 text-sm"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addCertification();
                        }
                      }}
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={addCertification}
                      className="h-6 w-6 p-0"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                {!isEditing && safeProfile.certifications.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No certifications added yet.
                  </p>
                )}
              </div>
            </div>

            {/* Education & O/L Pass Count */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Schools / Education
                </label>
                {isEditing ? (
                  <Input
                    value={safeEdited.schools}
                    onChange={(e) =>
                      setEditedProfile({
                        ...safeEdited,
                        schools: e.target.value,
                      })
                    }
                    placeholder="Your school or institute"
                  />
                ) : (
                  <p className="text-foreground flex items-center gap-2 mt-1">
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    {safeProfile.schools || "-"}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  O/L Pass Count
                </label>
                {isEditing ? (
                  <Input
                    type="number"
                    value={safeEdited.olPassCount}
                    onChange={(e) =>
                      setEditedProfile({
                        ...safeEdited,
                        olPassCount: e.target.value,
                      })
                    }
                    placeholder="Number of O/L passes"
                    min="0"
                    max="15"
                  />
                ) : (
                  <p className="text-foreground flex items-center gap-2 mt-1">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    {safeProfile.olPassCount || "-"}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
