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

// ✅ Import separated user pages
import UserDashboard from "./pages/user/UserDashboard";
import UserProfile from "./pages/user/UserProfile";
import UserApplications from "./pages/user/MyApplications";
import SavedJobs from "./pages/user/SavedJobs";
import FollowedCompanies from "./pages/user/FollowedCompanies";

// ✅ Import separated company pages
import CompanyDashboard from "./pages/company/CompanyDashboard";
import CompanyJobs from "./pages/company/CompanyJobs";
import CompanyApplications from "./pages/company/CompanyApplications";
import CompanyInterviews from "./pages/company/CompanyInterviews";
import CompanyProfile from "./pages/company/CompanyProfile";
import ViewJob from "./pages/company/ViewJob";
import EditJob from "./pages/company/EditJob";

// ✅ Import admin pages
import AdminOverview from "./pages/admin/AdminOverview";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminCompanies from "./pages/admin/AdminCompanies";
import AdminJobs from "./pages/admin/AdminJobs";
import AdminInstitutions from "./pages/admin/AdminInstitutions";
import AdminSettings from "./pages/admin/AdminSettings";

import { ProtectedRoute } from "./components/auth/ProtectedRoute";

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

          {/* Legacy route - keeping for backward compatibility */}
          <Route path="/my-applications" element={<MyApplications />} />

          {/* ✅ Protected User Routes */}
          <Route
            path="/user/dashboard"
            element={
              <ProtectedRoute allow="USER">
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/profile"
            element={
              <ProtectedRoute allow="USER">
                <UserProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/applications"
            element={
              <ProtectedRoute allow="USER">
                <UserApplications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/saved-jobs"
            element={
              <ProtectedRoute allow="USER">
                <SavedJobs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/followed-companies"
            element={
              <ProtectedRoute allow="USER">
                <FollowedCompanies />
              </ProtectedRoute>
            }
          />

          {/* ✅ Protected Company Routes */}
          <Route
            path="/company/dashboard"
            element={
              <ProtectedRoute allow="COMPANY">
                <CompanyDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/company/jobs"
            element={
              <ProtectedRoute allow="COMPANY">
                <CompanyJobs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/company/applications"
            element={
              <ProtectedRoute allow="COMPANY">
                <CompanyApplications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/company/interviews"
            element={
              <ProtectedRoute allow="COMPANY">
                <CompanyInterviews />
              </ProtectedRoute>
            }
          />
          <Route
            path="/company/profile"
            element={
              <ProtectedRoute allow="COMPANY">
                <CompanyProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/company/jobs/:id"
            element={
              <ProtectedRoute allow="COMPANY">
                <ViewJob />
              </ProtectedRoute>
            }
          />
          <Route
            path="/company/jobs/:id/edit"
            element={
              <ProtectedRoute allow="COMPANY">
                <EditJob />
              </ProtectedRoute>
            }
          />

          {/* ✅ Protected Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allow="ADMIN">
                <AdminOverview />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allow="ADMIN">
                <AdminUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/companies"
            element={
              <ProtectedRoute allow="ADMIN">
                <AdminCompanies />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/jobs"
            element={
              <ProtectedRoute allow="ADMIN">
                <AdminJobs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/institutions"
            element={
              <ProtectedRoute allow="ADMIN">
                <AdminInstitutions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute allow="ADMIN">
                <AdminSettings />
              </ProtectedRoute>
            }
          />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
