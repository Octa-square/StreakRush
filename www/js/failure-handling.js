// ============================================
// FAILURE HANDLING SYSTEM
// Progressive support for struggling users
// ============================================

const FAILURE_CONFIG = {
  showEasyModeAt: 3,         // Offer easy mode after 3 attempts
  showSkipTokenAt: 5,        // Offer skip token after 5 attempts
  maxAttemptsBeforeForce: 10, // Force skip after 10 attempts
  skipTokensOnPremium: 10,   // Skip tokens given on premium unlock
  gamesPerSkipToken: 5       // Pass 5 games to earn 1 skip token
};

const EASY_MODE_CONFIG = {
  timeLimit: 90,
  passingScore: 60,
  showHints: true,
  masteryTier: 'bronze'      // Easy mode wins max at Bronze
};

const FailureHandling = {
  
  // ========================================
  // ATTEMPT TRACKING
  // ========================================
  
  incrementAttempts: (gameId) => {
    const attempts = JSON.parse(
      localStorage.getItem('streakrush_game_attempts') || '{}'
    );
    attempts[gameId] = (attempts[gameId] || 0) + 1;
    localStorage.setItem('streakrush_game_attempts', JSON.stringify(attempts));
    return attempts[gameId];
  },
  
  getAttempts: (gameId) => {
    const attempts = JSON.parse(
      localStorage.getItem('streakrush_game_attempts') || '{}'
    );
    return attempts[gameId] || 0;
  },
  
  resetAttempts: (gameId) => {
    const attempts = JSON.parse(
      localStorage.getItem('streakrush_game_attempts') || '{}'
    );
    delete attempts[gameId];
    localStorage.setItem('streakrush_game_attempts', JSON.stringify(attempts));
  },
  
  // ========================================
  // SKIP TOKENS
  // ========================================
  
  getSkipTokens: () => {
    return parseInt(localStorage.getItem('streakrush_skip_tokens') || '0');
  },
  
  addSkipTokens: (count) => {
    const current = FailureHandling.getSkipTokens();
    localStorage.setItem('streakrush_skip_tokens', (current + count).toString());
  },
  
  useSkipToken: (gameId) => {
    const tokens = FailureHandling.getSkipTokens();
    if (tokens <= 0) return false;
    
    localStorage.setItem('streakrush_skip_tokens', (tokens - 1).toString());
    FailureHandling.markAsSkipped(gameId);
    FailureHandling.resetAttempts(gameId);
    
    return true;
  },
  
  // Check and award skip tokens for consecutive wins
  checkSkipTokenReward: () => {
    const user = Storage.getUser();
    const consecutiveWins = user.consecutiveWins || 0;
    const tokensAwarded = parseInt(localStorage.getItem('streakrush_tokens_awarded') || '0');
    
    // Award 1 token per 5 consecutive wins
    const shouldHaveTokens = Math.floor(consecutiveWins / FAILURE_CONFIG.gamesPerSkipToken);
    
    if (shouldHaveTokens > tokensAwarded) {
      const newTokens = shouldHaveTokens - tokensAwarded;
      FailureHandling.addSkipTokens(newTokens);
      localStorage.setItem('streakrush_tokens_awarded', shouldHaveTokens.toString());
      return newTokens; // Return number of tokens just earned
    }
    
    return 0;
  },
  
  // ========================================
  // SKIPPED GAMES
  // ========================================
  
  markAsSkipped: (gameId) => {
    const skipped = JSON.parse(
      localStorage.getItem('streakrush_skipped_games') || '[]'
    );
    if (!skipped.includes(gameId)) {
      skipped.push(gameId);
      localStorage.setItem('streakrush_skipped_games', JSON.stringify(skipped));
    }
    
    // Also update the game scores to mark as skipped
    const scores = JSON.parse(localStorage.getItem('streakrush_game_scores') || '{}');
    scores[gameId] = scores[gameId] || {};
    scores[gameId].skipped = true;
    scores[gameId].skippedAt = new Date().toISOString();
    localStorage.setItem('streakrush_game_scores', JSON.stringify(scores));
  },
  
  unmarkAsSkipped: (gameId) => {
    const skipped = JSON.parse(
      localStorage.getItem('streakrush_skipped_games') || '[]'
    );
    const index = skipped.indexOf(gameId);
    if (index > -1) {
      skipped.splice(index, 1);
      localStorage.setItem('streakrush_skipped_games', JSON.stringify(skipped));
    }
    
    // Update game scores
    const scores = JSON.parse(localStorage.getItem('streakrush_game_scores') || '{}');
    if (scores[gameId]) {
      delete scores[gameId].skipped;
      delete scores[gameId].skippedAt;
      localStorage.setItem('streakrush_game_scores', JSON.stringify(scores));
    }
  },
  
  getSkippedGames: () => {
    return JSON.parse(
      localStorage.getItem('streakrush_skipped_games') || '[]'
    );
  },
  
  isSkipped: (gameId) => {
    const skipped = FailureHandling.getSkippedGames();
    return skipped.includes(gameId);
  },
  
  // ========================================
  // FAILURE RESPONSE LOGIC
  // ========================================
  
  getFailureResponse: (gameId, percentage) => {
    const attempts = FailureHandling.getAttempts(gameId);
    const skipTokens = FailureHandling.getSkipTokens();
    
    // User passed - no failure handling needed
    if (percentage >= 70) {
      FailureHandling.resetAttempts(gameId);
      return null;
    }
    
    // Attempt 1-2: Encouragement messages
    if (attempts <= 2) {
      return {
        type: 'encouragement',
        message: FailureHandling.getEncouragementMessage(attempts, percentage),
        subMessage: FailureHandling.getTipMessage(gameId, attempts),
        actions: ['tryAgain', 'goHome']
      };
    }
    
    // Attempt 3-4: Offer Easy Mode
    if (attempts <= 4) {
      return {
        type: 'easyMode',
        message: "This one's tricky! Try Easy Mode for a better chance.",
        subMessage: '🌱 More time • Lower pass score • Same learning',
        actions: ['tryEasyMode', 'tryAgainNormal', 'goHome'],
        easyModeConfig: EASY_MODE_CONFIG
      };
    }
    
    // Attempt 5+: Offer Skip Token (if available)
    if (attempts >= FAILURE_CONFIG.showSkipTokenAt && skipTokens > 0) {
      return {
        type: 'skipToken',
        message: "Use a Skip Token to move forward",
        subMessage: "You can come back and master this game anytime!",
        actions: ['useSkipToken', 'tryEasyMode', 'tryAgain', 'goHome'],
        tokensAvailable: skipTokens
      };
    }
    
    // No skip tokens available
    if (attempts >= FAILURE_CONFIG.showSkipTokenAt && skipTokens === 0) {
      const isPremium = Storage.getUser().premium;
      return {
        type: 'noTokens',
        message: "No Skip Tokens available",
        subMessage: isPremium 
          ? "Pass 5 games in a row to earn more tokens!"
          : "Earn tokens by passing games or unlock Premium",
        actions: ['tryEasyMode', 'tryAgain', isPremium ? null : 'viewPremium', 'goHome'].filter(Boolean),
        showEarnInfo: true
      };
    }
    
    // Force skip after max attempts (prevent infinite frustration)
    if (attempts >= FAILURE_CONFIG.maxAttemptsBeforeForce) {
      return {
        type: 'forceSkip',
        message: "You've given this your best shot!",
        subMessage: "Moving you forward - you can return and master this later.",
        actions: ['autoSkip'],
        autoExecute: true
      };
    }
    
    return {
      type: 'default',
      message: "Keep practicing!",
      actions: ['tryAgain', 'goHome']
    };
  },
  
  getEncouragementMessage: (attempts, percentage) => {
    if (percentage >= 60) {
      return "So close! You almost had it! 💪";
    } else if (percentage >= 50) {
      return "You're getting there! One more push!";
    } else if (attempts === 1) {
      return "Don't give up! Try again! 🎯";
    } else {
      return "You're improving! Keep going! 🚀";
    }
  },
  
  getTipMessage: (gameId, attempts) => {
    const game = typeof GAMES !== 'undefined' ? GAMES.find(g => g.id === gameId) : null;
    if (!game) return '';
    
    const tips = {
      'Spatial': [
        "💡 Try visualizing a mental map",
        "💡 Group locations by region",
        "💡 Focus on the most distinctive features"
      ],
      'Speed': [
        "💡 Stay relaxed - tension slows you down",
        "💡 Focus on the center of the screen",
        "💡 Breathe steadily to maintain focus"
      ],
      'Visual': [
        "💡 Look for patterns, not individual items",
        "💡 Create a mental story to remember",
        "💡 Use the memory palace technique"
      ],
      'Numeric': [
        "💡 Break numbers into smaller chunks",
        "💡 Find patterns in the sequence",
        "💡 Associate numbers with familiar things"
      ],
      'Verbal': [
        "💡 Say the words in your head",
        "💡 Look for familiar letter patterns",
        "💡 Sound it out syllable by syllable"
      ],
      'Pattern': [
        "💡 Look for the rule, not individual items",
        "💡 What changes between each step?",
        "💡 Focus on one element at a time"
      ]
    };
    
    const categoryTips = tips[game.category] || [];
    const tipIndex = (attempts - 1) % categoryTips.length;
    return categoryTips[tipIndex] || "💡 Take your time and focus!";
  },
  
  // ========================================
  // UI RENDERING
  // ========================================
  
  renderFailureUI: (response, gameId) => {
    if (!response) return '';
    
    let html = `
      <div class="failure-handling-container ${response.type}">
        <div class="failure-message-box">
          <p class="failure-main-message">${response.message}</p>
          ${response.subMessage ? `<p class="failure-sub-message">${response.subMessage}</p>` : ''}
        </div>
    `;
    
    // Easy Mode option
    if (response.type === 'easyMode' || response.actions.includes('tryEasyMode')) {
      html += `
        <div class="difficulty-options">
          <button class="difficulty-btn easy-mode-btn" onclick="FailureHandling.startEasyMode(${gameId})">
            <span class="diff-icon">🌱</span>
            <span class="diff-label">Easy Mode</span>
            <span class="diff-details">90 sec • 60% to pass</span>
          </button>
          ${response.type === 'easyMode' ? `
            <button class="difficulty-btn normal-mode-btn" onclick="Game.replay()">
              <span class="diff-icon">⚡</span>
              <span class="diff-label">Normal Mode</span>
              <span class="diff-details">Try again at full difficulty</span>
            </button>
          ` : ''}
        </div>
      `;
    }
    
    // Skip Token option
    if (response.type === 'skipToken') {
      html += `
        <div class="skip-token-section">
          <button class="skip-token-btn" onclick="FailureHandling.confirmSkip(${gameId})">
            <span class="skip-icon">⏭️</span>
            <span class="skip-label">Use Skip Token</span>
            <span class="skip-count">${response.tokensAvailable} token${response.tokensAvailable > 1 ? 's' : ''} left</span>
          </button>
        </div>
      `;
    }
    
    // No tokens - show how to earn
    if (response.showEarnInfo) {
      html += `
        <div class="earn-tokens-box">
          <p class="earn-title">💡 How to earn Skip Tokens:</p>
          <ul class="earn-list">
            <li>✅ Pass 5 games in a row = 1 token</li>
            <li>💎 Unlock Premium = 10 tokens</li>
          </ul>
        </div>
      `;
    }
    
    // Force skip countdown
    if (response.autoExecute) {
      html += `
        <div class="force-skip-notice">
          <p>Automatically moving to next game in <span id="force-skip-countdown">3</span>...</p>
        </div>
      `;
    }
    
    html += `</div>`;
    
    return html;
  },
  
  // ========================================
  // ACTIONS
  // ========================================
  
  startEasyMode: (gameId) => {
    if (typeof Sounds !== 'undefined' && Sounds.click) Sounds.click();
    
    // Store easy mode flag
    sessionStorage.setItem('streakrush_easy_mode', 'true');
    sessionStorage.setItem('streakrush_easy_mode_game', gameId.toString());
    
    // Start game with easy mode config
    if (typeof Game !== 'undefined' && Game.startSimpleGame) {
      Game.easyMode = true;
      Game.modeConfig = {
        ...EASY_MODE_CONFIG,
        name: 'Easy Mode',
        icon: '🌱'
      };
      
      const game = GAMES.find(g => g.id === gameId);
      if (game) {
        Game.startSimpleGame(game, 'EASY', Game.modeConfig);
      }
    }
  },
  
  isEasyMode: () => {
    return sessionStorage.getItem('streakrush_easy_mode') === 'true';
  },
  
  clearEasyMode: () => {
    sessionStorage.removeItem('streakrush_easy_mode');
    sessionStorage.removeItem('streakrush_easy_mode_game');
    if (typeof Game !== 'undefined') {
      Game.easyMode = false;
    }
  },
  
  confirmSkip: (gameId) => {
    if (typeof Sounds !== 'undefined' && Sounds.click) Sounds.click();
    
    const tokens = FailureHandling.getSkipTokens();
    const game = GAMES.find(g => g.id === gameId);
    
    const modal = document.createElement('div');
    modal.className = 'skip-confirm-modal';
    modal.innerHTML = `
      <div class="skip-modal-content">
        <div class="skip-modal-icon">⏭️</div>
        <h3>Skip "${game ? game.name : 'this game'}"?</h3>
        <p>You'll use 1 Skip Token (${tokens} remaining)</p>
        <p class="skip-comeback-note">You can return and master this game anytime!</p>
        <div class="skip-modal-actions">
          <button class="skip-confirm-btn" onclick="FailureHandling.executeSkip(${gameId})">
            Yes, Skip Game
          </button>
          <button class="skip-cancel-btn" onclick="FailureHandling.closeSkipModal()">
            Keep Trying
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Animate in
    requestAnimationFrame(() => {
      modal.classList.add('visible');
    });
  },
  
  closeSkipModal: () => {
    const modal = document.querySelector('.skip-confirm-modal');
    if (modal) {
      modal.classList.remove('visible');
      setTimeout(() => modal.remove(), 300);
    }
  },
  
  executeSkip: (gameId) => {
    FailureHandling.closeSkipModal();
    
    const success = FailureHandling.useSkipToken(gameId);
    
    if (success) {
      if (typeof Sounds !== 'undefined' && Sounds.tap) Sounds.tap();
      
      // Show brief skip confirmation
      const toast = document.createElement('div');
      toast.className = 'skip-toast';
      toast.innerHTML = `
        <span class="toast-icon">⏭️</span>
        <span class="toast-message">Game skipped! Moving forward...</span>
      `;
      document.body.appendChild(toast);
      
      setTimeout(() => {
        toast.classList.add('visible');
      }, 10);
      
      setTimeout(() => {
        toast.classList.remove('visible');
        setTimeout(() => toast.remove(), 300);
        
        // Navigate to next game or home
        if (typeof UI !== 'undefined' && UI.showScreen) {
          UI.showScreen('home');
        }
      }, 1500);
    }
  },
  
  executeForceSkip: (gameId) => {
    FailureHandling.markAsSkipped(gameId);
    FailureHandling.resetAttempts(gameId);
    
    // Navigate forward
    setTimeout(() => {
      if (typeof UI !== 'undefined' && UI.showScreen) {
        UI.showScreen('home');
      }
    }, 500);
  },
  
  // Start force skip countdown
  startForceSkipCountdown: (gameId) => {
    let countdown = 3;
    const countdownEl = document.getElementById('force-skip-countdown');
    
    const interval = setInterval(() => {
      countdown--;
      if (countdownEl) countdownEl.textContent = countdown;
      
      if (countdown <= 0) {
        clearInterval(interval);
        FailureHandling.executeForceSkip(gameId);
      }
    }, 1000);
  },
  
  // ========================================
  // SKIPPED GAMES UI
  // ========================================
  
  renderSkippedGamesSection: () => {
    const skippedIds = FailureHandling.getSkippedGames();
    
    if (skippedIds.length === 0) return '';
    
    const skippedGames = skippedIds
      .map(id => GAMES.find(g => g.id === id))
      .filter(Boolean);
    
    return `
      <div class="skipped-games-section">
        <div class="section-header">
          <h3>⏭️ Skipped Games</h3>
          <span class="skip-count-badge">${skippedGames.length}</span>
        </div>
        <p class="section-description">Come back and master these challenges!</p>
        
        <div class="skipped-games-list">
          ${skippedGames.map(game => `
            <div class="skipped-game-card">
              <div class="skipped-game-icon">${game.icon}</div>
              <div class="skipped-game-info">
                <div class="skipped-game-name">${game.name}</div>
                <div class="skipped-game-category">${game.category}</div>
              </div>
              <button class="retry-skipped-btn" onclick="FailureHandling.retrySkipped(${game.id})">
                🔄 Retry
              </button>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },
  
  retrySkipped: (gameId) => {
    if (typeof Sounds !== 'undefined' && Sounds.click) Sounds.click();
    
    const game = GAMES.find(g => g.id === gameId);
    if (game && typeof Game !== 'undefined') {
      // Don't unmark as skipped yet - only do so if they pass
      Game.startSimpleGame(game);
    }
  }
};

// Make globally accessible
window.FailureHandling = FailureHandling;

