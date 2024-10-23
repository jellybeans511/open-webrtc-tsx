// /src/App.tsx
import React from 'react';
import MediaStreamComponent from './components/MediaStreamComponent';

const App: React.FC = () => {
  return (
    <div className="App">
      <h1>WebRTC Media Stream App</h1>
      <MediaStreamComponent />
    </div>
  );
};

export default App;
