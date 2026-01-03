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
    return localStorage.getItem('streakrush_friends_admin') === 'true';
  },
  
  // Unlock admin access
  unlockAdmin: () => {
    localStorage.setItem('streakrush_friends_admin', 'true');
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
    
    localStorage.setItem(`streakrush_room_${FriendsHub.roomCode}`, JSON.stringify(roomData));
  },
  
  // Load room from localStorage
  loadRoom: (roomCode) => {
    const data = localStorage.getItem(`streakrush_room_${roomCode}`);
    if (!data) return null;
    
    const room = JSON.parse(data);
    
    // Check if room is stale (older than 1 hour)
    if (Date.now() - room.updatedAt > 3600000) {
      localStorage.removeItem(`streakrush_room_${roomCode}`);
      return null;
    }
    
    return room;
  }
};

