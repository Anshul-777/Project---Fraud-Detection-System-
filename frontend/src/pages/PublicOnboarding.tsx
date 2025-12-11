import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { OTPModal } from '@/components/common/OTPModal';
import { useAppStore } from '@/stores/appStore';
import mockUsersData from '@/mocks/mock_users.json';
import { Building2, CheckCircle, AlertCircle } from 'lucide-react';

const banks = [
  { id: 'aegis', name: 'Aegis Bank', supported: true },
  { id: 'hdfc', name: 'HDFC Bank', supported: false },
  { id: 'icici', name: 'ICICI Bank', supported: false },
  { id: 'sbi', name: 'State Bank of India', supported: false },
  { id: 'axis', name: 'Axis Bank', supported: false },
];

export default function PublicOnboarding() {
  const [, setLocation] = useLocation();
  const { user, login } = useAppStore();
  const [selectedBank, setSelectedBank] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifsc, setIfsc] = useState('');
  const [holderName, setHolderName] = useState(user?.displayName || '');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [otpError, setOtpError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const bank = banks.find((b) => b.id === selectedBank);
    if (!bank?.supported) {
      setError('Only Aegis Bank is supported for this demo.');
      return;
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    setShowOTP(true);
  };

  const handleVerifyOTP = (otp: string) => {
    if (otp === mockUsersData.defaultOtp) {
      if (user) {
        const updatedUser = {
          ...user,
          bankAccount: {
            bankId: `AEGIS-${accountNumber}`,
            bankName: 'Aegis Bank',
            accountNumber,
            ifsc,
            holderName,
            verified: true,
          },
        };
        login(updatedUser, 'mock-user-token', false);
      }
      setShowOTP(false);
      setLocation('/public/home');
    } else {
      setOtpError('Invalid OTP. Try: 123456');
    }
  };

  if (!user) {
    setLocation('/public/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/10" />

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
              <Building2 className="h-8 w-8 text-primary" />
            </motion.div>
            <CardTitle className="text-2xl">Link Your Bank</CardTitle>
            <CardDescription>
              Add a bank account to start making payments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Select Bank</Label>
                <Select value={selectedBank} onValueChange={setSelectedBank}>
                  <SelectTrigger data-testid="select-bank">
                    <SelectValue placeholder="Choose your bank" />
                  </SelectTrigger>
                  <SelectContent>
                    {banks.map((bank) => (
                      <SelectItem key={bank.id} value={bank.id}>
                        <div className="flex items-center gap-2">
                          <span>{bank.name}</span>
                          {bank.supported && (
                            <CheckCircle className="h-3 w-3 text-emerald-500" />
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedBank && !banks.find((b) => b.id === selectedBank)?.supported && (
                  <p className="text-xs text-amber-500">
                    This bank is not supported in demo mode
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="accountNumber">Account Number</Label>
                <Input
                  id="accountNumber"
                  placeholder="Enter account number"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  disabled={isLoading}
                  data-testid="input-account-number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ifsc">IFSC Code</Label>
                <Input
                  id="ifsc"
                  placeholder="e.g., AEGS0001234"
                  value={ifsc}
                  onChange={(e) => setIfsc(e.target.value.toUpperCase())}
                  disabled={isLoading}
                  data-testid="input-ifsc"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="holderName">Account Holder Name</Label>
                <Input
                  id="holderName"
                  placeholder="Name as per bank records"
                  value={holderName}
                  onChange={(e) => setHolderName(e.target.value)}
                  disabled={isLoading}
                  data-testid="input-holder-name"
                />
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
                disabled={!selectedBank || !accountNumber || !ifsc || !holderName || isLoading}
                data-testid="button-link-bank"
              >
                {isLoading ? 'Verifying...' : 'Link Bank Account'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      <OTPModal
        open={showOTP}
        onOpenChange={setShowOTP}
        onVerify={handleVerifyOTP}
        onCancel={() => setShowOTP(false)}
        title="Verify Bank Account"
        description="Enter the OTP sent to your registered mobile number"
        error={otpError}
      />
    </div>
  );
}
