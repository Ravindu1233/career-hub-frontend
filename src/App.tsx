import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import ApplyJob from "./pages/ApplyJob";
import Companies from "./pages/Companies";
import CompanyDetails from "./pages/CompanyDetails";
import Institutions from "./pages/Institutions";
import InstitutionDetails from "./pages/InstitutionDetails";
import CareerGuidance from "./pages/CareerGuidance";
import MyApplications from "./pages/MyApplications";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import CompanyApplications from "./pages/CompanyApplications";
import UserDashboard from "./pages/UserDashboard";
import CompanyDashboard from "./pages/CompanyDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          <Route path="/jobs/:id/apply" element={<ApplyJob />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/companies/:id" element={<CompanyDetails />} />
          <Route path="/institutions" element={<Institutions />} />
          <Route path="/institutions/:id" element={<InstitutionDetails />} />
          <Route path="/guidance" element={<CareerGuidance />} />
          <Route path="/my-applications" element={<MyApplications />} />
          <Route
            path="/company/applications"
            element={<CompanyApplications />}
          />
          <Route path="/user/dashboard" element={<UserDashboard />} />
          <Route path="/company/dashboard" element={<CompanyDashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
