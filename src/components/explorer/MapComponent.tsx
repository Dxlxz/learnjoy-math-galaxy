
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Topic } from '@/types/explorer';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface MapComponentProps {
  topics: Topic[];
  onTopicSelect: (topic: Topic) => void;
}

const MapComponent = ({ topics, onTopicSelect }: MapComponentProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!mapContainer.current) return;

    const initializeMap = async () => {
      try {
        setIsLoading(true);
        // Get the Mapbox token from Supabase
        const { data, error } = await supabase
          .from('app_settings')
          .select('value')
          .eq('key', 'MAPBOX_PUBLIC_TOKEN')
          .maybeSingle();

        if (error) {
          console.error('Error fetching Mapbox token:', error);
          toast.error('Unable to load the map. Please try again later.');
          return;
        }

        if (!data || !data.value || data.value === 'pending_token') {
          console.error('Mapbox token not found or invalid');
          toast.error('Map configuration is incomplete. Please contact support.');
          return;
        }

        // Initialize map
        mapboxgl.accessToken = data.value;
        
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/satellite-streets-v12',
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
          setIsLoading(false);
        });

        // Rotation animation settings
        const secondsPerRevolution = 240;
        const maxSpinZoom = 5;
        const slowSpinZoom = 3;
        let userInteracting = false;
        let spinEnabled = true;

        // Spin globe function
        function spinGlobe() {
          if (!map.current) return;
          
          const zoom = map.current.getZoom();
          if (spinEnabled && !userInteracting && zoom < maxSpinZoom) {
            let distancePerSecond = 360 / secondsPerRevolution;
            if (zoom > slowSpinZoom) {
              const zoomDif = (maxSpinZoom - zoom) / (maxSpinZoom - slowSpinZoom);
              distancePerSecond *= zoomDif;
            }
            const center = map.current.getCenter();
            center.lng -= distancePerSecond;
            map.current.easeTo({ center, duration: 1000, easing: (n) => n });
          }
        }

        // Event listeners for interaction
        map.current.on('mousedown', () => {
          userInteracting = true;
        });
        
        map.current.on('dragstart', () => {
          userInteracting = true;
        });
        
        map.current.on('mouseup', () => {
          userInteracting = false;
          spinGlobe();
        });
        
        map.current.on('touchend', () => {
          userInteracting = false;
          spinGlobe();
        });

        map.current.on('moveend', () => {
          spinGlobe();
        });

        // Start the globe spinning
        spinGlobe();

        map.current.on('error', (e) => {
          console.error('Mapbox error:', e);
          toast.error('There was an error loading the map. Please refresh the page.');
        });

      } catch (error) {
        console.error('Error initializing map:', error);
        toast.error('Unable to initialize the map. Please refresh the page.');
        setIsLoading(false);
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
    if (!map.current || isLoading) return;

    console.log('Adding markers for topics:', topics);

    // Remove existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    // Add new markers for each topic
    topics.forEach(topic => {
      if (!map.current || !topic.map_coordinates) {
        console.log('Skipping topic due to missing coordinates:', topic.title);
        return;
      }

      const coordinates = topic.map_coordinates;
      console.log('Creating marker for topic:', topic.title, 'at coordinates:', coordinates);
      
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
  }, [topics, onTopicSelect, isLoading]);

  return (
    <div className="relative w-full h-[600px] rounded-xl overflow-hidden">
      <div ref={mapContainer} className="absolute inset-0" />
      <div className="absolute inset-0 pointer-events-none 
                      bg-gradient-to-b from-transparent to-background/10 rounded-lg" />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50">
          <div className="text-lg font-semibold text-foreground">Loading map...</div>
        </div>
      )}
    </div>
  );
};

export default MapComponent;
