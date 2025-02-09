
import { TEvent } from 'fabric';

export interface CanvasEvent extends TEvent {
  pointer: {
    x: number;
    y: number;
  };
}

export interface DrawingData {
  points: Array<{ x: number; y: number }>;
  stroke: string;
  strokeWidth: number;
}
