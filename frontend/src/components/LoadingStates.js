import React from 'react';

// Skeleton Card Component
export const SkeletonCard = ({ className = "" }) => (
  <div className={`modern-card p-6 animate-pulse ${className}`}>
    <div className="flex items-center space-x-4 mb-4">
      <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
      <div className="flex-1">
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
      </div>
    </div>
    <div className="space-y-2">
      <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded"></div>
      <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
      <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-4/6"></div>
    </div>
    <div className="flex justify-between items-center mt-4">
      <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-20"></div>
      <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-24"></div>
    </div>
  </div>
);

// Skeleton Table Row
export const SkeletonTableRow = () => (
  <tr className="animate-pulse">
    <td className="px-6 py-4">
      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-32"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-48"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-24"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
    </td>
    <td className="px-6 py-4">
      <div className="flex space-x-2">
        <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-8"></div>
        <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-8"></div>
        <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-8"></div>
      </div>
    </td>
  </tr>
);

// Enhanced Loading Spinner
export const LoadingSpinner = ({ size = "md", text = "Loading..." }) => {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-10 h-10", 
    lg: "w-16 h-16",
    xl: "w-24 h-24"
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className={`loading-modern ${sizeClasses[size]} mb-4`}></div>
      <div className="loading-dots mb-2">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <p className="text-gray-600 dark:text-gray-400 font-medium">{text}</p>
    </div>
  );
};

// Skeleton Dashboard Stats
export const SkeletonStats = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="modern-card p-6 animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
          <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded"></div>
        </div>
        <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-20 mb-2"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-32"></div>
      </div>
    ))}
  </div>
);

// Skeleton Chart
export const SkeletonChart = ({ height = "300px" }) => (
  <div className="modern-card p-6 animate-pulse">
    <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-48 mb-4"></div>
    <div 
      className="bg-gray-300 dark:bg-gray-600 rounded"
      style={{ height }}
    ></div>
  </div>
);

// Page Loading Overlay
export const PageLoadingOverlay = ({ isVisible, message = "Loading data..." }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="modern-card p-8 max-w-sm w-full mx-4">
        <LoadingSpinner size="lg" text={message} />
        <div className="progress-bar progress-animated mt-4"></div>
      </div>
    </div>
  );
};

// Skeleton Grid
export const SkeletonGrid = ({ count = 6, columns = 3 }) => {
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-6`}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
};

// Data Fetching Error State
export const ErrorState = ({ 
  title = "Failed to load data", 
  message = "Something went wrong while fetching the data. Please try again.",
  onRetry,
  showRetry = true 
}) => (
  <div className="modern-card p-12 text-center">
    <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
      <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
    <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">{message}</p>
    {showRetry && onRetry && (
      <button 
        onClick={onRetry}
        className="btn-modern hover-lift"
      >
        Try Again
      </button>
    )}
  </div>
);

// Empty State
export const EmptyState = ({ 
  title = "No data found", 
  message = "There's no data to display at the moment.",
  icon = null,
  action = null 
}) => (
  <div className="modern-card p-12 text-center">
    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
      {icon || (
        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      )}
    </div>
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
    <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">{message}</p>
    {action}
  </div>
);
