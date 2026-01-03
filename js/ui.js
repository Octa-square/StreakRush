// ========================================
// STREAKRUSH - UI CONTROLLER
// 60 Games Version
// ========================================

const UI = {
  currentScreen: 'loading',
  wheelSpinning: false,
  
  // Show a screen
  showScreen: (screenId) => {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
      screen.classList.remove('active');
    });
    
    // Show target screen
    const screen = document.getElementById(`${screenId}-screen`);
    if (screen) {
      screen.classList.add('active');
      UI.currentScreen = screenId;
    }
  },
  
  // Update home screen streak display
  updateHomeScreen: () => {
    const user = Storage.getUser();
    
    // Update streak display (with null checks)
    const streakCountEl = document.getElementById('streak-count');
    const streakFlamesEl = document.getElementById('streak-flames');
    const tierEl = document.getElementById('streak-tier');
    
    if (streakCountEl) streakCountEl.textContent = user.streak;
    if (streakFlamesEl) streakFlamesEl.textContent = Streak.getFlames(user.streak);
    
    // Update tier badge
    if (tierEl) {
      const tier = Streak.getTier(user.streak);
      if (tier) {
        tierEl.textContent = tier.name;
        tierEl.className = `streak-tier ${tier.tier}`;
        tierEl.style.display = 'block';
      } else {
        tierEl.style.display = 'none';
      }
    }
  },
  
  // Update leaderboard
  updateLeaderboard: (tab = 'global') => {
    const leaderboard = Storage.getLeaderboard();
    const user = Storage.getUser();
    const listEl = document.getElementById('leaderboard-list');
    
    listEl.innerHTML = '';
    
    // Show top entries
    leaderboard.slice(0, 20).forEach((entry, index) => {
      const rank = index + 1;
      const isUser = entry.id === user.id;
      
      const item = document.createElement('div');
      item.className = `leaderboard-item ${rank <= 3 ? 'top-3 rank-' + rank : ''} ${isUser ? 'is-user' : ''}`;
      
      item.innerHTML = `
        <span class="rank-number">${rank}</span>
        <div class="player-avatar">${entry.avatar}</div>
        <div class="player-info">
          <div class="player-name">${entry.name}${isUser ? ' (You)' : ''}</div>
          <div class="player-streak">🔥 ${entry.streak} day streak</div>
        </div>
        <div class="player-score">${Utils.formatNumber(entry.score)}</div>
      `;
      
      listEl.appendChild(item);
    });
    
    // Update user rank bar
    const userRank = leaderboard.findIndex(e => e.id === user.id) + 1;
    const userEntry = leaderboard.find(e => e.id === user.id);
    const rankBar = document.getElementById('user-rank-bar');
    
    if (userEntry) {
      rankBar.querySelector('.user-rank').textContent = `#${userRank}`;
      rankBar.querySelector('.user-name').textContent = user.name;
      rankBar.querySelector('.user-score').textContent = Utils.formatNumber(userEntry.score);
    }
  },
  
  // Update shop
  updateShop: () => {
    const user = Storage.getUser();
    document.getElementById('shop-coins').textContent = Utils.formatNumber(user.coins);
  },
  
  // Update profile
  updateProfile: () => {
    const user = Storage.getUser();
    const stats = Storage.getStats();
    const bests = Storage.getBests();
    
    document.getElementById('user-avatar').textContent = user.avatar;
    document.getElementById('display-name').value = user.name;
    document.getElementById('profile-flames').textContent = Streak.getFlames(user.streak);
    document.getElementById('profile-streak').textContent = `${user.streak} day streak`;
    
    // Stats
    document.getElementById('total-games').textContent = stats.totalGames;
    document.getElementById('avg-score').textContent = 
      stats.totalGames > 0 ? Math.floor(stats.totalScore / stats.totalGames) : 0;
    document.getElementById('longest-streak').textContent = stats.longestStreak;
    document.getElementById('total-coins-earned').textContent = Utils.formatNumber(stats.totalCoinsEarned);
    
    // Personal bests - update for categories
    const categories = ['reflex', 'memory', 'math', 'reaction', 'words', 'visual'];
    const categoryBests = {};
    
    // Calculate best score per category from all games
    Object.keys(bests).forEach(key => {
      if (key.startsWith('game-')) {
        const gameId = parseInt(key.split('-')[1]);
        const game = getGameById ? getGameById(gameId) : null;
        if (game) {
          if (!categoryBests[game.category] || bests[key] > categoryBests[game.category]) {
            categoryBests[game.category] = bests[key];
          }
        }
      }
    });
  },
  
  // Show toast notification
  showToast: (message, type = 'default') => {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} active`;
    
    setTimeout(() => {
      toast.classList.remove('active');
    }, 3000);
  },
  
  // Show streak loss modal
  showStreakLossModal: (streakInfo) => {
    document.getElementById('old-streak').textContent = streakInfo.oldStreak;
    document.getElementById('new-streak').textContent = streakInfo.newStreak;
    
    const tier = Streak.getTier(streakInfo.newStreak);
    const protectionMsg = document.getElementById('protection-message');
    if (tier) {
      protectionMsg.textContent = `You're still ${tier.name.toUpperCase()}! ${Streak.getFlames(streakInfo.newStreak)}`;
    } else {
      protectionMsg.textContent = `Keep going! ${Streak.getFlames(streakInfo.newStreak)}`;
    }
    
    document.getElementById('streak-modal').classList.add('active');
  },
  
  // Hide streak loss modal
  hideStreakLossModal: () => {
    document.getElementById('streak-modal').classList.remove('active');
  },
  
  // Show spin wheel modal
  showWheelModal: () => {
    const modal = document.getElementById('wheel-modal');
    const spinBtn = document.getElementById('spin-button');
    const closeBtn = document.getElementById('close-wheel');
    const resultEl = document.getElementById('wheel-result');
    const wheel = document.getElementById('spin-wheel');
    
    // Reset wheel
    wheel.style.transform = '';
    wheel.classList.remove('spinning');
    spinBtn.style.display = 'block';
    spinBtn.disabled = false;
    closeBtn.style.display = 'none';
    resultEl.style.display = 'none';
    UI.wheelSpinning = false;
    
    modal.classList.add('active');
  },
  
  // Spin the wheel
  spinWheel: async () => {
    if (UI.wheelSpinning) return;
    UI.wheelSpinning = true;
    
    const wheel = document.getElementById('spin-wheel');
    const spinBtn = document.getElementById('spin-button');
    const closeBtn = document.getElementById('close-wheel');
    const resultEl = document.getElementById('wheel-result');
    
    spinBtn.disabled = true;
    
    // Determine prize (weighted random)
    const prizes = [
      { coins: 10, weight: 30 },
      { coins: 25, weight: 25 },
      { coins: 50, weight: 20 },
      { coins: 100, weight: 12 },
      { coins: 250, weight: 7 },
      { coins: 500, weight: 4 },
      { coins: 1000, weight: 1.5 },
      { coins: 5000, weight: 0.5 }
    ];
    
    const totalWeight = prizes.reduce((sum, p) => sum + p.weight, 0);
    let random = Math.random() * totalWeight;
    let prize = prizes[0];
    
    for (const p of prizes) {
      random -= p.weight;
      if (random <= 0) {
        prize = p;
        break;
      }
    }
    
    // Calculate spin rotation
    const prizeIndex = prizes.indexOf(prize);
    const segmentAngle = 360 / prizes.length;
    const targetAngle = 360 * 5 + (prizeIndex * segmentAngle) + (segmentAngle / 2);
    
    // Spin!
    wheel.style.transition = 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)';
    wheel.style.transform = `rotate(${targetAngle}deg)`;
    
    Utils.vibrate([30, 50, 30, 50, 30]);
    
    // Wait for spin to complete
    await Utils.delay(4500);
    
    // Show result
    resultEl.querySelector('.result-coins').textContent = `+${prize.coins}`;
    resultEl.style.display = 'block';
    
    // Add coins
    Storage.addCoins(prize.coins);
    
    Utils.vibrate([50, 30, 50, 30, 50]);
    
    // Show close button
    spinBtn.style.display = 'none';
    closeBtn.style.display = 'block';
    
    UI.wheelSpinning = false;
  },
  
  // Close wheel modal
  closeWheelModal: () => {
    document.getElementById('wheel-modal').classList.remove('active');
    UI.updateShop();
  },
  
  // Share score
  shareScore: async () => {
    const user = Storage.getUser();
    const game = App.selectedGame;
    const bests = Storage.getBests();
    const score = game ? (bests[`game-${game.id}`] || 0) : 0;
    
    const gameName = game ? game.name : 'StreakRush';
    
    const shareText = `🔥 I scored ${Utils.formatNumber(score)} on ${gameName}!\n` +
                      `🎮 StreakRush - 60 Mini-Games\n` +
                      `🏆 ${user.streak} day streak!\n\n` +
                      `Can you beat my score? Play now!`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'StreakRush Score',
          text: shareText
        });
      } catch (e) {
        // User cancelled or error
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(shareText);
        UI.showToast('Score copied to clipboard!', 'success');
      } catch (e) {
        UI.showToast('Could not share score', 'error');
      }
    }
  },
  
  // Buy item from shop
  buyItem: (item, cost) => {
    const user = Storage.getUser();
    
    if (user.coins >= cost) {
      if (Storage.spendCoins(cost)) {
        Storage.addItem(item, 1);
        UI.showToast(`Purchased ${item}!`, 'success');
        UI.updateShop();
      }
    } else {
      UI.showToast('Not enough coins!', 'error');
    }
  }
};
