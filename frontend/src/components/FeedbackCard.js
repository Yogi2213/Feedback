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
    <Card className="group hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 dark:from-gray-800 dark:via-blue-900/20 dark:to-purple-900/20 border-0 shadow-lg overflow-hidden">
      {/* Header with Store Info */}
      <CardHeader className="pb-4 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 dark:from-blue-400/20 dark:via-purple-400/20 dark:to-pink-400/20">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
              {store.name}
            </CardTitle>
            
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 mb-3">
              <MapPin className="w-4 h-4 text-blue-500" />
              <span className="text-sm">{store.address}</span>
            </div>
            
            {/* Overall Rating Display */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${getRatingColor(store.avgRating)} text-white text-sm font-bold shadow-lg`}>
                  {store.avgRating.toFixed(1)}
                </div>
                <StarRating 
                  rating={Math.round(store.avgRating)} 
                  size="sm" 
                  className="opacity-90"
                />
              </div>
              <Badge variant="secondary" className="text-xs font-medium">
                {getRatingText(store.avgRating)}
              </Badge>
            </div>
          </div>
          
          {/* Decorative Elements */}
          <div className="flex flex-col items-end gap-2">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-75"></div>
              <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse delay-150"></div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {/* Current User Rating Display */}
        <div className="mb-6 p-4 bg-gradient-to-r from-gray-50 to-blue-50/50 dark:from-gray-700/50 dark:to-blue-900/20 rounded-xl border border-gray-200/50 dark:border-gray-600/50">
          <div className="flex items-center gap-2 mb-3">
            <Heart className="w-5 h-5 text-red-500" />
            <span className="font-semibold text-gray-900 dark:text-white">Your Rating</span>
          </div>
          
          {userRating ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <StarRating 
                  rating={userRating} 
                  size="md" 
                  showLabel={true}
                />
                <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                  Rated
                </Badge>
              </div>
              {store.userComment && (
                <div className="bg-white/70 dark:bg-gray-800/50 p-3 rounded-lg border-l-4 border-green-400">
                  <div className="flex items-start gap-2">
                    <MessageSquare className="w-4 h-4 mt-0.5 text-green-500 flex-shrink-0" />
                    <p className="text-sm text-gray-700 dark:text-gray-300 italic">
                      "{store.userComment}"
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Star className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">You haven't rated this store yet</p>
            </div>
          )}
        </div>

        {/* Rating Form */}
        <form onSubmit={handleRatingSubmit} className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            <span className="font-semibold text-gray-900 dark:text-white">
              {userRating ? 'Update Your Rating' : 'Rate This Store'}
            </span>
          </div>
          
          {/* Star Rating Input */}
          <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl border border-yellow-200/50 dark:border-yellow-700/50">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Rating:</span>
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
              size="lg"
              showLabel={true}
            />
          </div>
          
          {/* Comment Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Add a comment (optional)
            </label>
            <textarea
              className="w-full p-4 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm resize-none transition-all duration-200 focus:shadow-lg"
              rows="3"
              placeholder="Share your experience with this store..."
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
          
          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Submitting...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <ThumbsUp className="w-4 h-4" />
                  {userRating ? 'Update Rating' : 'Submit Rating'}
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
                className="px-6 py-3 rounded-xl border-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300"
              >
                Reset
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default FeedbackCard;
