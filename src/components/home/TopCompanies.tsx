import { CheckCircle } from "lucide-react";

const companies = [
  { name: "Google", verified: true },
  { name: "Microsoft", verified: true },
  { name: "Apple", verified: true },
  { name: "Amazon", verified: true },
  { name: "Meta", verified: true },
  { name: "Netflix", verified: true },
];

export function TopCompanies() {
  return (
    <section className="py-16 bg-background border-y border-border/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
            Trusted by Leading Companies
          </h2>
          <p className="text-muted-foreground">
            Join thousands of top employers already hiring on our platform
          </p>
        </div>

        {/* Company logos grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {companies.map((company) => (
            <div
              key={company.name}
              className="group relative flex flex-col items-center justify-center p-6 rounded-2xl border border-border/50 bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              {/* Placeholder for company logo */}
              <div className="h-12 w-32 bg-muted rounded-lg flex items-center justify-center mb-3 grayscale group-hover:grayscale-0 transition-all duration-300">
                <span className="text-lg font-bold text-muted-foreground group-hover:text-foreground transition-colors">
                  {company.name}
                </span>
              </div>
              
              {company.verified && (
                <div className="flex items-center gap-1 text-xs text-success">
                  <CheckCircle className="h-3.5 w-3.5" />
                  <span>Verified</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="flex flex-wrap items-center justify-center gap-8 mt-12 pt-12 border-t border-border/50">
          {[
            { value: "500+", label: "Enterprise Partners" },
            { value: "10K+", label: "Active Job Postings" },
            { value: "98%", label: "Client Satisfaction" },
          ].map((stat) => (
            <div key={stat.label} className="text-center px-8">
              <div className="text-3xl font-bold text-primary mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
