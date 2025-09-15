import { useState, useEffect, useRef } from 'react';

// Simple in-memory cache with TTL (Time To Live)
class CacheManager {
  constructor() {
    this.cache = new Map();
    this.timers = new Map();
  }

  set(key, data, ttl = 300000) { // Default 5 minutes TTL
    // Clear existing timer if any
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key));
    }

    // Set data with timestamp
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });

    // Set expiration timer
    const timer = setTimeout(() => {
      this.delete(key);
    }, ttl);

    this.timers.set(key, timer);
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;

    // Check if expired
    if (Date.now() - item.timestamp > item.ttl) {
      this.delete(key);
      return null;
    }

    return item.data;
  }

  delete(key) {
    this.cache.delete(key);
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key));
      this.timers.delete(key);
    }
  }

  clear() {
    this.timers.forEach(timer => clearTimeout(timer));
    this.cache.clear();
    this.timers.clear();
  }

  has(key) {
    return this.cache.has(key) && this.get(key) !== null;
  }
}

// Global cache instance
const globalCache = new CacheManager();

// Custom hook for caching API calls
export const useCache = (key, fetchFunction, options = {}) => {
  const {
    ttl = 300000, // 5 minutes default
    enabled = true,
    refetchOnMount = false,
    staleWhileRevalidate = false
  } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastFetch, setLastFetch] = useState(null);
  const fetchRef = useRef(fetchFunction);
  const mountedRef = useRef(true);

  // Update fetch function ref
  useEffect(() => {
    fetchRef.current = fetchFunction;
  }, [fetchFunction]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const fetchData = async (forceRefresh = false) => {
    if (!enabled) return;

    const cacheKey = typeof key === 'function' ? key() : key;
    
    // Check cache first (unless force refresh)
    if (!forceRefresh) {
      const cachedData = globalCache.get(cacheKey);
      if (cachedData) {
        setData(cachedData);
        setError(null);
        return cachedData;
      }
    }

    // If stale-while-revalidate and we have stale data, return it immediately
    if (staleWhileRevalidate && data && !forceRefresh) {
      // Continue with background fetch but return stale data
      fetchInBackground(cacheKey);
      return data;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await fetchRef.current();
      
      if (mountedRef.current) {
        setData(result);
        setLastFetch(Date.now());
        
        // Cache the result
        globalCache.set(cacheKey, result, ttl);
      }
      
      return result;
    } catch (err) {
      if (mountedRef.current) {
        setError(err);
        console.error(`Cache fetch error for key ${cacheKey}:`, err);
      }
      throw err;
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  };

  const fetchInBackground = async (cacheKey) => {
    try {
      const result = await fetchRef.current();
      if (mountedRef.current) {
        setData(result);
        setLastFetch(Date.now());
        globalCache.set(cacheKey, result, ttl);
      }
    } catch (err) {
      console.error(`Background fetch error for key ${cacheKey}:`, err);
    }
  };

  // Initial fetch
  useEffect(() => {
    if (enabled && (refetchOnMount || !data)) {
      fetchData();
    }
  }, [key, enabled, refetchOnMount]);

  const invalidate = () => {
    const cacheKey = typeof key === 'function' ? key() : key;
    globalCache.delete(cacheKey);
  };

  const refetch = () => fetchData(true);

  return {
    data,
    loading,
    error,
    refetch,
    invalidate,
    lastFetch,
    isStale: lastFetch && (Date.now() - lastFetch > ttl)
  };
};

// Hook for managing multiple cached queries
export const useCacheQueries = (queries) => {
  const results = queries.map(({ key, fetchFunction, options }) => 
    useCache(key, fetchFunction, options)
  );

  const loading = results.some(result => result.loading);
  const error = results.find(result => result.error)?.error;
  
  return {
    results,
    loading,
    error,
    refetchAll: () => results.forEach(result => result.refetch()),
    invalidateAll: () => results.forEach(result => result.invalidate())
  };
};

// Utility to prefetch data
export const prefetchData = (key, fetchFunction, ttl = 300000) => {
  const cacheKey = typeof key === 'function' ? key() : key;
  
  if (!globalCache.has(cacheKey)) {
    fetchFunction().then(data => {
      globalCache.set(cacheKey, data, ttl);
    }).catch(err => {
      console.error(`Prefetch error for key ${cacheKey}:`, err);
    });
  }
};

// Clear all cache
export const clearCache = () => {
  globalCache.clear();
};

export default useCache;
