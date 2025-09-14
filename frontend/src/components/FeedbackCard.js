import React, { useState } from 'react';
import { 
  Star, 
  MessageSquare, 
  MapPin, 
  Heart,
  ThumbsUp,
  Award,
  Sparkles
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { BackgroundGradient } from './ui/background-gradient';
import StarRating from './StarRating';
import toast from 'react-hot-toast';

const FeedbackCard = ({ 
  store, 
  userRating, 
  onRatingSubmit, 
  pendingRatings, 
  setPendingRatings 
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRatingSubmit = async (e) => {
    e.preventDefault();
    const pending = pendingRatings[store.id];
    const currentRating = pending?.rating || userRating;
    const currentComment = pending?.comment !== undefined ? pending.comment : store.userComment;
    
    if (currentRating) {
      setIsSubmitting(true);
      try {
        await onRatingSubmit(store.id, currentRating, currentComment);
        toast.success('Rating submitted successfully!');
      } catch (error) {
        toast.error('Failed to submit rating');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      toast.error('Please select a star rating first.');
    }
  };

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return 'bg-green-500';
    if (rating >= 3.5) return 'bg-blue-500';
    if (rating >= 2.5) return 'bg-yellow-400';
    if (rating >= 1.5) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getRatingText = (rating) => {
    if (rating >= 4.5) return 'Excellent';
    if (rating >= 3.5) return 'Good';
    if (rating >= 2.5) return 'Average';
    if (rating >= 1.5) return 'Poor';
    return 'Very Poor';
  };

  return (
    <BackgroundGradient className="rounded-[22px] p-4 bg-white dark:bg-zinc-900">
      <div className="space-y-4">
        {/* Header with Store Info */}
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900 p-6 rounded-2xl">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                🏪 {store.name}
              </h2>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 mb-4">
                <MapPin className="w-5 h-5 text-blue-500" />
                <span className="text-sm font-medium">📍 {store.address}</span>
              </div>
              {/* Overall Rating Display */}
              <div className="flex items-center gap-3 flex-wrap">
                <div className={`px-4 py-2 rounded-xl ${getRatingColor(store.avgRating)} text-white font-bold text-lg shadow-lg`}>
                  ⭐ {store.avgRating.toFixed(1)}
                </div>
                <StarRating 
                  rating={Math.round(store.avgRating)} 
                  size="md"
                />
                <Badge variant="secondary" className="text-sm font-semibold px-3 py-1 rounded-full">
                  🎯 {getRatingText(store.avgRating)}
                </Badge>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl">
              <Award className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        {/* Current User Rating */}
        <div className="bg-gradient-to-r from-pink-50 to-red-50 dark:from-pink-900/20 dark:to-red-900/20 p-6 rounded-2xl">
          <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-full">
              <Heart className="w-5 h-5 text-white" />
            </div>
            💝 Your Rating
          </h3>
          
          {userRating ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4 justify-center">
                <StarRating rating={userRating} size="lg" showLabel />
                <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 font-bold rounded-full shadow-lg">
                  ✅ Rated
                </Badge>
              </div>
              {store.userComment && (
                <div className="bg-gradient-to-r from-white/80 to-green-50/80 dark:from-gray-800/60 dark:to-green-900/30 p-4 rounded-xl border-l-4 border-green-400 shadow-lg">
                  <p className="text-base text-gray-700 dark:text-gray-300 italic font-medium">
                    "💬 {store.userComment}"
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-blue-100 dark:from-gray-700 dark:to-blue-800 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Star className="w-8 h-8 text-gray-400 dark:text-gray-300" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">🌟 You haven't rated this store yet</p>
              <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Share your experience below!</p>
            </div>
          )}
        </div>

        {/* Rating Form */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-6 rounded-2xl">
          <form onSubmit={handleRatingSubmit} className="space-y-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full shadow-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-xl text-gray-800 dark:text-gray-200">
                  {userRating ? '🔄 Update Your Rating' : '⭐ Rate This Store'}
                </h3>
              </div>
            </div>
            
            <div className="bg-white/60 dark:bg-gray-800/60 p-6 rounded-xl shadow-lg">
              <div className="text-center mb-4">
                <span className="font-bold text-lg text-gray-700 dark:text-gray-300">🌟 Your Rating:</span>
              </div>
              <div className="flex justify-center">
                <StarRating
                  rating={
                    pendingRatings[store.id]?.rating !== undefined 
                      ? pendingRatings[store.id].rating 
                      : userRating || 0
                  }
                  onRatingChange={(rating) => 
                    setPendingRatings(prev => ({
                      ...prev, 
                      [store.id]: {...(prev[store.id] || {}), rating}
                    }))
                  }
                  interactive
                  size="xl"
                  showLabel
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-lg text-gray-700 dark:text-gray-300 flex items-center gap-3 justify-center mb-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                💬 Add a comment (optional)
              </label>
              <textarea
                className="w-full p-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm resize-none transition-all duration-300 focus:shadow-lg text-lg placeholder-gray-400 font-medium"
                rows="4"
                placeholder="✨ Share your experience with this store... What made it special?"
                value={
                  pendingRatings[store.id]?.comment !== undefined 
                    ? pendingRatings[store.id].comment 
                    : store.userComment || ''
                }
                onChange={(e) => 
                  setPendingRatings(prev => ({
                    ...prev, 
                    [store.id]: {...(prev[store.id] || {}), comment: e.target.value}
                  }))
                }
              />
            </div>

            <div className="flex gap-4">
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-lg"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    🚀 Submitting...
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <ThumbsUp className="w-5 h-5" />
                    {userRating ? '🔄 Update Rating' : '⭐ Submit Rating'}
                  </div>
                )}
              </Button>

              {(pendingRatings[store.id]?.rating !== undefined || pendingRatings[store.id]?.comment !== undefined) && (
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setPendingRatings(prev => {
                    const updated = { ...prev };
                    delete updated[store.id];
                    return updated;
                  })}
                  className="px-6 py-4 rounded-xl border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 font-bold text-lg hover:scale-105 transform"
                >
                  🔄 Reset
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </BackgroundGradient>
  );
};

export default FeedbackCard;
