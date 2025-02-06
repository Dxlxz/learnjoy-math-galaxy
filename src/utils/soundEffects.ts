
import { supabase } from '@/integrations/supabase/client';

// Create sound effect URLs from Supabase storage
const getSoundUrl = (filename: string) => {
  const { data } = supabase.storage.from('sounds').getPublicUrl(filename);
  return data.publicUrl;
};

// Simple sound effect manager
const sounds = {
  unlock: new Audio(getSoundUrl('unlock.mp3')),
  complete: new Audio(getSoundUrl('complete.mp3')),
  hover: new Audio(getSoundUrl('hover.mp3')),
  error: new Audio(getSoundUrl('error.mp3'))
};

// Pre-load sounds
Object.values(sounds).forEach(sound => {
  sound.load();
  sound.volume = 0.3;
});

export const playSound = (type: keyof typeof sounds) => {
  const sound = sounds[type];
  if (sound) {
    sound.currentTime = 0;
    sound.play().catch(() => {
      // Ignore autoplay errors
      console.log(`Failed to play sound: ${type}`);
    });
  }
};
