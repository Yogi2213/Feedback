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
    <Card className="hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-800 border rounded-2xl overflow-hidden">
      {/* Header with Store Info */}
      <CardHeader className="pb-4 bg-gray-100 dark:bg-gray-700">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
              🏪 {store.name}
            </CardTitle>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 mt-2">
              <MapPin className="w-4 h-4 text-blue-500" />
              <span className="text-sm">{store.address}</span>
            </div>
            {/* Overall Rating Display */}
            <div className="flex items-center gap-3 mt-4">
              <div className={`px-3 py-1 rounded-lg ${getRatingColor(store.avgRating)} text-white font-bold`}>
                ⭐ {store.avgRating.toFixed(1)}
              </div>
              <StarRating 
                rating={Math.round(store.avgRating)} 
                size="sm"
              />
              <Badge variant="secondary" className="text-xs px-2 py-1">
                {getRatingText(store.avgRating)}
              </Badge>
            </div>
          </div>
          <div className="bg-blue-600 w-12 h-12 rounded-lg flex items-center justify-center shadow-md">
            <Award className="w-6 h-6 text-white" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {/* Current User Rating */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500" />
            Your Rating
          </h3>
          
          {userRating ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <StarRating rating={userRating} size="md" showLabel />
                <Badge className="bg-green-500 text-white">Rated</Badge>
              </div>
              {store.userComment && (
                <p className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-sm text-gray-700 dark:text-gray-300">
                  💬 {store.userComment}
                </p>
              )}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              🌟 You haven’t rated this store yet.
            </p>
          )}
        </div>

        {/* Rating Form */}
        <form onSubmit={handleRatingSubmit} className="space-y-4">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            {userRating ? 'Update Your Rating' : 'Rate This Store'}
          </h3>
          
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
              size="lg"
              showLabel
            />
          </div>

          <textarea
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200 resize-none"
            rows="3"
            placeholder="Share your experience..."
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

          <div className="flex gap-3">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg"
            >
              {isSubmitting ? 'Submitting...' : (userRating ? 'Update Rating' : 'Submit Rating')}
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
                className="px-4 py-2 rounded-lg border"
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
