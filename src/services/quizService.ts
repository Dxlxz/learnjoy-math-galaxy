
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { Topic } from '@/types/explorer';

export interface InitQuizResult {
  success: boolean;
  sessionId: string | null;
  error?: string;
}

export const initializeQuiz = async (topic: Topic): Promise<InitQuizResult> => {
  try {
    console.log('Initializing quiz for topic:', topic.id);
    
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return {
        success: false,
        sessionId: null,
        error: "Authentication required"
      };
    }

    // 0. Validate quiz content availability
    const { data: contentValidation, error: validationError } = await supabase
      .from('quiz_content_validation')
      .select('has_assessments')
      .eq('topic_id', topic.id)
      .single();

    if (validationError || !contentValidation || !contentValidation.has_assessments) {
      console.error('No quiz content available for topic:', topic.id);
      return {
        success: false,
        sessionId: null,
        error: "Quiz content is not available for this topic yet"
      };
    }

    // 1. Initialize quiz session with detailed error logging
    console.log('Creating quiz session...');
    const { data: sessionData, error: sessionError } = await supabase
      .from('quiz_sessions')
      .insert({
        user_id: session.user.id,
        topic_id: topic.id,
        total_questions: 0,
        correct_answers: 0,
        final_score: 0,
        status: 'in_progress',
        questions_answered: 0,
        max_questions: 10
      })
      .select('id, topic_id')
      .single();

    if (sessionError) {
      console.error('Error creating quiz session:', sessionError);
      return {
        success: false,
        sessionId: null,
        error: `Unable to initialize quest: ${sessionError.message}`
      };
    }

    console.log('Quiz session created successfully:', sessionData);

    // 2. Initialize or get user difficulty level with error logging
    console.log('Setting up difficulty level...');
    const { data: existingLevel } = await supabase
      .from('user_difficulty_levels')
      .select('*')
      .eq('user_id', session.user.id)
      .eq('topic_id', topic.id)
      .single();

    if (!existingLevel) {
      const { error: difficultyError } = await supabase
        .from('user_difficulty_levels')
        .upsert({
          user_id: session.user.id,
          topic_id: topic.id,
          current_difficulty_level: 1,
          consecutive_correct: 0,
          consecutive_incorrect: 0,
          total_questions_attempted: 0
        }, {
          onConflict: 'user_id,topic_id'
        });

      if (difficultyError) {
        console.error('Error setting initial difficulty:', difficultyError);
        return {
          success: false,
          sessionId: null,
          error: `Unable to set difficulty level: ${difficultyError.message}`
        };
      }
    }

    return {
      success: true,
      sessionId: sessionData.id
    };
    
  } catch (error) {
    console.error('Unexpected error initializing quiz:', error);
    return {
      success: false,
      sessionId: null,
      error: "An unexpected error occurred. Please try again."
    };
  }
};
