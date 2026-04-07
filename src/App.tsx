import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import { ProjectProvider } from "@/context/ProjectContext";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import ProjectsPage from "./pages/ProjectsPage";
import EscalationsPage from "./pages/EscalationsPage";
import UsersPage from "./pages/UsersPage";
import ReportsPage from "./pages/ReportsPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import DeadlinesPage from "./pages/DeadlinesPage";
import TeamMembersPage from "./pages/TeamMembersPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <ProjectProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              {/* Admin */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/projects" element={<ProjectsPage roleFilter="admin" />} />
              <Route path="/admin/escalations" element={<EscalationsPage roleFilter="admin" />} />
              <Route path="/admin/users" element={<UsersPage />} />
              <Route path="/admin/reports" element={<ReportsPage roleFilter="admin" />} />
              <Route path="/admin/profile" element={<ProfilePage />} />
              <Route path="/admin/settings" element={<SettingsPage />} />
              {/* Manager */}
              <Route path="/manager" element={<ManagerDashboard />} />
              <Route path="/manager/projects" element={<ProjectsPage roleFilter="manager" />} />
              <Route path="/manager/team" element={<TeamMembersPage />} />
              <Route path="/manager/escalations" element={<EscalationsPage roleFilter="manager" />} />
              <Route path="/manager/reports" element={<ReportsPage roleFilter="manager" />} />
              <Route path="/manager/profile" element={<ProfilePage />} />
              <Route path="/manager/settings" element={<SettingsPage />} />
              {/* Employee */}
              <Route path="/employee" element={<EmployeeDashboard />} />
              <Route path="/employee/projects" element={<ProjectsPage roleFilter="employee" />} />
              <Route path="/employee/deadlines" element={<DeadlinesPage />} />
              <Route path="/employee/escalations" element={<EscalationsPage roleFilter="employee" />} />
              <Route path="/employee/profile" element={<ProfilePage />} />
              <Route path="/employee/settings" element={<SettingsPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </ProjectProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
