import { EventEmitter } from 'node:events';

export interface OccupancyUpdate {
  centerId: string;
  occupied: number;
  capacity: number;
  ratio: number;
  recordedAt: string;
}

export interface OccupancySnapshot {
  centers: OccupancyUpdate[];
  recordedAt: string;
}

class TypedBus extends EventEmitter {
  emitSnapshot(snapshot: OccupancySnapshot): void {
    this.emit('snapshot', snapshot);
  }
  onSnapshot(listener: (snapshot: OccupancySnapshot) => void): () => void {
    this.on('snapshot', listener);
    return () => this.off('snapshot', listener);
  }
}

export const occupancyBus = new TypedBus();
occupancyBus.setMaxListeners(50);
