import { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import type { Alert, AlertPriority } from '@/types/api';
import {
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle,
  XCircle,
  Clock,
  Flag,
} from 'lucide-react';

const mockAlerts: Alert[] = [
  {
    id: 'alert_001',
    transaction_id: 'tx_fraud_001',
    user_id: 'u_109',
    priority: 'high',
    type: 'card_testing',
    message: 'Multiple small transactions detected from new device in Russia',
    timestamp: '2025-12-07T12:30:00Z',
    resolved: false,
  },
  {
    id: 'alert_002',
    transaction_id: 'tx_003',
    user_id: 'u_109',
    priority: 'high',
    type: 'geo_mismatch',
    message: 'Transaction from IP address in Russia while user is in India',
    timestamp: '2025-12-07T12:25:00Z',
    resolved: false,
  },
  {
    id: 'alert_003',
    transaction_id: 'tx_fraud_002',
    user_id: 'u_106',
    priority: 'medium',
    type: 'unusual_amount',
    message: 'Transaction 10x higher than user average for crypto merchant',
    timestamp: '2025-12-05T14:20:00Z',
    resolved: false,
  },
  {
    id: 'alert_004',
    transaction_id: 'tx_006',
    user_id: 'u_110',
    priority: 'medium',
    type: 'new_account_risk',
    message: 'New account attempting high-value jewelry purchase',
    timestamp: '2025-12-07T12:10:00Z',
    resolved: true,
    resolvedBy: 'admin',
    resolvedAt: '2025-12-07T12:15:00Z',
    falsePositive: true,
  },
  {
    id: 'alert_005',
    transaction_id: 'tx_010',
    user_id: 'u_109',
    priority: 'low',
    type: 'velocity',
    message: 'Rapid transactions to multiple gaming merchants',
    timestamp: '2025-12-07T11:50:00Z',
    resolved: false,
  },
];

export default function AdminAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [selectedAlerts, setSelectedAlerts] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<string>('all');

  const getPriorityConfig = (priority: AlertPriority) => {
    switch (priority) {
      case 'high':
        return { icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-500/10' };
      case 'medium':
        return { icon: AlertCircle, color: 'text-amber-500', bg: 'bg-amber-500/10' };
      case 'low':
        return { icon: Info, color: 'text-blue-500', bg: 'bg-blue-500/10' };
    }
  };

  const filteredAlerts = alerts.filter((alert) => {
    if (activeTab === 'all') return !alert.resolved;
    if (activeTab === 'false_positive') return alert.falsePositive;
    return alert.priority === activeTab && !alert.resolved;
  });

  const handleSelectAlert = (alertId: string) => {
    setSelectedAlerts((prev) => {
      const next = new Set(prev);
      if (next.has(alertId)) {
        next.delete(alertId);
      } else {
        next.add(alertId);
      }
      return next;
    });
  };

  const handleResolve = (alertId: string, falsePositive = false) => {
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === alertId
          ? { ...a, resolved: true, resolvedBy: 'admin', resolvedAt: new Date().toISOString(), falsePositive }
          : a
      )
    );
    setSelectedAlerts((prev) => {
      const next = new Set(prev);
      next.delete(alertId);
      return next;
    });
  };

  const handleBulkAction = (action: string) => {
    setAlerts((prev) =>
      prev.map((a) =>
        selectedAlerts.has(a.id)
          ? { ...a, resolved: true, resolvedBy: 'admin', resolvedAt: new Date().toISOString() }
          : a
      )
    );
    setSelectedAlerts(new Set());
  };

  const counts = {
    high: alerts.filter((a) => a.priority === 'high' && !a.resolved).length,
    medium: alerts.filter((a) => a.priority === 'medium' && !a.resolved).length,
    low: alerts.filter((a) => a.priority === 'low' && !a.resolved).length,
    false_positive: alerts.filter((a) => a.falsePositive).length,
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Alerts</h1>
            <p className="text-muted-foreground">
              Review and resolve fraud alerts by priority
            </p>
          </div>
          {selectedAlerts.size > 0 && (
            <div className="flex items-center gap-2">
              <Badge variant="outline">{selectedAlerts.size} selected</Badge>
              <Button size="sm" onClick={() => handleBulkAction('resolve')}>
                Resolve Selected
              </Button>
            </div>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all" data-testid="tab-all">
              All ({counts.high + counts.medium + counts.low})
            </TabsTrigger>
            <TabsTrigger value="high" data-testid="tab-high">
              <AlertTriangle className="h-3 w-3 mr-1 text-red-500" />
              High ({counts.high})
            </TabsTrigger>
            <TabsTrigger value="medium" data-testid="tab-medium">
              <AlertCircle className="h-3 w-3 mr-1 text-amber-500" />
              Medium ({counts.medium})
            </TabsTrigger>
            <TabsTrigger value="low" data-testid="tab-low">
              <Info className="h-3 w-3 mr-1 text-blue-500" />
              Low ({counts.low})
            </TabsTrigger>
            <TabsTrigger value="false_positive" data-testid="tab-false-positive">
              <Flag className="h-3 w-3 mr-1" />
              False Positive ({counts.false_positive})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-4">
            <div className="space-y-3">
              {filteredAlerts.map((alert, i) => {
                const config = getPriorityConfig(alert.priority);
                const Icon = config.icon;

                return (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Card className={selectedAlerts.has(alert.id) ? 'ring-2 ring-primary' : ''}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <Checkbox
                            checked={selectedAlerts.has(alert.id)}
                            onCheckedChange={() => handleSelectAlert(alert.id)}
                            data-testid={`checkbox-alert-${alert.id}`}
                          />

                          <div className={`p-2 rounded-lg ${config.bg}`}>
                            <Icon className={`h-5 w-5 ${config.color}`} />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <Badge variant="outline" className={config.color}>
                                {alert.priority.toUpperCase()}
                              </Badge>
                              <Badge variant="outline">{alert.type}</Badge>
                              <span className="text-xs text-muted-foreground">
                                {format(new Date(alert.timestamp), 'PPp')}
                              </span>
                            </div>
                            <p className="text-sm mb-2">{alert.message}</p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>TX: {alert.transaction_id}</span>
                              <span>User: {alert.user_id}</span>
                            </div>
                          </div>

                          {!alert.resolved && (
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleResolve(alert.id, true)}
                                data-testid={`button-false-positive-${alert.id}`}
                              >
                                <Flag className="h-3 w-3 mr-1" />
                                False Positive
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleResolve(alert.id)}
                                data-testid={`button-resolve-${alert.id}`}
                              >
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Resolve
                              </Button>
                            </div>
                          )}

                          {alert.resolved && (
                            <Badge variant="outline" className="text-emerald-500 border-emerald-500">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Resolved
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}

              {filteredAlerts.length === 0 && (
                <div className="text-center py-12">
                  <CheckCircle className="h-12 w-12 mx-auto text-emerald-500 mb-4" />
                  <h3 className="text-lg font-medium">All clear!</h3>
                  <p className="text-muted-foreground">No alerts in this category</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
