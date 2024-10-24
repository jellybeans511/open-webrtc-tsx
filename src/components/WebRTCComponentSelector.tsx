import React, { useState } from 'react';
import PureWebRTCComponent from './PureWebRTCComponent';
import SkywayComponent from './SkywayComponent';
import { useStream } from './StreamContext';  // Streamを使っていることを確認

const WebRTCComponentSelector: React.FC = () => {
  const { localStream } = useStream();  // 確実にStreamがラップされているか確認
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
