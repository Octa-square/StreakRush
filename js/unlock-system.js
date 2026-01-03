// ========================================
// STREAKRUSH - SEQUENTIAL UNLOCK SYSTEM
// Must score 70%+ to unlock next game
// Premium required after game 20
// Mastery tiers: Bronze, Silver, Gold, Platinum
// ========================================

const UnlockSystem = {
  UNLOCK_THRESHOLD: 70, // 70% required to pass
  FREE_GAMES: 20, // Games 1-20 are free (changed from 10)
  PREMIUM_REQUIRED: 21, // Premium starts at game 21
  
  // Mastery tiers based on score percentage
  MASTERY_TIERS: {
    PLATINUM: { minScore: 100, color: '#E5E4E2', stars: 4, bonus: 300, emoji: '💎' },
    GOLD: { minScore: 95, color: '#FFD700', stars: 3, bonus: 150, emoji: '🥇' },
    SILVER: { minScore: 85, color: '#C0C0C0', stars: 2, bonus: 50, emoji: '🥈' },
    BRONZE: { minScore: 70, color: '#CD7F32', stars: 1, bonus: 0, emoji: '🥉' }
  },
  
  // Get mastery tier based on percentage
  getMasteryTier: (percentage) => {
    if (percentage >= 100) return 'PLATINUM';
    if (percentage >= 95) return 'GOLD';
    if (percentage >= 85) return 'SILVER';
    if (percentage >= 70) return 'BRONZE';
    return 'FAIL';
  },
  
  // Get tier info
  getTierInfo: (tierName) => {
    return UnlockSystem.MASTERY_TIERS[tierName] || null;
  },
  
  // Initialize unlock system
  init: () => {
    // Ensure progress exists - start at game 1
    if (!localStorage.getItem('streakrush_game_progress')) {
      localStorage.setItem('streakrush_game_progress', JSON.stringify({ highest: 1 }));
    }
  },
  
  // Get the highest unlocked game (1-based)
  getHighestUnlocked: () => {
    const user = Storage.getUser();
    if (user.isPremium) return 365; // Premium unlocks all
    
    const progress = JSON.parse(localStorage.getItem('streakrush_game_progress') || '{"highest": 1}');
    return Math.min(progress.highest || 1, UnlockSystem.FREE_GAMES + 1);
  },
  
  // Check if a specific game is unlocked
  isGameUnlocked: (gameId) => {
    const user = Storage.getUser();
    if (user.isPremium) return true;
    
    const highest = UnlockSystem.getHighestUnlocked();
    return gameId <= highest;
  },
  
  // Check if game can be played (unlocked AND within free tier or premium)
  canPlayGame: (gameId) => {
    const user = Storage.getUser();
    
    // Premium can play anything
    if (user.isPremium) return true;
    
    // Must be unlocked
    if (!UnlockSystem.isGameUnlocked(gameId)) return false;
    
    // Must be within free tier
    return gameId <= UnlockSystem.FREE_GAMES;
  },
  
  // Record a game score and check if next game is unlocked
  recordGameScore: (gameId, score, maxPossibleScore, questionsAnswered = 0) => {
    const percentage = maxPossibleScore > 0 ? Math.round((score / maxPossibleScore) * 100) : 0;
    const tier = UnlockSystem.getMasteryTier(percentage);
    const tierInfo = UnlockSystem.getTierInfo(tier);
    
    // Save score with mastery info
    const scores = JSON.parse(localStorage.getItem('streakrush_game_scores') || '{}');
    const existingScore = scores[gameId];
    const plays = (existingScore?.plays || 0) + 1;
    
    // Only update if this is a new best score
    if (!existingScore || percentage > existingScore.percentage) {
      scores[gameId] = {
        score,
        percentage,
        tier: tier !== 'FAIL' ? tier : null,
        stars: tierInfo?.stars || 0,
        questionsAnswered,
        plays,
        bonus: tierInfo?.bonus || 0,
        lastPlayed: new Date().toISOString()
      };
      localStorage.setItem('streakrush_game_scores', JSON.stringify(scores));
      
      // Add bonus coins for mastery
      if (tierInfo?.bonus > 0) {
        Storage.addCoins(tierInfo.bonus);
      }
    } else {
      // Just update plays count
      scores[gameId].plays = plays;
      scores[gameId].lastPlayed = new Date().toISOString();
      localStorage.setItem('streakrush_game_scores', JSON.stringify(scores));
    }
    
    // Check if passed (70%+)
    const passed = percentage >= UnlockSystem.UNLOCK_THRESHOLD;
    
    if (passed) {
      const progress = JSON.parse(localStorage.getItem('streakrush_game_progress') || '{"highest": 1}');
      
      // Unlock next game if this was the highest
      if (gameId >= progress.highest && gameId < 365) {
        progress.highest = gameId + 1;
        localStorage.setItem('streakrush_game_progress', JSON.stringify(progress));
      }
    }
    
    return {
      percentage,
      passed,
      threshold: UnlockSystem.UNLOCK_THRESHOLD,
      tier: tier !== 'FAIL' ? tier : null,
      tierInfo,
      stars: tierInfo?.stars || 0,
      bonus: tierInfo?.bonus || 0,
      nextUnlocked: passed && gameId === UnlockSystem.getHighestUnlocked() - 1,
      isNewBest: !existingScore || percentage > existingScore.percentage
    };
  },
  
  // Get score for a game
  getGameScore: (gameId) => {
    const scores = JSON.parse(localStorage.getItem('streakrush_game_scores') || '{}');
    return scores[gameId] || null;
  },
  
  // Get all scores
  getAllScores: () => {
    return JSON.parse(localStorage.getItem('streakrush_game_scores') || '{}');
  },
  
  // Check if user needs premium (completed free games)
  needsPremium: () => {
    const user = Storage.getUser();
    if (user.isPremium) return false;
    
    const highest = UnlockSystem.getHighestUnlocked();
    return highest > UnlockSystem.FREE_GAMES;
  },
  
  // Get available games for display (only unlocked ones)
  getAvailableGames: () => {
    const highest = UnlockSystem.getHighestUnlocked();
    const user = Storage.getUser();
    
    return GAMES.filter(game => {
      if (user.isPremium) return true;
      return game.id <= highest && game.id <= UnlockSystem.FREE_GAMES;
    });
  },
  
  // Get progress info for UI
  getProgressInfo: () => {
    const highest = UnlockSystem.getHighestUnlocked();
    const user = Storage.getUser();
    const scores = JSON.parse(localStorage.getItem('streakrush_game_scores') || '{}');
    
    // Count completed games (70%+) and mastery stats
    let completed = 0;
    let totalStars = 0;
    let platinumCount = 0;
    let goldCount = 0;
    let silverCount = 0;
    let bronzeCount = 0;
    
    Object.values(scores).forEach(s => {
      if (s.percentage >= UnlockSystem.UNLOCK_THRESHOLD) {
        completed++;
        totalStars += s.stars || 0;
        
        if (s.tier === 'PLATINUM') platinumCount++;
        else if (s.tier === 'GOLD') goldCount++;
        else if (s.tier === 'SILVER') silverCount++;
        else if (s.tier === 'BRONZE') bronzeCount++;
      }
    });
    
    return {
      currentGame: highest,
      completedGames: completed,
      totalFreeGames: UnlockSystem.FREE_GAMES,
      isPremium: user.isPremium,
      needsPremium: UnlockSystem.needsPremium(),
      totalStars,
      mastery: {
        platinum: platinumCount,
        gold: goldCount,
        silver: silverCount,
        bronze: bronzeCount
      }
    };
  },
  
  // Get star display for a score
  getStarDisplay: (percentage) => {
    const tier = UnlockSystem.getMasteryTier(percentage);
    const tierInfo = UnlockSystem.getTierInfo(tier);
    if (!tierInfo) return '';
    
    return '⭐'.repeat(tierInfo.stars);
  },
  
  // Reset progress (for testing)
  resetProgress: () => {
    localStorage.setItem('streakrush_game_progress', JSON.stringify({ highest: 1 }));
    localStorage.removeItem('streakrush_game_scores');
  }
};
