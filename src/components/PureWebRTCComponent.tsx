import React, { useRef, useEffect } from 'react';
import { useStream } from './StreamContext';
import Peer from 'skyway-js';

const PureWebRTCComponent: React.FC = () => {
  console.log("PureWebRTCComponent is trying to access useStream");
  const { localStream } = useStream();
  const [remoteStream, setRemoteStream] = React.useState<MediaStream | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const [remoteId, setRemoteId] = React.useState<string>('');

  const [signalingAddress, setSignalingAddress] = React.useState<string>('');
  const [signalingPort, setSignalingPort] = React.useState<string>('');
  const [iceServerAddress, setIceServerAddress] = React.useState<string>('stun.l.google.com');
  const [iceServerPort, setIceServerPort] = React.useState<string>('19302');
  const [iceServerType, setIceServerType] = React.useState<'stun' | 'turn'>('stun');

  useEffect(() => {
    if (localStream && localVideoRef.current) {
      localVideoRef.current.srcObject = localStream;
      localVideoRef.current.play();
    }
  }, [localStream]);

  const createPeerConnection = () => {
    const configuration = {
      iceServers: [
        { urls: `${iceServerType}:${iceServerAddress}:${iceServerPort}` }
      ],
    } as RTCConfiguration;
    peerConnection.current = new RTCPeerConnection(configuration);

    peerConnection.current.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
        setRemoteStream(event.streams[0]);
      }
    };

    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        console.log('New ICE candidate:', JSON.stringify(event.candidate));
      }
    };

    if (localStream) {
      localStream.getTracks().forEach(track => {
        peerConnection.current?.addTrack(track, localStream);
      });
    }
  };

  const createOffer = async () => {
    createPeerConnection();

    const offer = await peerConnection.current?.createOffer();
    if (!offer) return;
    await peerConnection.current?.setLocalDescription(offer);

    console.log(
      `Offer created with signaling ${signalingAddress}:${signalingPort} and ${iceServerType} server ${iceServerAddress}:${iceServerPort}`,
      JSON.stringify(offer)
    );
  };

  const handleAnswer = async (answer: RTCSessionDescriptionInit) => {
    await peerConnection.current?.setRemoteDescription(new RTCSessionDescription(answer));
    console.log('Answer received and set.');
  };

  const handleOffer = async (offer: RTCSessionDescriptionInit) => {
    createPeerConnection();

    await peerConnection.current?.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peerConnection.current?.createAnswer();
    await peerConnection.current?.setLocalDescription(answer);

    console.log('Answer created:', JSON.stringify(answer));
  };

  return (
    <div>
      <h2>Pure WebRTC Component</h2>
      <div>
        <video ref={remoteVideoRef} autoPlay playsInline width="320" height="240"></video>
      </div>
      <div>
        <div>
          <label>
            Signaling Address:
            <input
              type="text"
              value={signalingAddress}
              onChange={(e) => setSignalingAddress(e.target.value)}
              placeholder="127.0.0.1"
            />
          </label>
          <label>
            Signaling Port:
            <input
              type="text"
              value={signalingPort}
              onChange={(e) => setSignalingPort(e.target.value)}
              placeholder="5000"
            />
          </label>
        </div>
        <div>
          <label>
            ICE Server Type:
            <select value={iceServerType} onChange={(e) => setIceServerType(e.target.value as 'stun' | 'turn')}>
              <option value="stun">STUN</option>
              <option value="turn">TURN</option>
            </select>
          </label>
          <label>
            Server Address:
            <input
              type="text"
              value={iceServerAddress}
              onChange={(e) => setIceServerAddress(e.target.value)}
              placeholder="stun.example.com"
            />
          </label>
          <label>
            Port:
            <input
              type="text"
              value={iceServerPort}
              onChange={(e) => setIceServerPort(e.target.value)}
              placeholder="3478"
            />
          </label>
        </div>
        <button onClick={createOffer}>Create Offer</button>
        {/* オファーを受け取るには handleOffer を外部の signaling server から呼び出す */}
        <input
          type="text"
          value={remoteId}
          onChange={(e) => setRemoteId(e.target.value)}
          placeholder="Remote Peer ID"
        />
        <button
          onClick={() => {
            // 仮にAnswerが受信される場合の例（この部分はsignalingサーバで実際には外部から受け取る）
            const dummyAnswer: RTCSessionDescriptionInit = {
              type: 'answer',
              sdp: '', // 実際のAnswerのSDP
            };
            handleAnswer(dummyAnswer);
          }}
        >
          Receive Answer
        </button>
      </div>
    </div>
  );
};

export default PureWebRTCComponent;
