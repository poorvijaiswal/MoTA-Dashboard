// src/lib/dataUtils.ts
// Utility functions for optimizing data processing in DSS Engine

export function memoize<T extends (...args: any[]) => any>(fn: T): T {
  const cache = new Map();
  
  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    
    timeout = setTimeout(() => {
      func(...args);
      timeout = null;
    }, wait);
  };
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Optimized array operations
export function fastFilter<T>(
  array: T[],
  predicate: (item: T, index: number) => boolean
): T[] {
  const result: T[] = [];
  for (let i = 0; i < array.length; i++) {
    if (predicate(array[i], i)) {
      result.push(array[i]);
    }
  }
  return result;
}

export function fastMap<T, U>(
  array: T[],
  mapper: (item: T, index: number) => U
): U[] {
  const result: U[] = new Array(array.length);
  for (let i = 0; i < array.length; i++) {
    result[i] = mapper(array[i], i);
  }
  return result;
}

// Batch processing for large datasets
export function batchProcess<T, U>(
  array: T[],
  processor: (batch: T[]) => U[],
  batchSize: number = 100
): U[] {
  const result: U[] = [];
  
  for (let i = 0; i < array.length; i += batchSize) {
    const batch = array.slice(i, i + batchSize);
    const batchResult = processor(batch);
    result.push(...batchResult);
  }
  
  return result;
}

// Memory-efficient data operations
export function* lazyFilter<T>(
  array: T[],
  predicate: (item: T) => boolean
): Generator<T, void, unknown> {
  for (const item of array) {
    if (predicate(item)) {
      yield item;
    }
  }
}

export function* lazyMap<T, U>(
  array: T[],
  mapper: (item: T) => U
): Generator<U, void, unknown> {
  for (const item of array) {
    yield mapper(item);
  }
}

// Performance monitoring
export function measurePerformance<T>(
  name: string,
  fn: () => T
): T {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  
  console.log(`${name} took ${(end - start).toFixed(2)} milliseconds`);
  return result;
}

// Data validation helpers
export function isValidClaim(claim: any): boolean {
  return (
    claim &&
    typeof claim === 'object' &&
    typeof claim.id === 'string' &&
    claim.id.length > 0
  );
}

export function isValidScheme(scheme: any): boolean {
  return (
    scheme &&
    typeof scheme === 'object' &&
    typeof scheme.id === 'string' &&
    typeof scheme.name === 'string' &&
    scheme.id.length > 0 &&
    scheme.name.length > 0
  );
}

// Cache management
export class DataCache {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  
  set(key: string, data: any, ttl: number = 5 * 60 * 1000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }
  
  get(key: string): any | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data;
  }
  
  clear(): void {
    this.cache.clear();
  }
  
  size(): number {
    return this.cache.size;
  }
}

// Global cache instance
export const globalCache = new DataCache();