
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, ArrowRight, RefreshCw, Play } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import confetti from 'canvas-confetti';

const NumberLineTool: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [currentNumber, setCurrentNumber] = useState(0);
  const [maxNumber, setMaxNumber] = useState(10);
  const [showAnimation, setShowAnimation] = useState(false);
  const { toast } = useToast();
  const numberLineRef = useRef<HTMLDivElement>(null);

  const handleJump = (direction: 'forward' | 'backward') => {
    setShowAnimation(true);
    const newNumber = direction === 'forward' ? 
      Math.min(currentNumber + 1, maxNumber) : 
      Math.max(currentNumber - 1, 0);
    
    setCurrentNumber(newNumber);
    
    if (newNumber === maxNumber || newNumber === 0) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const playSound = () => {
    const utterance = new SpeechSynthesisUtterance(currentNumber.toString());
    utterance.lang = 'en-US';
    speechSynthesis.speak(utterance);
  };

  const reset = () => {
    setCurrentNumber(0);
    toast({
      title: "Reset Complete!",
      description: "Let's start counting from the beginning!",
    });
  };

  useEffect(() => {
    setShowAnimation(false);
  }, [currentNumber]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-primary-600">
            Number Line Explorer
          </h1>
          <Button variant="outline" onClick={onClose}>
            Back to Toolkit
          </Button>
        </div>

        <div className="grid gap-8">
          <Card className="p-6 bg-white shadow-lg">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={() => handleJump('backward')}
                  disabled={currentNumber === 0}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Jump Back
                </Button>
                <div className="text-6xl font-bold text-primary-600 animate-scale-in">
                  {currentNumber}
                </div>
                <Button
                  variant="outline"
                  onClick={() => handleJump('forward')}
                  disabled={currentNumber === maxNumber}
                >
                  Jump Forward
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>

              <div 
                ref={numberLineRef}
                className="relative h-20 bg-primary-100 rounded-lg overflow-hidden"
              >
                <div className="absolute inset-0 flex items-center justify-between px-4">
                  {Array.from({ length: maxNumber + 1 }).map((_, index) => (
                    <div
                      key={index}
                      className={`flex flex-col items-center ${
                        index === currentNumber ? 'scale-125 transition-transform' : ''
                      }`}
                    >
                      <div 
                        className={`w-3 h-3 rounded-full ${
                          index === currentNumber ? 'bg-primary-600' : 'bg-primary-300'
                        }`}
                      />
                      <span className="text-sm font-medium mt-2">{index}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-center space-x-4">
                <Button onClick={playSound} className="bg-green-500 hover:bg-green-600">
                  <Play className="mr-2 h-4 w-4" />
                  Hear Number
                </Button>
                <Button variant="outline" onClick={reset}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxNumber">Maximum Number</Label>
                <Input
                  id="maxNumber"
                  type="number"
                  min="5"
                  max="20"
                  value={maxNumber}
                  onChange={(e) => setMaxNumber(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NumberLineTool;
