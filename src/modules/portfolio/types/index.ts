export interface PortfolioSnapshot {
  timestamp: number;
  valueUsd: string;
}

export interface Transaction {
  hash: string;
  type: 'in' | 'out' | 'swap';
  amount: string;
  symbol: string;
  timestamp: number;
  status: 'pending' | 'success' | 'failed';
  fee?: string;
  comment?: string;
}

export interface JettonBalance {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  balance: string;
  balanceUsd: string;
  price: string;
  change24h: number;
  imageUrl?: string;
}

export interface WalletData {
  address: string;
  tonBalance: string;
  tonBalanceUsd: string;
  jettons: JettonBalance[];
  totalUsd: string;
}

export interface PortfolioData {
  wallet: WalletData | null;
  history: PortfolioSnapshot[];
  transactions: Transaction[];
}

export interface PriceService {
  getWalletData: (address: string) => Promise<WalletData>;
  getTransactions: (address: string, limit?: number) => Promise<Transaction[]>;
  getPortfolioHistory: (address: string, days?: number) => Promise<PortfolioSnapshot[]>;
}
