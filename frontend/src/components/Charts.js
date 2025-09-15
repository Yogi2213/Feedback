import React from 'react';

// Simple Bar Chart Component
export const BarChart = ({ data, title, className = '' }) => {
  const maxValue = Math.max(...data.map(item => item.value));
  
  return (
    <div className={`${className}`}>
      {title && <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">{title}</h4>}
      <div className="space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="w-16 text-sm text-gray-600 dark:text-gray-400 text-right">
              {item.label}
            </div>
            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-4 relative overflow-hidden">
              <div
                className="bg-blue-500 dark:bg-blue-400 h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(item.value / maxValue) * 100}%` }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  {item.value}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Simple Line Chart Component (using CSS)
export const LineChart = ({ data, title, className = '' }) => {
  return (
    <div className={`${className}`}>
      {title && <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">{title}</h4>}
      <div className="relative h-32 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <div className="flex items-end justify-between h-full">
          {data.map((item, index) => (
            <div key={index} className="flex flex-col items-center gap-1">
              <div className="text-xs text-gray-600 dark:text-gray-400">
                {item.value}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Donut Chart Component
export const DonutChart = ({ data, title, className = '' }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className={`${className}`}>
      {title && <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">{title}</h4>}
      <div className="flex items-center gap-4">
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900 dark:text-gray-100">{total}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Total</div>
        </div>
        <div className="flex-1 space-y-2">
          {data.map((item, index) => {
            const percentage = total > 0 ? ((item.value / total) * 100).toFixed(1) : 0;
            return (
              <div key={index} className="flex items-center gap-2">
                <div className="flex-1 text-sm text-gray-700 dark:text-gray-300">
                  {item.label}
                </div>
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {item.value} ({percentage}%)
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Growth Chart Component
export const GrowthChart = ({ data, title, className = '' }) => {
  return (
    <div className={`${className}`}>
      {title && <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">{title}</h4>}
      <div className="grid grid-cols-2 gap-4">
        {data.map((item, index) => {
          const isPositive = item.change >= 0;
          return (
            <div key={index} className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {item.value}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                {item.label}
              </div>
              <div className={`text-xs font-medium ${
                isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {isPositive ? '+' : ''}{item.change}% vs last month
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
