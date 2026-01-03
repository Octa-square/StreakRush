// ========================================
// STREAKRUSH - LOGIC CHALLENGE
// Color Match (Stroop Test)
// ========================================

const LogicChallenge = {
  name: 'logic',
  score: 0,
  isActive: false,
  gameArea: null,
  difficulty: 1,
  variation: 0,
  currentWord: null,
  wordElement: null,
  correctAnswers: 0,
  wrongAnswers: 0,
  wordTimer: null,
  
  // Color words and their hex values
  colorWords: [
    { word: 'RED', color: '#ef233c' },
    { word: 'BLUE', color: '#4361ee' },
    { word: 'GREEN', color: '#06d6a0' },
    { word: 'YELLOW', color: '#ffd60a' },
    { word: 'PURPLE', color: '#7209b7' },
    { word: 'ORANGE', color: '#ff6b35' }
  ],
  
  // Configuration
  getConfig: () => {
    const baseConfig = {
      wordDuration: 1500,  // ms before auto-skip
      pointsCorrect: 10,
      pointsWrong: -5,
      invertedLogic: false,  // If true, tap when they DON'T match
      mirrorMode: false,
      tripleChoice: false
    };
    
    // Apply variation modifiers
    switch (LogicChallenge.variation) {
      case 0: // Basic Stroop
        break;
      case 1: // Triple Choice
        baseConfig.tripleChoice = true;
        break;
      case 2: // Inverted Logic
        baseConfig.invertedLogic = true;
        break;
      case 3: // Ultra Speed
        baseConfig.wordDuration = 800;
        break;
      case 4: // Mirror Mode
        baseConfig.mirrorMode = true;
        break;
    }
    
    // Apply difficulty modifiers
    const diff = LogicChallenge.difficulty;
    baseConfig.wordDuration = Math.max(500, baseConfig.wordDuration - (diff * 80));
    
    return baseConfig;
  },
  
  // Generate a word with color
  generateWord: () => {
    const colors = LogicChallenge.colorWords;
    
    // Pick random word
    const wordIndex = Utils.random(0, colors.length - 1);
    const word = colors[wordIndex].word;
    
    // Pick random color (50% chance of matching)
    let colorIndex;
    if (Math.random() > 0.5) {
      colorIndex = wordIndex; // Match
    } else {
      // Pick different color
      do {
        colorIndex = Utils.random(0, colors.length - 1);
      } while (colorIndex === wordIndex);
    }
    
    const color = colors[colorIndex].color;
    const isMatch = wordIndex === colorIndex;
    
    return { word, color, isMatch };
  },
  
  // Initialize
  init: (gameArea, difficulty, variation) => {
    LogicChallenge.gameArea = gameArea;
    LogicChallenge.difficulty = difficulty;
    LogicChallenge.variation = variation;
    LogicChallenge.score = 0;
    LogicChallenge.correctAnswers = 0;
    LogicChallenge.wrongAnswers = 0;
    LogicChallenge.isActive = true;
    
    LogicChallenge.buildUI();
  },
  
  // Build UI
  buildUI: () => {
    const gameArea = LogicChallenge.gameArea;
    gameArea.innerHTML = '';
    
    const container = document.createElement('div');
    container.className = 'stroop-container';
    
    // Instruction
    const config = LogicChallenge.getConfig();
    const instruction = document.createElement('p');
    instruction.style.color = '#a0a0c0';
    instruction.style.fontSize = '14px';
    instruction.style.marginBottom = '20px';
    
    if (config.invertedLogic) {
      instruction.textContent = 'Tap ✓ if they DON\'T match, ✗ if they DO match';
    } else {
      instruction.textContent = 'Does the word match its color?';
    }
    container.appendChild(instruction);
    
    // Word display
    const wordDisplay = document.createElement('div');
    wordDisplay.className = 'stroop-word';
    wordDisplay.textContent = '...';
    LogicChallenge.wordElement = wordDisplay;
    container.appendChild(wordDisplay);
    
    // Buttons
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'stroop-buttons';
    
    const matchButton = document.createElement('button');
    matchButton.className = 'stroop-button match';
    matchButton.textContent = '✓';
    matchButton.addEventListener('click', () => LogicChallenge.handleAnswer(true));
    matchButton.addEventListener('touchstart', (e) => {
      e.preventDefault();
      LogicChallenge.handleAnswer(true);
    }, { passive: false });
    
    const noMatchButton = document.createElement('button');
    noMatchButton.className = 'stroop-button no-match';
    noMatchButton.textContent = '✗';
    noMatchButton.addEventListener('click', () => LogicChallenge.handleAnswer(false));
    noMatchButton.addEventListener('touchstart', (e) => {
      e.preventDefault();
      LogicChallenge.handleAnswer(false);
    }, { passive: false });
    
    buttonContainer.appendChild(matchButton);
    buttonContainer.appendChild(noMatchButton);
    container.appendChild(buttonContainer);
    
    gameArea.appendChild(container);
  },
  
  // Show next word
  showNextWord: () => {
    if (!LogicChallenge.isActive) return;
    
    const config = LogicChallenge.getConfig();
    LogicChallenge.currentWord = LogicChallenge.generateWord();
    
    let displayWord = LogicChallenge.currentWord.word;
    
    // Mirror mode
    if (config.mirrorMode) {
      displayWord = displayWord.split('').reverse().join('');
      LogicChallenge.wordElement.style.transform = 'scaleX(-1)';
    } else {
      LogicChallenge.wordElement.style.transform = '';
    }
    
    LogicChallenge.wordElement.textContent = displayWord;
    LogicChallenge.wordElement.style.color = LogicChallenge.currentWord.color;
    
    // Auto-skip timer
    LogicChallenge.wordTimer = setTimeout(() => {
      if (LogicChallenge.isActive && LogicChallenge.currentWord) {
        // Timeout counts as wrong
        LogicChallenge.score += config.pointsWrong;
        LogicChallenge.wrongAnswers++;
        Game.updateScore(LogicChallenge.score);
        LogicChallenge.showNextWord();
      }
    }, config.wordDuration);
  },
  
  // Handle user answer
  handleAnswer: (userSaidMatch) => {
    if (!LogicChallenge.isActive || !LogicChallenge.currentWord) return;
    
    const config = LogicChallenge.getConfig();
    
    // Clear auto-skip timer
    if (LogicChallenge.wordTimer) {
      clearTimeout(LogicChallenge.wordTimer);
    }
    
    const actualMatch = LogicChallenge.currentWord.isMatch;
    
    // Determine correctness (accounting for inverted logic)
    let isCorrect;
    if (config.invertedLogic) {
      // In inverted mode: tap ✓ when they DON'T match
      isCorrect = (userSaidMatch && !actualMatch) || (!userSaidMatch && actualMatch);
    } else {
      // Normal mode
      isCorrect = (userSaidMatch && actualMatch) || (!userSaidMatch && !actualMatch);
    }
    
    if (isCorrect) {
      LogicChallenge.score += config.pointsCorrect;
      LogicChallenge.correctAnswers++;
      Utils.vibrate(10);
      
      // Brief success flash
      LogicChallenge.wordElement.style.textShadow = '0 0 20px #06d6a0';
    } else {
      LogicChallenge.score += config.pointsWrong;
      LogicChallenge.wrongAnswers++;
      Utils.vibrate([30, 20, 30]);
      
      // Brief error flash
      LogicChallenge.wordElement.style.textShadow = '0 0 20px #ef233c';
    }
    
    Game.updateScore(LogicChallenge.score);
    
    // Reset and show next
    setTimeout(() => {
      LogicChallenge.wordElement.style.textShadow = '';
      LogicChallenge.showNextWord();
    }, 150);
  },
  
  // Start
  start: () => {
    LogicChallenge.showNextWord();
  },
  
  // Update (not used)
  update: () => {},
  
  // End
  end: () => {
    LogicChallenge.isActive = false;
    
    if (LogicChallenge.wordTimer) {
      clearTimeout(LogicChallenge.wordTimer);
    }
    
    return {
      score: Math.max(0, LogicChallenge.score),
      metrics: {
        correctAnswers: LogicChallenge.correctAnswers,
        wrongAnswers: LogicChallenge.wrongAnswers
      }
    };
  },
  
  // Cleanup
  cleanup: () => {
    LogicChallenge.end();
  }
};

