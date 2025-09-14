import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { storesAPI, ratingsAPI } from '../services/api';
import { 
  Search, 
  Star, 
  MapPin, 
  Filter,
  StarIcon,
  Store,
  MessageSquare,
  Sparkles,
  TrendingUp,
  Award,
  Heart
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import FeedbackCard from '../components/FeedbackCard';
import StarRating from '../components/StarRating';
import toast from 'react-hot-toast';

const UserDashboard = () => {
  const { user } = useAuth();
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [ratingFilter, setRatingFilter] = useState('');
  const [pendingRatings, setPendingRatings] = useState({});

  useEffect(() => {
    loadStores();
  }, [searchTerm, sortBy, sortOrder, ratingFilter]);

  const loadStores = async () => {
    try {
      setLoading(true);
      const params = {
        search: searchTerm,
        sortBy,
        sortOrder,
        page: 1,
        limit: 50
      };
      const response = await storesAPI.getStores(params);
      if (response.data.success) {
        let filteredStores = response.data.data.stores;
        
        // Apply rating filter
        if (ratingFilter) {
          const minRating = parseFloat(ratingFilter);
          filteredStores = filteredStores.filter(store => store.avgRating >= minRating);
        }
        
        setStores(filteredStores);
      }
    } catch (error) {
      toast.error('Failed to load stores');
    } finally {
      setLoading(false);
    }
  };

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
        loadStores(); // Reload stores to update ratings
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
            <StarIcon
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

  if (loading) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <div className="loading w-8 h-8 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading stores...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-32 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-gradient-to-br from-pink-400/20 to-indigo-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-br from-emerald-400/15 to-cyan-600/15 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative container py-8">
        {/* Enhanced Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-400/20 dark:to-purple-400/20 rounded-full mb-6 border border-blue-200/50 dark:border-blue-400/30 backdrop-blur-sm">
            <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-pulse" />
            <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">Store Discovery Platform</span>
          </div>
          
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent mb-4">
            Store Directory
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover amazing stores and share your experiences with our community
          </p>
        </div>

        {/* Enhanced Search and Filters */}
        <Card className="mb-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search stores by name or address..."
                    className="w-full pl-12 pr-4 py-4 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70 dark:bg-gray-700/70 backdrop-blur-sm text-lg transition-all duration-200 focus:shadow-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
                <div className="flex gap-3">
            <select
                    className="px-4 py-4 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70 dark:bg-gray-700/70 backdrop-blur-sm transition-all duration-200 focus:shadow-lg"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="name">Sort by Name</option>
              <option value="avgRating">Sort by Rating</option>
              <option value="createdAt">Sort by Date</option>
            </select>
            
            <select
                    className="px-4 py-4 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70 dark:bg-gray-700/70 backdrop-blur-sm transition-all duration-200 focus:shadow-lg"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>

              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filter by rating:
                </span>
          {['', '4', '3', '2', '1'].map((rating) => (
                  <Button
              key={rating}
              onClick={() => setRatingFilter(rating)}
                    variant={ratingFilter === rating ? "default" : "outline"}
                    className={`px-4 py-2 rounded-full transition-all duration-300 ${
                ratingFilter === rating
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {rating ? (
                      <div className="flex items-center gap-1">
                        <span>{rating}+</span>
                        <Star className="w-4 h-4" />
                      </div>
                    ) : (
                      'All Ratings'
                    )}
                  </Button>
          ))}
        </div>
      </div>
          </CardContent>
        </Card>

      {/* Stores Grid */}
      {stores.length === 0 ? (
          <Card className="text-center py-16 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-0">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Store className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">No stores found</h3>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
            {searchTerm || ratingFilter 
              ? 'Try adjusting your search criteria'
              : 'No stores are available at the moment'
            }
          </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {stores.map((store, index) => (
              <div 
                key={store.id} 
                className="animate-fadeIn"
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
      )}

        {/* Enhanced Stats */}
        <Card className="mt-12 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 dark:from-blue-400/20 dark:via-purple-400/20 dark:to-pink-400/20 border-0 shadow-xl">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <span className="text-lg font-semibold text-gray-900 dark:text-white">Platform Statistics</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                  {stores.length}
                </div>
                <div className="text-gray-600 dark:text-gray-300">Stores Available</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                  {stores.reduce((sum, store) => sum + store.avgRating, 0) / Math.max(stores.length, 1) || 0}
                </div>
                <div className="text-gray-600 dark:text-gray-300">Average Rating</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-pink-600 dark:text-pink-400 mb-1">
                  {stores.filter(store => store.userRating).length}
                </div>
                <div className="text-gray-600 dark:text-gray-300">Your Reviews</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserDashboard;
