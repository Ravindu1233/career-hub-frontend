import { Link } from "react-router-dom";
import { Briefcase, Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin } from "lucide-react";

const footerLinks = {
  forJobSeekers: [
    { name: "Browse Jobs", href: "/jobs" },
    { name: "Career Guidance", href: "/guidance" },
    { name: "Institutions", href: "/institutions" },
    { name: "How It Works", href: "/#how-it-works" },
    { name: "Success Stories", href: "/success-stories" },
  ],
  forEmployers: [
    { name: "Post a Job", href: "/post-job" },
    { name: "Pricing", href: "/pricing" },
    { name: "Employer Resources", href: "/resources" },
    { name: "Candidate Search", href: "/search" },
    { name: "Recruitment Solutions", href: "/solutions" },
  ],
  support: [
    { name: "Contact Us", href: "/contact" },
    { name: "FAQ", href: "/faq" },
    { name: "Help Center", href: "/help" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Privacy Policy", href: "/privacy" },
  ],
};

const socialLinks = [
  { name: "Facebook", icon: Facebook, href: "#" },
  { name: "Twitter", icon: Twitter, href: "#" },
  { name: "LinkedIn", icon: Linkedin, href: "#" },
  { name: "Instagram", icon: Instagram, href: "#" },
];

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      {/* Main footer content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                <Briefcase className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-background">
                Career<span className="text-primary">Hub</span>
              </span>
            </Link>
            <p className="text-background/70 mb-6 max-w-sm">
              Connecting talented professionals with top companies worldwide. Your career journey starts here.
            </p>
            <div className="space-y-3 text-sm text-background/70">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-primary" />
                <span>support@careerhub.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-primary" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-primary" />
                <span>San Francisco, CA</span>
              </div>
            </div>
          </div>

          {/* Links columns */}
          <div>
            <h3 className="font-semibold text-background mb-4">For Job Seekers</h3>
            <ul className="space-y-3">
              {footerLinks.forJobSeekers.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-background/70 hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-background mb-4">For Employers</h3>
            <ul className="space-y-3">
              {footerLinks.forEmployers.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-background/70 hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-background mb-4">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-background/70 hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-background/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-background/60">
              © {new Date().getFullYear()} CareerHub. All rights reserved.
            </p>

            {/* Social links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="h-10 w-10 rounded-full bg-background/10 flex items-center justify-center text-background/70 hover:bg-primary hover:text-white transition-all duration-200"
                  aria-label={link.name}
                >
                  <link.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
