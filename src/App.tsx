// /src/App.tsx
import React from 'react';
import { StreamProvider } from './components/StreamContext';
import MediaStreamComponent from './components/MediaStreamComponent';
import WebRTCComponentSelector from './components/WebRTCComponentSelector';

const App: React.FC = () => {
  return (
    <div className="App">
      <h1>WebRTC Media Stream App</h1>
      <StreamProvider>
        <MediaStreamComponent />
        <WebRTCComponentSelector />
      </StreamProvider>
    </div>
  );
};

export default App;
