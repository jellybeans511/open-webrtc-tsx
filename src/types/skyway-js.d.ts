declare module 'skyway-js' {
    export default class Peer {
      constructor(id?: string | null, options?: any);
      on(event: string, callback: (data?: any) => void): void;
      call(peerId: string, stream?: MediaStream, options?: any): MediaConnection;
      connect(peerId: string, options?: any): DataConnection;
    }
  
    export class MediaConnection {
      answer(stream?: MediaStream | null): void;
      on(event: string, callback: (data?: any) => void): void;
      close(): void;
    }
  
    export class DataConnection {
      send(data: any): void;
      on(event: string, callback: (data?: any) => void): void;
      close(): void;
    }
  }
  