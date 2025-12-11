import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { useAppStore } from '@/stores/appStore';
import {
  CreditCard,
  UserX,
  Network,
  Play,
  Square,
  Zap,
  AlertTriangle,
} from 'lucide-react';

interface Scenario {
  id: 'card_testing' | 'ato' | 'mule_ring';
  name: string;
  description: string;
  icon: typeof CreditCard;
  color: string;
  bgColor: string;
}

const scenarios: Scenario[] = [
  {
    id: 'card_testing',
    name: 'Card Testing Attack',
    description: 'Simulate rapid small-value transactions to test stolen card validity',
    icon: CreditCard,
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
  },
  {
    id: 'ato',
    name: 'Account Takeover (ATO)',
    description: 'Simulate unauthorized access from new device/location with suspicious behavior',
    icon: UserX,
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
  },
  {
    id: 'mule_ring',
    name: 'Mule Ring Detection',
    description: 'Simulate coordinated money movement through multiple linked accounts',
    icon: Network,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
  },
];

interface SimulationLog {
  timestamp: Date;
  type: string;
  message: string;
  risk?: number;
}

export default function AdminSimulator() {
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [intensity, setIntensity] = useState([5]);
  const [logs, setLogs] = useState<SimulationLog[]>([]);

  const { simulationRunning, startSimulation, stopSimulation } = useAppStore();

  const handleStart = () => {
    if (!selectedScenario) return;
    
    startSimulation(selectedScenario.id);
    setLogs([{ timestamp: new Date(), type: 'info', message: `Starting ${selectedScenario.name} simulation...` }]);

    const logMessages = getScenarioLogs(selectedScenario.id, intensity[0]);
    let index = 0;

    const interval = setInterval(() => {
      if (index >= logMessages.length) {
        clearInterval(interval);
        setLogs((prev) => [
          ...prev,
          { timestamp: new Date(), type: 'success', message: 'Simulation complete.' },
        ]);
        stopSimulation();
        return;
      }

      setLogs((prev) => [...prev, logMessages[index]]);
      index++;
    }, 1000);
  };

  const handleStop = () => {
    stopSimulation();
    setLogs((prev) => [
      ...prev,
      { timestamp: new Date(), type: 'warning', message: 'Simulation stopped by user.' },
    ]);
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Fraud Simulator</h1>
          <p className="text-muted-foreground">
            Test fraud detection scenarios in a controlled environment
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {scenarios.map((scenario) => (
            <motion.div
              key={scenario.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                className={`cursor-pointer transition-all ${
                  selectedScenario?.id === scenario.id
                    ? 'ring-2 ring-primary'
                    : 'hover:border-primary/50'
                }`}
                onClick={() => !simulationRunning && setSelectedScenario(scenario)}
              >
                <CardContent className="p-6">
                  <div className={`inline-flex p-3 rounded-lg ${scenario.bgColor} mb-4`}>
                    <scenario.icon className={`h-6 w-6 ${scenario.color}`} />
                  </div>
                  <h3 className="font-semibold mb-2">{scenario.name}</h3>
                  <p className="text-sm text-muted-foreground">{scenario.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Simulation Controls</CardTitle>
            <CardDescription>
              Configure and run the selected scenario
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">Intensity Level</label>
                <Badge variant="outline">{intensity[0]} / 10</Badge>
              </div>
              <Slider
                value={intensity}
                onValueChange={setIntensity}
                max={10}
                min={1}
                step={1}
                disabled={simulationRunning}
                data-testid="slider-intensity"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Low</span>
                <span>High</span>
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                onClick={handleStart}
                disabled={!selectedScenario || simulationRunning}
                className="flex-1"
                data-testid="button-start-simulation"
              >
                <Play className="h-4 w-4 mr-2" />
                Start Simulation
              </Button>
              <Button
                onClick={handleStop}
                variant="destructive"
                disabled={!simulationRunning}
                data-testid="button-stop-simulation"
              >
                <Square className="h-4 w-4 mr-2" />
                Stop
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Simulation Log</CardTitle>
              {simulationRunning && (
                <Badge className="animate-pulse">
                  <Zap className="h-3 w-3 mr-1" />
                  Running
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] overflow-y-auto space-y-2 font-mono text-sm bg-muted/30 rounded-lg p-4">
              <AnimatePresence>
                {logs.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    Select a scenario and start the simulation to see logs here.
                  </p>
                ) : (
                  logs.map((log, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-start gap-2"
                    >
                      <span className="text-muted-foreground">
                        [{log.timestamp.toLocaleTimeString()}]
                      </span>
                      <span
                        className={
                          log.type === 'error'
                            ? 'text-red-500'
                            : log.type === 'warning'
                            ? 'text-amber-500'
                            : log.type === 'success'
                            ? 'text-emerald-500'
                            : ''
                        }
                      >
                        {log.message}
                      </span>
                      {log.risk !== undefined && (
                        <Badge
                          variant="outline"
                          className={
                            log.risk >= 85
                              ? 'border-red-500 text-red-500'
                              : log.risk >= 60
                              ? 'border-amber-500 text-amber-500'
                              : 'border-blue-500 text-blue-500'
                          }
                        >
                          Risk: {log.risk}
                        </Badge>
                      )}
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

function getScenarioLogs(scenario: string, intensity: number): SimulationLog[] {
  const base: SimulationLog[] = [];
  
  switch (scenario) {
    case 'card_testing':
      base.push(
        { timestamp: new Date(), type: 'info', message: 'Initiating card testing pattern...', risk: 45 },
        { timestamp: new Date(), type: 'warning', message: 'Transaction $1 to TestMerchant1 - velocity trigger', risk: 65 },
        { timestamp: new Date(), type: 'warning', message: 'Transaction $2 to TestMerchant2 - pattern detected', risk: 78 },
        { timestamp: new Date(), type: 'error', message: 'Transaction $1 to TestMerchant3 - BLOCKED', risk: 92 },
        { timestamp: new Date(), type: 'error', message: 'Account flagged for card testing attack', risk: 95 }
      );
      break;
    case 'ato':
      base.push(
        { timestamp: new Date(), type: 'info', message: 'Simulating login from new device...', risk: 35 },
        { timestamp: new Date(), type: 'warning', message: 'Login from unusual IP (185.220.x.x)', risk: 55 },
        { timestamp: new Date(), type: 'warning', message: 'Password change attempt detected', risk: 72 },
        { timestamp: new Date(), type: 'error', message: 'Bank account change attempt - HOLD', risk: 85 },
        { timestamp: new Date(), type: 'info', message: 'User verification prompt sent' }
      );
      break;
    case 'mule_ring':
      base.push(
        { timestamp: new Date(), type: 'info', message: 'Detecting fund cascade pattern...', risk: 40 },
        { timestamp: new Date(), type: 'warning', message: 'User A -> User B: Rs.10000 (rapid)', risk: 62 },
        { timestamp: new Date(), type: 'warning', message: 'User B -> User C: Rs.9500 (cascade)', risk: 75 },
        { timestamp: new Date(), type: 'warning', message: 'Graph cluster detected: 5 nodes', risk: 82 },
        { timestamp: new Date(), type: 'error', message: 'Mule ring identified - All accounts HOLD', risk: 88 }
      );
      break;
  }
  
  return base;
}
