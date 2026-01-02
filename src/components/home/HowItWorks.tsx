import { User, Search, Briefcase, FileText, Users, Calendar } from "lucide-react";

const steps = {
  jobSeekers: [
    {
      icon: User,
      title: "Create Profile",
      description: "Upload your CV and showcase your skills to stand out",
    },
    {
      icon: Search,
      title: "Search & Apply",
      description: "Discover jobs that match your profile and career goals",
    },
    {
      icon: Briefcase,
      title: "Get Hired",
      description: "Attend interviews and land your dream job",
    },
  ],
  employers: [
    {
      icon: FileText,
      title: "Post Jobs",
      description: "Create detailed job listings to attract top talent",
    },
    {
      icon: Users,
      title: "Review Applications",
      description: "Shortlist and evaluate candidates efficiently",
    },
    {
      icon: Calendar,
      title: "Schedule Interviews",
      description: "Connect with talent and build your dream team",
    },
  ],
};

export function HowItWorks() {
  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            How It <span className="text-gradient">Works</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get started in just a few simple steps, whether you're looking for your next opportunity or searching for top talent.
          </p>
        </div>

        {/* Two columns */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* For Job Seekers */}
          <div className="relative">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center">
                <User className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">For Job Seekers</h3>
            </div>

            <div className="relative space-y-0">
              {/* Connecting line */}
              <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-transparent" />

              {steps.jobSeekers.map((step, index) => (
                <div key={step.title} className="relative flex gap-6 pb-8 last:pb-0">
                  {/* Step number circle */}
                  <div className="relative z-10 flex-shrink-0">
                    <div className="h-12 w-12 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center">
                      <span className="text-lg font-bold text-primary">{index + 1}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 pt-1.5">
                    <div className="p-6 rounded-2xl bg-card border border-border/50 shadow-card card-hover">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <step.icon className="h-5 w-5 text-primary" />
                        </div>
                        <h4 className="text-lg font-semibold text-foreground">{step.title}</h4>
                      </div>
                      <p className="text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* For Employers */}
          <div className="relative">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-12 w-12 rounded-xl gradient-accent flex items-center justify-center">
                <Briefcase className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">For Employers</h3>
            </div>

            <div className="relative space-y-0">
              {/* Connecting line */}
              <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-gradient-to-b from-accent via-accent/50 to-transparent" />

              {steps.employers.map((step, index) => (
                <div key={step.title} className="relative flex gap-6 pb-8 last:pb-0">
                  {/* Step number circle */}
                  <div className="relative z-10 flex-shrink-0">
                    <div className="h-12 w-12 rounded-full bg-accent/10 border-2 border-accent flex items-center justify-center">
                      <span className="text-lg font-bold text-accent">{index + 1}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 pt-1.5">
                    <div className="p-6 rounded-2xl bg-card border border-border/50 shadow-card card-hover">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                          <step.icon className="h-5 w-5 text-accent" />
                        </div>
                        <h4 className="text-lg font-semibold text-foreground">{step.title}</h4>
                      </div>
                      <p className="text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
