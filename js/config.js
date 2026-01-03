// ========================================
// COGNIXIS - CENTRALIZED CONFIGURATION
// ========================================

const GAME_CONFIG = {
  // ========================================
  // TIMING
  // ========================================
  timing: {
    gameLength: 60,           // seconds per game
    questionTimeout: 5,       // seconds before auto-skip (if applicable)
    countdownStart: 3,        // 3-2-1-GO countdown
    resultDelay: 2,           // seconds before showing results
    feedbackDuration: 1.5,    // seconds to show correct/wrong feedback
    nextQuestionDelay: 0.8    // seconds between questions
  },
  
  // ========================================
  // SCORING
  // ========================================
  scoring: {
    correctAnswer: 25,
    wrongAnswer: -15,
    speedBonus: {
      under1sec: 10,
      under2sec: 5,
      under3sec: 2
    },
    volumeBonus: {
      15: 50,   // Answer 15+ questions correctly
      20: 100,  // Answer 20+ questions correctly
      25: 200   // Answer 25+ questions correctly
    },
    accuracyBonus: {
      100: 200, // Perfect accuracy
      95: 100,  // 95%+ accuracy
      90: 50    // 90%+ accuracy
    }
  },
  
  // ========================================
  // GAME PROGRESSION / UNLOCKING
  // ========================================
  unlock: {
    passingScore: 70,         // percentage to pass
    minQuestionsRequired: 6,  // minimum questions to complete game
    freeGames: 15,            // free tier game count
    totalGames: 60,           // total games in app
    gamesPerBatch: 12         // games shown per "Load More" click
  },
  
  // ========================================
  // MASTERY TIERS
  // ========================================
  mastery: {
    bronze: 70,   // %
    silver: 85,   // %
    gold: 95,     // %
    platinum: 100 // %
  },
  
  // ========================================
  // SKIP TOKENS
  // ========================================
  skipTokens: {
    freeStarting: 3,
    freeMax: 5,
    premiumStarting: 10,
    premiumMax: 20,
    earnEveryNGames: 5        // earn 1 token every N games passed
  },
  
  // ========================================
  // POWER-UPS
  // ========================================
  powerups: {
    slowmo: {
      name: 'Slow-Mo',
      icon: '🐢',
      effect: 1.5,            // 1.5x slower
      duration: 15            // seconds
    },
    double: {
      name: 'Double Points',
      icon: '✖️2',
      multiplier: 2
    },
    retry: {
      name: 'Retry',
      icon: '💫',
      uses: 1
    },
    freeze: {
      name: 'Freeze',
      icon: '❄️',
      duration: 5             // seconds to pause timer
    }
  },
  
  // ========================================
  // UI SETTINGS
  // ========================================
  ui: {
    maxPlayerNameLength: 20,
    minPlayerNameLength: 2,
    toastDuration: 3000,      // milliseconds
    animationDuration: 300,   // milliseconds
    debounceDelay: 300        // milliseconds for click debounce
  },
  
  // ========================================
  // PARTY MODE
  // ========================================
  party: {
    maxPlayers: 8,
    minPlayers: 2,
    roomCodeLength: 6,
    gamesToSelect: 5,
    updateInterval: 1000,     // milliseconds for polling
    lobbyTimeout: 300         // seconds before lobby expires
  },
  
  // ========================================
  // STORAGE KEYS (centralized)
  // ========================================
  storageKeys: {
    prefix: 'cognixis_',
    user: 'cognixis_user',
    stats: 'cognixis_stats',
    scores: 'cognixis_game_scores',
    progress: 'cognixis_game_progress',
    settings: 'cognixis_settings',
    theme: 'cognixis-theme',
    sound: 'cognixis_sound',
    language: 'cognixis_language'
  },
  
  // ========================================
  // THEMES
  // ========================================
  themes: {
    default: 'cyber-neural',
    available: ['cyber-neural', 'neon-nights', 'gradient-fusion', 'dark-matter']
  },
  
  // ========================================
  // DIFFICULTY LEVELS
  // ========================================
  difficulty: {
    normal: {
      timeLimit: 60,
      scoreMultiplier: 1.0,
      label: 'Normal'
    },
    hard: {
      timeLimit: 45,
      scoreMultiplier: 1.5,
      label: 'Hard',
      requiresPremium: true
    },
    extreme: {
      timeLimit: 30,
      scoreMultiplier: 2.0,
      label: 'Extreme',
      requiresPremium: true
    }
  }
};

// Helper function to get nested config values
GAME_CONFIG.get = function(path, defaultValue) {
  const keys = path.split('.');
  let value = this;
  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      return defaultValue;
    }
  }
  return value;
};

// Freeze config to prevent accidental modifications
Object.freeze(GAME_CONFIG);
Object.freeze(GAME_CONFIG.timing);
Object.freeze(GAME_CONFIG.scoring);
Object.freeze(GAME_CONFIG.unlock);
Object.freeze(GAME_CONFIG.mastery);
Object.freeze(GAME_CONFIG.skipTokens);
Object.freeze(GAME_CONFIG.ui);
Object.freeze(GAME_CONFIG.party);
Object.freeze(GAME_CONFIG.storageKeys);
Object.freeze(GAME_CONFIG.themes);
Object.freeze(GAME_CONFIG.difficulty);

// Export for use across the app
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GAME_CONFIG;
}

