export interface Wallet {
  address: string;
  publicKey: string;
  chain: string;
}

export interface Jetton {
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

export interface WalletBalance {
  ton: string;
  tonUsd: string;
  jettons: Jetton[];
  totalUsd: string;
}
