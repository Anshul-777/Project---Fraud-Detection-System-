import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/stores/appStore';
import {
  Menu,
  X,
  LayoutDashboard,
  Users,
  AlertTriangle,
  BarChart3,
  Brain,
  PlayCircle,
  Settings,
  User,
  Bell,
  LogOut,
  Shield,
  Wifi,
  WifiOff,
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/admin/users', icon: Users, label: 'Users' },
  { path: '/admin/alerts', icon: AlertTriangle, label: 'Alerts' },
  { path: '/admin/analysis', icon: BarChart3, label: 'Analysis' },
  { path: '/admin/model', icon: Brain, label: 'Model Insights' },
  { path: '/admin/simulator', icon: PlayCircle, label: 'Simulator' },
  { path: '/admin/settings', icon: Settings, label: 'Settings' },
];

export function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [location, setLocation] = useLocation();
  const { logout, wsConnected, alerts, user } = useAppStore();

  const unreadAlerts = alerts.filter((a) => !a.resolved).length;

  useEffect(() => {
    setSidebarOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    setLocation('/');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b bg-background/95 backdrop-blur-sm">
        <div className="flex items-center justify-between h-full px-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              data-testid="button-sidebar-toggle"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <Link href="/admin" className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold hidden sm:inline">AegisPay</span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50">
              {wsConnected ? (
                <>
                  <Wifi className="h-4 w-4 text-emerald-500" />
                  <span className="text-xs font-medium text-emerald-500 hidden sm:inline">Connected</span>
                </>
              ) : (
                <>
                  <WifiOff className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs font-medium text-muted-foreground hidden sm:inline">Offline</span>
                </>
              )}
            </div>

            <ThemeToggle />

            <Button variant="ghost" size="icon" className="relative" data-testid="button-notifications">
              <Bell className="h-5 w-5" />
              {unreadAlerts > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                  {unreadAlerts > 9 ? '9+' : unreadAlerts}
                </Badge>
              )}
            </Button>

            <div className="flex items-center gap-2 pl-2 border-l">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary/10 text-primary text-sm">
                  {user?.displayName?.charAt(0) || 'A'}
                </AvatarFallback>
              </Avatar>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                data-testid="button-logout"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 z-50 h-full w-[280px] bg-sidebar border-r"
            >
              <div className="flex items-center justify-between h-16 px-4 border-b">
                <div className="flex items-center gap-2">
                  <Shield className="h-6 w-6 text-primary" />
                  <span className="text-lg font-bold">AegisPay</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSidebarOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <nav className="p-4 space-y-1">
                {navItems.map((item) => {
                  const isActive = location === item.path || 
                    (item.path !== '/admin' && location.startsWith(item.path));
                  return (
                    <Link key={item.path} href={item.path}>
                      <button
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                          isActive
                            ? 'bg-primary text-primary-foreground'
                            : 'text-sidebar-foreground hover-elevate'
                        }`}
                        data-testid={`nav-${item.label.toLowerCase().replace(' ', '-')}`}
                      >
                        <item.icon className="h-5 w-5" />
                        {item.label}
                      </button>
                    </Link>
                  );
                })}
              </nav>

              <div className="absolute bottom-4 left-4 right-4">
                <Link href="/admin/profile">
                  <button
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-sidebar-foreground hover-elevate"
                    data-testid="nav-profile"
                  >
                    <User className="h-5 w-5" />
                    Profile
                  </button>
                </Link>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main className="pt-16 min-h-screen">
        {children}
      </main>
    </div>
  );
}
