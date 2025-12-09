import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Transaction, Alert, AppSettings, KpiMetrics } from '@/types/api';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  isAdmin: boolean;
  loginAttempts: number;
  lockedUntil: number | null;
}

interface AppState extends AuthState {
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  transactions: Transaction[];
  alerts: Alert[];
  kpiMetrics: KpiMetrics;
  wsConnected: boolean;
  simulationRunning: boolean;
  currentScenario: string | null;
  settings: AppSettings;
  
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  
  login: (user: User, token: string, isAdmin: boolean) => void;
  logout: () => void;
  incrementLoginAttempts: () => void;
  resetLoginAttempts: () => void;
  lockAccount: () => void;
  
  addTransaction: (tx: Transaction) => void;
  updateTransaction: (txId: string, updates: Partial<Transaction>) => void;
  setTransactions: (txs: Transaction[]) => void;
  
  addAlert: (alert: Alert) => void;
  updateAlert: (alertId: string, updates: Partial<Alert>) => void;
  setAlerts: (alerts: Alert[]) => void;
  
  setKpiMetrics: (metrics: KpiMetrics) => void;
  setWsConnected: (connected: boolean) => void;
  
  startSimulation: (scenario: string) => void;
  stopSimulation: () => void;
  
  updateSettings: (settings: Partial<AppSettings>) => void;
}

const defaultSettings: AppSettings = {
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
};

const defaultKpiMetrics: KpiMetrics = {
  activeTxPerSecond: 0,
  openAlertsHigh: 0,
  openAlertsMedium: 0,
  openAlertsLow: 0,
  confirmedFraudsToday: 0,
  avgRiskScore: 0,
  totalTransactionsToday: 0,
  blockedAmount: 0,
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      sidebarOpen: false,
      isAuthenticated: false,
      user: null,
      token: null,
      isAdmin: false,
      loginAttempts: 0,
      lockedUntil: null,
      transactions: [],
      alerts: [],
      kpiMetrics: defaultKpiMetrics,
      wsConnected: false,
      simulationRunning: false,
      currentScenario: null,
      settings: defaultSettings,

      setTheme: (theme) => {
        set({ theme });
        if (typeof document !== 'undefined') {
          document.documentElement.classList.toggle('dark', theme === 'dark');
        }
      },
      
      toggleTheme: () => {
        const newTheme = get().theme === 'dark' ? 'light' : 'dark';
        get().setTheme(newTheme);
      },

      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

      login: (user, token, isAdmin) => set({
        isAuthenticated: true,
        user,
        token,
        isAdmin,
        loginAttempts: 0,
        lockedUntil: null,
      }),

      logout: () => set({
        isAuthenticated: false,
        user: null,
        token: null,
        isAdmin: false,
      }),

      incrementLoginAttempts: () => set((state) => ({
        loginAttempts: state.loginAttempts + 1,
      })),

      resetLoginAttempts: () => set({ loginAttempts: 0, lockedUntil: null }),

      lockAccount: () => set({
        lockedUntil: Date.now() + 5 * 60 * 1000,
      }),

      addTransaction: (tx) => set((state) => ({
        transactions: [tx, ...state.transactions].slice(0, 200),
      })),

      updateTransaction: (txId, updates) => set((state) => ({
        transactions: state.transactions.map((tx) =>
          tx.transaction_id === txId ? { ...tx, ...updates } : tx
        ),
      })),

      setTransactions: (transactions) => set({ transactions }),

      addAlert: (alert) => set((state) => ({
        alerts: [alert, ...state.alerts],
      })),

      updateAlert: (alertId, updates) => set((state) => ({
        alerts: state.alerts.map((a) =>
          a.id === alertId ? { ...a, ...updates } : a
        ),
      })),

      setAlerts: (alerts) => set({ alerts }),

      setKpiMetrics: (metrics) => set({ kpiMetrics: metrics }),
      setWsConnected: (connected) => set({ wsConnected: connected }),

      startSimulation: (scenario) => set({
        simulationRunning: true,
        currentScenario: scenario,
      }),

      stopSimulation: () => set({
        simulationRunning: false,
        currentScenario: null,
      }),

      updateSettings: (newSettings) => set((state) => ({
        settings: { ...state.settings, ...newSettings },
      })),
    }),
    {
      name: 'aegispay-storage',
      partialize: (state) => ({
        theme: state.theme,
        settings: state.settings,
      }),
    }
  )
);
