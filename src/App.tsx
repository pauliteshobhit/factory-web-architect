import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Projects from "./pages/Projects";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProjectClickTest from "@/dev/ProjectClickTest";
import EnvCheck from "@/dev/EnvCheck";
import AuthEvents from "@/dev/AuthEvents";
import SupabaseDebug from "@/dev/SupabaseDebug";
import AnalyticsDashboard from "@/dev/AnalyticsDashboard";
import AdminUpload from "@/pages/AdminUpload";
import RolesTest from "@/dev/RolesTest";
import RolesTestSuite from "@/dev/RolesTestSuite";
import { ProjectDebug } from '@/dev/project-debug/ProjectDebug';
import ProjectDetail from "./pages/ProjectDetail";
import { ProjectInsertTest } from '@/dev/project-insert-test/ProjectInsertTest';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/admin/upload" element={<AdminUpload />} />
          
          {/* Dev Routes */}
          <Route path="/dev/test-clicks" element={<ProjectClickTest />} />
          <Route path="/dev/env-check" element={<EnvCheck />} />
          <Route path="/dev/auth-events" element={<AuthEvents />} />
          <Route path="/dev/supabase-debug" element={<SupabaseDebug />} />
          <Route path="/dev/analytics" element={<AnalyticsDashboard />} />
          <Route path="/dev/roles-test" element={<RolesTest />} />
          <Route path="/dev/roles-test-suite" element={<RolesTestSuite />} />
          <Route path="/dev/project-debug" element={<ProjectDebug />} />
          <Route path="/dev/project-insert-test" element={<ProjectInsertTest />} />
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
