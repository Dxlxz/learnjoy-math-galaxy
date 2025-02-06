
import React from 'react';
import mapboxgl from 'mapbox-gl';
import { MapRegion } from '@/types/map';

interface MapRegionsProps {
  map: mapboxgl.Map;
  regions: MapRegion[];
}

const MapRegions: React.FC<MapRegionsProps> = ({ map, regions }) => {
  React.useEffect(() => {
    regions.forEach((region) => {
      const regionId = `region-${region.name}`;
      
      if (map.getLayer(regionId)) {
        map.removeLayer(regionId);
      }
      if (map.getSource(regionId)) {
        map.removeSource(regionId);
      }

      map.addSource(regionId, {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Polygon',
            coordinates: [[
              [region.bounds.west, region.bounds.north],
              [region.bounds.east, region.bounds.north],
              [region.bounds.east, region.bounds.south],
              [region.bounds.west, region.bounds.south],
              [region.bounds.west, region.bounds.north]
            ]]
          }
        }
      });

      map.addLayer({
        id: regionId,
        type: 'fill',
        source: regionId,
        layout: {},
        paint: {
          'fill-color': region.color,
          'fill-opacity': 0.2
        }
      });
    });

    return () => {
      regions.forEach((region) => {
        const regionId = `region-${region.name}`;
        if (map.getLayer(regionId)) {
          map.removeLayer(regionId);
        }
        if (map.getSource(regionId)) {
          map.removeSource(regionId);
        }
      });
    };
  }, [map, regions]);

  return null;
};

export default MapRegions;
