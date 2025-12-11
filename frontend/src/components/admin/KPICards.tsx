import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import type { KpiMetrics } from '@/types/api';
import {
  Activity,
  AlertTriangle,
  ShieldAlert,
  TrendingUp,
  Zap,
  Ban,
} from 'lucide-react';
import { Area, AreaChart, ResponsiveContainer } from 'recharts';

interface KPICardsProps {
  metrics: KpiMetrics;
}

const mockSparklineData = [
  { value: 30 }, { value: 40 }, { value: 35 }, { value: 50 }, 
  { value: 45 }, { value: 60 }, { value: 55 }, { value: 70 },
];

export function KPICards({ metrics }: KPICardsProps) {
  const cards = [
    {
      title: 'Active Tx/s',
      value: metrics.activeTxPerSecond.toFixed(1),
      icon: Zap,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10',
      trend: '+12%',
      trendUp: true,
    },
    {
      title: 'Open Alerts',
      value: `${metrics.openAlertsHigh}/${metrics.openAlertsMedium}/${metrics.openAlertsLow}`,
      subtitle: 'H / M / L',
      icon: AlertTriangle,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
    },
    {
      title: 'Confirmed Frauds',
      value: metrics.confirmedFraudsToday.toString(),
      subtitle: 'Today',
      icon: ShieldAlert,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
    },
    {
      title: 'Avg Risk Score',
      value: metrics.avgRiskScore.toFixed(1),
      icon: Activity,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      trend: '-5%',
      trendUp: false,
    },
    {
      title: 'Total Transactions',
      value: metrics.totalTransactionsToday.toLocaleString(),
      subtitle: 'Today',
      icon: TrendingUp,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
    {
      title: 'Blocked Amount',
      value: `₹${(metrics.blockedAmount / 1000).toFixed(0)}K`,
      subtitle: 'Today',
      icon: Ban,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map((card, i) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className={`p-2 rounded-lg ${card.bgColor}`}>
                  <card.icon className={`h-4 w-4 ${card.color}`} />
                </div>
                {card.trend && (
                  <span className={`text-xs font-medium ${card.trendUp ? 'text-emerald-500' : 'text-red-500'}`}>
                    {card.trend}
                  </span>
                )}
              </div>
              <div className="space-y-1">
                <motion.p
                  className="text-2xl font-bold"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.05 + 0.2, type: 'spring' }}
                >
                  {card.value}
                </motion.p>
                <div className="flex items-center gap-1">
                  <p className="text-xs text-muted-foreground">{card.title}</p>
                  {card.subtitle && (
                    <span className="text-xs text-muted-foreground">({card.subtitle})</span>
                  )}
                </div>
              </div>
              <div className="h-8 mt-2 -mx-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockSparklineData}>
                    <defs>
                      <linearGradient id={`gradient-${i}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="hsl(var(--primary))"
                      strokeWidth={1.5}
                      fill={`url(#gradient-${i})`}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
