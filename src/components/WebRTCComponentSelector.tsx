import React, { useState } from 'react';
import PureWebRTCComponent from './PureWebRTCComponent';
import SkywayComponent from './SkywayComponent';
import { useStream } from './StreamContext';

const WebRTCComponentSelector: React.FC = () => {
  const [selectedComponent, setSelectedComponent] = useState<'skyway' | 'pureWebRTC'>('skyway');

  return (
    <div>
      <h2>WebRTC Component Selector</h2>
      <div>
        <label>
          <input
            type="radio"
            value="skyway"
            checked={selectedComponent === 'skyway'}
            onChange={() => setSelectedComponent('skyway')}
          />
          Skyway
        </label>
        <label>
          <input
            type="radio"
            value="pureWebRTC"
            checked={selectedComponent === 'pureWebRTC'}
            onChange={() => setSelectedComponent('pureWebRTC')}
          />
          Pure WebRTC
        </label>
      </div>
  
      <div>
        {selectedComponent === 'skyway' ? <SkywayComponent /> : <PureWebRTCComponent />}
      </div>
    </div>
  );
};

export default WebRTCComponentSelector;
