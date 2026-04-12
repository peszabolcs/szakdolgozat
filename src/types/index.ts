export interface ParkingSpace {
  id: string;
  status: 'occupied' | 'free';
  areaId: string;
  areaName: string;
  updatedAt: string;
}

export interface Area {
  id: string;
  name: string;
  description: string;
  capacity: number;
  occupied: number;
  status: 'active' | 'inactive';
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
}

export interface DashboardStats {
  total: number;
  occupied: number;
  free: number;
  occupancyRate: number;
}

export interface ShoppingCenter {
  id: string;
  name: string;
  address: string;
  location: {
    lat: number;
    lng: number;
  };
  capacity: number;
  occupied: number;
  openingHours: string;
  imageUrl?: string;
  description: string;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: unknown;
}
