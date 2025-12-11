import { Switch, Route, useLocation, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import { useAppStore } from "@/stores/appStore";
import { ReactNode, useEffect } from "react";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/Landing";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminUsers from "@/pages/AdminUsers";
import AdminAlerts from "@/pages/AdminAlerts";
import AdminAnalysis from "@/pages/AdminAnalysis";
import AdminModel from "@/pages/AdminModel";
import AdminSimulator from "@/pages/AdminSimulator";
import AdminSettings from "@/pages/AdminSettings";
import PublicLogin from "@/pages/PublicLogin";
import PublicOnboarding from "@/pages/PublicOnboarding";
import PublicHome from "@/pages/PublicHome";
import PublicPay from "@/pages/PublicPay";
import PublicProfile from "@/pages/PublicProfile";

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
  redirectTo: string;
}

function ProtectedRoute({ children, requireAdmin = false, redirectTo }: ProtectedRouteProps) {
  const { isAuthenticated, isAdmin } = useAppStore();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation(redirectTo);
    } else if (requireAdmin && !isAdmin) {
      setLocation(redirectTo);
    } else if (!requireAdmin && isAdmin) {
      setLocation("/admin");
    }
  }, [isAuthenticated, isAdmin, requireAdmin, redirectTo, setLocation]);

  if (!isAuthenticated) {
    return null;
  }

  if (requireAdmin && !isAdmin) {
    return null;
  }

  if (!requireAdmin && isAdmin) {
    return null;
  }

  return <>{children}</>;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin">
        {() => (
          <ProtectedRoute requireAdmin redirectTo="/admin/login">
            <AdminDashboard />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/admin/users">
        {() => (
          <ProtectedRoute requireAdmin redirectTo="/admin/login">
            <AdminUsers />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/admin/alerts">
        {() => (
          <ProtectedRoute requireAdmin redirectTo="/admin/login">
            <AdminAlerts />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/admin/analysis">
        {() => (
          <ProtectedRoute requireAdmin redirectTo="/admin/login">
            <AdminAnalysis />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/admin/model">
        {() => (
          <ProtectedRoute requireAdmin redirectTo="/admin/login">
            <AdminModel />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/admin/simulator">
        {() => (
          <ProtectedRoute requireAdmin redirectTo="/admin/login">
            <AdminSimulator />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/admin/settings">
        {() => (
          <ProtectedRoute requireAdmin redirectTo="/admin/login">
            <AdminSettings />
          </ProtectedRoute>
        )}
      </Route>
      
      <Route path="/public/login" component={PublicLogin} />
      <Route path="/public/onboarding">
        {() => (
          <ProtectedRoute redirectTo="/public/login">
            <PublicOnboarding />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/public/home">
        {() => (
          <ProtectedRoute redirectTo="/public/login">
            <PublicHome />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/public/pay">
        {() => (
          <ProtectedRoute redirectTo="/public/login">
            <PublicPay />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/public/profile">
        {() => (
          <ProtectedRoute redirectTo="/public/login">
            <PublicProfile />
          </ProtectedRoute>
        )}
      </Route>
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
