import { useState } from "react";
import { Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  MapPin,
  GraduationCap,
  BookOpen,
  Clock,
  CheckCircle,
  Building,
  Users,
  Globe,
  Award,
} from "lucide-react";

const institutions = [
  {
    id: 1,
    name: "Tech Academy Pro",
    logo: "TA",
    type: "Coding Bootcamp",
    location: "San Francisco, CA",
    courses: 45,
    students: "10,000+",
    rating: 4.8,
    verified: true,
    description: "Premier coding bootcamp offering intensive programs in web development, data science, and cybersecurity.",
    featured: true,
  },
  {
    id: 2,
    name: "Digital Skills Institute",
    logo: "DS",
    type: "Online Learning",
    location: "Online",
    courses: 120,
    students: "50,000+",
    rating: 4.6,
    verified: true,
    description: "Comprehensive online learning platform with courses in digital marketing, design, and business.",
    featured: true,
  },
  {
    id: 3,
    name: "Business Excellence Center",
    logo: "BE",
    type: "Professional Training",
    location: "New York, NY",
    courses: 35,
    students: "5,000+",
    rating: 4.5,
    verified: true,
    description: "Executive education and professional development programs for business leaders.",
    featured: false,
  },
  {
    id: 4,
    name: "Creative Arts Academy",
    logo: "CA",
    type: "Design School",
    location: "Los Angeles, CA",
    courses: 28,
    students: "3,000+",
    rating: 4.7,
    verified: true,
    description: "World-class design education covering UI/UX, graphic design, and motion graphics.",
    featured: false,
  },
  {
    id: 5,
    name: "Data Science Hub",
    logo: "DH",
    type: "Specialized Training",
    location: "Boston, MA",
    courses: 22,
    students: "8,000+",
    rating: 4.9,
    verified: true,
    description: "Focused training in data science, machine learning, and artificial intelligence.",
    featured: true,
  },
  {
    id: 6,
    name: "Language Connect",
    logo: "LC",
    type: "Language School",
    location: "Online",
    courses: 50,
    students: "25,000+",
    rating: 4.4,
    verified: false,
    description: "Learn new languages with native speakers and AI-powered learning tools.",
    featured: false,
  },
];

const institutionTypes = [
  "All Types",
  "Coding Bootcamp",
  "Online Learning",
  "Professional Training",
  "Design School",
  "Specialized Training",
  "Language School",
  "University",
];

const locations = [
  "All Locations",
  "Online",
  "San Francisco, CA",
  "New York, NY",
  "Los Angeles, CA",
  "Boston, MA",
  "Chicago, IL",
];

export default function Institutions() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All Types");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");

  const filteredInstitutions = institutions.filter((institution) => {
    const matchesSearch = institution.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      institution.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "All Types" || institution.type === selectedType;
    const matchesLocation = selectedLocation === "All Locations" || institution.location === selectedLocation;
    return matchesSearch && matchesType && matchesLocation;
  });

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-secondary via-secondary/90 to-secondary/80 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center text-secondary-foreground mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Discover Learning Institutions
            </h1>
            <p className="text-lg text-secondary-foreground/80 max-w-2xl mx-auto">
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
                    placeholder="Search institutions or courses..."
                    className="pl-10 h-12 bg-background"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-full md:w-48 h-12 bg-background">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {institutionTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger className="w-full md:w-48 h-12 bg-background">
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Institutions */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Featured Institutions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {institutions.filter(i => i.featured).map((institution) => (
              <Link
                key={institution.id}
                to={`/institutions/${institution.id}`}
                className="group bg-card rounded-xl border-2 border-primary/20 p-6 card-hover relative overflow-hidden"
              >
                <div className="absolute top-0 right-0">
                  <Badge variant="featured" className="rounded-none rounded-bl-lg">
                    <Award className="h-3 w-3 mr-1" />
                    Featured
                  </Badge>
                </div>
                
                <div className="flex items-start gap-4 mb-4 mt-2">
                  <div className="w-14 h-14 rounded-xl bg-secondary/20 flex items-center justify-center text-secondary font-bold text-lg">
                    {institution.logo}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                        {institution.name}
                      </h3>
                      {institution.verified && (
                        <CheckCircle className="h-4 w-4 text-success fill-success/20" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{institution.type}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    {institution.courses} Courses
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {institution.students}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* All Institutions */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <p className="text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{filteredInstitutions.length}</span> institutions
            </p>
          </div>

          {/* Institutions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInstitutions.map((institution) => (
              <Link
                key={institution.id}
                to={`/institutions/${institution.id}`}
                className="group bg-card rounded-xl border border-border p-6 card-hover"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                    {institution.logo}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                        {institution.name}
                      </h3>
                      {institution.verified && (
                        <CheckCircle className="h-4 w-4 text-success fill-success/20" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{institution.type}</p>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {institution.description}
                </p>

                <div className="flex flex-wrap gap-3 mb-4">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {institution.location}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <BookOpen className="h-4 w-4" />
                    {institution.courses} Courses
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    {institution.students} Students
                  </div>
                  <Badge variant="secondary">
                    ⭐ {institution.rating}
                  </Badge>
                </div>
              </Link>
            ))}
          </div>

          {filteredInstitutions.length === 0 && (
            <div className="text-center py-16">
              <GraduationCap className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No institutions found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
}
