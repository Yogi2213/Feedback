import React from 'react';

const badgeVariants = {
  variant: {
    default: "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg",
    secondary: "bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 text-gray-900 dark:text-gray-100",
    destructive: "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg",
    success: "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg",
    warning: "bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg",
    outline: "border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-transparent"
  },
  size: {
    default: "px-3 py-1 text-xs",
    sm: "px-2 py-0.5 text-xs",
    lg: "px-4 py-2 text-sm"
  }
};

const Badge = React.forwardRef(({ 
  className = "", 
  variant = "default", 
  size = "default",
  ...props 
}, ref) => {
  const baseClasses = "inline-flex items-center rounded-full font-semibold transition-all duration-300 hover:scale-105";
  const variantClasses = badgeVariants.variant[variant] || badgeVariants.variant.default;
  const sizeClasses = badgeVariants.size[size] || badgeVariants.size.default;
  
  return (
    <div
      ref={ref}
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`}
      {...props}
    />
  );
});

Badge.displayName = "Badge";

export { Badge, badgeVariants };
