// ========================================
// STREAKRUSH - STREAK MANAGEMENT
// NEW: Streak = consecutive games passed (70%+)
// ========================================

const Streak = {
  // Update streak after a game
  // Returns the new streak value
  updateStreak: (percentage) => {
    const user = Storage.getUser();
    
    if (percentage >= 70) {
      // SUCCESS: Increment streak
      const newStreak = (user.currentStreak || 0) + 1;
      const newBest = Math.max(user.bestStreak || 0, newStreak);
      
      Storage.updateUser({
        currentStreak: newStreak,
        bestStreak: newBest,
        totalGamesPlayed: (user.totalGamesPlayed || 0) + 1
      });
      
      return {
        streak: newStreak,
        bestStreak: newBest,
        passed: true,
        isNewBest: newStreak > (user.bestStreak || 0)
      };
    } else {
      // FAILED: Reset streak to 0
      Storage.updateUser({
        currentStreak: 0,
        totalGamesPlayed: (user.totalGamesPlayed || 0) + 1
      });
      
      return {
        streak: 0,
        bestStreak: user.bestStreak || 0,
        passed: false,
        previousStreak: user.currentStreak || 0
      };
    }
  },
  
  // Get current streak info
  getStreakInfo: () => {
    const user = Storage.getUser();
    return {
      current: user.currentStreak || 0,
      best: user.bestStreak || 0,
      totalGames: user.totalGamesPlayed || 0
    };
  },
  
  // Get streak tier based on current streak
  getTier: (streak) => {
    if (streak >= 50) return { name: 'Diamond', tier: 'diamond', emoji: '💎' };
    if (streak >= 25) return { name: 'Gold', tier: 'gold', emoji: '🥇' };
    if (streak >= 10) return { name: 'Silver', tier: 'silver', emoji: '🥈' };
    if (streak >= 5) return { name: 'Bronze', tier: 'bronze', emoji: '🥉' };
    return null;
  },
  
  // Get flame display based on streak
  getFlames: (streak) => {
    if (streak >= 50) return '🔥🔥🔥🔥🔥';
    if (streak >= 25) return '🔥🔥🔥🔥';
    if (streak >= 10) return '🔥🔥🔥';
    if (streak >= 5) return '🔥🔥';
    if (streak >= 1) return '🔥';
    return '💤';
  },
  
  // Get games until next tier
  gamesToNextTier: (currentStreak) => {
    const tiers = [5, 10, 25, 50];
    for (const tier of tiers) {
      if (currentStreak < tier) {
        return tier - currentStreak;
      }
    }
    return null; // Already at max
  },
  
  // Check streak (simplified - no day logic)
  checkStreak: () => {
    const user = Storage.getUser();
    return { 
      status: 'ready', 
      streak: user.currentStreak || 0,
      bestStreak: user.bestStreak || 0
    };
  },
  
  // DEPRECATED: For backwards compatibility
  incrementStreak: () => {
    const user = Storage.getUser();
    return { 
      streak: user.currentStreak || 0, 
      isNew: false,
      checkpoint: false 
    };
  }
};
