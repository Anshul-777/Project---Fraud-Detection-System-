import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { OTPModal } from '@/components/common/OTPModal';
import { useAppStore } from '@/stores/appStore';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import mockUsersData from '@/mocks/mock_users.json';
import type { User } from '@/types/api';
import { Shield, Mail, Lock, AlertCircle, ArrowLeft } from 'lucide-react';

export default function PublicLogin() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [pendingUser, setPendingUser] = useState<User | null>(null);

  const { login } = useAppStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 800));

    const user = (mockUsersData.users as User[]).find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      setPendingUser(user);
      setShowOTP(true);
    } else {
      setError('Invalid email or password. Use demo credentials.');
    }

    setIsLoading(false);
  };

  const handleVerifyOTP = (otp: string) => {
    if (otp === mockUsersData.defaultOtp) {
      if (pendingUser) {
        login(pendingUser, 'mock-user-token', false);
        
        if (pendingUser.bankAccount) {
          setLocation('/public/home');
        } else {
          setLocation('/public/onboarding');
        }
      }
      setShowOTP(false);
    } else {
      setOtpError('Invalid OTP. Try: 123456');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/10" />
      
      <div className="absolute top-4 left-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLocation('/')}
          data-testid="button-back"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

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
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>
              Sign in to access your AegisPay account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    data-testid="input-email"
                  />
                  <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    data-testid="input-password"
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
                disabled={!email || !password || isLoading}
                data-testid="button-login"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-4 p-4 rounded-lg bg-muted/50 text-sm">
          <p className="font-medium mb-2">Demo Accounts:</p>
          <div className="space-y-1 text-muted-foreground font-mono text-xs">
            <p>Professional: pro@example.com / ProUser!2025</p>
            <p>Student: student@example.com / Stud!2025</p>
            <p>OTP: 123456</p>
          </div>
        </div>
      </motion.div>

      <OTPModal
        open={showOTP}
        onOpenChange={setShowOTP}
        onVerify={handleVerifyOTP}
        onCancel={() => setShowOTP(false)}
        title="Verify Your Identity"
        description={`We sent a 6-digit code to ${email}`}
        error={otpError}
      />
    </div>
  );
}
