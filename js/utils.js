// ========================================
// STREAKRUSH - UTILITY FUNCTIONS
// ========================================

const Utils = {
  // Generate random number between min and max (inclusive)
  random: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
  
  // Generate random float between min and max
  randomFloat: (min, max) => Math.random() * (max - min) + min,
  
  // Shuffle array (Fisher-Yates)
  shuffle: (array) => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  },
  
  // Get today's date as YYYY-MM-DD string
  getToday: () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  },
  
  // Get days between two date strings
  daysBetween: (date1, date2) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffTime = Math.abs(d2 - d1);
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  },
  
  // Format number with commas
  formatNumber: (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  },
  
  // Clamp value between min and max
  clamp: (value, min, max) => Math.min(Math.max(value, min), max),
  
  // Delay helper for async/await
  delay: (ms) => new Promise(resolve => setTimeout(resolve, ms)),
  
  // Deep clone object
  clone: (obj) => JSON.parse(JSON.stringify(obj)),
  
  // Debounce function
  debounce: (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },
  
  // Check if device is touch-enabled
  isTouchDevice: () => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  },
  
  // Vibrate device (if supported)
  vibrate: (pattern = 10) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  },
  
  // Play sound effect
  playSound: (soundName) => {
    // Sound effects can be added later
    // For now, just vibrate for feedback
    Utils.vibrate(10);
  },
  
  // Generate UUID
  uuid: () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  },
  
  // Get element position relative to game area
  getElementPosition: (element, container) => {
    const elemRect = element.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    return {
      x: elemRect.left - containerRect.left,
      y: elemRect.top - containerRect.top,
      width: elemRect.width,
      height: elemRect.height
    };
  },
  
  // Check collision between two rectangles
  checkCollision: (rect1, rect2) => {
    return !(rect1.x + rect1.width < rect2.x ||
             rect2.x + rect2.width < rect1.x ||
             rect1.y + rect1.height < rect2.y ||
             rect2.y + rect2.height < rect1.y);
  }
};

// Challenge type definitions
const CHALLENGE_TYPES = {
  reflex: {
    name: 'Reflex',
    icon: '🎯',
    subtitle: 'Tap the Target',
    description: 'Green targets appear. Tap them for points. Avoid the red fakes!',
    variations: [
      { name: 'Standard Targets', description: 'Normal size, stationary' },
      { name: 'Shrinking Targets', description: 'Start big, shrink over time' },
      { name: 'Moving Targets', description: 'Drift across screen' },
      { name: 'Fake Red Targets', description: '20% chance of red decoy' },
      { name: 'Speed Acceleration', description: 'Spawn rate increases' }
    ]
  },
  memory: {
    name: 'Memory',
    icon: '🧠',
    subtitle: 'Pattern Match',
    description: 'Watch the pattern, then tap tiles in the same order!',
    variations: [
      { name: '3-Tile Start', description: 'Easy start' },
      { name: 'Color & Position', description: 'Remember both' },
      { name: 'Sound Addition', description: 'Each color has a sound' },
      { name: 'Reverse Pattern', description: 'Tap in reverse order' },
      { name: 'Multi-Layer', description: '2 sequences shown simultaneously' }
    ]
  },
  speed: {
    name: 'Speed',
    icon: '⚡',
    subtitle: 'Math Sprint',
    description: 'Solve as many math problems as possible in 60 seconds!',
    variations: [
      { name: 'Addition Only', description: 'e.g., 5+3' },
      { name: 'Mixed Operations', description: '+, -, ×' },
      { name: 'Time Pressure', description: '5 seconds per problem' },
      { name: 'Negative Numbers', description: 'e.g., -7 + 12' },
      { name: 'Fractions & Decimals', description: 'e.g., 0.5 + 0.25' }
    ]
  },
  coordination: {
    name: 'Coordination',
    icon: '🕹️',
    subtitle: 'Swipe Dodge',
    description: 'Swipe opposite direction to dodge incoming obstacles!',
    variations: [
      { name: 'Single Lane', description: 'Obstacles from one direction' },
      { name: 'Multi-Direction', description: 'From all sides' },
      { name: 'Accelerating Speed', description: 'Gets faster over time' },
      { name: 'Shrinking Safe Zone', description: 'Less room to dodge' },
      { name: 'Random Pattern', description: 'Unpredictable timing' }
    ]
  },
  logic: {
    name: 'Logic',
    icon: '🧩',
    subtitle: 'Color Match',
    description: 'Does the word match its color? Tap ✓ or ✗!',
    variations: [
      { name: 'Basic Stroop', description: 'Standard test' },
      { name: 'Triple Choice', description: '3 options instead of 2' },
      { name: 'Inverted Logic', description: 'Tap when they DON\'T match' },
      { name: 'Ultra Speed', description: '0.8 seconds per word' },
      { name: 'Mirror Mode', description: 'Text is reversed' }
    ]
  },
  words: {
    name: 'Words',
    icon: '📝',
    subtitle: 'Speed Typing',
    description: 'Type words as fast as possible!',
    variations: [
      { name: 'Short Words', description: '3-4 letters' },
      { name: 'Medium Words', description: '5-6 letters' },
      { name: 'Long Words', description: '7-10 letters' },
      { name: 'Phrases', description: 'Short phrases' },
      { name: 'Exact Match', description: 'No autocorrect' }
    ]
  },
  puzzle: {
    name: 'Puzzle',
    icon: '🔢',
    subtitle: 'Quick Sort',
    description: 'Arrange items in the correct order as fast as possible!',
    variations: [
      { name: 'Numbers 1-5', description: 'Ascending order' },
      { name: 'Numbers 1-10', description: 'Ascending order' },
      { name: 'Color Spectrum', description: 'Rainbow order' },
      { name: 'Shape Sizes', description: 'Smallest to largest' },
      { name: 'Mixed Elements', description: 'Numbers + colors' }
    ]
  }
};

// Challenge type order for rotation
const CHALLENGE_ORDER = ['reflex', 'memory', 'speed', 'coordination', 'logic', 'words', 'puzzle'];

// Milestone tiers
const MILESTONES = {
  bronze: { threshold: 7, color: '#cd7f32', name: 'Bronze' },
  silver: { threshold: 30, color: '#c0c0c0', name: 'Silver' },
  gold: { threshold: 100, color: '#ffd700', name: 'Gold' },
  diamond: { threshold: 365, color: '#b9f2ff', name: 'Diamond' }
};

// Word lists for typing challenge
const WORD_LISTS = {
  short: ['cat', 'dog', 'run', 'sky', 'red', 'box', 'fun', 'day', 'sun', 'cup', 'hat', 'pen', 'map', 'bed', 'top'],
  medium: ['apple', 'house', 'water', 'green', 'happy', 'music', 'phone', 'river', 'smile', 'dream', 'cloud', 'dance', 'light', 'pizza', 'beach'],
  long: ['elephant', 'beautiful', 'adventure', 'chocolate', 'butterfly', 'happiness', 'wonderful', 'celebrate', 'delicious', 'fantastic'],
  phrases: ['the quick fox', 'jump over', 'sunny day', 'blue sky', 'fast car', 'good luck', 'high five', 'game on']
};

// Color definitions for memory/logic games
const GAME_COLORS = {
  red: '#ef233c',
  blue: '#4361ee',
  green: '#06d6a0',
  yellow: '#ffd60a',
  purple: '#7209b7',
  orange: '#ff6b35',
  cyan: '#4cc9f0',
  pink: '#f72585'
};

