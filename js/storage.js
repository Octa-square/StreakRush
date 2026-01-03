// ========================================
// STREAKRUSH - LOCAL STORAGE MANAGER
// ========================================

const Storage = {
  KEYS: {
    USER: 'streakrush_user',
    STATS: 'streakrush_stats',
    BESTS: 'streakrush_bests',
    INVENTORY: 'streakrush_inventory',
    LEADERBOARD: 'streakrush_leaderboard',
    SETTINGS: 'streakrush_settings'
  },
  
  // Default user data
  defaultUser: () => ({
    id: Utils.uuid(),
    name: 'Player',
    avatar: '👤',
    joinDate: Utils.getToday(),
    lastPlayed: null,
    streak: 0,
    lastCheckpoint: 0,
    coins: 100, // Starting coins
    todayPlayed: false,
    attemptsToday: 3
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
  }
};

