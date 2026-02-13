import { Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Building2,
  MapPin,
  Users,
  Briefcase,
  ExternalLink,
  UserMinus,
} from "lucide-react";

// =============================
// Types (placeholder for future implementation)
// =============================
type FollowedCompany = {
  id: string;
  companyName: string;
  location: string;
  industry: string;
  employeeCount?: string;
  openPositions: number;
  followedAt: string;
  profilePic?: string;
};

// =============================
// Main Component
// =============================
export default function FollowedCompanies() {
  // TODO: Replace with actual API call when backend is ready
  const followedCompanies: FollowedCompany[] = [];
  const isLoading = false;

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Followed Companies
          </h1>
          <p className="text-muted-foreground mt-1">
            Stay updated with companies you're interested in
          </p>
        </div>

        {/* Followed Companies Count */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-info/10 flex items-center justify-center">
                <Building2 className="h-6 w-6 text-info" />
              </div>
              <div>
                <p className="text-2xl font-bold">{followedCompanies.length}</p>
                <p className="text-sm text-muted-foreground">
                  Followed Companies
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Companies List */}
        <Card>
          <CardHeader>
            <CardTitle>Your Followed Companies</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-12 text-muted-foreground">
                <p>Loading...</p>
              </div>
            ) : followedCompanies.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Building2 className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="mb-2">Not following any companies yet.</p>
                <p className="text-sm mb-4">
                  Follow companies to stay updated on their job openings and
                  news
                </p>
                <Link to="/companies">
                  <Button variant="outline">
                    <Building2 className="h-4 w-4 mr-2" />
                    Browse Companies
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {followedCompanies.map((company) => (
                  <Card
                    key={company.id}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary flex-shrink-0">
                          {company.profilePic ? (
                            <img
                              src={company.profilePic}
                              alt={company.companyName}
                              className="h-full w-full object-cover rounded-lg"
                            />
                          ) : (
                            company.companyName.charAt(0).toUpperCase()
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground text-lg mb-2">
                            {company.companyName}
                          </h3>

                          <div className="space-y-1 text-sm text-muted-foreground">
                            <p className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {company.location}
                            </p>
                            <p className="flex items-center gap-1">
                              <Building2 className="h-3 w-3" />
                              {company.industry}
                            </p>
                            {company.employeeCount && (
                              <p className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {company.employeeCount} employees
                              </p>
                            )}
                            <p className="flex items-center gap-1">
                              <Briefcase className="h-3 w-3" />
                              {company.openPositions} open positions
                            </p>
                          </div>

                          <p className="text-xs text-muted-foreground mt-2">
                            Following since{" "}
                            {new Date(company.followedAt).toLocaleDateString()}
                          </p>

                          <div className="flex gap-2 mt-4">
                            <Link to={`/companies/${company.id}`}>
                              <Button variant="default" size="sm">
                                <ExternalLink className="h-4 w-4 mr-1" />
                                View Company
                              </Button>
                            </Link>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                            >
                              <UserMinus className="h-4 w-4 mr-1" />
                              Unfollow
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
