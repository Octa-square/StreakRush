// ========================================
// STREAKRUSH - 60 SIMPLE GAMES
// All games are instantly understandable
// ========================================

const GAMES = [
  // === REFLEX GAMES (1-10) ===
  { id: 1, name: 'Tap Green', icon: '🟢', category: 'reflex', instruction: 'Tap the GREEN circles!' },
  { id: 2, name: 'Pop Bubbles', icon: '🫧', category: 'reflex', instruction: 'Pop all the bubbles!' },
  { id: 3, name: 'Catch Stars', icon: '⭐', category: 'reflex', instruction: 'Catch the falling stars!' },
  { id: 4, name: 'Whack Mole', icon: '🐹', category: 'reflex', instruction: 'Whack the moles!' },
  { id: 5, name: 'Tap Fast', icon: '👆', category: 'reflex', instruction: 'Tap as fast as you can!' },
  { id: 6, name: 'Avoid Red', icon: '🔴', category: 'reflex', instruction: 'Tap GREEN, avoid RED!' },
  { id: 7, name: 'Shrinking Dots', icon: '⚫', category: 'reflex', instruction: 'Tap before they vanish!' },
  { id: 8, name: 'Moving Targets', icon: '🎯', category: 'reflex', instruction: 'Tap the moving targets!' },
  { id: 9, name: 'Color Match', icon: '🎨', category: 'reflex', instruction: 'Tap the matching color!' },
  { id: 10, name: 'Quick Tap', icon: '⚡', category: 'reflex', instruction: 'Tap when you see GREEN!' },

  // === MEMORY GAMES (11-20) ===
  { id: 11, name: 'Copy Pattern', icon: '🧠', category: 'memory', instruction: 'Repeat the pattern!' },
  { id: 12, name: 'Find Pairs', icon: '🃏', category: 'memory', instruction: 'Match the pairs!' },
  { id: 13, name: 'Remember Number', icon: '🔢', category: 'memory', instruction: 'Remember the number!' },
  { id: 14, name: 'What Missing', icon: '❓', category: 'memory', instruction: 'What disappeared?' },
  { id: 15, name: 'Color Order', icon: '🌈', category: 'memory', instruction: 'Remember the colors!' },
  { id: 16, name: 'Spot Change', icon: '👀', category: 'memory', instruction: 'What changed?' },
  { id: 17, name: 'Copy Grid', icon: '📋', category: 'memory', instruction: 'Copy the pattern!' },
  { id: 18, name: 'Sequence', icon: '1️⃣', category: 'memory', instruction: 'Remember the sequence!' },
  { id: 19, name: 'Position', icon: '📍', category: 'memory', instruction: 'Remember positions!' },
  { id: 20, name: 'Flash Memory', icon: '💡', category: 'memory', instruction: 'Remember what flashed!' },

  // === MATH GAMES (21-30) ===
  { id: 21, name: 'Quick Add', icon: '➕', category: 'math', instruction: 'Add the numbers!' },
  { id: 22, name: 'Quick Subtract', icon: '➖', category: 'math', instruction: 'Subtract the numbers!' },
  { id: 23, name: 'Quick Multiply', icon: '✖️', category: 'math', instruction: 'Multiply the numbers!' },
  { id: 24, name: 'Bigger Number', icon: '⚖️', category: 'math', instruction: 'Pick the BIGGER number!' },
  { id: 25, name: 'Count Fast', icon: '🔢', category: 'math', instruction: 'Count the objects!' },
  { id: 26, name: 'Add to 10', icon: '🔟', category: 'math', instruction: 'Find pairs that = 10!' },
  { id: 27, name: 'Even or Odd', icon: '🎲', category: 'math', instruction: 'Even or Odd?' },
  { id: 28, name: 'Double It', icon: '2️⃣', category: 'math', instruction: 'What is double?' },
  { id: 29, name: 'Half It', icon: '½', category: 'math', instruction: 'What is half?' },
  { id: 30, name: 'Missing Number', icon: '🔍', category: 'math', instruction: 'Find the missing number!' },

  // === REACTION GAMES (31-40) ===
  { id: 31, name: 'Green Light', icon: '🚦', category: 'reaction', instruction: 'Tap on GREEN light!' },
  { id: 32, name: 'Wait For It', icon: '⏳', category: 'reaction', instruction: 'Wait... then TAP!' },
  { id: 33, name: 'Speed Tap', icon: '🏃', category: 'reaction', instruction: 'Tap 50 times fast!' },
  { id: 34, name: 'Left or Right', icon: '↔️', category: 'reaction', instruction: 'Swipe the right way!' },
  { id: 35, name: 'Up or Down', icon: '↕️', category: 'reaction', instruction: 'Swipe the right way!' },
  { id: 36, name: 'Stop Clock', icon: '⏱️', category: 'reaction', instruction: 'Stop at the target!' },
  { id: 37, name: 'Catch Drop', icon: '🧺', category: 'reaction', instruction: 'Catch falling items!' },
  { id: 38, name: 'Dodge', icon: '🏃', category: 'reaction', instruction: 'Dodge the obstacles!' },
  { id: 39, name: 'Follow', icon: '👉', category: 'reaction', instruction: 'Follow the finger!' },
  { id: 40, name: 'React', icon: '⚡', category: 'reaction', instruction: 'React when you see it!' },

  // === WORD GAMES (41-50) ===
  { id: 41, name: 'Type Fast', icon: '⌨️', category: 'words', instruction: 'Type the word!' },
  { id: 42, name: 'First Letter', icon: '🔤', category: 'words', instruction: 'What letter is first?' },
  { id: 43, name: 'Word Length', icon: '📏', category: 'words', instruction: 'How many letters?' },
  { id: 44, name: 'Rhyme', icon: '🎤', category: 'words', instruction: 'Pick the rhyme!' },
  { id: 45, name: 'Spell Check', icon: '✅', category: 'words', instruction: 'Is it spelled right?' },
  { id: 46, name: 'Unscramble', icon: '🔀', category: 'words', instruction: 'Unscramble the word!' },
  { id: 47, name: 'Category', icon: '📁', category: 'words', instruction: 'Pick the category!' },
  { id: 48, name: 'Opposite', icon: '↔️', category: 'words', instruction: 'Pick the opposite!' },
  { id: 49, name: 'Same Meaning', icon: '🟰', category: 'words', instruction: 'Same meaning?' },
  { id: 50, name: 'Missing Letter', icon: '🅰️', category: 'words', instruction: 'What letter is missing?' },

  // === VISUAL GAMES (51-60) ===
  { id: 51, name: 'Odd One Out', icon: '🔍', category: 'visual', instruction: 'Find the different one!' },
  { id: 52, name: 'Count Colors', icon: '🔴', category: 'visual', instruction: 'How many red?' },
  { id: 53, name: 'Find Shape', icon: '🔷', category: 'visual', instruction: 'Find the shape!' },
  { id: 54, name: 'Mirror', icon: '🪞', category: 'visual', instruction: 'Pick the mirror image!' },
  { id: 55, name: 'Next Pattern', icon: '❓', category: 'visual', instruction: 'What comes next?' },
  { id: 56, name: 'Same Color', icon: '🎨', category: 'visual', instruction: 'Are they the same color?' },
  { id: 57, name: 'Bigger Shape', icon: '📐', category: 'visual', instruction: 'Which is bigger?' },
  { id: 58, name: 'Sort Colors', icon: '🌈', category: 'visual', instruction: 'Sort by color!' },
  { id: 59, name: 'Connect', icon: '🔗', category: 'visual', instruction: 'Connect the matches!' },
  { id: 60, name: 'Complete', icon: '🧩', category: 'visual', instruction: 'Complete the pattern!' }
];

// Get game by ID
function getGameById(id) {
  return GAMES.find(g => g.id === id);
}

// Get random games for today (10 games)
function getTodayGames(seed) {
  const shuffled = [...GAMES].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 10);
}

// Get games by category
function getGamesByCategory(category) {
  return GAMES.filter(g => g.category === category);
}

