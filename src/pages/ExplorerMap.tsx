import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { Card } from '@/components/ui/card';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Play, FileText, Lock, AlertCircle, Compass } from 'lucide-react';
import TopicMilestone from '@/components/milestones/TopicMilestone';

interface Content {
  id: string;
  title: string;
  type: 'video' | 'worksheet' | 'interactive' | 'assessment';
  url: string;
  topic_id: string;
}

interface MilestoneRequirements {
  type: string;
  topic_id?: string;
  requirement?: number;
  count?: number;
  days?: number;
}

interface Milestone {
  id: string;
  title: string;
  description: string | null;
  icon_name: string;
  requirements: MilestoneRequirements;
  prerequisite_milestones: string[] | null;
  metadata: Record<string, any> | null;
  created_at: string;
  updated_at: string;
}

interface TopicPrerequisites {
  required_topics: string[];
  required_milestones: string[];
}

interface MapStyle {
  icon: string;
  color: string;
}

interface MapCoordinates {
  latitude: number;
  longitude: number;
  zoom: number;
}

interface Topic {
  id: string;
  title: string;
  description: string | null;
  content: Content[];
  milestones?: Milestone[];
  completedMilestones?: string[];
  prerequisites: TopicPrerequisites;
  prerequisites_met?: boolean;
  is_started?: boolean;
  order_index: number;
  map_coordinates: MapCoordinates | null;
  map_style: MapStyle | null;
}

// Type guard to validate MilestoneRequirements
const isMilestoneRequirements = (data: any): data is MilestoneRequirements => {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof data.type === 'string' &&
    (data.topic_id === undefined || typeof data.topic_id === 'string') &&
    (data.requirement === undefined || typeof data.requirement === 'number') &&
    (data.count === undefined || typeof data.count === 'number') &&
    (data.days === undefined || typeof data.days === 'number')
  );
};

// Type guard to validate TopicPrerequisites
const isTopicPrerequisites = (data: any): data is TopicPrerequisites => {
  return (
    typeof data === 'object' &&
    data !== null &&
    Array.isArray(data.required_topics) &&
    Array.isArray(data.required_milestones) &&
    data.required_topics.every((topic: any) => typeof topic === 'string') &&
    data.required_milestones.every((milestone: any) => typeof milestone === 'string')
  );
};

const ExplorerMap = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(true);
  const [topics, setTopics] = React.useState<Topic[]>([]);
  const [selectedTopic, setSelectedTopic] = React.useState<Topic | null>(null);
  const [selectedVideo, setSelectedVideo] = React.useState<Content | null>(null);
  const [showMiniMap, setShowMiniMap] = React.useState(false);
  const mapContainer = React.useRef<HTMLDivElement>(null);
  const miniMapContainer = React.useRef<HTMLDivElement>(null);
  const map = React.useRef<mapboxgl.Map | null>(null);
  const miniMap = React.useRef<mapboxgl.Map | null>(null);
  const markers = React.useRef<{ [key: string]: mapboxgl.Marker }>({});

  React.useEffect(() => {
    const initializeMap = async () => {
      try {
        const { data: secretData, error: secretError } = await supabase
          .from('secrets')
          .select('value')
          .eq('name', 'MAPBOX_PUBLIC_TOKEN')
          .single();

        if (secretError || !secretData || !mapContainer.current) {
          console.error('Error fetching Mapbox token:', secretError);
          return;
        }

        mapboxgl.accessToken = secretData.value;

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
          // Add fog effect for a dreamy look
          mapInstance.setFog({
            color: 'rgb(255, 255, 255)',
            'high-color': 'rgb(200, 220, 255)',
            'horizon-blend': 0.1,
            'space-color': 'rgb(220, 235, 255)',
            'star-intensity': 0.15
          });

          // Add atmosphere for a magical feel
          mapInstance.setLight({
            intensity: 0.5,
            color: '#fff',
            anchor: 'map'
          });

          // Customize map appearance
          mapInstance.setPaintProperty('water', 'fill-color', '#a8d5ff');
          mapInstance.setPaintProperty('land', 'background-color', '#f0f7ea');
          
          // Add kid-friendly controls
          const nav = new mapboxgl.NavigationControl({
            showCompass: true,
            visualizePitch: true,
          });
          mapInstance.addControl(nav, 'top-right');
        });

        // Initialize mini-map
        if (miniMapContainer.current) {
          const miniMapInstance = new mapboxgl.Map({
            container: miniMapContainer.current,
            style: 'mapbox://styles/mapbox/navigation-day-v1',
            center: [0, 20],
            zoom: 1,
            interactive: false
          });

          // Sync mini-map with main map
          mapInstance.on('move', () => {
            if (miniMapInstance) {
              const center = mapInstance.getCenter();
              miniMapInstance.setCenter(center);
            }
          });

          miniMap.current = miniMapInstance;
        }

        map.current = mapInstance;

        // Add smooth easing animation for camera movements
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

    initializeMap();

    return () => {
      if (map.current) {
        map.current.remove();
      }
      if (miniMap.current) {
        miniMap.current.remove();
      }
      // Clean up markers
      Object.values(markers.current).forEach(marker => marker.remove());
      markers.current = {};
    };
  }, [toast]);

  React.useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
        return;
      }
      return session;
    };

    const createMarkerElement = (topic: Topic) => {
      const markerEl = document.createElement('div');
      markerEl.className = 'topic-marker';
      const isLocked = !topic.prerequisites_met;
      const style = topic.map_style || { icon: 'castle', color: '#6366F1' };
      
      markerEl.innerHTML = `
        <div class="w-16 h-16 ${isLocked ? 'bg-gray-400' : `bg-[${style.color}]`} rounded-full 
                     flex items-center justify-center text-white shadow-lg 
                     transform transition-all duration-300 
                     ${isLocked ? 'cursor-not-allowed opacity-70' : 'hover:scale-110 cursor-pointer animate-bounce-slow'}
                     relative overflow-hidden">
          ${isLocked ? `
            <div class="absolute inset-0 bg-black/10"></div>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" 
                 viewBox="0 0 24 24" fill="none" stroke="currentColor" 
                 stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          ` : `
            <div class="absolute inset-0 bg-white/10 animate-pulse"></div>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" 
                 viewBox="0 0 24 24" fill="none" stroke="currentColor" 
                 stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
          `}
        </div>
        <div class="absolute -bottom-8 left-1/2 transform -translate-x-1/2 
                    whitespace-nowrap text-sm font-medium px-2 py-1 
                    ${isLocked ? 'text-gray-500' : 'text-primary'} 
                    bg-white rounded-full shadow-md animate-fade-in">
          ${topic.title}
        </div>
      `;

      return markerEl;
    };

    const fetchTopics = async () => {
      try {
        const session = await checkAuth();
        if (!session) return;

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

        // Fetch milestones
        const { data: milestonesData, error: milestonesError } = await supabase
          .from('milestones')
          .select('*');

        if (milestonesError) throw milestonesError;

        // Fetch user's completed milestones
        const { data: userMilestones, error: userMilestonesError } = await supabase
          .from('user_milestones')
          .select('milestone_id')
          .eq('user_id', session.user.id);

        if (userMilestonesError) throw userMilestonesError;

        // Fetch user's learning progress to determine started topics
        const { data: learningProgress, error: learningProgressError } = await supabase
          .from('learning_progress')
          .select('content_id')
          .eq('user_id', session.user.id);

        if (learningProgressError) throw learningProgressError;

        const completedMilestoneIds = userMilestones?.map(um => um.milestone_id) || [];
        const startedContentIds = learningProgress?.map(lp => lp.content_id) || [];

        // Process and combine the data
        const processedTopics = topicsData?.map(topic => {
          const topicContent = topic.content || [];
          const topicMilestones = milestonesData?.filter(
            milestone => {
              const requirements = milestone.requirements as any;
              return requirements?.type === 'topic_completion' && 
                     requirements?.topic_id === topic.id;
            }
          ).map(milestone => {
            const requirements = milestone.requirements as any;
            if (!isMilestoneRequirements(requirements)) {
              console.error('Invalid milestone requirements:', requirements);
              return null;
            }
            return {
              ...milestone,
              requirements,
              metadata: milestone.metadata as Record<string, any> | null
            };
          }).filter((milestone): milestone is Milestone => milestone !== null);

          // Check if topic is started
          const isStarted = topicContent.some(content => 
            startedContentIds.includes(content.id)
          );

          // Cast and validate prerequisites
          const prerequisites = topic.prerequisites as any;
          const validPrerequisites: TopicPrerequisites = isTopicPrerequisites(prerequisites) 
            ? prerequisites 
            : { required_topics: [], required_milestones: [] };

          // Check prerequisites
          const prerequisitesMet = checkPrerequisites(
            validPrerequisites,
            startedContentIds,
            completedMilestoneIds,
            topicContent
          );

          // Ensure map_coordinates is properly typed
          const coordinates = topic.map_coordinates as unknown as { 
            latitude: number; 
            longitude: number; 
            zoom: number; 
          } | null;

          return {
            ...topic,
            content: topicContent,
            milestones: topicMilestones,
            completedMilestones: completedMilestoneIds,
            prerequisites: validPrerequisites,
            prerequisites_met: prerequisitesMet,
            is_started: isStarted,
            map_coordinates: coordinates,
            map_style: topic.map_style || null
          };
        });

        // Add markers for topics with smooth animations
        if (map.current && processedTopics) {
          // Clean up existing markers
          Object.values(markers.current).forEach(marker => marker.remove());
          markers.current = {};

          processedTopics.forEach((topic) => {
            const coordinates = topic.map_coordinates;
            if (!coordinates) return;

            const markerEl = createMarkerElement(topic);

            const marker = new mapboxgl.Marker({
              element: markerEl,
              anchor: 'bottom',
            })
              .setLngLat([coordinates.longitude, coordinates.latitude])
              .addTo(map.current!);

            markers.current[topic.id] = marker;

            markerEl.addEventListener('click', () => {
              if (!topic.prerequisites_met) {
                toast({
                  title: "Topic Locked",
                  description: "Complete previous topics to unlock this content.",
                  variant: "default",
                });
                return;
              }
              
              setSelectedTopic(topic);

              // Smooth camera transition
              map.current?.flyTo({
                center: [coordinates.longitude, coordinates.latitude],
                zoom: coordinates.zoom || 3,
                duration: 2000,
                essential: true,
                curve: 1.5,
                speed: 0.8,
                pitch: 60,
                bearing: Math.random() * 180 - 90 // Random bearing for dynamic movement
              });
            });
          });
        }

        setTopics(processedTopics || []);
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
  }, [navigate, toast]);

  // Helper function to check prerequisites
  const checkPrerequisites = (
    prerequisites: { required_topics: string[], required_milestones: string[] },
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

  const handleContentClick = (content: Content) => {
    if (content.type === 'video') {
      setSelectedVideo(content);
    } else if (content.type === 'worksheet') {
      window.open(content.url, '_blank', 'noopener,noreferrer');
    }
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
      {/* Map Container */}
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

      {/* Topic Dialog */}
      <Dialog open={!!selectedTopic} onOpenChange={() => setSelectedTopic(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedTopic?.prerequisites_met ? (
                <Play className="h-5 w-5 text-primary" />
              ) : (
                <Lock className="h-5 w-5 text-gray-400" />
              )}
              {selectedTopic?.title}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-gray-600">{selectedTopic?.description}</p>

            {selectedTopic && !selectedTopic.prerequisites_met && (
              <div className="bg-amber-50 p-3 rounded-md flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                <div className="text-sm text-amber-700">
                  <p className="font-medium">Prerequisites Required</p>
                  <p>Complete previous topics to unlock this content.</p>
                </div>
              </div>
            )}

            {/* Milestones Section */}
            {selectedTopic?.milestones && selectedTopic.milestones.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold text-primary">Milestones</h4>
                {selectedTopic.milestones.map((milestone) => (
                  <TopicMilestone
                    key={milestone.id}
                    title={milestone.title}
                    description={milestone.description || ''}
                    iconName={milestone.icon_name}
                    isCompleted={selectedTopic.completedMilestones?.includes(milestone.id)}
                  />
                ))}
              </div>
            )}

            {/* Content Section */}
            {selectedTopic?.content && (
              <div className="space-y-2">
                <h4 className="font-semibold text-primary">Learning Content</h4>
                {selectedTopic.content
                  .filter(content => content.type === 'video' || content.type === 'worksheet')
                  .map((content) => (
                    <Card
                      key={content.id}
                      className={`p-4 cursor-pointer transition-colors ${
                        selectedTopic.prerequisites_met 
                          ? 'hover:bg-primary-50' 
                          : 'opacity-50 cursor-not-allowed'
                      }`}
                      onClick={() => selectedTopic.prerequisites_met && handleContentClick(content)}
                    >
                      <div className="flex items-center space-x-3">
                        {content.type === 'video' ? (
                          <Play className="h-5 w-5 text-primary-500" />
                        ) : (
                          <FileText className="h-5 w-5 text-primary-500" />
                        )}
                        <span>{content.title}</span>
                      </div>
                    </Card>
                  ))}
              </div>
            )}

            <Button
              onClick={() => navigate(`/quest-challenge?topic=${selectedTopic?.id}`)}
              className="w-full mt-4"
              disabled={!selectedTopic?.prerequisites_met}
            >
              {selectedTopic?.prerequisites_met ? 'Begin Quest' : 'Prerequisites Required'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Video Dialog */}
      <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>{selectedVideo?.title}</DialogTitle>
          </DialogHeader>
          <div className="aspect-video w-full">
            <iframe
              src={selectedVideo?.url}
              className="w-full h-full rounded-lg"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExplorerMap;
