
export type TransactionStatus = "pending" | "on_hold" | "blocked" | "allowed";
export type RiskAction = "allow" | "challenge" | "hold" | "block";
export type PaymentMethod = "card" | "upi" | "bank_transfer";
export type AlertPriority = "high" | "medium" | "low";
export type UserRole = "admin" | "user";
export type KycLevel = "basic" | "verified" | "premium";

export interface User {
  id: string;
  email: string;
  password: string;
  displayName: string;
  role: UserRole;
  kycLevel: KycLevel;
  accountAge: number;
  balance: number;
  currency: string;
  bankAccount?: BankAccount;
  devices: Device[];
  lastLogin?: string;
  riskScore: number;
  transactionCount: number;
  createdAt: string;
}

export interface BankAccount {
  bankId: string;
  bankName: string;
  accountNumber: string;
  ifsc: string;
  holderName: string;
  verified: boolean;
}

export interface Device {
  id: string;
  name: string;
  type: string;
  lastUsed: string;
  trusted: boolean;
  ip: string;
  country: string;
}

export interface Transaction {
  transaction_id: string;
  timestamp: string;
  from_user_id: string;
  to_user_id?: string;
  to_upi?: string;
  amount: number;
  currency: string;
  merchant_id?: string;
  merchant_name?: string;
  merchant_category?: string;
  payment_method: PaymentMethod;
  device_id?: string;
  ip?: string;
  geo_country?: string;
  risk_score: number;
  status: TransactionStatus;
  action: RiskAction;
  reasons?: string[];
  hold_expires_at?: string;
  model_version?: string;
  shap_values?: ShapValue[];
}

export interface ShapValue {
  feature: string;
  value: number;
  impact: number;
}

export interface CreateTransactionReq {
  transaction_id?: string;
  timestamp: string;
  from_user_id: string;
  to_user_id?: string;
  to_upi?: string;
  amount: number;
  currency: "INR";
  merchant_id?: string;
  payment_method: PaymentMethod;
  device_id?: string;
  ip?: string;
  meta?: Record<string, unknown>;
}

export interface CreateTransactionRes {
  transaction_id: string;
  status: TransactionStatus;
  risk_score: number;
  action: RiskAction;
  reasons?: string[];
  hold_expires_at?: string;
  model_version?: string;
}

export interface Alert {
  id: string;
  transaction_id: string;
  user_id: string;
  priority: AlertPriority;
  type: string;
  message: string;
  timestamp: string;
  resolved: boolean;
  resolvedBy?: string;
  resolvedAt?: string;
  falsePositive?: boolean;
}

export interface GraphNode {
  id: string;
  label: string;
  type: "user" | "merchant" | "device" | "ip" | "account";
  risk_score: number;
  x?: number;
  y?: number;
}

export interface GraphEdge {
  from: string;
  to: string;
  amount: number;
  timestamp: string;
  type?: string;
}

export interface GraphClusterRes {
  cluster_id: string;
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface ModelInsights {
  model_version: string;
  precision_at_k: number;
  recall: number;
  pr_auc: number;
  f1_score: number;
  accuracy: number;
  confusion_matrix: {
    true_positive: number;
    false_positive: number;
    true_negative: number;
    false_negative: number;
  };
  global_shap: Array<{ feature: string; importance: number }>;
  rules_version: string;
  last_trained: string;
}

export interface LoginRequest {
  email?: string;
  adminId?: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
  error?: string;
}

export interface AddBankRequest {
  user_id: string;
  bank_id: string;
  account_number: string;
  ifsc: string;
  holder_name: string;
}

export interface SimulateScenarioRequest {
  scenario: "card_testing" | "ato" | "mule_ring";
  intensity: number;
}

export interface WebSocketMessage {
  type: "transaction" | "alert_update" | "simulation_event";
  payload: Transaction | AlertUpdate | SimulationEvent;
}

export interface AlertUpdate {
  transaction_id: string;
  new_status: TransactionStatus;
  action_taken: string;
  hold_expires_at?: string;
  model_version: string;
  shap_top: ShapValue[];
}

export interface SimulationEvent {
  scenario: string;
  event_type: string;
  message: string;
  timestamp: string;
}

export interface KpiMetrics {
  activeTxPerSecond: number;
  openAlertsHigh: number;
  openAlertsMedium: number;
  openAlertsLow: number;
  confirmedFraudsToday: number;
  avgRiskScore: number;
  totalTransactionsToday: number;
  blockedAmount: number;
}

export interface AnalyticsData {
  alertsOverTime: Array<{ date: string; high: number; medium: number; low: number }>;
  alertsBySeverity: Array<{ severity: string; count: number }>;
  geoDistribution: Array<{ country: string; count: number; fraudRate: number }>;
  riskDistribution: Array<{ range: string; count: number }>;
  hourlyPattern: Array<{ hour: number; transactions: number; frauds: number }>;
}

export interface AppSettings {
  apiBaseUrl: string;
  wsUrl: string;
  mockMode: boolean;
  holdTimerSeconds: number;
  thresholds: {
    allow: number;
    challenge: number;
    hold: number;
    block: number;
  };
}
