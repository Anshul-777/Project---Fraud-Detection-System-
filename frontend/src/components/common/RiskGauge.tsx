import { motion } from 'framer-motion';
import { useMemo } from 'react';

interface RiskGaugeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  animated?: boolean;
}

export function RiskGauge({ score, size = 'md', showLabel = true, animated = true }: RiskGaugeProps) {
  const clampedScore = Math.max(0, Math.min(100, score));
  
  const sizeConfig = useMemo(() => {
    switch (size) {
      case 'sm':
        return { dimension: 80, strokeWidth: 8, fontSize: 'text-lg' };
      case 'lg':
        return { dimension: 200, strokeWidth: 16, fontSize: 'text-4xl' };
      default:
        return { dimension: 140, strokeWidth: 12, fontSize: 'text-2xl' };
    }
  }, [size]);

  const { dimension, strokeWidth, fontSize } = sizeConfig;
  const radius = (dimension - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (clampedScore / 100) * circumference;
  
  const getColor = (score: number) => {
    if (score < 25) return { stroke: '#10b981', text: 'text-emerald-500', bg: 'bg-emerald-500/10' };
    if (score < 60) return { stroke: '#f59e0b', text: 'text-amber-500', bg: 'bg-amber-500/10' };
    if (score < 85) return { stroke: '#f97316', text: 'text-orange-500', bg: 'bg-orange-500/10' };
    return { stroke: '#ef4444', text: 'text-red-500', bg: 'bg-red-500/10' };
  };

  const getLabel = (score: number) => {
    if (score < 25) return 'Low Risk';
    if (score < 60) return 'Medium Risk';
    if (score < 85) return 'High Risk';
    return 'Critical';
  };

  const colors = getColor(clampedScore);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: dimension, height: dimension }}>
        <svg
          width={dimension}
          height={dimension}
          className="transform -rotate-90"
        >
          <circle
            cx={dimension / 2}
            cy={dimension / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
            className="text-muted/30"
          />
          <motion.circle
            cx={dimension / 2}
            cy={dimension / 2}
            r={radius}
            stroke={colors.stroke}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={animated ? { strokeDashoffset: circumference } : { strokeDashoffset: circumference - progress }}
            animate={{ strokeDashoffset: circumference - progress }}
            transition={animated ? { duration: 1, ease: 'easeOut', delay: 0.2 } : { duration: 0 }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className={`font-bold ${fontSize} ${colors.text}`}
            initial={animated ? { scale: 0.5, opacity: 0 } : { scale: 1, opacity: 1 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={animated ? { duration: 0.5, delay: 0.5, type: 'spring' } : { duration: 0 }}
          >
            {clampedScore.toFixed(0)}
          </motion.span>
          {size !== 'sm' && (
            <span className="text-xs text-muted-foreground">Risk Score</span>
          )}
        </div>
      </div>
      {showLabel && (
        <motion.div
          className={`px-3 py-1 rounded-full ${colors.bg} ${colors.text} text-sm font-medium`}
          initial={animated ? { opacity: 0, y: 10 } : { opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          {getLabel(clampedScore)}
        </motion.div>
      )}
    </div>
  );
}
