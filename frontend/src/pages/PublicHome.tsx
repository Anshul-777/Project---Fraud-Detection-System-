import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation, Link } from 'wouter';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { useAppStore } from '@/stores/appStore';
import mockTransactionsData from '@/mocks/mock_transactions.json';
import type { Transaction } from '@/types/api';
import { QRCodeSVG } from 'qrcode.react';
import {
  Shield,
  Send,
  Download,
  QrCode,
  History,
  User,
  LogOut,
  Eye,
  EyeOff,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle,
  XCircle,
  Clock,
} from 'lucide-react';

export default function PublicHome() {
  const [, setLocation] = useLocation();
  const { user, logout } = useAppStore();
  const [showBalance, setShowBalance] = useState(true);
  const [showQRModal, setShowQRModal] = useState(false);

  if (!user) {
    setLocation('/public/login');
    return null;
  }

  const userTransactions = (mockTransactionsData.transactions as Transaction[])
    .filter((tx) => tx.from_user_id === user.id || tx.to_user_id === user.id)
    .slice(0, 10);

  const formatBalance = (balance: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(balance);
  };

  const handleLogout = () => {
    logout();
    setLocation('/');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur-sm">
        <div className="max-w-lg mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-bold">AegisPay</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link href="/public/profile">
              <Button variant="ghost" size="icon" data-testid="button-profile">
                <User className="h-5 w-5" />
              </Button>
            </Link>
            <Button variant="ghost" size="icon" onClick={handleLogout} data-testid="button-logout">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-gradient-to-br from-primary/20 via-primary/10 to-background border-primary/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                      {user.displayName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user.displayName}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowBalance(!showBalance)}
                  data-testid="button-toggle-balance"
                >
                  {showBalance ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </Button>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Available Balance</p>
                <motion.p
                  className="text-4xl font-bold"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  key={showBalance ? 'visible' : 'hidden'}
                >
                  {showBalance ? formatBalance(user.balance) : '********'}
                </motion.p>
              </div>
              {user.bankAccount && (
                <div className="mt-4 pt-4 border-t border-primary/20">
                  <p className="text-xs text-muted-foreground">
                    {user.bankAccount.bankName} - {user.bankAccount.accountNumber}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Link href="/public/pay">
              <Card className="hover-elevate cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <Send className="h-6 w-6 text-primary" />
                  </div>
                  <p className="font-medium">Pay</p>
                </CardContent>
              </Card>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card
              className="hover-elevate cursor-pointer"
              onClick={() => setShowQRModal(true)}
            >
              <CardContent className="p-6 text-center">
                <div className="mx-auto w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center mb-3">
                  <QrCode className="h-6 w-6 text-emerald-500" />
                </div>
                <p className="font-medium">Receive</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Transactions</h2>
            <Button variant="ghost" size="sm" data-testid="button-view-all">
              <History className="h-4 w-4 mr-1" />
              View All
            </Button>
          </div>

          <div className="space-y-3">
            {userTransactions.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                  <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No transactions yet</p>
                </CardContent>
              </Card>
            ) : (
              userTransactions.map((tx, i) => (
                <TransactionItem
                  key={tx.transaction_id}
                  transaction={tx}
                  isOutgoing={tx.from_user_id === user.id}
                  delay={i * 0.05}
                />
              ))
            )}
          </div>
        </motion.div>
      </main>

      <Dialog open={showQRModal} onOpenChange={setShowQRModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Receive Money</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="p-4 bg-white rounded-lg">
              <QRCodeSVG
                value={`upi://pay?pa=${user.id}@aegispay&pn=${encodeURIComponent(user.displayName)}`}
                size={200}
                level="H"
              />
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Scan this QR code to pay <strong>{user.displayName}</strong>
            </p>
            <Badge variant="outline" className="font-mono">
              {user.id}@aegispay
            </Badge>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function TransactionItem({
  transaction,
  isOutgoing,
  delay,
}: {
  transaction: Transaction;
  isOutgoing: boolean;
  delay: number;
}) {
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusIcon = () => {
    switch (transaction.status) {
      case 'allowed':
        return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      case 'blocked':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'on_hold':
        return <Clock className="h-4 w-4 text-amber-500" />;
      default:
        return <Clock className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
    >
      <Card className="hover-elevate cursor-pointer">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-full ${
                isOutgoing ? 'bg-red-500/10' : 'bg-emerald-500/10'
              }`}
            >
              {isOutgoing ? (
                <ArrowUpRight className="h-4 w-4 text-red-500" />
              ) : (
                <ArrowDownLeft className="h-4 w-4 text-emerald-500" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">
                {transaction.merchant_name || (isOutgoing ? 'Sent' : 'Received')}
              </p>
              <p className="text-xs text-muted-foreground">
                {format(new Date(transaction.timestamp), 'MMM d, h:mm a')}
              </p>
            </div>
            <div className="text-right">
              <p className={`font-semibold ${isOutgoing ? 'text-red-500' : 'text-emerald-500'}`}>
                {isOutgoing ? '-' : '+'}
                {formatAmount(transaction.amount)}
              </p>
              <div className="flex items-center justify-end gap-1">
                {getStatusIcon()}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
