import { ref, readonly, computed, onMounted, onUnmounted } from 'vue';
import { TonConnectUI, type Wallet as TonWallet } from '@tonconnect/ui';
import type { Wallet } from '../types';

let tonConnectInstance: TonConnectUI | null = null;

export function useTonConnect() {
  const wallet = ref<Wallet | null>(null);
  const isConnecting = ref(false);
  const error = ref<string | null>(null);

  const isConnected = computed(() => !!wallet.value);

  const getConnector = () => {
    if (!tonConnectInstance) {
      tonConnectInstance = new TonConnectUI({
        manifestUrl: `${window.location.origin}/tonconnect-manifest.json`,
      });
    }
    return tonConnectInstance;
  };

  const updateWalletState = (tonWallet: TonWallet | null) => {
    if (tonWallet) {
      wallet.value = {
        address: tonWallet.account.address,
        publicKey: tonWallet.account.publicKey ?? '',
        chain: tonWallet.account.chain,
      };
    }
    else {
      wallet.value = null;
    }
  };

  const connect = async () => {
    try {
      isConnecting.value = true;
      error.value = null;
      const connector = getConnector();
      await connector.openModal();
    }
    catch (err) {
      error.value = err instanceof Error ? err.message : 'Ошибка подключения';
    }
    finally {
      isConnecting.value = false;
    }
  };

  const disconnect = async () => {
    try {
      const connector = getConnector();
      await connector.disconnect();
      wallet.value = null;
    }
    catch (err) {
      error.value = err instanceof Error ? err.message : 'Ошибка отключения';
    }
  };

  onMounted(() => {
    const connector = getConnector();

    // Восстановление сессии
    const currentWallet = connector.wallet;
    if (currentWallet) {
      updateWalletState(currentWallet);
    }

    // Подписка на изменения
    connector.onStatusChange((walletInfo) => {
      updateWalletState(walletInfo);
    });
  });

  onUnmounted(() => {
    // Не уничтожаем instance, он singleton
  });

  return {
    wallet: readonly(wallet),
    isConnected,
    isConnecting: readonly(isConnecting),
    error: readonly(error),
    connect,
    disconnect,
  };
}
