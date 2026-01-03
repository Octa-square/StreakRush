// ========================================
// STREAKRUSH - PROGRESSIVE UNLOCK SYSTEM
// Free: 1-10, $5.99: 11-40, 80% threshold or $9.99: 41-60
// ========================================

const UnlockSystem = {
  // Tier definitions
  tiers: {
    free: { start: 1, end: 10, price: 0, name: 'Starter Pack' },
    tier1: { start: 11, end: 40, price: 5.99, name: 'Explorer Pack' },
    tier2: { start: 41, end: 60, price: 9.99, name: 'Master Pack' }
  },
  
  // Get current unlock status
  getStatus: () => {
    const unlocks = JSON.parse(localStorage.getItem('streakrush_unlocks') || '{"free": true}');
    return unlocks;
  },
  
  // Check if a game is unlocked
  isGameUnlocked: (gameId) => {
    const unlocks = UnlockSystem.getStatus();
    
    // Free tier (1-10)
    if (gameId <= 10) return true;
    
    // Tier 1 (11-40)
    if (gameId <= 40) {
      return unlocks.tier1 === true;
    }
    
    // Tier 2 (41-60)
    if (gameId <= 60) {
      // Check if paid OR achieved 80% score
      if (unlocks.tier2 === true) return true;
      
      // Check 80% score threshold
      return UnlockSystem.hasAchieved80Percent();
    }
    
    return false;
  },
  
  // Get which tier a game belongs to
  getGameTier: (gameId) => {
    if (gameId <= 10) return 'free';
    if (gameId <= 40) return 'tier1';
    return 'tier2';
  },
  
  // Check if user has achieved 80% on tier 1 games
  hasAchieved80Percent: () => {
    const stats = UnlockSystem.getTier1Stats();
    if (stats.gamesPlayed < 30) return false; // Must play all 30 games
    return stats.averagePercent >= 80;
  },
  
  // Get tier 1 game stats (11-40)
  getTier1Stats: () => {
    const scores = JSON.parse(localStorage.getItem('streakrush_game_scores') || '{}');
    let totalPercent = 0;
    let gamesPlayed = 0;
    
    // Games 11-40
    for (let i = 11; i <= 40; i++) {
      if (scores[`game-${i}`]) {
        // Assume max score is 500 for percentage calc
        const percent = Math.min(100, (scores[`game-${i}`] / 500) * 100);
        totalPercent += percent;
        gamesPlayed++;
      }
    }
    
    return {
      gamesPlayed,
      totalGames: 30,
      averagePercent: gamesPlayed > 0 ? Math.round(totalPercent / gamesPlayed) : 0
    };
  },
  
  // Unlock a tier
  unlockTier: (tier) => {
    const unlocks = UnlockSystem.getStatus();
    unlocks[tier] = true;
    localStorage.setItem('streakrush_unlocks', JSON.stringify(unlocks));
  },
  
  // Get next unlock requirement
  getNextUnlockInfo: (gameId) => {
    const tier = UnlockSystem.getGameTier(gameId);
    
    if (tier === 'tier1') {
      return {
        price: 5.99,
        description: 'Unlock 30 more games!',
        tierName: 'Explorer Pack',
        games: '11-40'
      };
    }
    
    if (tier === 'tier2') {
      const stats = UnlockSystem.getTier1Stats();
      const needs80 = !UnlockSystem.hasAchieved80Percent();
      
      return {
        price: 9.99,
        description: needs80 
          ? `Get 80% average score OR pay to unlock!`
          : 'Unlock the final 20 games!',
        tierName: 'Master Pack',
        games: '41-60',
        currentPercent: stats.averagePercent,
        requiredPercent: 80,
        canEarn: needs80
      };
    }
    
    return null;
  },
  
  // Record a game score for threshold calculation
  recordScore: (gameId, score) => {
    const scores = JSON.parse(localStorage.getItem('streakrush_game_scores') || '{}');
    const key = `game-${gameId}`;
    
    // Keep highest score
    if (!scores[key] || score > scores[key]) {
      scores[key] = score;
    }
    
    localStorage.setItem('streakrush_game_scores', JSON.stringify(scores));
  },
  
  // Get games available to play
  getAvailableGames: () => {
    const available = [];
    
    for (let i = 1; i <= 60; i++) {
      if (UnlockSystem.isGameUnlocked(i)) {
        const game = getGameById(i);
        if (game) available.push(game);
      }
    }
    
    return available;
  },
  
  // Get locked games count
  getLockedCount: () => {
    let locked = 0;
    for (let i = 1; i <= 60; i++) {
      if (!UnlockSystem.isGameUnlocked(i)) locked++;
    }
    return locked;
  }
};

