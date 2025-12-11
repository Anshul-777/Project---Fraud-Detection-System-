import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { RiskBadge } from '@/components/common/RiskBadge';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Transaction } from '@/types/api';
import {
  CreditCard,
  Smartphone,
  Building2,
  MoreVertical,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Globe,
} from 'lucide-react';

interface TransactionRowProps {
  transaction: Transaction;
  onClick: () => void;
  onAction: (action: string) => void;
  isNew?: boolean;
}

const paymentMethodIcons: Record<string, typeof CreditCard> = {
  card: CreditCard,
  upi: Smartphone,
  bank_transfer: Building2,
};

const countryFlags: Record<string, string> = {
  IN: '🇮🇳',
  US: '🇺🇸',
  UK: '🇬🇧',
  RU: '🇷🇺',
  CN: '🇨🇳',
};

export function TransactionRow({ transaction, onClick, onAction, isNew }: TransactionRowProps) {
  const PaymentIcon = paymentMethodIcons[transaction.payment_method] || CreditCard;
  const flag = countryFlags[transaction.geo_country || 'IN'] || '🌍';
  
  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency || 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const maskUser = (userId: string) => {
    return `${userId.charAt(0).toUpperCase()}***`;
  };

  return (
    <motion.tr
      initial={isNew ? { opacity: 0, x: -20, backgroundColor: 'rgba(16, 185, 129, 0.1)' } : { opacity: 1, x: 0 }}
      animate={{ opacity: 1, x: 0, backgroundColor: 'transparent' }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      className={`cursor-pointer transition-colors hover:bg-muted/50 ${
        transaction.risk_score >= 60 ? 'bg-red-500/5' : ''
      }`}
      data-testid={`row-transaction-${transaction.transaction_id}`}
    >
      <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">
        {format(new Date(transaction.timestamp), 'HH:mm:ss')}
      </td>
      <td className="px-4 py-3 text-sm font-mono whitespace-nowrap">
        {transaction.transaction_id.slice(0, 10)}
      </td>
      <td className="px-4 py-3 text-sm whitespace-nowrap">
        {maskUser(transaction.from_user_id)}
      </td>
      <td className="px-4 py-3 text-sm font-medium whitespace-nowrap">
        {formatAmount(transaction.amount, transaction.currency)}
      </td>
      <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">
        {transaction.merchant_name || 'P2P Transfer'}
      </td>
      <td className="px-4 py-3 text-center whitespace-nowrap">
        <span className="text-lg" role="img" aria-label={transaction.geo_country || 'Unknown'}>
          {flag}
        </span>
      </td>
      <td className="px-4 py-3 text-center whitespace-nowrap">
        <PaymentIcon className="h-4 w-4 mx-auto text-muted-foreground" />
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <StatusBadge status={transaction.status} size="sm" />
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <RiskBadge score={transaction.risk_score} size="sm" />
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => e.stopPropagation()}
              data-testid={`button-actions-${transaction.transaction_id}`}
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onAction('confirm')}>
              <CheckCircle className="h-4 w-4 mr-2 text-emerald-500" />
              Confirm
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAction('hold')}>
              <Clock className="h-4 w-4 mr-2 text-amber-500" />
              Place Hold
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAction('block')}>
              <XCircle className="h-4 w-4 mr-2 text-red-500" />
              Block
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAction('escalate')}>
              <AlertTriangle className="h-4 w-4 mr-2 text-orange-500" />
              Escalate
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </motion.tr>
  );
}
