import { mockApi } from './mock';
import { tonapiClient } from './tonapi';
import type { PriceService } from '../types';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export const priceService: PriceService = USE_MOCK ? mockApi : tonapiClient;

export { mockApi, tonapiClient };
