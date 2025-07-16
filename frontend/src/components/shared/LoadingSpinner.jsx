import React from "react";

const LoadingSpinner = React.memo(() => {
  return (
    <div
      className="flex justify-center items-center h-64"
      aria-label="Loading content"
    >
      <div className="relative loading-spinner">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-6 h-6 bg-blue-600 rounded-full animate-pulse"></div>
        </div>
      </div>
      <span className="ml-3 text-gray-600 sr-only">Loading...</span>
    </div>
  );
});

LoadingSpinner.displayName = "LoadingSpinner";


export default LoadingSpinner;
