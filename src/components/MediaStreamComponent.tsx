import React, { useEffect, useState, useRef } from 'react';

const MediaStreamComponent: React.FC = () => {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('default');
  const [videoWidth, setVideoWidth] = useState<number>(1920);
  const [videoHeight, setVideoHeight] = useState<number>(1080);
  const [frameRate, setFrameRate] = useState<number>(30);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [estimatedLatency, setEstimatedLatency] = useState<number | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);

  // メディアデバイスを列挙して選択肢をセットする
  useEffect(() => {
    const populateCameras = async () => {
      const mediaDevices = await navigator.mediaDevices.enumerateDevices();
      const videoInputDevices = mediaDevices.filter(device => device.kind === 'videoinput');
      setDevices(videoInputDevices);
    };

    populateCameras();

    // デバイスの変更を監視
    navigator.mediaDevices.addEventListener('devicechange', populateCameras);

    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', populateCameras);
    };
  }, []);

  // カメラストリームを取得
  const getCameraStream = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        //video: true,
        video: {
          width: videoWidth,
          height: videoHeight,
          frameRate: frameRate,
          deviceId: selectedDeviceId === 'default' ? undefined : selectedDeviceId
        },
        audio: false
      });

      setLocalStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }

      const videoTrack = mediaStream.getVideoTracks()[0];
      const settings = videoTrack.getSettings();
      setEstimatedLatency(settings.latency ?? null);
    } catch (err) {
      console.error('Error accessing media devices.', err);
    }
  };

  // デバイス選択時のハンドラ
  const handleDeviceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDeviceId(e.target.value);
  };

  // ストリームを停止
  const stopStream = () => {
    localStream?.getTracks().forEach(track => track.stop());
    setLocalStream(null);
  };

  return (
    <div>
      <div className="local-stream">
        <video ref={videoRef} width={480} height={320} playsInline></video>
        <p>Estimated camera latency: {estimatedLatency ? `${estimatedLatency} sec` : 'N/A'}</p>
        <form>
          <label>
            Camera Capture
            <input type="radio" name="stream-type" value="camera" defaultChecked />
          </label>
          <label>
            Screen Share
            <input type="radio" name="stream-type" value="screen" />
          </label>
        </form>
        <label>
          Select Device:
          <select onChange={handleDeviceChange} value={selectedDeviceId}>
            <option value="default">(default camera)</option>
            <option value="false">(no camera)</option>
            {devices.map(device => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label || `Camera ${device.deviceId}`}
              </option>
            ))}
          </select>
          <br />
        </label>
        <label>
          Video Height:
          <input
            type="number"
            value={videoHeight}
            onChange={(e) => setVideoHeight(Number(e.target.value))}
            max={4320}
          />
        </label>
        <label>
          Video Width:
          <input
            type="number"
            value={videoWidth}
            onChange={(e) => setVideoWidth(Number(e.target.value))}
            max={7680}
          />
        </label>
        <label>
          Frame Rate:
          <input
            type="number"
            value={frameRate}
            onChange={(e) => setFrameRate(Number(e.target.value))}
            min={1}
            max={60}
          /> Hz
        </label>
        <br />
        <button onClick={getCameraStream}>Get Capture</button>
        <button onClick={stopStream}>Delete Capture Source</button>
      </div>
    </div>
  );
};

export default MediaStreamComponent;
