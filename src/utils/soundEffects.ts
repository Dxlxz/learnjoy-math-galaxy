
// Simple sound effect manager
const sounds = {
  unlock: new Audio('/sounds/unlock.mp3'),
  complete: new Audio('/sounds/complete.mp3'),
  hover: new Audio('/sounds/hover.mp3'),
  error: new Audio('/sounds/error.mp3')
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
    });
  }
};
