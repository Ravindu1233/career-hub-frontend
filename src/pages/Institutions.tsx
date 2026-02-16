import { useState } from "react";
import { Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, GraduationCap, BookOpen, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

// =============================
// API Endpoints
// =============================
const API_ALL_INSTITUTIONS = "/institutions";

// =============================
// Types
// =============================
interface Institution {
  id: string;
  name: string;
  logo?: string | null;
  location?: string | null;
  email: string;
  phone?: string | null;
  website?: string | null;
  description?: string | null;
  founded?: string | null;
  students?: string | null;
  createdAt: string;
  courses?: any[];
}

export default function Institutions() {
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch all institutions
  const {
    data: institutions = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["all-institutions"],
    queryFn: async () => {
      const res = await api.get(API_ALL_INSTITUTIONS);
      return (res.data ?? []) as Institution[];
    },
  });

  // Filter institutions based on search
  const filteredInstitutions = institutions.filter((institution) => {
    const matchesSearch =
      institution.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      institution.description
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      institution.location?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary via-primary/90 to-accent/80 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center text-primary-foreground mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Discover Learning Institutions
            </h1>
            <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
              Find the best courses and training programs to advance your career
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-background/20 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-background/30">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Search institutions, courses, or location..."
                    className="pl-10 h-12 bg-background"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* All Institutions */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">All Institutions</h2>
            <p className="text-muted-foreground">
              Showing{" "}
              <span className="font-semibold text-foreground">
                {filteredInstitutions.length}
              </span>{" "}
              {filteredInstitutions.length === 1
                ? "institution"
                : "institutions"}
            </p>
          </div>

          {isLoading ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground">Loading institutions...</p>
            </div>
          ) : isError ? (
            <div className="text-center py-16">
              <GraduationCap className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Failed to load institutions
              </h3>
              <p className="text-muted-foreground">Please try again later</p>
            </div>
          ) : filteredInstitutions.length === 0 ? (
            <div className="text-center py-16">
              <GraduationCap className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                No institutions found
              </h3>
              <p className="text-muted-foreground">
                {searchQuery
                  ? "Try adjusting your search"
                  : "No institutions available at the moment"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredInstitutions.map((institution) => {
                const coursesCount = institution.courses?.length || 0;
                return (
                  <Link
                    key={institution.id}
                    to={`/institutions/${institution.id}`}
                    className="group bg-card rounded-xl border border-border p-6 card-hover"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                        {institution.logo ||
                          institution.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                          {institution.name}
                        </h3>
                        {institution.location && (
                          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                            <MapPin className="h-3 w-3" />
                            {institution.location}
                          </p>
                        )}
                      </div>
                    </div>

                    {institution.description && (
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {institution.description}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-3 mb-4">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <BookOpen className="h-4 w-4" />
                        {coursesCount}{" "}
                        {coursesCount === 1 ? "Course" : "Courses"}
                      </div>
                      {institution.students && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Users className="h-4 w-4" />
                          {institution.students}
                        </div>
                      )}
                    </div>

                    {institution.founded && (
                      <div className="pt-4 border-t border-border">
                        <p className="text-xs text-muted-foreground">
                          Founded in {institution.founded}
                        </p>
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
}
