/**
 * Occupancy-related pure helper functions.
 * No mock data here — only utilities that derive UI state from real numbers.
 */

export type OccupancyBand = 'success' | 'warning' | 'error';

/**
 * Map an occupancy rate (0-100) to a semantic colour band.
 * < 60 → success (free), 60-85 → warning (busy), >= 85 → error (full).
 */
export function getOccupancyColor(occupancyRate: number): OccupancyBand {
  if (occupancyRate < 60) return 'success';
  if (occupancyRate < 85) return 'warning';
  return 'error';
}

export interface OccupancyHistoryPoint {
  areaId: string;
  timestamp: string;
  occupied: number;
  capacity: number;
  occupancyRate: number;
}

/**
 * Lightweight client-side synthesizer that generates a plausible 7-day,
 * hour-resolution occupancy history when the backend timeseries endpoint is
 * still being developed. Used only by AdminPage for chart prototyping; the
 * production path is /api/dashboard/occupancy.
 *
 * The shape is preserved (peak hours 10-12 and 17-20, quiet 0-6) so chart
 * code does not need to branch when the real series replaces it.
 */
export function generateOccupancyHistory(areaId: string, capacity: number): OccupancyHistoryPoint[] {
  const history: OccupancyHistoryPoint[] = [];
  const now = new Date();

  for (let day = 6; day >= 0; day--) {
    for (let hour = 0; hour < 24; hour++) {
      const timestamp = new Date(now);
      timestamp.setDate(timestamp.getDate() - day);
      timestamp.setHours(hour, 0, 0, 0);

      let baseOccupancy = 0.5;
      if (hour >= 10 && hour <= 12) baseOccupancy = 0.8;
      else if (hour >= 17 && hour <= 20) baseOccupancy = 0.9;
      else if (hour <= 6) baseOccupancy = 0.2;
      else if (hour >= 22) baseOccupancy = 0.3;

      const randomFactor = 0.8 + Math.random() * 0.4;
      const occupied = Math.min(capacity, Math.floor(capacity * baseOccupancy * randomFactor));
      const occupancyRate = capacity > 0 ? (occupied / capacity) * 100 : 0;

      history.push({
        areaId,
        timestamp: timestamp.toISOString(),
        occupied,
        capacity,
        occupancyRate: Math.min(occupancyRate, 100),
      });
    }
  }
  return history;
}
