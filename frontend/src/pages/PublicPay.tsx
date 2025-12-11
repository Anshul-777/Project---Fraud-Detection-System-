import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { OTPModal } from '@/components/common/OTPModal';
import { RiskGauge } from '@/components/common/RiskGauge';
import { CountdownTimer } from '@/components/common/CountdownTimer';
import { useAppStore } from '@/stores/appStore';
import mockUsersData from '@/mocks/mock_users.json';
import {
  ArrowLeft,
  QrCode,
  User,
  Send,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Shield,
  Clock,
} from 'lucide-react';

type PaymentState = 'input' | 'processing' | 'challenge' | 'hold' | 'success' | 'blocked';

const PLATFORM_PIN = '864291';
const HOLD_TIMER_SECONDS = 180;

export default function PublicPay() {
  const [, setLocation] = useLocation();
  const { user, settings } = useAppStore();
  const [upiId, setUpiId] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentState, setPaymentState] = useState<PaymentState>('input');
  const [riskScore, setRiskScore] = useState(0);
  const [showOTP, setShowOTP] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [holdExpiry, setHoldExpiry] = useState<string | null>(null);
  const [otpType, setOtpType] = useState<'otp' | 'platform_pin'>('otp');
  const [processingProgress, setProcessingProgress] = useState(0);

  const thresholds = settings.thresholds;

  const simulateRiskScore = useCallback((): number => {
    const amountNum = parseFloat(amount) || 0;
    
    if (amountNum > 50000) return 75 + Math.random() * 20;
    if (amountNum > 20000) return 50 + Math.random() * 30;
    if (amountNum > 5000) return 25 + Math.random() * 30;
    return Math.random() * 25;
  }, [amount]);

  const determineAction = useCallback((score: number): PaymentState => {
    if (score < thresholds.allow) return 'success';
    if (score < thresholds.challenge) return 'challenge';
    if (score < thresholds.hold) return 'hold';
    return 'blocked';
  }, [thresholds]);

  const handlePay = async () => {
    const amountNum = parseFloat(amount);
    if (!upiId || !amountNum || amountNum <= 0) return;

    setPaymentState('processing');
    setProcessingProgress(0);
    
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((r) => setTimeout(r, 150));
      setProcessingProgress(i);
    }
    
    const score = simulateRiskScore();
    setRiskScore(score);

    const action = determineAction(score);
    
    if (action === 'challenge') {
      setOtpType('otp');
      setPaymentState('challenge');
      setShowOTP(true);
      setHoldExpiry(new Date(Date.now() + HOLD_TIMER_SECONDS * 1000).toISOString());
    } else if (action === 'hold') {
      setPaymentState('hold');
      setHoldExpiry(new Date(Date.now() + HOLD_TIMER_SECONDS * 1000).toISOString());
    } else if (action === 'blocked') {
      setPaymentState('blocked');
    } else {
      setPaymentState('success');
    }
  };

  const handleVerifyOTP = (otp: string) => {
    setOtpError('');
    
    if (otpType === 'platform_pin') {
      if (otp === PLATFORM_PIN) {
        setShowOTP(false);
        setPaymentState('success');
      } else {
        setOtpError(`Invalid Platform PIN. Try: ${PLATFORM_PIN}`);
      }
    } else {
      if (otp === mockUsersData.defaultOtp) {
        setShowOTP(false);
        setPaymentState('success');
      } else {
        setOtpError('Invalid OTP. Try: 123456');
      }
    }
  };

  const handleOTPCancel = () => {
    setShowOTP(false);
    setOtpError('');
    if (paymentState === 'challenge') {
      setPaymentState('input');
    }
  };

  const handleHoldVerify = () => {
    setOtpType('otp');
    setShowOTP(true);
  };

  const handleBlockedOverride = () => {
    setOtpType('platform_pin');
    setShowOTP(true);
    setOtpError('');
  };

  const handleHoldExpire = () => {
    setPaymentState('blocked');
    setHoldExpiry(null);
  };

  const handleReset = () => {
    setPaymentState('input');
    setUpiId('');
    setAmount('');
    setRiskScore(0);
    setHoldExpiry(null);
    setOtpError('');
    setProcessingProgress(0);
  };

  const formatAmount = (val: string) => {
    const num = parseFloat(val);
    if (isNaN(num)) return '';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur-sm">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation('/public/home')}
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="font-semibold">Send Money</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          {paymentState === 'input' && (
            <motion.div
              key="input"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="upi">UPI ID or Account</Label>
                    <div className="relative">
                      <Input
                        id="upi"
                        placeholder="name@bank or account number"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        data-testid="input-upi"
                      />
                      <User className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>

                  <div className="text-center py-2">
                    <Button variant="outline" size="sm" data-testid="button-scan-qr">
                      <QrCode className="h-4 w-4 mr-2" />
                      Scan QR Code
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        Rs.
                      </span>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="0"
                        className="pl-10 text-2xl font-bold h-14"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        data-testid="input-amount"
                      />
                    </div>
                    {amount && (
                      <p className="text-sm text-muted-foreground">
                        {formatAmount(amount)}
                      </p>
                    )}
                  </div>

                  <div className="p-3 rounded-lg bg-muted/50 text-xs text-muted-foreground">
                    <p className="font-medium mb-1">Risk Thresholds:</p>
                    <ul className="space-y-0.5">
                      <li className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        Allow: Score &lt; {thresholds.allow}
                      </li>
                      <li className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        Challenge OTP: {thresholds.allow} - {thresholds.challenge}
                      </li>
                      <li className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-orange-500" />
                        Admin Hold: {thresholds.challenge} - {thresholds.hold}
                      </li>
                      <li className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-red-500" />
                        Block: {`≥`}{thresholds.hold}
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Button
                className="w-full h-12"
                onClick={handlePay}
                disabled={!upiId || !amount || parseFloat(amount) <= 0}
                data-testid="button-pay"
              >
                <Send className="h-4 w-4 mr-2" />
                Pay {amount ? formatAmount(amount) : ''}
              </Button>
            </motion.div>
          )}

          {paymentState === 'processing' && (
            <motion.div
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-background"
            >
              <div className="text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="mx-auto mb-6"
                >
                  <Shield className="h-16 w-16 text-primary" />
                </motion.div>
                <h2 className="text-xl font-semibold mb-2">Processing Payment</h2>
                <p className="text-muted-foreground mb-4">Performing fraud detection...</p>
                <div className="w-64 h-2 bg-muted rounded-full mx-auto overflow-hidden">
                  <motion.div
                    className="h-full bg-primary rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${processingProgress}%` }}
                    transition={{ duration: 0.1 }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">{processingProgress}%</p>
              </div>
            </motion.div>
          )}

          {paymentState === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
                className="mx-auto mb-6 w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center"
              >
                <CheckCircle className="h-10 w-10 text-emerald-500" />
              </motion.div>
              <h2 className="text-2xl font-bold mb-2">Payment Successful</h2>
              <p className="text-muted-foreground mb-6">
                {formatAmount(amount)} sent to {upiId}
              </p>
              
              <RiskGauge score={riskScore} size="md" />
              
              <Card className="mt-6 mb-6">
                <CardContent className="p-4 text-left text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount</span>
                    <span className="font-medium">{formatAmount(amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">To</span>
                    <span className="font-medium">{upiId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Risk Score</span>
                    <span className={`font-medium ${riskScore < 25 ? 'text-emerald-500' : riskScore < 60 ? 'text-amber-500' : 'text-red-500'}`}>
                      {riskScore.toFixed(0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Transaction ID</span>
                    <span className="font-mono text-xs">tx_{Date.now()}</span>
                  </div>
                </CardContent>
              </Card>
              <Button onClick={() => setLocation('/public/home')} data-testid="button-done">
                Done
              </Button>
            </motion.div>
          )}

          {paymentState === 'challenge' && !showOTP && (
            <motion.div
              key="challenge"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
                className="mx-auto mb-6 w-20 h-20 rounded-full bg-amber-500/10 flex items-center justify-center"
              >
                <AlertTriangle className="h-10 w-10 text-amber-500" />
              </motion.div>
              <h2 className="text-2xl font-bold mb-2">Verification Required</h2>
              <p className="text-muted-foreground mb-4">
                Medium risk detected. Please verify with OTP.
              </p>
              
              <RiskGauge score={riskScore} size="md" />
              
              {holdExpiry && (
                <div className="mt-4">
                  <CountdownTimer
                    expiresAt={holdExpiry}
                    size="md"
                    onExpire={handleHoldExpire}
                  />
                </div>
              )}
              
              <div className="mt-6 space-y-3">
                <Button onClick={() => setShowOTP(true)} data-testid="button-enter-otp">
                  Enter OTP
                </Button>
                <Button
                  variant="outline"
                  onClick={handleReset}
                  data-testid="button-cancel"
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          )}

          {paymentState === 'hold' && (
            <motion.div
              key="hold"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
                className="mx-auto mb-6 w-20 h-20 rounded-full bg-orange-500/10 flex items-center justify-center"
              >
                <Clock className="h-10 w-10 text-orange-500" />
              </motion.div>
              <h2 className="text-2xl font-bold mb-2">Transaction On Hold</h2>
              <p className="text-muted-foreground mb-4">
                High risk detected. Admin review required or verify your identity.
              </p>
              
              <RiskGauge score={riskScore} size="md" />
              
              {holdExpiry && (
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground mb-2">Time remaining:</p>
                  <CountdownTimer
                    expiresAt={holdExpiry}
                    size="lg"
                    onExpire={handleHoldExpire}
                  />
                </div>
              )}
              
              <div className="mt-6 space-y-3">
                <Button onClick={handleHoldVerify} data-testid="button-verify-hold">
                  Verify with OTP
                </Button>
                <Button
                  variant="outline"
                  onClick={handleReset}
                  data-testid="button-cancel-hold"
                >
                  Cancel Transaction
                </Button>
              </div>
            </motion.div>
          )}

          {paymentState === 'blocked' && (
            <motion.div
              key="blocked"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
                className="mx-auto mb-6 w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center"
              >
                <XCircle className="h-10 w-10 text-red-500" />
              </motion.div>
              <h2 className="text-2xl font-bold mb-2">Transaction Blocked</h2>
              <p className="text-muted-foreground mb-4">
                Critical fraud risk detected. This transaction has been blocked.
              </p>
              
              <RiskGauge score={riskScore} size="md" />
              
              <Card className="mt-6 mb-6">
                <CardContent className="p-4 text-left text-sm">
                  <p className="text-muted-foreground">
                    If you believe this is an error, you can override with the Platform PIN.
                    Contact support if you don't have access.
                  </p>
                </CardContent>
              </Card>
              
              <div className="space-y-3">
                <Button
                  variant="outline"
                  onClick={handleBlockedOverride}
                  data-testid="button-platform-pin"
                  className="text-amber-600 border-amber-600"
                >
                  Enter Platform PIN
                </Button>
                <Button onClick={() => setLocation('/public/home')} data-testid="button-go-home">
                  Go Home
                </Button>
              </div>
              
              <p className="text-xs text-muted-foreground mt-4">
                Demo Platform PIN: {PLATFORM_PIN}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <OTPModal
          open={showOTP}
          onOpenChange={setShowOTP}
          onVerify={handleVerifyOTP}
          onCancel={handleOTPCancel}
          title={otpType === 'platform_pin' ? 'Enter Platform PIN' : 'Verify Transaction'}
          description={
            otpType === 'platform_pin'
              ? 'Enter the 6-digit platform PIN to override the block'
              : 'Enter the OTP sent to your registered mobile'
          }
          type={otpType}
          error={otpError}
          expiresAt={holdExpiry || undefined}
        />
      </main>
    </div>
  );
}
