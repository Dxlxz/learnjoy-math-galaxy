import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import TopicCard from '@/components/explorer/TopicCard';
import VideoDialog from '@/components/explorer/VideoDialog';
import MapComponent from '@/components/explorer/MapComponent';
import { Content, Topic, TopicPrerequisites, MilestoneRequirements } from '@/types/explorer';

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
  const [expandedTopics, setExpandedTopics] = React.useState<Record<string, boolean>>({});
  const [selectedVideo, setSelectedVideo] = React.useState<Content | null>(null);
  const [selectedTopic, setSelectedTopic] = React.useState<Topic | null>(null);

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
            grade
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

          // Check prerequisites - now using the database function
          const prerequisitesMet = completionStatus !== undefined || 
            validPrerequisites.required_topics.length === 0;

          return {
            ...topic,
            content: topicContent,
            milestones: topicMilestones,
            completedMilestones: completedMilestoneIds,
            prerequisites: validPrerequisites,
            prerequisites_met: prerequisitesMet,
            is_started: isStarted,
            is_completed: isCompleted,
            order_index: topic.order_index
          };
        }) as Topic[];

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
    prerequisites: TopicPrerequisites,
    startedContentIds: string[],
    completedMilestoneIds: string[],
    contentData: any[]
  ) => {
    if (!prerequisites) return true;

    const { required_topics = [], required_milestones = [] } = prerequisites;

    // Check if all required topics have been started
    const topicsComplete = required_topics.every(topicId => {
      const topicContent = contentData.filter(content => content.topic_id === topicId);
      return topicContent.some(content => startedContentIds.includes(content.id));
    });

    // Check if all required milestones are completed
    const milestonesComplete = required_milestones.every(
      milestoneId => completedMilestoneIds.includes(milestoneId)
    );

    return topicsComplete && milestonesComplete;
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

    // Smooth scroll to topic card
    const topicCard = document.getElementById(`topic-${topic.id}`);
    if (topicCard) {
      topicCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
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
        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-xl p-8 border-2 border-[#FFC107]/20">
          <h1 className="text-3xl font-bold text-[#2D3748] mb-6 bg-gradient-to-r from-[#FFA000] to-[#FFC107] bg-clip-text text-transparent">
            Explorer's Map
          </h1>

          <MapComponent 
            topics={topics} 
            onTopicSelect={handleTopicSelect} 
          />
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-xl p-8 border-2 border-[#FFC107]/20">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topics.map((topic) => (
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

          <div className="mt-8 space-x-4">
            <Button
              onClick={() => navigate('/hero-profile')}
              variant="outline"
              className="border-2 border-[#FFC107] text-[#2D3748] hover:bg-[#FFC107]/10"
            >
              Back to Profile
            </Button>
          </div>
        </div>
      </div>

      <VideoDialog 
        video={selectedVideo} 
        onOpenChange={() => setSelectedVideo(null)} 
      />
    </div>
  );
};

export default ExplorerMap;
