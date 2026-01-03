// ========================================
// COGNIXIS - AMBIENT FOCUS SOUNDS
// Scientific background sounds for concentration
// ========================================

const AmbientSounds = {
  // Audio context for generating sounds
  audioContext: null,
  
  // Active sound sources
  activeSounds: {
    water: null,
    binaural: null,
    nature: null
  },
  
  // Gain nodes for volume control
  gainNodes: {
    water: null,
    binaural: null,
    nature: null
  },
  
  // Master volume (0-1)
  masterVolume: 0.5,
  
  // Sound states
  soundStates: {
    water: false,
    binaural: false,
    nature: false
  },
  
  // Sound info for UI
  soundInfo: {
    water: {
      name: 'Rain',
      icon: '🌧️',
      description: 'Gentle rain masks distractions and promotes calm focus',
      benefit: 'Reduces anxiety, improves concentration'
    },
    binaural: {
      name: 'Focus',
      icon: '🎵',
      description: 'Alpha wave binaural beats (10Hz) enhance mental clarity',
      benefit: 'Boosts memory, increases attention span'
    },
    nature: {
      name: 'Forest',
      icon: '🌲',
      description: 'Ambient forest sounds reduce stress hormones',
      benefit: 'Lowers cortisol, improves cognitive performance'
    }
  },
  
  // Initialize audio context
  init: () => {
    // Load saved states
    const saved = localStorage.getItem('cognixis_ambient_sounds');
    if (saved) {
      const data = JSON.parse(saved);
      AmbientSounds.masterVolume = data.volume || 0.5;
      AmbientSounds.soundStates = data.states || { water: false, binaural: false, nature: false };
    }
  },
  
  // Create or get audio context (must be called after user interaction)
  getAudioContext: () => {
    if (!AmbientSounds.audioContext) {
      AmbientSounds.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (AmbientSounds.audioContext.state === 'suspended') {
      AmbientSounds.audioContext.resume();
    }
    return AmbientSounds.audioContext;
  },
  
  // Generate white noise (base for water/rain sound)
  createWhiteNoise: (ctx, duration = 2) => {
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    return buffer;
  },
  
  // Generate pink noise (more natural, like rain)
  createPinkNoise: (ctx, duration = 2) => {
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    }
    
    return buffer;
  },
  
  // Start rain/water sound
  startWater: () => {
    const ctx = AmbientSounds.getAudioContext();
    
    // Create pink noise buffer (sounds like rain)
    const noiseBuffer = AmbientSounds.createPinkNoise(ctx, 2);
    
    // Create buffer source
    const source = ctx.createBufferSource();
    source.buffer = noiseBuffer;
    source.loop = true;
    
    // Create lowpass filter for softer rain sound
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 400;
    
    // Create gain node
    const gainNode = ctx.createGain();
    gainNode.gain.value = AmbientSounds.masterVolume * 0.3;
    
    // Connect: source -> filter -> gain -> destination
    source.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    source.start();
    
    AmbientSounds.activeSounds.water = source;
    AmbientSounds.gainNodes.water = gainNode;
    AmbientSounds.soundStates.water = true;
    AmbientSounds.saveState();
  },
  
  // Start binaural beats (10Hz alpha waves for focus)
  startBinaural: () => {
    const ctx = AmbientSounds.getAudioContext();
    
    // Create two oscillators with slight frequency difference (10Hz = alpha waves)
    const baseFreq = 200; // Base frequency
    const beatFreq = 10; // 10Hz alpha waves for focus
    
    const oscLeft = ctx.createOscillator();
    const oscRight = ctx.createOscillator();
    
    oscLeft.frequency.value = baseFreq;
    oscRight.frequency.value = baseFreq + beatFreq;
    
    oscLeft.type = 'sine';
    oscRight.type = 'sine';
    
    // Create stereo panner for binaural effect
    const panLeft = ctx.createStereoPanner();
    const panRight = ctx.createStereoPanner();
    panLeft.pan.value = -1;
    panRight.pan.value = 1;
    
    // Create gain node
    const gainNode = ctx.createGain();
    gainNode.gain.value = AmbientSounds.masterVolume * 0.15;
    
    // Connect
    oscLeft.connect(panLeft);
    oscRight.connect(panRight);
    panLeft.connect(gainNode);
    panRight.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscLeft.start();
    oscRight.start();
    
    AmbientSounds.activeSounds.binaural = { left: oscLeft, right: oscRight };
    AmbientSounds.gainNodes.binaural = gainNode;
    AmbientSounds.soundStates.binaural = true;
    AmbientSounds.saveState();
  },
  
  // Start nature/forest sounds (brown noise + subtle variations)
  startNature: () => {
    const ctx = AmbientSounds.getAudioContext();
    
    // Create brown noise (deeper, like wind in trees)
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    let lastOut = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = data[i];
      data[i] *= 3.5; // Boost volume
    }
    
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    
    // Add subtle filtering for natural sound
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 300;
    
    // Create gain node
    const gainNode = ctx.createGain();
    gainNode.gain.value = AmbientSounds.masterVolume * 0.25;
    
    source.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    source.start();
    
    AmbientSounds.activeSounds.nature = source;
    AmbientSounds.gainNodes.nature = gainNode;
    AmbientSounds.soundStates.nature = true;
    AmbientSounds.saveState();
  },
  
  // Stop a specific sound
  stop: (type) => {
    const sound = AmbientSounds.activeSounds[type];
    if (sound) {
      if (type === 'binaural') {
        sound.left?.stop();
        sound.right?.stop();
      } else {
        sound.stop();
      }
      AmbientSounds.activeSounds[type] = null;
      AmbientSounds.gainNodes[type] = null;
    }
    AmbientSounds.soundStates[type] = false;
    AmbientSounds.saveState();
  },
  
  // Toggle a sound on/off
  toggle: (type) => {
    if (AmbientSounds.soundStates[type]) {
      AmbientSounds.stop(type);
    } else {
      switch(type) {
        case 'water': AmbientSounds.startWater(); break;
        case 'binaural': AmbientSounds.startBinaural(); break;
        case 'nature': AmbientSounds.startNature(); break;
      }
    }
    return AmbientSounds.soundStates[type];
  },
  
  // Set volume (0-1)
  setVolume: (volume) => {
    AmbientSounds.masterVolume = Math.max(0, Math.min(1, volume));
    
    // Update all active gain nodes
    if (AmbientSounds.gainNodes.water) {
      AmbientSounds.gainNodes.water.gain.value = AmbientSounds.masterVolume * 0.3;
    }
    if (AmbientSounds.gainNodes.binaural) {
      AmbientSounds.gainNodes.binaural.gain.value = AmbientSounds.masterVolume * 0.15;
    }
    if (AmbientSounds.gainNodes.nature) {
      AmbientSounds.gainNodes.nature.gain.value = AmbientSounds.masterVolume * 0.25;
    }
    
    AmbientSounds.saveState();
  },
  
  // Get current volume
  getVolume: () => AmbientSounds.masterVolume,
  
  // Check if any sound is playing
  isAnyPlaying: () => {
    return AmbientSounds.soundStates.water || 
           AmbientSounds.soundStates.binaural || 
           AmbientSounds.soundStates.nature;
  },
  
  // Save state to localStorage
  saveState: () => {
    localStorage.setItem('cognixis_ambient_sounds', JSON.stringify({
      volume: AmbientSounds.masterVolume,
      states: AmbientSounds.soundStates
    }));
  },
  
  // Restore sounds from saved state (call after user interaction)
  restoreFromState: () => {
    if (AmbientSounds.soundStates.water && !AmbientSounds.activeSounds.water) {
      AmbientSounds.startWater();
    }
    if (AmbientSounds.soundStates.binaural && !AmbientSounds.activeSounds.binaural) {
      AmbientSounds.startBinaural();
    }
    if (AmbientSounds.soundStates.nature && !AmbientSounds.activeSounds.nature) {
      AmbientSounds.startNature();
    }
  },
  
  // Stop all sounds
  stopAll: () => {
    AmbientSounds.stop('water');
    AmbientSounds.stop('binaural');
    AmbientSounds.stop('nature');
  }
};

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
  AmbientSounds.init();
});

