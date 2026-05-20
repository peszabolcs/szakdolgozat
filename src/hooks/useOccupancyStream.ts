import { useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

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

export interface StreamState {
  connected: boolean;
  lastSnapshot: OccupancySnapshot | null;
  lastEventAt: string | null;
  error: string | null;
}

export function useOccupancyStream(enabled = true): StreamState {
  const [state, setState] = useState<StreamState>({
    connected: false,
    lastSnapshot: null,
    lastEventAt: null,
    error: null,
  });
  const queryClient = useQueryClient();
  const esRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (!enabled) {
      esRef.current?.close();
      esRef.current = null;
      return;
    }
    if (typeof EventSource === 'undefined') return;

    const es = new EventSource('/api/stream/occupancy');
    esRef.current = es;

    es.addEventListener('open', () => {
      setState((s) => ({ ...s, connected: true, error: null }));
    });

    es.addEventListener('snapshot', (event) => {
      try {
        const data = JSON.parse((event as MessageEvent).data) as OccupancySnapshot;
        setState((s) => ({ ...s, connected: true, lastSnapshot: data, lastEventAt: data.recordedAt, error: null }));
        // Invalidate caches so consumers refetch derived data.
        queryClient.invalidateQueries({ queryKey: ['shopping-centers'] });
        queryClient.invalidateQueries({ queryKey: ['dashboard', 'stats'] });
      } catch {
        // ignore parse errors
      }
    });

    es.addEventListener('error', () => {
      setState((s) => ({ ...s, connected: false, error: 'A valós idejű csatorna lecsatlakozott; újrakapcsolódás folyamatban.' }));
    });

    return () => {
      es.close();
      esRef.current = null;
      setState((s) => ({ ...s, connected: false }));
    };
  }, [enabled, queryClient]);

  return state;
}
