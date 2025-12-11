import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { TransactionRow } from '@/components/admin/TransactionRow';
import { TransactionDetail } from '@/components/admin/TransactionDetail';
import { KPICards } from '@/components/admin/KPICards';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/stores/appStore';
import type { Transaction, User, KpiMetrics } from '@/types/api';
import mockTransactionsData from '@/mocks/mock_transactions.json';
import mockUsersData from '@/mocks/mock_users.json';
import mockGraphData from '@/mocks/mock_graph.json';
import { Wifi, Clock } from 'lucide-react';

export default function AdminDashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [newTxIds, setNewTxIds] = useState<Set<string>>(new Set());

  const { wsConnected, setWsConnected, kpiMetrics, setKpiMetrics } = useAppStore();

  useEffect(() => {
    setTransactions(mockTransactionsData.transactions as Transaction[]);
    setKpiMetrics(mockGraphData.kpiMetrics as KpiMetrics);
    setWsConnected(true);

    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, [setKpiMetrics, setWsConnected]);

  useEffect(() => {
    const streamInterval = setInterval(() => {
      const mockNewTx = generateMockTransaction();
      setTransactions((prev) => [mockNewTx, ...prev].slice(0, 100));
      setNewTxIds((prev) => new Set([...prev, mockNewTx.transaction_id]));
      
      setTimeout(() => {
        setNewTxIds((prev) => {
          const next = new Set(prev);
          next.delete(mockNewTx.transaction_id);
          return next;
        });
      }, 2000);
    }, 3000);

    return () => clearInterval(streamInterval);
  }, []);

  const handleSelectTransaction = (tx: Transaction) => {
    setSelectedTx(tx);
    const user = mockUsersData.users.find((u) => u.id === tx.from_user_id) as User | undefined;
    setSelectedUser(user || null);
  };

  const handleAction = (action: string) => {
    if (!selectedTx) return;
    
    setTransactions((prev) =>
      prev.map((tx) =>
        tx.transaction_id === selectedTx.transaction_id
          ? {
              ...tx,
              status: action === 'block' ? 'blocked' : action === 'confirm' ? 'allowed' : tx.status,
            }
          : tx
      )
    );
    
    if (action === 'block' || action === 'confirm') {
      setSelectedTx(null);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Monitor live transactions, act on alerts, and audit model decisions.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span className="font-mono">{format(currentTime, 'PPpp')}</span>
            </div>
            <Badge
              variant="outline"
              className={wsConnected ? 'border-emerald-500 text-emerald-500' : 'border-muted text-muted-foreground'}
            >
              <Wifi className="h-3 w-3 mr-1" />
              {wsConnected ? 'Live' : 'Offline'}
            </Badge>
          </div>
        </div>

        <KPICards metrics={kpiMetrics} />

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Live Transaction Stream</CardTitle>
              <Badge variant="outline" className="font-mono">
                {transactions.length} transactions
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Time
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Txn ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Merchant
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Geo
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Method
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Risk
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {transactions.map((tx) => (
                    <TransactionRow
                      key={tx.transaction_id}
                      transaction={tx}
                      onClick={() => handleSelectTransaction(tx)}
                      onAction={(action) => {
                        setSelectedTx(tx);
                        handleAction(action);
                      }}
                      isNew={newTxIds.has(tx.transaction_id)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <TransactionDetail
          transaction={selectedTx}
          user={selectedUser}
          onClose={() => setSelectedTx(null)}
          onAction={handleAction}
        />
      </div>
    </AdminLayout>
  );
}

function generateMockTransaction(): Transaction {
  const users = ['u_101', 'u_102', 'u_103', 'u_104', 'u_105', 'u_106', 'u_107', 'u_108', 'u_109', 'u_110'];
  const merchants = [
    { id: 'm_300', name: 'Amazon', category: 'ecommerce' },
    { id: 'm_301', name: 'Flipkart', category: 'ecommerce' },
    { id: 'm_302', name: 'Swiggy', category: 'food' },
    { id: 'm_303', name: 'Zomato', category: 'food' },
    { id: 'm_304', name: 'BookMyShow', category: 'entertainment' },
    { id: 'm_305', name: 'Uber', category: 'transport' },
  ];
  const methods: ('card' | 'upi' | 'bank_transfer')[] = ['card', 'upi', 'bank_transfer'];
  const countries = ['IN', 'IN', 'IN', 'IN', 'US', 'UK'];

  const userId = users[Math.floor(Math.random() * users.length)];
  const merchant = merchants[Math.floor(Math.random() * merchants.length)];
  const riskScore = Math.floor(Math.random() * 100);
  
  let status: Transaction['status'] = 'allowed';
  let action: Transaction['action'] = 'allow';
  
  if (riskScore >= 85) {
    status = 'blocked';
    action = 'block';
  } else if (riskScore >= 60) {
    status = 'on_hold';
    action = 'hold';
  } else if (riskScore >= 25) {
    status = 'allowed';
    action = 'challenge';
  }

  return {
    transaction_id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    timestamp: new Date().toISOString(),
    from_user_id: userId,
    amount: Math.floor(Math.random() * 50000) + 100,
    currency: 'INR',
    merchant_id: merchant.id,
    merchant_name: merchant.name,
    merchant_category: merchant.category,
    payment_method: methods[Math.floor(Math.random() * methods.length)],
    device_id: `dev_${Math.random().toString(36).substr(2, 6)}`,
    ip: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
    geo_country: countries[Math.floor(Math.random() * countries.length)],
    risk_score: riskScore,
    status,
    action,
    reasons: riskScore > 40 ? ['velocity_check', 'device_new'] : [],
    model_version: 'xgb_v2.1',
  };
}
