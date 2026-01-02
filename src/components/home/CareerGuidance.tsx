import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Clock, User } from "lucide-react";

const posts = [
  {
    id: "1",
    title: "10 Tips for Acing Your Next Technical Interview",
    excerpt: "Prepare effectively for technical interviews with these proven strategies from hiring managers at top tech companies.",
    category: "Interview Tips",
    author: "Sarah Johnson",
    date: "Dec 28, 2025",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=250&fit=crop",
  },
  {
    id: "2",
    title: "How to Write a Resume That Gets Noticed",
    excerpt: "Learn the key elements that make your resume stand out in a competitive job market and get past ATS systems.",
    category: "CV Writing",
    author: "Michael Chen",
    date: "Dec 25, 2025",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=250&fit=crop",
  },
  {
    id: "3",
    title: "Remote Work: Building a Successful Career from Anywhere",
    excerpt: "Discover how to thrive in remote positions and build meaningful professional relationships in a virtual environment.",
    category: "Career Tips",
    author: "Emily Davis",
    date: "Dec 22, 2025",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=250&fit=crop",
  },
];

export function CareerGuidance() {
  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
              Career <span className="text-gradient">Guidance</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Expert insights to help you advance your career
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link to="/guidance">
              View All Articles
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>

        {/* Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article
              key={post.id}
              className="group bg-card rounded-2xl border border-border/50 overflow-hidden shadow-card card-hover"
            >
              {/* Image */}
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <Badge
                  variant="primary"
                  className="absolute top-4 left-4"
                >
                  {post.category}
                </Badge>
              </div>

              {/* Content */}
              <div className="p-6">
                <Link to={`/guidance/${post.id}`}>
                  <h3 className="text-lg font-semibold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                </Link>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                {/* Meta */}
                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
