import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Shield, Zap, Lock, ChevronRight } from 'lucide-react';
import { useLocation } from 'wouter';

export function HeroSection() {
  const [, setLocation] = useLocation();

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
      
      <MatrixBackground />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
            >
              <Shield className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">AI-Powered Fraud Detection</span>
            </motion.div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              <span className="bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text text-transparent">
                AegisPay
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-4 max-w-2xl">
              Real-time fraud prevention that protects every transaction
            </p>

            <p className="text-base text-muted-foreground mb-8 max-w-xl">
              Combining rule engines, anomaly detection, supervised learning, sequence analysis, 
              and graph neural networks to stop fraud before it happens.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                size="lg"
                onClick={() => setLocation('/admin/login')}
                data-testid="button-admin-cta"
                className="group"
              >
                Admin Dashboard
                <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => setLocation('/public/login')}
                data-testid="button-public-cta"
                className="group"
              >
                Public App
                <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-6 mt-10 justify-center lg:justify-start">
              <FeaturePill icon={<Zap className="h-4 w-4" />} text="<100ms Latency" />
              <FeaturePill icon={<Shield className="h-4 w-4" />} text="99.4% Accuracy" />
              <FeaturePill icon={<Lock className="h-4 w-4" />} text="Enterprise Grade" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            <HeroIllustration />
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}

function FeaturePill({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border">
      <span className="text-primary">{icon}</span>
      <span className="text-sm font-medium">{text}</span>
    </div>
  );
}

function MatrixBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden opacity-20 dark:opacity-30">
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <pattern id="matrix" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="currentColor" className="text-primary/30" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#matrix)" />
      </svg>
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-px bg-gradient-to-b from-transparent via-primary/40 to-transparent"
          style={{
            left: `${5 + i * 5}%`,
            height: '100%',
          }}
          animate={{
            opacity: [0, 0.5, 0],
            y: ['-100%', '100%'],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
}

function HeroIllustration() {
  const nodes = [
    { x: 200, y: 150, type: 'user', label: 'User' },
    { x: 350, y: 100, type: 'merchant', label: 'Merchant' },
    { x: 350, y: 200, type: 'device', label: 'Device' },
    { x: 150, y: 250, type: 'bank', label: 'Bank' },
    { x: 280, y: 280, type: 'ml', label: 'ML Model' },
  ];

  return (
    <div className="relative w-full aspect-square max-w-lg mx-auto">
      <motion.div
        className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/20 via-transparent to-primary/10 backdrop-blur-xl border border-primary/20"
        animate={{ 
          boxShadow: [
            '0 0 20px rgba(16, 185, 129, 0.1)',
            '0 0 40px rgba(16, 185, 129, 0.2)',
            '0 0 20px rgba(16, 185, 129, 0.1)'
          ]
        }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      
      <svg viewBox="0 0 500 400" className="w-full h-full">
        {nodes.map((node, i) =>
          nodes.slice(i + 1).map((target, j) => (
            <motion.line
              key={`${i}-${j}`}
              x1={node.x}
              y1={node.y}
              x2={target.x}
              y2={target.y}
              stroke="currentColor"
              strokeWidth="1"
              className="text-primary/30"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: 0.2 * (i + j) }}
            />
          ))
        )}

        {nodes.map((node, i) => (
          <motion.g
            key={i}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 + i * 0.15, type: 'spring' }}
          >
            <motion.circle
              cx={node.x}
              cy={node.y}
              r="30"
              className="fill-background stroke-primary/50"
              strokeWidth="2"
              animate={{ 
                r: [28, 32, 28],
                strokeWidth: [2, 3, 2]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                delay: i * 0.3 
              }}
            />
            <text
              x={node.x}
              y={node.y + 4}
              textAnchor="middle"
              className="fill-foreground text-xs font-medium"
            >
              {node.label}
            </text>
          </motion.g>
        ))}

        <motion.circle
          cx="200"
          cy="150"
          r="8"
          className="fill-primary"
          animate={{
            cx: [200, 350, 280, 150, 200],
            cy: [150, 100, 280, 250, 150],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </svg>
    </div>
  );
}
