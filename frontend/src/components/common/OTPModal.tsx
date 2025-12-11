import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CountdownTimer } from './CountdownTimer';
import { Shield, AlertTriangle } from 'lucide-react';

interface OTPModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVerify: (otp: string) => void;
  onCancel?: () => void;
  title?: string;
  description?: string;
  expiresAt?: string;
  type?: 'otp' | 'pin' | 'platform_pin';
  isLoading?: boolean;
  error?: string;
}

export function OTPModal({
  open,
  onOpenChange,
  onVerify,
  onCancel,
  title = 'Enter Verification Code',
  description = 'We sent a 6-digit code to your email',
  expiresAt,
  type = 'otp',
  isLoading = false,
  error,
}: OTPModalProps) {
  const [code, setCode] = useState<string[]>(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleReset = useCallback(() => {
    setCode(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (open) {
      handleReset();
    }
  }, [open, handleReset]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    
    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newCode.every((digit) => digit !== '') && newCode.join('').length === 6) {
      onVerify(newCode.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newCode = [...code];
    pastedData.split('').forEach((digit, i) => {
      if (i < 6) newCode[i] = digit;
    });
    setCode(newCode);
    if (pastedData.length === 6) {
      onVerify(pastedData);
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'platform_pin':
        return <AlertTriangle className="h-8 w-8 text-amber-500" />;
      default:
        return <Shield className="h-8 w-8 text-primary" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            {getIcon()}
          </div>
          <DialogTitle className="text-center">{title}</DialogTitle>
          <DialogDescription className="text-center">{description}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-6 py-4">
          {expiresAt && (
            <CountdownTimer
              expiresAt={expiresAt}
              size="sm"
              onExpire={onCancel}
            />
          )}

          <div className="flex gap-2" onPaste={handlePaste}>
            {code.map((digit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Input
                  ref={(el) => { inputRefs.current[index] = el; }}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="h-14 w-12 text-center text-2xl font-bold"
                  data-testid={`input-otp-${index}`}
                  disabled={isLoading}
                />
              </motion.div>
            ))}
          </div>

          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-sm text-destructive"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <div className="flex gap-3 w-full">
            {onCancel && (
              <Button
                variant="outline"
                onClick={onCancel}
                className="flex-1"
                disabled={isLoading}
                data-testid="button-otp-cancel"
              >
                Cancel
              </Button>
            )}
            <Button
              onClick={() => onVerify(code.join(''))}
              className="flex-1"
              disabled={code.some((d) => !d) || isLoading}
              data-testid="button-otp-verify"
            >
              {isLoading ? 'Verifying...' : 'Verify'}
            </Button>
          </div>

          {type === 'otp' && (
            <button
              onClick={handleReset}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              disabled={isLoading}
              data-testid="button-resend-otp"
            >
              Didn't receive the code? <span className="text-primary font-medium">Resend</span>
            </button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
