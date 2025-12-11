import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { TransactionStatus } from '@/types/api';
import { CheckCircle, Clock, XCircle, AlertTriangle } from 'lucide-react';

interface StatusBadgeProps {
  status: TransactionStatus;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const getConfig = (status: TransactionStatus) => {
    switch (status) {
      case 'allowed':
        return {
          label: 'Allowed',
          icon: CheckCircle,
          className: 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
        };
      case 'pending':
        return {
          label: 'Pending',
          icon: Clock,
          className: 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30',
        };
      case 'on_hold':
        return {
          label: 'On Hold',
          icon: AlertTriangle,
          className: 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30',
        };
      case 'blocked':
        return {
          label: 'Blocked',
          icon: XCircle,
          className: 'bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/30',
        };
    }
  };

  const config = getConfig(status);
  const Icon = config.icon;

  return (
    <Badge
      variant="outline"
      className={cn(
        config.className,
        'flex items-center gap-1',
        size === 'sm' ? 'text-xs px-1.5 py-0' : 'text-xs px-2 py-0.5'
      )}
    >
      <Icon className={size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5'} />
      {config.label}
    </Badge>
  );
}
