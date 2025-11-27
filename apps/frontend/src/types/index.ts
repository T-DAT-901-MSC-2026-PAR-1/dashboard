/**
 * Type definitions for the CryptoViz Dashboard
 */

// Cryptocurrency Types
export interface CryptoPair {
  crypto: string;
  currency: string;
}

export interface CryptoPrice {
  symbol: string;
  price: number;
  timestamp: Date;
  change24h?: number;
  volume24h?: number;
}

export interface CryptoTrade {
  id: string;
  crypto: string;
  currency: string;
  price: number;
  quantity: number;
  total: number;
  timestamp: Date;
  type: 'BUY' | 'SELL';
}

export interface CandlestickData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

// Kafka Message Types
export interface KafkaMessage {
  timestamp: string;
  message_type: 'TRADE' | 'CURRENT' | 'AGGREGATE_INDEX';
  source: string;
  crypto: string;
  currency: string;
  price?: number;
  quantity?: number;
  total?: number;
  volume_24h?: number;
  open_24h?: number;
  high_24h?: number;
  low_24h?: number;
  raw: any;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
}

// Chart Types
export interface ChartTimeframe {
  label: string;
  value: '1m' | '5m' | '15m' | '1h' | '4h' | '1d' | '1w';
  interval: number; // in milliseconds
}

// UI State Types
export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

export interface LoadingState {
  isLoading: boolean;
  message?: string;
}

export interface ErrorState {
  hasError: boolean;
  error?: Error;
  message?: string;
}
