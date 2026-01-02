import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Search, Building2 } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-20 lg:py-28 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* For Job Seekers */}
          <div className="relative rounded-3xl overflow-hidden gradient-primary p-8 lg:p-12">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative z-10">
              <div className="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-6">
                <Search className="h-8 w-8 text-white" />
              </div>
              
              <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4">
                Looking for Your Next Opportunity?
              </h3>
              <p className="text-white/80 text-lg mb-8 max-w-md">
                Join thousands of job seekers who found their dream careers through our platform. Your next adventure awaits.
              </p>
              
              <Button variant="hero" size="lg" asChild>
                <Link to="/jobs">
                  Find Jobs
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>
            </div>
          </div>

          {/* For Employers */}
          <div className="relative rounded-3xl overflow-hidden gradient-accent p-8 lg:p-12">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative z-10">
              <div className="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-6">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              
              <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4">
                Need to Hire Top Talent?
              </h3>
              <p className="text-white/80 text-lg mb-8 max-w-md">
                Post jobs and connect with qualified candidates. Build your dream team with our recruitment solutions.
              </p>
              
              <Button variant="hero" size="lg" asChild>
                <Link to="/register?role=employer">
                  Post a Job
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
