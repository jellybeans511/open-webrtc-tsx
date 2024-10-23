// /src/App.tsx
import React from 'react';
import { StreamProvider } from './StreamContext';
import MediaStreamComponent from './components/MediaStreamComponent';
import SkywayComponent from './components/SkywayComponent';

const App: React.FC = () => {
  return (
    <div className="App">
      <h1>WebRTC Media Stream App</h1>
      <StreamProvider>
        <MediaStreamComponent />
        <SkywayComponent />
      </StreamProvider>
    </div>
  );
};

export default App;
