// ========================================
// STREAKRUSH - GAME LIMIT SYSTEM
// DEPRECATED: No daily limits - unlimited plays
// Premium unlock at game 10
// ========================================

const GameLimit = {
  MAX_FREE_GAMES: 10,
  
  // Get total games played (all-time)
  getGamesPlayed: () => {
    const data = localStorage.getItem('streakrush_games_played');
    if (!data) return { count: 0, games: [] };
    return JSON.parse(data);
  },
  
  // Record a game played
  recordGamePlayed: (gameId) => {
    const current = GameLimit.getGamesPlayed();
    current.count++;
    if (!current.games.includes(gameId)) {
      current.games.push(gameId);
    }
    localStorage.setItem('streakrush_games_played', JSON.stringify(current));
    return current.count;
  },
  
  // Can always play more (no daily limit)
  canPlayMore: () => {
    return true;
  },
  
  // Unlimited plays
  getRemainingGames: () => {
    return 999;
  },
  
  // Check if premium is unlocked
  isUnlocked: () => {
    const user = Storage.getUser();
    return user.isPremium === true;
  },
  
  // Unlock premium
  unlockUnlimited: () => {
    Storage.updateUser({ isPremium: true });
    return true;
  }
};

