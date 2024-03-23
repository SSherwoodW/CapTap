import React from "react";


/** Loading message used by components that fetch API data. */

function LoadingSpinner() {
  return (
      <div data-testid="loading-spinner" className="LoadingSpinner">
        Loading ...
      </div>
  );
}

export default LoadingSpinner;