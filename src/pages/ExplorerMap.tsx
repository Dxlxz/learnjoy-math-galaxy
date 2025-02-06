
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, Play, FileText } from 'lucide-react';

interface Content {
  id: string;
  title: string;
  type: 'video' | 'worksheet' | 'interactive' | 'assessment';
  url: string;
}

interface Topic {
  id: string;
  title: string;
  description: string | null;
  content: Content[];
}

const ExplorerMap = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(true);
  const [topics, setTopics] = React.useState<Topic[]>([]);
  const [expandedTopics, setExpandedTopics] = React.useState<Record<string, boolean>>({});
  const [selectedVideo, setSelectedVideo] = React.useState<Content | null>(null);

  React.useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
        return;
      }
    };

    const fetchTopics = async () => {
      try {
        const { data: topicsData, error: topicsError } = await supabase
          .from('topics')
          .select(`
            id,
            title,
            description,
            content (
              id,
              title,
              type,
              url
            )
          `)
          .order('order_index');

        if (topicsError) {
          toast({
            variant: "destructive",
            title: "Error fetching topics",
            description: topicsError.message,
          });
          return;
        }

        if (topicsData) {
          setTopics(topicsData);
        }
      } catch (error) {
        console.error('Error fetching topics:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load topics. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
    fetchTopics();
  }, [navigate, toast]);

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
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h1 className="text-3xl font-bold text-primary-600 mb-6">
            Explorer's Map
          </h1>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topics.map((topic) => (
              <Collapsible
                key={topic.id}
                open={expandedTopics[topic.id]}
                onOpenChange={() => toggleTopic(topic.id)}
                className="p-6 bg-white rounded-lg shadow-md border border-primary-100 hover:shadow-lg transition-all duration-200"
              >
                <div className="flex flex-col space-y-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-lg">{topic.title}</h3>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" className="p-1">
                        {expandedTopics[topic.id] ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                  
                  <p className="text-gray-600">{topic.description}</p>
                  
                  <CollapsibleContent className="space-y-4 mt-4">
                    <div className="space-y-2">
                      {topic.content?.filter(content => 
                        content.type === 'video' || content.type === 'worksheet'
                      ).map((content) => (
                        <Card
                          key={content.id}
                          className="p-4 cursor-pointer hover:bg-primary-50 transition-colors"
                          onClick={() => handleContentClick(content)}
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
                  </CollapsibleContent>

                  <Button
                    onClick={() => navigate(`/quest-challenge?topic=${topic.id}`)}
                    className="w-full mt-4"
                  >
                    Begin Quest
                  </Button>
                </div>
              </Collapsible>
            ))}
          </div>

          <div className="mt-8 space-x-4">
            <Button
              onClick={() => navigate('/hero-profile')}
              variant="outline"
            >
              Back to Profile
            </Button>
          </div>
        </div>
      </div>

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
