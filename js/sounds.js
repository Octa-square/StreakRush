// ========================================
// COGNIXIS - SOUND EFFECTS
// ========================================

const Sounds = {
  enabled: true,
  
  // Audio context for generating sounds
  ctx: null,
  
  // Initialize audio context
  init: () => {
    try {
      Sounds.ctx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      console.log('Web Audio API not supported');
    }
    
    // Load preference
    Sounds.enabled = localStorage.getItem('cognixis_sound') !== 'false';
  },
  
  // Toggle sound
  toggle: () => {
    Sounds.enabled = !Sounds.enabled;
    localStorage.setItem('cognixis_sound', Sounds.enabled);
    return Sounds.enabled;
  },
  
  // Play correct answer sound (happy beep)
  correct: () => {
    if (!Sounds.enabled || !Sounds.ctx) return;
    
    const ctx = Sounds.ctx;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.frequency.setValueAtTime(880, ctx.currentTime); // A5
    oscillator.frequency.setValueAtTime(1108, ctx.currentTime + 0.1); // C#6
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.2);
  },
  
  // Play wrong answer sound (sad buzz)
  wrong: () => {
    if (!Sounds.enabled || !Sounds.ctx) return;
    
    const ctx = Sounds.ctx;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.frequency.setValueAtTime(200, ctx.currentTime);
    oscillator.frequency.setValueAtTime(150, ctx.currentTime + 0.1);
    oscillator.type = 'sawtooth';
    
    gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.3);
  },
  
  // Play countdown beep
  countdown: () => {
    if (!Sounds.enabled || !Sounds.ctx) return;
    
    const ctx = Sounds.ctx;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.frequency.setValueAtTime(440, ctx.currentTime);
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.15);
  },
  
  // Play game start sound
  gameStart: () => {
    if (!Sounds.enabled || !Sounds.ctx) return;
    
    const ctx = Sounds.ctx;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.frequency.setValueAtTime(523, ctx.currentTime); // C5
    oscillator.frequency.setValueAtTime(659, ctx.currentTime + 0.1); // E5
    oscillator.frequency.setValueAtTime(784, ctx.currentTime + 0.2); // G5
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.4);
  },
  
  // Play game end sound
  gameEnd: () => {
    if (!Sounds.enabled || !Sounds.ctx) return;
    
    const ctx = Sounds.ctx;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.frequency.setValueAtTime(523, ctx.currentTime);
    oscillator.frequency.setValueAtTime(698, ctx.currentTime + 0.15);
    oscillator.frequency.setValueAtTime(880, ctx.currentTime + 0.3);
    oscillator.frequency.setValueAtTime(1047, ctx.currentTime + 0.45);
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.6);
  },
  
  // Play achievement/celebration sound
  achievement: () => {
    if (!Sounds.enabled || !Sounds.ctx) return;
    
    const ctx = Sounds.ctx;
    
    // Play a fanfare-like sound
    const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
    const duration = 0.15;
    
    notes.forEach((freq, i) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.frequency.setValueAtTime(freq, ctx.currentTime + i * duration);
      oscillator.type = 'sine';
      
      const startTime = ctx.currentTime + i * duration;
      gainNode.gain.setValueAtTime(0.25, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration * 1.5);
      
      oscillator.start(startTime);
      oscillator.stop(startTime + duration * 1.5);
    });
  },
  
  // Play button click
  click: () => {
    if (!Sounds.enabled || !Sounds.ctx) return;
    
    const ctx = Sounds.ctx;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.frequency.setValueAtTime(600, ctx.currentTime);
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.05);
  }
};

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
  // Initialize audio on first user interaction
  document.addEventListener('click', () => {
    if (!Sounds.ctx) Sounds.init();
  }, { once: true });
});

