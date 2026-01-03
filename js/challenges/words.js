// ========================================
// STREAKRUSH - WORDS CHALLENGE
// Speed Typing
// ========================================

const WordsChallenge = {
  name: 'words',
  score: 0,
  isActive: false,
  gameArea: null,
  difficulty: 1,
  variation: 0,
  currentWord: '',
  wordElement: null,
  inputElement: null,
  wordsCompleted: 0,
  wordIndex: 0,
  wordList: [],
  
  // Configuration
  getConfig: () => {
    const baseConfig = {
      wordType: 'short',  // short, medium, long, phrases
      pointsPerLetter: 10,
      exactMatch: true    // Must be exact (no autocorrect)
    };
    
    // Apply variation modifiers
    switch (WordsChallenge.variation) {
      case 0: // Short Words
        baseConfig.wordType = 'short';
        break;
      case 1: // Medium Words
        baseConfig.wordType = 'medium';
        break;
      case 2: // Long Words
        baseConfig.wordType = 'long';
        break;
      case 3: // Phrases
        baseConfig.wordType = 'phrases';
        break;
      case 4: // Exact Match (harder scoring)
        baseConfig.wordType = 'medium';
        baseConfig.pointsPerLetter = 15;
        break;
    }
    
    // Apply difficulty modifiers
    const diff = WordsChallenge.difficulty;
    if (diff > 3) {
      baseConfig.wordType = 'medium';
    }
    if (diff > 6) {
      baseConfig.wordType = 'long';
    }
    
    return baseConfig;
  },
  
  // Initialize
  init: (gameArea, difficulty, variation) => {
    WordsChallenge.gameArea = gameArea;
    WordsChallenge.difficulty = difficulty;
    WordsChallenge.variation = variation;
    WordsChallenge.score = 0;
    WordsChallenge.wordsCompleted = 0;
    WordsChallenge.wordIndex = 0;
    WordsChallenge.isActive = true;
    
    // Prepare word list
    const config = WordsChallenge.getConfig();
    WordsChallenge.wordList = Utils.shuffle([...WORD_LISTS[config.wordType]]);
    
    WordsChallenge.buildUI();
  },
  
  // Build UI
  buildUI: () => {
    const gameArea = WordsChallenge.gameArea;
    gameArea.innerHTML = '';
    
    const container = document.createElement('div');
    container.className = 'typing-container';
    
    // Target word display
    const wordDisplay = document.createElement('div');
    wordDisplay.className = 'target-word';
    wordDisplay.textContent = '...';
    WordsChallenge.wordElement = wordDisplay;
    container.appendChild(wordDisplay);
    
    // Text input
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'typing-input';
    input.placeholder = 'Type here...';
    input.autocomplete = 'off';
    input.autocapitalize = 'off';
    input.autocorrect = 'off';
    input.spellcheck = false;
    WordsChallenge.inputElement = input;
    
    input.addEventListener('input', WordsChallenge.handleInput);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        WordsChallenge.checkWord();
      }
    });
    
    container.appendChild(input);
    
    // Progress
    const progress = document.createElement('div');
    progress.className = 'word-progress';
    progress.id = 'word-progress';
    progress.textContent = 'Words: 0';
    container.appendChild(progress);
    
    gameArea.appendChild(container);
  },
  
  // Get next word
  getNextWord: () => {
    const list = WordsChallenge.wordList;
    const word = list[WordsChallenge.wordIndex % list.length];
    WordsChallenge.wordIndex++;
    return word;
  },
  
  // Show next word
  showNextWord: () => {
    if (!WordsChallenge.isActive) return;
    
    WordsChallenge.currentWord = WordsChallenge.getNextWord();
    WordsChallenge.wordElement.textContent = WordsChallenge.currentWord;
    WordsChallenge.inputElement.value = '';
    WordsChallenge.inputElement.className = 'typing-input';
    WordsChallenge.inputElement.focus();
  },
  
  // Handle input changes
  handleInput: () => {
    if (!WordsChallenge.isActive) return;
    
    const input = WordsChallenge.inputElement.value.toLowerCase();
    const target = WordsChallenge.currentWord.toLowerCase();
    
    // Check if matches so far
    if (target.startsWith(input)) {
      WordsChallenge.inputElement.className = 'typing-input';
    } else {
      WordsChallenge.inputElement.className = 'typing-input wrong';
    }
    
    // Check if complete
    if (input === target) {
      WordsChallenge.handleCorrect();
    }
  },
  
  // Handle correct word
  handleCorrect: () => {
    const config = WordsChallenge.getConfig();
    const points = WordsChallenge.currentWord.length * config.pointsPerLetter;
    
    WordsChallenge.score += points;
    WordsChallenge.wordsCompleted++;
    
    Game.updateScore(WordsChallenge.score);
    
    // Update progress
    document.getElementById('word-progress').textContent = 
      `Words: ${WordsChallenge.wordsCompleted}`;
    
    // Visual feedback
    WordsChallenge.inputElement.className = 'typing-input correct';
    Utils.vibrate([15, 20, 15]);
    
    // Show next word after brief delay
    setTimeout(() => {
      WordsChallenge.showNextWord();
    }, 200);
  },
  
  // Check word (on Enter)
  checkWord: () => {
    const input = WordsChallenge.inputElement.value.toLowerCase();
    const target = WordsChallenge.currentWord.toLowerCase();
    
    if (input === target) {
      WordsChallenge.handleCorrect();
    } else {
      // Wrong - shake and clear
      WordsChallenge.inputElement.className = 'typing-input wrong';
      Utils.vibrate([30, 20, 30]);
      
      setTimeout(() => {
        WordsChallenge.inputElement.value = '';
        WordsChallenge.inputElement.className = 'typing-input';
      }, 300);
    }
  },
  
  // Start
  start: () => {
    WordsChallenge.showNextWord();
    
    // Focus input after a moment
    setTimeout(() => {
      WordsChallenge.inputElement.focus();
    }, 100);
  },
  
  // Update (not used)
  update: () => {},
  
  // End
  end: () => {
    WordsChallenge.isActive = false;
    
    return {
      score: WordsChallenge.score,
      metrics: {
        wordsCompleted: WordsChallenge.wordsCompleted
      }
    };
  },
  
  // Cleanup
  cleanup: () => {
    WordsChallenge.isActive = false;
  }
};

