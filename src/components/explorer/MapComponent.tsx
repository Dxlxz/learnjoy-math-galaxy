
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Topic } from '@/types/explorer';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Star, Sparkles } from 'lucide-react';

interface MapComponentProps {
  topics: Topic[];
  onTopicSelect: (topic: Topic) => void;
}

const MapComponent = ({ topics, onTopicSelect }: MapComponentProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mapInitialized, setMapInitialized] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;

    const initializeMap = async () => {
      try {
        setIsLoading(true);
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

        mapboxgl.accessToken = data.value;
        
        if (map.current) return; // Prevent multiple initializations

        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/navigation-night-v1',
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
          if (!map.current) return;
          
          map.current.setFog({
            color: 'rgb(186, 210, 255)',
            'high-color': 'rgb(36, 92, 223)',
            'horizon-blend': 0.4,
            'star-intensity': 0.8
          });
          setIsLoading(false);
          setMapInitialized(true);
        });

        // Rotation animation settings
        const secondsPerRevolution = 240;
        const maxSpinZoom = 5;
        const slowSpinZoom = 3;
        let userInteracting = false;
        let spinEnabled = true;

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

        spinGlobe();

      } catch (error) {
        console.error('Error initializing map:', error);
        toast.error('Unable to initialize the map. Please refresh the page.');
        setIsLoading(false);
      }
    };

    initializeMap();

    // Cleanup function
    return () => {
      // Remove all markers first
      markers.current.forEach(marker => {
        if (marker) marker.remove();
      });
      markers.current = [];

      // Then remove the map
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  const getMarkerStyle = (grade: string) => {
    switch (grade) {
      case 'K1':
        return { bgColor: 'bg-[#FFD700]', icon: '🌟' }; // Gold star
      case 'K2':
        return { bgColor: 'bg-[#FF6B6B]', icon: '🎈' }; // Red balloon
      case 'G1':
        return { bgColor: 'bg-[#4CD964]', icon: '🌳' }; // Green tree
      case 'G2':
        return { bgColor: 'bg-[#5856D6]', icon: '🌙' }; // Purple moon
      case 'G3':
        return { bgColor: 'bg-[#FF9500]', icon: '🌞' }; // Orange sun
      case 'G4':
        return { bgColor: 'bg-[#FF2D55]', icon: '❤️' }; // Red heart
      case 'G5':
        return { bgColor: 'bg-[#5AC8FA]', icon: '⭐' }; // Blue star
      default:
        return { bgColor: 'bg-primary', icon: '✨' };
    }
  };

  // Add markers effect
  useEffect(() => {
    if (!map.current || !mapInitialized || isLoading) return;

    // Remove existing markers
    markers.current.forEach(marker => {
      if (marker) marker.remove();
    });
    markers.current = [];

    // Add new markers
    topics.forEach(topic => {
      if (!topic.map_coordinates) {
        console.log('No map_coordinates found for topic:', topic.title);
        return;
      }

      const coordinates = topic.map_coordinates;
      if (!coordinates || !coordinates.latitude || !coordinates.longitude) {
        console.log('Invalid coordinates for topic:', topic.title, coordinates);
        return;
      }

      try {
        const el = document.createElement('div');
        el.className = 'topic-marker';

        const markerStyle = getMarkerStyle(topic.grade);
        
        el.innerHTML = `
          <div class="group">
            <div class="w-8 h-8 ${markerStyle.bgColor} rounded-full flex items-center justify-center
                        shadow-lg hover:scale-125 transition-all duration-300 cursor-pointer
                        border-2 border-white transform hover:-translate-y-1 relative
                        animate-bounce">
              <span class="text-lg">${markerStyle.icon}</span>
              <div class="hidden group-hover:block absolute -bottom-16 bg-white p-2 rounded-lg shadow-xl
                          text-sm font-medium text-gray-800 whitespace-nowrap z-10
                          animate-fade-in">
                ${topic.title}
                ${topic.is_completed ? '✅' : ''}
              </div>
            </div>
          </div>
        `;

        const popup = new mapboxgl.Popup({ 
          offset: 25,
          closeButton: false,
          className: 'rounded-xl shadow-xl'
        }).setHTML(`
          <div class="p-4 bg-gradient-to-br from-${markerStyle.bgColor}/20 to-white rounded-xl">
            <h3 class="font-bold text-base mb-2 flex items-center gap-2">
              ${markerStyle.icon} ${topic.title}
            </h3>
            ${topic.description ? `
              <p class="text-sm text-gray-600">${topic.description}</p>
            ` : ''}
            ${topic.is_completed ? 
              '<div class="mt-2 text-green-500 flex items-center gap-1"><Sparkles class="w-4 h-4" /> Completed!</div>' 
              : ''
            }
          </div>
        `);

        const marker = new mapboxgl.Marker(el)
          .setLngLat([coordinates.longitude, coordinates.latitude])
          .setPopup(popup)
          .addTo(map.current);

        el.addEventListener('click', () => {
          if (!map.current) return;
          
          map.current.flyTo({
            center: [coordinates.longitude, coordinates.latitude],
            zoom: 4,
            duration: 2000,
            essential: true,
            pitch: 60,
            bearing: Math.random() * 360 // Random rotation for fun effect
          });
          
          setTimeout(() => {
            onTopicSelect(topic);
          }, 2000);
        });

        markers.current.push(marker);
      } catch (error) {
        console.error('Error adding marker for topic:', topic.title, error);
      }
    });
  }, [topics, onTopicSelect, mapInitialized, isLoading]);

  return (
    <div className="relative w-full h-[600px] rounded-xl overflow-hidden">
      <div ref={mapContainer} className="absolute inset-0" />
      <div className="absolute inset-0 pointer-events-none 
                      bg-gradient-to-b from-transparent via-transparent to-background/20 rounded-lg" />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50">
          <div className="text-lg font-semibold text-foreground animate-bounce">
            Loading your adventure map... ✨
          </div>
        </div>
      )}
    </div>
  );
};

export default MapComponent;
