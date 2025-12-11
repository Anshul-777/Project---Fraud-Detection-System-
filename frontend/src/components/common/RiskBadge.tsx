import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface RiskBadgeProps {
  score: number;
  showScore?: boolean;
  size?: 'sm' | 'md';
}

export function RiskBadge({ score, showScore = true, size = 'md' }: RiskBadgeProps) {
  const getConfig = (score: number) => {
    if (score < 25) {
      return {
        label: 'Low',
        className: 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
      };
    }
    if (score < 60) {
      return {
        label: 'Medium',
        className: 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30',
      };
    }
    if (score < 85) {
      return {
        label: 'High',
        className: 'bg-orange-500/20 text-orange-600 dark:text-orange-400 border-orange-500/30',
      };
    }
    return {
      label: 'Critical',
      className: 'bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/30',
    };
  };

  const config = getConfig(score);

  return (
    <Badge
      variant="outline"
      className={cn(
        config.className,
        size === 'sm' ? 'text-xs px-1.5 py-0' : 'text-xs px-2 py-0.5'
      )}
    >
      {showScore ? `${score.toFixed(0)} - ${config.label}` : config.label}
    </Badge>
  );
}
