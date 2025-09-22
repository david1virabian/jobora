// Mock Redis for SQLite development mode
import { logger } from '@/utils/logger';

class MockRedis {
  private store = new Map<string, string>();

  async ping(): Promise<string> {
    return 'PONG';
  }

  async get(key: string): Promise<string | null> {
    return this.store.get(key) || null;
  }

  async set(key: string, value: string, ...args: any[]): Promise<'OK'> {
    this.store.set(key, value);
    return 'OK';
  }

  async del(key: string): Promise<number> {
    const existed = this.store.has(key);
    this.store.delete(key);
    return existed ? 1 : 0;
  }

  async exists(key: string): Promise<number> {
    return this.store.has(key) ? 1 : 0;
  }

  async expire(key: string, seconds: number): Promise<number> {
    // Mock implementation - in real Redis this sets TTL
    setTimeout(() => {
      this.store.delete(key);
    }, seconds * 1000);
    return 1;
  }

  disconnect(): void {
    this.store.clear();
    logger.info('Mock Redis disconnected');
  }

  on(event: string, callback: Function): void {
    if (event === 'connect') {
      setTimeout(callback, 10);
    } else if (event === 'error') {
      // Don't emit errors for mock
    }
  }
}

const redis = process.env.USE_SQLITE === 'true' ? new MockRedis() : require('./redis').default;

export default redis;