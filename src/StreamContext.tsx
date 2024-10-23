import React, { createContext, useState, useContext } from 'react';

// Contextを作成する
const StreamContext = createContext<{
  localStream: MediaStream | null;
  setLocalStream: React.Dispatch<React.SetStateAction<MediaStream | null>>;
} | null>(null);

// Providerコンポーネントを作成
export const StreamProvider = ({ children }: { children: React.ReactNode }) => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);

  return (
    <StreamContext.Provider value={{ localStream, setLocalStream }}>
      {children}
    </StreamContext.Provider>
  );
};

// useStreamフックでどこからでもContextにアクセス可能に
export const useStream = () => {
  const context = useContext(StreamContext);
  if (!context) {
    throw new Error('useStream must be used within a StreamProvider');
  }
  return context;
};
