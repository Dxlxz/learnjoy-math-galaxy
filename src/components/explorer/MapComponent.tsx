
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

    // Remove existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    // Add new markers for each topic
    topics.forEach(topic => {
      const coordinates = topic.map_coordinates;
      if (!coordinates || !coordinates.latitude || !coordinates.longitude) {
        console.log('Skipping topic due to missing coordinates:', topic.title);
        return;
      }

      console.log('Creating marker for topic:', topic.title, 'at coordinates:', coordinates);
      
      // Create marker element
      const el = document.createElement('div');
      el.className = 'topic-marker';

      // Get marker style based on grade
      const markerStyle = getMarkerStyle(topic.grade);
      
      el.innerHTML = `
        <div class="w-16 h-16 ${markerStyle.bgColor} ${markerStyle.shape} flex items-center justify-center
                    shadow-lg hover:scale-110 transition-all cursor-pointer
                    border-4 border-white transform hover:-translate-y-1 relative">
          <span class="text-white text-lg font-bold">${topic.grade}</span>
        </div>
      `;

      // Create popup
      const popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(`
          <div class="p-4">
            <h3 class="font-bold text-base mb-2">${topic.title}</h3>
            ${topic.description ? `<p class="text-sm">${topic.description}</p>` : ''}
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

  const getMarkerStyle = (grade: string) => {
    switch (grade) {
      case 'K1':
        return { 
          bgColor: 'bg-[#D946EF]', 
          shape: 'rounded-full' // Circle
        };
      case 'K2':
        return { 
          bgColor: 'bg-[#9b87f5]', 
          shape: 'rounded-full' // Circle
        };
      case 'G1':
        return { 
          bgColor: 'bg-[#0EA5E9]', 
          shape: 'rounded-lg rotate-45' // Diamond
        };
      case 'G2':
        return { 
          bgColor: 'bg-[#8B5CF6]', 
          shape: 'rounded-lg' // Square
        };
      case 'G3':
        return { 
          bgColor: 'bg-[#6E59A5]', 
          shape: 'clip-path-hexagon' // Hexagon
        };
      case 'G4':
        return { 
          bgColor: 'bg-[#F97316]', 
          shape: 'clip-path-star' // Star
        };
      case 'G5':
        return { 
          bgColor: 'bg-[#7E69AB]', 
          shape: 'clip-path-pentagon' // Pentagon
        };
      default:
        return { 
          bgColor: 'bg-primary', 
          shape: 'rounded-lg' 
        };
    }
  };

  return (
    <div className="relative w-full h-[600px] rounded-xl overflow-hidden">
      <div ref={mapContainer} className="absolute inset-0" />
      <style jsx global>{`
        .clip-path-hexagon {
          clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
        }
        .clip-path-star {
          clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
        }
        .clip-path-pentagon {
          clip-path: polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%);
        }
      `}</style>
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
