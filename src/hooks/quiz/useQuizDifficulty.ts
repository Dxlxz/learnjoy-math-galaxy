
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";

interface UseQuizDifficultyReturn {
  difficultyLevel: number;
  updateDifficultyLevel: (correct: boolean, currentIndex: number, score: number) => Promise<void>;
}

export const useQuizDifficulty = (): UseQuizDifficultyReturn => {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [difficultyLevel, setDifficultyLevel] = useState(1);
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
  const [consecutiveIncorrect, setConsecutiveIncorrect] = useState(0);

  const updateDifficultyLevel = async (correct: boolean, currentIndex: number, score: number) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const topicId = searchParams.get('topic');
    if (!topicId) return;

    let newDifficultyLevel = difficultyLevel;
    let newConsecutiveCorrect = correct ? consecutiveCorrect + 1 : 0;
    let newConsecutiveIncorrect = correct ? 0 : consecutiveIncorrect + 1;

    if (newConsecutiveCorrect >= 3) {
      newDifficultyLevel = Math.min(3, difficultyLevel + 1);
      newConsecutiveCorrect = 0;
      toast({
        title: "Level Up! 🎉",
        description: "You've advanced to a higher difficulty level!",
      });
    } else if (newConsecutiveIncorrect >= 2) {
      newDifficultyLevel = Math.max(1, difficultyLevel - 1);
      newConsecutiveIncorrect = 0;
      toast({
        title: "Adjusting Difficulty",
        description: "Let's try some easier questions to build confidence.",
      });
    }

    const { error } = await supabase
      .from('user_difficulty_levels')
      .upsert({
        user_id: session.user.id,
        topic_id: topicId,
        current_difficulty_level: newDifficultyLevel,
        consecutive_correct: newConsecutiveCorrect,
        consecutive_incorrect: newConsecutiveIncorrect,
        total_questions_attempted: currentIndex + 1,
        success_rate: (score / (currentIndex + 1)) * 100,
      }, {
        onConflict: 'user_id,topic_id'
      });

    if (!error) {
      setDifficultyLevel(newDifficultyLevel);
      setConsecutiveCorrect(newConsecutiveCorrect);
      setConsecutiveIncorrect(newConsecutiveIncorrect);
    }
  };

  return {
    difficultyLevel,
    updateDifficultyLevel
  };
};
