import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Topic } from '@/types/explorer';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
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

        // Rotation animation
        let rotationInterval: NodeJS.Timeout;
        const startRotation = () => {
          rotationInterval = setInterval(() => {
            if (!map.current) return;
            const center = map.current.getCenter();
            center.lng -= 0.5;
            map.current.easeTo({ center, duration: 1000, easing: (n) => n });
          }, 100);
        };

        map.current.on('mousedown', () => {
          clearInterval(rotationInterval);
        });

        map.current.on('mouseup', () => {
          startRotation();
        });

        startRotation();

        return () => {
          clearInterval(rotationInterval);
        };

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

    const sortedTopics = [...topics].sort((a, b) => {
      const gradeOrder = ['K1', 'K2', 'G1', 'G2', 'G3', 'G4', 'G5'];
      return gradeOrder.indexOf(a.grade) - gradeOrder.indexOf(b.grade);
    });

    const features: any[] = [];
    
    sortedTopics.forEach((topic, index) => {
      if (index < sortedTopics.length - 1) {
        const currentTopic = topic;
        const nextTopic = sortedTopics[index + 1];
        const coords = currentTopic.map_coordinates;
        const nextCoords = nextTopic.map_coordinates;

        if (coords && nextCoords) {
          features.push({
            type: 'Feature',
            geometry: {
              type: 'LineString',
              coordinates: [
                [coords.longitude, coords.latitude],
                [nextCoords.longitude, nextCoords.latitude]
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

  const getGradeBounds = (grade: string) => {
    const gradeTopics = topics.filter(t => t.grade === grade);
    if (gradeTopics.length === 0) return null;

    const coordinates = gradeTopics
      .map(topic => topic.map_coordinates)
      .filter(coords => coords && coords.longitude && coords.latitude);

    if (coordinates.length === 0) return null;

    const longitudes = coordinates.map(coord => coord.longitude);
    const latitudes = coordinates.map(coord => coord.latitude);

    return {
      north: Math.max(...latitudes) + 5,
      south: Math.min(...latitudes) - 5,
      east: Math.max(...longitudes) + 5,
      west: Math.min(...longitudes) - 5
    };
  };

  useEffect(() => {
    if (!map.current || !mapInitialized || isLoading) return;

    // Remove existing markers
    markers.current.forEach(marker => {
      if (marker) marker.remove();
    });
    markers.current = [];

    topics.forEach(topic => {
      const coords = topic.map_coordinates;
      
      // Skip if coordinates are missing or invalid
      if (!coords || !coords.longitude || !coords.latitude ||
          isNaN(coords.longitude) || isNaN(coords.latitude) ||
          (coords.longitude === 0 && coords.latitude === 0)) {
        console.log('Skipping invalid coordinates for topic:', topic.title);
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
                  ${markerStyle.icon} ${topic.title}
                </h3>
                <div class="text-gray-600">
                  <p class="mb-2">Available Tools: ${tools.length}</p>
                  ${topic.is_completed ? 
                    '<div class="text-green-500 flex items-center gap-1"><span class="text-sm">✨ Completed!</span></div>' 
                    : '<div class="text-blue-500 flex items-center gap-1"><span class="text-sm">🎯 Start Your Journey</span></div>'
                  }
                </div>
              </div>
            </div>
          </div>
        `;

        const marker = new mapboxgl.Marker(el)
          .setLngLat([coords.longitude, coords.latitude])
          .addTo(map.current);

        markers.current.push(marker);

        el.addEventListener('click', () => {
          if (!map.current) return;

          const bounds = getGradeBounds(topic.grade);
          if (bounds) {
            map.current.fitBounds(
              [
                [bounds.west, bounds.south],
                [bounds.east, bounds.north]
              ],
              {
                padding: 100,
                duration: 1000,
                pitch: 60
              }
            );
          }
          
          setSelectedGrade(topic.grade);
          setShowGradeGateway(true);
        });

      } catch (error) {
        console.error('Error adding marker for topic:', topic.title, error);
      }
    });

    createLearningPaths();
  }, [topics, onTopicSelect, mapInitialized, isLoading]);

  const handleStartAdventure = async () => {
    const selectedTopic = topics.find(topic => topic.grade === selectedGrade);
    if (!selectedTopic) return;

    try {
      console.log('Initializing quiz for topic:', selectedTopic.id);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Please log in to start a quest");
        return;
      }

      // Initialize or get user difficulty level with error logging
      console.log('Setting up difficulty level...');
      const { error: difficultyError } = await supabase
        .from('user_difficulty_levels')
        .upsert({
          user_id: session.user.id,
          topic_id: selectedTopic.id,
          current_difficulty_level: 1
        }, {
          onConflict: 'user_id,topic_id'
        });

      if (difficultyError) {
        console.error('Error setting difficulty:', difficultyError);
        toast.error("Unable to initialize quest. Please try again.");
        return;
      }

      // Get quiz content
      const { data: contentData, error: contentError } = await supabase
        .from('content')
        .select('id')
        .eq('topic_id', selectedTopic.id)
        .eq('type', 'assessment')
        .limit(1)
        .maybeSingle();

      if (contentError) {
        console.error('Error fetching quiz content:', contentError);
        toast.error("Unable to load quiz content. Please try again.");
        return;
      }

      // If no assessment content exists, show a message
      if (!contentData) {
        toast.error("No quiz content available for this topic yet.");
        return;
      }

      setShowGradeGateway(false);
      onTopicSelect(selectedTopic);
    } catch (error) {
      console.error('Error starting adventure:', error);
      toast.error("Unable to start the quest. Please try again.");
    }
  };

  return (
    <div className="relative w-full h-[600px] rounded-xl overflow-hidden">
      <div ref={mapContainer} className="absolute inset-0" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-background/20 rounded-lg" />
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
