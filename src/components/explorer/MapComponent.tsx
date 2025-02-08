import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Topic } from '@/types/explorer';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Star, Sparkles } from 'lucide-react';
import { gradeTools } from '@/config/gradeTools';
import GradeGatewayModal from './GradeGatewayModal';

interface MapComponentProps {
  topics: Topic[];
  onTopicSelect: (topic: Topic) => void;
}

const MapComponent = ({ topics, onTopicSelect }: MapComponentProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const pathLines = useRef<mapboxgl.Map[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mapInitialized, setMapInitialized] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
  const [showGradeGateway, setShowGradeGateway] = useState(false);

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
        
        if (map.current) return;

        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/navigation-night-v1',
          projection: 'globe',
          zoom: 1.5,
          center: [0, 20],
          pitch: 45,
        });

        map.current.addControl(
          new mapboxgl.NavigationControl({
            visualizePitch: true,
          }),
          'top-right'
        );

        map.current.on('style.load', () => {
          if (!map.current) return;
          
          map.current.setFog({
            color: 'rgb(186, 210, 255)',
            'high-color': 'rgb(36, 92, 223)',
            'horizon-blend': 0.4,
            'star-intensity': 0.8
          });

          // Add a source and layer for the learning paths
          map.current.addSource('learning-paths', {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: []
            }
          });

          // Add the path lines layer
          map.current.addLayer({
            id: 'learning-paths',
            type: 'line',
            source: 'learning-paths',
            layout: {
              'line-join': 'round',
              'line-cap': 'round'
            },
            paint: {
              'line-color': ['get', 'color'],
              'line-width': 3,
              'line-opacity': 0.7,
              'line-dasharray': [2, 1]
            }
          });

          setIsLoading(false);
          setMapInitialized(true);
        });

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

    return () => {
      markers.current.forEach(marker => {
        if (marker) marker.remove();
      });
      markers.current = [];

      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  const getMarkerStyle = (grade: string) => {
    const gradeSection = gradeTools.find(section => section.grade === grade);
    switch (grade) {
      case 'K1':
        return { bgColor: 'bg-[#FFD700]', icon: '🌟', title: gradeSection?.title || 'Early Explorer' }; 
      case 'K2':
        return { bgColor: 'bg-[#FF6B6B]', icon: '🎈', title: gradeSection?.title || 'Pattern Seeker' };
      case 'G1':
        return { bgColor: 'bg-[#4CD964]', icon: '🌳', title: gradeSection?.title || 'Number Wizard' };
      case 'G2':
        return { bgColor: 'bg-[#5856D6]', icon: '🌙', title: gradeSection?.title || 'Place Value Explorer' };
      case 'G3':
        return { bgColor: 'bg-[#FF9500]', icon: '🌞', title: gradeSection?.title || 'Operation Master' };
      case 'G4':
        return { bgColor: 'bg-[#FF2D55]', icon: '❤️', title: gradeSection?.title || 'Advanced Explorer' };
      case 'G5':
        return { bgColor: 'bg-[#5AC8FA]', icon: '⭐', title: gradeSection?.title || 'Master Mathematician' };
      default:
        return { bgColor: 'bg-primary', icon: '✨', title: 'Explorer' };
    }
  };

  // Function to create path connections between topics
  const createLearningPaths = () => {
    if (!map.current || !mapInitialized) return;

    const features: any[] = [];
    
    topics.forEach((topic, index) => {
      if (index < topics.length - 1) {
        const currentTopic = topic;
        const nextTopic = topics[index + 1];

        if (currentTopic.map_coordinates && nextTopic.map_coordinates) {
          features.push({
            type: 'Feature',
            geometry: {
              type: 'LineString',
              coordinates: [
                [currentTopic.map_coordinates.longitude, currentTopic.map_coordinates.latitude],
                [nextTopic.map_coordinates.longitude, nextTopic.map_coordinates.latitude]
              ]
            },
            properties: {
              color: topic.is_completed ? '#4CD964' : '#FFD700',
              grade: topic.grade
            }
          });
        }
      }
    });

    if (map.current.getSource('learning-paths')) {
      (map.current.getSource('learning-paths') as mapboxgl.GeoJSONSource).setData({
        type: 'FeatureCollection',
        features
      });
    }
  };

  useEffect(() => {
    if (!map.current || !mapInitialized || isLoading) return;

    markers.current.forEach(marker => {
      if (marker) marker.remove();
    });
    markers.current = [];

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
        const gradeSection = gradeTools.find(section => section.grade === topic.grade);
        const tools = gradeSection?.tools || [];
        
        el.innerHTML = `
          <div class="group">
            <div class="w-12 h-12 ${markerStyle.bgColor} rounded-full flex items-center justify-center
                        shadow-lg hover:scale-110 transition-all duration-300 cursor-pointer
                        border-2 border-white relative">
              <span class="text-2xl">${markerStyle.icon}</span>
              <div class="hidden group-hover:block absolute -bottom-24 bg-white p-4 rounded-xl shadow-xl
                          text-sm whitespace-nowrap z-10 w-64">
                <h3 class="font-bold text-lg mb-2 flex items-center gap-2">
                  ${markerStyle.icon} ${markerStyle.title}
                </h3>
                <div class="text-gray-600">
                  <p class="mb-2">Available Tools: ${tools.length}</p>
                  ${topic.is_completed ? 
                    '<div class="text-green-500 flex items-center gap-1"><span class="text-sm">✨ Grade Complete!</span></div>' 
                    : '<div class="text-blue-500 flex items-center gap-1"><span class="text-sm">🎯 Start Your Journey</span></div>'
                  }
                </div>
              </div>
            </div>
          </div>
        `;

        const marker = new mapboxgl.Marker(el)
          .setLngLat([coordinates.longitude, coordinates.latitude])
          .addTo(map.current);

        el.addEventListener('click', () => {
          if (!map.current) return;
          
          map.current.flyTo({
            center: [coordinates.longitude, coordinates.latitude],
            zoom: 4,
            duration: 1000,
            essential: true,
            pitch: 60
          });
          
          setSelectedGrade(topic.grade);
          setShowGradeGateway(true);
        });

        markers.current.push(marker);
      } catch (error) {
        console.error('Error adding marker for topic:', topic.title, error);
      }
    });

    createLearningPaths();
  }, [topics, onTopicSelect, mapInitialized, isLoading]);

  const handleStartAdventure = () => {
    const selectedTopic = topics.find(topic => topic.grade === selectedGrade);
    if (selectedTopic) {
      setShowGradeGateway(false);
      onTopicSelect(selectedTopic);
    }
  };

  return (
    <div className="relative w-full h-[600px] rounded-xl overflow-hidden">
      <div ref={mapContainer} className="absolute inset-0" />
      <div className="absolute inset-0 pointer-events-none 
                      bg-gradient-to-b from-transparent via-transparent to-background/20 rounded-lg" />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50">
          <div className="text-lg font-semibold text-foreground">
            Loading your adventure map... ✨
          </div>
        </div>
      )}
      <GradeGatewayModal 
        isOpen={showGradeGateway}
        onOpenChange={setShowGradeGateway}
        gradeSection={gradeTools.find(section => section.grade === selectedGrade)}
        onStartAdventure={handleStartAdventure}
      />
    </div>
  );
};

export default MapComponent;
