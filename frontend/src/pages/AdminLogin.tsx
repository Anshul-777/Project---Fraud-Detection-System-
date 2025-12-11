import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppStore } from '@/stores/appStore';
import { Shield, Lock, AlertCircle } from 'lucide-react';
import { ThemeToggle } from '@/components/common/ThemeToggle';

const ADMIN_ID = '123';
const ADMIN_PASSWORD = 'G!7rX9$Qw#Z8!';
const MAX_ATTEMPTS = 5;

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login, loginAttempts, incrementLoginAttempts, lockAccount, lockedUntil, resetLoginAttempts } = useAppStore();

  const isLocked = lockedUntil && Date.now() < lockedUntil;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLocked) {
      setError('Account is temporarily locked. Please try again later.');
      return;
    }

    if (loginAttempts >= MAX_ATTEMPTS) {
      lockAccount();
      setError('Too many failed attempts. Account locked for 5 minutes.');
      return;
    }

    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 800));

    if (adminId === ADMIN_ID && password === ADMIN_PASSWORD) {
      resetLoginAttempts();
      login(
        {
          id: ADMIN_ID,
          email: 'admin@aegispay.com',
          password: '',
          displayName: 'Admin User',
          role: 'admin',
          kycLevel: 'premium',
          accountAge: 1000,
          balance: 0,
          currency: 'INR',
          devices: [],
          riskScore: 0,
          transactionCount: 0,
          createdAt: new Date().toISOString(),
        },
        'mock-admin-token',
        true
      );
      setLocation('/admin');
    } else {
      incrementLoginAttempts();
      setError(`Invalid credentials. ${MAX_ATTEMPTS - loginAttempts - 1} attempts remaining.`);
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/10" />
      
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <Card>
          <CardHeader className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10"
            >
              <Shield className="h-8 w-8 text-primary" />
            </motion.div>
            <CardTitle className="text-2xl">Admin Access</CardTitle>
            <CardDescription>
              Enter your admin credentials to access the dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="adminId">Admin ID</Label>
                <Input
                  id="adminId"
                  type="text"
                  placeholder="Enter admin ID"
                  value={adminId}
                  onChange={(e) => setAdminId(e.target.value)}
                  disabled={isLocked || isLoading}
                  data-testid="input-admin-id"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLocked || isLoading}
                    data-testid="input-admin-password"
                  />
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm"
                >
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </motion.div>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={!adminId || !password || isLocked || isLoading}
                data-testid="button-admin-login"
              >
                {isLoading ? 'Authenticating...' : 'Access Dashboard'}
              </Button>

              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => setLocation('/')}
                data-testid="button-back-home"
              >
                Back to Home
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-4">
          Demo credentials: ID: 123 | Password: G!7rX9$Qw#Z8!
        </p>
      </motion.div>
    </div>
  );
}
