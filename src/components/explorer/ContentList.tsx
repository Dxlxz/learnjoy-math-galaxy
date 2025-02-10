
import React from 'react';
import { Card } from '@/components/ui/card';
import { Play, FileText, CheckCircle2 } from 'lucide-react';
import { Content } from '@/types/explorer';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';

interface ContentListProps {
  content: Content[];
  prerequisitesMet: boolean;
  onContentClick: (content: Content) => void;
}

const ContentList: React.FC<ContentListProps> = ({ content, prerequisitesMet, onContentClick }) => {
  const { toast } = useToast();

  // Fetch completed content
  const { data: completedContent } = useQuery({
    queryKey: ['completed-content'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return [];

      const { data, error } = await supabase
        .from('learning_progress')
        .select('content_id')
        .eq('user_id', session.user.id)
        .eq('completion_status', 'completed');

      if (error) {
        console.error('Error fetching completed content:', error);
        return [];
      }

      return data?.map(item => item.content_id) || [];
    }
  });

  const handleContentClick = async (content: Content) => {
    if (!prerequisitesMet) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication Required",
          description: "Please log in to track your progress.",
          variant: "destructive"
        });
        return;
      }

      // First, check if there's an existing record
      const { data: existingProgress } = await supabase
        .from('learning_progress')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('content_id', content.id)
        .eq('completion_status', content.type === 'video' || content.type === 'worksheet' ? 'completed' : 'started')
        .maybeSingle();

      if (existingProgress) {
        // Update the existing record with a new timestamp
        const { error: updateError } = await supabase
          .from('learning_progress')
          .update({
            start_time: new Date().toISOString(),
            interaction_data: {
              ...(existingProgress.interaction_data as Record<string, unknown> || {}),
              last_accessed: new Date().toISOString(),
              device: navigator.userAgent,
              screen_size: `${window.innerWidth}x${window.innerHeight}`,
            }
          })
          .eq('id', existingProgress.id);

        if (updateError) {
          console.error('Error updating progress:', updateError);
          throw updateError;
        }
      } else {
        // Insert new progress record
        const { error: insertError } = await supabase
          .from('learning_progress')
          .insert({
            user_id: session.user.id,
            content_id: content.id,
            start_time: new Date().toISOString(),
            completion_status: content.type === 'video' || content.type === 'worksheet' ? 'completed' : 'started',
            interaction_data: {
              device: navigator.userAgent,
              screen_size: `${window.innerWidth}x${window.innerHeight}`,
            }
          });

        if (insertError) {
          console.error('Error recording progress:', insertError);
          throw insertError;
        }
      }

      // Call the original click handler
      onContentClick(content);

    } catch (error) {
      console.error('Content interaction error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-2">
      <h4 className="font-semibold text-primary">Learning Content</h4>
      {content?.filter(content => 
        content.type === 'video' || content.type === 'worksheet'
      ).map((content) => (
        <Card
          key={content.id}
          className={`p-4 cursor-pointer transition-colors ${
            prerequisitesMet 
              ? 'hover:bg-primary-50' 
              : 'opacity-50 cursor-not-allowed'
          }`}
          onClick={() => handleContentClick(content)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {content.type === 'video' ? (
                <Play className="h-5 w-5 text-primary-500" />
              ) : (
                <FileText className="h-5 w-5 text-primary-500" />
              )}
              <span>{content.title}</span>
            </div>
            {completedContent?.includes(content.id) && (
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ContentList;
