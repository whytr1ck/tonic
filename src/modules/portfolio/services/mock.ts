import type { PriceService, WalletData, Transaction, PortfolioSnapshot } from '../types';

function generateMockHistory(days: number): PortfolioSnapshot[] {
  const now = Date.now();
  const history: PortfolioSnapshot[] = [];
  let baseValue = 1000 + Math.random() * 500;

  for (let i = days; i >= 0; i--) {
    const change = (Math.random() - 0.5) * 100;
    baseValue = Math.max(100, baseValue + change);
    history.push({
      timestamp: now - i * 24 * 60 * 60 * 1000,
      valueUsd: baseValue.toFixed(2),
    });
  }

  return history;
}

function generateMockTransactions(count: number): Transaction[] {
  const types = ['in', 'out', 'swap'] as const;
  const symbols = ['TON', 'USDT', 'NOT', 'DOGS'] as const;
  const transactions: Transaction[] = [];
  const now = Date.now();

  for (let i = 0; i < count; i++) {
    const typeIndex = Math.floor(Math.random() * types.length);
    const symbolIndex = Math.floor(Math.random() * symbols.length);
    transactions.push({
      hash: `mock_${Math.random().toString(36).substring(7)}`,
      type: types[typeIndex]!,
      amount: (Math.random() * 100).toFixed(2),
      symbol: symbols[symbolIndex]!,
      timestamp: now - i * 3600 * 1000 * Math.random() * 24,
      status: 'success',
      fee: (Math.random() * 0.1).toFixed(4),
    });
  }

  return transactions.sort((a, b) => b.timestamp - a.timestamp);
}

export const mockApi: PriceService = {
  async getWalletData(_address: string): Promise<WalletData> {
    // Имитация задержки сети
    await new Promise((resolve) => setTimeout(resolve, 500));

    return {
      address: _address,
      tonBalance: '125.50',
      tonBalanceUsd: '752.50',
      jettons: [
        {
          address: 'EQC..USDT',
          symbol: 'USDT',
          name: 'Tether USD',
          decimals: 6,
          balance: '500.00',
          balanceUsd: '500.00',
          price: '1.00',
          change24h: 0.01,
          imageUrl: 'https://cache.tonapi.io/imgproxy/usdt.webp',
        },
        {
          address: 'EQC..NOT',
          symbol: 'NOT',
          name: 'Notcoin',
          decimals: 9,
          balance: '10000.00',
          balanceUsd: '85.00',
          price: '0.0085',
          change24h: -2.5,
          imageUrl: 'https://cache.tonapi.io/imgproxy/not.webp',
        },
        {
          address: 'EQC..DOGS',
          symbol: 'DOGS',
          name: 'Dogs',
          decimals: 9,
          balance: '50000.00',
          balanceUsd: '45.00',
          price: '0.0009',
          change24h: 5.2,
          imageUrl: 'https://cache.tonapi.io/imgproxy/dogs.webp',
        },
      ],
      totalUsd: '1382.50',
    };
  },

  async getTransactions(_address: string, limit = 20): Promise<Transaction[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return generateMockTransactions(limit);
  },

  async getPortfolioHistory(_address: string, days = 30): Promise<PortfolioSnapshot[]> {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return generateMockHistory(days);
  },
};
