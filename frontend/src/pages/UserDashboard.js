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
  MessageSquare
} from 'lucide-react';
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
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Store Directory</h1>
        <p className="text-gray-600">Discover and rate stores in your area</p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search stores by name or address..."
              className="form-input pl-10 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <select
              className="form-input"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="name">Sort by Name</option>
              <option value="avgRating">Sort by Rating</option>
              <option value="createdAt">Sort by Date</option>
            </select>
            
            <select
              className="form-input"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-gray-600">Filter by rating:</span>
          {['', '4', '3', '2', '1'].map((rating) => (
            <button
              key={rating}
              onClick={() => setRatingFilter(rating)}
              className={`px-3 py-1 text-sm rounded-full border ${
                ratingFilter === rating
                  ? 'bg-blue-100 text-blue-800 border-blue-300'
                  : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
              }`}
            >
              {rating ? `${rating}+ ⭐` : 'All Ratings'}
            </button>
          ))}
        </div>
      </div>

      {/* Stores Grid */}
      {stores.length === 0 ? (
        <div className="text-center py-12">
          <Store className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No stores found</h3>
          <p className="text-gray-600">
            {searchTerm || ratingFilter 
              ? 'Try adjusting your search criteria'
              : 'No stores are available at the moment'
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stores.map((store) => (
            <div key={store.id} className="card hover:shadow-lg transition-shadow">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {store.name}
                </h3>
                
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{store.address}</span>
                </div>
                
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm text-gray-600">Overall Rating:</span>
                  <div className="flex items-center gap-1">
                    {renderStars(Math.round(store.avgRating))}
                    <span className="text-sm font-medium text-gray-700">
                      ({store.avgRating.toFixed(1)})
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="mb-3">
                  <p className="text-sm text-gray-600 mb-2">Your Rating:</p>
                  {store.userRating ? (
                    <div>
                      <div className="flex items-center gap-2">
                        {renderStars(store.userRating)}
                        <span className="text-sm text-gray-600">
                          ({store.userRating}/5)
                        </span>
                      </div>
                      {store.userComment && (
                        <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                          <MessageSquare className="w-4 h-4" />
                          <p className="italic">"{store.userComment}"</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">Not rated yet</p>
                  )}
                </div>

                <form onSubmit={(e) => {
                  e.preventDefault();
                  const pending = pendingRatings[store.id];
                  const currentRating = pending?.rating || store.userRating;
                  const currentComment = pending?.comment !== undefined ? pending.comment : store.userComment;
                  
                  if (currentRating) {
                    handleRatingSubmit(store.id, currentRating, currentComment);
                  } else {
                    toast.error('Please select a star rating first.');
                  }
                }}>
                  <p className="text-sm text-gray-600 mb-2">{store.userRating ? 'Update your rating:' : 'Rate this store:'}</p>
                  <div className="flex items-center gap-1 mb-2">
                    {renderStars(
                      pendingRatings[store.id]?.rating !== undefined 
                        ? pendingRatings[store.id].rating 
                        : store.userRating || 0, 
                      true, 
                      (rating) => setPendingRatings(prev => ({...prev, [store.id]: {...(prev[store.id] || {}), rating}}))
                    )}
                  </div>
                  <textarea
                    className="form-input w-full text-sm"
                    rows="2"
                    placeholder="Add a comment (optional)"
                    value={
                      pendingRatings[store.id]?.comment !== undefined 
                        ? pendingRatings[store.id].comment 
                        : store.userComment || ''
                    }
                    onChange={(e) => 
                      setPendingRatings(prev => ({...prev, [store.id]: {...(prev[store.id] || {}), comment: e.target.value}}))
                    }
                  />
                  <div className="flex gap-2 mt-2">
                    <button type="submit" className="btn btn-primary btn-sm">
                      {store.userRating ? 'Update Rating' : 'Submit Rating'}
                    </button>
                    {(pendingRatings[store.id]?.rating !== undefined || pendingRatings[store.id]?.comment !== undefined) && (
                      <button 
                        type="button" 
                        onClick={() => setPendingRatings(prev => {
                          const updated = { ...prev };
                          delete updated[store.id];
                          return updated;
                        })}
                        className="btn btn-secondary btn-sm"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="mt-8 text-center text-gray-600">
        <p>Showing {stores.length} stores</p>
      </div>
    </div>
  );
};

export default UserDashboard;
