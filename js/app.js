// ========================================
// COGNIXIS - MAIN APPLICATION
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
    const scores = JSON.parse(localStorage.getItem('cognixis_game_scores') || '{}');
    
    // Update header stats (brain score and streak)
    const headerBrainScore = document.getElementById('header-brain-score');
    const headerStreak = document.getElementById('header-streak');
    if (headerBrainScore) {
      const brainScoreData = Storage.getBrainScore ? Storage.getBrainScore() : { score: 0 };
      headerBrainScore.textContent = brainScoreData.score || 0;
    }
    if (headerStreak) {
      headerStreak.textContent = user.currentStreak || 0;
    }
    
    // Update home streak badge
    const currentStreak = user.currentStreak || 0;
    const streakText = document.getElementById('home-streak-text');
    const streakFlames = document.getElementById('home-streak-flames');
    const streakBadge = document.getElementById('streak-badge');
    
    if (streakText && streakFlames && streakBadge) {
      if (currentStreak > 0) {
        streakText.textContent = `${currentStreak} Games Mastered! 🧠`;
        streakFlames.textContent = Streak.getFlames(currentStreak);
        streakBadge.style.display = 'flex';
      } else {
        streakText.textContent = 'Ready to Play! 🎮';
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
    
    // Update progress card with dynamic system
    Progress.updateProgressCard(false);
    
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
  
  // Track how many games are currently shown
  gamesShown: 12,
  
  // Render games list with pass/fail colors
  renderCompletedGames: (scores, highestUnlocked, isPremium) => {
    const section = document.getElementById('completed-section');
    const grid = document.getElementById('completed-games-grid');
    const sectionTitle = document.getElementById('completed-section-title');
    const sectionSubtitle = document.getElementById('completed-section-subtitle');
    
    if (!section || !grid) return;
    
    // Update section title
    if (sectionTitle) sectionTitle.textContent = 'Games';
    if (sectionSubtitle) sectionSubtitle.textContent = 'Tap to play any game';
    
    // FREE USERS: Show all 15 free games (no padlock on any free game)
    // PREMIUM USERS: Show all 60 games
    const FREE_GAMES = 15;
    const totalGames = isPremium ? 60 : FREE_GAMES;
    
    section.style.display = 'block';
    grid.innerHTML = '';
    
    // Show games up to current limit
    const showCount = Math.min(App.gamesShown, totalGames);
    
    for (let i = 1; i <= showCount; i++) {
      const game = getGameById(i);
      if (!game) continue;
      
      const score = scores[i];
      const hasPlayed = score && score.percentage !== undefined;
      // Use the 'passed' flag from latest attempt (not just percentage check)
      const passed = hasPlayed && score.passed === true;
      const failed = hasPlayed && score.passed === false;
      
      // Determine if game is free (1-15) or premium (16-60)
      const isFreeGame = i <= FREE_GAMES;
      const isLocked = !isPremium && !isFreeGame; // Only lock premium games for free users
      
      // Determine card state
      let cardClass = 'game-card';
      if (passed) cardClass += ' game-passed';
      if (failed) cardClass += ' game-failed';
      if (!hasPlayed && !isLocked) cardClass += ' game-unlocked';
      if (isLocked) cardClass += ' game-locked';
      
      // Score text: show percentage if played, "Play" if unlocked, 🔒 only for premium games
      const scoreText = hasPlayed ? `${score.percentage}%` : (isLocked ? '🔒' : 'Play');
      
      const card = document.createElement('div');
      card.className = cardClass;
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', `Game ${i}: ${game.name}${hasPlayed ? `, score ${score.percentage}%` : ''}`);
      card.innerHTML = `
        <span class="game-number">${i}</span>
        <span class="game-icon">${game.icon}</span>
        <span class="game-name">${game.name}</span>
        <span class="game-score ${passed ? 'score-pass' : ''} ${failed ? 'score-fail' : ''}">${scoreText}</span>
      `;
      
      // All free games are playable, premium games need subscription
      if (!isLocked) {
        card.addEventListener('click', () => {
          Sounds.click();
          // Show instructions first, then play
          App.showGameInstructions(game);
        });
      }
      
      grid.appendChild(card);
    }
    
    // Add "Load More" button if there are more games
    if (showCount < totalGames) {
      const loadMoreBtn = document.createElement('button');
      loadMoreBtn.className = 'load-more-btn';
      loadMoreBtn.innerHTML = `Load More Games (${totalGames - showCount} remaining)`;
      loadMoreBtn.addEventListener('click', () => {
        Sounds.click();
        App.gamesShown += 12;
        App.renderCompletedGames(scores, highestUnlocked, isPremium);
      });
      grid.appendChild(loadMoreBtn);
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
    const scores = JSON.parse(localStorage.getItem('cognixis_game_scores') || '{}');
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
    
    // Generate visual preview
    const previewBox = document.getElementById('game-preview');
    if (previewBox) {
      previewBox.innerHTML = App.generateGamePreview(game);
    }
    
    // Generate step-by-step instructions
    const stepsBox = document.getElementById('instruction-steps');
    if (stepsBox) {
      const steps = App.getGameSteps(game);
      stepsBox.innerHTML = steps.map((step, i) => `
        <div class="instruction-step" data-step="${i}">
          <div class="step-number">${i + 1}</div>
          <div class="step-content">
            <div class="step-text">${step.text}</div>
            ${step.example ? `<div class="step-example">${step.example}</div>` : ''}
          </div>
        </div>
      `).join('');
      
      // Animate steps one by one
      App.animateInstructionSteps();
    }
    
    // Stop quote rotation when leaving home
    App.stopQuoteRotation();
    
    // Show instructions screen
    UI.showScreen('instructions');
  },
  
  // Generate visual preview for each game type
  generateGamePreview: (game) => {
    const gameType = game.name.toLowerCase().replace(/\s+/g, '');
    
    // Game-specific previews
    const previews = {
      'colorsequence': `
        <div class="preview-sequence">
          <div class="preview-item" style="background: #ef4444;">🔴</div>
          <div class="preview-item" style="background: #3b82f6;">🔵</div>
          <div class="preview-item" style="background: #22c55e;">🟢</div>
        </div>
        <div class="preview-correct">✓ Tap in same order</div>
      `,
      'numberflash': `
        <div class="preview-sequence">
          <div class="preview-item" style="background: var(--accent-primary); color: white;">7</div>
          <div class="preview-item" style="background: var(--accent-primary); color: white;">2</div>
          <div class="preview-item" style="background: var(--accent-primary); color: white;">9</div>
        </div>
        <div class="preview-correct">✓ Type: 729</div>
      `,
      'reactiontest': `
        <div class="preview-sequence">
          <div class="preview-item" style="background: #22c55e; width: 80px; height: 80px; border-radius: 50%;">TAP!</div>
        </div>
        <div class="preview-correct">✓ Tap when GREEN</div>
      `,
      'cardmatchrush': `
        <div class="preview-sequence">
          <div class="preview-item" style="background: var(--bg-card);">🃏</div>
          <div class="preview-item" style="background: var(--bg-card);">🃏</div>
          <div class="preview-item" style="background: #22c55e;">🎴</div>
          <div class="preview-item" style="background: #22c55e;">🎴</div>
        </div>
        <div class="preview-correct">✓ Match pairs</div>
      `,
      'shapeshifter': `
        <div class="preview-sequence">
          <div class="preview-item" style="background: #3b82f6;">▲</div>
          <div class="preview-item" style="background: #22c55e;">●</div>
          <div class="preview-item" style="background: #f59e0b;">■</div>
        </div>
        <div class="preview-correct">✓ Same or Different?</div>
      `,
      'speedmath': `
        <div class="preview-sequence" style="flex-direction: column; gap: 8px;">
          <div style="font-size: 1.5rem; font-weight: 700; color: var(--text-primary);">7 + 5 = ?</div>
          <div class="preview-item" style="background: #22c55e; color: white; width: auto; padding: 0 20px;">12</div>
        </div>
        <div class="preview-correct">✓ Quick calculation</div>
      `,
      'worldcapitals': `
        <div class="preview-sequence" style="flex-direction: column; gap: 8px;">
          <div style="font-size: 1.2rem; color: var(--text-primary);">🇫🇷 France</div>
          <div class="preview-item" style="background: #22c55e; color: white; width: auto; padding: 0 20px;">Paris</div>
        </div>
        <div class="preview-correct">✓ Name the capital</div>
      `,
      'wordchain': `
        <div class="preview-sequence" style="flex-direction: column; gap: 4px;">
          <div style="font-size: 1rem; color: var(--text-secondary);">CAT → TAP → ...</div>
          <div class="preview-item" style="background: #22c55e; color: white; width: auto; padding: 0 20px;">PEN</div>
        </div>
        <div class="preview-correct">✓ Start with last letter</div>
      `
    };
    
    // Default preview for games without specific design
    const defaultPreview = `
      <div class="preview-sequence">
        <div class="preview-item" style="background: var(--accent-primary); font-size: 2rem;">${game.icon}</div>
      </div>
      <div style="margin-top: 12px; font-size: 0.9rem; color: var(--text-secondary);">
        ${game.instruction || 'Follow the prompts and respond quickly!'}
      </div>
    `;
    
    return previews[gameType] || defaultPreview;
  },
  
  // Get step-by-step instructions for each game
  getGameSteps: (game) => {
    const gameType = game.name.toLowerCase().replace(/\s+/g, '');
    
    const gameSteps = {
      'colorsequence': [
        { text: 'Watch the colors flash in sequence', example: '🔴 → 🔵 → 🟢' },
        { text: 'Memorize the order they appear' },
        { text: 'Tap the colors in the SAME order', example: 'Tap: Red, Blue, Green' },
        { text: 'Sequences get longer as you progress!' }
      ],
      'numberflash': [
        { text: 'Numbers will flash on screen briefly', example: '7 → 2 → 9' },
        { text: 'Remember the digits in order' },
        { text: 'Type the complete number', example: 'Enter: 729' },
        { text: 'More digits = harder levels!' }
      ],
      'reactiontest': [
        { text: 'A circle will appear on screen' },
        { text: 'Wait for it to turn GREEN', example: '⚪ → 🟢' },
        { text: 'Tap as FAST as possible when green' },
        { text: 'Don\'t tap on RED - that\'s a penalty!' }
      ],
      'cardmatchrush': [
        { text: 'Cards are face down on the board' },
        { text: 'Tap two cards to flip them' },
        { text: 'Find matching pairs', example: '🎴🎴 = Match!' },
        { text: 'Clear all pairs to win!' }
      ],
      'shapeshifter': [
        { text: 'Two shapes will appear' },
        { text: 'Compare them quickly' },
        { text: 'Tap SAME if they match' },
        { text: 'Tap DIFFERENT if they don\'t match' }
      ],
      'speedmath': [
        { text: 'A math problem appears', example: '7 + 5 = ?' },
        { text: 'Calculate the answer quickly' },
        { text: 'Tap the correct answer' },
        { text: 'Speed matters - be quick!' }
      ],
      'worldcapitals': [
        { text: 'A country name appears', example: '🇫🇷 France' },
        { text: 'Think of its capital city' },
        { text: 'Select the correct capital', example: 'Paris ✓' },
        { text: 'Learn geography while playing!' }
      ],
      'wordchain': [
        { text: 'See the starting word', example: 'CAT' },
        { text: 'Find a word starting with the last letter', example: 'T → TAP' },
        { text: 'Continue the chain!' },
        { text: 'Keep the chain going as long as possible' }
      ]
    };
    
    // Default steps
    const defaultSteps = [
      { text: game.instruction || 'Follow the prompts on screen' },
      { text: 'Respond as quickly as you can' },
      { text: 'Score points for correct answers' },
      { text: 'Reach 70% accuracy to pass!' }
    ];
    
    return gameSteps[gameType] || defaultSteps;
  },
  
  // Animate instruction steps one by one
  animateInstructionSteps: () => {
    const steps = document.querySelectorAll('.instruction-step');
    let currentStep = 0;
    
    // Clear any existing animation
    if (App.instructionStepTimer) {
      clearInterval(App.instructionStepTimer);
    }
    
    // Animate steps sequentially
    const animateNext = () => {
      if (currentStep > 0 && steps[currentStep - 1]) {
        steps[currentStep - 1].classList.remove('active');
        steps[currentStep - 1].classList.add('completed');
      }
      
      if (currentStep < steps.length) {
        steps[currentStep].classList.add('active');
        currentStep++;
      } else {
        // Loop back
        steps.forEach(step => {
          step.classList.remove('active', 'completed');
        });
        currentStep = 0;
      }
    };
    
    // Start animation
    animateNext();
    App.instructionStepTimer = setInterval(animateNext, 1500);
  },
  
  // Stop instruction animation
  stopInstructionAnimation: () => {
    if (App.instructionStepTimer) {
      clearInterval(App.instructionStepTimer);
      App.instructionStepTimer = null;
    }
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
      App.stopInstructionAnimation(); // Stop the step animation
      if (App.currentGame) {
        App.playGame(App.currentGame);
      }
    });
    
    // Back from instructions button
    document.getElementById('back-from-instructions')?.addEventListener('click', () => {
      Sounds.click();
      App.stopInstructionAnimation(); // Stop the step animation
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
        const nextGameId = lastGameId + 1;
        const nextGame = getGameById(nextGameId);
        
        if (nextGame) {
          // Check if need premium (after game 15)
          const user = Storage.getUser();
          if (!user.isPremium && nextGameId > 15) {
            // Show commitment screen
            UI.showScreen('home');
            App.showCommitmentScreen();
            return;
          }
          
          // Start next game directly - no need to go home first!
          App.currentGame = nextGame;
          App.playGame(nextGame);
          return;
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
      localStorage.setItem('cognixis_sound', e.target.checked);
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
    
    // Difficulty buttons (premium feature)
    document.querySelectorAll('.difficulty-option').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.classList.contains('locked')) {
          Sounds.wrong();
          UI.showToast('🔒 Unlock with Premium to access difficulty modes', 'info');
          return;
        }
        Sounds.click();
        document.querySelectorAll('.difficulty-option').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        localStorage.setItem('cognixis_difficulty', btn.dataset.difficulty);
      });
    });
    
    // Reset progress button
    document.getElementById('reset-progress-btn')?.addEventListener('click', () => {
      Sounds.click();
      App.showResetConfirmation();
    });
    
    // DEV MODE: Premium toggle button - REMOVE BEFORE PRODUCTION
    document.getElementById('toggle-premium-btn')?.addEventListener('click', () => {
      Sounds.click();
      App.toggleDevPremium();
    });
    App.updateDevPremiumUI(); // Initialize UI state
    // END DEV MODE
    
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
    const scores = JSON.parse(localStorage.getItem('cognixis_game_scores') || '{}');
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
    const totalGames = user.isPremium ? 60 : 15;
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
      soundToggle.checked = localStorage.getItem('cognixis_sound') !== 'false';
    }
    
    // Update language button display
    if (typeof I18n !== 'undefined') {
      const langInfo = I18n.getCurrentLanguageInfo();
      const langFlag = document.getElementById('current-lang-flag');
      const langName = document.getElementById('current-lang-name');
      if (langFlag) langFlag.textContent = langInfo?.flag || '🇬🇧';
      if (langName) langName.textContent = langInfo?.native || 'English';
    }
  },
  
  // Close settings modal
  closeSettingsModal: () => {
    const modal = document.getElementById('settings-modal');
    modal.classList.remove('active');
  },
  
  // Show reset confirmation
  showResetConfirmation: () => {
    // Create confirmation modal
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.id = 'reset-confirm-modal';
    modal.innerHTML = `
      <div class="reset-confirm-modal">
        <h3>⚠️ Reset All Progress?</h3>
        <p>This will delete all your scores, streaks, and achievements. This cannot be undone.</p>
        <div class="reset-confirm-buttons">
          <button class="cancel-btn" id="reset-cancel">Cancel</button>
          <button class="confirm-btn" id="reset-confirm">Reset</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    
    // Cancel button
    document.getElementById('reset-cancel').addEventListener('click', () => {
      Sounds.click();
      modal.remove();
    });
    
    // Confirm button
    document.getElementById('reset-confirm').addEventListener('click', () => {
      Sounds.wrong();
      App.resetAllProgress();
      modal.remove();
    });
    
    // Close on backdrop click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
  },
  
  // Reset all progress
  resetAllProgress: () => {
    console.log('Resetting all progress...');
    
    // Clear all game-related storage
    localStorage.removeItem('cognixis_game_scores');
    localStorage.removeItem('cognixis_game_attempts');
    localStorage.removeItem('cognixis_skipped_games');
    localStorage.removeItem('cognixis_brain_score');
    localStorage.removeItem('cognixis_coins');
    localStorage.removeItem('cognixis_powerups');
    
    // Reset user data but keep name, premium status, and settings
    const user = Storage.getUser();
    const resetUser = {
      name: user.name,
      avatar: user.avatar,
      isPremium: user.isPremium,
      currentStreak: 0,
      bestStreak: 0,
      gamesPlayed: 0,
      gamesPassed: 0,
      totalScore: 0,
      lastPlayed: null,
      joinDate: user.joinDate
    };
    localStorage.setItem('cognixis_user', JSON.stringify(resetUser));
    
    // Reset the games shown counter
    App.gamesShown = 12;
    
    // Close settings modal
    App.closeSettingsModal();
    
    // Show success toast
    if (typeof UI !== 'undefined' && UI.showToast) {
      UI.showToast('✅ Progress reset successfully', 'success');
    } else {
      alert('Progress reset successfully!');
    }
    
    // Refresh home screen
    App.renderHomeScreen();
    
    console.log('Progress reset complete!');
  },
  
  // Update theme buttons
  updateThemeButtons: () => {
    const currentTheme = localStorage.getItem('cognixis_theme') || 'cyber-neural';
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
  },
  
  // ========================================
  // DEV MODE FUNCTIONS - REMOVE BEFORE PRODUCTION DEPLOY
  // ========================================
  
  // Toggle premium status for testing
  toggleDevPremium: () => {
    const user = Storage.getUser();
    user.isPremium = !user.isPremium;
    localStorage.setItem('cognixis_user', JSON.stringify(user));
    
    App.updateDevPremiumUI();
    App.renderHomeScreen();
    
    UI.showToast(user.isPremium ? '👑 Premium ENABLED (Demo)' : '🔒 Premium DISABLED', 'success');
  },
  
  // Update the premium toggle UI state
  updateDevPremiumUI: () => {
    const user = Storage.getUser();
    const btn = document.getElementById('toggle-premium-btn');
    const toggleText = document.getElementById('premium-toggle-text');
    const statusText = document.getElementById('premium-status-text');
    const premiumBanner = document.getElementById('premium-banner');
    
    if (btn && toggleText && statusText) {
      if (user.isPremium) {
        btn.classList.add('active');
        toggleText.textContent = '🔓 Disable Premium (Demo)';
        statusText.textContent = 'Currently: 👑 PREMIUM USER';
      } else {
        btn.classList.remove('active');
        toggleText.textContent = '🔓 Enable Premium (Demo)';
        statusText.textContent = 'Currently: Free User';
      }
    }
    
    // Hide/show premium banner based on status
    if (premiumBanner) {
      premiumBanner.style.display = user.isPremium ? 'none' : 'block';
    }
  }
  // ========================================
  // END DEV MODE FUNCTIONS
  // ========================================
};

// ========================================
// PROGRESS TRACKER - DYNAMIC SYSTEM
// ========================================
const Progress = {
  // Calculate actual completed games (70%+ pass rate)
  getCompletedGames: () => {
    const scores = JSON.parse(localStorage.getItem('cognixis_game_scores') || '{}');
    return Object.values(scores).filter(score => score && score.percentage >= 70).length;
  },
  
  // Get mastery count (90%+ scores)
  getMasteryCount: () => {
    const scores = JSON.parse(localStorage.getItem('cognixis_game_scores') || '{}');
    return Object.values(scores).filter(score => score && score.percentage >= 90).length;
  },
  
  // Get total games available
  getTotalGames: () => {
    const user = Storage.getUser();
    return user.isPremium ? 60 : 15;
  },
  
  // Get progress percentage
  getProgressPercentage: () => {
    const completed = Progress.getCompletedGames();
    const total = 60; // Always out of 60 for consistency
    return Math.round((completed / total) * 100);
  },
  
  // Get progress level class for styling
  getProgressLevel: (percentage) => {
    if (percentage >= 100) return 'level-complete';
    if (percentage >= 76) return 'level-almost';
    if (percentage >= 51) return 'level-halfway';
    if (percentage >= 21) return 'level-started';
    return 'level-beginner';
  },
  
  // Get milestone badge based on completed count
  getMilestoneBadge: (completed) => {
    if (completed >= 60) return '💎';
    if (completed >= 45) return '🥇';
    if (completed >= 30) return '🥈';
    if (completed >= 15) return '🥉';
    if (completed >= 1) return '🎉';
    return '';
  },
  
  // Update the progress card UI
  updateProgressCard: (animate = false) => {
    const completed = Progress.getCompletedGames();
    const mastery = Progress.getMasteryCount();
    const total = 60;
    const remaining = total - completed;
    const percentage = Progress.getProgressPercentage();
    const level = Progress.getProgressLevel(percentage);
    const badge = Progress.getMilestoneBadge(completed);
    
    // Update count
    const countEl = document.getElementById('progress-count');
    if (countEl) countEl.textContent = `${completed} / ${total}`;
    
    // Update percentage
    const percentEl = document.getElementById('progress-percentage');
    if (percentEl) percentEl.textContent = `${percentage}%`;
    
    // Update progress bar
    const fillEl = document.getElementById('journey-fill');
    if (fillEl) {
      // Remove old level classes
      fillEl.classList.remove('level-beginner', 'level-started', 'level-halfway', 'level-almost', 'level-complete');
      // Add new level class
      fillEl.classList.add(level);
      
      if (animate) {
        const oldWidth = fillEl.style.width || '0%';
        fillEl.style.setProperty('--old-width', oldWidth);
        fillEl.style.setProperty('--new-width', `${percentage}%`);
        fillEl.style.animation = 'progressIncrement 0.6s ease-out forwards';
        setTimeout(() => {
          fillEl.style.animation = '';
          fillEl.style.width = `${percentage}%`;
        }, 600);
      } else {
        fillEl.style.width = `${percentage}%`;
      }
    }
    
    // Update stats
    const passedEl = document.getElementById('stat-passed');
    const remainingEl = document.getElementById('stat-remaining');
    const masteryEl = document.getElementById('stat-mastery');
    
    if (passedEl) {
      if (animate) {
        passedEl.classList.add('animating');
        setTimeout(() => passedEl.classList.remove('animating'), 300);
      }
      passedEl.textContent = completed;
    }
    if (remainingEl) remainingEl.textContent = remaining;
    if (masteryEl) masteryEl.textContent = mastery;
    
    // Update trail icon based on progress
    const trailIcon = document.getElementById('trail-icon');
    if (trailIcon) {
      trailIcon.style.left = `${percentage}%`;
      // Change icon based on progress
      if (percentage >= 100) {
        trailIcon.textContent = '🏆';
      } else if (percentage >= 75) {
        trailIcon.textContent = '🔥';
      } else if (percentage >= 50) {
        trailIcon.textContent = '⚡';
      } else if (percentage >= 25) {
        trailIcon.textContent = '🎯';
      } else {
        trailIcon.textContent = '🚀';
      }
    }
    
    // Update milestone badge
    const badgeEl = document.getElementById('milestone-badge');
    if (badgeEl) badgeEl.textContent = badge;
  },
  
  // Check and show milestone celebration
  checkMilestones: (newCompleted) => {
    const milestones = [
      { count: 1, title: 'FIRST WIN!', reward: '🎉 You\'re on your way!', icon: '🎉' },
      { count: 15, title: 'QUARTER DONE!', reward: '🥉 Bronze Trophy Unlocked!', icon: '🥉' },
      { count: 30, title: 'HALFWAY THERE!', reward: '🥈 Silver Trophy Unlocked!', icon: '🥈' },
      { count: 45, title: 'ALMOST THERE!', reward: '🥇 Gold Trophy Unlocked!', icon: '🥇' },
      { count: 60, title: 'CHAMPION!', reward: '💎 Diamond Status!', icon: '💎' }
    ];
    
    const milestone = milestones.find(m => m.count === newCompleted);
    if (milestone) {
      const key = `cognixis_milestone_${milestone.count}_seen`;
      if (!localStorage.getItem(key)) {
        localStorage.setItem(key, 'true');
        Progress.showMilestoneModal(milestone);
      }
    }
  },
  
  // Show milestone celebration modal
  showMilestoneModal: (milestone) => {
    const modal = document.createElement('div');
    modal.className = 'milestone-modal';
    modal.innerHTML = `
      <div class="milestone-icon">${milestone.icon}</div>
      <h2>${milestone.title}</h2>
      <p>${milestone.count} games mastered!</p>
      <div class="milestone-reward">
        <span>${milestone.reward}</span>
      </div>
      <button class="continue-btn">CONTINUE</button>
    `;
    
    document.body.appendChild(modal);
    
    // Play celebration sound
    if (typeof Sounds !== 'undefined') Sounds.success();
    
    // Close on button click
    modal.querySelector('.continue-btn').onclick = () => {
      modal.style.animation = 'fadeOut 0.3s ease forwards';
      setTimeout(() => modal.remove(), 300);
    };
  },
  
  // Called after game completion
  onGameComplete: (gameId, scorePercentage) => {
    const oldCompleted = Progress.getCompletedGames();
    
    // The score is already saved by the game system
    // Just update the UI and check milestones
    
    const newCompleted = Progress.getCompletedGames();
    
    // If we gained a new completed game
    if (newCompleted > oldCompleted) {
      Progress.updateProgressCard(true);
      Progress.checkMilestones(newCompleted);
    } else {
      Progress.updateProgressCard(false);
    }
  }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', App.init);
