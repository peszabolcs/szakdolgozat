import localforage from 'localforage';

const CACHE_KEYS = {
  PARKING_SPACES: 'parking_spaces',
  AREAS: 'areas',
  DASHBOARD_STATS: 'dashboard_stats',
  FAVORITES: 'favorites',
  HISTORY: 'parking_history',
} as const;

localforage.config({
  name: 'ParkVision',
  storeName: 'parkvision_cache',
  description: 'Offline data cache for ParkVision app',
});

export const offlineStore = {
  async get<T>(key: string): Promise<T | null> {
    try {
      return await localforage.getItem<T>(key);
    } catch (error) {
      console.error('Error reading from offline store:', error);
      return null;
    }
  },

  async set<T>(key: string, value: T): Promise<void> {
    try {
      await localforage.setItem(key, value);
    } catch (error) {
      console.error('Error writing to offline store:', error);
    }
  },

  async remove(key: string): Promise<void> {
    try {
      await localforage.removeItem(key);
    } catch (error) {
      console.error('Error removing from offline store:', error);
    }
  },

  async clear(): Promise<void> {
    try {
      await localforage.clear();
    } catch (error) {
      console.error('Error clearing offline store:', error);
    }
  },

  keys: CACHE_KEYS,
};
