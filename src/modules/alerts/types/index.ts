export interface Alert {
  id: string;
  tokenAddress: string;
  tokenSymbol: string;
  type: 'above' | 'below';
  targetPrice: string;
  currentPrice: string;
  isActive: boolean;
  createdAt: number;
}

export interface AlertFormData {
  tokenAddress: string;
  tokenSymbol: string;
  type: 'above' | 'below';
  targetPrice: string;
}
