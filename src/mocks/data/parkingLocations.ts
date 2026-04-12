import type { Area } from '../../types';

/**
 * Mock parking locations with real Budapest coordinates
 * Locations include major shopping centers and parking facilities
 */
export const parkingLocations: Area[] = [
  {
    id: 'area-1',
    name: 'Tesco Fogarasi',
    description: 'Large shopping center parking',
    capacity: 250,
    occupied: 180,
    status: 'active',
    location: {
      lat: 47.4464,
      lng: 19.1694,
      address: 'Budapest, Fogarasi út 3-5, 1148',
    },
  },
  {
    id: 'area-2',
    name: 'Auchan Soroksár',
    description: 'Hypermarket parking facility',
    capacity: 300,
    occupied: 220,
    status: 'active',
    location: {
      lat: 47.4164,
      lng: 19.1425,
      address: 'Budapest, Bevásárló utca 2, 1239',
    },
  },
  {
    id: 'area-3',
    name: 'Arena Plaza',
    description: 'Major shopping mall parking',
    capacity: 400,
    occupied: 350,
    status: 'active',
    location: {
      lat: 47.5004,
      lng: 19.0986,
      address: 'Budapest, Kerepesi út 9, 1087',
    },
  },
  {
    id: 'area-4',
    name: 'WestEnd City Center',
    description: 'Downtown mall underground parking',
    capacity: 500,
    occupied: 480,
    status: 'active',
    location: {
      lat: 47.5105,
      lng: 19.0567,
      address: 'Budapest, Váci út 1-3, 1062',
    },
  },
  {
    id: 'area-5',
    name: 'Lidl Kőbánya',
    description: 'Supermarket parking area',
    capacity: 100,
    occupied: 45,
    status: 'active',
    location: {
      lat: 47.4789,
      lng: 19.1236,
      address: 'Budapest, Könyves Kálmán körút 12-14, 1097',
    },
  },
  {
    id: 'area-6',
    name: 'Allee Shopping Center',
    description: 'Multi-level parking garage',
    capacity: 350,
    occupied: 280,
    status: 'active',
    location: {
      lat: 47.4756,
      lng: 19.0542,
      address: 'Budapest, Október huszonharmadika u. 8-10, 1117',
    },
  },
  {
    id: 'area-7',
    name: 'MOM Park',
    description: 'Shopping center parking',
    capacity: 280,
    occupied: 200,
    status: 'active',
    location: {
      lat: 47.4978,
      lng: 19.0234,
      address: 'Budapest, Alkotás u. 53, 1123',
    },
  },
  {
    id: 'area-8',
    name: 'Árkád Budapest',
    description: 'Shopping mall parking facility',
    capacity: 320,
    occupied: 260,
    status: 'active',
    location: {
      lat: 47.5189,
      lng: 19.0489,
      address: 'Budapest, Örs vezér tere 25/A, 1106',
    },
  },
  {
    id: 'area-9',
    name: 'Corvin Plaza',
    description: 'Urban shopping center parking',
    capacity: 200,
    occupied: 150,
    status: 'active',
    location: {
      lat: 47.4856,
      lng: 19.0756,
      address: 'Budapest, Futó u. 37-45, 1082',
    },
  },
  {
    id: 'area-10',
    name: 'Lurdy Ház',
    description: 'Community center parking',
    capacity: 180,
    occupied: 90,
    status: 'active',
    location: {
      lat: 47.4556,
      lng: 19.0667,
      address: 'Budapest, Könyves Kálmán krt. 12-14, 1097',
    },
  },
  {
    id: 'area-11',
    name: 'Duna Plaza',
    description: 'Riverside shopping mall parking',
    capacity: 380,
    occupied: 320,
    status: 'active',
    location: {
      lat: 47.5567,
      lng: 19.1236,
      address: 'Budapest, Váci út 178, 1138',
    },
  },
  {
    id: 'area-12',
    name: 'Tesco Újpest',
    description: 'Hypermarket parking lot',
    capacity: 220,
    occupied: 160,
    status: 'active',
    location: {
      lat: 47.5678,
      lng: 19.0889,
      address: 'Budapest, Váci út 200, 1138',
    },
  },
  {
    id: 'area-13',
    name: 'Pólus Center',
    description: 'Large mall parking facility',
    capacity: 450,
    occupied: 380,
    status: 'active',
    location: {
      lat: 47.5456,
      lng: 19.1567,
      address: 'Budapest, Szentmihályi út 131, 1152',
    },
  },
  {
    id: 'area-14',
    name: 'Mammut Mall',
    description: 'Two-building shopping complex parking',
    capacity: 420,
    occupied: 340,
    status: 'active',
    location: {
      lat: 47.5089,
      lng: 19.0267,
      address: 'Budapest, Lövőház u. 2-6, 1024',
    },
  },
  {
    id: 'area-15',
    name: 'Auchan Budaörs',
    description: 'Hypermarket parking',
    capacity: 380,
    occupied: 280,
    status: 'active',
    location: {
      lat: 47.4523,
      lng: 18.9645,
      address: 'Budaörs, Neumann János u. 1, 2040',
    },
  },
];

/**
 * Historical occupancy data for charts (last 7 days)
 * Used for trend analysis and predictions
 */
export interface OccupancyHistory {
  areaId: string;
  timestamp: string;
  occupied: number;
  capacity: number;
  occupancyRate: number;
}

export const generateOccupancyHistory = (areaId: string, capacity: number): OccupancyHistory[] => {
  const history: OccupancyHistory[] = [];
  const now = new Date();

  // Generate hourly data for the last 7 days
  for (let day = 6; day >= 0; day--) {
    for (let hour = 0; hour < 24; hour++) {
      const timestamp = new Date(now);
      timestamp.setDate(timestamp.getDate() - day);
      timestamp.setHours(hour, 0, 0, 0);

      // Simulate realistic occupancy patterns
      // Peak hours: 10-12, 17-20
      // Low hours: 0-6, 22-24
      let baseOccupancy = 0.5;
      if (hour >= 10 && hour <= 12) baseOccupancy = 0.8;
      else if (hour >= 17 && hour <= 20) baseOccupancy = 0.9;
      else if (hour >= 0 && hour <= 6) baseOccupancy = 0.2;
      else if (hour >= 22) baseOccupancy = 0.3;

      // Add some randomness
      const randomFactor = 0.8 + Math.random() * 0.4; // 0.8 to 1.2
      const occupied = Math.floor(capacity * baseOccupancy * randomFactor);
      const occupancyRate = (occupied / capacity) * 100;

      history.push({
        areaId,
        timestamp: timestamp.toISOString(),
        occupied: Math.min(occupied, capacity),
        capacity,
        occupancyRate: Math.min(occupancyRate, 100),
      });
    }
  }

  return history;
};

/**
 * Get occupancy color based on availability
 */
export const getOccupancyColor = (occupancyRate: number): 'success' | 'warning' | 'error' => {
  if (occupancyRate < 50) return 'success'; // Green - plenty of space
  if (occupancyRate < 85) return 'warning'; // Yellow - moderate
  return 'error'; // Red - nearly full
};

/**
 * Calculate distance between two coordinates (Haversine formula)
 */
export const calculateDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number => {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};
