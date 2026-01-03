// ============================================================================
// COGNIXIS - PARTY MODE UI
// ============================================================================

const PartyUI = {
  selectedGames: [],
  countdownTimer: null,
  leaderboardUpdateInterval: null,
  
  // ========================================
  // MAIN PARTY MODE SCREEN
  // ========================================
  
  showPartyMode: () => {
    const html = `
      <div class="party-mode-screen">
        <header class="party-header">
          <button class="back-btn" onclick="PartyUI.goHome()">←</button>
          <h1>🎉 Party Mode</h1>
          <div class="header-spacer"></div>
        </header>
        
        <div class="party-content">
          <div class="party-hero">
            <div class="party-icon-animated">🎮</div>
            <h2>Play Together!</h2>
            <p>Compete with friends in real-time</p>
          </div>
          
          <div class="party-features">
            <div class="feature-item">
              <span class="feature-icon">👥</span>
              <span class="feature-text">Up to 8 players</span>
            </div>
            <div class="feature-item">
              <span class="feature-icon">🎯</span>
              <span class="feature-text">5 game challenge</span>
            </div>
            <div class="feature-item">
              <span class="feature-icon">🏆</span>
              <span class="feature-text">Live leaderboard</span>
            </div>
            <div class="feature-item">
              <span class="feature-icon">⚡</span>
              <span class="feature-text">Double XP rewards</span>
            </div>
          </div>
          
          <div class="party-actions">
            <button class="create-room-btn" onclick="PartyUI.createRoom()">
              <span class="btn-icon">➕</span>
              <span class="btn-text">Create Room</span>
            </button>
            
            <button class="join-room-btn" onclick="PartyUI.showJoinRoom()">
              <span class="btn-icon">🔗</span>
              <span class="btn-text">Join Room</span>
            </button>
          </div>
          
          <div class="party-benefits">
            <h3>🎁 Party Mode Bonuses</h3>
            <ul>
              <li>🌟 Earn 2x XP when playing with friends</li>
              <li>🏅 Unlock exclusive party badges</li>
              <li>🎉 Special rewards for 3+ players</li>
            </ul>
          </div>
        </div>
      </div>
    `;
    
    document.getElementById('app').innerHTML = html;
  },
  
  // ========================================
  // CREATE ROOM
  // ========================================
  
  createRoom: async () => {
    const playerName = RoomManager.getPlayerName();
    
    PartyUI.showLoading('Creating room...');
    
    const result = await RoomManager.createRoom(playerName);
    
    PartyUI.hideLoading();
    
    if (result.success) {
      PartyUI.setupEventListeners();
      PartyUI.showRoomLobby(result.room, true);
    } else {
      PartyUI.showToast('Failed to create room', 'error');
    }
  },
  
  // ========================================
  // JOIN ROOM SCREEN
  // ========================================
  
  showJoinRoom: (prefilledCode = '') => {
    const playerName = RoomManager.getPlayerName();
    
    const html = `
      <div class="join-room-screen">
        <header class="party-header">
          <button class="back-btn" onclick="PartyUI.showPartyMode()">←</button>
          <h1>Join Room</h1>
          <div class="header-spacer"></div>
        </header>
        
        <div class="join-content">
          <div class="code-input-section">
            <label>Enter 4-Digit Room Code</label>
            <div class="code-input-grid">
              <input type="tel" maxlength="1" class="code-digit" id="digit1" 
                     oninput="PartyUI.handleCodeInput(this, 'digit2')" 
                     onkeydown="PartyUI.handleCodeKeydown(event, this, null)"
                     value="${prefilledCode[0] || ''}">
              <input type="tel" maxlength="1" class="code-digit" id="digit2" 
                     oninput="PartyUI.handleCodeInput(this, 'digit3')" 
                     onkeydown="PartyUI.handleCodeKeydown(event, this, 'digit1')"
                     value="${prefilledCode[1] || ''}">
              <input type="tel" maxlength="1" class="code-digit" id="digit3" 
                     oninput="PartyUI.handleCodeInput(this, 'digit4')" 
                     onkeydown="PartyUI.handleCodeKeydown(event, this, 'digit2')"
                     value="${prefilledCode[2] || ''}">
              <input type="tel" maxlength="1" class="code-digit" id="digit4" 
                     oninput="PartyUI.checkCodeComplete()" 
                     onkeydown="PartyUI.handleCodeKeydown(event, this, 'digit3')"
                     value="${prefilledCode[3] || ''}">
            </div>
            <div class="code-error" id="code-error"></div>
          </div>
          
          <div class="player-name-section">
            <label>Your Name</label>
            <input type="text" id="player-name" class="player-name-input"
                   placeholder="Enter your name" maxlength="20" value="${playerName}">
          </div>
          
          <button class="join-btn" id="join-btn" onclick="PartyUI.joinRoom()" disabled>
            Join Party 🎉
          </button>
        </div>
      </div>
    `;
    
    document.getElementById('app').innerHTML = html;
    
    // Focus first input
    setTimeout(() => {
      document.getElementById('digit1').focus();
      PartyUI.checkCodeComplete();
    }, 100);
  },
  
  handleCodeInput: (current, nextId) => {
    if (current.value.length === 1 && nextId) {
      document.getElementById(nextId).focus();
    }
    PartyUI.checkCodeComplete();
  },
  
  handleCodeKeydown: (event, current, prevId) => {
    if (event.key === 'Backspace' && current.value === '' && prevId) {
      document.getElementById(prevId).focus();
    }
  },
  
  checkCodeComplete: () => {
    const code = PartyUI.getCodeFromInputs();
    const joinBtn = document.getElementById('join-btn');
    if (joinBtn) {
      joinBtn.disabled = code.length !== 4;
    }
  },
  
  getCodeFromInputs: () => {
    return ['digit1', 'digit2', 'digit3', 'digit4']
      .map(id => document.getElementById(id)?.value || '')
      .join('');
  },
  
  joinRoom: async () => {
    const code = PartyUI.getCodeFromInputs();
    const playerName = document.getElementById('player-name').value.trim() || 'Player';
    
    if (code.length !== 4) {
      PartyUI.showCodeError('Please enter a 4-digit code');
      return;
    }
    
    PartyUI.showLoading('Joining room...');
    
    const result = await RoomManager.joinRoom(code, playerName);
    
    PartyUI.hideLoading();
    
    if (result.success) {
      PartyUI.setupEventListeners();
      PartyUI.showRoomLobby(result.room, false);
    } else {
      PartyUI.showCodeError(result.error);
    }
  },
  
  showCodeError: (message) => {
    const errorEl = document.getElementById('code-error');
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.style.display = 'block';
    }
  },
  
  // ========================================
  // ROOM LOBBY
  // ========================================
  
  showRoomLobby: (room, isHost) => {
    PartyUI.selectedGames = room.selectedGames || [];
    
    const html = `
      <div class="room-lobby">
        <header class="lobby-header">
          <button class="leave-btn" onclick="PartyUI.leaveRoom()">← Leave</button>
          <div class="room-code-display">
            <span class="code-label">Room Code</span>
            <div class="room-code">${room.code}</div>
          </div>
          <button class="copy-code-btn" onclick="PartyUI.copyRoomCode('${room.code}')">📋</button>
        </header>
        
        <div class="lobby-content">
          <!-- Players Section -->
          <div class="players-section">
            <h3>Players <span class="player-count">${room.players.length}/${room.maxPlayers}</span></h3>
            <div class="players-grid" id="players-grid">
              ${PartyUI.renderPlayersGrid(room)}
            </div>
          </div>
          
          ${isHost ? PartyUI.renderHostControls(room) : PartyUI.renderGuestWaiting(room)}
          
          <!-- Invite Section -->
          <div class="invite-section">
            <h4>📱 Invite Friends</h4>
            <div class="invite-buttons">
              <button class="invite-btn" onclick="PartyUI.shareInvite('${room.code}')">
                Share Link
              </button>
            </div>
          </div>
        </div>
        
        ${isHost ? `
          <div class="lobby-footer">
            <button class="start-party-btn" id="start-party-btn" 
                    onclick="PartyUI.startParty()" 
                    ${PartyUI.selectedGames.length === 5 && room.players.length >= 1 ? '' : 'disabled'}>
              🎉 Start Party
            </button>
          </div>
        ` : ''}
      </div>
    `;
    
    document.getElementById('app').innerHTML = html;
  },
  
  renderPlayersGrid: (room) => {
    let html = room.players.map(player => `
      <div class="player-card ${player.isHost ? 'host' : ''} ${player.isReady ? 'ready' : ''}">
        <div class="player-avatar">${player.avatar}</div>
        <div class="player-name">${player.name}</div>
        ${player.isHost ? '<div class="host-badge">👑</div>' : ''}
        ${!player.isHost && player.isReady ? '<div class="ready-badge">✓</div>' : ''}
      </div>
    `).join('');
    
    // Add empty slots
    const emptySlots = room.maxPlayers - room.players.length;
    for (let i = 0; i < Math.min(emptySlots, 4); i++) {
      html += `
        <div class="player-card empty">
          <div class="player-avatar">👤</div>
          <div class="player-name">Waiting...</div>
        </div>
      `;
    }
    
    return html;
  },
  
  renderHostControls: (room) => {
    const availableGames = typeof GAMES !== 'undefined' ? GAMES.slice(0, 15) : [];
    
    return `
      <div class="game-selection-section">
        <h3>Select 5 Games</h3>
        <div class="selected-count">
          <span id="selected-count">${PartyUI.selectedGames.length}</span> / 5 selected
        </div>
        <div class="games-grid" id="game-selection-grid">
          ${availableGames.map(game => `
            <div class="game-select-card ${PartyUI.selectedGames.includes(game.id) ? 'selected' : ''}" 
                 onclick="PartyUI.toggleGameSelection(${game.id})" 
                 data-game-id="${game.id}">
              <div class="game-icon">${game.icon}</div>
              <div class="game-name">${game.name}</div>
              <div class="selection-check">✓</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },
  
  renderGuestWaiting: (room) => {
    const currentPlayer = RoomManager.getCurrentPlayer();
    const isReady = currentPlayer?.isReady || false;
    
    return `
      <div class="waiting-section">
        <div class="waiting-content">
          <div class="waiting-icon">⏳</div>
          <p>Waiting for host to select games...</p>
          
          ${!isReady ? `
            <button class="ready-btn" onclick="PartyUI.toggleReady()">
              I'm Ready! ✓
            </button>
          ` : `
            <div class="ready-status">
              <span class="ready-check">✓</span> You're ready!
            </div>
          `}
        </div>
      </div>
    `;
  },
  
  toggleGameSelection: async (gameId) => {
    const card = document.querySelector(`[data-game-id="${gameId}"]`);
    
    if (PartyUI.selectedGames.includes(gameId)) {
      // Deselect
      PartyUI.selectedGames = PartyUI.selectedGames.filter(id => id !== gameId);
      card?.classList.remove('selected');
    } else {
      // Select (max 5)
      if (PartyUI.selectedGames.length >= 5) {
        PartyUI.showToast('Maximum 5 games', 'info');
        return;
      }
      PartyUI.selectedGames.push(gameId);
      card?.classList.add('selected');
    }
    
    // Update count
    const countEl = document.getElementById('selected-count');
    if (countEl) countEl.textContent = PartyUI.selectedGames.length;
    
    // Update start button
    const startBtn = document.getElementById('start-party-btn');
    if (startBtn) {
      startBtn.disabled = PartyUI.selectedGames.length !== 5;
    }
    
    // Save selection to room
    if (PartyUI.selectedGames.length > 0) {
      await RoomManager.selectGames(PartyUI.selectedGames);
    }
  },
  
  toggleReady: async () => {
    const isReady = await RoomManager.toggleReady();
    
    // Refresh lobby
    if (RoomManager.currentRoom) {
      PartyUI.showRoomLobby(RoomManager.currentRoom, RoomManager.isHost);
    }
  },
  
  startParty: async () => {
    if (PartyUI.selectedGames.length !== 5) {
      PartyUI.showToast('Select 5 games first', 'error');
      return;
    }
    
    await RoomManager.selectGames(PartyUI.selectedGames);
    const result = await RoomManager.startParty();
    
    if (result.success) {
      PartyUI.showCountdown();
    } else {
      PartyUI.showToast(result.error, 'error');
    }
  },
  
  // ========================================
  // COUNTDOWN
  // ========================================
  
  showCountdown: () => {
    const room = RoomManager.currentRoom;
    const currentGame = room?.selectedGames?.[room.currentGameIndex];
    const game = RoomManager.getGame(currentGame);
    
    let count = 3;
    
    const html = `
      <div class="countdown-screen">
        <div class="game-preview">
          <div class="game-number">Game ${(room?.currentGameIndex || 0) + 1} of 5</div>
          <div class="game-preview-icon">${game?.icon || '🎮'}</div>
          <div class="game-preview-name">${game?.name || 'Game'}</div>
        </div>
        <div class="countdown-number" id="countdown-number">${count}</div>
        <div class="countdown-text">Get Ready!</div>
      </div>
    `;
    
    document.getElementById('app').innerHTML = html;
    
    if (typeof Sounds !== 'undefined' && Sounds.click) {
      Sounds.click();
    }
    
    PartyUI.countdownTimer = setInterval(() => {
      count--;
      
      const numEl = document.getElementById('countdown-number');
      
      if (count > 0) {
        if (numEl) {
          numEl.textContent = count;
          numEl.classList.add('pulse');
          setTimeout(() => numEl.classList.remove('pulse'), 300);
        }
        if (typeof Sounds !== 'undefined' && Sounds.click) {
          Sounds.click();
        }
      } else {
        clearInterval(PartyUI.countdownTimer);
        if (numEl) {
          numEl.textContent = 'GO!';
          numEl.style.color = '#06d6a0';
        }
        if (typeof Sounds !== 'undefined' && Sounds.correct) {
          Sounds.correct();
        }
        
        setTimeout(() => {
          PartyUI.startMultiplayerGame();
        }, 800);
      }
    }, 1000);
  },
  
  // ========================================
  // MULTIPLAYER GAME
  // ========================================
  
  startMultiplayerGame: async () => {
    await RoomManager.setGamePlaying();
    
    const room = RoomManager.currentRoom;
    const currentGameId = room?.currentGame;
    const game = RoomManager.getGame(currentGameId);
    
    if (!game) {
      PartyUI.showToast('Game not found', 'error');
      return;
    }
    
    // Use the regular game system but in party mode
    if (typeof Game !== 'undefined' && Game.startGame) {
      // Set party mode flag
      window.isPartyMode = true;
      window.partyGameCallback = PartyUI.onGameComplete;
      
      // Start the game
      Game.startGame(game);
    } else {
      console.error('[PartyUI] Game system not found');
    }
    
    // Start leaderboard updates
    PartyUI.startLeaderboardUpdates();
  },
  
  onGameComplete: async (scoreData) => {
    window.isPartyMode = false;
    
    // Submit score to room
    await RoomManager.submitScore(
      scoreData.score || 0,
      scoreData.percentage || 0,
      scoreData.correctAnswers || 0,
      scoreData.totalQuestions || 0
    );
    
    // Stop leaderboard updates
    PartyUI.stopLeaderboardUpdates();
    
    // Show waiting for others or results
    PartyUI.showGameResults();
  },
  
  // ========================================
  // GAME RESULTS (between games)
  // ========================================
  
  showGameResults: () => {
    const room = RoomManager.currentRoom;
    const currentGameId = room?.currentGame;
    const gameScores = room?.scores?.[currentGameId] || {};
    const game = RoomManager.getGame(currentGameId);
    
    // Sort players by score
    const rankings = room.players
      .map(player => ({
        ...player,
        ...gameScores[player.id],
        finished: !!gameScores[player.id]
      }))
      .sort((a, b) => (b.score || 0) - (a.score || 0));
    
    const allFinished = rankings.every(p => p.finished);
    
    const html = `
      <div class="game-results-screen">
        <div class="results-header">
          <div class="game-info">
            <span class="game-icon">${game?.icon || '🎮'}</span>
            <span class="game-name">${game?.name || 'Game'}</span>
          </div>
          <div class="game-progress">Game ${(room?.currentGameIndex || 0) + 1} of 5</div>
        </div>
        
        <div class="results-content">
          <h2>${allFinished ? '🏆 Results' : '⏳ Waiting for others...'}</h2>
          
          <div class="mini-rankings">
            ${rankings.map((player, index) => `
              <div class="ranking-row ${player.finished ? 'finished' : 'waiting'} ${player.id === RoomManager.playerId ? 'you' : ''}">
                <div class="rank">${player.finished ? (index + 1) : '⏳'}</div>
                <div class="player-info">
                  <span class="avatar">${player.avatar}</span>
                  <span class="name">${player.name}${player.id === RoomManager.playerId ? ' (You)' : ''}</span>
                </div>
                <div class="score-info">
                  ${player.finished ? `
                    <span class="score">${player.score || 0}</span>
                    <span class="percentage">${player.percentage || 0}%</span>
                  ` : '<span class="playing">Playing...</span>'}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
        
        ${allFinished && RoomManager.isHost ? `
          <div class="results-footer">
            <button class="next-game-btn" onclick="PartyUI.goToNextGame()">
              ${(room?.currentGameIndex || 0) < 4 ? 'Next Game →' : 'See Final Results 🏆'}
            </button>
          </div>
        ` : ''}
      </div>
    `;
    
    document.getElementById('app').innerHTML = html;
  },
  
  goToNextGame: async () => {
    const result = await RoomManager.nextGame();
    
    if (result.finished) {
      PartyUI.showFinalResults();
    } else {
      // Countdown will be triggered by status change
    }
  },
  
  // ========================================
  // FINAL RESULTS
  // ========================================
  
  showFinalResults: () => {
    const rankings = RoomManager.calculateFinalRankings();
    const winner = rankings[0];
    const room = RoomManager.currentRoom;
    
    const html = `
      <div class="final-results-screen">
        <div class="confetti-container" id="confetti"></div>
        
        <div class="winner-section">
          <div class="trophy">🏆</div>
          <h1>Winner!</h1>
          <div class="winner-card">
            <div class="winner-avatar">${winner?.avatar || '🎮'}</div>
            <div class="winner-name">${winner?.name || 'Player'}</div>
            <div class="winner-score">${winner?.totalScore || 0} points</div>
            <div class="games-won">${winner?.gamesWon || 0} games won</div>
          </div>
        </div>
        
        <div class="final-rankings">
          <h2>Final Standings</h2>
          ${rankings.map((player, index) => `
            <div class="final-rank-row rank-${index + 1} ${player.playerId === RoomManager.playerId ? 'you' : ''}">
              <div class="rank-badge">
                ${index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
              </div>
              <div class="player-details">
                <span class="avatar">${player.avatar}</span>
                <span class="name">${player.name}${player.playerId === RoomManager.playerId ? ' (You)' : ''}</span>
              </div>
              <div class="player-stats">
                <div class="total-score">${player.totalScore}</div>
                <div class="avg-percentage">${player.averagePercentage}% avg</div>
              </div>
            </div>
          `).join('')}
        </div>
        
        <div class="party-summary">
          <div class="summary-item">
            <span class="summary-value">${room?.players?.length || 0}</span>
            <span class="summary-label">Players</span>
          </div>
          <div class="summary-item">
            <span class="summary-value">5</span>
            <span class="summary-label">Games</span>
          </div>
          <div class="summary-item">
            <span class="summary-value">+${RoomManager.calculatePartyXP()}</span>
            <span class="summary-label">XP</span>
          </div>
        </div>
        
        <div class="results-actions">
          <button class="share-btn" onclick="PartyUI.shareResults()">
            📱 Share Results
          </button>
          <button class="play-again-btn" onclick="PartyUI.playAgain()">
            🔄 Play Again
          </button>
          <button class="home-btn" onclick="PartyUI.goHome()">
            🏠 Home
          </button>
        </div>
      </div>
    `;
    
    document.getElementById('app').innerHTML = html;
    
    // Trigger confetti
    PartyUI.showConfetti();
    
    // Play victory sound
    if (typeof Sounds !== 'undefined' && Sounds.levelUp) {
      Sounds.levelUp();
    }
  },
  
  showConfetti: () => {
    const container = document.getElementById('confetti');
    if (!container) return;
    
    const colors = ['#ff6b35', '#f72585', '#00d4ff', '#06d6a0', '#ffd700'];
    
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti-piece';
      confetti.style.cssText = `
        left: ${Math.random() * 100}%;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        animation-delay: ${Math.random() * 2}s;
        animation-duration: ${2 + Math.random() * 2}s;
      `;
      container.appendChild(confetti);
    }
  },
  
  // ========================================
  // SHARING & SOCIAL
  // ========================================
  
  copyRoomCode: (code) => {
    navigator.clipboard.writeText(code);
    PartyUI.showToast('Code copied! 📋', 'success');
  },
  
  shareInvite: (code) => {
    const url = `${window.location.origin}${window.location.pathname}?party=${code}`;
    const text = `🎉 Join my CogniXis party!\n\nRoom Code: ${code}\n${url}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Join my CogniXis Party!',
        text: text,
        url: url
      });
    } else {
      navigator.clipboard.writeText(text);
      PartyUI.showToast('Invite copied! 📋', 'success');
    }
  },
  
  shareResults: () => {
    const rankings = RoomManager.calculateFinalRankings();
    const winner = rankings[0];
    
    const text = `🏆 ${winner?.name || 'Player'} won our CogniXis party with ${winner?.totalScore || 0} points!\n\n` +
                 `Play brain games with friends at CogniXis!`;
    
    if (navigator.share) {
      navigator.share({
        title: 'CogniXis Party Results',
        text: text
      });
    } else {
      navigator.clipboard.writeText(text);
      PartyUI.showToast('Results copied! 📋', 'success');
    }
  },
  
  // ========================================
  // ACTIONS
  // ========================================
  
  leaveRoom: async () => {
    await RoomManager.leaveRoom();
    PartyUI.showPartyMode();
  },
  
  playAgain: async () => {
    if (RoomManager.isHost && RoomManager.currentRoom) {
      RoomManager.currentRoom.status = 'waiting';
      RoomManager.currentRoom.currentGameIndex = 0;
      RoomManager.currentRoom.selectedGames = [];
      RoomManager.currentRoom.scores = {};
      RoomManager.currentRoom.gameResults = [];
      
      // Reset player ready states
      RoomManager.currentRoom.players.forEach(p => {
        if (!p.isHost) p.isReady = false;
      });
      
      await RoomManager.updateRoom(RoomManager.currentRoom);
      PartyUI.selectedGames = [];
      PartyUI.showRoomLobby(RoomManager.currentRoom, true);
    } else {
      PartyUI.showPartyMode();
    }
  },
  
  goHome: () => {
    if (RoomManager.currentRoom) {
      RoomManager.leaveRoom();
    }
    if (typeof App !== 'undefined' && App.renderHomeScreen) {
      App.renderHomeScreen();
    }
  },
  
  // ========================================
  // EVENT LISTENERS
  // ========================================
  
  setupEventListeners: () => {
    RoomManager.on('statusChanged', PartyUI.handleStatusChange);
    RoomManager.on('playersChanged', PartyUI.handlePlayersChanged);
    RoomManager.on('roomUpdated', PartyUI.handleRoomUpdated);
    RoomManager.on('allPlayersFinished', PartyUI.handleAllPlayersFinished);
    RoomManager.on('partyFinished', PartyUI.showFinalResults);
  },
  
  handleStatusChange: ({ status, oldStatus }) => {
    console.log('[PartyUI] Status changed:', oldStatus, '->', status);
    
    switch (status) {
      case 'countdown':
        PartyUI.showCountdown();
        break;
      case 'playing':
        // Game starts automatically
        break;
      case 'results':
        PartyUI.showGameResults();
        break;
      case 'finished':
        PartyUI.showFinalResults();
        break;
    }
  },
  
  handlePlayersChanged: ({ players }) => {
    const grid = document.getElementById('players-grid');
    if (grid && RoomManager.currentRoom) {
      grid.innerHTML = PartyUI.renderPlayersGrid(RoomManager.currentRoom);
    }
  },
  
  handleRoomUpdated: ({ room }) => {
    // Update UI elements if needed
  },
  
  handleAllPlayersFinished: ({ gameId }) => {
    PartyUI.showGameResults();
  },
  
  // ========================================
  // LEADERBOARD UPDATES
  // ========================================
  
  startLeaderboardUpdates: () => {
    // Could add mini-leaderboard during gameplay
  },
  
  stopLeaderboardUpdates: () => {
    if (PartyUI.leaderboardUpdateInterval) {
      clearInterval(PartyUI.leaderboardUpdateInterval);
    }
  },
  
  // ========================================
  // UTILITIES
  // ========================================
  
  showLoading: (message = 'Loading...') => {
    const overlay = document.createElement('div');
    overlay.id = 'party-loading';
    overlay.className = 'loading-overlay';
    overlay.innerHTML = `
      <div class="loading-content">
        <div class="loading-spinner"></div>
        <div class="loading-text">${message}</div>
      </div>
    `;
    document.body.appendChild(overlay);
  },
  
  hideLoading: () => {
    const overlay = document.getElementById('party-loading');
    if (overlay) overlay.remove();
  },
  
  showToast: (message, type = 'info') => {
    const existing = document.querySelector('.party-toast');
    if (existing) existing.remove();
    
    const toast = document.createElement('div');
    toast.className = `party-toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  },
  
  // Check for party invite in URL
  checkPartyInvite: () => {
    const urlParams = new URLSearchParams(window.location.search);
    const partyCode = urlParams.get('party');
    
    if (partyCode) {
      PartyUI.showJoinRoom(partyCode);
      // Clear the URL parameter
      window.history.replaceState({}, document.title, window.location.pathname);
      return true;
    }
    return false;
  }
};

// Make available globally
if (typeof window !== 'undefined') {
  window.PartyUI = PartyUI;
}

