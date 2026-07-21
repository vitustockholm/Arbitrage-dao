import { PairState } from "./types";

/**
 * Cache entry with timestamp for TTL management
 */
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

/**
 * In-memory cache for pair reserves with configurable TTL
 * Prevents repeated RPC calls and stale data issues
 */
export class ReserveCache {
  private cache = new Map<string, CacheEntry<PairState>>();
  private readonly ttlMs: number;
  private stats = {
    hits: 0,
    misses: 0,
    evictions: 0,
    totalEntries: 0,
  };

  constructor(ttlSeconds = 60) {
    this.ttlMs = ttlSeconds * 1000;
    // Cleanup stale entries every 30 seconds
    this.startCleanupInterval();
  }

  /**
   * Get cached pair state if valid
   */
  get(pairAddress: string): PairState | null {
    const entry = this.cache.get(pairAddress.toLowerCase());

    if (!entry) {
      this.stats.misses++;
      return null;
    }

    const age = Date.now() - entry.timestamp;
    if (age > this.ttlMs) {
      // Stale entry - remove and return null
      this.cache.delete(pairAddress.toLowerCase());
      this.stats.evictions++;
      this.stats.misses++;
      return null;
    }

    this.stats.hits++;
    return entry.data;
  }

  /**
   * Set cached pair state
   */
  set(pairAddress: string, data: PairState): void {
    this.cache.set(pairAddress.toLowerCase(), {
      data,
      timestamp: Date.now(),
    });
    this.stats.totalEntries = this.cache.size;
  }

  /**
   * Check if entry exists and is valid
   */
  has(pairAddress: string): boolean {
    return this.get(pairAddress.toLowerCase()) !== null;
  }

  /**
   * Clear entire cache
   */
  clear(): void {
    this.cache.clear();
    this.stats.totalEntries = 0;
  }

  /**
   * Remove specific entry
   */
  delete(pairAddress: string): boolean {
    return this.cache.delete(pairAddress.toLowerCase());
  }

  /**
   * Get cache statistics
   */
  getStats() {
    const hitRate =
      this.stats.hits + this.stats.misses > 0
        ? ((this.stats.hits / (this.stats.hits + this.stats.misses)) * 100).toFixed(2)
        : "0.00";

    return {
      ...this.stats,
      hitRate: `${hitRate}%`,
      size: this.cache.size,
    };
  }

  /**
   * Get all cached entries
   */
  getAll(): Map<string, PairState> {
    const result = new Map<string, PairState>();
    this.cache.forEach((entry, key) => {
      const age = Date.now() - entry.timestamp;
      if (age <= this.ttlMs) {
        result.set(key, entry.data);
      }
    });
    return result;
  }

  /**
   * Periodic cleanup of stale entries
   */
  private startCleanupInterval(): void {
    setInterval(() => {
      const now = Date.now();
      let removed = 0;

      for (const [key, entry] of this.cache.entries()) {
        if (now - entry.timestamp > this.ttlMs) {
          this.cache.delete(key);
          removed++;
        }
      }

      if (removed > 0) {
        this.stats.evictions += removed;
        this.stats.totalEntries = this.cache.size;
      }
    }, 30000); // Run every 30 seconds
  }

  /**
   * Reset statistics
   */
  resetStats(): void {
    this.stats = {
      hits: 0,
      misses: 0,
      evictions: 0,
      totalEntries: 0,
    };
  }
}

// Global singleton cache instance
export const globalReserveCache = new ReserveCache(60); // 60 second TTL
