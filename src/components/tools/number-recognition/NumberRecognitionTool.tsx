
import React, { useState, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Canvas } from 'fabric';
import { 
  Play,
  RefreshCw,
  Check,
  ArrowLeft,
  ArrowRight,
  Trophy,
  Sparkles
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import confetti from 'canvas-confetti';

interface NumberRecognitionToolProps {
  onClose: () => void;
}

const NumberRecognitionTool: React.FC<NumberRecognitionToolProps> = ({ onClose }) => {
  const [currentNumber, setCurrentNumber] = useState(1);
  const [canvas, setCanvas] = useState<Canvas | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current || canvas) return;

    const fabricCanvas = new Canvas(canvasRef.current, {
      width: 300,
      height: 300,
      backgroundColor: '#f3f4f6',
      isDrawingMode: true,
    });

    // Initialize drawing brush
    if (fabricCanvas.freeDrawingBrush) {
      fabricCanvas.freeDrawingBrush.width = 8;
      fabricCanvas.freeDrawingBrush.color = '#4f46e5';
    }

    // Add mouse event listeners
    fabricCanvas.on('mouse:down', () => setIsDrawing(true));
    fabricCanvas.on('mouse:up', () => setIsDrawing(false));
    fabricCanvas.on('mouse:move', (e) => {
      if (isDrawing) {
        fabricCanvas.renderAll();
      }
    });

    setCanvas(fabricCanvas);

    return () => {
      if (fabricCanvas) {
        fabricCanvas.dispose();
      }
    };
  }, []);

  const clearCanvas = () => {
    if (!canvas) return;
    canvas.clear();
    canvas.backgroundColor = '#f3f4f6';
    canvas.renderAll();
  };

  const playSound = () => {
    const utterance = new SpeechSynthesisUtterance(currentNumber.toString());
    utterance.lang = 'en-US';
    speechSynthesis.speak(utterance);
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const saveProgress = async () => {
    if (!canvas) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to save progress.",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('number_recognition_progress')
        .upsert({
          user_id: user.id,
          number: currentNumber,
          trace_data: canvas.toJSON(),
          attempts: 1,
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .select();

      if (error) throw error;

      toast({
        title: "Progress saved!",
        description: `Great job writing number ${currentNumber}!`,
      });

      triggerConfetti();

      // Automatically move to next number after successful save
      if (currentNumber < 10) {
        setTimeout(() => {
          handleNext();
        }, 1500);
      } else {
        toast({
          title: "Congratulations!",
          description: "You've completed all numbers! 🎉",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save progress. Please try again.",
      });
    }
  };

  const handlePrevious = () => {
    if (currentNumber > 1) {
      setCurrentNumber(prev => prev - 1);
      clearCanvas();
    }
  };

  const handleNext = () => {
    if (currentNumber < 10) {
      setCurrentNumber(prev => prev + 1);
      clearCanvas();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <Trophy className="h-8 w-8 text-primary-600" />
            <h1 className="text-3xl font-bold text-primary-600">
              Number Recognition Adventure
            </h1>
          </div>
          <Button variant="outline" onClick={onClose}>
            Back to Toolkit
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="p-6 relative overflow-hidden">
            <div className="absolute top-2 right-2">
              <Sparkles className="h-6 w-6 text-yellow-400 animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold mb-4 text-primary-700">Learn Number {currentNumber}</h2>
            
            {/* Visual representation */}
            <div className="mb-6">
              <div className="text-9xl font-bold text-center text-primary-600 animate-scale-in">
                {currentNumber}
              </div>
              <div className="flex justify-center mt-4 space-x-2">
                {[...Array(currentNumber)].map((_, i) => (
                  <div
                    key={i}
                    className="w-6 h-6 rounded-full bg-primary-200 animate-bounce"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  />
                ))}
              </div>
            </div>

            {/* Audio controls */}
            <Button 
              className="w-full mb-4 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 transition-all duration-300"
              onClick={playSound}
            >
              <Play className="mr-2 h-4 w-4" />
              Hear Number
            </Button>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4 text-primary-700">Practice Writing</h2>
            <div className="border-4 border-primary-200 rounded-lg overflow-hidden mb-4 shadow-lg">
              <canvas ref={canvasRef} />
            </div>
            <div className="flex space-x-4">
              <Button 
                variant="outline" 
                onClick={clearCanvas}
                className="flex-1 border-2 hover:bg-primary-50"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Clear
              </Button>
              <Button 
                onClick={saveProgress}
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
              >
                <Check className="mr-2 h-4 w-4" />
                Save Progress
              </Button>
            </div>
          </Card>
        </div>

        {/* Navigation controls */}
        <div className="flex justify-center mt-8 space-x-4">
          <Button
            onClick={handlePrevious}
            disabled={currentNumber === 1}
            className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          <Button
            onClick={handleNext}
            disabled={currentNumber === 10}
            className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700"
          >
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NumberRecognitionTool;
