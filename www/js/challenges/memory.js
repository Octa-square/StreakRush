// ========================================
// STREAKRUSH - MEMORY CHALLENGE
// Pattern Match
// ========================================

const MemoryChallenge = {
  name: 'memory',
  score: 0,
  pattern: [],
  userPattern: [],
  isShowingPattern: false,
  isUserTurn: false,
  currentRound: 0,
  gameArea: null,
  tiles: [],
  difficulty: 1,
  variation: 0,
  statusElement: null,
  
  // Tile colors
  colors: ['red', 'blue', 'green', 'yellow'],
  
  // Configuration
  getConfig: () => {
    const baseConfig = {
      startLength: 3,
      flashDuration: 500,  // ms per tile flash
      pauseBetween: 200,   // ms between flashes
      pointsPerTile: 50,
      reverseOrder: false,
      showMultiple: false
    };
    
    // Apply variation modifiers
    switch (MemoryChallenge.variation) {
      case 0: // 3-Tile Start
        break;
      case 1: // Color & Position (harder patterns)
        baseConfig.startLength = 4;
        break;
      case 2: // Sound Addition (visual only for now)
        break;
      case 3: // Reverse Pattern
        baseConfig.reverseOrder = true;
        break;
      case 4: // Multi-Layer (show faster)
        baseConfig.flashDuration = 300;
        break;
    }
    
    // Apply difficulty modifiers
    const diff = MemoryChallenge.difficulty;
    baseConfig.flashDuration = Math.max(200, baseConfig.flashDuration - (diff * 20));
    baseConfig.pauseBetween = Math.max(100, baseConfig.pauseBetween - (diff * 10));
    
    return baseConfig;
  },
  
  // Initialize
  init: (gameArea, difficulty, variation) => {
    MemoryChallenge.gameArea = gameArea;
    MemoryChallenge.difficulty = difficulty;
    MemoryChallenge.variation = variation;
    MemoryChallenge.score = 0;
    MemoryChallenge.pattern = [];
    MemoryChallenge.userPattern = [];
    MemoryChallenge.currentRound = 0;
    MemoryChallenge.isShowingPattern = false;
    MemoryChallenge.isUserTurn = false;
    MemoryChallenge.tiles = [];
    
    // Build UI
    MemoryChallenge.buildUI();
  },
  
  // Build game UI
  buildUI: () => {
    const gameArea = MemoryChallenge.gameArea;
    gameArea.innerHTML = '';
    
    // Status text
    const status = document.createElement('div');
    status.className = 'memory-status';
    status.textContent = 'Watch the pattern...';
    gameArea.appendChild(status);
    MemoryChallenge.statusElement = status;
    
    // Create 4x4 grid
    const grid = document.createElement('div');
    grid.className = 'memory-grid';
    
    // Create 16 tiles (4 of each color)
    for (let i = 0; i < 16; i++) {
      const tile = document.createElement('div');
      tile.className = 'memory-tile';
      tile.dataset.index = i;
      tile.dataset.color = MemoryChallenge.colors[i % 4];
      
      tile.addEventListener('click', () => MemoryChallenge.handleTileTap(i));
      tile.addEventListener('touchstart', (e) => {
        e.preventDefault();
        MemoryChallenge.handleTileTap(i);
      }, { passive: false });
      
      grid.appendChild(tile);
      MemoryChallenge.tiles.push(tile);
    }
    
    gameArea.appendChild(grid);
  },
  
  // Start the challenge
  start: async () => {
    const config = MemoryChallenge.getConfig();
    
    // Initialize pattern with starting length
    for (let i = 0; i < config.startLength; i++) {
      MemoryChallenge.pattern.push(Utils.random(0, 15));
    }
    
    // Show the pattern
    await MemoryChallenge.showPattern();
  },
  
  // Show pattern to user
  showPattern: async () => {
    const config = MemoryChallenge.getConfig();
    MemoryChallenge.isShowingPattern = true;
    MemoryChallenge.isUserTurn = false;
    MemoryChallenge.statusElement.textContent = 'Watch the pattern...';
    
    // Flash each tile in sequence
    const patternToShow = config.reverseOrder 
      ? [...MemoryChallenge.pattern].reverse() 
      : MemoryChallenge.pattern;
    
    for (const tileIndex of patternToShow) {
      if (!MemoryChallenge.isShowingPattern) break; // Game ended
      
      const tile = MemoryChallenge.tiles[tileIndex];
      const color = tile.dataset.color;
      
      // Flash tile
      tile.classList.add(color, 'flashing');
      Utils.vibrate(20);
      
      await Utils.delay(config.flashDuration);
      
      tile.classList.remove(color, 'flashing');
      
      await Utils.delay(config.pauseBetween);
    }
    
    MemoryChallenge.isShowingPattern = false;
    MemoryChallenge.isUserTurn = true;
    MemoryChallenge.userPattern = [];
    
    const instruction = config.reverseOrder ? 'Tap in REVERSE order!' : 'Your turn! Repeat the pattern.';
    MemoryChallenge.statusElement.textContent = instruction;
  },
  
  // Handle user tile tap
  handleTileTap: (tileIndex) => {
    if (!MemoryChallenge.isUserTurn || MemoryChallenge.isShowingPattern) return;
    
    const config = MemoryChallenge.getConfig();
    const tile = MemoryChallenge.tiles[tileIndex];
    const color = tile.dataset.color;
    
    // Flash the tapped tile
    tile.classList.add(color);
    Utils.vibrate(10);
    setTimeout(() => tile.classList.remove(color), 200);
    
    MemoryChallenge.userPattern.push(tileIndex);
    
    // Check if correct so far
    const expectedPattern = config.reverseOrder 
      ? [...MemoryChallenge.pattern].reverse() 
      : MemoryChallenge.pattern;
    
    const currentIndex = MemoryChallenge.userPattern.length - 1;
    
    if (tileIndex !== expectedPattern[currentIndex]) {
      // Wrong! Game over for this round
      MemoryChallenge.handleWrongPattern();
      return;
    }
    
    // Check if pattern complete
    if (MemoryChallenge.userPattern.length === MemoryChallenge.pattern.length) {
      MemoryChallenge.handleCorrectPattern();
    }
  },
  
  // Handle correct pattern
  handleCorrectPattern: async () => {
    const config = MemoryChallenge.getConfig();
    
    // Award points
    MemoryChallenge.score += config.pointsPerTile * MemoryChallenge.pattern.length;
    Game.updateScore(MemoryChallenge.score);
    
    MemoryChallenge.currentRound++;
    MemoryChallenge.statusElement.textContent = '✓ Correct! +1 tile';
    
    Utils.vibrate([30, 50, 30]);
    
    // Add new tile to pattern
    MemoryChallenge.pattern.push(Utils.random(0, 15));
    MemoryChallenge.userPattern = [];
    
    // Wait then show new pattern
    await Utils.delay(1000);
    
    if (MemoryChallenge.isUserTurn !== null) { // Game still active
      await MemoryChallenge.showPattern();
    }
  },
  
  // Handle wrong pattern
  handleWrongPattern: async () => {
    MemoryChallenge.isUserTurn = false;
    MemoryChallenge.statusElement.textContent = '✗ Wrong! Starting new sequence...';
    
    Utils.vibrate([100, 50, 100]);
    
    // Start new pattern from scratch
    const config = MemoryChallenge.getConfig();
    MemoryChallenge.pattern = [];
    for (let i = 0; i < config.startLength; i++) {
      MemoryChallenge.pattern.push(Utils.random(0, 15));
    }
    MemoryChallenge.userPattern = [];
    
    await Utils.delay(1500);
    
    if (MemoryChallenge.gameArea) { // Game still active
      await MemoryChallenge.showPattern();
    }
  },
  
  // Update (not used for memory)
  update: () => {},
  
  // End challenge
  end: () => {
    MemoryChallenge.isShowingPattern = false;
    MemoryChallenge.isUserTurn = null;
    
    return {
      score: MemoryChallenge.score,
      metrics: {
        longestPattern: MemoryChallenge.pattern.length,
        rounds: MemoryChallenge.currentRound
      }
    };
  },
  
  // Cleanup
  cleanup: () => {
    MemoryChallenge.isShowingPattern = false;
    MemoryChallenge.isUserTurn = null;
    MemoryChallenge.tiles = [];
    MemoryChallenge.pattern = [];
    MemoryChallenge.userPattern = [];
  }
};

