import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Brain,
  Network,
  Shield,
  Zap,
  BarChart3,
  Users,
  Clock,
  Eye,
  GitBranch,
  Activity,
  Lock,
  CheckCircle,
} from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'Multi-Model Architecture',
    description: 'Five specialized detection layers working in concert',
    details: [
      'Rule Engine: Hard-coded velocity limits and blacklists for instant blocking',
      'Anomaly Detection: Isolation Forest identifies unusual spending patterns',
      'Supervised Learning: XGBoost classifier trained on historical fraud data',
      'Sequence Model: LSTM analyzes transaction sequences for behavioral anomalies',
      'Graph Neural Network: Detects mule rings and coordinated fraud attacks',
    ],
  },
  {
    icon: Zap,
    title: 'Real-Time Detection',
    description: 'Sub-100ms latency for instant fraud decisions',
    details: [
      'Feature computation in <20ms using Redis cached aggregates',
      'Model inference parallelized across GPU clusters',
      'Streaming architecture with Kafka for high throughput',
      'Adaptive batching for optimal latency-throughput tradeoff',
    ],
  },
  {
    icon: Eye,
    title: 'Explainable AI',
    description: 'Understand why every decision was made',
    details: [
      'SHAP values show feature contributions to risk score',
      'Decision path visualization for rule engine triggers',
      'Natural language explanations for analyst review',
      'Audit trail for regulatory compliance',
    ],
  },
  {
    icon: Network,
    title: 'Entity Graph Analysis',
    description: 'Visualize and detect coordinated fraud networks',
    details: [
      'Real-time graph construction from transaction flows',
      'Community detection identifies mule ring clusters',
      'Entity resolution links accounts across identifiers',
      'Risk propagation through network connections',
    ],
  },
];

const modelArchitecture = [
  {
    layer: 'Layer 1: Rule Engine',
    color: 'emerald',
    description: 'Deterministic rules for known fraud patterns',
    metrics: '10μs latency, 100% precision on blocklist hits',
  },
  {
    layer: 'Layer 2: Anomaly Detection',
    color: 'blue',
    description: 'Unsupervised detection of outliers',
    metrics: 'Isolation Forest, catches 15% of unknown fraud',
  },
  {
    layer: 'Layer 3: Supervised ML',
    color: 'amber',
    description: 'XGBoost trained on labeled fraud data',
    metrics: '94% PR-AUC, 89% precision @ 92% recall',
  },
  {
    layer: 'Layer 4: Sequence Model',
    color: 'purple',
    description: 'LSTM for behavioral pattern analysis',
    metrics: 'Catches 8% of ATO attacks missed by others',
  },
  {
    layer: 'Layer 5: Graph Neural Network',
    color: 'rose',
    description: 'GNN for network-based fraud detection',
    metrics: 'Detects 95% of coordinated mule rings',
  },
];

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

export function FeatureSections() {
  return (
    <div className="bg-background">
      <FeaturesGrid />
      <ModelArchitectureSection />
      <HowItWorksSection />
      <DemoFlowSection />
    </div>
  );
}

function FeaturesGrid() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div {...fadeInUp} className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">
            Enterprise-Grade Protection
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            AegisPay combines cutting-edge machine learning with battle-tested engineering 
            to deliver fraud prevention that scales.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {feature.details.map((detail, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                        <span className="text-muted-foreground">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ModelArchitectureSection() {
  const getColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      emerald: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-600 dark:text-emerald-400',
      blue: 'bg-blue-500/20 border-blue-500/40 text-blue-600 dark:text-blue-400',
      amber: 'bg-amber-500/20 border-amber-500/40 text-amber-600 dark:text-amber-400',
      purple: 'bg-purple-500/20 border-purple-500/40 text-purple-600 dark:text-purple-400',
      rose: 'bg-rose-500/20 border-rose-500/40 text-rose-600 dark:text-rose-400',
    };
    return colors[color] || colors.emerald;
  };

  return (
    <section className="py-20 px-6 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <motion.div {...fadeInUp} className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">
            Multi-Layer Detection Architecture
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Each transaction passes through five specialized detection layers, 
            each contributing to the final risk score.
          </p>
        </motion.div>

        <div className="space-y-4 max-w-3xl mx-auto">
          {modelArchitecture.map((layer, i) => (
            <motion.div
              key={layer.layer}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className={`p-4 rounded-lg border ${getColorClasses(layer.color)}`}
            >
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h3 className="font-semibold">{layer.layer}</h3>
                  <p className="text-sm opacity-80">{layer.description}</p>
                </div>
                <span className="text-xs font-mono opacity-70">{layer.metrics}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const steps = [
    {
      icon: Activity,
      title: 'Transaction Received',
      description: 'Payment request enters the system with 50+ features extracted',
    },
    {
      icon: Brain,
      title: 'Parallel Model Inference',
      description: 'All five detection layers analyze the transaction simultaneously',
    },
    {
      icon: GitBranch,
      title: 'Score Fusion',
      description: 'Individual scores combined using weighted ensemble method',
    },
    {
      icon: Shield,
      title: 'Decision & Action',
      description: 'Allow, Challenge, Hold, or Block based on risk thresholds',
    },
  ];

  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div {...fadeInUp} className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">
            How It Works
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            From transaction to decision in under 100 milliseconds
          </p>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="text-center"
            >
              <div className="relative">
                <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <step.icon className="h-8 w-8 text-primary" />
                </div>
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-px bg-border" />
                )}
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                  {i + 1}
                </span>
              </div>
              <h3 className="font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DemoFlowSection() {
  return (
    <section className="py-20 px-6 bg-muted/30">
      <div className="max-w-4xl mx-auto">
        <motion.div {...fadeInUp} className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">
            Demo Scenarios
          </h2>
          <p className="text-muted-foreground">
            Experience how AegisPay handles different fraud patterns
          </p>
        </motion.div>

        <Accordion type="single" collapsible className="space-y-4">
          <AccordionItem value="card-testing" className="border rounded-lg px-4">
            <AccordionTrigger className="text-left">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded bg-red-500/20">
                  <Lock className="h-4 w-4 text-red-500" />
                </div>
                <div>
                  <span className="font-semibold">Card Testing Attack</span>
                  <p className="text-xs text-muted-foreground">Rapid small transactions to validate stolen cards</p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              <ul className="space-y-2 pl-11">
                <li>Attacker submits multiple $1 transactions in rapid succession</li>
                <li>Velocity rules trigger after 3rd transaction in 5 minutes</li>
                <li>ML model detects unusual merchant diversity pattern</li>
                <li>System escalates to BLOCK after 4th attempt</li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="ato" className="border rounded-lg px-4">
            <AccordionTrigger className="text-left">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded bg-amber-500/20">
                  <Users className="h-4 w-4 text-amber-500" />
                </div>
                <div>
                  <span className="font-semibold">Account Takeover (ATO)</span>
                  <p className="text-xs text-muted-foreground">Unauthorized access from compromised credentials</p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              <ul className="space-y-2 pl-11">
                <li>Login from new device and unusual IP location</li>
                <li>Attempt to change email and add new bank account</li>
                <li>Device fingerprint and geo-location trigger HOLD</li>
                <li>User receives verification prompt; admin alerted</li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="mule" className="border rounded-lg px-4">
            <AccordionTrigger className="text-left">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded bg-purple-500/20">
                  <Network className="h-4 w-4 text-purple-500" />
                </div>
                <div>
                  <span className="font-semibold">Mule Ring Detection</span>
                  <p className="text-xs text-muted-foreground">Coordinated money laundering through multiple accounts</p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              <ul className="space-y-2 pl-11">
                <li>Funds cascade through 5 accounts in under 30 minutes</li>
                <li>Graph Neural Network identifies cluster of connected accounts</li>
                <li>Entity resolution links accounts via shared device/IP</li>
                <li>All accounts in ring placed on HOLD simultaneously</li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="normal" className="border rounded-lg px-4">
            <AccordionTrigger className="text-left">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded bg-emerald-500/20">
                  <BarChart3 className="h-4 w-4 text-emerald-500" />
                </div>
                <div>
                  <span className="font-semibold">Normal Transaction</span>
                  <p className="text-xs text-muted-foreground">Legitimate payment with low risk indicators</p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              <ul className="space-y-2 pl-11">
                <li>User on trusted device makes routine purchase</li>
                <li>All models return low risk scores (5-15)</li>
                <li>Transaction ALLOWED in under 50ms</li>
                <li>Added to user's behavioral profile for future reference</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
}
