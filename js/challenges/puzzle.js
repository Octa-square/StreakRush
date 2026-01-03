// ========================================
// STREAKRUSH - PUZZLE CHALLENGE
// Quick Sort
// ========================================

const PuzzleChallenge = {
  name: 'puzzle',
  score: 0,
  isActive: false,
  gameArea: null,
  difficulty: 1,
  variation: 0,
  currentItems: [],
  correctOrder: [],
  userOrder: [],
  puzzlesCompleted: 0,
  itemsContainer: null,
  dropZone: null,
  selectedItem: null,
  
  // Configuration
  getConfig: () => {
    const baseConfig = {
      itemCount: 5,
      puzzleType: 'numbers',  // numbers, colors, sizes
      pointsPerPuzzle: 20
    };
    
    // Apply variation modifiers
    switch (PuzzleChallenge.variation) {
      case 0: // Numbers 1-5
        baseConfig.itemCount = 5;
        break;
      case 1: // Numbers 1-10
        baseConfig.itemCount = 8;
        break;
      case 2: // Colors (rainbow)
        baseConfig.puzzleType = 'colors';
        baseConfig.itemCount = 6;
        break;
      case 3: // Sizes
        baseConfig.puzzleType = 'sizes';
        baseConfig.itemCount = 5;
        break;
      case 4: // Mixed
        baseConfig.puzzleType = 'mixed';
        baseConfig.itemCount = 6;
        break;
    }
    
    // Apply difficulty modifiers
    const diff = PuzzleChallenge.difficulty;
    baseConfig.itemCount = Math.min(10, baseConfig.itemCount + Math.floor(diff / 3));
    
    return baseConfig;
  },
  
  // Generate puzzle items
  generateItems: () => {
    const config = PuzzleChallenge.getConfig();
    const items = [];
    
    switch (config.puzzleType) {
      case 'numbers':
        for (let i = 1; i <= config.itemCount; i++) {
          items.push({ value: i, display: i.toString(), sortKey: i });
        }
        break;
        
      case 'colors':
        const rainbowColors = [
          { name: 'Red', color: '#ef233c' },
          { name: 'Orange', color: '#ff6b35' },
          { name: 'Yellow', color: '#ffd60a' },
          { name: 'Green', color: '#06d6a0' },
          { name: 'Blue', color: '#4361ee' },
          { name: 'Purple', color: '#7209b7' }
        ];
        rainbowColors.slice(0, config.itemCount).forEach((c, i) => {
          items.push({ value: c.name, display: '●', color: c.color, sortKey: i });
        });
        break;
        
      case 'sizes':
        const sizes = ['XS', 'S', 'M', 'L', 'XL'];
        const fontSizes = [16, 20, 26, 34, 44];
        sizes.slice(0, config.itemCount).forEach((s, i) => {
          items.push({ value: s, display: '■', fontSize: fontSizes[i], sortKey: i });
        });
        break;
        
      case 'mixed':
        for (let i = 1; i <= config.itemCount; i++) {
          items.push({ value: i, display: i.toString(), sortKey: i });
        }
        break;
    }
    
    // Store correct order
    PuzzleChallenge.correctOrder = items.map(item => item.sortKey);
    
    // Shuffle for display
    return Utils.shuffle(items);
  },
  
  // Initialize
  init: (gameArea, difficulty, variation) => {
    PuzzleChallenge.gameArea = gameArea;
    PuzzleChallenge.difficulty = difficulty;
    PuzzleChallenge.variation = variation;
    PuzzleChallenge.score = 0;
    PuzzleChallenge.puzzlesCompleted = 0;
    PuzzleChallenge.userOrder = [];
    PuzzleChallenge.selectedItem = null;
    PuzzleChallenge.isActive = true;
    
    PuzzleChallenge.buildUI();
  },
  
  // Build UI
  buildUI: () => {
    const gameArea = PuzzleChallenge.gameArea;
    gameArea.innerHTML = '';
    
    const container = document.createElement('div');
    container.className = 'puzzle-container';
    
    // Instruction
    const instruction = document.createElement('div');
    instruction.className = 'puzzle-instruction';
    instruction.textContent = 'Tap items in order (smallest to largest)';
    instruction.id = 'puzzle-instruction';
    container.appendChild(instruction);
    
    // Drop zone (shows selected order)
    const dropZone = document.createElement('div');
    dropZone.className = 'puzzle-drop-zone';
    dropZone.id = 'drop-zone';
    PuzzleChallenge.dropZone = dropZone;
    container.appendChild(dropZone);
    
    // Items container
    const itemsContainer = document.createElement('div');
    itemsContainer.className = 'puzzle-items';
    itemsContainer.id = 'puzzle-items';
    PuzzleChallenge.itemsContainer = itemsContainer;
    container.appendChild(itemsContainer);
    
    // Progress
    const progress = document.createElement('div');
    progress.style.marginTop = '20px';
    progress.style.color = '#a0a0c0';
    progress.style.fontSize = '14px';
    progress.id = 'puzzle-progress';
    progress.textContent = 'Puzzles: 0';
    container.appendChild(progress);
    
    gameArea.appendChild(container);
  },
  
  // Load new puzzle
  loadPuzzle: () => {
    if (!PuzzleChallenge.isActive) return;
    
    PuzzleChallenge.currentItems = PuzzleChallenge.generateItems();
    PuzzleChallenge.userOrder = [];
    
    // Clear containers
    PuzzleChallenge.itemsContainer.innerHTML = '';
    PuzzleChallenge.dropZone.innerHTML = '';
    
    // Create drop slots
    const config = PuzzleChallenge.getConfig();
    for (let i = 0; i < config.itemCount; i++) {
      const slot = document.createElement('div');
      slot.className = 'drop-slot';
      slot.dataset.index = i;
      PuzzleChallenge.dropZone.appendChild(slot);
    }
    
    // Create item buttons
    PuzzleChallenge.currentItems.forEach((item, index) => {
      const itemEl = document.createElement('div');
      itemEl.className = 'puzzle-item';
      itemEl.dataset.sortKey = item.sortKey;
      itemEl.dataset.index = index;
      itemEl.textContent = item.display;
      
      if (item.color) {
        itemEl.style.color = item.color;
        itemEl.style.fontSize = '32px';
      }
      if (item.fontSize) {
        itemEl.style.fontSize = `${item.fontSize}px`;
      }
      
      const handleTap = (e) => {
        e.preventDefault();
        PuzzleChallenge.selectItem(item, itemEl);
      };
      
      itemEl.addEventListener('click', handleTap);
      itemEl.addEventListener('touchstart', handleTap, { passive: false });
      
      PuzzleChallenge.itemsContainer.appendChild(itemEl);
    });
  },
  
  // Select an item
  selectItem: (item, element) => {
    if (!PuzzleChallenge.isActive) return;
    if (element.classList.contains('selected')) return;
    
    // Add to user order
    PuzzleChallenge.userOrder.push(item.sortKey);
    
    // Mark as selected
    element.classList.add('selected');
    element.style.opacity = '0.3';
    element.style.pointerEvents = 'none';
    
    Utils.vibrate(10);
    
    // Fill in drop zone
    const slotIndex = PuzzleChallenge.userOrder.length - 1;
    const slot = PuzzleChallenge.dropZone.children[slotIndex];
    if (slot) {
      slot.classList.add('filled');
      slot.textContent = item.display;
      if (item.color) {
        slot.style.color = item.color;
      }
      if (item.fontSize) {
        slot.style.fontSize = `${item.fontSize}px`;
      }
    }
    
    // Check if puzzle complete
    if (PuzzleChallenge.userOrder.length === PuzzleChallenge.correctOrder.length) {
      PuzzleChallenge.checkPuzzle();
    }
  },
  
  // Check if puzzle is correct
  checkPuzzle: () => {
    const config = PuzzleChallenge.getConfig();
    const isCorrect = PuzzleChallenge.userOrder.every(
      (key, i) => key === PuzzleChallenge.correctOrder[i]
    );
    
    if (isCorrect) {
      // Correct!
      PuzzleChallenge.score += config.pointsPerPuzzle;
      PuzzleChallenge.puzzlesCompleted++;
      Game.updateScore(PuzzleChallenge.score);
      
      // Update progress
      document.getElementById('puzzle-progress').textContent = 
        `Puzzles: ${PuzzleChallenge.puzzlesCompleted}`;
      
      Utils.vibrate([20, 30, 20]);
      
      // Flash success
      PuzzleChallenge.dropZone.style.borderColor = '#06d6a0';
      
      setTimeout(() => {
        PuzzleChallenge.dropZone.style.borderColor = '';
        PuzzleChallenge.loadPuzzle();
      }, 500);
    } else {
      // Wrong - reset puzzle
      Utils.vibrate([50, 30, 50]);
      
      PuzzleChallenge.dropZone.style.borderColor = '#ef233c';
      
      setTimeout(() => {
        PuzzleChallenge.dropZone.style.borderColor = '';
        PuzzleChallenge.loadPuzzle();
      }, 500);
    }
  },
  
  // Start
  start: () => {
    PuzzleChallenge.loadPuzzle();
  },
  
  // Update (not used)
  update: () => {},
  
  // End
  end: () => {
    PuzzleChallenge.isActive = false;
    
    return {
      score: PuzzleChallenge.score,
      metrics: {
        puzzlesCompleted: PuzzleChallenge.puzzlesCompleted
      }
    };
  },
  
  // Cleanup
  cleanup: () => {
    PuzzleChallenge.isActive = false;
  }
};

