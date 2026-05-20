import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';

interface HeatPoint {
  lat: number;
  lng: number;
  intensity: number;
}

interface HeatmapLayerProps {
  points: HeatPoint[];
  radius?: number;
  blur?: number;
  max?: number;
}

interface HeatLayer extends L.Layer {
  setLatLngs(latlngs: Array<[number, number, number]>): HeatLayer;
}

interface LeafletHeatStatic {
  heatLayer(latlngs: Array<[number, number, number]>, options?: Record<string, unknown>): HeatLayer;
}

export function HeatmapLayer({ points, radius = 60, blur = 35, max = 1 }: HeatmapLayerProps) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    const factory = (L as unknown as LeafletHeatStatic).heatLayer;
    if (typeof factory !== 'function') return;

    const latlngs: Array<[number, number, number]> = points.map((p) => [p.lat, p.lng, p.intensity]);
    const layer = factory(latlngs, {
      radius,
      blur,
      max,
      minOpacity: 0.35,
      gradient: {
        0.2: '#00897b',
        0.45: '#ffb300',
        0.7: '#f57c00',
        0.9: '#d32f2f',
      },
    });
    layer.addTo(map);
    return () => {
      map.removeLayer(layer);
    };
  }, [map, points, radius, blur, max]);

  return null;
}
