// ============================================================================
// STREAKRUSH - ROOM MANAGER (Multiplayer Party Mode)
// ============================================================================

const RoomManager = {
  currentRoom: null,
  isHost: false,
  roomCode: null,
  playerId: null,
  scores: {},
  updateInterval: null,
  listeners: {},
  
  // ========================================
  // ROOM CREATION & JOINING
  // ========================================
  
  // Generate unique 4-digit room code (avoiding confusing chars)
  generateRoomCode: () => {
    const validDigits = '23456789';
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += validDigits[Math.floor(Math.random() * validDigits.length)];
    }
    return code;
  },
  
  // Generate unique player ID
  generatePlayerId: () => {
    return 'player_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  },
  
  // Get random avatar
  getRandomAvatar: () => {
    const avatars = ['🦊', '🐼', '🦁', '🐯', '🐸', '🐙', '🦄', '🐲', '🦖', '🐵', '🐨', '🐰', '🐻', '🦋', '🐺'];
    return avatars[Math.floor(Math.random() * avatars.length)];
  },
  
  // Get player name from storage
  getPlayerName: () => {
    const user = Storage.getUser ? Storage.getUser() : {};
    return user.name || localStorage.getItem('streakrush_player_name') || 'Player';
  },
  
  // Create new room (HOST)
  createRoom: async (hostName) => {
    const roomCode = RoomManager.generateRoomCode();
    const playerId = RoomManager.generatePlayerId();
    
    const room = {
      code: roomCode,
      hostId: playerId,
      hostName: hostName,
      players: [{
        id: playerId,
        name: hostName,
        isHost: true,
        isReady: true,
        avatar: RoomManager.getRandomAvatar(),
        score: 0
      }],
      selectedGames: [],
      status: 'waiting', // waiting, game_selection, countdown, playing, results, finished
      currentGame: null,
      currentGameIndex: 0,
      scores: {},
      createdAt: Date.now(),
      maxPlayers: 8,
      gameResults: []
    };
    
    // Save room
    await RoomManager.saveRoom(room);
    
    RoomManager.currentRoom = room;
    RoomManager.roomCode = roomCode;
    RoomManager.playerId = playerId;
    RoomManager.isHost = true;
    RoomManager.scores = {};
    
    // Start listening for updates
    RoomManager.startListening();
    
    console.log('[RoomManager] Room created:', roomCode);
    
    return {
      success: true,
      roomCode: roomCode,
      room: room,
      playerId: playerId
    };
  },
  
  // Join existing room (GUEST)
  joinRoom: async (roomCode, playerName) => {
    // Validate room code
    if (!roomCode || roomCode.length !== 4) {
      return { success: false, error: 'Invalid room code' };
    }
    
    // Check if room exists
    const room = await RoomManager.fetchRoom(roomCode);
    
    if (!room) {
      return { success: false, error: 'Room not found. Check the code and try again.' };
    }
    
    if (room.status !== 'waiting') {
      return { success: false, error: 'Game already in progress' };
    }
    
    if (room.players.length >= room.maxPlayers) {
      return { success: false, error: 'Room is full (max 8 players)' };
    }
    
    // Create player
    const playerId = RoomManager.generatePlayerId();
    const player = {
      id: playerId,
      name: playerName,
      isHost: false,
      isReady: false,
      avatar: RoomManager.getRandomAvatar(),
      score: 0
    };
    
    // Add player to room
    room.players.push(player);
    
    // Update room
    await RoomManager.updateRoom(room);
    
    RoomManager.currentRoom = room;
    RoomManager.roomCode = roomCode;
    RoomManager.playerId = playerId;
    RoomManager.isHost = false;
    RoomManager.scores = room.scores || {};
    
    // Start listening for updates
    RoomManager.startListening();
    
    console.log('[RoomManager] Joined room:', roomCode, 'as', playerName);
    
    return {
      success: true,
      room: room,
      playerId: playerId
    };
  },
  
  // ========================================
  // GAME SELECTION & START
  // ========================================
  
  // Select games for party (HOST only)
  selectGames: async (gameIds) => {
    if (!RoomManager.isHost) {
      return { success: false, error: 'Only host can select games' };
    }
    
    if (gameIds.length !== 5) {
      return { success: false, error: 'Must select exactly 5 games' };
    }
    
    RoomManager.currentRoom.selectedGames = gameIds;
    await RoomManager.updateRoom(RoomManager.currentRoom);
    
    console.log('[RoomManager] Games selected:', gameIds);
    
    return { success: true };
  },
  
  // Toggle player ready status
  toggleReady: async () => {
    const player = RoomManager.currentRoom.players.find(p => p.id === RoomManager.playerId);
    if (player) {
      player.isReady = !player.isReady;
      await RoomManager.updateRoom(RoomManager.currentRoom);
      return player.isReady;
    }
    return false;
  },
  
  // Check if all players are ready
  allPlayersReady: () => {
    return RoomManager.currentRoom.players.every(p => p.isReady || p.isHost);
  },
  
  // Start party (HOST only)
  startParty: async () => {
    if (!RoomManager.isHost) {
      return { success: false, error: 'Only host can start party' };
    }
    
    if (RoomManager.currentRoom.selectedGames.length !== 5) {
      return { success: false, error: 'Must select 5 games first' };
    }
    
    if (!RoomManager.allPlayersReady()) {
      return { success: false, error: 'Not all players are ready' };
    }
    
    RoomManager.currentRoom.status = 'countdown';
    RoomManager.currentRoom.currentGameIndex = 0;
    RoomManager.currentRoom.currentGame = RoomManager.currentRoom.selectedGames[0];
    RoomManager.currentRoom.gameResults = [];
    
    // Initialize scores
    RoomManager.currentRoom.scores = {};
    RoomManager.currentRoom.selectedGames.forEach(gameId => {
      RoomManager.currentRoom.scores[gameId] = {};
    });
    
    await RoomManager.updateRoom(RoomManager.currentRoom);
    
    console.log('[RoomManager] Party started!');
    
    return { success: true };
  },
  
  // ========================================
  // SCORE MANAGEMENT
  // ========================================
  
  // Submit score for current game
  submitScore: async (score, percentage, correctAnswers, totalQuestions) => {
    const gameId = RoomManager.currentRoom.currentGame;
    
    if (!RoomManager.currentRoom.scores[gameId]) {
      RoomManager.currentRoom.scores[gameId] = {};
    }
    
    RoomManager.currentRoom.scores[gameId][RoomManager.playerId] = {
      score: score,
      percentage: Math.min(100, percentage),
      correctAnswers: correctAnswers,
      totalQuestions: totalQuestions,
      timestamp: Date.now()
    };
    
    await RoomManager.updateRoom(RoomManager.currentRoom);
    
    console.log('[RoomManager] Score submitted:', score, '(', percentage, '%)');
    
    // Check if all players finished
    RoomManager.checkAllFinished();
    
    return { success: true };
  },
  
  // Check if all players finished current game
  checkAllFinished: () => {
    const gameId = RoomManager.currentRoom.currentGame;
    const gameScores = RoomManager.currentRoom.scores[gameId] || {};
    
    const allFinished = RoomManager.currentRoom.players.every(player => 
      gameScores[player.id] !== undefined
    );
    
    if (allFinished) {
      console.log('[RoomManager] All players finished game', gameId);
      RoomManager.emit('allPlayersFinished', { gameId });
      
      // Save game results
      RoomManager.saveGameResult(gameId);
    }
    
    return allFinished;
  },
  
  // Save result for current game
  saveGameResult: (gameId) => {
    const gameScores = RoomManager.currentRoom.scores[gameId] || {};
    
    // Sort players by score
    const rankings = RoomManager.currentRoom.players
      .map(player => ({
        ...player,
        ...gameScores[player.id]
      }))
      .sort((a, b) => (b.score || 0) - (a.score || 0));
    
    RoomManager.currentRoom.gameResults.push({
      gameId: gameId,
      rankings: rankings,
      winner: rankings[0]
    });
  },
  
  // ========================================
  // GAME PROGRESSION
  // ========================================
  
  // Move to next game (HOST only)
  nextGame: async () => {
    if (!RoomManager.isHost) return;
    
    RoomManager.currentRoom.currentGameIndex++;
    
    if (RoomManager.currentRoom.currentGameIndex >= RoomManager.currentRoom.selectedGames.length) {
      // Party finished!
      RoomManager.currentRoom.status = 'finished';
      await RoomManager.updateRoom(RoomManager.currentRoom);
      RoomManager.emit('partyFinished');
      return { finished: true };
    }
    
    // Set next game
    RoomManager.currentRoom.currentGame = RoomManager.currentRoom.selectedGames[RoomManager.currentRoom.currentGameIndex];
    RoomManager.currentRoom.status = 'countdown';
    
    await RoomManager.updateRoom(RoomManager.currentRoom);
    
    console.log('[RoomManager] Moving to game', RoomManager.currentRoom.currentGameIndex + 1);
    
    return { finished: false, nextGame: RoomManager.currentRoom.currentGame };
  },
  
  // Set game as playing
  setGamePlaying: async () => {
    RoomManager.currentRoom.status = 'playing';
    await RoomManager.updateRoom(RoomManager.currentRoom);
  },
  
  // Set game to results
  setGameResults: async () => {
    RoomManager.currentRoom.status = 'results';
    await RoomManager.updateRoom(RoomManager.currentRoom);
  },
  
  // ========================================
  // FINAL RANKINGS
  // ========================================
  
  // Calculate final rankings
  calculateFinalRankings: () => {
    const playerTotals = {};
    
    // Initialize totals
    RoomManager.currentRoom.players.forEach(player => {
      playerTotals[player.id] = {
        playerId: player.id,
        name: player.name,
        avatar: player.avatar,
        totalScore: 0,
        gamesWon: 0,
        totalPercentage: 0,
        gamesPlayed: 0
      };
    });
    
    // Sum up scores from all games
    RoomManager.currentRoom.selectedGames.forEach((gameId, index) => {
      const gameScores = RoomManager.currentRoom.scores[gameId] || {};
      
      // Find winner of this game
      let highestScore = 0;
      let winnerId = null;
      
      Object.keys(gameScores).forEach(playerId => {
        const score = gameScores[playerId];
        if (playerTotals[playerId]) {
          playerTotals[playerId].totalScore += score.score || 0;
          playerTotals[playerId].totalPercentage += score.percentage || 0;
          playerTotals[playerId].gamesPlayed++;
          
          if ((score.score || 0) > highestScore) {
            highestScore = score.score || 0;
            winnerId = playerId;
          }
        }
      });
      
      // Award game win
      if (winnerId && playerTotals[winnerId]) {
        playerTotals[winnerId].gamesWon++;
      }
    });
    
    // Calculate averages
    Object.keys(playerTotals).forEach(playerId => {
      const total = playerTotals[playerId];
      total.averagePercentage = total.gamesPlayed > 0 
        ? Math.round(total.totalPercentage / total.gamesPlayed) 
        : 0;
    });
    
    // Sort by total score
    const rankings = Object.values(playerTotals)
      .sort((a, b) => b.totalScore - a.totalScore);
    
    return rankings;
  },
  
  // ========================================
  // ROOM MANAGEMENT
  // ========================================
  
  // Leave room
  leaveRoom: async () => {
    if (!RoomManager.currentRoom) return;
    
    // Stop listening
    RoomManager.stopListening();
    
    // Remove player from room
    RoomManager.currentRoom.players = RoomManager.currentRoom.players.filter(
      p => p.id !== RoomManager.playerId
    );
    
    // If host leaves, assign new host or close room
    if (RoomManager.isHost) {
      if (RoomManager.currentRoom.players.length > 0) {
        RoomManager.currentRoom.players[0].isHost = true;
        RoomManager.currentRoom.hostId = RoomManager.currentRoom.players[0].id;
        await RoomManager.updateRoom(RoomManager.currentRoom);
      } else {
        // Delete empty room
        await RoomManager.deleteRoom(RoomManager.roomCode);
      }
    } else {
      await RoomManager.updateRoom(RoomManager.currentRoom);
    }
    
    // Reset local state
    RoomManager.currentRoom = null;
    RoomManager.roomCode = null;
    RoomManager.playerId = null;
    RoomManager.isHost = false;
    RoomManager.scores = {};
    
    console.log('[RoomManager] Left room');
  },
  
  // ========================================
  // STORAGE (Local Storage for MVP)
  // For production, replace with Firebase/Supabase
  // ========================================
  
  saveRoom: async (room) => {
    localStorage.setItem(`party_room_${room.code}`, JSON.stringify(room));
    // Also save to a global list of active rooms
    const activeRooms = JSON.parse(localStorage.getItem('party_active_rooms') || '[]');
    if (!activeRooms.includes(room.code)) {
      activeRooms.push(room.code);
      localStorage.setItem('party_active_rooms', JSON.stringify(activeRooms));
    }
  },
  
  fetchRoom: async (roomCode) => {
    const room = localStorage.getItem(`party_room_${roomCode}`);
    return room ? JSON.parse(room) : null;
  },
  
  updateRoom: async (room) => {
    room.updatedAt = Date.now();
    localStorage.setItem(`party_room_${room.code}`, JSON.stringify(room));
  },
  
  deleteRoom: async (roomCode) => {
    localStorage.removeItem(`party_room_${roomCode}`);
    const activeRooms = JSON.parse(localStorage.getItem('party_active_rooms') || '[]');
    const filtered = activeRooms.filter(code => code !== roomCode);
    localStorage.setItem('party_active_rooms', JSON.stringify(filtered));
  },
  
  // ========================================
  // REAL-TIME UPDATES (Polling for MVP)
  // For production, use WebSocket/Firebase
  // ========================================
  
  startListening: () => {
    if (RoomManager.updateInterval) {
      clearInterval(RoomManager.updateInterval);
    }
    
    RoomManager.updateInterval = setInterval(async () => {
      const room = await RoomManager.fetchRoom(RoomManager.roomCode);
      if (room) {
        const oldStatus = RoomManager.currentRoom?.status;
        const oldPlayerCount = RoomManager.currentRoom?.players?.length || 0;
        
        RoomManager.currentRoom = room;
        RoomManager.scores = room.scores || {};
        
        // Emit events based on changes
        if (room.status !== oldStatus) {
          RoomManager.emit('statusChanged', { status: room.status, oldStatus });
        }
        
        if (room.players.length !== oldPlayerCount) {
          RoomManager.emit('playersChanged', { players: room.players });
        }
        
        RoomManager.emit('roomUpdated', { room });
      }
    }, 500); // Poll every 500ms
  },
  
  stopListening: () => {
    if (RoomManager.updateInterval) {
      clearInterval(RoomManager.updateInterval);
      RoomManager.updateInterval = null;
    }
  },
  
  // ========================================
  // EVENT SYSTEM
  // ========================================
  
  on: (event, callback) => {
    if (!RoomManager.listeners[event]) {
      RoomManager.listeners[event] = [];
    }
    RoomManager.listeners[event].push(callback);
  },
  
  off: (event, callback) => {
    if (RoomManager.listeners[event]) {
      RoomManager.listeners[event] = RoomManager.listeners[event].filter(cb => cb !== callback);
    }
  },
  
  emit: (event, data = {}) => {
    if (RoomManager.listeners[event]) {
      RoomManager.listeners[event].forEach(callback => {
        try {
          callback(data);
        } catch (e) {
          console.error('[RoomManager] Event listener error:', e);
        }
      });
    }
  },
  
  // ========================================
  // UTILITY
  // ========================================
  
  // Get current player
  getCurrentPlayer: () => {
    if (!RoomManager.currentRoom) return null;
    return RoomManager.currentRoom.players.find(p => p.id === RoomManager.playerId);
  },
  
  // Get game by ID
  getGame: (gameId) => {
    return typeof GAMES !== 'undefined' ? GAMES.find(g => g.id === gameId) : null;
  },
  
  // Calculate party XP (2x multiplier)
  calculatePartyXP: () => {
    const baseXP = 100;
    const partyMultiplier = 2;
    const playerBonus = RoomManager.currentRoom ? 
      RoomManager.currentRoom.players.length * 10 : 0;
    return (baseXP + playerBonus) * partyMultiplier;
  }
};

// Make available globally
if (typeof window !== 'undefined') {
  window.RoomManager = RoomManager;
}

