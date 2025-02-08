
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

    // 1. Check quiz availability using the new function
    const { data: availability, error: availabilityError } = await supabase
      .rpc('check_quiz_availability', {
        p_topic_id: topic.id
      });

    if (availabilityError) {
      console.error('Error checking quiz availability:', availabilityError);
      return {
        success: false,
        sessionId: null,
        error: `Unable to verify quiz content: ${availabilityError.message}`
      };
    }

    if (!availability?.[0]?.available) {
      console.error('No questions available for this topic');
      return {
        success: false,
        sessionId: null,
        error: "No questions available for this topic"
      };
    }

    // 2. Initialize quiz session with detailed error logging
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

    // 3. Initialize or get user difficulty level with error logging
    console.log('Setting up difficulty level...');
    const { data: existingLevel } = await supabase
      .from('user_difficulty_levels')
      .select('*')
      .eq('user_id', session.user.id)
      .eq('topic_id', topic.id)
      .single();

    if (!existingLevel) {
      console.log('Creating initial difficulty level for user...');
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
    } else {
      // Ensure existing difficulty level is within valid range (1-3)
      if (existingLevel.current_difficulty_level > 3) {
        const { error: updateError } = await supabase
          .from('user_difficulty_levels')
          .update({ current_difficulty_level: 3 })
          .eq('user_id', session.user.id)
          .eq('topic_id', topic.id);

        if (updateError) {
          console.error('Error adjusting difficulty level:', updateError);
        }
      }
      console.log('Retrieved existing difficulty level:', existingLevel);
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
