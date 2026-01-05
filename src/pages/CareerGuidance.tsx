import { useState } from "react";
import { Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Clock,
  User,
  BookOpen,
  TrendingUp,
  FileText,
  MessageSquare,
  Award,
  ArrowRight,
} from "lucide-react";

const categories = [
  { id: "all", name: "All Posts", icon: BookOpen },
  { id: "career-tips", name: "Career Tips", icon: TrendingUp },
  { id: "interview-tips", name: "Interview Tips", icon: MessageSquare },
  { id: "cv-writing", name: "CV Writing", icon: FileText },
  { id: "announcements", name: "Announcements", icon: Award },
];

const posts = [
  {
    id: 1,
    title: "10 Essential Skills Every Developer Needs in 2024",
    excerpt: "Stay ahead of the curve with these must-have technical and soft skills that employers are looking for in modern developers.",
    category: "career-tips",
    author: "Sarah Johnson",
    date: "Dec 28, 2024",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=400&fit=crop",
    featured: true,
  },
  {
    id: 2,
    title: "How to Ace Your Technical Interview",
    excerpt: "Comprehensive guide to preparing for technical interviews, including common questions and problem-solving strategies.",
    category: "interview-tips",
    author: "Michael Chen",
    date: "Dec 25, 2024",
    readTime: "12 min read",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&h=400&fit=crop",
    featured: true,
  },
  {
    id: 3,
    title: "Crafting the Perfect Resume for Tech Jobs",
    excerpt: "Learn how to structure your resume, highlight achievements, and stand out from other applicants in the tech industry.",
    category: "cv-writing",
    author: "Emily Davis",
    date: "Dec 22, 2024",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=600&h=400&fit=crop",
    featured: false,
  },
  {
    id: 4,
    title: "New Partnership with Leading Tech Companies",
    excerpt: "We're excited to announce new partnerships that will bring more opportunities to our platform.",
    category: "announcements",
    author: "CareerHub Team",
    date: "Dec 20, 2024",
    readTime: "3 min read",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop",
    featured: false,
  },
  {
    id: 5,
    title: "Remote Work: Building a Successful Career from Home",
    excerpt: "Tips and strategies for thriving in remote work environments, from productivity hacks to work-life balance.",
    category: "career-tips",
    author: "Alex Thompson",
    date: "Dec 18, 2024",
    readTime: "10 min read",
    image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&h=400&fit=crop",
    featured: false,
  },
  {
    id: 6,
    title: "Common Interview Mistakes and How to Avoid Them",
    excerpt: "Don't let these common pitfalls derail your interview. Learn what hiring managers really look for.",
    category: "interview-tips",
    author: "Rachel Kim",
    date: "Dec 15, 2024",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1565688534245-05d6b5be184a?w=600&h=400&fit=crop",
    featured: false,
  },
];

const getCategoryColor = (category: string) => {
  switch (category) {
    case "career-tips":
      return "bg-primary/10 text-primary";
    case "interview-tips":
      return "bg-secondary/20 text-secondary-foreground";
    case "cv-writing":
      return "bg-accent/20 text-accent-foreground";
    case "announcements":
      return "bg-warning/20 text-warning";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const getCategoryName = (category: string) => {
  return categories.find(c => c.id === category)?.name || category;
};

export default function CareerGuidance() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPosts = posts.filter(p => p.featured);

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-accent via-accent/90 to-warning/80 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center text-accent-foreground mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Career Guidance & Tips
            </h1>
            <p className="text-lg text-accent-foreground/80 max-w-2xl mx-auto">
              Expert advice to help you navigate your career journey
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search articles..."
                className="pl-12 h-14 bg-background rounded-xl text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-6 border-b border-border sticky top-16 bg-background z-40">
        <div className="container mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="flex items-center gap-2 whitespace-nowrap"
              >
                <category.icon className="h-4 w-4" />
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      {selectedCategory === "all" && (
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6">Featured Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredPosts.map((post) => (
                <Link
                  key={post.id}
                  to={`/guidance/${post.id}`}
                  className="group relative bg-card rounded-2xl overflow-hidden border border-border card-hover"
                >
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <Badge className={getCategoryColor(post.category) + " mb-3"}>
                      {getCategoryName(post.category)}
                    </Badge>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-white/80">
                      <span className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {post.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {post.readTime}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Posts */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">
              {selectedCategory === "all" ? "Latest Articles" : getCategoryName(selectedCategory)}
            </h2>
            <p className="text-muted-foreground">
              {filteredPosts.length} articles
            </p>
          </div>

          {/* Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <Link
                key={post.id}
                to={`/guidance/${post.id}`}
                className="group bg-card rounded-xl overflow-hidden border border-border card-hover"
              >
                <div className="aspect-video overflow-hidden relative">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <Badge className={getCategoryColor(post.category) + " absolute top-3 left-3"}>
                    {getCategoryName(post.category)}
                  </Badge>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {post.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {post.readTime}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-16">
              <BookOpen className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No articles found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-primary-foreground mb-4">
            Get Career Tips in Your Inbox
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
            Subscribe to our newsletter for weekly career advice, job market insights, and exclusive tips.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              className="h-12 bg-background"
            />
            <Button variant="hero" size="lg" className="h-12">
              Subscribe
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
