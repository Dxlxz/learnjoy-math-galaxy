
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Topic } from '@/types/explorer';
import { supabase } from '@/integrations/supabase/client';

interface MapComponentProps {
  topics: Topic[];
  onTopicSelect: (topic: Topic) => void;
}

const MapComponent = ({ topics, onTopicSelect }: MapComponentProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!mapContainer.current) return;

    const initializeMap = async () => {
      try {
        // Get the Mapbox token from Supabase
        const { data: { value: mapboxToken } } = await supabase
          .from('app_settings')
          .select('value')
          .eq('key', 'MAPBOX_PUBLIC_TOKEN')
          .single();

        if (!mapboxToken) {
          console.error('Mapbox token not found');
          return;
        }

        // Initialize map
        mapboxgl.accessToken = mapboxToken;
        
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/satellite-streets-v12', // Changed to a valid style
          projection: 'globe',
          zoom: 1.5,
          center: [0, 20],
          pitch: 45,
        });

        // Add navigation controls
        map.current.addControl(
          new mapboxgl.NavigationControl({
            visualizePitch: true,
          }),
          'top-right'
        );

        // Add atmosphere and fog effects
        map.current.on('style.load', () => {
          map.current?.setFog({
            color: 'rgb(255, 255, 255)',
            'high-color': 'rgb(200, 200, 225)',
            'horizon-blend': 0.2,
          });
        });
      } catch (error) {
        console.error('Error initializing map:', error);
      }
    };

    initializeMap();

    return () => {
      markers.current.forEach(marker => marker.remove());
      map.current?.remove();
    };
  }, []);

  // Add markers for topics
  useEffect(() => {
    if (!map.current) return;

    // Remove existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    // Add new markers for each topic
    topics.forEach(topic => {
      if (!map.current || !topic.map_coordinates) return;

      const coordinates = topic.map_coordinates as { longitude: number; latitude: number };
      
      // Create marker element
      const el = document.createElement('div');
      el.className = 'topic-marker';
      el.innerHTML = `
        <div class="w-8 h-8 bg-primary/90 rounded-full flex items-center justify-center
                    shadow-lg hover:bg-primary transition-colors cursor-pointer
                    border-2 border-white">
          <span class="text-white text-sm font-bold">${topic.grade}</span>
        </div>
      `;

      // Create popup
      const popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(`
          <div class="p-2">
            <h3 class="font-bold text-sm">${topic.title}</h3>
            ${topic.description ? `<p class="text-xs mt-1">${topic.description}</p>` : ''}
          </div>
        `);

      // Create and add marker
      const marker = new mapboxgl.Marker(el)
        .setLngLat([coordinates.longitude, coordinates.latitude])
        .setPopup(popup)
        .addTo(map.current);

      // Add click handler
      el.addEventListener('click', () => {
        onTopicSelect(topic);
      });

      markers.current.push(marker);
    });
  }, [topics, onTopicSelect]);

  return (
    <div className="relative w-full h-[600px] rounded-xl overflow-hidden">
      <div ref={mapContainer} className="absolute inset-0" />
      <div className="absolute inset-0 pointer-events-none 
                      bg-gradient-to-b from-transparent to-background/10 rounded-lg" />
    </div>
  );
};

export default MapComponent;

