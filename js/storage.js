// ========================================
// COGNIXIS - LOCAL STORAGE MANAGER
// ========================================

const Storage = {
  // ========================================
  // 🎮 DEMO MODE - SET TO TRUE TO UNLOCK ALL
  // ========================================
  DEMO_MODE: false,  // <-- Set to true to test premium features
  
  KEYS: {
    USER: 'cognixis_user',
    STATS: 'cognixis_stats',
    BESTS: 'cognixis_bests',
    INVENTORY: 'cognixis_inventory',
    LEADERBOARD: 'cognixis_leaderboard',
    SETTINGS: 'cognixis_settings'
  },
  
  // Migration from old streakrush keys (run once)
  migrateFromStreakrush: () => {
    if (localStorage.getItem('cognixis_migration_done')) return;
    
    const oldToNew = {
      'streakrush_user': 'cognixis_user',
      'streakrush_stats': 'cognixis_stats',
      'streakrush_bests': 'cognixis_bests',
      'streakrush_inventory': 'cognixis_inventory',
      'streakrush_leaderboard': 'cognixis_leaderboard',
      'streakrush_settings': 'cognixis_settings'
    };
    
    for (const [oldKey, newKey] of Object.entries(oldToNew)) {
      const value = localStorage.getItem(oldKey);
      if (value !== null) {
        localStorage.setItem(newKey, value);
        localStorage.removeItem(oldKey);
      }
    }
    
    localStorage.setItem('cognixis_migration_done', 'true');
    console.log('✅ Migrated localStorage from streakrush to cognixis');
  },
  
  // Default user data (DEMO MODE gives premium + host access + coins)
  defaultUser: () => ({
    id: Utils.uuid(),
    name: 'Player',
    avatar: '👤',
    joinDate: Utils.getToday(),
    lastSession: null,
    // NEW STREAK: consecutive games passed (70%+)
    currentStreak: Storage.DEMO_MODE ? 12 : 0,   // Current consecutive passes
    bestStreak: Storage.DEMO_MODE ? 25 : 0,       // Longest streak ever
    totalGamesPlayed: Storage.DEMO_MODE ? 45 : 0, // Lifetime game count
    sessionsCompleted: Storage.DEMO_MODE ? 10 : 0, // Play sessions
    coins: Storage.DEMO_MODE ? 9999 : 100,  // Demo: lots of coins
    isPremium: Storage.DEMO_MODE,  // Demo: Premium unlocked
    isHost: Storage.DEMO_MODE      // Demo: Host access unlocked
  }),
  
  // Default stats
  defaultStats: () => ({
    totalGames: 0,
    totalScore: 0,
    longestStreak: 0,
    totalCoinsEarned: 0
  }),
  
  // Default personal bests
  defaultBests: () => ({
    reflex: null,
    memory: null,
    speed: null,
    coordination: null,
    logic: null,
    words: null,
    puzzle: null
  }),
  
  // Default inventory
  defaultInventory: () => ({
    slowmo: 0,
    double: 0,
    'second-chance': 0,
    freeze: 0,
    streakFreeze: 0
  }),
  
  // Default leaderboard (fake players for demo)
  defaultLeaderboard: () => {
    const names = ['Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Quinn', 'Avery', 'Jamie', 'Drew'];
    const avatars = ['😎', '🤖', '👾', '🎮', '🔥', '⭐', '🚀', '💎', '🎯', '🏆'];
    
    return names.map((name, i) => ({
      id: Utils.uuid(),
      name: name,
      avatar: avatars[i],
      score: Utils.random(500, 2000) - (i * 100),
      streak: Utils.random(10, 100) - (i * 5)
    })).sort((a, b) => b.score - a.score);
  },
  
  // Default settings
  defaultSettings: () => ({
    soundEnabled: true,
    vibrationEnabled: true,
    notificationsEnabled: false
  }),
  
  // Get data from localStorage with fallback
  get: (key, defaultValue) => {
    try {
      const data = localStorage.getItem(key);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Storage get error:', e);
    }
    return typeof defaultValue === 'function' ? defaultValue() : defaultValue;
  },
  
  // Save data to localStorage
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error('Storage set error:', e);
      return false;
    }
  },
  
  // Initialize all storage with defaults if empty
  init: () => {
    // First, migrate any old streakrush data
    Storage.migrateFromStreakrush();
    
    if (!localStorage.getItem(Storage.KEYS.USER)) {
      Storage.set(Storage.KEYS.USER, Storage.defaultUser());
    }
    if (!localStorage.getItem(Storage.KEYS.STATS)) {
      Storage.set(Storage.KEYS.STATS, Storage.defaultStats());
    }
    if (!localStorage.getItem(Storage.KEYS.BESTS)) {
      Storage.set(Storage.KEYS.BESTS, Storage.defaultBests());
    }
    if (!localStorage.getItem(Storage.KEYS.INVENTORY)) {
      Storage.set(Storage.KEYS.INVENTORY, Storage.defaultInventory());
    }
    if (!localStorage.getItem(Storage.KEYS.LEADERBOARD)) {
      Storage.set(Storage.KEYS.LEADERBOARD, Storage.defaultLeaderboard());
    }
    if (!localStorage.getItem(Storage.KEYS.SETTINGS)) {
      Storage.set(Storage.KEYS.SETTINGS, Storage.defaultSettings());
    }
  },
  
  // Get user data
  getUser: () => Storage.get(Storage.KEYS.USER, Storage.defaultUser),
  
  // Update user data (partial update)
  updateUser: (updates) => {
    const user = Storage.getUser();
    const updated = { ...user, ...updates };
    Storage.set(Storage.KEYS.USER, updated);
    return updated;
  },
  
  // Get stats
  getStats: () => Storage.get(Storage.KEYS.STATS, Storage.defaultStats),
  
  // Update stats
  updateStats: (updates) => {
    const stats = Storage.getStats();
    const updated = { ...stats, ...updates };
    Storage.set(Storage.KEYS.STATS, updated);
    return updated;
  },
  
  // Get personal bests
  getBests: () => Storage.get(Storage.KEYS.BESTS, Storage.defaultBests),
  
  // Update personal best for a challenge type
  updateBest: (type, score) => {
    const bests = Storage.getBests();
    if (!bests[type] || score > bests[type]) {
      bests[type] = score;
      Storage.set(Storage.KEYS.BESTS, bests);
      return true; // New record!
    }
    return false;
  },
  
  // Get inventory
  getInventory: () => Storage.get(Storage.KEYS.INVENTORY, Storage.defaultInventory),
  
  // Update inventory
  updateInventory: (updates) => {
    const inventory = Storage.getInventory();
    const updated = { ...inventory, ...updates };
    Storage.set(Storage.KEYS.INVENTORY, updated);
    return updated;
  },
  
  // Use an inventory item
  useItem: (item) => {
    const inventory = Storage.getInventory();
    if (inventory[item] > 0) {
      inventory[item]--;
      Storage.set(Storage.KEYS.INVENTORY, inventory);
      return true;
    }
    return false;
  },
  
  // Add item to inventory
  addItem: (item, count = 1) => {
    const inventory = Storage.getInventory();
    inventory[item] = (inventory[item] || 0) + count;
    Storage.set(Storage.KEYS.INVENTORY, inventory);
    return inventory[item];
  },
  
  // Get leaderboard
  getLeaderboard: () => Storage.get(Storage.KEYS.LEADERBOARD, Storage.defaultLeaderboard),
  
  // Add score to leaderboard
  addToLeaderboard: (score) => {
    const user = Storage.getUser();
    const leaderboard = Storage.getLeaderboard();
    
    // Find if user already in leaderboard
    const existingIndex = leaderboard.findIndex(entry => entry.id === user.id);
    
    if (existingIndex >= 0) {
      // Update if new score is higher
      if (score > leaderboard[existingIndex].score) {
        leaderboard[existingIndex].score = score;
        leaderboard[existingIndex].streak = user.streak;
      }
    } else {
      // Add new entry
      leaderboard.push({
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        score: score,
        streak: user.streak
      });
    }
    
    // Sort by score descending
    leaderboard.sort((a, b) => b.score - a.score);
    
    // Keep top 100
    const trimmed = leaderboard.slice(0, 100);
    Storage.set(Storage.KEYS.LEADERBOARD, trimmed);
    
    // Return user's rank
    return trimmed.findIndex(entry => entry.id === user.id) + 1;
  },
  
  // Get settings
  getSettings: () => Storage.get(Storage.KEYS.SETTINGS, Storage.defaultSettings),
  
  // Update settings
  updateSettings: (updates) => {
    const settings = Storage.getSettings();
    const updated = { ...settings, ...updates };
    Storage.set(Storage.KEYS.SETTINGS, updated);
    return updated;
  },
  
  // Add coins to user
  addCoins: (amount) => {
    const user = Storage.getUser();
    user.coins += amount;
    Storage.set(Storage.KEYS.USER, user);
    
    // Update total coins earned stat
    const stats = Storage.getStats();
    stats.totalCoinsEarned += amount;
    Storage.set(Storage.KEYS.STATS, stats);
    
    return user.coins;
  },
  
  // Spend coins
  spendCoins: (amount) => {
    const user = Storage.getUser();
    if (user.coins >= amount) {
      user.coins -= amount;
      Storage.set(Storage.KEYS.USER, user);
      return true;
    }
    return false;
  },
  
  // Reset daily attempts (call when new day)
  resetDailyAttempts: () => {
    Storage.updateUser({
      attemptsToday: 3,
      todayPlayed: false
    });
  },
  
  // Use an attempt
  useAttempt: () => {
    const user = Storage.getUser();
    if (user.attemptsToday > 0) {
      user.attemptsToday--;
      Storage.set(Storage.KEYS.USER, user);
      return user.attemptsToday;
    }
    return -1; // No attempts left
  },
  
  // Clear all data (for testing)
  clearAll: () => {
    Object.values(Storage.KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  },
  
  // ========================================
  // MEMORY CATEGORY TRACKING
  // ========================================
  
  // Memory categories mapped to game names
  MEMORY_CATEGORIES: {
    SPATIAL: ['World Capitals', 'Flag Match', 'Continent Sort', 'Population Battle'],
    NUMERIC: ['Speed Math', 'Number Sequence', 'Math Challenge', 'Ultimate Quiz'],
    VISUAL: ['Memory Sequence', 'Color Match', 'Pattern Recognition'],
    VERBAL: ['Word Scramble', 'Vocabulary', 'True or False'],
    SPEED: ['Reaction Test', 'Quick Fire', 'Time Trial']
  },
  
  // Find game ID by name
  findGameIdByName: (gameName) => {
    if (typeof GAMES === 'undefined') return null;
    const game = GAMES.find(g => g.name === gameName);
    return game ? game.id : null;
  },
  
  // Calculate trend from scores array
  calculateTrend: (scores) => {
    if (scores.length < 3) return 'stable';
    
    const recent = scores.slice(-3);
    const earlier = scores.slice(0, 3);
    
    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const earlierAvg = earlier.reduce((a, b) => a + b, 0) / earlier.length;
    
    const diff = recentAvg - earlierAvg;
    
    if (diff > 5) return 'improving';
    if (diff < -5) return 'declining';
    return 'stable';
  },
  
  // Get memory performance profile by category
  getMemoryProfile: () => {
    const scores = JSON.parse(localStorage.getItem('cognixis_game_scores') || '{}');
    const profile = {};
    
    for (const [category, gameNames] of Object.entries(Storage.MEMORY_CATEGORIES)) {
      const categoryScores = gameNames
        .map(gameName => {
          const gameId = Storage.findGameIdByName(gameName);
          return gameId && scores[gameId] ? scores[gameId].percentage : 0;
        })
        .filter(score => score > 0);
      
      if (categoryScores.length > 0) {
        profile[category] = {
          average: Math.round(categoryScores.reduce((a, b) => a + b, 0) / categoryScores.length),
          gamesPlayed: categoryScores.length,
          totalGames: gameNames.length,
          trend: Storage.calculateTrend(categoryScores),
          emoji: Storage.getCategoryEmoji(category)
        };
      }
    }
    
    return profile;
  },
  
  // Get emoji for memory category
  getCategoryEmoji: (category) => {
    const emojis = {
      SPATIAL: '🗺️',
      NUMERIC: '🔢',
      VISUAL: '👁️',
      VERBAL: '🔤',
      SPEED: '⚡'
    };
    return emojis[category] || '🧠';
  },
  
  // Get strongest and weakest memory areas
  getMemoryStrengths: () => {
    const profile = Storage.getMemoryProfile();
    const categories = Object.entries(profile);
    
    if (categories.length === 0) {
      return { strongest: null, weakest: null };
    }
    
    categories.sort((a, b) => b[1].average - a[1].average);
    
    return {
      strongest: categories[0] ? { name: categories[0][0], ...categories[0][1] } : null,
      weakest: categories[categories.length - 1] ? { name: categories[categories.length - 1][0], ...categories[categories.length - 1][1] } : null
    };
  },
  
  // ========================================
  // REACTION TIME TRACKING
  // ========================================
  
  // Track reaction time for speed games
  trackReactionTime: (gameId, reactionTimeMs) => {
    const key = `cognixis_reaction_${gameId}`;
    const history = JSON.parse(localStorage.getItem(key) || '[]');
    
    history.push({
      time: reactionTimeMs,
      date: new Date().toISOString()
    });
    
    // Keep last 10 attempts
    if (history.length > 10) history.shift();
    
    localStorage.setItem(key, JSON.stringify(history));
    
    const times = history.map(h => h.time);
    const average = Math.round(times.reduce((a, b) => a + b, 0) / times.length);
    const best = Math.min(...times);
    
    return {
      current: reactionTimeMs,
      average: average,
      best: best,
      attempts: history.length,
      improvement: history.length > 1 
        ? Math.round(history[0].time - reactionTimeMs)
        : 0,
      isPersonalBest: reactionTimeMs === best
    };
  },
  
  // Get reaction time history for a game
  getReactionHistory: (gameId) => {
    const key = `cognixis_reaction_${gameId}`;
    const history = JSON.parse(localStorage.getItem(key) || '[]');
    
    if (history.length === 0) {
      return null;
    }
    
    const times = history.map(h => h.time);
    
    return {
      history: history,
      average: Math.round(times.reduce((a, b) => a + b, 0) / times.length),
      best: Math.min(...times),
      worst: Math.max(...times),
      attempts: history.length,
      trend: Storage.calculateReactionTrend(times)
    };
  },
  
  // Calculate reaction time trend
  calculateReactionTrend: (times) => {
    if (times.length < 3) return 'stable';
    
    const recent = times.slice(-3);
    const earlier = times.slice(0, 3);
    
    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const earlierAvg = earlier.reduce((a, b) => a + b, 0) / earlier.length;
    
    const diff = earlierAvg - recentAvg; // Lower is better for reaction time
    
    if (diff > 20) return 'improving';
    if (diff < -20) return 'declining';
    return 'stable';
  },
  
  // ========================================
  // OVERALL BRAIN SCORE
  // ========================================
  
  // Calculate overall brain/memory score
  getBrainScore: () => {
    const profile = Storage.getMemoryProfile();
    const categories = Object.values(profile);
    
    if (categories.length === 0) {
      return { score: 0, level: 'Beginner', emoji: '🌱' };
    }
    
    // Weighted average of all category averages
    const totalAvg = categories.reduce((sum, cat) => sum + cat.average, 0) / categories.length;
    
    // Get user stats
    const user = Storage.getUser();
    const gamesPlayed = user.totalGamesPlayed || 0;
    
    // Factor in consistency (games played)
    const consistencyBonus = Math.min(gamesPlayed * 0.5, 20);
    
    // Factor in streaks
    const streakBonus = Math.min((user.bestStreak || 0) * 0.3, 15);
    
    const finalScore = Math.round(Math.min(totalAvg + consistencyBonus + streakBonus, 100));
    
    // Determine level
    let level, emoji;
    if (finalScore >= 90) { level = 'Memory Master'; emoji = '🧠💎'; }
    else if (finalScore >= 80) { level = 'Expert'; emoji = '🧠🥇'; }
    else if (finalScore >= 70) { level = 'Advanced'; emoji = '🧠⭐'; }
    else if (finalScore >= 60) { level = 'Intermediate'; emoji = '🧠'; }
    else if (finalScore >= 40) { level = 'Developing'; emoji = '🌿'; }
    else { level = 'Beginner'; emoji = '🌱'; }
    
    return {
      score: finalScore,
      level: level,
      emoji: emoji,
      breakdown: {
        baseScore: Math.round(totalAvg),
        consistencyBonus: Math.round(consistencyBonus),
        streakBonus: Math.round(streakBonus)
      }
    };
  }
};

