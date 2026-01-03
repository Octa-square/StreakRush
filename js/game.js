// ========================================
// STREAKRUSH - GAME CONTROLLER
// Sequential unlock with 70% threshold
// ========================================

const Game = {
  currentGame: null,
  currentMode: null,
  isRunning: false,
  isPaused: false,
  timer: 60,
  timerInterval: null,
  score: 0,
  questionsAnswered: 0,
  
  // Start a simple game with optional mode
  startSimpleGame: async (game, mode = null) => {
    Game.currentGame = game;
    Game.currentMode = mode || { 
      timeLimit: 60, 
      hasTimer: true, 
      penaltyForWrong: true,
      scoreMultiplier: 1.0
    };
    Game.timer = Game.currentMode.timeLimit || 60;
    Game.score = 0;
    Game.questionsAnswered = 0;
    Game.isRunning = false;
    Game.isPaused = false;
    
    // Apply category theme to game elements
    const gameArea = document.getElementById('game-area');
    const gameHeader = document.querySelector('.game-header');
    
    gameArea.setAttribute('data-category', game.category);
    gameArea.setAttribute('data-game', game.id);
    if (Game.currentMode.id) {
      gameArea.setAttribute('data-mode', Game.currentMode.id);
    }
    if (gameHeader) {
      gameHeader.setAttribute('data-category', game.category);
    }
    
    // Update timer display for mode
    const timerDisplay = document.getElementById('game-timer');
    if (timerDisplay) {
      timerDisplay.textContent = Game.timer;
    }
    
    // Show mode indicator if not Speed mode
    Game.showModeIndicator(Game.currentMode);
    
    // Show countdown
    await Game.showCountdown();
    
    // Initialize game area with mode settings
    SimpleGames.init(gameArea, game.id);
    SimpleGames.currentMode = Game.currentMode;
    
    // Start the game
    Game.isRunning = true;
    SimpleGames.start(game.id);
    
    // Start timer (if mode has timer)
    if (Game.currentMode.hasTimer !== false) {
      Game.startTimer();
    } else {
      // Practice mode - no timer, use question limit
      Game.startPracticeMode(Game.currentMode.maxQuestions || 20);
    }
    
    // Record game played for limit
    GameLimit.recordGamePlayed(game.id);
  },
  
  // Show mode indicator
  showModeIndicator: (mode) => {
    let indicator = document.getElementById('mode-indicator');
    if (!indicator) {
      indicator = document.createElement('div');
      indicator.id = 'mode-indicator';
      indicator.style.cssText = `
        position: fixed;
        top: 100px;
        right: 15px;
        background: rgba(0, 0, 0, 0.7);
        padding: 6px 12px;
        border-radius: 20px;
        font-size: 0.8rem;
        color: white;
        z-index: 100;
        display: flex;
        align-items: center;
        gap: 6px;
      `;
      document.body.appendChild(indicator);
    }
    
    if (mode && mode.name && mode.id !== 'speed') {
      indicator.innerHTML = `${mode.icon || '🎮'} ${mode.name}`;
      indicator.style.borderColor = mode.color || '#fff';
      indicator.style.display = 'flex';
    } else {
      indicator.style.display = 'none';
    }
  },
  
  // Start practice mode (no timer, question limit)
  startPracticeMode: (maxQuestions) => {
    const timerEl = document.getElementById('game-timer');
    timerEl.textContent = '∞';
    timerEl.classList.remove('danger');
    
    // For practice mode, track questions instead of time
    SimpleGames.practiceMode = true;
    SimpleGames.maxQuestions = maxQuestions;
    
    // Update score display periodically
    const scoreUpdateInterval = setInterval(() => {
      if (Game.isRunning) {
        document.getElementById('game-score').textContent = SimpleGames.score;
        
        // Check if practice mode question limit reached
        if (SimpleGames.questionsAnswered >= maxQuestions) {
          clearInterval(scoreUpdateInterval);
          Game.endGame();
        }
      } else {
        clearInterval(scoreUpdateInterval);
      }
    }, 100);
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
  
  // Start the game timer (based on mode)
  startTimer: () => {
    const timerEl = document.getElementById('game-timer');
    const timeLimit = Game.currentMode?.timeLimit || 60;
    Game.timer = timeLimit;
    timerEl.textContent = timeLimit;
    timerEl.classList.remove('danger');
    
    // Update score display periodically
    const scoreUpdateInterval = setInterval(() => {
      if (Game.isRunning) {
        document.getElementById('game-score').textContent = SimpleGames.score;
      } else {
        clearInterval(scoreUpdateInterval);
      }
    }, 100);
    
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
    UI.showScreen('home');
    if (typeof App.renderHomeScreen === 'function') App.renderHomeScreen();
  },
  
  // End game (time's up)
  endGame: () => {
    Game.isRunning = false;
    
    // Stop timer
    clearInterval(Game.timerInterval);
    
    // Play game end sound
    Sounds.gameEnd();
    
    // Check if this was easy mode
    const isEasyMode = typeof FailureHandling !== 'undefined' && FailureHandling.isEasyMode();
    const easyModePassThreshold = isEasyMode ? 60 : 70; // 60% to pass in easy mode
    
    // Calculate final score with bonuses and mode multiplier
    const scoreData = SimpleGames.calculateFinalScore();
    const modeMultiplier = Game.currentMode?.scoreMultiplier || 1.0;
    const baseScore = scoreData.finalScore;
    const finalScore = Math.round(baseScore * modeMultiplier);
    const maxPossible = SimpleGames.maxPossibleScore || (scoreData.totalQuestions * 25);
    
    // Hide mode indicator
    const modeIndicator = document.getElementById('mode-indicator');
    if (modeIndicator) modeIndicator.style.display = 'none';
    
    // Record score and check unlock (with mastery tier)
    // Pass correctAnswers for proper percentage calculation
    const unlockResult = UnlockSystem.recordGameScore(
      Game.currentGame.id,
      finalScore,
      maxPossible,
      scoreData.totalQuestions,
      scoreData.correctAnswers // Pass correct answers for accurate scoring
    );
    
    // Cap mastery tier at Bronze for easy mode
    if (isEasyMode && unlockResult.passed) {
      unlockResult.tier = 'BRONZE';
      unlockResult.tierInfo = { name: 'Bronze', color: '#CD7F32', minPercentage: 60 };
      unlockResult.stars = 1;
      unlockResult.easyMode = true; // Flag for display
    }
    
    // Calculate coins earned (base + mastery bonus)
    const baseCoins = Math.floor(finalScore / 10);
    const masteryBonus = unlockResult.bonus || 0;
    const totalCoins = baseCoins + masteryBonus;
    
    // Check for personal best
    const bestKey = `game-${Game.currentGame.id}`;
    const isNewRecord = Storage.updateBest(bestKey, finalScore);
    
    // Add to leaderboard
    const rank = Storage.addToLeaderboard(finalScore);
    
    // Add coins
    Storage.addCoins(totalCoins);
    
    // Track reaction time for speed games
    if (scoreData.avgReactionTime > 0) {
      Storage.trackReactionTime(Game.currentGame.id, scoreData.avgReactionTime);
    }
    
    // Update streak based on performance (consecutive passes)
    const streakResult = Streak.updateStreak(unlockResult.percentage);
    
    // Update stats
    const stats = Storage.getStats();
    Storage.updateStats({
      totalGames: stats.totalGames + 1,
      totalScore: stats.totalScore + finalScore
    });
    
    // Show results with scoring breakdown
    Game.showResults({
      score: finalScore,
      baseScore: scoreData.baseScore,
      bonuses: scoreData.bonuses,
      totalBonus: scoreData.totalBonus,
      percentage: unlockResult.percentage,
      passed: unlockResult.passed,
      threshold: isEasyMode ? easyModePassThreshold : unlockResult.threshold,
      nextUnlocked: unlockResult.nextUnlocked,
      coinsEarned: totalCoins,
      masteryBonus: masteryBonus,
      rank: rank,
      isNewRecord: isNewRecord || unlockResult.isNewBest,
      streak: streakResult.streak,
      streakBroken: !streakResult.passed && streakResult.previousStreak > 0,
      previousStreak: streakResult.previousStreak || 0,
      isNewBestStreak: streakResult.isNewBest || false,
      tier: unlockResult.tier,
      tierInfo: unlockResult.tierInfo,
      stars: unlockResult.stars,
      questionsAnswered: scoreData.totalQuestions,
      correctAnswers: scoreData.correctAnswers,
      accuracy: scoreData.accuracy,
      avgReactionTime: scoreData.avgReactionTime,
      game: Game.currentGame,
      easyMode: isEasyMode
    });
    
    // Clear easy mode flag after game ends
    if (isEasyMode && typeof FailureHandling !== 'undefined') {
      FailureHandling.clearEasyMode();
    }
  },
  
  // Show results screen
  showResults: (results) => {
    const user = Storage.getUser();
    const questionsAnswered = SimpleGames.questionsAnswered || 0;
    
    // Update mastery display
    const masteryDisplay = document.getElementById('mastery-display');
    const masteryStars = document.getElementById('mastery-stars');
    const masteryTier = document.getElementById('mastery-tier');
    
    if (results.passed && results.tier) {
      const starsHTML = '⭐'.repeat(results.stars || 0);
      masteryStars.textContent = starsHTML || '⭐';
      
      // Show easy mode indicator if applicable
      if (results.easyMode) {
        masteryTier.innerHTML = `${results.tier} <span style="font-size: 0.6em; opacity: 0.8;">🌱 Easy</span>`;
      } else {
        masteryTier.textContent = results.tier;
      }
      masteryTier.style.color = results.tierInfo?.color || '#CD7F32';
      masteryDisplay.style.display = 'block';
    } else if (!results.passed) {
      masteryStars.textContent = '❌';
      masteryTier.textContent = 'TRY AGAIN';
      masteryTier.style.color = '#ef4444';
      masteryDisplay.style.display = 'block';
    }
    
    // Update game info
    document.getElementById('result-badge').textContent = results.game.icon;
    document.getElementById('result-game-name').textContent = results.game.name;
    
    // Update score display
    document.getElementById('final-score').textContent = Utils.formatNumber(results.score);
    document.getElementById('score-percentage').textContent = `${results.percentage}%`;
    
    // Show detailed breakdown
    const questionsEl = document.getElementById('questions-answered');
    const bonusBreakdown = document.getElementById('bonus-breakdown');
    
    const answered = results.questionsAnswered || questionsAnswered;
    const correct = results.correctAnswers || 0;
    const minRequired = UnlockSystem.MIN_QUESTIONS_TO_PASS || 6;
    
    // Show clear feedback about why they passed or failed
    if (answered < minRequired) {
      // Not enough questions answered
      questionsEl.innerHTML = `<span style="color: #ef4444;">⚠️ Only ${answered} questions answered</span><br><span style="font-size: 0.85rem; color: #888;">Need at least ${minRequired} to pass</span>`;
    } else {
      questionsEl.textContent = `${answered} questions • ${correct} correct • ${results.accuracy || 0}% accuracy`;
    }
    
    // Show bonuses if earned
    if (results.totalBonus > 0 && bonusBreakdown) {
      let bonusText = [];
      if (results.bonuses?.speed > 0) bonusText.push(`⚡Speed +${results.bonuses.speed}`);
      if (results.bonuses?.volume > 0) bonusText.push(`📊Volume +${results.bonuses.volume}`);
      if (results.bonuses?.accuracy > 0) bonusText.push(`🎯Accuracy +${results.bonuses.accuracy}`);
      
      bonusBreakdown.innerHTML = `<span style="color: #22c55e;">Bonuses: ${bonusText.join(' • ')}</span>`;
      bonusBreakdown.style.display = 'block';
    } else if (bonusBreakdown) {
      bonusBreakdown.style.display = 'none';
    }
    
    // Show reaction time if tracked
    if (results.avgReactionTime > 0) {
      const reactionEl = document.getElementById('avg-reaction-time');
      if (reactionEl) {
        reactionEl.textContent = `⚡ Avg reaction: ${results.avgReactionTime}ms`;
        reactionEl.style.display = 'block';
      }
    }
    
    // Update coins
    const coinsEl = document.getElementById('coins-earned');
    if (results.masteryBonus > 0) {
      coinsEl.innerHTML = `+${results.coinsEarned} <span style="color: #ffd700; font-size: 0.8em;">(+${results.masteryBonus} mastery)</span>`;
    } else {
      coinsEl.textContent = `+${results.coinsEarned}`;
    }
    
    // Update streak display
    const streakEl = document.getElementById('streak-update');
    if (results.streakBroken) {
      streakEl.textContent = '0';
      streakEl.style.color = '#ef4444';
    } else {
      streakEl.textContent = results.streak;
      streakEl.style.color = results.streak > 0 ? '#22c55e' : '';
    }
    
    // Update unlock message
    const unlockMessage = document.getElementById('unlock-message');
    const unlockText = document.getElementById('unlock-text');
    const bonusXp = document.getElementById('bonus-xp');
    
    if (results.passed) {
      // Reset failure tracking on success
      if (typeof FailureHandling !== 'undefined') {
        FailureHandling.resetAttempts(results.game.id);
        FailureHandling.clearEasyMode();
        
        // If was skipped before, unmark it now that they passed
        if (FailureHandling.isSkipped(results.game.id)) {
          FailureHandling.unmarkAsSkipped(results.game.id);
        }
        
        // Check for skip token reward
        const newTokens = FailureHandling.checkSkipTokenReward();
        if (newTokens > 0) {
          // Show token earned notification
          setTimeout(() => {
            const toast = document.createElement('div');
            toast.className = 'skip-toast';
            toast.innerHTML = `
              <span class="toast-icon">⏭️</span>
              <span class="toast-message">Earned ${newTokens} Skip Token${newTokens > 1 ? 's' : ''}!</span>
            `;
            document.body.appendChild(toast);
            setTimeout(() => toast.classList.add('visible'), 10);
            setTimeout(() => {
              toast.classList.remove('visible');
              setTimeout(() => toast.remove(), 300);
            }, 2500);
          }, 1000);
        }
      }
      
      // Hide failure handling area
      const failureArea = document.getElementById('failure-handling-area');
      if (failureArea) {
        failureArea.style.display = 'none';
        failureArea.innerHTML = '';
      }
      
      unlockText.textContent = '✅ Next game unlocked!';
      unlockText.style.color = '#22c55e';
      unlockMessage.style.display = 'block';
      
      if (results.bonusCoins > 0) {
        bonusXp.textContent = `+${results.bonusCoins} Bonus Coins`;
        bonusXp.style.display = 'block';
      } else {
        bonusXp.style.display = 'none';
      }
    } else {
      // Handle failure with progressive support
      const failureArea = document.getElementById('failure-handling-area');
      
      if (typeof FailureHandling !== 'undefined') {
        // Increment attempts and get appropriate response
        FailureHandling.incrementAttempts(results.game.id);
        const failureResponse = FailureHandling.getFailureResponse(results.game.id, results.percentage);
        
        if (failureResponse) {
          const failureHTML = FailureHandling.renderFailureUI(failureResponse, results.game.id);
          failureArea.innerHTML = failureHTML;
          failureArea.style.display = 'block';
          
          // Start force skip countdown if needed
          if (failureResponse.autoExecute) {
            setTimeout(() => {
              FailureHandling.startForceSkipCountdown(results.game.id);
            }, 500);
          }
          
          // Hide the standard "try again" message since we have enhanced UI
          unlockText.innerHTML = '';
          unlockMessage.style.display = 'none';
        } else {
          failureArea.style.display = 'none';
          unlockText.innerHTML = '📚 Score 70%+ to unlock the next game<br><span style="font-size: 0.9em; opacity: 0.8;">Keep practicing - you\'ve got this!</span>';
          unlockText.style.color = '#ef4444';
          unlockMessage.style.display = 'block';
        }
      } else {
        failureArea.style.display = 'none';
        unlockText.innerHTML = '📚 Score 70%+ to unlock the next game<br><span style="font-size: 0.9em; opacity: 0.8;">Keep practicing - you\'ve got this!</span>';
        unlockText.style.color = '#ef4444';
        unlockMessage.style.display = 'block';
      }
      
      bonusXp.style.display = 'none';
    }
    
    // Show improvement tip for Bronze
    const improvementTip = document.getElementById('improvement-tip');
    if (results.tier === 'BRONZE') {
      improvementTip.textContent = '💡 Try for Silver (85%+) to earn bonus coins!';
      improvementTip.style.display = 'block';
    } else if (results.tier === 'SILVER') {
      improvementTip.textContent = '💡 Try for Gold (95%+) to earn +150 coins!';
      improvementTip.style.display = 'block';
    } else if (results.tier === 'GOLD') {
      improvementTip.textContent = '💡 Perfect score (100%) = Platinum + 300 coins!';
      improvementTip.style.display = 'block';
    } else {
      improvementTip.style.display = 'none';
    }
    
    // Show/hide new record badge
    const newRecordEl = document.getElementById('new-record');
    if (results.isNewBestStreak) {
      newRecordEl.textContent = '🔥 NEW BEST STREAK!';
      newRecordEl.style.display = 'block';
    } else if (results.isNewRecord) {
      newRecordEl.textContent = '🎉 NEW PERSONAL BEST!';
      newRecordEl.style.display = 'block';
    } else {
      newRecordEl.style.display = 'none';
    }
    
    // Update action buttons
    const playAgainBtn = document.getElementById('play-again-button');
    const replayBtn = document.getElementById('replay-button');
    
    if (results.passed) {
      // Show next game button
      playAgainBtn.style.display = 'flex';
      
      if (!user.isPremium && results.game.id >= 20) {
        playAgainBtn.innerHTML = `<span class="button-icon">🏆</span> Journey Complete!`;
      } else {
        const nextGame = getGameById(results.game.id + 1);
        if (nextGame) {
          playAgainBtn.innerHTML = `<span class="button-icon">▶️</span> Next: ${nextGame.name}`;
        } else {
          playAgainBtn.innerHTML = `<span class="button-icon">🏠</span> Home`;
        }
      }
    } else {
      // Hide next button, show replay prominently
      playAgainBtn.style.display = 'none';
    }
    
    // Check if completed game 15 - show commitment screen
    if (results.passed && results.game.id === 15 && !user.isPremium) {
      setTimeout(() => {
        if (typeof CommitmentScreen !== 'undefined') {
          CommitmentScreen.show();
        }
      }, 2000);
    }
    
    UI.showScreen('results');
    
    // Check for milestone celebrations (after showing results)
    if (typeof Milestones !== 'undefined' && results.passed) {
      Milestones.checkMilestones(results);
    }
    
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
