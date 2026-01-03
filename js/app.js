// ========================================
// STREAKRUSH - MAIN APPLICATION
// Self-improvement through structure
// No ads. No discounts. No manipulation.
// ========================================

const App = {
  currentGame: null,
  quoteRotationInterval: null,
  
  // Get a random motivational quote
  getRandomQuote: () => {
    const quotes = [
      { text: "Discipline is the bridge between goals and accomplishment.", author: "Jim Rohn" },
      { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
      { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
      { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
      { text: "What you get by achieving your goals is not as important as what you become.", author: "Zig Ziglar" },
      { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
      { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
      { text: "Quality is not an act, it is a habit.", author: "Aristotle" },
      { text: "Champions keep playing until they get it right.", author: "Billie Jean King" },
      { text: "Hard work beats talent when talent doesn't work hard.", author: "Tim Notke" },
      { text: "The harder you work, the luckier you get.", author: "Gary Player" },
      { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
      { text: "Progress, not perfection.", author: "Unknown" },
      { text: "Every expert was once a beginner.", author: "Helen Hayes" },
      { text: "Your limitation—it's only your imagination.", author: "Unknown" },
      { text: "The journey of a thousand miles begins with one step.", author: "Lao Tzu" },
      { text: "You miss 100% of the shots you don't take.", author: "Wayne Gretzky" },
      { text: "Dream big. Start small. Act now.", author: "Robin Sharma" },
      { text: "Be so good they can't ignore you.", author: "Steve Martin" },
      { text: "Small daily improvements lead to staggering long-term results.", author: "Unknown" },
      { text: "The pain you feel today is the strength you feel tomorrow.", author: "Unknown" },
      { text: "Winners are not people who never fail, but people who never quit.", author: "Unknown" },
      { text: "Fall seven times, stand up eight.", author: "Japanese Proverb" },
      { text: "Action is the foundational key to all success.", author: "Pablo Picasso" },
      { text: "Do something today that your future self will thank you for.", author: "Unknown" }
    ];
    return quotes[Math.floor(Math.random() * quotes.length)];
  },
  
  // Update the quote display
  updateQuoteDisplay: () => {
    const quoteText = document.getElementById('game-quote-text');
    const quoteAuthor = document.getElementById('game-quote-author');
    
    if (quoteText && quoteAuthor) {
      const quote = App.getRandomQuote();
      
      // Fade out effect
      quoteText.style.opacity = '0';
      quoteAuthor.style.opacity = '0';
      
      setTimeout(() => {
        quoteText.textContent = `"${quote.text}"`;
        quoteAuthor.textContent = `— ${quote.author}`;
        
        // Fade in effect
        quoteText.style.opacity = '1';
        quoteAuthor.style.opacity = '1';
      }, 300);
    }
  },
  
  // Start quote rotation (every 10 seconds)
  startQuoteRotation: () => {
    // Clear any existing interval
    App.stopQuoteRotation();
    
    // Show initial quote
    App.updateQuoteDisplay();
    
    // Start rotation every 10 seconds
    App.quoteRotationInterval = setInterval(() => {
      App.updateQuoteDisplay();
    }, 10000);
  },
  
  // Stop quote rotation
  stopQuoteRotation: () => {
    if (App.quoteRotationInterval) {
      clearInterval(App.quoteRotationInterval);
      App.quoteRotationInterval = null;
    }
  },
  
  // Initialize the app
  init: async () => {
    // Initialize storage
    Storage.init();
    
    // Initialize themes
    Themes.init();
    
    // Initialize sounds
    Sounds.init();
    
    // Setup event listeners
    App.setupEventListeners();
    
    // Wait for loading animation
    await Utils.delay(2000);
    
    // Check if new user needs onboarding
    if (typeof Onboarding !== 'undefined' && Onboarding.needsOnboarding()) {
      UI.showScreen('home'); // Show home in background
      Onboarding.show();
    } else {
      // Show home screen for returning users
      UI.showScreen('home');
      App.renderHomeScreen();
    }
    
    // Update theme buttons
    App.updateThemeButtons();
    
    // Register service worker
    App.registerServiceWorker();
  },
  
  // Render the home screen based on user progress
  renderHomeScreen: () => {
    const user = Storage.getUser();
    const highestUnlocked = UnlockSystem.getHighestUnlocked();
    const scores = JSON.parse(localStorage.getItem('streakrush_game_scores') || '{}');
    
    // Update home streak badge
    const currentStreak = user.currentStreak || 0;
    const streakText = document.getElementById('home-streak-text');
    const streakFlames = document.getElementById('home-streak-flames');
    const streakBadge = document.getElementById('streak-badge');
    
    if (streakText && streakFlames && streakBadge) {
      if (currentStreak > 0) {
        streakText.textContent = `${currentStreak}-Game Win Streak!`;
        streakFlames.textContent = Streak.getFlames(currentStreak);
        streakBadge.style.display = 'flex';
      } else {
        streakText.textContent = 'Start Your Win Streak!';
        streakFlames.textContent = '🎯';
        streakBadge.style.display = 'flex';
      }
    }
    
    // Determine the next game to play
    let nextGameId;
    
    if (user.isPremium) {
      // Premium: Continue from where they left off
      nextGameId = highestUnlocked;
    } else {
      // Free: Play up to game 20
      if (highestUnlocked > 20) {
        // Completed all 20 - show commitment screen
        App.showCommitmentScreen();
        return;
      }
      nextGameId = highestUnlocked;
    }
    
    // Get the next game
    const nextGame = getGameById(nextGameId);
    if (!nextGame) return;
    
    App.currentGame = nextGame;
    
    // Update progress display
    const completedCount = Math.min(highestUnlocked - 1, user.isPremium ? 365 : 20);
    const totalGames = user.isPremium ? 365 : 20;
    const progressPercent = (completedCount / totalGames) * 100;
    
    const journeyStep = document.getElementById('journey-step');
    const journeyFill = document.getElementById('journey-fill');
    
    if (journeyStep) {
      if (user.isPremium) {
        journeyStep.textContent = `Game ${highestUnlocked} of 365`;
      } else {
        journeyStep.textContent = `Game ${highestUnlocked} of 20`;
      }
    }
    if (journeyFill) {
      journeyFill.style.width = `${progressPercent}%`;
    }
    
    // Update next game display
    document.getElementById('next-game-icon').textContent = nextGame.icon;
    document.getElementById('next-game-title').textContent = nextGame.name;
    document.getElementById('next-game-instruction').textContent = nextGame.instruction;
    
    // Update motivational quote with rotation
    const quoteBox = document.getElementById('game-quote-box');
    
    if (quoteBox) {
      quoteBox.style.display = 'block';
      // Start rotating quotes every 10 seconds
      App.startQuoteRotation();
    }
    
    // Show best score if exists
    const bestScore = scores[nextGameId];
    const bestDisplay = document.getElementById('best-score-display');
    const displayBest = document.getElementById('display-best');
    if (bestScore && bestDisplay && displayBest) {
      bestDisplay.style.display = 'block';
      displayBest.textContent = `${bestScore.percentage}%`;
    } else if (bestDisplay) {
      bestDisplay.style.display = 'none';
    }
    
    // Render completed games for replay
    App.renderCompletedGames(scores, highestUnlocked, user.isPremium);
  },
  
  // Render completed games that can be replayed
  renderCompletedGames: (scores, highestUnlocked, isPremium) => {
    const section = document.getElementById('completed-section');
    const grid = document.getElementById('completed-games-grid');
    
    if (!section || !grid) return;
    
    const completedCount = highestUnlocked - 1;
    
    if (completedCount > 0) {
      section.style.display = 'block';
      grid.innerHTML = '';
      
      // Show completed games (limit to last 10 for scrolling)
      const startFrom = Math.max(1, completedCount - 9);
      
      for (let i = startFrom; i <= completedCount; i++) {
        const game = getGameById(i);
        if (!game) continue;
        
        // For free users, only show games 1-10
        if (!isPremium && i > 10) break;
        
        const score = scores[i];
        const scoreText = score ? `${score.percentage}%` : '-';
        
        const card = document.createElement('div');
        card.className = 'completed-game-card';
        card.innerHTML = `
          <span class="completed-icon">${game.icon}</span>
          <span class="completed-name">${game.name}</span>
          <span class="completed-score">${scoreText}</span>
        `;
        
        card.addEventListener('click', () => {
          Sounds.click();
          App.playGame(game, true); // true = replay mode
        });
        
        grid.appendChild(card);
      }
    } else {
      section.style.display = 'none';
    }
  },
  
  // Show commitment screen after game 20
  showCommitmentScreen: () => {
    // Use the new CommitmentScreen module if available
    if (typeof CommitmentScreen !== 'undefined') {
      CommitmentScreen.show();
    } else {
      // Fallback to basic modal
      const modal = document.getElementById('commitment-modal');
      if (modal) modal.classList.add('active');
    }
    
    // Update home to show replay options
    const nextCard = document.getElementById('next-game-card');
    const journeyProgress = document.getElementById('journey-progress');
    
    if (nextCard) {
      nextCard.innerHTML = `
        <div class="journey-complete">
          <div class="complete-icon">🏆</div>
          <h2>You've completed 20 games!</h2>
          <p>Your brain has improved. Ready to continue?</p>
          <button class="unlock-preview-btn" onclick="if(typeof CommitmentScreen !== 'undefined') CommitmentScreen.show();">
            🧠 See Your Progress
          </button>
        </div>
      `;
    }
    
    if (journeyProgress) {
      const journeyStep = document.getElementById('journey-step');
      if (journeyStep) journeyStep.textContent = '20 of 20 Complete!';
      const journeyFill = document.getElementById('journey-fill');
      if (journeyFill) journeyFill.style.width = '100%';
    }
    
    // Still show completed games for replay
    const scores = JSON.parse(localStorage.getItem('streakrush_game_scores') || '{}');
    App.renderCompletedGames(scores, 21, false);
  },
  
  // Play a specific game (with mode selector for replays)
  playGame: (game, isReplay = false, skipModeSelect = false) => {
    App.currentGame = game;
    
    // For replays, show mode selector; for new games, use Speed mode by default
    if (isReplay && !skipModeSelect && typeof GameModes !== 'undefined') {
      GameModes.showModeSelector(game.id, (modeKey) => {
        Game.startSimpleGame(game, GameModes.getMode());
      });
    } else {
      // Default to Speed mode for new games
      if (typeof GameModes !== 'undefined') {
        GameModes.setMode('SPEED');
      }
      Game.startSimpleGame(game, typeof GameModes !== 'undefined' ? GameModes.getMode() : null);
    }
  },
  
  // Play game directly with specific mode (no selector)
  playGameWithMode: (game, modeKey) => {
    App.currentGame = game;
    if (typeof GameModes !== 'undefined') {
      GameModes.setMode(modeKey);
      Game.startSimpleGame(game, GameModes.getMode());
    } else {
      Game.startSimpleGame(game);
    }
  },
  
  // Show instructions screen for a game
  showGameInstructions: (game) => {
    if (!game) return;
    App.currentGame = game;
    
    // Populate game info
    document.getElementById('instructions-icon').textContent = game.icon;
    document.getElementById('instructions-title').textContent = game.name;
    document.getElementById('instructions-category').textContent = game.category;
    
    // Populate benefits
    const benefitsText = document.getElementById('game-benefits-text');
    if (benefitsText) {
      benefitsText.textContent = game.benefits || 'Builds discipline, focus, and mental strength through consistent practice.';
    }
    
    // Populate instructions
    document.getElementById('instructions-text').textContent = game.instruction;
    
    // Populate quote
    const fullQuote = typeof getGameQuote === 'function' ? getGameQuote(game) : (game.quote || '"Discipline is the bridge between goals and accomplishment." — Jim Rohn');
    const authorMatch = fullQuote.match(/— (.+)$/);
    const author = authorMatch ? authorMatch[1] : '';
    const quote = fullQuote.replace(/— .+$/, '').trim();
    
    const quoteText = document.getElementById('instr-quote-text');
    const quoteAuthor = document.getElementById('instr-quote-author');
    if (quoteText) quoteText.textContent = quote;
    if (quoteAuthor) quoteAuthor.textContent = author ? `— ${author}` : '';
    
    // Stop quote rotation when leaving home
    App.stopQuoteRotation();
    
    // Show instructions screen
    UI.showScreen('instructions');
  },
  
  // Begin the next challenge (show instructions first)
  beginChallenge: () => {
    if (!App.currentGame) return;
    App.showGameInstructions(App.currentGame);
  },
  
  // Setup event listeners
  setupEventListeners: () => {
    // Begin challenge button (shows instructions first)
    document.getElementById('begin-button')?.addEventListener('click', () => {
      Sounds.click();
      App.beginChallenge();
    });
    
    // Ready button on instructions screen (starts game)
    document.getElementById('ready-button')?.addEventListener('click', () => {
      Sounds.click();
      if (App.currentGame) {
        App.playGame(App.currentGame);
      }
    });
    
    // Back from instructions button
    document.getElementById('back-from-instructions')?.addEventListener('click', () => {
      Sounds.click();
      UI.showScreen('home');
      App.renderHomeScreen();
    });
    
    // Commitment modal buttons
    document.getElementById('commit-continue-btn')?.addEventListener('click', () => {
      Sounds.click();
      UI.showToast('Premium coming soon. Thank you for your commitment.', 'info');
    });
    
    document.getElementById('pause-here-btn')?.addEventListener('click', () => {
      Sounds.click();
      document.getElementById('commitment-modal').classList.remove('active');
      UI.showToast('No rush. Take your time.', 'info');
    });
    
    // Pause/Resume/Quit
    document.getElementById('pause-button')?.addEventListener('click', () => {
      Sounds.click();
      Game.pause();
    });
    
    document.getElementById('resume-button')?.addEventListener('click', () => {
      Sounds.click();
      Game.resume();
    });
    
    document.getElementById('quit-button')?.addEventListener('click', () => {
      Sounds.click();
      Game.quit();
    });
    
    // Play again / Continue button - advances to next game if passed
    document.getElementById('play-again-button')?.addEventListener('click', () => {
      Sounds.click();
      
      // Check if user passed the last game
      const lastGameId = App.currentGame?.id;
      if (lastGameId) {
        const scores = JSON.parse(localStorage.getItem('streakrush_game_scores') || '{}');
        const lastScore = scores[lastGameId];
        
        if (lastScore && lastScore.percentage >= 70) {
          // User passed - advance to next game
          const nextGameId = lastGameId + 1;
          const nextGame = getGameById(nextGameId);
          
          if (nextGame) {
            // Check if need premium (after game 20)
            const user = Storage.getUser();
            if (!user.isPremium && nextGameId > 20) {
              // Show commitment screen
              UI.showScreen('home');
              App.showCommitmentScreen();
              return;
            }
            
            // Start next game directly
            App.currentGame = nextGame;
            App.playGame(nextGame);
            return;
          }
        }
      }
      
      // Otherwise go to home
      UI.showScreen('home');
      App.renderHomeScreen();
    });
    
    // Replay button - play same game again
    document.getElementById('replay-button')?.addEventListener('click', () => {
      Sounds.click();
      if (App.currentGame) {
        App.playGame(App.currentGame, true);
      }
    });
    
    // Back to home from results
    document.getElementById('back-home-button')?.addEventListener('click', () => {
      Sounds.click();
      UI.showScreen('home');
      App.renderHomeScreen();
    });
    
    // Profile back button
    document.getElementById('profile-back-btn')?.addEventListener('click', () => {
      Sounds.click();
      UI.showScreen('home');
      App.renderHomeScreen();
    });
    
    // Stats back button
    document.getElementById('stats-back-btn')?.addEventListener('click', () => {
      Sounds.click();
      UI.showScreen('home');
      App.renderHomeScreen();
    });
    
    // Profile settings button
    document.getElementById('profile-settings-btn')?.addEventListener('click', () => {
      Sounds.click();
      App.openSettingsModal();
    });
    
    // Bottom navigation
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', () => {
        Sounds.click();
        const screen = item.dataset.screen;
        UI.showScreen(screen);
        
        // Update active nav
        document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');
        
        // Re-render home if needed
        if (screen === 'home') {
          App.renderHomeScreen();
        }
        
        // Update profile if navigating there
        if (screen === 'profile') {
          App.updateProfileStats();
          App.renderMemoryProfile();
        }
        
        // Update stats screen
        if (screen === 'stats') {
          Stats.render();
        }
      });
    });
    
    // Settings modal
    document.getElementById('open-settings')?.addEventListener('click', () => {
      Sounds.click();
      App.openSettingsModal();
    });
    
    document.getElementById('close-settings')?.addEventListener('click', () => {
      Sounds.click();
      App.closeSettingsModal();
    });
    
    document.getElementById('settings-done')?.addEventListener('click', () => {
      Sounds.click();
      App.closeSettingsModal();
    });
    
    // Settings sound toggle
    document.getElementById('settings-sound-toggle')?.addEventListener('change', (e) => {
      Sounds.enabled = e.target.checked;
      localStorage.setItem('streakrush_sound', e.target.checked);
      if (e.target.checked) Sounds.click();
    });
    
    // Settings theme buttons
    document.querySelectorAll('.settings-theme-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        Sounds.click();
        const theme = btn.dataset.theme;
        Themes.apply(theme);
        document.querySelectorAll('.settings-theme-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
    
    // Streak loss play button
    document.getElementById('streak-loss-play')?.addEventListener('click', () => {
      Sounds.click();
      document.getElementById('streak-loss-modal').classList.remove('active');
    });
    
    // Friends Hub
    document.querySelector('[data-screen="friends-hub"]')?.addEventListener('click', () => {
      if (typeof FriendsHub !== 'undefined') {
        FriendsHub.show();
      }
    });
  },
  
  // Render memory profile on profile screen
  renderMemoryProfile: () => {
    // Get brain score
    const brainScore = Storage.getBrainScore();
    
    document.getElementById('brain-emoji').textContent = brainScore.emoji;
    document.getElementById('brain-score').textContent = brainScore.score;
    document.getElementById('brain-level').textContent = brainScore.level;
    document.getElementById('brain-score-fill').style.width = `${brainScore.score}%`;
    document.getElementById('brain-breakdown').textContent = 
      `Base: ${brainScore.breakdown.baseScore} + Consistency: ${brainScore.breakdown.consistencyBonus} + Streak: ${brainScore.breakdown.streakBonus}`;
    
    // Get memory profile
    const profile = Storage.getMemoryProfile();
    const categories = Object.entries(profile);
    const container = document.getElementById('memory-categories');
    const emptyMsg = document.getElementById('memory-empty');
    const insights = document.getElementById('memory-insights');
    
    if (categories.length === 0) {
      emptyMsg.style.display = 'block';
      insights.style.display = 'none';
      return;
    }
    
    emptyMsg.style.display = 'none';
    container.innerHTML = '';
    
    // Trend emoji mapping
    const trendEmoji = {
      'improving': '📈',
      'stable': '➡️',
      'declining': '📉'
    };
    
    // Render each category
    categories.forEach(([name, data]) => {
      const categoryEl = document.createElement('div');
      categoryEl.className = 'memory-category';
      categoryEl.innerHTML = `
        <span class="memory-category-icon">${data.emoji}</span>
        <div class="memory-category-info">
          <div class="memory-category-name">${name}</div>
          <div class="memory-category-bar">
            <div class="memory-category-fill ${name.toLowerCase()}" style="width: ${data.average}%"></div>
          </div>
        </div>
        <span class="memory-category-score">${data.average}%</span>
        <span class="memory-category-trend">${trendEmoji[data.trend] || '➡️'}</span>
      `;
      container.appendChild(categoryEl);
    });
    
    // Show strengths/weaknesses
    const strengths = Storage.getMemoryStrengths();
    
    if (strengths.strongest && strengths.weakest) {
      insights.style.display = 'flex';
      document.getElementById('strongest-area').textContent = 
        `${strengths.strongest.emoji} ${strengths.strongest.name} (${strengths.strongest.average}%)`;
      document.getElementById('weakest-area').textContent = 
        `${strengths.weakest.emoji} ${strengths.weakest.name} (${strengths.weakest.average}%)`;
    }
  },
  
  // Update profile stats dynamically
  updateProfileStats: () => {
    const scores = JSON.parse(localStorage.getItem('streakrush_game_scores') || '{}');
    const highestUnlocked = UnlockSystem.getHighestUnlocked();
    const user = Storage.getUser();
    
    // Get streak info
    const currentStreak = user.currentStreak || 0;
    const bestStreak = user.bestStreak || 0;
    const totalGamesPlayed = user.totalGamesPlayed || 0;
    
    // Calculate stats from scores
    const scoreValues = Object.values(scores);
    const gamesCompleted = Object.keys(scores).length;
    const totalPlays = scoreValues.reduce((acc, s) => acc + (s.plays || 1), 0);
    
    let avgScore = 0;
    let bestScore = 0;
    let passedGames = 0;
    
    if (gamesCompleted > 0) {
      const percentages = scoreValues.map(s => s.percentage);
      avgScore = Math.round(percentages.reduce((a, b) => a + b, 0) / percentages.length);
      bestScore = Math.max(...percentages);
      passedGames = percentages.filter(p => p >= 70).length;
    }
    
    const passRate = totalGamesPlayed > 0 ? Math.round((passedGames / totalGamesPlayed) * 100) : 0;
    
    // Update NEW streak stats card
    const currentRunEl = document.getElementById('current-run');
    const bestRunEl = document.getElementById('best-run');
    const totalPlayedEl = document.getElementById('total-played');
    const passRateValueEl = document.getElementById('pass-rate-value');
    
    if (currentRunEl) currentRunEl.textContent = `${currentStreak} games`;
    if (bestRunEl) bestRunEl.textContent = `${bestStreak} games`;
    if (totalPlayedEl) totalPlayedEl.textContent = `${totalGamesPlayed} games`;
    if (passRateValueEl) passRateValueEl.textContent = `${passRate}%`;
    
    // Update journey progress
    const gamesCompletedEl = document.getElementById('games-completed');
    const highestGameEl = document.getElementById('highest-game');
    
    if (gamesCompletedEl) gamesCompletedEl.textContent = gamesCompleted;
    if (highestGameEl) highestGameEl.textContent = highestUnlocked;
    
    // Update progress bar
    const progressFill = document.getElementById('profile-progress-fill');
    const progressText = document.getElementById('profile-progress-text');
    const totalGames = user.isPremium ? 365 : 10;
    const progressPercent = (gamesCompleted / totalGames) * 100;
    
    if (progressFill) progressFill.style.width = `${Math.min(progressPercent, 100)}%`;
    if (progressText) progressText.textContent = `${gamesCompleted} / ${totalGames} games`;
    
    // Update top scores list
    const bestsList = document.getElementById('bests-list');
    const noGamesMessage = document.getElementById('no-games-message');
    
    if (gamesCompleted > 0 && bestsList) {
      // Sort scores by percentage (highest first)
      const sortedScores = Object.entries(scores)
        .map(([id, data]) => {
          const game = getGameById(parseInt(id));
          return { id: parseInt(id), ...data, game };
        })
        .filter(s => s.game)
        .sort((a, b) => b.percentage - a.percentage)
        .slice(0, 5); // Top 5
      
      if (noGamesMessage) noGamesMessage.style.display = 'none';
      
      // Clear and rebuild the list
      bestsList.innerHTML = sortedScores.map(s => `
        <div class="best-item">
          <span class="best-type">${s.game.icon} ${s.game.name}</span>
          <span class="best-score ${s.percentage >= 70 ? 'passed' : 'failed'}">${s.percentage}%</span>
        </div>
      `).join('');
    } else if (noGamesMessage) {
      noGamesMessage.style.display = 'block';
    }
  },
  
  // Open settings modal
  openSettingsModal: () => {
    const modal = document.getElementById('settings-modal');
    modal.classList.add('active');
    
    // Update toggle states
    const soundToggle = document.getElementById('settings-sound-toggle');
    if (soundToggle) {
      soundToggle.checked = localStorage.getItem('streakrush_sound') !== 'false';
    }
  },
  
  // Close settings modal
  closeSettingsModal: () => {
    const modal = document.getElementById('settings-modal');
    modal.classList.remove('active');
  },
  
  // Update theme buttons
  updateThemeButtons: () => {
    const currentTheme = localStorage.getItem('streakrush_theme') || 'fire';
    document.querySelectorAll('.settings-theme-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.theme === currentTheme);
    });
  },
  
  // Register service worker
  registerServiceWorker: () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(reg => console.log('SW registered'))
        .catch(err => console.log('SW failed'));
    }
  }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', App.init);
