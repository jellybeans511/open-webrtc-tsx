/// <reference path="../types/skyway-js.d.ts" />
import { MediaConnection } from 'skyway-js';
import React, { useState, useRef,useEffect } from 'react';
import { useStream } from './StreamContext';
import Peer from 'skyway-js';

const SkywayComponent: React.FC = () => {
  console.log("SkywayComponent is trying to access useStream");
  const { localStream} = useStream();
  const [localId, setLocalId] = useState<string>((''));
  const [inputId, setInputId] = useState<string>('');
  const [remoteId, setRemoteId] = useState<string>('');
  const [peer, setPeer] = useState<Peer | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  const alphanumericPattern = /^[a-zA-Z0-9]+$/;

  useEffect(() => {
    if (localStream && localVideoRef.current) {
      localVideoRef.current.srcObject = localStream;
      localVideoRef.current.play();
    }
  }, [localStream]);

  // Peer作成
  const makePeer = () => {
    console.log(process.env);

    if (!alphanumericPattern.test(inputId)) {
      console.error('Error: Peer ID must contain only alphanumeric characters.');
      alert('Peer ID must contain only alphanumeric characters. Please confirm your Input ID.');
      return;
    }

    const apiKey = "94d5c621-415d-4003-a1be-822df987831f";

    if (!apiKey) {
      console.error('API key is not defined');
      return;
    }

    const newPeer = new Peer(inputId, {
        key: apiKey,
        debug: 3
      });

    newPeer.on('open', (id: string) => {
      console.log('My peer ID is: ' + id);
      setLocalId(id); // Peer IDがopenしたらIDをセット
    });

    // リモートの通話が開始された時の処理
    newPeer.on('call', (mediaConnection:MediaConnection) => {
        if (localStream) {
            mediaConnection.answer(localStream);
          }
          else {
            mediaConnection.answer();
          }
      mediaConnection.on('stream', (stream:MediaStream) => {
        setRemoteStream(stream);
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = stream;
        }
      });
    });

    newPeer.on('error', (err:Error) => {
        console.error('Peer creation error: ', err);
      });

      setPeer(newPeer);
  };

  // 通話を発信
  const startCall = () => {

    if (!alphanumericPattern.test(remoteId)) {
      console.error('Error: Remote Peer ID must contain only alphanumeric characters.');
      alert('Remote Peer ID must contain only alphanumeric characters. Please confirm your Remote Peer ID.');
      return;
    }

    if (!peer || !remoteId) {
        console.error('Peer is not available');
        return;
    }

    const mediaConnection = peer.call(remoteId, localStream || undefined);
    
    mediaConnection.on('stream', (stream:MediaStream) => {
      setRemoteStream(stream);
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = stream;
        remoteVideoRef.current.play();
      }
    });
  };

  // 通話終了
  const endCall = () => {
    if (remoteStream) {
      remoteStream.getTracks().forEach(track => track.stop());
      setRemoteStream(null);
    }
  };

  return (
    <div>
      <h2>Skyway P2P Communication</h2>
      <div>
      <div>
        <video ref={remoteVideoRef} width="480" height="320" playsInline></video>
      </div>
      <div>
        <p>Current ID: {localId || 'No peer'}</p>
      </div>
      <input
          type="text"
          placeholder="Kimi No Nawa"
          value={inputId}
          onChange={(e) => setInputId(e.target.value)}
        />
        <button onClick={makePeer}>Create Peer</button>
      </div>

      <div>
        <input
          type="text"
          placeholder="Remote Peer ID"
          value={remoteId}
          onChange={(e) => setRemoteId(e.target.value)}
        />
        <button onClick={startCall}>Call</button>
        <button onClick={endCall}>End Call</button>
      </div>
    </div>
  );
};

export default SkywayComponent;
