import type { PriceService, WalletData, Transaction, PortfolioSnapshot } from '../types';

const TONAPI_BASE = 'https://tonapi.io/v2';

function getApiKey(): string {
  return import.meta.env.VITE_TONAPI_KEY || '';
}

function getHeaders(): HeadersInit {
  const apiKey = getApiKey();
  return apiKey ? { Authorization: `Bearer ${apiKey}` } : {};
}

export const tonapiClient: PriceService = {
  async getWalletData(address: string): Promise<WalletData> {
    const [accountRes, jettonsRes] = await Promise.all([
      fetch(`${TONAPI_BASE}/accounts/${address}`, { headers: getHeaders() }),
      fetch(`${TONAPI_BASE}/accounts/${address}/jettons`, { headers: getHeaders() }),
    ]);

    if (!accountRes.ok || !jettonsRes.ok) {
      throw new Error('Не удалось получить данные кошелька');
    }

    const account = await accountRes.json();
    const jettonsData = await jettonsRes.json();

    const tonBalance = (Number(account.balance) / 1e9).toFixed(2);
    // TODO: получить актуальную цену TON
    const tonPrice = 6.0;
    const tonBalanceUsd = (Number(tonBalance) * tonPrice).toFixed(2);

    const jettons = (jettonsData.balances || []).map((j: any) => ({
      address: j.jetton.address,
      symbol: j.jetton.symbol || 'Unknown',
      name: j.jetton.name || 'Unknown Token',
      decimals: j.jetton.decimals || 9,
      balance: (Number(j.balance) / Math.pow(10, j.jetton.decimals || 9)).toFixed(2),
      balanceUsd: '0.00', // TODO: получить цены jettons
      price: '0.00',
      change24h: 0,
      imageUrl: j.jetton.image,
    }));

    const totalUsd = (
      Number(tonBalanceUsd) + jettons.reduce((sum: number, j: any) => sum + Number(j.balanceUsd), 0)
    ).toFixed(2);

    return {
      address,
      tonBalance,
      tonBalanceUsd,
      jettons,
      totalUsd,
    };
  },

  async getTransactions(address: string, limit = 20): Promise<Transaction[]> {
    const res = await fetch(
      `${TONAPI_BASE}/accounts/${address}/events?limit=${limit}`,
      { headers: getHeaders() }
    );

    if (!res.ok) {
      throw new Error('Не удалось получить транзакции');
    }

    const data = await res.json();

    return (data.events || []).map((event: any) => {
      const action = event.actions?.[0] || {};
      let type: Transaction['type'] = 'out';
      let amount = '0';
      let symbol = 'TON';

      if (action.type === 'TonTransfer') {
        type = action.TonTransfer?.recipient?.address === address ? 'in' : 'out';
        amount = (Number(action.TonTransfer?.amount || 0) / 1e9).toFixed(2);
        symbol = 'TON';
      }
      else if (action.type === 'JettonTransfer') {
        type = action.JettonTransfer?.recipient?.address === address ? 'in' : 'out';
        amount = action.JettonTransfer?.amount || '0';
        symbol = action.JettonTransfer?.jetton?.symbol || 'Token';
      }

      return {
        hash: event.event_id,
        type,
        amount,
        symbol,
        timestamp: event.timestamp * 1000,
        status: event.in_progress ? 'pending' : 'success',
        fee: (Number(event.fee || 0) / 1e9).toFixed(4),
      };
    });
  },

  async getPortfolioHistory(_address: string, _days = 30): Promise<PortfolioSnapshot[]> {
    // TONAPI не предоставляет исторические данные портфеля напрямую
    // Для продакшена нужен отдельный сервис или агрегация данных
    // Пока возвращаем пустой массив
    return [];
  },
};
