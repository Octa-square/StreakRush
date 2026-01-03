// ========================================
// STREAKRUSH - SPEED CHALLENGE
// Math Sprint
// ========================================

const SpeedChallenge = {
  name: 'speed',
  score: 0,
  currentProblem: null,
  currentAnswer: '',
  problemsSolved: 0,
  gameArea: null,
  difficulty: 1,
  variation: 0,
  problemElement: null,
  inputElement: null,
  timePerProblem: null,
  problemTimer: null,
  
  // Configuration
  getConfig: () => {
    const baseConfig = {
      operations: ['+'],
      maxNumber: 10,
      allowNegative: false,
      useDecimals: false,
      timeLimit: 0,  // 0 = no per-problem limit
      pointsCorrect: 10,
      pointsWrong: -5
    };
    
    // Apply variation modifiers
    switch (SpeedChallenge.variation) {
      case 0: // Addition Only
        break;
      case 1: // Mixed Operations
        baseConfig.operations = ['+', '-', '×'];
        break;
      case 2: // Time Pressure
        baseConfig.timeLimit = 5000; // 5 seconds
        break;
      case 3: // Negative Numbers
        baseConfig.allowNegative = true;
        baseConfig.operations = ['+', '-'];
        break;
      case 4: // Fractions & Decimals
        baseConfig.useDecimals = true;
        break;
    }
    
    // Apply difficulty modifiers
    const diff = SpeedChallenge.difficulty;
    baseConfig.maxNumber = Math.min(100, 10 + (diff * 8));
    if (diff > 3) {
      baseConfig.operations = ['+', '-', '×'];
    }
    if (baseConfig.timeLimit > 0) {
      baseConfig.timeLimit = Math.max(2000, baseConfig.timeLimit - (diff * 300));
    }
    
    return baseConfig;
  },
  
  // Generate a math problem
  generateProblem: () => {
    const config = SpeedChallenge.getConfig();
    const op = config.operations[Utils.random(0, config.operations.length - 1)];
    
    let a, b, answer;
    
    if (config.useDecimals) {
      a = (Utils.random(1, config.maxNumber) / 4).toFixed(2);
      b = (Utils.random(1, config.maxNumber) / 4).toFixed(2);
      a = parseFloat(a);
      b = parseFloat(b);
    } else {
      a = Utils.random(1, config.maxNumber);
      b = Utils.random(1, config.maxNumber);
    }
    
    if (config.allowNegative && Math.random() > 0.5) {
      a = -a;
    }
    
    // Ensure subtraction doesn't go too negative for simple mode
    if (op === '-' && !config.allowNegative && b > a) {
      [a, b] = [b, a];
    }
    
    // Calculate answer
    switch (op) {
      case '+':
        answer = a + b;
        break;
      case '-':
        answer = a - b;
        break;
      case '×':
        // Keep multiplication simpler
        b = Utils.random(1, Math.min(12, Math.floor(config.maxNumber / 2)));
        answer = a * b;
        break;
    }
    
    // Format answer for decimals
    if (config.useDecimals) {
      answer = parseFloat(answer.toFixed(2));
    }
    
    return {
      display: `${a} ${op} ${b} = ?`,
      answer: answer.toString(),
      a, b, op
    };
  },
  
  // Initialize
  init: (gameArea, difficulty, variation) => {
    SpeedChallenge.gameArea = gameArea;
    SpeedChallenge.difficulty = difficulty;
    SpeedChallenge.variation = variation;
    SpeedChallenge.score = 0;
    SpeedChallenge.currentAnswer = '';
    SpeedChallenge.problemsSolved = 0;
    
    SpeedChallenge.buildUI();
  },
  
  // Build game UI
  buildUI: () => {
    const gameArea = SpeedChallenge.gameArea;
    gameArea.innerHTML = '';
    
    const container = document.createElement('div');
    container.className = 'math-container';
    
    // Problem display
    const problem = document.createElement('div');
    problem.className = 'math-problem';
    problem.textContent = '...';
    SpeedChallenge.problemElement = problem;
    container.appendChild(problem);
    
    // Answer input display
    const input = document.createElement('div');
    input.className = 'math-input';
    input.textContent = '_';
    SpeedChallenge.inputElement = input;
    container.appendChild(input);
    
    // Keypad
    const keypad = document.createElement('div');
    keypad.className = 'math-keypad';
    
    // Number keys 1-9
    for (let i = 1; i <= 9; i++) {
      const key = SpeedChallenge.createKey(i.toString());
      keypad.appendChild(key);
    }
    
    // Negative sign
    const negKey = SpeedChallenge.createKey('-', 'negative');
    keypad.appendChild(negKey);
    
    // 0
    const zeroKey = SpeedChallenge.createKey('0');
    keypad.appendChild(zeroKey);
    
    // Clear/backspace
    const clearKey = SpeedChallenge.createKey('⌫', 'clear');
    keypad.appendChild(clearKey);
    
    // Decimal point (if needed)
    const config = SpeedChallenge.getConfig();
    if (config.useDecimals) {
      const dotKey = SpeedChallenge.createKey('.');
      keypad.appendChild(dotKey);
    }
    
    container.appendChild(keypad);
    gameArea.appendChild(container);
  },
  
  // Create keypad button
  createKey: (value, className = '') => {
    const key = document.createElement('button');
    key.className = `math-key ${className}`;
    key.textContent = value;
    
    const handleTap = (e) => {
      e.preventDefault();
      SpeedChallenge.handleKeyPress(value);
    };
    
    key.addEventListener('click', handleTap);
    key.addEventListener('touchstart', handleTap, { passive: false });
    
    return key;
  },
  
  // Handle keypad press
  handleKeyPress: (value) => {
    if (value === '⌫') {
      // Backspace
      SpeedChallenge.currentAnswer = SpeedChallenge.currentAnswer.slice(0, -1);
    } else if (value === '-') {
      // Toggle negative
      if (SpeedChallenge.currentAnswer.startsWith('-')) {
        SpeedChallenge.currentAnswer = SpeedChallenge.currentAnswer.slice(1);
      } else {
        SpeedChallenge.currentAnswer = '-' + SpeedChallenge.currentAnswer;
      }
    } else {
      // Add digit
      if (SpeedChallenge.currentAnswer.length < 10) {
        SpeedChallenge.currentAnswer += value;
      }
    }
    
    // Update display
    SpeedChallenge.inputElement.textContent = SpeedChallenge.currentAnswer || '_';
    
    Utils.vibrate(10);
    
    // Check if answer is correct
    SpeedChallenge.checkAnswer();
  },
  
  // Check current answer
  checkAnswer: () => {
    const config = SpeedChallenge.getConfig();
    
    if (SpeedChallenge.currentAnswer === SpeedChallenge.currentProblem.answer) {
      // Correct!
      SpeedChallenge.score += config.pointsCorrect;
      SpeedChallenge.problemsSolved++;
      Game.updateScore(SpeedChallenge.score);
      
      Utils.vibrate([20, 30, 20]);
      
      // Clear timer if exists
      if (SpeedChallenge.problemTimer) {
        clearTimeout(SpeedChallenge.problemTimer);
      }
      
      // Flash success
      SpeedChallenge.problemElement.style.color = '#06d6a0';
      setTimeout(() => {
        SpeedChallenge.problemElement.style.color = '';
        SpeedChallenge.nextProblem();
      }, 200);
    }
  },
  
  // Move to next problem
  nextProblem: () => {
    SpeedChallenge.currentAnswer = '';
    SpeedChallenge.inputElement.textContent = '_';
    SpeedChallenge.currentProblem = SpeedChallenge.generateProblem();
    SpeedChallenge.problemElement.textContent = SpeedChallenge.currentProblem.display;
    
    // Start timer if time limit exists
    const config = SpeedChallenge.getConfig();
    if (config.timeLimit > 0) {
      SpeedChallenge.problemTimer = setTimeout(() => {
        // Time's up for this problem, move on with penalty
        SpeedChallenge.score += config.pointsWrong;
        Game.updateScore(SpeedChallenge.score);
        SpeedChallenge.problemElement.style.color = '#ef233c';
        setTimeout(() => {
          SpeedChallenge.problemElement.style.color = '';
          SpeedChallenge.nextProblem();
        }, 200);
      }, config.timeLimit);
    }
  },
  
  // Start
  start: () => {
    SpeedChallenge.nextProblem();
  },
  
  // Update (not used)
  update: () => {},
  
  // End
  end: () => {
    if (SpeedChallenge.problemTimer) {
      clearTimeout(SpeedChallenge.problemTimer);
    }
    
    return {
      score: Math.max(0, SpeedChallenge.score),
      metrics: {
        problemsSolved: SpeedChallenge.problemsSolved
      }
    };
  },
  
  // Cleanup
  cleanup: () => {
    if (SpeedChallenge.problemTimer) {
      clearTimeout(SpeedChallenge.problemTimer);
    }
  }
};

