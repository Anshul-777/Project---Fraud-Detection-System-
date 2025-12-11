import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RiskGauge } from '@/components/common/RiskGauge';
import { CountdownTimer } from '@/components/common/CountdownTimer';
import { StatusBadge } from '@/components/common/StatusBadge';
import type { Transaction, User } from '@/types/api';
import {
  X,
  User as UserIcon,
  CreditCard,
  MapPin,
  Smartphone,
  Globe,
  Clock,
  ShieldCheck,
  ShieldAlert,
  Ban,
  AlertTriangle,
  ChevronRight,
} from 'lucide-react';

interface TransactionDetailProps {
  transaction: Transaction | null;
  user?: User | null;
  onClose: () => void;
  onAction: (action: string) => void;
}

export function TransactionDetail({ transaction, user, onClose, onAction }: TransactionDetailProps) {
  if (!transaction) return null;

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency || 'INR',
    }).format(amount);
  };

  const isOnHold = transaction.status === 'on_hold' && transaction.hold_expires_at;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/50"
        onClick={onClose}
      />
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed right-0 top-0 z-50 h-full w-full md:w-2/3 lg:w-1/2 bg-background border-l overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 bg-background border-b p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold">Transaction Details</h2>
            <StatusBadge status={transaction.status} />
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} data-testid="button-close-detail">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {isOnHold && (
            <Card className="border-amber-500/50 bg-amber-500/5">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                    <div>
                      <p className="font-medium text-amber-600 dark:text-amber-400">Transaction On Hold</p>
                      <p className="text-sm text-muted-foreground">Awaiting user verification</p>
                    </div>
                  </div>
                  <CountdownTimer
                    expiresAt={transaction.hold_expires_at!}
                    size="sm"
                    onExpire={() => {}}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-center">
            <RiskGauge score={transaction.risk_score} size="lg" />
          </div>

          {transaction.shap_values && transaction.shap_values.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Risk Factors</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {transaction.shap_values.map((shap, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="capitalize">{shap.feature.replace(/_/g, ' ')}</span>
                      <span className="font-mono text-xs text-muted-foreground">
                        {(shap.impact * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${shap.impact * 100}%` }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                        className="h-full bg-gradient-to-r from-amber-500 to-red-500 rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {user && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <UserIcon className="h-4 w-4" />
                  User Profile
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Name</span>
                    <p className="font-medium">{user.displayName}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">User ID</span>
                    <p className="font-mono text-xs">{user.id}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">KYC Level</span>
                    <Badge variant="outline" className="mt-1">{user.kycLevel}</Badge>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Account Age</span>
                    <p className="font-medium">{user.accountAge} days</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Balance</span>
                    <p className="font-medium">{formatAmount(user.balance, user.currency)}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Total Transactions</span>
                    <p className="font-medium">{user.transactionCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Transaction Info
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Transaction ID</span>
                  <p className="font-mono text-xs">{transaction.transaction_id}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Timestamp</span>
                  <p className="font-medium">
                    {format(new Date(transaction.timestamp), 'PPpp')}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Amount</span>
                  <p className="font-medium text-lg">
                    {formatAmount(transaction.amount, transaction.currency)}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Payment Method</span>
                  <p className="font-medium capitalize">{transaction.payment_method.replace('_', ' ')}</p>
                </div>
                {transaction.merchant_name && (
                  <>
                    <div>
                      <span className="text-muted-foreground">Merchant</span>
                      <p className="font-medium">{transaction.merchant_name}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Category</span>
                      <p className="font-medium capitalize">{transaction.merchant_category}</p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Device & Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <span className="text-muted-foreground">Device ID</span>
                    <p className="font-mono text-xs">{transaction.device_id || 'Unknown'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <span className="text-muted-foreground">IP Address</span>
                    <p className="font-mono text-xs">{transaction.ip || 'Unknown'}</p>
                  </div>
                </div>
                <div className="col-span-2 flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <span className="text-muted-foreground">Country</span>
                    <p className="font-medium">{transaction.geo_country || 'Unknown'}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {transaction.reasons && transaction.reasons.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Risk Reasons</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {transaction.reasons.map((reason, i) => (
                    <Badge key={i} variant="outline" className="capitalize">
                      {reason.replace(/_/g, ' ')}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-2 gap-4 pt-4">
            <Button
              onClick={() => onAction('require_otp')}
              variant="outline"
              className="w-full"
              data-testid="button-require-otp"
            >
              <ShieldCheck className="h-4 w-4 mr-2" />
              Require OTP
            </Button>
            <Button
              onClick={() => onAction('hold')}
              variant="outline"
              className="w-full text-amber-600 border-amber-600 hover:bg-amber-600/10"
              data-testid="button-place-hold"
            >
              <Clock className="h-4 w-4 mr-2" />
              Place Hold
            </Button>
            <Button
              onClick={() => onAction('block')}
              variant="outline"
              className="w-full text-red-600 border-red-600 hover:bg-red-600/10"
              data-testid="button-block"
            >
              <Ban className="h-4 w-4 mr-2" />
              Block
            </Button>
            <Button
              onClick={() => onAction('escalate')}
              variant="outline"
              className="w-full text-orange-600 border-orange-600 hover:bg-orange-600/10"
              data-testid="button-escalate"
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Escalate
            </Button>
          </div>

          {isOnHold && (
            <div className="pt-2">
              <Button
                onClick={() => onAction('release')}
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                data-testid="button-release"
              >
                <ShieldCheck className="h-4 w-4 mr-2" />
                Release Transaction
              </Button>
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t">
            <span>Model Version: {transaction.model_version || 'xgb_v2.1'}</span>
            <span>Rules Version: rules_v1.3</span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
