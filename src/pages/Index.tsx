import { MainLayout } from "@/components/layout/MainLayout";
import { HeroSection } from "@/components/home/HeroSection";
import { HowItWorks } from "@/components/home/HowItWorks";
import { FeaturedJobs } from "@/components/home/FeaturedJobs";
import { TopCompanies } from "@/components/home/TopCompanies";
import { CareerGuidance } from "@/components/home/CareerGuidance";
import { CTASection } from "@/components/home/CTASection";

const Index = () => {
  return (
    <MainLayout>
      <HeroSection />
      <TopCompanies />
      <HowItWorks />
      <FeaturedJobs />
      <CareerGuidance />
      <CTASection />
    </MainLayout>
  );
};

export default Index;
