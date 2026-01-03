// ========================================
// STREAKRUSH - GAME CONTROLLER
// 60 Simple Games Version
// ========================================

const Game = {
  currentGame: null,
  isRunning: false,
  isPaused: false,
  timer: 60,
  timerInterval: null,
  score: 0,
  
  // Start a simple game (new 60-game system)
  startSimpleGame: async (game) => {
    Game.currentGame = game;
    Game.timer = 60;
    Game.score = 0;
    Game.isRunning = false;
    Game.isPaused = false;
    
    // Apply category theme to game elements
    const gameArea = document.getElementById('game-area');
    const gameHeader = document.querySelector('.game-header');
    
    gameArea.setAttribute('data-category', game.category);
    gameArea.setAttribute('data-game', game.id);
    if (gameHeader) {
      gameHeader.setAttribute('data-category', game.category);
    }
    
    // Show countdown
    await Game.showCountdown();
    
    // Initialize game area
    SimpleGames.init(gameArea, game.id);
    
    // Start the game
    Game.isRunning = true;
    SimpleGames.start(game.id);
    
    // Start timer
    Game.startTimer();
    
    // Record game played for limit
    GameLimit.recordGamePlayed(game.id);
  },
  
  // Show 3-2-1 countdown
  showCountdown: async () => {
    UI.showScreen('countdown');
    const countdownEl = document.getElementById('countdown-number');
    
    for (let i = 3; i >= 1; i--) {
      countdownEl.textContent = i;
      countdownEl.style.animation = 'none';
      countdownEl.offsetHeight; // Trigger reflow
      countdownEl.style.animation = 'countdownPop 1s ease-out';
      
      Utils.vibrate(50);
      Sounds.countdown();
      await Utils.delay(1000);
    }
    
    // Show "GO!"
    countdownEl.textContent = 'GO!';
    countdownEl.style.animation = 'none';
    countdownEl.offsetHeight;
    countdownEl.style.animation = 'countdownPop 0.5s ease-out';
    Utils.vibrate([50, 30, 50]);
    Sounds.gameStart();
    
    await Utils.delay(500);
    
    UI.showScreen('game');
  },
  
  // Start the 60-second timer
  startTimer: () => {
    const timerEl = document.getElementById('game-timer');
    timerEl.textContent = '60';
    timerEl.classList.remove('danger');
    
    Game.timerInterval = setInterval(() => {
      if (Game.isPaused) return;
      
      Game.timer--;
      timerEl.textContent = Game.timer;
      
      // Danger zone
      if (Game.timer <= 10) {
        timerEl.classList.add('danger');
      }
      
      // Time's up
      if (Game.timer <= 0) {
        Game.endGame();
      }
    }, 1000);
  },
  
  // Pause game
  pause: () => {
    Game.isPaused = true;
    document.getElementById('pause-modal').classList.add('active');
  },
  
  // Resume game
  resume: () => {
    Game.isPaused = false;
    document.getElementById('pause-modal').classList.remove('active');
  },
  
  // Quit game
  quit: () => {
    Game.cleanup();
    document.getElementById('pause-modal').classList.remove('active');
    App.backToGames();
    UI.showScreen('home');
    App.updateGamesRemaining();
  },
  
  // End game (time's up)
  endGame: () => {
    Game.isRunning = false;
    
    // Stop timer
    clearInterval(Game.timerInterval);
    
    // Play game end sound
    Sounds.gameEnd();
    
    // Get final results
    const results = SimpleGames.end();
    const finalScore = Math.max(0, results.score);
    
    // Record score for unlock system
    UnlockSystem.recordScore(Game.currentGame.id, finalScore);
    
    // Calculate coins earned
    const coinsEarned = Math.floor(finalScore / 10);
    
    // Check for personal best
    const bestKey = `game-${Game.currentGame.id}`;
    const isNewRecord = Storage.updateBest(bestKey, finalScore);
    
    // Add to leaderboard
    const rank = Storage.addToLeaderboard(finalScore);
    
    // Add coins
    Storage.addCoins(coinsEarned);
    
    // Update streak
    const streakResult = Streak.incrementStreak();
    
    // Update stats
    const stats = Storage.getStats();
    Storage.updateStats({
      totalGames: stats.totalGames + 1,
      totalScore: stats.totalScore + finalScore
    });
    
    // Show results
    Game.showResults({
      score: finalScore,
      coinsEarned: coinsEarned,
      rank: rank,
      isNewRecord: isNewRecord,
      streak: streakResult.streak,
      game: Game.currentGame
    });
  },
  
  // Show results screen
  showResults: (results) => {
    // Update results UI
    document.getElementById('final-score').textContent = Utils.formatNumber(results.score);
    document.getElementById('coins-earned').textContent = `+${results.coinsEarned}`;
    document.getElementById('rank-position').textContent = `#${results.rank}`;
    document.getElementById('streak-update').textContent = results.streak;
    
    // Show/hide new record badge
    const newRecordEl = document.getElementById('new-record');
    newRecordEl.style.display = results.isNewRecord ? 'block' : 'none';
    
    // Update badge icon
    document.getElementById('result-badge').textContent = results.game.icon;
    document.getElementById('result-title').textContent = results.game.name + ' Complete!';
    
    // Update play again button
    const playAgainBtn = document.getElementById('play-again-button');
    const remaining = GameLimit.getRemainingGames();
    
    if (remaining > 0 || GameLimit.isUnlocked()) {
      playAgainBtn.style.display = 'flex';
      playAgainBtn.innerHTML = `<span class="button-icon">🔄</span> Play Again`;
    } else {
      playAgainBtn.style.display = 'none';
    }
    
    UI.showScreen('results');
    
    // Cleanup
    Game.cleanup();
  },
  
  // Cleanup
  cleanup: () => {
    Game.isRunning = false;
    
    clearInterval(Game.timerInterval);
    SimpleGames.clearTimers();
    
    // Reset timer display
    const timerEl = document.getElementById('game-timer');
    timerEl.textContent = '60';
    timerEl.classList.remove('danger');
    
    // Reset score display
    document.getElementById('game-score').textContent = '0';
    
    // Clear game area
    document.getElementById('game-area').innerHTML = '';
  }
};
