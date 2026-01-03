// ========================================
// STREAKRUSH - REFLEX CHALLENGE
// Tap the Target
// ========================================

const ReflexChallenge = {
  name: 'reflex',
  score: 0,
  targets: [],
  spawnInterval: null,
  isActive: false,
  gameArea: null,
  difficulty: 1,
  variation: 0,
  
  // Configuration based on difficulty and variation
  getConfig: () => {
    const baseConfig = {
      targetSize: 80,
      spawnRate: 800,      // ms between spawns
      targetLifetime: 2000, // ms before target disappears
      fakeChance: 0,       // % chance of red fake
      pointsGood: 10,
      pointsFake: -15,
      shrinking: false,
      moving: false,
      acceleration: false
    };
    
    // Apply variation modifiers
    switch (ReflexChallenge.variation) {
      case 0: // Standard
        break;
      case 1: // Shrinking
        baseConfig.shrinking = true;
        break;
      case 2: // Moving
        baseConfig.moving = true;
        break;
      case 3: // Fake targets
        baseConfig.fakeChance = 20;
        break;
      case 4: // Acceleration
        baseConfig.acceleration = true;
        break;
    }
    
    // Apply difficulty modifiers
    const diff = ReflexChallenge.difficulty;
    baseConfig.targetSize = Math.max(40, baseConfig.targetSize - (diff * 4));
    baseConfig.spawnRate = Math.max(400, baseConfig.spawnRate - (diff * 30));
    baseConfig.targetLifetime = Math.max(1000, baseConfig.targetLifetime - (diff * 80));
    baseConfig.fakeChance = Math.min(40, baseConfig.fakeChance + (diff * 2));
    
    return baseConfig;
  },
  
  // Initialize the challenge
  init: (gameArea, difficulty, variation) => {
    ReflexChallenge.gameArea = gameArea;
    ReflexChallenge.difficulty = difficulty;
    ReflexChallenge.variation = variation;
    ReflexChallenge.score = 0;
    ReflexChallenge.targets = [];
    ReflexChallenge.isActive = true;
    
    // Clear game area
    gameArea.innerHTML = '';
  },
  
  // Start the challenge
  start: () => {
    const config = ReflexChallenge.getConfig();
    let currentSpawnRate = config.spawnRate;
    
    // Spawn targets at interval
    const spawnTarget = () => {
      if (!ReflexChallenge.isActive) return;
      
      ReflexChallenge.spawnTarget(config);
      
      // Acceleration: speed up over time
      if (config.acceleration) {
        currentSpawnRate = Math.max(300, currentSpawnRate - 10);
      }
      
      ReflexChallenge.spawnInterval = setTimeout(spawnTarget, currentSpawnRate);
    };
    
    // Start spawning
    spawnTarget();
  },
  
  // Spawn a single target
  spawnTarget: (config) => {
    const gameArea = ReflexChallenge.gameArea;
    const areaRect = gameArea.getBoundingClientRect();
    
    // Random position within game area
    const maxX = areaRect.width - config.targetSize;
    const maxY = areaRect.height - config.targetSize;
    const x = Utils.random(20, maxX - 20);
    const y = Utils.random(20, maxY - 20);
    
    // Determine if fake target
    const isFake = Math.random() * 100 < config.fakeChance;
    
    // Create target element
    const target = document.createElement('div');
    target.className = `target ${isFake ? 'fake' : 'good'}`;
    target.style.left = `${x}px`;
    target.style.top = `${y}px`;
    target.style.width = `${config.targetSize}px`;
    target.style.height = `${config.targetSize}px`;
    target.innerHTML = isFake ? '❌' : '✓';
    target.dataset.fake = isFake;
    
    // Add shrinking animation if enabled
    if (config.shrinking) {
      target.classList.add('shrinking');
    }
    
    // Add moving behavior if enabled
    if (config.moving) {
      const speedX = Utils.randomFloat(-2, 2);
      const speedY = Utils.randomFloat(-2, 2);
      target.dataset.speedX = speedX;
      target.dataset.speedY = speedY;
      target.dataset.posX = x;
      target.dataset.posY = y;
    }
    
    // Click/tap handler
    const handleTap = (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      if (isFake) {
        ReflexChallenge.score += config.pointsFake;
        ReflexChallenge.showScorePopup(target, config.pointsFake);
        Utils.vibrate([50, 30, 50]);
      } else {
        ReflexChallenge.score += config.pointsGood;
        ReflexChallenge.showScorePopup(target, config.pointsGood);
        Utils.vibrate(10);
      }
      
      // Update score display
      Game.updateScore(ReflexChallenge.score);
      
      // Remove target
      ReflexChallenge.removeTarget(target);
    };
    
    target.addEventListener('click', handleTap);
    target.addEventListener('touchstart', handleTap, { passive: false });
    
    gameArea.appendChild(target);
    ReflexChallenge.targets.push(target);
    
    // Auto-remove after lifetime
    setTimeout(() => {
      if (target.parentNode) {
        ReflexChallenge.removeTarget(target);
      }
    }, config.targetLifetime);
  },
  
  // Show score popup at target position
  showScorePopup: (target, points) => {
    const popup = document.createElement('div');
    popup.className = `score-popup ${points > 0 ? 'positive' : 'negative'}`;
    popup.textContent = points > 0 ? `+${points}` : points;
    popup.style.left = target.style.left;
    popup.style.top = target.style.top;
    
    ReflexChallenge.gameArea.appendChild(popup);
    
    // Remove popup after animation
    setTimeout(() => {
      if (popup.parentNode) {
        popup.remove();
      }
    }, 800);
  },
  
  // Remove target from game
  removeTarget: (target) => {
    const index = ReflexChallenge.targets.indexOf(target);
    if (index > -1) {
      ReflexChallenge.targets.splice(index, 1);
    }
    target.remove();
  },
  
  // Update game state (called every frame for moving targets)
  update: () => {
    if (!ReflexChallenge.isActive) return;
    
    const config = ReflexChallenge.getConfig();
    
    if (config.moving) {
      const areaRect = ReflexChallenge.gameArea.getBoundingClientRect();
      
      ReflexChallenge.targets.forEach(target => {
        let posX = parseFloat(target.dataset.posX);
        let posY = parseFloat(target.dataset.posY);
        let speedX = parseFloat(target.dataset.speedX);
        let speedY = parseFloat(target.dataset.speedY);
        
        posX += speedX;
        posY += speedY;
        
        // Bounce off walls
        if (posX <= 0 || posX >= areaRect.width - config.targetSize) {
          speedX = -speedX;
          target.dataset.speedX = speedX;
        }
        if (posY <= 0 || posY >= areaRect.height - config.targetSize) {
          speedY = -speedY;
          target.dataset.speedY = speedY;
        }
        
        target.dataset.posX = posX;
        target.dataset.posY = posY;
        target.style.left = `${posX}px`;
        target.style.top = `${posY}px`;
      });
    }
  },
  
  // End the challenge
  end: () => {
    ReflexChallenge.isActive = false;
    
    // Clear spawn interval
    if (ReflexChallenge.spawnInterval) {
      clearTimeout(ReflexChallenge.spawnInterval);
    }
    
    // Remove all remaining targets
    ReflexChallenge.targets.forEach(target => target.remove());
    ReflexChallenge.targets = [];
    
    return {
      score: Math.max(0, ReflexChallenge.score),
      metrics: {
        correctHits: Math.floor(ReflexChallenge.score / 10), // Approximation
      }
    };
  },
  
  // Cleanup
  cleanup: () => {
    ReflexChallenge.end();
  }
};

