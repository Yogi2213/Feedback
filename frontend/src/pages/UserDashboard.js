import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { storesAPI, ratingsAPI } from '../services/api';
import { useOptimizedFetch } from '../hooks/useOptimizedFetch';
import { LoadingSpinner, SkeletonGrid, ErrorState, EmptyState } from '../components/LoadingStates';
import {
  Store,
  Star,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Clock,
  Users,
  TrendingUp,
  Award,
  Heart
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import FeedbackCard from '../components/FeedbackCard';
import toast from 'react-hot-toast';

const UserDashboard = () => {
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [ratingFilter, setRatingFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [pendingRatings, setPendingRatings] = useState({});

  // Optimized data fetching with caching and debouncing
  const fetchStores = async (params = {}) => {
    const response = await storesAPI.getStores({
      search: params.search || '',
      sortBy,
      sortOrder,
      page: params.page || 1,
      limit: params.limit || 20
    });
    
    if (response.data.success) {
      let stores = response.data.data.stores;
      
      // Apply rating filter
      if (ratingFilter) {
        const minRating = parseFloat(ratingFilter);
        stores = stores.filter(store => store.avgRating >= minRating);
      }
      
      return {
        items: stores,
        total: response.data.data.total || stores.length
      };
    }
    throw new Error('Failed to fetch stores');
  };

  const {
    data: storesData,
    loading,
    error,
    refresh,
    loadMore,
    hasMore
  } = useOptimizedFetch(
    fetchStores,
    [sortBy, sortOrder, ratingFilter],
    {
      cacheKey: 'user-stores',
      cacheTTL: 300000, // 5 minutes
      debounceDelay: 300,
      pagination: true,
      pageSize: 20,
      searchTerm,
      filters: { ratingFilter }
    }
  );

  const stores = storesData?.items || [];

  const handleRatingSubmit = async (storeId, rating, comment) => {
    try {
      const response = await ratingsAPI.createRating({
        storeId,
        rating,
        comment
      });
      
      if (response.data.success) {
        toast.success('Rating submitted successfully!');
        // Clear pending ratings for this store
        setPendingRatings(prev => {
          const updated = { ...prev };
          delete updated[storeId];
          return updated;
        });
        refresh(); // Refresh stores to update ratings
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit rating');
    }
  };

  const renderStars = (rating, interactive = false, onStarClick = null) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={interactive ? () => onStarClick(star) : undefined}
            className={`${
              interactive 
                ? 'hover:scale-110 transition-transform cursor-pointer' 
                : 'cursor-default'
            }`}
            disabled={!interactive}
          >
            <Star
              className={`w-5 h-5 ${
                star <= rating
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-100 dark:from-gray-900 dark:via-slate-800 dark:to-green-900 bg-animated">
        <div className="container py-8">
          <ErrorState 
            title="Failed to load stores"
            message="Unable to fetch store data. Please check your connection and try again."
            onRetry={refresh}
          />
        </div>
      </div>
    );
  }

  // Show loading skeleton on initial load
  if (loading && !stores.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-100 dark:from-gray-900 dark:via-slate-800 dark:to-green-900 bg-animated">
        <div className="container py-8">
          <div className="text-center mb-16">
            <LoadingSpinner size="lg" text="Loading amazing stores for you..." />
          </div>
          <SkeletonGrid count={6} columns={3} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-green-100 dark:from-black dark:via-pink-950 dark:to-black font-inter relative overflow-hidden">
      {/* Enhanced Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-32 w-96 h-96 bg-gradient-to-br from-green-400/20 to-green-600/20 dark:from-pink-400/20 dark:to-pink-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-gradient-to-br from-green-300/20 to-green-500/20 dark:from-pink-500/20 dark:to-pink-700/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-br from-emerald-400/25 to-cyan-600/25 rounded-full blur-3xl animate-pulse delay-500"></div>
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-full blur-2xl animate-bounce"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-br from-green-400/20 to-teal-500/20 rounded-full blur-2xl animate-bounce delay-700"></div>
        {/* Floating particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-green-400 rounded-full animate-ping delay-300"></div>
        <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-purple-400 rounded-full animate-ping delay-1000"></div>
        <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-pink-400 rounded-full animate-ping delay-500"></div>
      </div>

      <div className="relative container py-8">
        {/* Enhanced Header with Hero Section */}
        <div className="text-center mb-16 relative">
          <div className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-500/15 to-green-600/15 dark:from-pink-500/20 dark:to-pink-600/20 rounded-full mb-8 border border-green-200/60 dark:border-pink-400/40 backdrop-blur-md shadow-lg hover:shadow-xl transition-all duration-300 group">
            <Star className="w-6 h-6 text-green-600 dark:text-green-400 animate-pulse group-hover:animate-spin" />
            <span className="text-base font-bold text-green-700 dark:text-pink-300 tracking-wide">🌟 Store Discovery Platform</span>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          </div>
          
          <div className="relative mb-6">
            <h1 className="text-6xl md:text-7xl font-black text-gradient mb-2 tracking-tight floating">
              Store Directory
            </h1>
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-bounce opacity-80"></div>
            <div className="absolute -bottom-2 -left-4 w-6 h-6 bg-gradient-to-r from-pink-400 to-red-500 rounded-full animate-bounce delay-300 opacity-80"></div>
          </div>
          
          <p className="text-xl md:text-2xl text-gray-600 dark:text-pink-300 max-w-3xl mx-auto leading-relaxed font-medium">
            🚀 Discover amazing stores and share your experiences with our vibrant community
          </p>
          
          {/* Stats Preview */}
          <div className="flex justify-center items-center gap-8 mt-8 flex-wrap">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/60 dark:bg-gray-800/60 rounded-full backdrop-blur-sm border border-gray-200/50 dark:border-gray-600/50">
              <Store className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-gray-700 dark:text-pink-300">{stores.length} Stores</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/60 dark:bg-gray-800/60 rounded-full backdrop-blur-sm border border-gray-200/50 dark:border-gray-600/50">
              <Heart className="w-5 h-5 text-red-500" />
              <span className="font-semibold text-gray-700 dark:text-gray-300">{stores.filter(store => store.userRating).length} Reviews</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/60 dark:bg-gray-800/60 rounded-full backdrop-blur-sm border border-gray-200/50 dark:border-gray-600/50">
              <Award className="w-5 h-5 text-yellow-600" />
              <span className="font-semibold text-gray-700 dark:text-gray-300">{(stores.reduce((sum, store) => sum + store.avgRating, 0) / Math.max(stores.length, 1) || 0).toFixed(1)} Avg Rating</span>
            </div>
          </div>
        </div>

        {/* Enhanced Search and Filters */}
        <Card className="mb-12 modern-card hover-lift glass shadow-strong transition-all duration-500 rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 dark:from-blue-400/10 dark:via-purple-400/10 dark:to-pink-400/10"></div>
          <CardContent className="p-8 relative">
            <div className="space-y-8">
              <div className="flex flex-col lg:flex-row gap-6">
          <div className="relative flex-1 group">
                  <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6 group-focus-within:text-green-500 transition-colors duration-200" />
            <input
              type="text"
              placeholder="🔍 Search stores by name or address..."
                    className="w-full pl-14 pr-6 py-5 border-2 border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 bg-white/80 dark:bg-gray-700/80 backdrop-blur-md text-lg transition-all duration-300 focus:shadow-2xl hover:shadow-lg placeholder-gray-400 font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          </div>
          
                <div className="flex gap-4">
            <select
                    className="px-6 py-5 border-2 border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 bg-white/80 dark:bg-gray-700/80 backdrop-blur-md transition-all duration-300 focus:shadow-2xl hover:shadow-lg font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="name">📝 Sort by Name</option>
              <option value="avgRating">⭐ Sort by Rating</option>
              <option value="createdAt">📅 Sort by Date</option>
            </select>
            
            <select
                    className="px-6 py-5 border-2 border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 bg-white/80 dark:bg-gray-700/80 backdrop-blur-md transition-all duration-300 focus:shadow-2xl hover:shadow-lg font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="asc">⬆️ Ascending</option>
              <option value="desc">⬇️ Descending</option>
            </select>
          </div>
        </div>

              <div className="bg-gradient-to-r from-gray-50 to-green-50/50 dark:from-gray-800/50 dark:to-green-900/20 p-6 rounded-2xl border border-gray-200/50 dark:border-gray-600/50">
                <div className="flex flex-wrap items-center gap-4">
                  <span className="text-base font-bold text-gray-700 dark:text-gray-300 flex items-center gap-3">
                    <Filter className="w-5 h-5 text-green-600" />
                    🎯 Filter by rating:
                  </span>
          {['', '4', '3', '2', '1'].map((rating) => (
                    <Button
              key={rating}
              onClick={() => setRatingFilter(rating)}
                      variant={ratingFilter === rating ? "default" : "outline"}
                      className={`btn-modern clickable hover-glow ${
                ratingFilter === rating
                          ? 'pulse-glow'
                          : 'hover-lift'
                      }`}
                    >
                      {rating ? (
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{rating}+</span>
                          <Star className="w-5 h-5 fill-current" />
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span>🌟 All Ratings</span>
                        </div>
                      )}
                    </Button>
          ))}
          </div>
        </div>
      </div>
          </CardContent>
        </Card>

      {/* Enhanced Stores Grid */}
      {stores.length === 0 ? (
        <EmptyState 
          title="No stores found"
          message={searchTerm || ratingFilter 
            ? '🎯 Try adjusting your search criteria to discover more stores'
            : '🏪 No stores are available at the moment - check back soon!'
          }
          icon={<Store className="w-8 h-8 text-gray-400" />}
        />
      ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <Store className="w-7 h-7 text-blue-600" />
                🏪 Discover Stores ({stores.length})
              </h2>
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-full border border-green-200/50 dark:border-green-400/30">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-green-700 dark:text-green-300">Live Results</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {stores.map((store, index) => (
                <div 
                  key={store.id} 
                  className="animate-fadeIn transform hover:scale-[1.02] transition-all duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <FeedbackCard
                    store={store}
                    userRating={store.userRating}
                    onRatingSubmit={handleRatingSubmit}
                    pendingRatings={pendingRatings}
                    setPendingRatings={setPendingRatings}
                  />
                </div>
              ))}
            </div>
            
            {/* Load More Button */}
            {hasMore && (
              <div className="text-center mt-8">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="btn-modern hover-lift pulse-glow"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="loading-modern w-5 h-5"></div>
                      Loading more...
                    </div>
                  ) : (
                    'Load More Stores'
                  )}
                </button>
              </div>
            )}
          </div>
      )}

        {/* Enhanced Stats Dashboard */}
        <Card className="mt-16 bg-gradient-to-br from-white/95 via-blue-50/90 to-purple-50/90 dark:from-gray-800/95 dark:via-blue-900/50 dark:to-purple-900/50 border-0 shadow-2xl rounded-3xl overflow-hidden backdrop-blur-md">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 dark:from-blue-400/10 dark:via-purple-400/10 dark:to-pink-400/10"></div>
          <CardContent className="p-10 text-center relative">
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-lg">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">📊 Platform Statistics</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center group hover:scale-105 transition-all duration-300">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow-xl mb-4 group-hover:shadow-2xl">
                  <div className="text-4xl font-black mb-2">
                    {stores.length}
                  </div>
                  <div className="text-blue-100 font-semibold">🏪 Stores Available</div>
                </div>
                <div className="flex justify-center">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                </div>
              </div>
              <div className="text-center group hover:scale-105 transition-all duration-300">
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-2xl shadow-xl mb-4 group-hover:shadow-2xl">
                  <div className="text-4xl font-black mb-2">
                    {(stores.reduce((sum, store) => sum + store.avgRating, 0) / Math.max(stores.length, 1) || 0).toFixed(1)}
                  </div>
                  <div className="text-purple-100 font-semibold">⭐ Average Rating</div>
                </div>
                <div className="flex justify-center">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-100"></div>
                </div>
              </div>
              <div className="text-center group hover:scale-105 transition-all duration-300">
                <div className="bg-gradient-to-br from-pink-500 to-pink-600 text-white p-6 rounded-2xl shadow-xl mb-4 group-hover:shadow-2xl">
                  <div className="text-4xl font-black mb-2">
                    {stores.filter(store => store.userRating).length}
                  </div>
                  <div className="text-pink-100 font-semibold">💝 Your Reviews</div>
                </div>
                <div className="flex justify-center">
                  <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse delay-200"></div>
                </div>
              </div>
            </div>
            
            {/* Additional engagement section */}
            <div className="mt-10 p-6 bg-gradient-to-r from-gray-50 to-blue-50/50 dark:from-gray-800/50 dark:to-blue-900/20 rounded-2xl border border-gray-200/50 dark:border-gray-600/50">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Star className="w-6 h-6 text-yellow-500 animate-pulse" />
                <span className="text-lg font-bold text-gray-900 dark:text-white">🎉 Community Impact</span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
                Join our growing community of store explorers! Your reviews help others discover amazing places and support local businesses.
              </p>
              <div className="flex justify-center mt-4 gap-2">
                <div className="w-1 h-1 bg-yellow-400 rounded-full animate-ping"></div>
                <div className="w-1 h-1 bg-blue-400 rounded-full animate-ping delay-100"></div>
                <div className="w-1 h-1 bg-purple-400 rounded-full animate-ping delay-200"></div>
                <div className="w-1 h-1 bg-pink-400 rounded-full animate-ping delay-300"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserDashboard;
