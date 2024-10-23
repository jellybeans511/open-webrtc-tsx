/// <reference path="../types/skyway-js.d.ts" />
import { MediaConnection } from 'skyway-js';
import React, { useState, useRef,useEffect } from 'react';
import { useStream } from '../StreamContext';
import Peer from 'skyway-js';

const SkywayComponent: React.FC = () => {
  const { localStream} = useStream();
  const [localId, setLocalId] = useState<string>((''));  // 自分のPeer ID
  const [inputId, setInputId] = useState<string>('');           // テキストボックスに入力されたID
  const [remoteId, setRemoteId] = useState<string>('');         // リモートPeerのID
  const [peer, setPeer] = useState<Peer | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (localStream && localVideoRef.current) {
      localVideoRef.current.srcObject = localStream;
      localVideoRef.current.play();
    }
  }, [localStream]);

  // Peer作成
  const makePeer = () => {
    console.log(inputId);

    const newPeer = new (Peer as any)(inputId, {
        key: '94d5c621-415d-4003-a1be-822df987831f',
        debug: 3
      });

    newPeer.on('open', (id: string) => {
      console.log('My peer ID is: ' + id);
      setLocalId(id); // Peer IDがopenしたらIDをセット
    });

    // リモートの通話が開始された時の処理
    newPeer.on('call', (mediaConnection:MediaConnection) => {
        if (localStream) {
            mediaConnection.answer(localStream); // 自分のストリームを送信
          }
          else {
            mediaConnection.answer(); // localStreamがない場合でも処理を進める
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
    if (!peer || !remoteId) return;
    if (!localStream) {
        console.error('Local stream is not available');
        return;
    }

    const mediaConnection = peer.call(remoteId, localStream);
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
      <h1>Skyway P2P Communication</h1>
      <div>
        {/* 自分のPeer IDの入力欄 */}

      <div>
        <p>Current ID: {localId || 'No peer'}</p>
        <video ref={remoteVideoRef} width="480" height="320" playsInline></video>
      </div>

      <input
          type="text"
          placeholder="Kimi No Nawa"
          value={inputId}
          onChange={(e) => setInputId(e.target.value)} // 入力したPeer IDを状態に保存
        />
        <button onClick={makePeer}>Create Peer</button>
      </div>

      <div>
        <input
          type="text"
          placeholder="Remote Peer ID"
          value={remoteId}
          onChange={(e) => setRemoteId(e.target.value)} // リモートPeer IDを設定
        />
        <button onClick={startCall}>Call</button>
        <button onClick={endCall}>End Call</button>
      </div>
    </div>
  );
};

export default SkywayComponent;
