import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Video, Users, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

type Interview = {
  id: string;
  applicationId: string;
  interviewDate: string;
  interviewType: string;
  notes: string | null;
  status: string;
  meetingLink: string | null;
  createdAt: string;
  updatedAt: string;
  application: {
    id: string;
    user: {
      userId: number;
      firstName: string;
      lastName: string;
      email: string;
      profilePic: string | null;
      mobile: string | null;
    };
    job: {
      id: string;
      jobTitle: string;
    };
  };
};

const getStatusBadge = (status: string) => {
  const statusConfig: Record<
    string,
    {
      label: string;
      variant: "default" | "secondary" | "destructive" | "outline";
    }
  > = {
    SCHEDULED: { label: "Scheduled", variant: "default" },
    COMPLETED: { label: "Completed", variant: "secondary" },
    CANCELLED: { label: "Cancelled", variant: "destructive" },
  };

  const config = statusConfig[status] ?? {
    label: status,
    variant: "secondary",
  };

  return <Badge variant={config.variant}>{config.label}</Badge>;
};

const getInterviewTypeLabel = (type: string) => {
  const typeConfig: Record<string, string> = {
    video: "Video Call",
    phone: "Phone Call",
    "in-person": "In-person",
  };
  return typeConfig[type] || type;
};

export default function CompanyInterviews() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadInterviews();
  }, []);

  const loadInterviews = async () => {
    setLoading(true);
    try {
      const res = await api.get("/interviews/company/all");
      setInterviews(res.data);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to load interviews");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinInterview = (interview: Interview) => {
    if (interview.meetingLink) {
      window.open(interview.meetingLink, "_blank");
    } else {
      toast.info("No meeting link available for this interview");
    }
  };

  const handleCancelInterview = async (interviewId: string) => {
    try {
      await api.patch(`/interviews/${interviewId}/cancel`);
      toast.success("Interview cancelled successfully");
      loadInterviews();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to cancel interview");
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch {
      return dateString;
    }
  };

  const formatTime = (dateString: string) => {
    try {
      return format(new Date(dateString), "hh:mm a");
    } catch {
      return "";
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Scheduled Interviews
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage and track all your candidate interviews
          </p>
        </div>

        {/* Interviews List */}
        <Card>
          <CardHeader>
            <CardTitle>All Interviews ({interviews.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="space-y-4">
                {interviews.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No interviews scheduled yet.
                  </p>
                ) : (
                  interviews.map((interview) => {
                    const candidateName = `${interview.application.user.firstName} ${interview.application.user.lastName}`;
                    const jobTitle = interview.application.job.jobTitle;
                    const interviewTypeLabel = getInterviewTypeLabel(
                      interview.interviewType,
                    );

                    return (
                      <div
                        key={interview.id}
                        className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors gap-4"
                      >
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                            {interview.interviewType === "video" ? (
                              <Video className="h-6 w-6 text-primary" />
                            ) : (
                              <Users className="h-6 w-6 text-primary" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground">
                              {candidateName}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {jobTitle}
                            </p>
                            {interview.notes && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {interview.notes}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col md:items-end gap-2">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              {formatDate(interview.interviewDate)}
                            </span>
                            <Clock className="h-4 w-4 text-muted-foreground ml-2" />
                            <span className="text-sm">
                              {formatTime(interview.interviewDate)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(interview.status)}
                            <Badge variant="outline">
                              {interviewTypeLabel}
                            </Badge>
                          </div>
                          {interview.status === "SCHEDULED" && (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  handleCancelInterview(interview.id)
                                }
                              >
                                Cancel
                              </Button>
                              {interview.interviewType === "video" &&
                                interview.meetingLink && (
                                  <Button
                                    size="sm"
                                    onClick={() =>
                                      handleJoinInterview(interview)
                                    }
                                  >
                                    <Video className="h-4 w-4 mr-1" />
                                    Join
                                  </Button>
                                )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
