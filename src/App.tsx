import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import { TaskProvider } from "@/context/TaskContext";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import TaskManagement from "./pages/TaskManagement";
import TeamManagement from "./pages/TeamManagement";
import UserManagement from "./pages/UserManagement";
import EscalationMonitor from "./pages/EscalationMonitor";
import Analytics from "./pages/Analytics";
import ManagerDashboard from "./pages/ManagerDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <TaskProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/tasks" element={<TaskManagement />} />
              <Route path="/admin/teams" element={<TeamManagement />} />
              <Route path="/admin/users" element={<UserManagement />} />
              <Route path="/admin/escalation" element={<EscalationMonitor />} />
              <Route path="/admin/analytics" element={<Analytics />} />
              <Route path="/manager" element={<ManagerDashboard />} />
              <Route path="/manager/tasks" element={<ManagerDashboard />} />
              <Route path="/manager/escalation" element={<EscalationMonitor />} />
              <Route path="/employee" element={<EmployeeDashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TaskProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
