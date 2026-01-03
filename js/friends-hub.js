// ========================================
// STREAKRUSH - FRIENDS HUB
// Multiplayer party mode with room codes
// Admin: $30, Joiners: FREE
// ========================================

const FriendsHub = {
  isAdmin: false,
  roomCode: null,
  players: [],
  gameState: 'lobby', // lobby, playing, results
  currentRound: 0,
  minGames: 5,
  maxPlayers: 8,
  
  // Check if user has admin access
  hasAdminAccess: () => {
    return localStorage.getItem('cognixis_friends_admin') === 'true';
  },
  
  // Unlock admin access
  unlockAdmin: () => {
    localStorage.setItem('cognixis_friends_admin', 'true');
    return true;
  },
  
  // Generate room code
  generateRoomCode: () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  },
  
  // Create a new room (admin only)
  createRoom: (username) => {
    if (!FriendsHub.hasAdminAccess()) {
      return { success: false, error: 'Admin access required ($30)' };
    }
    
    FriendsHub.isAdmin = true;
    FriendsHub.roomCode = FriendsHub.generateRoomCode();
    FriendsHub.players = [{
      id: 'admin',
      name: username,
      isAdmin: true,
      ready: true,
      scores: [],
      totalScore: 0
    }];
    FriendsHub.gameState = 'lobby';
    FriendsHub.currentRound = 0;
    
    // Store room data
    FriendsHub.saveRoom();
    
    return {
      success: true,
      roomCode: FriendsHub.roomCode
    };
  },
  
  // Join a room
  joinRoom: (roomCode, username) => {
    // In a real app, this would connect to a server
    // For demo, we use localStorage to simulate
    
    const room = FriendsHub.loadRoom(roomCode);
    if (!room) {
      return { success: false, error: 'Room not found' };
    }
    
    if (room.players.length >= FriendsHub.maxPlayers) {
      return { success: false, error: 'Room is full' };
    }
    
    if (room.gameState !== 'lobby') {
      return { success: false, error: 'Game already started' };
    }
    
    FriendsHub.isAdmin = false;
    FriendsHub.roomCode = roomCode;
    FriendsHub.players = room.players;
    FriendsHub.gameState = room.gameState;
    
    // Add player
    const playerId = 'player_' + Date.now();
    FriendsHub.players.push({
      id: playerId,
      name: username,
      isAdmin: false,
      ready: false,
      scores: [],
      totalScore: 0
    });
    
    FriendsHub.saveRoom();
    
    return {
      success: true,
      playerId: playerId
    };
  },
  
  // Set player ready
  setReady: (playerId, ready = true) => {
    const player = FriendsHub.players.find(p => p.id === playerId);
    if (player) {
      player.ready = ready;
      FriendsHub.saveRoom();
    }
  },
  
  // Check if all players are ready
  allReady: () => {
    return FriendsHub.players.every(p => p.ready);
  },
  
  // Start the game (admin only)
  startGame: () => {
    if (!FriendsHub.isAdmin) return false;
    if (FriendsHub.players.length < 2) return false;
    
    FriendsHub.gameState = 'playing';
    FriendsHub.currentRound = 1;
    
    // Reset scores
    FriendsHub.players.forEach(p => {
      p.scores = [];
      p.totalScore = 0;
    });
    
    FriendsHub.saveRoom();
    return true;
  },
  
  // Submit score for a round
  submitScore: (playerId, score) => {
    const player = FriendsHub.players.find(p => p.id === playerId);
    if (player) {
      player.scores.push(score);
      player.totalScore = player.scores.reduce((a, b) => a + b, 0);
      FriendsHub.saveRoom();
    }
  },
  
  // Check if round is complete
  isRoundComplete: () => {
    return FriendsHub.players.every(p => p.scores.length >= FriendsHub.currentRound);
  },
  
  // Move to next round
  nextRound: () => {
    FriendsHub.currentRound++;
    FriendsHub.saveRoom();
  },
  
  // Check if game is complete (min 5 games)
  isGameComplete: () => {
    return FriendsHub.currentRound > FriendsHub.minGames;
  },
  
  // End the game
  endGame: () => {
    FriendsHub.gameState = 'results';
    FriendsHub.saveRoom();
  },
  
  // Get leaderboard
  getLeaderboard: () => {
    return [...FriendsHub.players]
      .sort((a, b) => b.totalScore - a.totalScore)
      .map((p, i) => ({
        ...p,
        rank: i + 1,
        isWinner: i === 0
      }));
  },
  
  // Get winner
  getWinner: () => {
    const sorted = FriendsHub.getLeaderboard();
    return sorted[0];
  },
  
  // Leave room
  leaveRoom: () => {
    FriendsHub.isAdmin = false;
    FriendsHub.roomCode = null;
    FriendsHub.players = [];
    FriendsHub.gameState = 'lobby';
  },
  
  // Save room to localStorage (simulating server)
  saveRoom: () => {
    if (!FriendsHub.roomCode) return;
    
    const roomData = {
      code: FriendsHub.roomCode,
      players: FriendsHub.players,
      gameState: FriendsHub.gameState,
      currentRound: FriendsHub.currentRound,
      updatedAt: Date.now()
    };
    
    localStorage.setItem(`cognixis_room_${FriendsHub.roomCode}`, JSON.stringify(roomData));
  },
  
  // Load room from localStorage
  loadRoom: (roomCode) => {
    const data = localStorage.getItem(`cognixis_room_${roomCode}`);
    if (!data) return null;
    
    const room = JSON.parse(data);
    
    // Check if room is stale (older than 1 hour)
    if (Date.now() - room.updatedAt > 3600000) {
      localStorage.removeItem(`cognixis_room_${roomCode}`);
      return null;
    }
    
    return room;
  }
};

// ========================================
// SOCIAL FEATURES (Free for all users)
// ========================================

const SocialFeatures = {
  // Feature access levels
  FEATURES: {
    FREE: [
      'viewFriendsScores',
      'compareProgress',
      'sendAsyncChallenge',
      'viewGlobalLeaderboards',
      'ghostReplays',
      'dailyChallenge'
    ],
    PREMIUM: [
      'hostTournaments',
      'createCustomGames',
      'privateLeaderboards',
      'unlimitedChallenges'
    ]
  },

  // ========================================
  // GHOST REPLAY SYSTEM
  // Race against friends' previous attempts
  // ========================================
  
  Ghost: {
    currentGhost: null,
    ghostProgress: [],
    
    // Enable ghost for a game
    enable: (gameId, friendData = null) => {
      // Get best friend score or global best
      const ghost = friendData || SocialFeatures.Ghost.getGlobalBest(gameId);
      
      if (!ghost) {
        SocialFeatures.Ghost.currentGhost = null;
        return null;
      }
      
      SocialFeatures.Ghost.currentGhost = {
        name: ghost.playerName,
        score: ghost.score,
        percentage: ghost.percentage,
        questionProgress: ghost.questionProgress || [],
        avatar: ghost.avatar || '👻'
      };
      
      return SocialFeatures.Ghost.currentGhost;
    },
    
    // Get global best for a game (simulated)
    getGlobalBest: (gameId) => {
      // Simulate a ghost player
      const ghostNames = ['SpeedyBrain', 'MemoryMaster', 'QuizWiz', 'MindChamp'];
      const name = ghostNames[gameId % ghostNames.length];
      
      return {
        playerName: name,
        score: 800 + (gameId * 50),
        percentage: 85 + Math.floor(Math.random() * 10),
        questionProgress: SocialFeatures.Ghost.generateProgress(),
        avatar: '👻'
      };
    },
    
    // Generate simulated progress timestamps
    generateProgress: () => {
      const progress = [];
      let time = 0;
      for (let i = 0; i < 20; i++) {
        time += 2000 + Math.random() * 3000; // 2-5 seconds per question
        progress.push(Math.floor(time));
      }
      return progress;
    },
    
    // Check ghost progress during game
    checkProgress: (elapsedMs, questionsAnswered) => {
      const ghost = SocialFeatures.Ghost.currentGhost;
      if (!ghost || !ghost.questionProgress.length) return null;
      
      // Find how many questions ghost had answered by this time
      const ghostQuestions = ghost.questionProgress.filter(t => t <= elapsedMs).length;
      
      const diff = questionsAnswered - ghostQuestions;
      
      return {
        ghostQuestions,
        playerQuestions: questionsAnswered,
        difference: diff,
        message: diff > 0 
          ? `🔥 You're ${diff} ahead of ${ghost.name}!`
          : diff < 0 
            ? `👻 ${ghost.name} was ${-diff} ahead at this point`
            : `⚔️ Neck and neck with ${ghost.name}!`,
        isAhead: diff > 0
      };
    },
    
    // Show ghost indicator UI
    showIndicator: () => {
      const ghost = SocialFeatures.Ghost.currentGhost;
      if (!ghost) return;
      
      let indicator = document.getElementById('ghost-indicator');
      if (!indicator) {
        indicator = document.createElement('div');
        indicator.id = 'ghost-indicator';
        indicator.style.cssText = `
          position: fixed;
          top: 130px;
          left: 15px;
          background: rgba(0, 0, 0, 0.7);
          padding: 8px 14px;
          border-radius: 20px;
          font-size: 0.8rem;
          color: white;
          z-index: 100;
          display: flex;
          align-items: center;
          gap: 8px;
          border: 1px solid rgba(255, 255, 255, 0.2);
        `;
        document.body.appendChild(indicator);
      }
      
      indicator.innerHTML = `
        <span>${ghost.avatar}</span>
        <span>${ghost.name}: ${ghost.percentage}%</span>
      `;
      indicator.style.display = 'flex';
    },
    
    // Hide ghost indicator
    hideIndicator: () => {
      const indicator = document.getElementById('ghost-indicator');
      if (indicator) indicator.style.display = 'none';
    },
    
    // Update ghost comparison during game
    updateComparison: (elapsedMs, questionsAnswered) => {
      const comparison = SocialFeatures.Ghost.checkProgress(elapsedMs, questionsAnswered);
      if (!comparison) return;
      
      let compEl = document.getElementById('ghost-comparison');
      if (!compEl) {
        compEl = document.createElement('div');
        compEl.id = 'ghost-comparison';
        compEl.style.cssText = `
          position: fixed;
          top: 170px;
          left: 15px;
          background: ${comparison.isAhead ? 'rgba(34, 197, 94, 0.8)' : 'rgba(239, 68, 68, 0.8)'};
          padding: 6px 12px;
          border-radius: 15px;
          font-size: 0.75rem;
          color: white;
          z-index: 100;
          transition: all 0.3s ease;
        `;
        document.body.appendChild(compEl);
      }
      
      compEl.textContent = comparison.message;
      compEl.style.background = comparison.isAhead 
        ? 'rgba(34, 197, 94, 0.8)' 
        : 'rgba(239, 68, 68, 0.8)';
    }
  },

  // ========================================
  // ASYNC CHALLENGE SYSTEM
  // Challenge friends to beat your score
  // ========================================
  
  Challenges: {
    STORAGE_KEY: 'cognixis_challenges',
    
    // Get all challenges
    getAll: () => {
      return JSON.parse(localStorage.getItem(SocialFeatures.Challenges.STORAGE_KEY) || '[]');
    },
    
    // Save challenges
    save: (challenges) => {
      localStorage.setItem(SocialFeatures.Challenges.STORAGE_KEY, JSON.stringify(challenges));
    },
    
    // Send a challenge
    send: (gameId, friendName = 'Friend') => {
      const user = Storage.getUser();
      const scores = Storage.getGameScores();
      const gameScore = scores[gameId];
      const game = typeof getGameById !== 'undefined' ? getGameById(gameId) : { name: `Game ${gameId}` };
      
      if (!gameScore) {
        UI.showToast('Play this game first to challenge friends!', 'warning');
        return null;
      }
      
      const challenge = {
        id: 'challenge_' + Date.now(),
        from: user.displayName || 'You',
        fromAvatar: user.avatar || '👤',
        to: friendName,
        gameId: gameId,
        gameName: game.name,
        gameIcon: game.icon,
        scoreToBeat: gameScore.score,
        percentage: gameScore.percentage,
        message: `I scored ${gameScore.percentage}% on ${game.name}. Can you beat me?`,
        createdAt: Date.now(),
        expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000), // 7 days
        attemptsAllowed: 3,
        attemptsUsed: 0,
        status: 'pending', // pending, accepted, beaten, failed, expired
        result: null
      };
      
      const challenges = SocialFeatures.Challenges.getAll();
      challenges.push(challenge);
      SocialFeatures.Challenges.save(challenges);
      
      UI.showToast(`Challenge sent! 🎯`, 'success');
      return challenge;
    },
    
    // Accept a challenge
    accept: (challengeId) => {
      const challenges = SocialFeatures.Challenges.getAll();
      const challenge = challenges.find(c => c.id === challengeId);
      
      if (challenge) {
        challenge.status = 'accepted';
        SocialFeatures.Challenges.save(challenges);
        return challenge;
      }
      return null;
    },
    
    // Record challenge attempt
    recordAttempt: (challengeId, score, percentage) => {
      const challenges = SocialFeatures.Challenges.getAll();
      const challenge = challenges.find(c => c.id === challengeId);
      
      if (!challenge) return null;
      
      challenge.attemptsUsed++;
      
      if (percentage > challenge.percentage) {
        challenge.status = 'beaten';
        challenge.result = { score, percentage, beatenBy: percentage - challenge.percentage };
        UI.showToast(`🎉 You beat the challenge! ${percentage}% vs ${challenge.percentage}%`, 'success');
      } else if (challenge.attemptsUsed >= challenge.attemptsAllowed) {
        challenge.status = 'failed';
        challenge.result = { score, percentage };
        UI.showToast(`Challenge failed. They scored ${challenge.percentage}%, you got ${percentage}%`, 'warning');
      } else {
        const remaining = challenge.attemptsAllowed - challenge.attemptsUsed;
        UI.showToast(`Not quite! ${remaining} attempts left. You need ${challenge.percentage}%+`, 'info');
      }
      
      SocialFeatures.Challenges.save(challenges);
      return challenge;
    },
    
    // Get pending challenges
    getPending: () => {
      const challenges = SocialFeatures.Challenges.getAll();
      const now = Date.now();
      
      return challenges.filter(c => 
        c.status === 'pending' && c.expiresAt > now
      );
    },
    
    // Get challenge count (for badge)
    getCount: () => {
      return SocialFeatures.Challenges.getPending().length;
    },
    
    // Show challenge modal
    showSendModal: (gameId) => {
      const game = typeof getGameById !== 'undefined' ? getGameById(gameId) : { name: `Game ${gameId}`, icon: '🎮' };
      const scores = Storage.getGameScores();
      const gameScore = scores[gameId];
      
      if (!gameScore) {
        UI.showToast('Complete this game first!', 'warning');
        return;
      }
      
      let modal = document.getElementById('challenge-modal');
      if (!modal) {
        modal = document.createElement('div');
        modal.id = 'challenge-modal';
        modal.className = 'challenge-modal';
        document.body.appendChild(modal);
      }
      
      modal.innerHTML = `
        <div class="challenge-modal-content">
          <h3>⚔️ Send Challenge</h3>
          <div class="challenge-game">
            <span class="challenge-icon">${game.icon}</span>
            <span class="challenge-name">${game.name}</span>
          </div>
          <div class="challenge-score">
            <div class="your-score">${gameScore.percentage}%</div>
            <div class="score-label">Your score to beat</div>
          </div>
          <div class="challenge-message">
            Challenge a friend to beat your score!
          </div>
          <div class="challenge-actions">
            <button class="challenge-btn share" onclick="SocialFeatures.Challenges.shareChallenge(${gameId})">
              📤 Share Challenge Link
            </button>
            <button class="challenge-btn cancel" onclick="SocialFeatures.Challenges.hideModal()">
              Cancel
            </button>
          </div>
        </div>
      `;
      
      modal.classList.add('active');
    },
    
    // Hide challenge modal
    hideModal: () => {
      const modal = document.getElementById('challenge-modal');
      if (modal) modal.classList.remove('active');
    },
    
    // Share challenge (copy link or share)
    shareChallenge: async (gameId) => {
      const challenge = SocialFeatures.Challenges.send(gameId);
      if (!challenge) return;
      
      const shareText = challenge.message + '\n\nPlay CogniXis to accept!';
      
      if (navigator.share) {
        try {
          await navigator.share({ title: 'CogniXis Challenge', text: shareText });
        } catch (e) {
          // User cancelled
        }
      } else {
        await navigator.clipboard.writeText(shareText);
        UI.showToast('Challenge copied to clipboard!', 'success');
      }
      
      SocialFeatures.Challenges.hideModal();
    }
  },

  // ========================================
  // DAILY GLOBAL CHALLENGE
  // Everyone plays the same game each day
  // ========================================
  
  DailyChallenge: {
    STORAGE_KEY: 'cognixis_daily_challenge',
    
    // Get today's challenge
    get: () => {
      // Calculate day of year
      const now = new Date();
      const start = new Date(now.getFullYear(), 0, 0);
      const diff = now - start;
      const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
      
      // Pick game based on day (cycles through all 60)
      const gameId = (dayOfYear % 60) + 1;
      const game = typeof getGameById !== 'undefined' ? getGameById(gameId) : null;
      
      // Calculate time until midnight
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      const msUntilMidnight = midnight - now;
      const hoursLeft = Math.floor(msUntilMidnight / (1000 * 60 * 60));
      const minutesLeft = Math.floor((msUntilMidnight % (1000 * 60 * 60)) / (1000 * 60));
      
      return {
        gameId: gameId,
        game: game,
        date: now.toDateString(),
        dayOfYear: dayOfYear,
        endsIn: `${hoursLeft}h ${minutesLeft}m`,
        msUntilEnd: msUntilMidnight,
        leaderboard: SocialFeatures.DailyChallenge.getLeaderboard(dayOfYear)
      };
    },
    
    // Check if user has played today's challenge
    hasPlayed: () => {
      const today = new Date().toDateString();
      const played = localStorage.getItem(SocialFeatures.DailyChallenge.STORAGE_KEY);
      return played === today;
    },
    
    // Mark as played
    markPlayed: () => {
      const today = new Date().toDateString();
      localStorage.setItem(SocialFeatures.DailyChallenge.STORAGE_KEY, today);
    },
    
    // Submit score to daily leaderboard
    submitScore: (score, percentage) => {
      const daily = SocialFeatures.DailyChallenge.get();
      const user = Storage.getUser();
      
      // Get or create daily scores
      const key = `cognixis_daily_scores_${daily.dayOfYear}`;
      const scores = JSON.parse(localStorage.getItem(key) || '[]');
      
      // Add user score
      scores.push({
        name: user.displayName || 'Player',
        avatar: user.avatar || '👤',
        score: score,
        percentage: percentage,
        time: Date.now()
      });
      
      // Sort by score
      scores.sort((a, b) => b.score - a.score);
      
      // Keep top 100
      const trimmed = scores.slice(0, 100);
      localStorage.setItem(key, JSON.stringify(trimmed));
      
      SocialFeatures.DailyChallenge.markPlayed();
      
      // Return user's rank
      return trimmed.findIndex(s => s.time === scores[scores.length - 1]?.time) + 1;
    },
    
    // Get daily leaderboard (simulated with some fake players)
    getLeaderboard: (dayOfYear) => {
      const key = `cognixis_daily_scores_${dayOfYear}`;
      let scores = JSON.parse(localStorage.getItem(key) || '[]');
      
      // Add simulated players if empty
      if (scores.length < 5) {
        const names = ['BrainStorm', 'QuickThinker', 'MemoryPro', 'SpeedDemon', 'MindMaster'];
        const avatars = ['🧠', '⚡', '🎯', '🔥', '💎'];
        
        for (let i = 0; i < 5; i++) {
          scores.push({
            name: names[i],
            avatar: avatars[i],
            score: 700 + Math.floor(Math.random() * 400),
            percentage: 75 + Math.floor(Math.random() * 20),
            time: Date.now() - Math.random() * 86400000,
            isSimulated: true
          });
        }
        
        scores.sort((a, b) => b.score - a.score);
      }
      
      return scores.slice(0, 10);
    },
    
    // Show daily challenge card
    showCard: () => {
      const daily = SocialFeatures.DailyChallenge.get();
      const hasPlayed = SocialFeatures.DailyChallenge.hasPlayed();
      
      return `
        <div class="daily-challenge-card ${hasPlayed ? 'completed' : ''}">
          <div class="daily-header">
            <span class="daily-icon">📅</span>
            <span class="daily-title">Daily Challenge</span>
            <span class="daily-timer">⏰ ${daily.endsIn}</span>
          </div>
          <div class="daily-game">
            <span class="game-icon">${daily.game?.icon || '🎮'}</span>
            <span class="game-name">${daily.game?.name || 'Today\'s Game'}</span>
          </div>
          ${hasPlayed ? 
            '<div class="daily-status">✅ Completed Today!</div>' :
            '<button class="daily-play-btn" onclick="SocialFeatures.DailyChallenge.play()">Play Now 🎯</button>'
          }
          <div class="daily-leaderboard-preview">
            ${daily.leaderboard.slice(0, 3).map((s, i) => `
              <div class="leader-row">
                <span class="rank">${['🥇', '🥈', '🥉'][i]}</span>
                <span class="name">${s.avatar} ${s.name}</span>
                <span class="score">${s.percentage}%</span>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    },
    
    // Play daily challenge
    play: () => {
      const daily = SocialFeatures.DailyChallenge.get();
      
      if (daily.game && typeof App !== 'undefined') {
        App.currentGame = daily.game;
        App.playGame(daily.game, false, true); // Skip mode select for daily
      }
    }
  }
};

// Add CSS for social features
const socialStyles = document.createElement('style');
socialStyles.textContent = `
  .challenge-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
  }
  
  .challenge-modal.active {
    opacity: 1;
    visibility: visible;
  }
  
  .challenge-modal-content {
    background: var(--bg-card, #1a1a2e);
    border-radius: 20px;
    padding: 25px;
    max-width: 350px;
    width: 90%;
    text-align: center;
  }
  
  .challenge-modal-content h3 {
    font-size: 1.3rem;
    margin-bottom: 20px;
  }
  
  .challenge-game {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin-bottom: 15px;
  }
  
  .challenge-icon { font-size: 2rem; }
  .challenge-name { font-size: 1.1rem; font-weight: 600; }
  
  .challenge-score {
    background: rgba(34, 197, 94, 0.2);
    border-radius: 15px;
    padding: 15px;
    margin-bottom: 15px;
  }
  
  .your-score {
    font-size: 2.5rem;
    font-weight: 800;
    color: #22c55e;
  }
  
  .score-label {
    font-size: 0.85rem;
    color: #888;
  }
  
  .challenge-message {
    color: #aaa;
    font-size: 0.95rem;
    margin-bottom: 20px;
  }
  
  .challenge-actions {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  
  .challenge-btn {
    padding: 14px 20px;
    border: none;
    border-radius: 25px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
  }
  
  .challenge-btn.share {
    background: linear-gradient(135deg, #7209b7 0%, #f72585 100%);
    color: white;
  }
  
  .challenge-btn.cancel {
    background: rgba(255, 255, 255, 0.1);
    color: #888;
  }
  
  /* Daily Challenge Card */
  .daily-challenge-card {
    background: linear-gradient(135deg, rgba(114, 9, 183, 0.2) 0%, rgba(247, 37, 133, 0.1) 100%);
    border: 1px solid rgba(114, 9, 183, 0.3);
    border-radius: 20px;
    padding: 20px;
    margin: 15px 0;
  }
  
  .daily-challenge-card.completed {
    border-color: rgba(34, 197, 94, 0.3);
  }
  
  .daily-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 15px;
  }
  
  .daily-icon { font-size: 1.3rem; }
  .daily-title { font-weight: 600; flex: 1; }
  .daily-timer { font-size: 0.85rem; color: #888; }
  
  .daily-game {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 15px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    margin-bottom: 15px;
  }
  
  .daily-game .game-icon { font-size: 2rem; }
  .daily-game .game-name { font-size: 1.1rem; font-weight: 600; }
  
  .daily-status {
    text-align: center;
    color: #22c55e;
    font-weight: 600;
    padding: 10px;
  }
  
  .daily-play-btn {
    width: 100%;
    padding: 14px;
    background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
    border: none;
    border-radius: 25px;
    color: white;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
  }
  
  .daily-leaderboard-preview {
    margin-top: 15px;
    padding-top: 15px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .leader-row {
    display: flex;
    align-items: center;
    padding: 6px 0;
    font-size: 0.9rem;
  }
  
  .leader-row .rank { width: 30px; }
  .leader-row .name { flex: 1; color: #aaa; }
  .leader-row .score { color: #22c55e; font-weight: 600; }
`;
document.head.appendChild(socialStyles);

