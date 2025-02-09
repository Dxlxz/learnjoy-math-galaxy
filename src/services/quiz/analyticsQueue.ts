
import { toast } from "@/components/ui/use-toast";

type AnalyticsEvent = {
  eventType: string;
  data: any;
  timestamp: string;
  retryCount: number;
};

type QueueItem = {
  id: string;
  event: AnalyticsEvent;
  maxRetries?: number;
};

class AnalyticsQueue {
  private queue: QueueItem[] = [];
  private isProcessing: boolean = false;
  private readonly defaultMaxRetries: number = 3;
  private readonly retryDelay: number = 2000; // 2 seconds

  constructor() {
    // Load any pending events from localStorage on initialization
    this.loadQueue();
    
    // Add event listener for beforeunload to save queue
    window.addEventListener('beforeunload', () => this.saveQueue());
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private saveQueue(): void {
    try {
      localStorage.setItem('analyticsQueue', JSON.stringify(this.queue));
    } catch (error) {
      console.error('[AnalyticsQueue] Error saving queue:', error);
    }
  }

  private loadQueue(): void {
    try {
      const savedQueue = localStorage.getItem('analyticsQueue');
      if (savedQueue) {
        this.queue = JSON.parse(savedQueue);
        console.log('[AnalyticsQueue] Loaded saved queue:', this.queue.length, 'items');
      }
    } catch (error) {
      console.error('[AnalyticsQueue] Error loading queue:', error);
    }
  }

  async enqueue(
    eventType: string,
    data: any,
    maxRetries: number = this.defaultMaxRetries
  ): Promise<void> {
    console.log('[AnalyticsQueue] Enqueueing event:', eventType);

    const event: AnalyticsEvent = {
      eventType,
      data,
      timestamp: new Date().toISOString(),
      retryCount: 0
    };

    const item: QueueItem = {
      id: this.generateId(),
      event,
      maxRetries
    };

    this.queue.push(item);
    this.saveQueue();

    if (!this.isProcessing) {
      await this.processQueue();
    }
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.queue.length === 0) return;

    console.log('[AnalyticsQueue] Processing queue:', this.queue.length, 'items');
    this.isProcessing = true;

    try {
      while (this.queue.length > 0) {
        const item = this.queue[0];
        
        try {
          await this.processEvent(item);
          // Remove successful event from queue
          this.queue.shift();
          this.saveQueue();
        } catch (error) {
          console.error('[AnalyticsQueue] Error processing event:', error);
          
          if (item.event.retryCount >= (item.maxRetries || this.defaultMaxRetries)) {
            // Remove failed event from queue after max retries
            this.queue.shift();
            this.saveQueue();
            
            toast({
              title: "Analytics Error",
              description: "Failed to record analytics data after multiple attempts.",
              variant: "destructive",
            });
          } else {
            // Increment retry count and move to back of queue
            item.event.retryCount++;
            this.queue.push(this.queue.shift()!);
            this.saveQueue();
            
            // Wait before next retry
            await new Promise(resolve => setTimeout(resolve, this.retryDelay));
          }
        }
      }
    } finally {
      this.isProcessing = false;
    }
  }

  private async processEvent(item: QueueItem): Promise<void> {
    const { event } = item;
    console.log('[AnalyticsQueue] Processing event:', event.eventType, 'attempt:', event.retryCount + 1);

    // Here we would typically send the event to your analytics service
    // For now, we'll simulate processing with a delay
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate random failures for testing
        if (Math.random() < 0.1) { // 10% chance of failure
          reject(new Error('Random processing failure'));
        } else {
          resolve(null);
        }
      }, 1000);
    });
  }

  // Method to check queue status
  getQueueStatus(): { queueLength: number; isProcessing: boolean } {
    return {
      queueLength: this.queue.length,
      isProcessing: this.isProcessing
    };
  }

  // Method to clear the queue (useful for testing or error recovery)
  clearQueue(): void {
    this.queue = [];
    this.saveQueue();
    console.log('[AnalyticsQueue] Queue cleared');
  }
}

// Export a singleton instance
export const analyticsQueue = new AnalyticsQueue();
