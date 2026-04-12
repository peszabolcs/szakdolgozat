import { ShoppingCenter, Area } from '../types';

/**
 * Converts an array of ShoppingCenters to Areas for map display
 * This allows the InteractiveMap component to be reused for both
 * public (shopping centers) and admin (parking areas) views
 */
export function shoppingCentersToAreas(centers: ShoppingCenter[]): Area[] {
  return centers.map((center) => ({
    id: center.id,
    name: center.name,
    description: center.description,
    capacity: center.capacity,
    occupied: center.occupied,
    status: 'active' as const,
    location: {
      lat: center.location.lat,
      lng: center.location.lng,
      address: center.address,
    },
  }));
}
