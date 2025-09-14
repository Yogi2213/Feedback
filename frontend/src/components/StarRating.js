import React, { useState } from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ 
  rating = 0, 
  onRatingChange, 
  interactive = false, 
  size = 'md',
  showLabel = false,
  className = ''
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8'
  };

  const handleStarClick = (starRating) => {
    if (interactive && onRatingChange) {
      onRatingChange(starRating);
    }
  };

  const handleMouseEnter = (starRating) => {
    if (interactive) {
      setHoverRating(starRating);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(0);
    }
  };

  const displayRating = hoverRating || rating;

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => handleStarClick(star)}
          onMouseEnter={() => handleMouseEnter(star)}
          onMouseLeave={handleMouseLeave}
          disabled={!interactive}
          className={`${sizeClasses[size]} ${
            interactive 
              ? 'hover:scale-110 transition-all duration-200 cursor-pointer' 
              : 'cursor-default'
          }`}
        >
          <Star
            className={`${sizeClasses[size]} ${
              star <= displayRating
                ? 'text-yellow-400 fill-current drop-shadow-sm'
                : 'text-gray-300 dark:text-gray-600'
            } transition-colors duration-200`}
          />
        </button>
      ))}
      {showLabel && (
        <span className="ml-2 text-sm font-medium text-gray-600 dark:text-gray-300">
          {rating > 0 ? `${rating.toFixed(1)}/5` : 'Not rated'}
        </span>
      )}
    </div>
  );
};

export default StarRating;
