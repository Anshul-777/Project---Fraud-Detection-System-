import { useState } from 'react';
import { motion } from 'framer-motion';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import mockGraphData from '@/mocks/mock_graph.json';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Brain, RefreshCw, CheckCircle, Clock, Target, Percent } from 'lucide-react';

export default function AdminModel() {
  const { modelInsights } = mockGraphData;
  const [isRetraining, setIsRetraining] = useState(false);
  const [retrainProgress, setRetrainProgress] = useState(0);

  const handleRetrain = async () => {
    setIsRetraining(true);
    setRetrainProgress(0);

    for (let i = 0; i <= 100; i += 5) {
      await new Promise((r) => setTimeout(r, 200));
      setRetrainProgress(i);
    }

    setIsRetraining(false);
  };

  const metrics = [
    { label: 'Precision @ K', value: modelInsights.precision_at_k, icon: Target },
    { label: 'Recall', value: modelInsights.recall, icon: CheckCircle },
    { label: 'PR-AUC', value: modelInsights.pr_auc, icon: Percent },
    { label: 'F1 Score', value: modelInsights.f1_score, icon: Brain },
  ];

  const confusionMatrix = modelInsights.confusion_matrix;
  const total = confusionMatrix.true_positive + confusionMatrix.false_positive + 
                confusionMatrix.true_negative + confusionMatrix.false_negative;

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Model Insights</h1>
            <p className="text-muted-foreground">
              Performance metrics and feature importance analysis
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono">
              {modelInsights.model_version}
            </Badge>
            <Button
              onClick={handleRetrain}
              disabled={isRetraining}
              data-testid="button-retrain"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRetraining ? 'animate-spin' : ''}`} />
              {isRetraining ? 'Retraining...' : 'Simulate Retrain'}
            </Button>
          </div>
        </div>

        {isRetraining && (
          <Card className="border-primary/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Training Progress</span>
                <span className="text-sm text-muted-foreground">{retrainProgress}%</span>
              </div>
              <Progress value={retrainProgress} className="h-2" />
            </CardContent>
          </Card>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric, i) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <metric.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{(metric.value * 100).toFixed(1)}%</p>
                      <p className="text-xs text-muted-foreground">{metric.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Global SHAP Feature Importance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={modelInsights.global_shap}
                    layout="vertical"
                    margin={{ left: 100 }}
                  >
                    <XAxis type="number" tick={{ fontSize: 12 }} />
                    <YAxis
                      dataKey="feature"
                      type="category"
                      tick={{ fontSize: 11 }}
                      width={100}
                      tickFormatter={(v) => v.replace(/_/g, ' ')}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                      formatter={(value: number) => [`${(value * 100).toFixed(1)}%`, 'Importance']}
                    />
                    <Bar dataKey="importance" radius={[0, 4, 4, 0]}>
                      {modelInsights.global_shap.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={`hsl(${158 + index * 15}, 64%, ${32 + index * 3}%)`}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Confusion Matrix</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-center">
                  <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                    {confusionMatrix.true_positive}
                  </p>
                  <p className="text-sm text-muted-foreground">True Positive</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {((confusionMatrix.true_positive / total) * 100).toFixed(1)}%
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-center">
                  <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                    {confusionMatrix.false_positive}
                  </p>
                  <p className="text-sm text-muted-foreground">False Positive</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {((confusionMatrix.false_positive / total) * 100).toFixed(1)}%
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30 text-center">
                  <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                    {confusionMatrix.false_negative}
                  </p>
                  <p className="text-sm text-muted-foreground">False Negative</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {((confusionMatrix.false_negative / total) * 100).toFixed(1)}%
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30 text-center">
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {confusionMatrix.true_negative}
                  </p>
                  <p className="text-sm text-muted-foreground">True Negative</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {((confusionMatrix.true_negative / total) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Accuracy</span>
                  <span className="font-mono">{(modelInsights.accuracy * 100).toFixed(2)}%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Model Version</span>
                  <Badge variant="outline" className="font-mono">{modelInsights.model_version}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Rules Version</span>
                  <Badge variant="outline" className="font-mono">{modelInsights.rules_version}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Last Trained</span>
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {new Date(modelInsights.last_trained).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
