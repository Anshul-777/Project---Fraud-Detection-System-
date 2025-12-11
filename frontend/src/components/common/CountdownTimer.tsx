import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';

interface CountdownTimerProps {
  expiresAt: string | Date;
  onExpire?: () => void;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function CountdownTimer({ expiresAt, onExpire, size = 'md', showLabel = true }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [totalTime, setTotalTime] = useState<number>(0);

  useEffect(() => {
    const expireTime = new Date(expiresAt).getTime();
    const now = Date.now();
    const initial = Math.max(0, Math.floor((expireTime - now) / 1000));
    setTotalTime(initial);
    setTimeLeft(initial);

    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.floor((expireTime - Date.now()) / 1000));
      setTimeLeft(remaining);
      
      if (remaining === 0) {
        clearInterval(interval);
        onExpire?.();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt, onExpire]);

  const sizeConfig = useMemo(() => {
    switch (size) {
      case 'sm':
        return { dimension: 60, strokeWidth: 4, fontSize: 'text-sm' };
      case 'lg':
        return { dimension: 120, strokeWidth: 10, fontSize: 'text-2xl' };
      default:
        return { dimension: 80, strokeWidth: 6, fontSize: 'text-lg' };
    }
  }, [size]);

  const { dimension, strokeWidth, fontSize } = sizeConfig;
  const radius = (dimension - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = totalTime > 0 ? ((totalTime - timeLeft) / totalTime) * circumference : 0;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getColor = () => {
    const percentage = totalTime > 0 ? (timeLeft / totalTime) * 100 : 0;
    if (percentage > 50) return '#10b981';
    if (percentage > 25) return '#f59e0b';
    return '#ef4444';
  };

  const isExpired = timeLeft === 0;

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
            stroke={getColor()}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            animate={{ strokeDashoffset: circumference - progress }}
            transition={{ duration: 0.5, ease: 'linear' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className={`font-mono font-bold ${fontSize} ${isExpired ? 'text-red-500' : ''}`}
            animate={isExpired ? { scale: [1, 1.1, 1] } : {}}
            transition={{ repeat: isExpired ? Infinity : 0, duration: 0.5 }}
          >
            {isExpired ? '0:00' : formatTime(timeLeft)}
          </motion.span>
        </div>
      </div>
      {showLabel && (
        <span className={`text-xs ${isExpired ? 'text-red-500 font-medium' : 'text-muted-foreground'}`}>
          {isExpired ? 'Expired' : 'Time Remaining'}
        </span>
      )}
    </div>
  );
}
