// ========================================
// STREAKRUSH - COORDINATION CHALLENGE
// Swipe Dodge
// ========================================

const CoordinationChallenge = {
  name: 'coordination',
  score: 0,
  isActive: false,
  gameArea: null,
  difficulty: 1,
  variation: 0,
  currentObstacle: null,
  obstacleTimer: null,
  spawnInterval: null,
  dodgesSuccessful: 0,
  instructionElement: null,
  touchStartX: 0,
  touchStartY: 0,
  swipeThreshold: 50,
  
  // Directions
  directions: ['top', 'bottom', 'left', 'right'],
  opposites: {
    top: 'bottom',
    bottom: 'top',
    left: 'right',
    right: 'left'
  },
  
  // Configuration
  getConfig: () => {
    const baseConfig = {
      spawnRate: 2000,       // ms between obstacles
      obstacleSpeed: 1500,   // ms for obstacle to reach center
      pointsDodge: 5,
      directions: ['top', 'bottom'], // Start with just up/down
      acceleration: false,
      shrinkSafeZone: false
    };
    
    // Apply variation modifiers
    switch (CoordinationChallenge.variation) {
      case 0: // Single Lane
        baseConfig.directions = ['top'];
        break;
      case 1: // Multi-Direction
        baseConfig.directions = ['top', 'bottom', 'left', 'right'];
        break;
      case 2: // Accelerating Speed
        baseConfig.acceleration = true;
        break;
      case 3: // Shrinking Safe Zone
        baseConfig.shrinkSafeZone = true;
        break;
      case 4: // Random Pattern
        baseConfig.directions = ['top', 'bottom', 'left', 'right'];
        baseConfig.spawnRate = 1500;
        break;
    }
    
    // Apply difficulty modifiers
    const diff = CoordinationChallenge.difficulty;
    baseConfig.spawnRate = Math.max(800, baseConfig.spawnRate - (diff * 100));
    baseConfig.obstacleSpeed = Math.max(800, baseConfig.obstacleSpeed - (diff * 80));
    
    return baseConfig;
  },
  
  // Initialize
  init: (gameArea, difficulty, variation) => {
    CoordinationChallenge.gameArea = gameArea;
    CoordinationChallenge.difficulty = difficulty;
    CoordinationChallenge.variation = variation;
    CoordinationChallenge.score = 0;
    CoordinationChallenge.dodgesSuccessful = 0;
    CoordinationChallenge.isActive = true;
    CoordinationChallenge.currentObstacle = null;
    
    CoordinationChallenge.buildUI();
    CoordinationChallenge.setupControls();
  },
  
  // Build UI
  buildUI: () => {
    const gameArea = CoordinationChallenge.gameArea;
    gameArea.innerHTML = '';
    
    const dodgeArea = document.createElement('div');
    dodgeArea.className = 'dodge-area';
    dodgeArea.id = 'dodge-area';
    
    // Player zone (center)
    const playerZone = document.createElement('div');
    playerZone.className = 'player-zone';
    playerZone.id = 'player-zone';
    playerZone.innerHTML = '🎮';
    dodgeArea.appendChild(playerZone);
    
    // Instruction display
    const instruction = document.createElement('div');
    instruction.className = 'dodge-instruction';
    instruction.textContent = 'SWIPE DOWN ⬇️';
    instruction.style.display = 'none';
    CoordinationChallenge.instructionElement = instruction;
    dodgeArea.appendChild(instruction);
    
    gameArea.appendChild(dodgeArea);
  },
  
  // Setup touch/swipe controls
  setupControls: () => {
    const gameArea = CoordinationChallenge.gameArea;
    
    // Touch start
    gameArea.addEventListener('touchstart', (e) => {
      CoordinationChallenge.touchStartX = e.touches[0].clientX;
      CoordinationChallenge.touchStartY = e.touches[0].clientY;
    }, { passive: true });
    
    // Touch end (detect swipe)
    gameArea.addEventListener('touchend', (e) => {
      if (!CoordinationChallenge.isActive) return;
      
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      
      const deltaX = touchEndX - CoordinationChallenge.touchStartX;
      const deltaY = touchEndY - CoordinationChallenge.touchStartY;
      
      let direction = null;
      
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (Math.abs(deltaX) > CoordinationChallenge.swipeThreshold) {
          direction = deltaX > 0 ? 'right' : 'left';
        }
      } else {
        // Vertical swipe
        if (Math.abs(deltaY) > CoordinationChallenge.swipeThreshold) {
          direction = deltaY > 0 ? 'bottom' : 'top';
        }
      }
      
      if (direction) {
        CoordinationChallenge.handleSwipe(direction);
      }
    }, { passive: true });
    
    // Keyboard controls for testing
    document.addEventListener('keydown', CoordinationChallenge.handleKeyDown);
  },
  
  // Handle keyboard (for testing on desktop)
  handleKeyDown: (e) => {
    if (!CoordinationChallenge.isActive) return;
    
    const keyMap = {
      'ArrowUp': 'top',
      'ArrowDown': 'bottom',
      'ArrowLeft': 'left',
      'ArrowRight': 'right'
    };
    
    if (keyMap[e.key]) {
      CoordinationChallenge.handleSwipe(keyMap[e.key]);
    }
  },
  
  // Handle swipe
  handleSwipe: (direction) => {
    if (!CoordinationChallenge.currentObstacle) return;
    
    const config = CoordinationChallenge.getConfig();
    const requiredSwipe = CoordinationChallenge.opposites[CoordinationChallenge.currentObstacle.direction];
    
    if (direction === requiredSwipe) {
      // Correct dodge!
      CoordinationChallenge.score += config.pointsDodge;
      CoordinationChallenge.dodgesSuccessful++;
      Game.updateScore(CoordinationChallenge.score);
      
      Utils.vibrate([20, 30, 20]);
      
      // Remove current obstacle
      CoordinationChallenge.clearObstacle();
      
      // Show success
      CoordinationChallenge.instructionElement.textContent = '✓ DODGED!';
      CoordinationChallenge.instructionElement.style.color = '#06d6a0';
      setTimeout(() => {
        CoordinationChallenge.instructionElement.style.display = 'none';
        CoordinationChallenge.instructionElement.style.color = '';
      }, 300);
    }
  },
  
  // Spawn obstacle
  spawnObstacle: () => {
    if (!CoordinationChallenge.isActive) return;
    
    const config = CoordinationChallenge.getConfig();
    const dodgeArea = document.getElementById('dodge-area');
    
    // Pick random direction
    const direction = config.directions[Utils.random(0, config.directions.length - 1)];
    const oppositeSwipe = CoordinationChallenge.opposites[direction];
    
    // Create obstacle
    const obstacle = document.createElement('div');
    obstacle.className = `obstacle ${direction === 'left' || direction === 'right' ? 'vertical' : 'horizontal'}`;
    obstacle.innerHTML = '⚠️';
    
    // Position based on direction
    switch (direction) {
      case 'top':
        obstacle.style.top = '-60px';
        obstacle.style.left = '0';
        obstacle.style.animation = `slideFromTop ${config.obstacleSpeed}ms linear`;
        break;
      case 'bottom':
        obstacle.style.bottom = '-60px';
        obstacle.style.left = '0';
        obstacle.style.animation = `slideFromBottom ${config.obstacleSpeed}ms linear`;
        break;
      case 'left':
        obstacle.style.left = '-60px';
        obstacle.style.top = '0';
        obstacle.style.animation = `slideFromLeft ${config.obstacleSpeed}ms linear`;
        break;
      case 'right':
        obstacle.style.right = '-60px';
        obstacle.style.top = '0';
        obstacle.style.animation = `slideFromRight ${config.obstacleSpeed}ms linear`;
        break;
    }
    
    dodgeArea.appendChild(obstacle);
    CoordinationChallenge.currentObstacle = { element: obstacle, direction };
    
    // Show instruction
    const swipeArrows = { top: '⬆️', bottom: '⬇️', left: '⬅️', right: '➡️' };
    CoordinationChallenge.instructionElement.textContent = `SWIPE ${oppositeSwipe.toUpperCase()} ${swipeArrows[oppositeSwipe]}`;
    CoordinationChallenge.instructionElement.style.display = 'block';
    
    // Timer for obstacle reaching center (game over)
    CoordinationChallenge.obstacleTimer = setTimeout(() => {
      if (CoordinationChallenge.currentObstacle) {
        // Hit! Game over
        CoordinationChallenge.handleHit();
      }
    }, config.obstacleSpeed);
  },
  
  // Clear current obstacle
  clearObstacle: () => {
    if (CoordinationChallenge.currentObstacle) {
      CoordinationChallenge.currentObstacle.element.remove();
      CoordinationChallenge.currentObstacle = null;
    }
    if (CoordinationChallenge.obstacleTimer) {
      clearTimeout(CoordinationChallenge.obstacleTimer);
    }
  },
  
  // Handle being hit
  handleHit: () => {
    Utils.vibrate([100, 50, 100, 50, 100]);
    
    // Flash player red
    const playerZone = document.getElementById('player-zone');
    if (playerZone) {
      playerZone.style.background = 'linear-gradient(135deg, #ef233c, #d90429)';
      setTimeout(() => {
        playerZone.style.background = '';
      }, 300);
    }
    
    // Clear and continue (or could end game here)
    CoordinationChallenge.clearObstacle();
    CoordinationChallenge.instructionElement.textContent = '💥 HIT!';
    CoordinationChallenge.instructionElement.style.color = '#ef233c';
    setTimeout(() => {
      CoordinationChallenge.instructionElement.style.display = 'none';
      CoordinationChallenge.instructionElement.style.color = '';
    }, 500);
  },
  
  // Start
  start: () => {
    const config = CoordinationChallenge.getConfig();
    let currentSpawnRate = config.spawnRate;
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideFromTop { from { top: -60px; } to { top: calc(50% - 30px); } }
      @keyframes slideFromBottom { from { bottom: -60px; } to { bottom: calc(50% - 30px); } }
      @keyframes slideFromLeft { from { left: -60px; } to { left: calc(50% - 30px); } }
      @keyframes slideFromRight { from { right: -60px; } to { right: calc(50% - 30px); } }
    `;
    document.head.appendChild(style);
    
    // Spawn obstacles at interval
    const spawnLoop = () => {
      if (!CoordinationChallenge.isActive) return;
      
      CoordinationChallenge.spawnObstacle();
      
      // Acceleration
      if (config.acceleration) {
        currentSpawnRate = Math.max(600, currentSpawnRate - 50);
      }
      
      CoordinationChallenge.spawnInterval = setTimeout(spawnLoop, currentSpawnRate);
    };
    
    spawnLoop();
  },
  
  // Update (not used)
  update: () => {},
  
  // End
  end: () => {
    CoordinationChallenge.isActive = false;
    
    CoordinationChallenge.clearObstacle();
    
    if (CoordinationChallenge.spawnInterval) {
      clearTimeout(CoordinationChallenge.spawnInterval);
    }
    
    document.removeEventListener('keydown', CoordinationChallenge.handleKeyDown);
    
    return {
      score: CoordinationChallenge.score,
      metrics: {
        dodgesSuccessful: CoordinationChallenge.dodgesSuccessful
      }
    };
  },
  
  // Cleanup
  cleanup: () => {
    CoordinationChallenge.end();
  }
};

