// ========================================
// STREAKRUSH - GAME LIMIT SYSTEM
// 10 games per day, unlock for $5.99
// ========================================

const GameLimit = {
  MAX_FREE_GAMES: 10,
  UNLOCK_PRICE: 5.99,
  
  // Get today's date key
  getTodayKey: () => {
    const now = new Date();
    return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
  },
  
  // Get games played today
  getGamesPlayedToday: () => {
    const data = localStorage.getItem('streakrush_daily_games');
    if (!data) return { date: null, count: 0, games: [] };
    
    const parsed = JSON.parse(data);
    const today = GameLimit.getTodayKey();
    
    // Reset if it's a new day
    if (parsed.date !== today) {
      return { date: today, count: 0, games: [] };
    }
    
    return parsed;
  },
  
  // Increment games played
  recordGamePlayed: (gameId) => {
    const today = GameLimit.getTodayKey();
    const current = GameLimit.getGamesPlayedToday();
    
    current.date = today;
    current.count++;
    current.games.push(gameId);
    
    localStorage.setItem('streakrush_daily_games', JSON.stringify(current));
    
    return current.count;
  },
  
  // Check if can play more games
  canPlayMore: () => {
    if (GameLimit.isUnlocked()) return true;
    
    const current = GameLimit.getGamesPlayedToday();
    return current.count < GameLimit.MAX_FREE_GAMES;
  },
  
  // Get remaining free games
  getRemainingGames: () => {
    if (GameLimit.isUnlocked()) return 999;
    
    const current = GameLimit.getGamesPlayedToday();
    return Math.max(0, GameLimit.MAX_FREE_GAMES - current.count);
  },
  
  // Check if unlimited is unlocked
  isUnlocked: () => {
    return localStorage.getItem('streakrush_unlimited') === 'true';
  },
  
  // Unlock unlimited games
  unlockUnlimited: () => {
    localStorage.setItem('streakrush_unlimited', 'true');
    return true;
  },
  
  // Get time until reset (midnight)
  getTimeUntilReset: () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const diff = tomorrow - now;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return { hours, minutes, total: diff };
  },
  
  // Format time until reset
  formatTimeUntilReset: () => {
    const time = GameLimit.getTimeUntilReset();
    return `${time.hours}h ${time.minutes}m`;
  }
};

