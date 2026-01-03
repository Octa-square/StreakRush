// ========================================
// STREAKRUSH - STREAK MANAGEMENT
// ========================================

const Streak = {
  // Get milestone floor based on current streak
  getMilestoneFloor: (streak) => {
    if (streak >= 365) return 365; // Diamond
    if (streak >= 100) return 100; // Gold
    if (streak >= 30) return 30;   // Silver
    if (streak >= 7) return 7;     // Bronze
    return 0; // No protection yet
  },
  
  // Get current tier info
  getTier: (streak) => {
    if (streak >= 365) return { ...MILESTONES.diamond, tier: 'diamond' };
    if (streak >= 100) return { ...MILESTONES.gold, tier: 'gold' };
    if (streak >= 30) return { ...MILESTONES.silver, tier: 'silver' };
    if (streak >= 7) return { ...MILESTONES.bronze, tier: 'bronze' };
    return null;
  },
  
  // Get flame display based on streak
  getFlames: (streak) => {
    if (streak >= 365) return '🔥🔥🔥🔥🔥';
    if (streak >= 100) return '🔥🔥🔥🔥';
    if (streak >= 30) return '🔥🔥🔥';
    if (streak >= 7) return '🔥🔥';
    if (streak >= 1) return '🔥';
    return '💤';
  },
  
  // Check and update streak on game load
  checkStreak: () => {
    const user = Storage.getUser();
    const today = Utils.getToday();
    
    // First time playing ever
    if (!user.lastPlayed) {
      return { status: 'new', streak: 0 };
    }
    
    const daysSinceLastPlayed = Utils.daysBetween(user.lastPlayed, today);
    
    // Already played today
    if (user.lastPlayed === today) {
      return { status: 'today', streak: user.streak };
    }
    
    // Played yesterday, streak continues
    if (daysSinceLastPlayed === 1) {
      return { status: 'continue', streak: user.streak };
    }
    
    // Missed day(s) - calculate fallback
    if (daysSinceLastPlayed > 1) {
      const oldStreak = user.streak;
      const milestoneFloor = Streak.getMilestoneFloor(user.streak);
      const newStreak = Math.max(user.lastCheckpoint, milestoneFloor);
      
      // Update user with new streak
      Storage.updateUser({
        streak: newStreak,
        lastCheckpoint: Math.floor(newStreak / 7) * 7 // Reset checkpoint to new valid point
      });
      
      return { 
        status: 'lost', 
        oldStreak: oldStreak,
        newStreak: newStreak,
        daysLost: oldStreak - newStreak
      };
    }
    
    return { status: 'continue', streak: user.streak };
  },
  
  // Increment streak after completing a challenge
  incrementStreak: () => {
    const user = Storage.getUser();
    const today = Utils.getToday();
    
    // Only increment once per day
    if (user.todayPlayed) {
      return { 
        streak: user.streak, 
        isNew: false,
        checkpoint: false 
      };
    }
    
    const newStreak = user.streak + 1;
    const isCheckpoint = newStreak % 7 === 0;
    
    const updates = {
      streak: newStreak,
      lastPlayed: today,
      todayPlayed: true
    };
    
    // Auto-checkpoint every 7 days
    if (isCheckpoint) {
      updates.lastCheckpoint = newStreak;
    }
    
    Storage.updateUser(updates);
    
    // Update longest streak stat if needed
    const stats = Storage.getStats();
    if (newStreak > stats.longestStreak) {
      Storage.updateStats({ longestStreak: newStreak });
    }
    
    return { 
      streak: newStreak, 
      isNew: true,
      checkpoint: isCheckpoint
    };
  },
  
  // Get today's challenge info
  getTodayChallenge: () => {
    const user = Storage.getUser();
    const today = Utils.getToday();
    
    // Calculate days since join
    const daysSinceJoin = Utils.daysBetween(user.joinDate, today);
    const challengeDay = daysSinceJoin + 1; // Day 1, 2, 3, etc.
    
    // Rotate through 7 challenge types
    const challengeIndex = (challengeDay - 1) % 7;
    const challengeType = CHALLENGE_ORDER[challengeIndex];
    
    // Determine variation (changes every 7 days)
    const variationIndex = Math.floor((challengeDay - 1) / 7) % 5;
    
    // Determine difficulty based on streak/days
    const difficulty = Math.min(10, Math.floor(user.streak / 30) + 1);
    
    return {
      day: challengeDay,
      type: challengeType,
      typeInfo: CHALLENGE_TYPES[challengeType],
      variation: variationIndex,
      difficulty: difficulty
    };
  },
  
  // Use streak freeze (prevents streak loss for one day)
  useStreakFreeze: () => {
    const inventory = Storage.getInventory();
    if (inventory.streakFreeze > 0) {
      Storage.useItem('streakFreeze');
      return true;
    }
    return false;
  },
  
  // Get days until next milestone
  daysToNextMilestone: (currentStreak) => {
    const milestones = [7, 30, 100, 365];
    for (const milestone of milestones) {
      if (currentStreak < milestone) {
        return milestone - currentStreak;
      }
    }
    return null; // Already at max
  },
  
  // Get progress to next milestone as percentage
  progressToNextMilestone: (currentStreak) => {
    const milestones = [0, 7, 30, 100, 365];
    for (let i = 1; i < milestones.length; i++) {
      if (currentStreak < milestones[i]) {
        const prev = milestones[i - 1];
        const next = milestones[i];
        return ((currentStreak - prev) / (next - prev)) * 100;
      }
    }
    return 100;
  }
};

