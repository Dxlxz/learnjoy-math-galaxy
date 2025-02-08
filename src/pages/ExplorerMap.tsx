import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import TopicCard from '@/components/explorer/TopicCard';
import VideoDialog from '@/components/explorer/VideoDialog';
import MapComponent from '@/components/explorer/MapComponent';
import { Content, Topic, TopicPrerequisites, MilestoneRequirements } from '@/types/explorer';
import { 
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, MapPin, Timer, ArrowRightLeft, Trophy, Star } from 'lucide-react';

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

// Type guard to validate map coordinates
const isValidMapCoordinates = (data: any): data is { longitude: number; latitude: number } => {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof data.longitude === 'number' &&
    typeof data.latitude === 'number'
  );
};

const ExplorerMap = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(true);
  const [topics, setTopics] = React.useState<Topic[]>([]);
  const [expandedTopics, setExpandedTopics] = React.useState<Record<string, boolean>>({});
  const [selectedVideo, setSelectedVideo] = React.useState<Content | null>(null);
  const [selectedTopic, setSelectedTopic] = React.useState<Topic | null>(null);
  const [relatedTopics, setRelatedTopics] = React.useState<Topic[]>([]);

  const calculateProgress = (topic: Topic) => {
    let progress = 0;
    if (topic.content_completed) progress += 50;
    if (topic.quest_completed) progress += 50;
    return progress;
  };

  React.useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
        return;
      }
      return session;
    };

    const fetchTopics = async () => {
      try {
        const session = await checkAuth();
        if (!session) return;

        // Fetch topics including grade and completion status
        const { data: topicsData, error: topicsError } = await supabase
          .from('topics')
          .select(`
            id,
            title,
            description,
            prerequisites,
            order_index,
            grade,
            map_coordinates
          `)
          .order('order_index');

        if (topicsError) throw topicsError;

        // Fetch content for each topic
        const { data: contentData, error: contentError } = await supabase
          .from('content')
          .select('*');

        if (contentError) throw contentError;

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

        // Fetch topic completion status
        const { data: topicCompletions, error: topicCompletionsError } = await supabase
          .from('topic_completion')
          .select('*')
          .eq('user_id', session.user.id);

        if (topicCompletionsError) throw topicCompletionsError;

        // Fetch user's learning progress
        const { data: learningProgress, error: learningProgressError } = await supabase
          .from('learning_progress')
          .select('content_id')
          .eq('user_id', session.user.id);

        if (learningProgressError) throw learningProgressError;

        const completedMilestoneIds = userMilestones?.map(um => um.milestone_id) || [];
        const startedContentIds = learningProgress?.map(lp => lp.content_id) || [];
        const topicCompletionMap = new Map(
          topicCompletions?.map(tc => [tc.topic_id, tc]) || []
        );

        // Process and combine the data
        const processedTopics = topicsData?.map(topic => {
          const topicContent = contentData?.filter(content => content.topic_id === topic.id) || [];
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
          }).filter((milestone): milestone is NonNullable<typeof milestone> => milestone !== null);

          // Get completion status
          const completionStatus = topicCompletionMap.get(topic.id);
          const isCompleted = completionStatus?.completed_at !== null;
          const isStarted = startedContentIds.some(contentId => 
            topicContent.some(content => content.id === contentId)
          );

          // Cast and validate prerequisites
          const prerequisites = topic.prerequisites as any;
          const validPrerequisites: TopicPrerequisites = isTopicPrerequisites(prerequisites) 
            ? prerequisites 
            : { required_topics: [], required_milestones: [] };

          // Check prerequisites
          const prerequisitesMet = completionStatus !== undefined || 
            validPrerequisites.required_topics.length === 0;

          // Parse and validate map_coordinates
          let validMapCoordinates;
          if (topic.map_coordinates && isValidMapCoordinates(topic.map_coordinates)) {
            validMapCoordinates = topic.map_coordinates;
          } else {
            validMapCoordinates = {
              longitude: 0,
              latitude: 0
            };
          }

          return {
            ...topic,
            content: topicContent,
            milestones: topicMilestones,
            completedMilestones: completedMilestoneIds,
            prerequisites: validPrerequisites,
            prerequisites_met: prerequisitesMet,
            is_started: isStarted,
            is_completed: isCompleted,
            content_completed: completionStatus?.content_completed || false,
            quest_completed: completionStatus?.quest_completed || false,
            order_index: topic.order_index,
            map_coordinates: validMapCoordinates
          } as Topic;
        }) || [];

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
  }, [navigate, toast]);

  const getRelatedTopics = (topic: Topic | null) => {
    if (!topic) return [];
    return topics.filter(t => 
      t.grade === topic.grade && 
      t.id !== topic.id &&
      Math.abs(t.order_index - (topic.order_index || 0)) <= 2
    );
  };

  const toggleTopic = (topicId: string) => {
    setExpandedTopics(prev => ({
      ...prev,
      [topicId]: !prev[topicId]
    }));
  };

  const handleContentClick = (content: Content) => {
    if (content.type === 'video') {
      setSelectedVideo(content);
    } else if (content.type === 'worksheet') {
      window.open(content.url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleTopicSelect = (topic: Topic) => {
    setExpandedTopics(prev => ({
      ...prev,
      [topic.id]: true
    }));
    setSelectedTopic(topic);
    setRelatedTopics(getRelatedTopics(topic));

    // Smooth scroll to topic cards section
    const topicCardsSection = document.getElementById('topic-cards-section');
    if (topicCardsSection) {
      topicCardsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const getTopicsForGrade = (grade: string | null) => {
    if (!grade) return [];
    return topics.filter(t => t.grade === grade);
  };

  const getProgressForTopic = async (topicId: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return 0;

    const { data: contentProgress } = await supabase
      .from('user_content_progress')
      .select('*')
      .eq('topic_id', topicId)
      .eq('user_id', session.user.id)
      .single();

    const { data: quizProgress } = await supabase
      .from('quiz_sessions')
      .select('status, final_score')
      .eq('topic_id', topicId)
      .eq('user_id', session.user.id)
      .eq('status', 'completed')
      .maybeSingle();

    let progress = 0;
    if (contentProgress?.all_content_completed) {
      progress += 50;
    } else if (contentProgress?.completed_content && contentProgress?.total_content) {
      progress += (contentProgress.completed_content / contentProgress.total_content) * 50;
    }

    if (quizProgress?.status === 'completed') {
      progress += 50;
    }

    return progress;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#FDF6E3] to-[#FEFCF7]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-[#2D3748]">Charting your course...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FDF6E3] to-[#FEFCF7] p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/hero-profile">Hero Profile</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink onClick={() => setSelectedTopic(null)}>
                Explorer's Map
              </BreadcrumbLink>
            </BreadcrumbItem>
            {selectedTopic && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{selectedTopic.title}</BreadcrumbPage>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-center justify-between">
          <Button
            onClick={() => {
              setSelectedTopic(null);
              setExpandedTopics({});
            }}
            variant="outline"
            className="border-2 border-[#FFC107] text-[#2D3748] hover:bg-[#FFC107]/10 flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Return to Grade Gateway
          </Button>
          
          {selectedTopic && (
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Grade {selectedTopic.grade}
              </span>
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <Timer className="h-4 w-4" />
                {selectedTopic.is_completed ? 'Completed' : 'In Progress'}
              </span>
            </div>
          )}
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-xl p-8 border-2 border-[#FFC107]/20">
          <h1 className="text-3xl font-bold text-[#2D3748] mb-6 bg-gradient-to-r from-[#FFA000] to-[#FFC107] bg-clip-text text-transparent">
            Explorer's Map
          </h1>

          <MapComponent 
            topics={topics} 
            onTopicSelect={handleTopicSelect} 
          />
        </div>

        {selectedTopic && relatedTopics.length > 0 && (
          <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-xl p-4 border-2 border-[#FFC107]/20">
            <div className="flex items-center gap-2 mb-4">
              <ArrowRightLeft className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-semibold">Related Topics</h3>
            </div>
            <ScrollArea className="whitespace-nowrap">
              <div className="flex gap-4 p-1">
                {relatedTopics.map(topic => (
                  <Button
                    key={topic.id}
                    variant="outline"
                    className={`flex-shrink-0 ${
                      topic.is_completed ? 'border-green-500' : 'border-[#FFC107]'
                    }`}
                    onClick={() => handleTopicSelect(topic)}
                  >
                    {topic.title}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        {selectedTopic && (
          <div id="topic-cards-section" className="bg-white/90 backdrop-blur-sm rounded-lg shadow-xl p-8 border-2 border-[#FFC107]/20 space-y-6">
            <div className="grid grid-cols-1 gap-4">
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getTopicsForGrade(selectedTopic.grade).map((topic) => (
                <div key={topic.id} id={`topic-${topic.id}`}>
                  <TopicCard
                    topic={topic}
                    isExpanded={expandedTopics[topic.id]}
                    onToggle={() => toggleTopic(topic.id)}
                    onContentClick={handleContentClick}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <VideoDialog 
        video={selectedVideo} 
        onOpenChange={() => setSelectedVideo(null)} 
      />
    </div>
  );
};

export default ExplorerMap;
