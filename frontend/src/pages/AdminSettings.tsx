import { useState } from 'react';
import { motion } from 'framer-motion';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/stores/appStore';
import { useToast } from '@/hooks/use-toast';
import {
  Settings as SettingsIcon,
  Globe,
  Clock,
  Sliders,
  Save,
  RotateCcw,
  Download,
} from 'lucide-react';

export default function AdminSettings() {
  const { settings, updateSettings } = useAppStore();
  const { toast } = useToast();

  const [localSettings, setLocalSettings] = useState(settings);

  const handleSave = () => {
    updateSettings(localSettings);
    toast({
      title: 'Settings saved',
      description: 'Your configuration has been updated successfully.',
    });
  };

  const handleReset = () => {
    setLocalSettings({
      apiBaseUrl: '/api',
      wsUrl: '',
      mockMode: true,
      holdTimerSeconds: 180,
      thresholds: {
        allow: 25,
        challenge: 60,
        hold: 85,
        block: 100,
      },
    });
  };

  const handleExportLogs = () => {
    const logData = {
      exportedAt: new Date().toISOString(),
      settings: localSettings,
      transactions: 'mock_export',
    };
    const blob = new Blob([JSON.stringify(logData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aegispay-logs-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-muted-foreground">
              Configure API endpoints, thresholds, and system behavior
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleReset} data-testid="button-reset-settings">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button onClick={handleSave} data-testid="button-save-settings">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Globe className="h-5 w-5" />
                API Configuration
              </CardTitle>
              <CardDescription>
                Configure endpoints for production integration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="apiBaseUrl">API Base URL</Label>
                <Input
                  id="apiBaseUrl"
                  value={localSettings.apiBaseUrl}
                  onChange={(e) =>
                    setLocalSettings({ ...localSettings, apiBaseUrl: e.target.value })
                  }
                  placeholder="https://api.aegispay.com"
                  data-testid="input-api-base-url"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="wsUrl">WebSocket URL</Label>
                <Input
                  id="wsUrl"
                  value={localSettings.wsUrl}
                  onChange={(e) =>
                    setLocalSettings({ ...localSettings, wsUrl: e.target.value })
                  }
                  placeholder="wss://ws.aegispay.com"
                  data-testid="input-ws-url"
                />
              </div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <Label>Mock Mode</Label>
                  <p className="text-xs text-muted-foreground">
                    Use local mock data instead of real API
                  </p>
                </div>
                <Switch
                  checked={localSettings.mockMode}
                  onCheckedChange={(checked) =>
                    setLocalSettings({ ...localSettings, mockMode: checked })
                  }
                  data-testid="switch-mock-mode"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Timer Configuration
              </CardTitle>
              <CardDescription>
                Configure hold and verification timers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Hold Timer Duration</Label>
                  <Badge variant="outline">{localSettings.holdTimerSeconds}s</Badge>
                </div>
                <Slider
                  value={[localSettings.holdTimerSeconds]}
                  onValueChange={([value]) =>
                    setLocalSettings({ ...localSettings, holdTimerSeconds: value })
                  }
                  min={60}
                  max={300}
                  step={30}
                  data-testid="slider-hold-timer"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>1 min</span>
                  <span>5 min</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Sliders className="h-5 w-5" />
                Risk Thresholds
              </CardTitle>
              <CardDescription>
                Configure action thresholds based on risk score
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-emerald-500">Allow Threshold</Label>
                    <Badge variant="outline" className="border-emerald-500 text-emerald-500">
                      0 - {localSettings.thresholds.allow}
                    </Badge>
                  </div>
                  <Slider
                    value={[localSettings.thresholds.allow]}
                    onValueChange={([value]) =>
                      setLocalSettings({
                        ...localSettings,
                        thresholds: { ...localSettings.thresholds, allow: value },
                      })
                    }
                    min={10}
                    max={40}
                    step={5}
                    data-testid="slider-threshold-allow"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Transactions below this score are auto-approved
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-amber-500">Challenge Threshold</Label>
                    <Badge variant="outline" className="border-amber-500 text-amber-500">
                      {localSettings.thresholds.allow} - {localSettings.thresholds.challenge}
                    </Badge>
                  </div>
                  <Slider
                    value={[localSettings.thresholds.challenge]}
                    onValueChange={([value]) =>
                      setLocalSettings({
                        ...localSettings,
                        thresholds: { ...localSettings.thresholds, challenge: value },
                      })
                    }
                    min={40}
                    max={70}
                    step={5}
                    data-testid="slider-threshold-challenge"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Requires OTP or Platform PIN verification
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-orange-500">Hold Threshold</Label>
                    <Badge variant="outline" className="border-orange-500 text-orange-500">
                      {localSettings.thresholds.challenge} - {localSettings.thresholds.hold}
                    </Badge>
                  </div>
                  <Slider
                    value={[localSettings.thresholds.hold]}
                    onValueChange={([value]) =>
                      setLocalSettings({
                        ...localSettings,
                        thresholds: { ...localSettings.thresholds, hold: value },
                      })
                    }
                    min={70}
                    max={95}
                    step={5}
                    data-testid="slider-threshold-hold"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Temporary hold with admin review
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-red-500">Block Threshold</Label>
                    <Badge variant="outline" className="border-red-500 text-red-500">
                      {localSettings.thresholds.hold}+
                    </Badge>
                  </div>
                  <div className="h-5 flex items-center">
                    <span className="text-sm text-muted-foreground">
                      Scores {`≥`} {localSettings.thresholds.hold} are auto-blocked
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Requires Platform PIN or admin override
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Download className="h-5 w-5" />
                Data Export
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Export System Logs</p>
                  <p className="text-sm text-muted-foreground">
                    Download configuration and transaction logs
                  </p>
                </div>
                <Button variant="outline" onClick={handleExportLogs} data-testid="button-export-logs">
                  <Download className="h-4 w-4 mr-2" />
                  Export JSON
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
