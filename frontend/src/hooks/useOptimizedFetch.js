import { useState, useEffect, useCallback, useRef } from 'react';
import { useCache } from './useCache';

// Debounce hook for search inputs
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Optimized fetch hook with debouncing, caching, and pagination
export const useOptimizedFetch = (
  fetchFunction,
  dependencies = [],
  options = {}
) => {
  const {
    debounceDelay = 300,
    cacheKey,
    cacheTTL = 300000,
    enableCache = true,
    pagination = false,
    pageSize = 20,
    searchTerm = '',
    filters = {}
  } = options;

  const [data, setData] = useState(pagination ? { items: [], total: 0, page: 1 } : null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  const debouncedSearchTerm = useDebounce(searchTerm, debounceDelay);
  const abortControllerRef = useRef(null);
  const mountedRef = useRef(true);

  // Generate cache key based on parameters
  const generateCacheKey = useCallback(() => {
    if (!cacheKey) return null;
    const params = {
      search: debouncedSearchTerm,
      filters,
      page: pagination ? page : 1,
      pageSize
    };
    return `${cacheKey}-${JSON.stringify(params)}`;
  }, [cacheKey, debouncedSearchTerm, filters, page, pageSize, pagination]);

  // Cache hook (only if caching is enabled)
  const cacheResult = useCache(
    generateCacheKey,
    fetchFunction,
    {
      ttl: cacheTTL,
      enabled: enableCache && !!cacheKey,
      staleWhileRevalidate: true
    }
  );

  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const fetchData = useCallback(async (resetPagination = false) => {
    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    
    // If using cache and data is available, return cached data
    if (enableCache && cacheResult.data && !resetPagination) {
      setData(cacheResult.data);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const currentPage = resetPagination ? 1 : page;
      
      const params = {
        search: debouncedSearchTerm,
        ...filters,
        page: currentPage,
        limit: pageSize,
        signal: abortControllerRef.current.signal
      };

      const result = await fetchFunction(params);
      
      if (!mountedRef.current) return;

      if (pagination) {
        const newData = {
          items: resetPagination ? result.items : [...(data?.items || []), ...result.items],
          total: result.total,
          page: currentPage
        };
        
        setData(newData);
        setHasMore(result.items.length === pageSize && newData.items.length < result.total);
        
        if (resetPagination) {
          setPage(1);
        }
      } else {
        setData(result);
      }

    } catch (err) {
      if (err.name !== 'AbortError' && mountedRef.current) {
        setError(err);
        console.error('Fetch error:', err);
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [fetchFunction, debouncedSearchTerm, filters, page, pageSize, pagination, data, enableCache, cacheResult.data]);

  // Reset data when search term or filters change
  useEffect(() => {
    if (pagination) {
      setPage(1);
      setData({ items: [], total: 0, page: 1 });
    }
    fetchData(true);
  }, [debouncedSearchTerm, JSON.stringify(filters)]);

  // Fetch data when dependencies change
  useEffect(() => {
    fetchData();
  }, dependencies);

  const loadMore = useCallback(() => {
    if (pagination && !loading && hasMore) {
      setPage(prev => prev + 1);
    }
  }, [pagination, loading, hasMore]);

  const refresh = useCallback(() => {
    if (enableCache && cacheResult.invalidate) {
      cacheResult.invalidate();
    }
    fetchData(true);
  }, [fetchData, enableCache, cacheResult]);

  return {
    data: enableCache && cacheResult.data ? cacheResult.data : data,
    loading: enableCache ? cacheResult.loading || loading : loading,
    error: enableCache && cacheResult.error ? cacheResult.error : error,
    refresh,
    loadMore,
    hasMore,
    page,
    isStale: enableCache ? cacheResult.isStale : false
  };
};

// Hook for optimized search with instant results
export const useOptimizedSearch = (searchFunction, options = {}) => {
  const {
    minSearchLength = 2,
    debounceDelay = 300,
    cacheResults = true
  } = options;

  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const debouncedSearchTerm = useDebounce(searchTerm, debounceDelay);
  const abortControllerRef = useRef(null);

  const performSearch = useCallback(async (term) => {
    if (term.length < minSearchLength) {
      setResults([]);
      setLoading(false);
      return;
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    setLoading(true);
    setError(null);

    try {
      const searchResults = await searchFunction(term, {
        signal: abortControllerRef.current.signal
      });
      
      setResults(searchResults);
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err);
        console.error('Search error:', err);
      }
    } finally {
      setLoading(false);
    }
  }, [searchFunction, minSearchLength]);

  useEffect(() => {
    performSearch(debouncedSearchTerm);
  }, [debouncedSearchTerm, performSearch]);

  const clearSearch = useCallback(() => {
    setSearchTerm('');
    setResults([]);
    setError(null);
  }, []);

  return {
    searchTerm,
    setSearchTerm,
    results,
    loading,
    error,
    clearSearch
  };
};

export default useOptimizedFetch;
