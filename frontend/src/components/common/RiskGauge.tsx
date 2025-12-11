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
