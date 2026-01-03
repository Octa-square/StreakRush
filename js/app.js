// ========================================
// STREAKRUSH - MAIN APPLICATION
// 60 Games • Progressive Unlock • Multiplayer
// ========================================

const App = {
  selectedGame: null,
  showInstructions: true, // Show instructions before first time playing each game
  
  // Initialize the app
  init: async () => {
    // Initialize storage
    Storage.init();
    
    // Initialize themes
    Themes.init();
    
    // Initialize sounds (will init on first click)
    Sounds.init();
    
    // Check streak status
    const streakStatus = Streak.checkStreak();
    
    // Setup event listeners
    App.setupEventListeners();
    
    // Wait for loading animation
    await Utils.delay(2000);
    
    // Show appropriate screen
    if (streakStatus.status === 'lost') {
      UI.showScreen('home');
      App.renderGamesGrid();
      App.updateGamesRemaining();
      UI.showStreakLossModal(streakStatus);
    } else {
      UI.showScreen('home');
      App.renderGamesGrid();
      App.updateGamesRemaining();
    }
    
    // Update theme buttons
    App.updateThemeButtons();
    
    // Register service worker
    App.registerServiceWorker();
    
    // Start timer update
    App.startTimerUpdate();
  },
  
  // Get game instructions
  getGameInstructions: (game) => {
    const instructions = {
      // Reflex Games
      1: { tips: ['✓ Tap green circles = +10 points', '✗ Miss or slow = -5 points', '⏱ You have 60 seconds'], demo: 'green-tap' },
      2: { tips: ['✓ Pop bubbles before they escape', '✓ Bigger bubbles = more points', '⏱ 60 seconds of bubble mayhem'], demo: 'bubble' },
      3: { tips: ['✓ Catch stars as they fall', '✗ Don\'t let them hit the ground', '⭐ Golden stars = 2x points'], demo: 'catch' },
      4: { tips: ['✓ Whack moles when they appear', '✓ Faster whacks = more points', '⏱ They hide after 2 seconds'], demo: 'whack' },
      5: { tips: ['✓ Tap the screen as fast as you can', '✓ Every tap = +1 point', '🏆 Try to beat 200 taps!'], demo: 'tap-fast' },
      6: { tips: ['✓ Tap GREEN circles only', '✗ RED circles = -20 points', '⚡ Stay focused!'], demo: 'avoid' },
      7: { tips: ['✓ Tap dots before they shrink away', '✓ Smaller dots = more points', '⏱ They disappear fast!'], demo: 'shrink' },
      8: { tips: ['✓ Tap the glowing square', '✓ It moves around the grid', '⚡ Speed is key!'], demo: 'glow' },
      9: { tips: ['✓ Tap targets as they move', '✓ Faster targets = more points', '🎯 Stay on target!'], demo: 'moving' },
      10: { tips: ['✓ Swipe left or right to dodge', '✗ Don\'t get hit by obstacles', '⏱ Survive 60 seconds!'], demo: 'dodge' },
      // Memory Games
      11: { tips: ['✓ Watch the pattern carefully', '✓ Repeat it in order', '🧠 Gets harder each round'], demo: 'pattern' },
      12: { tips: ['✓ Remember the number shown', '✓ Enter it when asked', '🔢 Numbers get longer!'], demo: 'number' },
      13: { tips: ['✓ Find matching pairs', '✓ Fewer flips = higher score', '🃏 Train your memory!'], demo: 'pairs' },
      14: { tips: ['✓ What color was shown?', '✓ Pick the correct color', '🎨 Colors flash briefly!'], demo: 'color-mem' },
      15: { tips: ['✓ Remember square positions', '✓ Tap them in order', '⬛ Grid gets bigger!'], demo: 'position' },
      16: { tips: ['✓ Watch the sequence flash', '✓ Replay it perfectly', '⚡ Gets faster each round'], demo: 'flash' },
      17: { tips: ['✓ Remember the sequence', '✓ Was it shown before?', '🔄 Test your recall!'], demo: 'sequence' },
      18: { tips: ['✓ Remember items briefly shown', '✓ Identify the missing one', '🕵️ Pay close attention!'], demo: 'missing' },
      19: { tips: ['✓ Order items by size', '✓ From smallest to largest', '📏 Quick comparison!'], demo: 'order' },
      20: { tips: ['✓ Remember shape positions', '✓ Match them correctly', '🔷 Shapes move around!'], demo: 'shape-mem' },
      // Math Games
      21: { tips: ['✓ Add numbers quickly', '✓ Enter the sum fast', '➕ Speed = bonus points'], demo: 'add' },
      22: { tips: ['✓ Subtract numbers', '✓ Enter the difference', '➖ No negative answers'], demo: 'subtract' },
      23: { tips: ['✓ Multiply numbers', '✓ Enter the product', '✖️ Tables up to 12'], demo: 'multiply' },
      24: { tips: ['✓ Compare two numbers', '✓ Tap the bigger one', '🔢 Faster = more points'], demo: 'bigger' },
      25: { tips: ['✓ Count objects quickly', '✓ Enter the total', '🔢 Objects appear briefly'], demo: 'count' },
      26: { tips: ['✓ Divide numbers', '✓ Enter the result', '➗ Whole numbers only'], demo: 'divide' },
      27: { tips: ['✓ Guess the next number', '✓ Find the pattern', '🔢 +, -, ×, or ÷'], demo: 'next' },
      28: { tips: ['✓ Calculate the equation', '✓ Is it true or false?', '✓ Trust your math!'], demo: 'true-false' },
      29: { tips: ['✓ Add up all numbers', '✓ Enter the total', '➕ Multiple numbers'], demo: 'sum' },
      30: { tips: ['✓ Solve the equation', '✓ Find X', '🔢 Algebra basics'], demo: 'solve' },
      // Reaction Games
      31: { tips: ['✓ Wait for green light', '✓ Tap immediately when green', '🚦 Don\'t tap on red!'], demo: 'green-light' },
      32: { tips: ['✓ Wait... wait...', '✓ Tap when you see GO!', '⏱ Patience is key'], demo: 'wait' },
      33: { tips: ['✓ Tap as fast as possible', '✓ Beat the countdown', '⚡ Reaction speed test'], demo: 'speed-tap' },
      34: { tips: ['✓ Match the color shown', '✓ Tap the matching button', '🎨 Colors appear fast!'], demo: 'color-match' },
      35: { tips: ['✓ When target appears, TAP!', '✓ Fastest time wins', '🎯 Milliseconds matter'], demo: 'target-tap' },
      36: { tips: ['✓ Shapes fall from above', '✓ Catch the right shape', '🔷 Avoid wrong shapes'], demo: 'falling' },
      37: { tips: ['✓ Follow the arrow direction', '✓ Swipe that way quickly', '➡️ Left, Right, Up, Down'], demo: 'arrow' },
      38: { tips: ['✓ Stop timer at exact moment', '✓ Hit the target zone', '⏱ Precision timing!'], demo: 'stop' },
      39: { tips: ['✓ Tap when colors match', '✓ Don\'t tap on different colors', '🎨 Watch carefully!'], demo: 'dual-color' },
      40: { tips: ['✓ Quick fire questions', '✓ Answer before time runs out', '⚡ Think fast!'], demo: 'rapid' },
      // Words Games
      41: { tips: ['✓ Type the word shown', '✓ Speed and accuracy count', '⌨️ Typos lose points'], demo: 'type' },
      42: { tips: ['✓ Find words in the grid', '✓ Swipe to select', '🔤 Words hide everywhere'], demo: 'word-search' },
      43: { tips: ['✓ Unscramble the letters', '✓ Find the hidden word', '🔀 Think fast!'], demo: 'scramble' },
      44: { tips: ['✓ Type word starting with letter', '✓ Any valid word works', '🔤 A, B, C...'], demo: 'first-letter' },
      45: { tips: ['✓ Fill in the missing letter', '✓ Complete the word', '_at = Cat!'], demo: 'missing-letter' },
      46: { tips: ['✓ Find the rhyming word', '✓ Cat rhymes with Hat!', '🎵 Listen to the sound'], demo: 'rhyme' },
      47: { tips: ['✓ Find the opposite word', '✓ Hot → Cold', '↔️ Antonyms only'], demo: 'opposite' },
      48: { tips: ['✓ Is it spelled correctly?', '✓ Yes or No?', '📝 Spot the errors'], demo: 'spell-check' },
      49: { tips: ['✓ Make words from letters', '✓ Longer words = more points', '🔤 Use all letters!'], demo: 'anagram' },
      50: { tips: ['✓ Guess the word from hint', '✓ Limited guesses', '💭 Think carefully!'], demo: 'guess-word' },
      // Visual Games
      51: { tips: ['✓ Find the odd one out', '✓ One item is different', '👁️ Look closely!'], demo: 'odd-one' },
      52: { tips: ['✓ Count items by color', '✓ Enter the count', '🔴🔵🟢 Quick counting!'], demo: 'count-color' },
      53: { tips: ['✓ Find the hidden shape', '✓ Tap when you see it', '🔷 Shapes blend in'], demo: 'find-shape' },
      54: { tips: ['✓ Find the matching pair', '✓ Two items are the same', '👯 Quick matching!'], demo: 'same' },
      55: { tips: ['✓ Spot all differences', '✓ Two images, find changes', '🔍 5 differences total'], demo: 'spot-diff' },
      56: { tips: ['✓ Track the moving ball', '✓ Which cup has it?', '👁️ Don\'t lose sight!'], demo: 'track' },
      57: { tips: ['✓ Find the hidden object', '✓ It\'s camouflaged', '🔍 Look carefully!'], demo: 'hidden' },
      58: { tips: ['✓ Match the silhouette', '✓ Find the right shape', '⬛ Shadows only!'], demo: 'shadow' },
      59: { tips: ['✓ Complete the pattern', '✓ What comes next?', '🔷 Logic required!'], demo: 'complete' },
      60: { tips: ['✓ Count overlapping shapes', '✓ Some are hidden', '🔢 Tricky counting!'], demo: 'overlap' }
    };
    
    return instructions[game.id] || { tips: ['✓ Follow the instructions', '✓ Score as high as you can', '⏱ 60 seconds'], demo: 'default' };
  },
  
  // Render only UNLOCKED games - keep locked games a surprise!
  renderGamesGrid: () => {
    const grid = document.getElementById('games-grid');
    grid.innerHTML = '';
    
    // Check if premium user
    const isPremium = localStorage.getItem('streakrush_premium') === 'true';
    
    // Only show unlocked games (first 10 for free, all 60 for premium)
    const maxGames = isPremium ? 60 : 10;
    
    GAMES.slice(0, maxGames).forEach(game => {
      const card = document.createElement('div');
      card.className = `game-card category-${game.category}`;
      card.dataset.gameId = game.id;
      
      card.innerHTML = `
        <span class="game-icon">${game.icon}</span>
        <span class="game-name">${game.name}</span>
        <span class="game-category">${game.category}</span>
      `;
      
      card.addEventListener('click', () => {
        Sounds.click();
        App.selectGame(game);
      });
      grid.appendChild(card);
    });
    
    // If not premium, add "Unlock More" card
    if (!isPremium) {
      const unlockCard = document.createElement('div');
      unlockCard.className = 'game-card unlock-more-card';
      unlockCard.innerHTML = `
        <span class="game-icon">👑</span>
        <span class="game-name">50 More Games!</span>
        <span class="game-category">GO PREMIUM</span>
      `;
      unlockCard.addEventListener('click', () => {
        Sounds.click();
        App.showPremiumModal();
      });
      grid.appendChild(unlockCard);
    }
  },
  
  // Update games remaining display
  updateGamesRemaining: () => {
    const banner = document.getElementById('games-remaining-banner');
    const countEl = document.getElementById('games-remaining-count');
    const timerEl = document.getElementById('games-timer');
    const metaEl = document.getElementById('games-left-meta');
    
    if (GameLimit.isUnlocked()) {
      banner.classList.add('unlimited');
      countEl.textContent = '∞';
      timerEl.textContent = 'UNLIMITED';
      if (metaEl) metaEl.textContent = '∞';
    } else {
      banner.classList.remove('unlimited');
      const remaining = GameLimit.getRemainingGames();
      countEl.textContent = remaining;
      timerEl.textContent = `Resets in ${GameLimit.formatTimeUntilReset()}`;
      if (metaEl) metaEl.textContent = remaining;
    }
  },
  
  // Start timer update interval
  startTimerUpdate: () => {
    setInterval(() => {
      App.updateGamesRemaining();
    }, 60000);
  },
  
  // Select a game to play
  selectGame: (game) => {
    if (!GameLimit.canPlayMore()) {
      App.showUnlockModal(game.id);
      return;
    }
    
    App.selectedGame = game;
    
    document.getElementById('games-grid').style.display = 'none';
    document.getElementById('games-remaining-banner').style.display = 'none';
    
    const card = document.getElementById('selected-game-card');
    card.style.display = 'block';
    
    document.getElementById('selected-game-icon').textContent = game.icon;
    document.getElementById('challenge-title').textContent = game.name;
    document.getElementById('challenge-description').textContent = game.instruction;
    
    const user = Storage.getUser();
    const bestScore = user.personalBests?.[`game-${game.id}`] || '---';
    document.getElementById('personal-best').textContent = bestScore;
    
    App.updateGamesRemaining();
  },
  
  // Back to games grid
  backToGames: () => {
    App.selectedGame = null;
    document.getElementById('games-grid').style.display = 'grid';
    document.getElementById('games-remaining-banner').style.display = 'flex';
    document.getElementById('selected-game-card').style.display = 'none';
  },
  
  // Show instructions before game
  showGameInstructions: (game) => {
    const instructions = App.getGameInstructions(game);
    
    document.getElementById('instructions-icon').textContent = game.icon;
    document.getElementById('instructions-title').textContent = `How to Play: ${game.name}`;
    document.getElementById('instructions-text').textContent = game.instruction;
    
    // Populate tips
    const tipsList = document.getElementById('instructions-tips');
    tipsList.innerHTML = instructions.tips.map(tip => `<li>${tip}</li>`).join('');
    
    // Add demo animation
    const demoArea = document.getElementById('instructions-demo');
    demoArea.innerHTML = '<div class="demo-target"></div>';
    
    UI.showScreen('instructions');
  },
  
  // Start game after instructions
  startGameAfterInstructions: () => {
    if (!App.selectedGame) return;
    Sounds.click();
    Game.startSimpleGame(App.selectedGame);
  },
  
  // Show premium subscription modal
  showPremiumModal: () => {
    document.getElementById('unlock-modal').classList.add('active');
  },

  // Close unlock modal
  closeUnlockModal: () => {
    document.getElementById('unlock-modal').classList.remove('active');
  },

  // Handle premium purchase
  handlePremiumPurchase: () => {
    UI.showToast('Payment of $19.99 coming soon!', 'default');
    
    // Uncomment to test premium unlock:
    // localStorage.setItem('streakrush_premium', 'true');
    // App.closeUnlockModal();
    // App.renderGamesGrid();
    // UI.showToast('🎉 Welcome to Premium! All 60 games unlocked!', 'success');
  },
  
  // Update theme buttons
  updateThemeButtons: () => {
    document.querySelectorAll('.theme-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.theme === Themes.current);
    });
  },
  
  // Setup all event listeners
  setupEventListeners: () => {
    // Navigation buttons
    document.querySelectorAll('.nav-item').forEach(btn => {
      btn.addEventListener('click', () => {
        Sounds.click();
        const screen = btn.dataset.screen;
        App.navigateTo(screen);
      });
    });
    
    // Back to games button
    document.getElementById('back-to-games')?.addEventListener('click', () => {
      Sounds.click();
      App.backToGames();
    });
    
    // Play button - show instructions first
    document.getElementById('play-button').addEventListener('click', () => {
      if (!App.selectedGame) return;
      Sounds.click();
      
      // Check if premium or has games left
      const isPremium = localStorage.getItem('streakrush_premium') === 'true';
      if (!isPremium && !GameLimit.canPlayMore()) {
        App.showPremiumModal();
        return;
      }
      
      // Check if should show instructions
      const playedGames = JSON.parse(localStorage.getItem('streakrush_played_games') || '[]');
      if (!playedGames.includes(App.selectedGame.id)) {
        App.showGameInstructions(App.selectedGame);
      } else {
        Game.startSimpleGame(App.selectedGame);
      }
    });
    
    // Instructions screen buttons
    document.getElementById('skip-instructions')?.addEventListener('click', () => {
      if (!App.selectedGame) return;
      const gameId = App.selectedGame.id; // Store before async call
      App.startGameAfterInstructions();
      // Mark as played
      const playedGames = JSON.parse(localStorage.getItem('streakrush_played_games') || '[]');
      if (!playedGames.includes(gameId)) {
        playedGames.push(gameId);
        localStorage.setItem('streakrush_played_games', JSON.stringify(playedGames));
      }
    });
    
    document.getElementById('ready-button')?.addEventListener('click', () => {
      if (!App.selectedGame) return;
      const gameId = App.selectedGame.id; // Store before async call
      App.startGameAfterInstructions();
      // Mark as played
      const playedGames = JSON.parse(localStorage.getItem('streakrush_played_games') || '[]');
      if (!playedGames.includes(gameId)) {
        playedGames.push(gameId);
        localStorage.setItem('streakrush_played_games', JSON.stringify(playedGames));
      }
    });
    
    // Pause button
    document.getElementById('pause-button').addEventListener('click', () => {
      Sounds.click();
      Game.pause();
    });
    
    // Resume button
    document.getElementById('resume-button').addEventListener('click', () => {
      Sounds.click();
      Game.resume();
    });
    
    // Quit button
    document.getElementById('quit-button').addEventListener('click', () => {
      Sounds.click();
      Game.quit();
    });
    
    // Results screen buttons
    document.getElementById('spin-wheel-button').addEventListener('click', () => {
      Sounds.click();
      UI.showWheelModal();
    });
    
    document.getElementById('share-button').addEventListener('click', () => {
      Sounds.click();
      UI.shareScore();
    });
    
    document.getElementById('challenge-friend-button').addEventListener('click', () => {
      Sounds.click();
      UI.shareScore();
    });
    
    document.getElementById('play-again-button').addEventListener('click', () => {
      Sounds.click();
      const isPremium = localStorage.getItem('streakrush_premium') === 'true';
      if (!isPremium && !GameLimit.canPlayMore()) {
        App.showPremiumModal();
        return;
      }
      if (App.selectedGame) {
        Game.startSimpleGame(App.selectedGame);
      }
    });
    
    document.getElementById('back-home-button').addEventListener('click', () => {
      Sounds.click();
      App.backToGames();
      UI.showScreen('home');
      App.updateGamesRemaining();
    });
    
    // Streak modal buttons
    document.getElementById('streak-play-button').addEventListener('click', () => {
      Sounds.click();
      UI.hideStreakLossModal();
    });
    
    document.getElementById('buy-freeze-button').addEventListener('click', () => {
      Sounds.click();
      UI.showToast('Coming soon!', 'default');
    });
    
    // Premium modal buttons
    document.getElementById('unlock-premium-button')?.addEventListener('click', () => {
      Sounds.click();
      App.handlePremiumPurchase();
    });
    
    document.getElementById('close-unlock-modal')?.addEventListener('click', () => {
      Sounds.click();
      App.closeUnlockModal();
    });
    
    // Wheel modal
    document.getElementById('spin-button').addEventListener('click', () => {
      Sounds.click();
      UI.spinWheel();
    });
    
    document.getElementById('close-wheel').addEventListener('click', () => {
      Sounds.click();
      UI.closeWheelModal();
    });
    
    // Leaderboard tabs
    document.querySelectorAll('.tab-button').forEach(tab => {
      tab.addEventListener('click', () => {
        Sounds.click();
        document.querySelectorAll('.tab-button').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        UI.updateLeaderboard(tab.dataset.tab);
      });
    });
    
    // Shop items
    document.querySelectorAll('.shop-item.coin-purchase').forEach(item => {
      item.addEventListener('click', () => {
        Sounds.click();
        const itemName = item.dataset.item;
        const cost = parseInt(item.dataset.cost);
        UI.buyItem(itemName, cost);
      });
    });
    
    // Real money shop items
    document.querySelectorAll('.shop-item:not(.coin-purchase)').forEach(item => {
      item.addEventListener('click', () => {
        Sounds.click();
        UI.showToast('Coming soon!', 'default');
      });
    });
    
    // Premium button
    document.querySelector('.premium-button')?.addEventListener('click', () => {
      Sounds.click();
      UI.showToast('Coming soon!', 'default');
    });
    
    // Profile name change
    document.getElementById('display-name')?.addEventListener('change', (e) => {
      const newName = e.target.value.trim() || 'Player';
      Storage.updateUser({ name: newName });
      UI.showToast('Name updated!', 'success');
    });
    
    // Profile buttons
    document.getElementById('invite-friends')?.addEventListener('click', () => {
      Sounds.click();
      UI.shareScore();
    });
    
    // Friends Hub button
    document.getElementById('friends-hub-button')?.addEventListener('click', () => {
      Sounds.click();
      App.navigateTo('friends-hub');
    });
    
    document.getElementById('friends-back-button')?.addEventListener('click', () => {
      Sounds.click();
      App.navigateTo('profile');
    });
    
    // Theme buttons
    document.querySelectorAll('.theme-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        Sounds.click();
        const theme = btn.dataset.theme;
        Themes.apply(theme);
        App.updateThemeButtons();
        UI.showToast(`Theme: ${Themes.themes[theme].name}`, 'success');
      });
    });
    
    // Sound toggle
    document.getElementById('sound-toggle')?.addEventListener('change', (e) => {
      Sounds.enabled = e.target.checked;
      localStorage.setItem('streakrush_sound', e.target.checked);
      if (e.target.checked) {
        Sounds.click();
      }
    });
    
    // Initialize sound toggle state
    const soundToggle = document.getElementById('sound-toggle');
    if (soundToggle) {
      soundToggle.checked = localStorage.getItem('streakrush_sound') !== 'false';
    }
    
    // Friends Hub - Join Room
    document.getElementById('join-room-button')?.addEventListener('click', () => {
      Sounds.click();
      const code = document.getElementById('join-room-code').value.toUpperCase();
      if (code.length !== 6) {
        UI.showToast('Enter a 6-character room code', 'error');
        return;
      }
      
      const user = Storage.getUser();
      const result = FriendsHub.joinRoom(code, user.name);
      
      if (result.success) {
        App.showHubLobby();
        UI.showToast('Joined room!', 'success');
      } else {
        UI.showToast(result.error, 'error');
      }
    });
    
    // Friends Hub - Create Room
    document.getElementById('create-room-button')?.addEventListener('click', () => {
      Sounds.click();
      
      if (!FriendsHub.hasAdminAccess()) {
        UI.showToast('Admin access: $30 (Coming soon)', 'default');
        return;
      }
      
      const user = Storage.getUser();
      const result = FriendsHub.createRoom(user.name);
      
      if (result.success) {
        App.showHubLobby();
        UI.showToast(`Room created: ${result.roomCode}`, 'success');
      }
    });
    
    // Copy room code
    document.getElementById('copy-code-button')?.addEventListener('click', () => {
      Sounds.click();
      const code = FriendsHub.roomCode;
      if (code && navigator.clipboard) {
        navigator.clipboard.writeText(code);
        UI.showToast('Code copied!', 'success');
      }
    });
    
    // Leave room
    document.getElementById('leave-room-button')?.addEventListener('click', () => {
      Sounds.click();
      FriendsHub.leaveRoom();
      App.showHubWelcome();
    });
    
    // Start party game
    document.getElementById('start-party-button')?.addEventListener('click', () => {
      Sounds.click();
      if (FriendsHub.startGame()) {
        App.startPartyGame();
      }
    });
    
    // Prevent default touch behaviors
    document.addEventListener('touchmove', (e) => {
      if (e.target.closest('.game-area')) {
        e.preventDefault();
      }
    }, { passive: false });
  },
  
  // Show Hub Welcome
  showHubWelcome: () => {
    document.getElementById('hub-welcome').style.display = 'block';
    document.getElementById('hub-lobby').style.display = 'none';
    document.getElementById('hub-playing').style.display = 'none';
    document.getElementById('hub-results').style.display = 'none';
    
    // Update host button based on admin access
    if (FriendsHub.hasAdminAccess()) {
      document.getElementById('admin-price-section').style.display = 'none';
      document.getElementById('host-button-text').textContent = 'CREATE ROOM';
    }
  },
  
  // Show Hub Lobby
  showHubLobby: () => {
    document.getElementById('hub-welcome').style.display = 'none';
    document.getElementById('hub-lobby').style.display = 'block';
    document.getElementById('hub-playing').style.display = 'none';
    document.getElementById('hub-results').style.display = 'none';
    
    document.getElementById('display-room-code').textContent = FriendsHub.roomCode;
    App.updatePlayersDisplay();
    
    // Update start button
    const startBtn = document.getElementById('start-party-button');
    if (FriendsHub.isAdmin) {
      startBtn.disabled = FriendsHub.players.length < 2;
      startBtn.textContent = FriendsHub.players.length < 2 ? 'WAITING FOR PLAYERS...' : 'START GAME!';
    } else {
      startBtn.textContent = 'WAITING FOR HOST...';
      startBtn.disabled = true;
    }
  },
  
  // Update players display
  updatePlayersDisplay: () => {
    const list = document.getElementById('players-list');
    document.getElementById('player-count').textContent = FriendsHub.players.length;
    
    list.innerHTML = FriendsHub.players.map(p => `
      <div class="player-item">
        <div class="player-avatar">${p.name[0]}</div>
        <span class="player-name">${p.name}</span>
        ${p.isAdmin ? '<span class="admin-badge">HOST</span>' : ''}
        <span class="player-status ${p.ready ? '' : 'waiting'}">${p.ready ? '✓ Ready' : 'Waiting...'}</span>
      </div>
    `).join('');
  },
  
  // Start party game (placeholder)
  startPartyGame: () => {
    document.getElementById('hub-lobby').style.display = 'none';
    document.getElementById('hub-playing').style.display = 'block';
    document.getElementById('round-number').textContent = FriendsHub.currentRound;
    
    // For now, show placeholder
    document.getElementById('party-game-area').innerHTML = `
      <div style="text-align: center; padding: 40px;">
        <div style="font-size: 4rem; margin-bottom: 20px;">🎮</div>
        <h2>Party Mode</h2>
        <p style="color: var(--text-secondary);">
          Multiplayer gameplay coming soon!<br>
          This feature requires a server backend.
        </p>
      </div>
    `;
  },
  
  // Navigate to a screen
  navigateTo: (screen) => {
    // Update nav buttons
    document.querySelectorAll('.nav-item').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.screen === screen);
    });
    
    // Show screen
    UI.showScreen(screen);
    
    // Update screen-specific content
    switch (screen) {
      case 'home':
        App.backToGames();
        App.renderGamesGrid();
        App.updateGamesRemaining();
        break;
      case 'leaderboard':
        UI.updateLeaderboard();
        break;
      case 'shop':
        UI.updateShop();
        break;
      case 'profile':
        UI.updateProfile();
        break;
      case 'friends-hub':
        App.showHubWelcome();
        break;
    }
  },
  
  // Register service worker for PWA
  registerServiceWorker: () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(reg => {
          console.log('Service Worker registered:', reg.scope);
        })
        .catch(err => {
          console.log('Service Worker registration failed:', err);
        });
    }
  }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
