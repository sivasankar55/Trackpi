import React, { createContext, useState, useCallback } from 'react';

export const ProgressContext = createContext();

export const ProgressProvider = ({ children }) => {
  const [progressVersion, setProgressVersion] = useState(0);

  // Call this function after marking a video as watched
  const notifyProgressChanged = useCallback(() => {
    setProgressVersion(v => v + 1);
  }, []);

  return (
    <ProgressContext.Provider value={{ progressVersion, notifyProgressChanged }}>
      {children}
    </ProgressContext.Provider>
  );
}; 