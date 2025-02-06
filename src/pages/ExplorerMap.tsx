import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { Content, Topic, MilestoneRequirements, TopicPrerequisites, DatabaseTopic, Json } from '@/types/topic';
import { MapStyle, MapCoordinates, MapRegion, PathStyle } from '@/types/map';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Compass } from 'lucide-react';
import MapMarker from '@/components/map/MapMarker';
import MapRegions from '@/components/map/MapRegions';
import PathVisualizer from '@/components/map/PathVisualizer';
import TopicDialog from '@/components/map/TopicDialog';
import ReactDOM from 'react-dom/client';
import { playSound } from '@/utils/soundEffects';

const ExplorerMap = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(true);
  const [mapInitialized, setMapInitialized] = React.useState(false);
  const [topics, setTopics] = React.useState<Topic[]>([]);
  const [selectedTopic, setSelectedTopic] = React.useState<Topic | null>(null);
  const [selectedVideo, setSelectedVideo] = React.useState<Content | null>(null);
  const [showMiniMap, setShowMiniMap] = React.useState(false);
  const mapContainer = React.useRef<HTMLDivElement>(null);
  const miniMapContainer = React.useRef<HTMLDivElement>(null);
  const map = React.useRef<mapboxgl.Map | null>(null);
  const miniMap = React.useRef<mapboxgl.Map | null>(null);
  const markers = React.useRef<{ [key: string]: mapboxgl.Marker }>({});

  // Fetch Mapbox token first
  React.useEffect(() => {
    const fetchMapboxToken = async () => {
      try {
        const { data: secretData, error: secretError } = await supabase
          .from('secrets')
          .select('value')
          .eq('name', 'MAPBOX_PUBLIC_TOKEN')
          .single();

        if (secretError) {
          console.error('Error fetching Mapbox token:', secretError);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to load map configuration. Please try again.",
          });
          return;
        }

        if (!secretData?.value) {
          console.error('No Mapbox token found in secrets');
          toast({
            variant: "destructive",
            title: "Configuration Error",
            description: "Map configuration is incomplete. Please contact support.",
          });
          return;
        }

        mapboxgl.accessToken = secretData.value;
        initializeMap();
      } catch (error) {
        console.error('Error in fetchMapboxToken:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to initialize map. Please try again.",
        });
      }
    };

    fetchMapboxToken();
  }, [toast]);

  const initializeMap = () => {
    if (!mapContainer.current) return;

    try {
      // Initialize main map
      const mapInstance = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/navigation-day-v1',
        center: [0, 20],
        zoom: 2,
        projection: 'globe',
        bearing: -10,
        pitch: 40,
      });

      // Add kid-friendly styling
      mapInstance.on('style.load', () => {
        mapInstance.setFog({
          color: 'rgb(255, 255, 255)',
          'high-color': 'rgb(200, 220, 255)',
          'horizon-blend': 0.1,
          'space-color': 'rgb(220, 235, 255)',
          'star-intensity': 0.15
        });

        mapInstance.setLight({
          intensity: 0.5,
          color: '#fff',
          anchor: 'map'
        });

        mapInstance.setPaintProperty('water', 'fill-color', '#a8d5ff');
        mapInstance.setPaintProperty('land', 'background-color', '#f0f7ea');
        
        const nav = new mapboxgl.NavigationControl({
          showCompass: true,
          visualizePitch: true,
        });
        mapInstance.addControl(nav, 'top-right');

        // Only set mapInitialized to true after the style is loaded
        setMapInitialized(true);
      });

      // Initialize mini-map if container exists
      if (miniMapContainer.current) {
        const miniMapInstance = new mapboxgl.Map({
          container: miniMapContainer.current,
          style: 'mapbox://styles/mapbox/navigation-day-v1',
          center: [0, 20],
          zoom: 1,
          interactive: false
        });

        mapInstance.on('move', () => {
          if (miniMapInstance) {
            const center = mapInstance.getCenter();
            miniMapInstance.setCenter(center);
          }
        });

        miniMap.current = miniMapInstance;
      }

      map.current = mapInstance;

      // Add smooth easing animation
      mapInstance.on('movestart', () => {
        mapContainer.current?.classList.add('transition-transform', 'duration-500', 'ease-in-out');
      });

      mapInstance.on('moveend', () => {
        mapContainer.current?.classList.remove('transition-transform', 'duration-500', 'ease-in-out');
      });

    } catch (error) {
      console.error('Error initializing map:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to initialize map. Please try again.",
      });
    }
  };

  // Fetch topics only after map is initialized
  React.useEffect(() => {
    if (!mapInitialized) return;
    
    const fetchTopics = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          navigate('/login');
          return;
        }

        const { data: topicsData, error: topicsError } = await supabase
          .from('topics')
          .select(`
            id,
            title,
            description,
            prerequisites,
            order_index,
            map_coordinates,
            map_style,
            map_region,
            path_style,
            content (
              id,
              title,
              type,
              url,
              topic_id
            )
          `)
          .order('order_index');

        if (topicsError) throw topicsError;

        const { data: milestonesData, error: milestonesError } = await supabase
          .from('milestones')
          .select('*');

        if (milestonesError) throw milestonesError;

        const { data: userMilestones, error: userMilestonesError } = await supabase
          .from('user_milestones')
          .select('milestone_id')
          .eq('user_id', session.user.id);

        if (userMilestonesError) throw userMilestonesError;

        const { data: learningProgress, error: learningProgressError } = await supabase
          .from('learning_progress')
          .select('content_id')
          .eq('user_id', session.user.id);

        if (learningProgressError) throw learningProgressError;

        const completedMilestoneIds = userMilestones?.map(um => um.milestone_id) || [];
        const startedContentIds = learningProgress?.map(lp => lp.content_id) || [];

        // Process and combine the data
        const processedTopics = (topicsData as DatabaseTopic[] || []).map(dbTopic => {
          const topicContent = dbTopic.content || [];
          const topicMilestones = milestonesData?.filter(milestone => {
            const requirements = milestone.requirements as unknown as MilestoneRequirements;
            return requirements?.type === 'topic_completion' && 
                   requirements?.topic_id === dbTopic.id;
          }) || [];

          const isStarted = topicContent.some(content => 
            startedContentIds.includes(content.id)
          );

          const prerequisites = dbTopic.prerequisites as unknown as TopicPrerequisites;
          const mapCoordinates = dbTopic.map_coordinates as unknown as MapCoordinates;
          const mapStyle = dbTopic.map_style as unknown as MapStyle;
          const mapRegion = dbTopic.map_region as unknown as MapRegion;
          const pathStyle = dbTopic.path_style as unknown as PathStyle;

          const prerequisitesMet = checkPrerequisites(
            prerequisites,
            startedContentIds,
            completedMilestoneIds,
            topicContent
          );

          const topic: Topic = {
            ...dbTopic,
            content: topicContent,
            milestones: topicMilestones.map(m => ({
              ...m,
              requirements: m.requirements as unknown as MilestoneRequirements,
              metadata: m.metadata as Record<string, unknown>
            })),
            completedMilestones: completedMilestoneIds,
            prerequisites,
            prerequisites_met: prerequisitesMet,
            is_started: isStarted,
            map_coordinates: mapCoordinates,
            map_style: mapStyle,
            map_region: mapRegion,
            path_style: pathStyle
          };

          return topic;
        });

        if (map.current && processedTopics) {
          processedTopics.forEach((topic) => {
            if (!topic.map_coordinates) return;

            const markerContainer = document.createElement('div');
            const root = ReactDOM.createRoot(markerContainer);
            
            try {
              root.render(
                <MapMarker 
                  topic={topic}
                  onClick={() => handleTopicClick(topic)}
                />
              );

              const marker = new mapboxgl.Marker({
                element: markerContainer,
                anchor: 'bottom',
              })
                .setLngLat([topic.map_coordinates.longitude, topic.map_coordinates.latitude])
                .addTo(map.current);

              markers.current[topic.id] = marker;
            } catch (error) {
              console.error('Error mounting marker:', error);
            }
          });
        }

        setTopics(processedTopics);
      } catch (error) {
        console.error('Error in fetchTopics:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load topics. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, [mapInitialized, navigate, toast]);

  const handleTopicClick = React.useCallback((topic: Topic) => {
    if (!topic.prerequisites_met) {
      playSound('error');
      toast({
        title: "Topic Locked",
        description: "Complete previous topics to unlock this content.",
        variant: "default",
      });
      return;
    }
    
    playSound('unlock');
    setSelectedTopic(topic);

    // Smooth camera transition
    if (map.current && topic.map_coordinates) {
      map.current.flyTo({
        center: [topic.map_coordinates.longitude, topic.map_coordinates.latitude],
        zoom: topic.map_coordinates.zoom || 3,
        duration: 2000,
        essential: true,
        curve: 1.5,
        speed: 0.8,
        pitch: 60,
        bearing: Math.random() * 180 - 90
      });
    }
  }, [toast]);

  const checkPrerequisites = (
    prerequisites: TopicPrerequisites,
    startedContentIds: string[],
    completedMilestoneIds: string[],
    topicContent: Content[]
  ) => {
    if (!prerequisites) return true;

    const { required_topics = [], required_milestones = [] } = prerequisites;

    // Check if all required topics have been started
    const topicsComplete = required_topics.every(topicId => {
      return topicContent.some(content => startedContentIds.includes(content.id));
    });

    // Check if all required milestones are completed
    const milestonesComplete = required_milestones.every(
      milestoneId => completedMilestoneIds.includes(milestoneId)
    );

    return topicsComplete && milestonesComplete;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Charting your course...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      <div className="relative w-full h-[70vh]">
        <div ref={mapContainer} className="absolute inset-0" />
        
        {/* Mini-map Toggle Button */}
        <Button
          onClick={() => setShowMiniMap(!showMiniMap)}
          className="absolute top-4 right-20 z-10 bg-white"
          size="sm"
          variant="outline"
        >
          <Compass className="h-4 w-4 mr-2" />
          {showMiniMap ? 'Hide' : 'Show'} Overview
        </Button>

        {/* Mini-map */}
        {showMiniMap && (
          <div 
            ref={miniMapContainer}
            className="absolute bottom-4 right-4 w-48 h-48 rounded-lg shadow-lg overflow-hidden border-2 border-white z-10"
          />
        )}

        <div className="absolute top-4 left-4 z-10">
          <Button
            onClick={() => navigate('/hero-profile')}
            variant="outline"
            className="bg-white hover:bg-primary hover:text-white transition-colors"
          >
            Back to Profile
          </Button>
        </div>
      </div>

      {/* Map Components */}
      {map.current && (
        <>
          {topics.map(topic => topic.map_region && (
            <MapRegions 
              key={topic.id}
              map={map.current!}
              regions={[topic.map_region]}
            />
          ))}
          {selectedTopic && (
            <PathVisualizer
              map={map.current}
              topic={selectedTopic}
              topics={topics}
            />
          )}
        </>
      )}

      {/* Dialogs */}
      <TopicDialog
        topic={selectedTopic}
        onOpenChange={(open) => !open && setSelectedTopic(null)}
        onVideoSelect={setSelectedVideo}
      />
    </div>
  );
};

export default ExplorerMap;
