import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { storesAPI, ratingsAPI } from '../services/api';
import { 
  Store, 
  Star, 
  Users, 
  TrendingUp,
  StarIcon,
  User,
  MessageSquare,
  Award,
  Target,
  Activity,
  Heart,
  Zap,
  Crown
} from 'lucide-react';
import { BarChart, LineChart, DonutChart } from '../components/Charts';
import TiltedCard from '../components/TiltedCard';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import toast from 'react-hot-toast';

const StoreOwnerDashboard = () => {
  const { user } = useAuth();
  const [stores, setStores] = useState([]);
  const [storeRatings, setStoreRatings] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedStore, setSelectedStore] = useState(null);

  useEffect(() => {
    loadStores();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadStores = async () => {
    try {
      setLoading(true);
      const response = await storesAPI.getStoresByOwner(user.id);
      if (response.data.success) {
        setStores(response.data.data.stores);
        if (response.data.data.stores.length > 0) {
          setSelectedStore(response.data.data.stores[0]);
          loadStoreRatings(response.data.data.stores[0].id);
        }
      }
    } catch (error) {
      toast.error('Failed to load stores');
    } finally {
      setLoading(false);
    }
  };

  const loadStoreRatings = async (storeId) => {
    try {
      const response = await ratingsAPI.getStoreRatings(storeId, {
        page: 1,
        limit: 100
      });
      if (response.data.success) {
        setStoreRatings(prev => ({
          ...prev,
          [storeId]: response.data.data.ratings
        }));
      }
    } catch (error) {
      toast.error('Failed to load store ratings');
    }
  };

  const handleStoreSelect = (store) => {
    setSelectedStore(store);
    if (!storeRatings[store.id]) {
      loadStoreRatings(store.id);
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIcon
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const getRatingDistribution = (ratings) => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    ratings.forEach(rating => {
      distribution[rating.rating]++;
    });
    return distribution;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-green-100 dark:from-black dark:via-pink-950 dark:to-black font-inter">
        <div className="container py-8">
          <div className="text-center">
            <div className="loading w-8 h-8 mx-auto"></div>
            <p className="mt-2 text-gray-600 dark:text-pink-300">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (stores.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-green-100 dark:from-black dark:via-pink-950 dark:to-black font-inter">
        <div className="container py-8">
          <div className="text-center">
            <Store className="w-16 h-16 text-gray-300 dark:text-pink-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-pink-200 mb-2">No stores found</h3>
            <p className="text-gray-600 dark:text-pink-300">
              You don't have any stores yet. Contact an administrator to add stores to your account.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const currentRatings = selectedStore ? storeRatings[selectedStore.id] || [] : [];
  const ratingDistribution = getRatingDistribution(currentRatings);
  const totalRatings = currentRatings.length;
  const averageRating = totalRatings > 0 
    ? currentRatings.reduce((sum, rating) => sum + rating.rating, 0) / totalRatings 
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-green-100 dark:from-black dark:via-pink-950 dark:to-black font-inter">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-32 w-96 h-96 bg-gradient-to-br from-green-400/20 to-green-600/20 dark:from-pink-400/20 dark:to-pink-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-gradient-to-br from-green-300/20 to-green-500/20 dark:from-pink-500/20 dark:to-pink-700/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative container py-8">
        {/* Welcome Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500/10 to-green-600/10 dark:from-pink-500/20 dark:to-pink-600/20 rounded-full mb-4">
            <Crown className="w-5 h-5 text-green-600 dark:text-pink-400" />
            <span className="text-sm font-medium text-green-700 dark:text-pink-300">Store Owner Portal</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-green-800 to-green-600 dark:from-white dark:via-pink-200 dark:to-pink-400 bg-clip-text text-transparent mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600 dark:text-pink-300 text-lg">Here's how your stores are performing today</p>
        </div>

        {/* Enhanced Quick Stats Overview */}
        {selectedStore && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 dark:from-pink-500/20 dark:to-pink-600/10 p-6 hover:shadow-2xl transition-all duration-500 group hover:-translate-y-2 border-0 shadow-lg">
              <CardContent className="p-0">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-4 bg-gradient-to-br from-green-500 to-green-600 dark:from-pink-500 dark:to-pink-600 rounded-2xl shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    <Star className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-right">
                    <TrendingUp className="w-6 h-6 text-green-500 dark:text-pink-400 mb-1" />
                    <div className="w-2 h-2 bg-green-500 dark:bg-pink-400 rounded-full animate-pulse"></div>
                  </div>
                </div>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-800 dark:from-pink-400 dark:to-pink-600 bg-clip-text text-transparent mb-2">
                  {averageRating.toFixed(1)}
                </h3>
                <p className="text-sm font-semibold text-gray-600 dark:text-pink-300">Average Rating</p>
                <div className="mt-2 flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-xs text-gray-500 dark:text-pink-400">out of 5</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-400/10 to-green-500/5 dark:from-pink-400/20 dark:to-pink-500/10 p-6 hover:shadow-2xl transition-all duration-500 group hover:-translate-y-2 border-0 shadow-lg">
              <CardContent className="p-0">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-4 bg-gradient-to-br from-green-400 to-green-500 dark:from-pink-400 dark:to-pink-500 rounded-2xl shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-right">
                    <Activity className="w-6 h-6 text-green-600 dark:text-pink-400 mb-1" />
                    <div className="w-2 h-2 bg-green-600 dark:bg-pink-400 rounded-full animate-pulse"></div>
                  </div>
                </div>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-green-500 to-green-700 dark:from-pink-300 dark:to-pink-500 bg-clip-text text-transparent mb-2">
                  {totalRatings}
                </h3>
                <p className="text-sm font-semibold text-gray-600 dark:text-pink-300">Total Reviews</p>
                <div className="mt-2 flex items-center gap-1">
                  <MessageSquare className="w-4 h-4 text-green-500 dark:text-pink-400" />
                  <span className="text-xs text-gray-500 dark:text-pink-400">customer feedback</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-600/10 to-green-700/5 dark:from-pink-600/20 dark:to-pink-700/10 p-6 hover:shadow-2xl transition-all duration-500 group hover:-translate-y-2 border-0 shadow-lg">
              <CardContent className="p-0">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-4 bg-gradient-to-br from-green-600 to-green-700 dark:from-pink-600 dark:to-pink-700 rounded-2xl shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-right">
                    <Zap className="w-6 h-6 text-yellow-500 dark:text-pink-400 mb-1" />
                    <div className="w-2 h-2 bg-yellow-500 dark:bg-pink-400 rounded-full animate-pulse"></div>
                  </div>
                </div>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-green-700 to-green-900 dark:from-pink-300 dark:to-pink-500 bg-clip-text text-transparent mb-2">
                  {ratingDistribution[5]}
                </h3>
                <p className="text-sm font-semibold text-gray-600 dark:text-pink-300">5-Star Reviews</p>
                <div className="mt-2 flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-xs text-gray-500 dark:text-pink-400">excellent ratings</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-300/10 to-green-400/5 dark:from-pink-300/20 dark:to-pink-400/10 p-6 hover:shadow-2xl transition-all duration-500 group hover:-translate-y-2 border-0 shadow-lg">
              <CardContent className="p-0">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-4 bg-gradient-to-br from-green-300 to-green-400 dark:from-pink-300 dark:to-pink-400 rounded-2xl shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-right">
                    <Target className="w-6 h-6 text-green-500 dark:text-pink-400 mb-1" />
                    <div className="w-2 h-2 bg-green-500 dark:bg-pink-400 rounded-full animate-pulse"></div>
                  </div>
                </div>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-green-600 dark:from-pink-200 dark:to-pink-400 bg-clip-text text-transparent mb-2">
                  {((ratingDistribution[5] + ratingDistribution[4]) / Math.max(totalRatings, 1) * 100).toFixed(0)}%
                </h3>
                <p className="text-sm font-semibold text-gray-600 dark:text-pink-300">Satisfaction Rate</p>
                <div className="mt-2 flex items-center gap-1">
                  <Heart className="w-4 h-4 text-green-500 dark:text-pink-400" />
                  <span className="text-xs text-gray-500 dark:text-pink-400">happy customers</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Store Selection */}
          <div className="lg:col-span-1">
            <Card className="p-6 bg-white/80 dark:bg-black/80 backdrop-blur-sm border border-green-200 dark:border-pink-800">
              <CardHeader className="p-0 pb-4">
                <CardTitle className="text-lg text-gray-900 dark:text-pink-200">Your Stores</CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-3">
                {stores.map((store) => (
                  <Button
                    key={store.id}
                    variant={selectedStore?.id === store.id ? "default" : "ghost"}
                    onClick={() => handleStoreSelect(store)}
                    className={`w-full text-left p-4 h-auto justify-start transition-all duration-300 hover:scale-[1.02] ${
                      selectedStore?.id === store.id
                        ? 'bg-gradient-to-r from-green-50 to-green-100 dark:from-pink-900/50 dark:to-pink-800/50 shadow-lg border-green-500 dark:border-pink-500'
                        : 'hover:bg-green-50 dark:hover:bg-pink-900/30'
                    }`}
                  >
                    <div className="w-full">
                      <h4 className="font-medium text-gray-900 dark:text-pink-200 text-left">{store.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-pink-300 mt-1 text-left">{store.address}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center gap-1">
                          {renderStars(Math.round(store.avgRating))}
                          <span className="text-sm text-gray-600 dark:text-pink-300">
                            {store.avgRating.toFixed(1)}
                          </span>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {store._count.ratings} ratings
                        </Badge>
                      </div>
                    </div>
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Store Analytics */}
          <div className="lg:col-span-2">
            {selectedStore ? (
              <div className="space-y-6">
                {/* Motivational Quote */}
                <Card className="bg-gradient-to-r from-green-500/10 via-green-400/10 to-green-300/10 dark:from-pink-500/20 dark:via-pink-400/20 dark:to-pink-300/20 p-6 border border-green-200 dark:border-pink-800">
                  <CardContent className="p-0 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-black/50 rounded-full mb-4">
                      <Crown className="w-5 h-5 text-yellow-500 dark:text-pink-400" />
                      <span className="text-sm font-medium text-gray-700 dark:text-pink-300">Daily Inspiration</span>
                    </div>
                    <blockquote className="text-lg font-medium text-gray-800 dark:text-pink-200 italic">
                      "Success is not final, failure is not fatal: it is the courage to continue that counts."
                    </blockquote>
                    <cite className="text-sm text-gray-600 dark:text-pink-400 mt-2 block">— Winston Churchill</cite>
                  </CardContent>
                </Card>

                {/* Rating Distribution */}
                <Card className="p-6 bg-white/80 dark:bg-black/80 backdrop-blur-sm border border-green-200 dark:border-pink-800">
                  <CardHeader className="p-0 pb-4">
                    <CardTitle className="text-lg text-gray-900 dark:text-pink-200">Rating Distribution</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 space-y-3">
                    {[5, 4, 3, 2, 1].map((rating) => {
                      const count = ratingDistribution[rating];
                      const percentage = totalRatings > 0 ? (count / totalRatings) * 100 : 0;
                      
                      return (
                        <div key={rating} className="flex items-center gap-3">
                          <div className="flex items-center gap-1 w-16">
                            <span className="text-sm font-medium text-gray-900 dark:text-pink-200">{rating}</span>
                            <StarIcon className="w-4 h-4 text-yellow-400 fill-current" />
                          </div>
                          <div className="text-sm text-gray-600 dark:text-pink-300 w-16 text-right">
                            {count} ({percentage.toFixed(0)}%)
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>

                {/* Analytics Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="p-6 bg-white/80 dark:bg-black/80 backdrop-blur-sm border border-green-200 dark:border-pink-800">
                    <DonutChart
                      title="Rating Breakdown"
                      data={[5, 4, 3, 2, 1].map(rating => ({
                        label: `${rating} Stars`,
                        value: ratingDistribution[rating]
                      }))}
                    />
                  </Card>

                  <Card className="p-6 bg-white/80 dark:bg-black/80 backdrop-blur-sm border border-green-200 dark:border-pink-800">
                    <LineChart
                      title="Recent Ratings Trend"
                      data={(() => {
                        const last7Days = [];
                        const today = new Date();
                        for (let i = 6; i >= 0; i--) {
                          const date = new Date(today);
                          date.setDate(date.getDate() - i);
                          const dayRatings = currentRatings.filter(rating => {
                            const ratingDate = new Date(rating.createdAt);
                            return ratingDate.toDateString() === date.toDateString();
                          });
                          last7Days.push({
                            label: date.getDate().toString(),
                            value: dayRatings.length
                          });
                        }
                        return last7Days;
                      })()}
                    />
                  </Card>
                </div>

                {/* Performance Metrics */}
                <Card className="p-6 bg-white/80 dark:bg-black/80 backdrop-blur-sm border border-green-200 dark:border-pink-800">
                  <BarChart
                    title="Rating Performance Overview"
                    data={[
                      { label: 'Total', value: totalRatings },
                      { label: '5 Star', value: ratingDistribution[5] },
                      { label: '4 Star', value: ratingDistribution[4] },
                      { label: '3 Star', value: ratingDistribution[3] },
                      { label: 'Comments', value: currentRatings.filter(r => r.comment).length }
                    ]}
                  />
                </Card>

                {/* Recent Ratings */}
                <Card className="p-6 bg-white/80 dark:bg-black/80 backdrop-blur-sm border border-green-200 dark:border-pink-800">
                  <CardHeader className="p-0 pb-4">
                    <CardTitle className="text-lg text-gray-900 dark:text-pink-200">Recent Ratings</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    {currentRatings.length === 0 ? (
                      <div className="text-center py-8">
                        <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-600 dark:text-pink-300">No ratings yet</p>
                        <p className="text-sm text-gray-500 dark:text-pink-400">Ratings will appear here once customers start rating your store</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {currentRatings.slice(0, 12).map((rating) => (
                        <TiltedCard
                          key={rating.id}
                          containerHeight="280px"
                          containerWidth="100%"
                          imageHeight="280px"
                          imageWidth="100%"
                          scaleOnHover={1.05}
                          rotateAmplitude={8}
                          showMobileWarning={false}
                          showTooltip={true}
                          captionText={`${rating.user.name} - ${rating.rating}/5 stars`}
                          displayOverlayContent={false}
                        >
                          <div className="w-full h-full bg-gradient-to-br from-green-50 via-white to-green-100 dark:from-pink-950 dark:via-black dark:to-pink-900 rounded-xl border border-green-200 dark:border-pink-600 p-6 flex flex-col justify-between shadow-lg">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 dark:from-pink-500 dark:to-pink-600 rounded-full flex items-center justify-center shadow-lg">
                                  <User className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-900 dark:text-pink-200 text-sm">{rating.user.name}</p>
                                  <div className="flex items-center gap-1">
                                    {renderStars(rating.rating)}
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-2xl font-bold text-green-600 dark:text-pink-400">
                                  {rating.rating}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-pink-400">
                                  /5
                                </div>
                              </div>
                            </div>

                            {/* Comment */}
                            {rating.comment ? (
                              <div className="flex-1 mb-4">
                                <div className="bg-white/70 dark:bg-black/50 p-4 rounded-lg border-l-4 border-green-400 dark:border-pink-400">
                                  <div className="flex items-start gap-2">
                                    <MessageSquare className="w-4 h-4 mt-0.5 text-green-500 dark:text-pink-400 flex-shrink-0" />
                                    <p className="text-sm text-gray-700 dark:text-pink-300 italic line-clamp-4">
                                      "{rating.comment}"
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="flex-1 mb-4 flex items-center justify-center">
                                <div className="text-center">
                                  <Star className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                  <p className="text-sm text-gray-500 dark:text-pink-400">No comment provided</p>
                                </div>
                              </div>
                            )}

                            {/* Footer */}
                            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-pink-600">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 dark:bg-pink-400 rounded-full animate-pulse"></div>
                                <span className="text-xs text-gray-600 dark:text-pink-400">Verified Review</span>
                              </div>
                              <span className="text-xs text-gray-500 dark:text-pink-400">
                                {new Date(rating.createdAt).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                              </span>
                            </div>
                          </div>
                        </TiltedCard>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="p-12 text-center bg-white/80 dark:bg-black/80 backdrop-blur-sm border border-green-200 dark:border-pink-800">
              <CardContent className="p-0">
                <Store className="w-16 h-16 text-gray-300 dark:text-pink-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-pink-200 mb-2">Select a Store</h3>
                <p className="text-gray-600 dark:text-pink-300">Choose a store from the sidebar to view its analytics</p>
              </CardContent>
            </Card>
          )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreOwnerDashboard;
