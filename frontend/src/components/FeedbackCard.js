import React, { useState } from 'react';
import { 
  Star, 
  MessageSquare, 
  MapPin, 
  Clock, 
  Heart,
  ThumbsUp,
  Award,
  Sparkles
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
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
    if (rating >= 4.5) return 'from-emerald-500 to-green-600';
    if (rating >= 3.5) return 'from-blue-500 to-indigo-600';
    if (rating >= 2.5) return 'from-yellow-500 to-orange-500';
    if (rating >= 1.5) return 'from-orange-500 to-red-500';
    return 'from-red-500 to-red-600';
  };

  const getRatingText = (rating) => {
    if (rating >= 4.5) return 'Excellent';
    if (rating >= 3.5) return 'Good';
    if (rating >= 2.5) return 'Average';
    if (rating >= 1.5) return 'Poor';
    return 'Very Poor';
  };

  return (
    <Card className="group hover:shadow-3xl transition-all duration-700 hover:scale-[1.03] bg-gradient-to-br from-white via-blue-50/40 to-purple-50/40 dark:from-gray-800 dark:via-blue-900/30 dark:to-purple-900/30 border-0 shadow-xl overflow-hidden rounded-3xl relative">
      {/* Decorative corner elements */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-full blur-xl animate-pulse opacity-60"></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-br from-pink-400/20 to-red-500/20 rounded-full blur-xl animate-pulse delay-500 opacity-60"></div>
      
      {/* Header with Store Info */}
      <CardHeader className="pb-6 bg-gradient-to-r from-blue-500/15 via-purple-500/15 to-pink-500/15 dark:from-blue-400/25 dark:via-purple-400/25 dark:to-pink-400/25 relative">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <CardTitle className="text-2xl font-black text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                🏪 {store.name}
              </CardTitle>
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 mb-4 bg-white/50 dark:bg-gray-800/50 px-3 py-2 rounded-full backdrop-blur-sm">
              <MapPin className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium">📍 {store.address}</span>
            </div>
            
            {/* Enhanced Overall Rating Display */}
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <div className={`px-4 py-2 rounded-2xl bg-gradient-to-r ${getRatingColor(store.avgRating)} text-white text-lg font-black shadow-xl transform group-hover:scale-110 transition-all duration-300`}>
                  ⭐ {store.avgRating.toFixed(1)}
                </div>
                <StarRating 
                  rating={Math.round(store.avgRating)} 
                  size="md" 
                  className="opacity-95"
                />
              </div>
              <Badge variant="secondary" className="text-sm font-bold px-3 py-1 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-full">
                🎯 {getRatingText(store.avgRating)}
              </Badge>
            </div>
          </div>
          
          {/* Enhanced Decorative Elements */}
          <div className="flex flex-col items-end gap-3">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-125 group-hover:rotate-12 transition-all duration-500">
                <Award className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-bounce"></div>
            </div>
            <div className="flex gap-2">
              <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse shadow-lg"></div>
              <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse delay-75 shadow-lg"></div>
              <div className="w-3 h-3 bg-pink-400 rounded-full animate-pulse delay-150 shadow-lg"></div>
            </div>
            <div className="text-xs font-bold text-gray-500 dark:text-gray-400 bg-white/60 dark:bg-gray-800/60 px-2 py-1 rounded-full">
              #{store.id}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-8">
        {/* Enhanced Current User Rating Display */}
        <div className="mb-8 p-6 bg-gradient-to-br from-gray-50 via-blue-50/60 to-purple-50/60 dark:from-gray-700/60 dark:via-blue-900/30 dark:to-purple-900/30 rounded-2xl border-2 border-gray-200/60 dark:border-gray-600/60 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-full shadow-lg">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-lg text-gray-900 dark:text-white">💝 Your Rating</span>
            <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent dark:from-gray-600"></div>
          </div>
          
          {userRating ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4 justify-center">
                <StarRating 
                  rating={userRating} 
                  size="lg" 
                  showLabel={true}
                />
                <Badge className="bg-gradient-to-r from-green-500 via-emerald-600 to-teal-600 text-white px-4 py-2 text-sm font-bold rounded-full shadow-lg">
                  ✅ Rated
                </Badge>
              </div>
              {store.userComment && (
                <div className="bg-gradient-to-r from-white/80 to-green-50/80 dark:from-gray-800/60 dark:to-green-900/30 p-4 rounded-2xl border-l-4 border-green-400 shadow-lg">
                  <div className="flex items-start gap-3">
                    <div className="p-1 bg-green-500 rounded-full">
                      <MessageSquare className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-base text-gray-700 dark:text-gray-300 italic font-medium leading-relaxed">
                      "💬 {store.userComment}"
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-6">
              <div className="relative mb-4">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-100 via-blue-100 to-purple-100 dark:from-gray-700 dark:via-blue-800 dark:to-purple-800 rounded-full flex items-center justify-center mx-auto shadow-xl">
                  <Star className="w-10 h-10 text-gray-400 dark:text-gray-300" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full animate-bounce opacity-80"></div>
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">🌟 You haven't rated this store yet</p>
              <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Share your experience below!</p>
            </div>
          )}
        </div>

        {/* Enhanced Rating Form */}
        <form onSubmit={handleRatingSubmit} className="space-y-6">
          <div className="flex items-center gap-3 mb-6 justify-center">
            <div className="p-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full shadow-lg animate-pulse">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900 dark:text-white">
              {userRating ? '🔄 Update Your Rating' : '⭐ Rate This Store'}
            </span>
          </div>
          
          {/* Enhanced Star Rating Input */}
          <div className="p-6 bg-gradient-to-br from-yellow-50 via-orange-50/60 to-red-50/60 dark:from-yellow-900/30 dark:via-orange-900/30 dark:to-red-900/30 rounded-2xl border-2 border-yellow-200/60 dark:border-yellow-700/60 shadow-lg">
            <div className="text-center mb-4">
              <span className="text-lg font-bold text-gray-700 dark:text-gray-300 flex items-center justify-center gap-2">
                🌟 Your Rating:
              </span>
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
                interactive={true}
                size="xl"
                showLabel={true}
              />
            </div>
          </div>
          
          {/* Enhanced Comment Input */}
          <div className="space-y-4">
            <label className="text-lg font-bold text-gray-700 dark:text-gray-300 flex items-center gap-3 justify-center">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              💬 Add a comment (optional)
            </label>
            <textarea
              className="w-full p-6 border-2 border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md resize-none transition-all duration-300 focus:shadow-2xl hover:shadow-lg text-lg placeholder-gray-400 font-medium"
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
          
          {/* Enhanced Action Buttons */}
          <div className="flex gap-4 pt-4">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
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
                className="px-8 py-4 rounded-2xl border-3 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 font-bold text-lg hover:scale-105 transform"
              >
                🔄 Reset
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default FeedbackCard;
