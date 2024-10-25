import React, { createContext, useState, useContext } from 'react';

const StreamContext = createContext<{
  localStream: MediaStream | null;
  setLocalStream: React.Dispatch<React.SetStateAction<MediaStream | null>>;
} | null>(null);

export const StreamProvider = ({ children }: { children: React.ReactNode }) => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);

  return (
    <StreamContext.Provider value={{ localStream, setLocalStream }}>
      {children}
    </StreamContext.Provider>
  );
};

export const useStream = () => {
  const context = useContext(StreamContext);
  console.log("useStream context: ", context);
  if (!context) {
    throw new Error('useStream must be used within a StreamProvider');
  }
  return context;
};
