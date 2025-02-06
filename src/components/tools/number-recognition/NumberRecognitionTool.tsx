
import React, { useState, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { fabric } from 'fabric';
import { 
  Play,
  RefreshCw,
  Check,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface NumberRecognitionToolProps {
  onClose: () => void;
}

const NumberRecognitionTool: React.FC<NumberRecognitionToolProps> = ({ onClose }) => {
  const [currentNumber, setCurrentNumber] = useState(1);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  // Initialize canvas
  useEffect(() => {
    if (canvasRef.current && !canvas) {
      const fabricCanvas = new fabric.Canvas(canvasRef.current, {
        width: 300,
        height: 300,
        backgroundColor: '#f3f4f6',
        isDrawingMode: true,
      });

      fabricCanvas.freeDrawingBrush.width = 8;
      fabricCanvas.freeDrawingBrush.color = '#4f46e5';
      setCanvas(fabricCanvas);
    }

    return () => {
      canvas?.dispose();
    };
  }, [canvasRef, canvas]);

  const clearCanvas = () => {
    if (canvas) {
      canvas.clear();
      canvas.backgroundColor = '#f3f4f6';
      canvas.renderAll();
    }
  };

  const playSound = () => {
    const utterance = new SpeechSynthesisUtterance(currentNumber.toString());
    utterance.lang = 'en-US';
    speechSynthesis.speak(utterance);
  };

  const saveProgress = async () => {
    if (!canvas) return;

    try {
      const { data, error } = await supabase
        .from('number_recognition_progress')
        .upsert({
          number: currentNumber,
          trace_data: canvas.toJSON(),
          attempts: 1,
          status: 'completed'
        })
        .select();

      if (error) throw error;

      toast({
        title: "Progress saved!",
        description: `Great job writing number ${currentNumber}!`,
      });
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
          <h1 className="text-3xl font-bold text-primary-600">
            Number Recognition Adventure
          </h1>
          <Button variant="outline" onClick={onClose}>
            Back to Toolkit
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Learn Number {currentNumber}</h2>
            
            {/* Visual representation */}
            <div className="mb-6">
              <div className="text-9xl font-bold text-center text-primary-600">
                {currentNumber}
              </div>
              <div className="flex justify-center mt-4 space-x-2">
                {[...Array(currentNumber)].map((_, i) => (
                  <div
                    key={i}
                    className="w-6 h-6 rounded-full bg-primary-200"
                  />
                ))}
              </div>
            </div>

            {/* Audio controls */}
            <Button 
              className="w-full mb-4"
              onClick={playSound}
            >
              <Play className="mr-2 h-4 w-4" />
              Hear Number
            </Button>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Practice Writing</h2>
            <div className="border rounded-lg overflow-hidden mb-4">
              <canvas ref={canvasRef} />
            </div>
            <div className="flex space-x-4">
              <Button variant="outline" onClick={clearCanvas}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Clear
              </Button>
              <Button onClick={saveProgress}>
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
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          <Button
            onClick={handleNext}
            disabled={currentNumber === 10}
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
