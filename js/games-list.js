// ========================================
// STREAKRUSH - 365 DISCIPLINE GAMES
// One game for every day of the year!
// ========================================

// Default motivational quotes for games without custom quotes
const DEFAULT_QUOTES = [
  { text: "Discipline is the bridge between goals and accomplishment.", author: "Jim Rohn" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "What you get by achieving your goals is not as important as what you become.", author: "Zig Ziglar" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { text: "Quality is not an act, it is a habit.", author: "Aristotle" },
  { text: "Champions keep playing until they get it right.", author: "Billie Jean King" },
  { text: "Hard work beats talent when talent doesn't work hard.", author: "Tim Notke" },
  { text: "The harder you work, the luckier you get.", author: "Gary Player" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "Progress, not perfection.", author: "Unknown" },
  { text: "Every expert was once a beginner.", author: "Helen Hayes" },
  { text: "Your limitation—it's only your imagination.", author: "Unknown" }
];

// Get a quote for a game (custom or random default)
function getGameQuote(game) {
  if (game.quote) {
    return game.quote;
  }
  // Use game ID to consistently pick the same quote for each game
  const quoteIndex = (game.id - 1) % DEFAULT_QUOTES.length;
  const q = DEFAULT_QUOTES[quoteIndex];
  return `"${q.text}" — ${q.author}`;
}

// Memory-focused categories for brain training
const GAME_CATEGORIES = {
  spatial: { name: 'Spatial Memory', icon: '🗺️', color: '#ef233c', range: [1, 70] },
  numeric: { name: 'Numerical Memory', icon: '🔢', color: '#4361ee', range: [71, 130] },
  visual: { name: 'Visual Memory', icon: '👁️', color: '#06d6a0', range: [131, 190] },
  verbal: { name: 'Verbal Memory', icon: '🔤', color: '#f72585', range: [191, 240] },
  speed: { name: 'Speed Recall', icon: '⚡', color: '#ffd60a', range: [241, 290] },
  pattern: { name: 'Pattern Recognition', icon: '🧩', color: '#7209b7', range: [291, 350] },
  logic: { name: 'Logic & Reasoning', icon: '💡', color: '#ff6b35', range: [351, 365] }
};

// Difficulty levels
const DIFFICULTY = {
  easy: { name: 'Easy', color: '#22c55e', timeBonus: 0, scoreMultiplier: 1.0 },
  medium: { name: 'Medium', color: '#f59e0b', timeBonus: 0, scoreMultiplier: 1.2 },
  hard: { name: 'Hard', color: '#ef4444', timeBonus: 0, scoreMultiplier: 1.5 }
};

// Validate that free games have variety
const validateFreeGameVariety = () => {
  const freeGames = GAMES.slice(0, 20);
  const categories = [...new Set(freeGames.map(g => g.category))];
  const difficulties = freeGames.map(g => g.difficulty);
  
  const easyCount = difficulties.filter(d => d === 'easy').length;
  const mediumCount = difficulties.filter(d => d === 'medium').length;
  const hardCount = difficulties.filter(d => d === 'hard').length;
  
  console.log(`Free games variety: ${categories.length} categories, ${easyCount} easy, ${mediumCount} medium, ${hardCount} hard`);
  return categories.length >= 5;
};

const GAMES = [
  // ========================================
  // 🧠 FIRST 20 FREE GAMES - Variety & Progression!
  // Covers all memory types with increasing difficulty
  // ========================================
  
  // === GAMES 1-5: EASY - Hook the user ===
  { id: 1, name: 'World Capitals', icon: '🌍', category: 'spatial', difficulty: 'easy', instruction: 'Name the capital of each country! Quick - 5 seconds per question!', quote: '"The world is a book, and those who do not travel read only one page." — Saint Augustine', benefits: 'Builds geographic knowledge and spatial memory. Understanding world capitals makes you a more informed global citizen.' },
  
  { id: 2, name: 'Reaction Test', icon: '⚡', category: 'speed', difficulty: 'easy', instruction: 'Tap as FAST as possible when the circle turns green!', quote: '"Speed is useful only if you are running in the right direction." — Joel Barker', benefits: 'Trains reflexes and processing speed. Fast reaction times improve performance in sports, driving, and daily decisions.' },
  
  { id: 3, name: 'Memory Sequence', icon: '🧠', category: 'visual', difficulty: 'easy', instruction: 'Remember and repeat the color pattern!', quote: '"Memory is the treasury and guardian of all things." — Cicero', benefits: 'Strengthens working memory and visual recall. Essential for learning and staying mentally sharp.' },
  
  { id: 4, name: 'Speed Math', icon: '🔢', category: 'numeric', difficulty: 'easy', instruction: 'Solve math problems as fast as you can!', quote: '"Pure mathematics is the poetry of logical ideas." — Albert Einstein', benefits: 'Sharpens mental calculation and numerical fluency. Quick math helps with finances and daily decisions.' },
  
  { id: 5, name: 'Flag Match', icon: '🏳️', category: 'spatial', difficulty: 'easy', instruction: 'Identify which country each flag belongs to!', quote: '"Every nation has its own identity. Learn them all." — Unknown', benefits: 'Enhances visual recognition and cultural awareness. Builds spatial memory through pattern recognition.' },
  
  // === GAMES 6-10: EASY/MEDIUM - Build confidence ===
  { id: 6, name: 'Word Scramble', icon: '🔤', category: 'verbal', difficulty: 'easy', instruction: 'Unscramble words before time runs out!', quote: '"Words are the dress of thoughts." — Lord Chesterfield', benefits: 'Enhances vocabulary and verbal pattern recognition. Strong language skills improve communication.' },
  
  { id: 7, name: 'Pattern Recognition', icon: '🎨', category: 'pattern', difficulty: 'medium', instruction: 'Find the next item in the sequence!', quote: '"The human brain is the most complex pattern-matching machine." — Ray Kurzweil', benefits: 'Develops logical thinking and prediction skills. Pattern recognition is key to problem-solving.' },
  
  { id: 8, name: 'Number Sequence', icon: '🔢', category: 'numeric', difficulty: 'medium', instruction: 'Remember and repeat the number pattern!', quote: '"Numbers are the universal language." — Galileo', benefits: 'Strengthens numerical memory and sequential processing. Essential for math and coding.' },
  
  { id: 9, name: 'True or False', icon: '❓', category: 'verbal', difficulty: 'easy', instruction: 'Is this fact TRUE or FALSE?', quote: '"The truth is rarely pure and never simple." — Oscar Wilde', benefits: 'Builds critical thinking and fact-checking skills. Distinguishing truth from fiction is invaluable.' },
  
  { id: 10, name: 'Color Match', icon: '🎨', category: 'speed', difficulty: 'easy', instruction: 'Tap the color that matches the word (not the color of the text)!', quote: '"Simplicity is the ultimate sophistication." — Leonardo da Vinci', benefits: 'Trains cognitive flexibility and processing speed. Overcoming interference improves focus.' },
  
  // === MILESTONE: GAME 10 = HALFWAY CELEBRATION ===
  
  // === GAMES 11-15: MEDIUM - Increase challenge ===
  { id: 11, name: 'Geography Master', icon: '🗺️', category: 'spatial', difficulty: 'medium', instruction: 'Advanced geography - countries, rivers, mountains!', quote: '"Geography is destiny." — Napoleon Bonaparte', benefits: 'Deep spatial knowledge and world awareness. Understanding geography helps you understand global events.' },
  
  { id: 12, name: 'Math Chains', icon: '➗', category: 'numeric', difficulty: 'medium', instruction: 'Solve chain calculations - each answer feeds the next!', quote: '"Mathematics is the music of reason." — James Joseph Sylvester', benefits: 'Complex numerical processing and working memory. Builds mental calculation endurance.' },
  
  { id: 13, name: 'Memory Grid', icon: '🧩', category: 'visual', difficulty: 'medium', instruction: 'Remember positions of items on the grid!', quote: '"The mind is not a vessel to be filled, but a fire to be kindled." — Plutarch', benefits: 'Spatial working memory and visual attention. Essential for navigation and organization.' },
  
  { id: 14, name: 'Vocabulary Builder', icon: '📚', category: 'verbal', difficulty: 'medium', instruction: 'Match words with their definitions!', quote: '"The limits of my language mean the limits of my world." — Ludwig Wittgenstein', benefits: 'Expands vocabulary and semantic memory. Rich vocabulary improves communication.' },
  
  { id: 15, name: 'Speed Typing', icon: '⌨️', category: 'speed', difficulty: 'medium', instruction: 'Type the words as fast and accurately as possible!', quote: '"Practice makes perfect." — Unknown', benefits: 'Motor memory and processing speed. Fast, accurate typing is a modern essential skill.' },
  
  // === GAMES 16-20: MEDIUM/HARD - Prove mastery ===
  { id: 16, name: 'Population Battle', icon: '👥', category: 'spatial', difficulty: 'medium', instruction: 'Which country has more people? Choose wisely!', quote: '"We are all citizens of one world." — Socrates', benefits: 'Comparative thinking and global perspective. Understanding scale and relative sizes.' },
  
  { id: 17, name: 'Calculation Speed', icon: '🧮', category: 'numeric', difficulty: 'hard', instruction: 'Complex calculations under extreme time pressure!', quote: '"Do not worry about your difficulties in mathematics. I can assure you mine are still greater." — Einstein', benefits: 'Peak numerical processing under pressure. Mental math mastery builds confidence.' },
  
  { id: 18, name: 'Visual Memory Test', icon: '👁️', category: 'visual', difficulty: 'hard', instruction: 'What changed? Spot the difference!', quote: '"The eye sees only what the mind is prepared to comprehend." — Robertson Davies', benefits: 'Detailed visual memory and attention. Spotting changes improves observation skills.' },
  
  { id: 19, name: 'Anagram Solver', icon: '🔡', category: 'verbal', difficulty: 'hard', instruction: 'Rearrange letters to form words - multiple solutions!', quote: '"Language is the road map of a culture." — Rita Mae Brown', benefits: 'Advanced verbal processing and creativity. Anagrams build flexible thinking.' },
  
  { id: 20, name: 'Ultimate Challenge', icon: '🏆', category: 'pattern', difficulty: 'hard', instruction: 'Mixed challenges from all categories - prove your mastery!', quote: '"Knowledge is power." — Francis Bacon', benefits: 'Tests all memory types and mental agility. The ultimate brain training challenge!' },
  
  // === PREMIUM GAMES START HERE (21-365) ===
  { id: 21, name: 'Habit Stack Builder', icon: '📚', category: 'discipline', instruction: 'Stack habits in the correct order', quote: '"We are what we repeatedly do." — Aristotle' },
  { id: 22, name: 'No Multitasking Day', icon: '🎯', category: 'discipline', instruction: 'Focus on one task at a time only', quote: '"The successful warrior is the average man with laser-like focus." — Bruce Lee' },
  { id: 23, name: 'Clean As You Go', icon: '🧹', category: 'discipline', instruction: 'Clean items as they appear', quote: '"For every minute spent organizing, an hour is earned." — Benjamin Franklin' },
  { id: 24, name: 'No Excuse Tracker', icon: '🚫', category: 'discipline', instruction: 'Identify and block excuses', quote: '"Excuses make today easy but tomorrow hard." — Unknown' },
  { id: 25, name: 'Win the Morning', icon: '🌄', category: 'discipline', instruction: 'Complete all morning routine tasks', quote: '"Win the morning, win the day." — Tim Ferriss' },
  { id: 26, name: 'Minimum Effort Trap', icon: '⚠️', category: 'discipline', instruction: 'Always exceed minimum - go extra!', quote: '"There are no shortcuts to any place worth going." — Beverly Sills' },
  { id: 27, name: 'Discipline Roulette', icon: '🎰', category: 'discipline', instruction: 'Spin and complete random challenges', quote: '"Discipline is the bridge between goals and accomplishment." — Jim Rohn' },
  { id: 28, name: 'One Win Hour', icon: '🏆', category: 'discipline', instruction: 'Maximize productivity in focused time', quote: '"Focus on being productive instead of busy." — Tim Ferriss' },
  { id: 29, name: 'No Zero Days', icon: '📅', category: 'discipline', instruction: 'Do at least one productive thing', quote: '"A journey of a thousand miles begins with a single step." — Lao Tzu' },
  { id: 30, name: 'Execute One Plan', icon: '📋', category: 'discipline', instruction: 'Follow the plan exactly as shown', quote: '"Plans are nothing; planning is everything." — Dwight D. Eisenhower' },
  { id: 31, name: 'Focus Sprint', icon: '🏃', category: 'discipline', instruction: 'Maintain focus through distractions', quote: '"Concentration is the secret of strength." — Ralph Waldo Emerson' },
  { id: 32, name: 'Finish Line Day', icon: '🏁', category: 'discipline', instruction: 'Cross every finish line', quote: '"The race is not to the swift, but to those who keep running." — Unknown' },
  { id: 33, name: 'Show Up Game', icon: '👋', category: 'discipline', instruction: 'Be present - tap when called', quote: '"80% of success is showing up." — Woody Allen' },
  { id: 34, name: 'No Comfort Mode', icon: '🔥', category: 'discipline', instruction: 'Choose hard over easy every time', quote: '"Life begins at the end of your comfort zone." — Neale Donald Walsch' },
  { id: 35, name: 'Hard Before Easy', icon: '💎', category: 'discipline', instruction: 'Complete hard tasks first', quote: '"Eat a live frog first thing in the morning." — Mark Twain' },
  { id: 36, name: 'Early Start Bonus', icon: '🌅', category: 'discipline', instruction: 'Start before the deadline', quote: '"The early bird catches the worm." — Proverb' },
  { id: 37, name: 'End Strong', icon: '💪', category: 'discipline', instruction: 'Finish with maximum effort', quote: '"It is not how you start that matters, it is how you finish." — Unknown' },
  { id: 38, name: 'Discipline Bingo', icon: '🎱', category: 'discipline', instruction: 'Complete the discipline pattern', quote: '"Small disciplines repeated daily lead to great achievements." — John Maxwell' },
  { id: 39, name: 'One Commitment Lock', icon: '🔒', category: 'discipline', instruction: 'Lock in and honor commitments', quote: '"Commitment is what transforms a promise into reality." — Abraham Lincoln' },
  { id: 40, name: 'No Delay Button', icon: '⏸️', category: 'discipline', instruction: 'Never hit delay - act now!', quote: '"The best time to plant a tree was 20 years ago. The second best time is now." — Chinese Proverb' },
  { id: 41, name: 'Routine Keeper', icon: '🔄', category: 'discipline', instruction: 'Maintain your routine perfectly', quote: '"Motivation gets you started. Habit keeps you going." — Jim Rohn' },
  { id: 42, name: 'Self-Control Timer', icon: '⏰', category: 'discipline', instruction: 'Resist temptations until timer ends' },
  { id: 43, name: 'Task Chain', icon: '⛓️', category: 'discipline', instruction: 'Complete tasks in sequence' },
  { id: 44, name: 'Momentum Builder', icon: '🚀', category: 'discipline', instruction: 'Build unstoppable momentum' },
  { id: 45, name: 'No Scroll Until Done', icon: '📱', category: 'discipline', instruction: 'Block scrolling until tasks complete' },
  { id: 46, name: '3 Tasks Only', icon: '3️⃣', category: 'discipline', instruction: 'Focus on exactly 3 priorities' },
  { id: 47, name: 'No Excuses Journal', icon: '📓', category: 'discipline', instruction: 'Log actions, not excuses' },
  { id: 48, name: 'Win the First 10 Minutes', icon: '🔟', category: 'discipline', instruction: 'Dominate the first 10 minutes' },
  { id: 49, name: 'Do It Ugly', icon: '🎭', category: 'discipline', instruction: 'Start imperfectly but START' },
  { id: 50, name: 'Action Over Thinking', icon: '⚡', category: 'discipline', instruction: 'Act fast, think less' },
  { id: 51, name: 'Discipline Streak Guard', icon: '🔥', category: 'discipline', instruction: 'Protect your streak at all costs' },
  { id: 52, name: 'Finish Fast', icon: '🏎️', category: 'discipline', instruction: 'Complete tasks quickly' },
  { id: 53, name: 'Beat the Clock', icon: '⏰', category: 'discipline', instruction: 'Finish before time runs out' },
  { id: 54, name: 'No Backtracking', icon: '➡️', category: 'discipline', instruction: 'Move forward only' },
  { id: 55, name: 'Task Hunter', icon: '🎯', category: 'discipline', instruction: 'Find and complete hidden tasks' },
  { id: 56, name: 'Daily Order Game', icon: '📊', category: 'discipline', instruction: 'Put your day in order' },
  { id: 57, name: 'Execute the Plan', icon: '✅', category: 'discipline', instruction: 'Follow through completely' },
  { id: 58, name: 'Self-Command Day', icon: '👑', category: 'discipline', instruction: 'Command yourself to act' },
  { id: 59, name: 'No Comfort Swap', icon: '🔄', category: 'discipline', instruction: 'No trading hard for easy' },
  { id: 60, name: 'Do It Alone', icon: '🦁', category: 'discipline', instruction: 'Complete solo challenges' },
  { id: 61, name: 'Focus Lock', icon: '🔐', category: 'discipline', instruction: 'Lock focus, block distractions' },
  { id: 62, name: 'One Rule Day', icon: '1️⃣', category: 'discipline', instruction: 'Follow one rule perfectly' },
  { id: 63, name: 'Discipline Ladder', icon: '🪜', category: 'discipline', instruction: 'Climb up with each completion' },
  { id: 64, name: 'The Hard Choice', icon: '💎', category: 'discipline', instruction: 'Always choose the harder path' },
  { id: 65, name: 'One Promise Kept', icon: '🤝', category: 'discipline', instruction: 'Keep every promise you make' },
  { id: 66, name: 'No Retreat Day', icon: '⚔️', category: 'discipline', instruction: 'Never step back' },
  { id: 67, name: 'Consistency Trial', icon: '📈', category: 'discipline', instruction: 'Stay consistent under pressure' },
  { id: 68, name: 'Discipline Reset', icon: '🔄', category: 'discipline', instruction: 'Reset and restart strong' },
  { id: 69, name: 'Structure Builder', icon: '🏗️', category: 'discipline', instruction: 'Build structure piece by piece' },
  { id: 70, name: 'Order From Chaos', icon: '🌀', category: 'discipline', instruction: 'Create order from chaos' },

  // ========================================
  // 🧠 MENTAL & COGNITIVE GAMES (71-130)
  // ========================================
  { id: 71, name: 'Memory Snapshot', icon: '📸', category: 'mental', instruction: 'Remember the pattern shown' },
  { id: 72, name: 'Recall the Day', icon: '📅', category: 'mental', instruction: 'Recall events in order' },
  { id: 73, name: 'Pattern Spotter', icon: '🔍', category: 'mental', instruction: 'Find the hidden pattern' },
  { id: 74, name: 'Mental Math Sprint', icon: '🔢', category: 'mental', instruction: 'Solve math problems fast' },
  { id: 75, name: 'Word Chain', icon: '🔗', category: 'mental', instruction: 'Connect words by last letter' },
  { id: 76, name: 'Thought Catcher', icon: '💭', category: 'mental', instruction: 'Catch positive thoughts only' },
  { id: 77, name: 'Attention Anchor', icon: '⚓', category: 'mental', instruction: 'Stay anchored to the focus point' },
  { id: 78, name: 'Focus Maze', icon: '🌀', category: 'mental', instruction: 'Navigate without losing focus' },
  { id: 79, name: 'Mind Silence Timer', icon: '🧘', category: 'mental', instruction: 'Maintain mental silence' },
  { id: 80, name: 'Thought Replacement', icon: '🔄', category: 'mental', instruction: 'Replace negative with positive' },
  { id: 81, name: 'Mental Clarity Test', icon: '💎', category: 'mental', instruction: 'Achieve perfect clarity' },
  { id: 82, name: 'Logic Lock', icon: '🔐', category: 'mental', instruction: 'Solve logical sequences' },
  { id: 83, name: 'Reaction Time Tap', icon: '⚡', category: 'mental', instruction: 'React as fast as possible' },
  { id: 84, name: 'Cognitive Flex', icon: '🤸', category: 'mental', instruction: 'Switch between task types' },
  { id: 85, name: 'Distraction Dodge', icon: '🛡️', category: 'mental', instruction: 'Avoid all distractions' },
  { id: 86, name: 'Memory Grid', icon: '🔲', category: 'mental', instruction: 'Remember tile positions' },
  { id: 87, name: 'Idea Compression', icon: '📦', category: 'mental', instruction: 'Simplify complex ideas' },
  { id: 88, name: 'Reverse Thinking', icon: '🔙', category: 'mental', instruction: 'Solve problems backwards' },
  { id: 89, name: 'Mental Endurance', icon: '🏋️', category: 'mental', instruction: 'Last through mental challenges' },
  { id: 90, name: 'Focus vs Fatigue', icon: '😴', category: 'mental', instruction: 'Stay focused despite fatigue' },
  { id: 91, name: 'Thought Sorting', icon: '📊', category: 'mental', instruction: 'Sort thoughts by category' },
  { id: 92, name: 'Mental Reset', icon: '🔄', category: 'mental', instruction: 'Clear and reset your mind' },
  { id: 93, name: 'Calm Under Pressure', icon: '😌', category: 'mental', instruction: 'Stay calm as pressure builds' },
  { id: 94, name: 'Fast Decision Drill', icon: '⚡', category: 'mental', instruction: 'Make quick decisions' },
  { id: 95, name: 'Mind Control Trial', icon: '🧠', category: 'mental', instruction: 'Control your reactions' },
  { id: 96, name: 'Memory Ladder', icon: '🪜', category: 'mental', instruction: 'Climb by remembering more' },
  { id: 97, name: 'Recall Under Stress', icon: '😰', category: 'mental', instruction: 'Remember despite stress' },
  { id: 98, name: 'Clarity Builder', icon: '🔨', category: 'mental', instruction: 'Build mental clarity' },
  { id: 99, name: 'Thought Speed Run', icon: '🏃', category: 'mental', instruction: 'Process thoughts quickly' },
  { id: 100, name: 'Attention Span Test', icon: '⏱️', category: 'mental', instruction: 'Test your attention span' },
  { id: 101, name: 'Brain Warm-Up', icon: '🧠', category: 'mental', instruction: 'Warm up your brain' },
  { id: 102, name: 'Cognitive Load Challenge', icon: '⚖️', category: 'mental', instruction: 'Handle multiple inputs' },
  { id: 103, name: 'Mental Precision', icon: '🎯', category: 'mental', instruction: 'Be precisely accurate' },
  { id: 104, name: 'Distraction Resistance', icon: '🛡️', category: 'mental', instruction: 'Resist all distractions' },
  { id: 105, name: 'Focus Streak', icon: '🔥', category: 'mental', instruction: 'Maintain focus streak' },
  { id: 106, name: 'One Thought Only', icon: '1️⃣', category: 'mental', instruction: 'Hold one thought at a time' },
  { id: 107, name: 'Memory Expansion', icon: '📈', category: 'mental', instruction: 'Expand memory capacity' },
  { id: 108, name: 'Decision Accuracy', icon: '✅', category: 'mental', instruction: 'Make accurate decisions' },
  { id: 109, name: 'Logic Puzzle Rush', icon: '🧩', category: 'mental', instruction: 'Solve puzzles quickly' },
  { id: 110, name: 'Mental Flexibility', icon: '🤸', category: 'mental', instruction: 'Adapt to changing rules' },
  { id: 111, name: 'Thought Awareness', icon: '👁️', category: 'mental', instruction: 'Be aware of each thought' },
  { id: 112, name: 'Concentration Sprint', icon: '🏃', category: 'mental', instruction: 'Intense concentration burst' },
  { id: 113, name: 'Pattern Recall', icon: '🔄', category: 'mental', instruction: 'Recall shown patterns' },
  { id: 114, name: 'Mental Balance', icon: '⚖️', category: 'mental', instruction: 'Balance mental load' },
  { id: 115, name: 'Clarity Countdown', icon: '⏳', category: 'mental', instruction: 'Achieve clarity before time' },
  { id: 116, name: 'Cognitive Endurance', icon: '🏋️', category: 'mental', instruction: 'Endure cognitive strain' },
  { id: 117, name: 'Focus Calibration', icon: '🔧', category: 'mental', instruction: 'Calibrate your focus' },
  { id: 118, name: 'Mind Sharpener', icon: '🔪', category: 'mental', instruction: 'Sharpen mental acuity' },
  { id: 119, name: 'Thought Discipline', icon: '🎖️', category: 'mental', instruction: 'Discipline your thoughts' },
  { id: 120, name: 'Mental Minimalism', icon: '🧘', category: 'mental', instruction: 'Minimize mental clutter' },
  { id: 121, name: 'Attention Control', icon: '🎮', category: 'mental', instruction: 'Control where attention goes' },
  { id: 122, name: 'Logic Compression', icon: '📦', category: 'mental', instruction: 'Compress logical steps' },
  { id: 123, name: 'Memory Sprint', icon: '🏃', category: 'mental', instruction: 'Quick memory challenges' },
  { id: 124, name: 'Brain Reset', icon: '🔄', category: 'mental', instruction: 'Reset and refresh' },
  { id: 125, name: 'Mental Order', icon: '📊', category: 'mental', instruction: 'Order mental priorities' },
  { id: 126, name: 'Clarity Lock', icon: '🔒', category: 'mental', instruction: 'Lock in clarity' },
  { id: 127, name: 'Thought Guard', icon: '🛡️', category: 'mental', instruction: 'Guard against negativity' },
  { id: 128, name: 'Focus Forge', icon: '🔥', category: 'mental', instruction: 'Forge unbreakable focus' },
  { id: 129, name: 'Mind Stability', icon: '⚖️', category: 'mental', instruction: 'Maintain mental stability' },
  { id: 130, name: 'Mental Mastery Lite', icon: '👑', category: 'mental', instruction: 'Master your mind' },

  // ========================================
  // 💪 PHYSICAL & MOVEMENT GAMES (131-190)
  // ========================================
  { id: 131, name: '10-Minute Walk Quest', icon: '🚶', category: 'physical', instruction: 'Complete walking challenges' },
  { id: 132, name: 'Step Count Duel', icon: '👟', category: 'physical', instruction: 'Beat the step target' },
  { id: 133, name: 'Stretch Chain', icon: '🧘', category: 'physical', instruction: 'Complete stretches in order' },
  { id: 134, name: 'Posture Guard', icon: '🧍', category: 'physical', instruction: 'Maintain good posture' },
  { id: 135, name: 'Movement Hour', icon: '⏰', category: 'physical', instruction: 'Stay moving for the hour' },
  { id: 136, name: 'No Sitting Timer', icon: '🪑', category: 'physical', instruction: 'Avoid sitting too long' },
  { id: 137, name: 'Balance Test', icon: '⚖️', category: 'physical', instruction: 'Test your balance' },
  { id: 138, name: 'Body Awareness', icon: '👁️', category: 'physical', instruction: 'Be aware of your body' },
  { id: 139, name: 'Mobility Dice', icon: '🎲', category: 'physical', instruction: 'Roll for movement exercises' },
  { id: 140, name: 'One Exercise Only', icon: '1️⃣', category: 'physical', instruction: 'Master one exercise' },
  { id: 141, name: 'Walk & Think', icon: '🚶‍♂️', category: 'physical', instruction: 'Walk while solving puzzles' },
  { id: 142, name: 'Physical Reset', icon: '🔄', category: 'physical', instruction: 'Reset your body' },
  { id: 143, name: 'Movement Streak', icon: '🔥', category: 'physical', instruction: 'Keep moving streak alive' },
  { id: 144, name: 'Slow Movement Control', icon: '🐢', category: 'physical', instruction: 'Control slow movements' },
  { id: 145, name: 'Endurance Lite', icon: '🏃', category: 'physical', instruction: 'Build basic endurance' },
  { id: 146, name: 'Daily Motion', icon: '💫', category: 'physical', instruction: 'Complete daily motions' },
  { id: 147, name: 'Body Control Trial', icon: '🎮', category: 'physical', instruction: 'Control your body precisely' },
  { id: 148, name: 'Active Breaks', icon: '☕', category: 'physical', instruction: 'Take active breaks' },
  { id: 149, name: 'Strength Micro-Challenge', icon: '💪', category: 'physical', instruction: 'Quick strength tests' },
  { id: 150, name: 'Posture Bingo', icon: '🎱', category: 'physical', instruction: 'Complete posture pattern' },
  { id: 151, name: 'Flexibility Test', icon: '🤸', category: 'physical', instruction: 'Test your flexibility' },
  { id: 152, name: 'Controlled Breathing Walk', icon: '🌬️', category: 'physical', instruction: 'Walk with breath control' },
  { id: 153, name: 'Balance Ladder', icon: '🪜', category: 'physical', instruction: 'Progress balance skills' },
  { id: 154, name: 'Body Focus', icon: '🎯', category: 'physical', instruction: 'Focus on body sensations' },
  { id: 155, name: 'Movement Memory', icon: '🧠', category: 'physical', instruction: 'Remember movement patterns' },
  { id: 156, name: 'Energy Activation', icon: '⚡', category: 'physical', instruction: 'Activate your energy' },
  { id: 157, name: 'Physical Presence', icon: '🧍', category: 'physical', instruction: 'Be physically present' },
  { id: 158, name: 'Coordination Drill', icon: '🤹', category: 'physical', instruction: 'Test coordination' },
  { id: 159, name: 'Mobility Flow', icon: '🌊', category: 'physical', instruction: 'Flow through movements' },
  { id: 160, name: 'Step Precision', icon: '👟', category: 'physical', instruction: 'Precise stepping' },
  { id: 161, name: 'Calm Movement', icon: '😌', category: 'physical', instruction: 'Move with calm' },
  { id: 162, name: 'Physical Awareness', icon: '👁️', category: 'physical', instruction: 'Body scan awareness' },
  { id: 163, name: 'Motion Consistency', icon: '📊', category: 'physical', instruction: 'Consistent movement' },
  { id: 164, name: 'Body Discipline', icon: '🎖️', category: 'physical', instruction: 'Discipline your body' },
  { id: 165, name: 'Stability Challenge', icon: '⚖️', category: 'physical', instruction: 'Stay stable' },
  { id: 166, name: 'Form Over Speed', icon: '🎯', category: 'physical', instruction: 'Perfect form first' },
  { id: 167, name: 'Control the Body', icon: '🎮', category: 'physical', instruction: 'Full body control' },
  { id: 168, name: 'Daily Physical Win', icon: '🏆', category: 'physical', instruction: 'Win physically today' },
  { id: 169, name: 'Energy Builder', icon: '🔋', category: 'physical', instruction: 'Build your energy' },
  { id: 170, name: 'Motion Without Music', icon: '🔇', category: 'physical', instruction: 'Move in silence' },
  { id: 171, name: 'Posture Reset', icon: '🔄', category: 'physical', instruction: 'Reset your posture' },
  { id: 172, name: 'Walk Before Sit', icon: '🚶', category: 'physical', instruction: 'Walk first' },
  { id: 173, name: 'Body Scan Game', icon: '📡', category: 'physical', instruction: 'Scan your body' },
  { id: 174, name: 'Physical Minimalism', icon: '🧘', category: 'physical', instruction: 'Minimal effective movement' },
  { id: 175, name: 'Balance Under Fatigue', icon: '😴', category: 'physical', instruction: 'Balance when tired' },
  { id: 176, name: 'Micro Workout Quest', icon: '💪', category: 'physical', instruction: 'Quick micro workouts' },
  { id: 177, name: 'Controlled Motion', icon: '🎮', category: 'physical', instruction: 'Control every motion' },
  { id: 178, name: 'Body Feedback', icon: '📊', category: 'physical', instruction: 'Listen to body feedback' },
  { id: 179, name: 'Physical Endurance Lite', icon: '🏃', category: 'physical', instruction: 'Light endurance test' },
  { id: 180, name: 'Movement Habit Builder', icon: '🏗️', category: 'physical', instruction: 'Build movement habits' },
  { id: 181, name: 'Energy Focus', icon: '🎯', category: 'physical', instruction: 'Focus your energy' },
  { id: 182, name: 'Motion Timer', icon: '⏱️', category: 'physical', instruction: 'Timed movement' },
  { id: 183, name: 'Physical Calm', icon: '😌', category: 'physical', instruction: 'Calm physical state' },
  { id: 184, name: 'Body Command', icon: '👑', category: 'physical', instruction: 'Command your body' },
  { id: 185, name: 'Motion Discipline', icon: '🎖️', category: 'physical', instruction: 'Disciplined movement' },
  { id: 186, name: 'Strength Choice', icon: '💪', category: 'physical', instruction: 'Choose strength' },
  { id: 187, name: 'Balance Precision', icon: '🎯', category: 'physical', instruction: 'Precise balance' },
  { id: 188, name: 'Controlled Pace', icon: '🏃', category: 'physical', instruction: 'Control your pace' },
  { id: 189, name: 'Physical Awareness Lock', icon: '🔒', category: 'physical', instruction: 'Lock in awareness' },
  { id: 190, name: 'Move With Intention', icon: '🎯', category: 'physical', instruction: 'Intentional movement' },

  // ========================================
  // 🎨 CREATIVITY & EXPRESSION GAMES (191-240)
  // ========================================
  { id: 191, name: 'One Sentence Story', icon: '📝', category: 'creativity', instruction: 'Create a story in one sentence' },
  { id: 192, name: '5-Word Challenge', icon: '5️⃣', category: 'creativity', instruction: 'Express using only 5 words' },
  { id: 193, name: 'Daily Doodle', icon: '✏️', category: 'creativity', instruction: 'Create a quick doodle' },
  { id: 194, name: 'Voice Note Journal', icon: '🎤', category: 'creativity', instruction: 'Record voice thoughts' },
  { id: 195, name: 'Idea Spark', icon: '💡', category: 'creativity', instruction: 'Generate new ideas' },
  { id: 196, name: 'One Photo Story', icon: '📷', category: 'creativity', instruction: 'Tell story with one photo' },
  { id: 197, name: 'Creative Constraint', icon: '🔒', category: 'creativity', instruction: 'Create within limits' },
  { id: 198, name: 'Write Without Editing', icon: '✍️', category: 'creativity', instruction: 'Write freely, no edits' },
  { id: 199, name: 'Color Mood', icon: '🎨', category: 'creativity', instruction: 'Express mood with colors' },
  { id: 200, name: 'Story From Objects', icon: '📦', category: 'creativity', instruction: 'Create from random objects' },
  { id: 201, name: 'One Idea Expansion', icon: '🌱', category: 'creativity', instruction: 'Expand one idea fully' },
  { id: 202, name: 'Creative Speed Run', icon: '🏃', category: 'creativity', instruction: 'Create quickly' },
  { id: 203, name: 'Thought Sketch', icon: '✏️', category: 'creativity', instruction: 'Sketch your thoughts' },
  { id: 204, name: 'Expression Timer', icon: '⏱️', category: 'creativity', instruction: 'Express before time ends' },
  { id: 205, name: 'Create Then Delete', icon: '🗑️', category: 'creativity', instruction: 'Create freely then let go' },
  { id: 206, name: 'Sound Observation', icon: '👂', category: 'creativity', instruction: 'Create from sounds' },
  { id: 207, name: 'Creative Minimalism', icon: '🧘', category: 'creativity', instruction: 'Create with less' },
  { id: 208, name: 'Visual Memory', icon: '👁️', category: 'creativity', instruction: 'Create from memory' },
  { id: 209, name: 'Emotion Mapping', icon: '🗺️', category: 'creativity', instruction: 'Map your emotions' },
  { id: 210, name: 'Title Without Content', icon: '📰', category: 'creativity', instruction: 'Create titles only' },
  { id: 211, name: 'Creative Compression', icon: '📦', category: 'creativity', instruction: 'Compress ideas' },
  { id: 212, name: 'Idea Remix', icon: '🔀', category: 'creativity', instruction: 'Remix existing ideas' },
  { id: 213, name: 'Describe the Ordinary', icon: '🏠', category: 'creativity', instruction: 'Make ordinary special' },
  { id: 214, name: 'Metaphor Maker', icon: '🌉', category: 'creativity', instruction: 'Create metaphors' },
  { id: 215, name: 'Silent Creativity', icon: '🤫', category: 'creativity', instruction: 'Create in silence' },
  { id: 216, name: 'Write the Ending', icon: '🏁', category: 'creativity', instruction: 'Create endings' },
  { id: 217, name: 'Start Without Planning', icon: '🚀', category: 'creativity', instruction: 'Begin without plan' },
  { id: 218, name: 'One Minute Creation', icon: '⏱️', category: 'creativity', instruction: 'Create in 60 seconds' },
  { id: 219, name: 'Creative Order', icon: '📊', category: 'creativity', instruction: 'Order creative elements' },
  { id: 220, name: 'Free Expression Lock', icon: '🔓', category: 'creativity', instruction: 'Express freely' },
  { id: 221, name: 'Visual Focus', icon: '👁️', category: 'creativity', instruction: 'Focus on visuals' },
  { id: 222, name: 'Voice Story', icon: '🎤', category: 'creativity', instruction: 'Tell story with voice' },
  { id: 223, name: 'Idea Snapshot', icon: '📸', category: 'creativity', instruction: 'Capture ideas quickly' },
  { id: 224, name: 'Constraint Builder', icon: '🏗️', category: 'creativity', instruction: 'Build with constraints' },
  { id: 225, name: 'Creativity Under Pressure', icon: '😰', category: 'creativity', instruction: 'Create under pressure' },
  { id: 226, name: 'Abstract Description', icon: '🌀', category: 'creativity', instruction: 'Describe abstractly' },
  { id: 227, name: 'No Judgement Create', icon: '😊', category: 'creativity', instruction: 'Create without judging' },
  { id: 228, name: 'Daily Expression', icon: '📅', category: 'creativity', instruction: 'Express daily' },
  { id: 229, name: 'One Medium Only', icon: '🎨', category: 'creativity', instruction: 'Use one medium' },
  { id: 230, name: 'Creativity Reset', icon: '🔄', category: 'creativity', instruction: 'Reset creative energy' },
  { id: 231, name: 'Describe a Feeling', icon: '❤️', category: 'creativity', instruction: 'Describe emotions' },
  { id: 232, name: 'Create With Limits', icon: '🔒', category: 'creativity', instruction: 'Limited creation' },
  { id: 233, name: 'Thought Art', icon: '🎨', category: 'creativity', instruction: 'Turn thoughts to art' },
  { id: 234, name: 'Express Without Words', icon: '🤐', category: 'creativity', instruction: 'Express non-verbally' },
  { id: 235, name: 'Story Fragment', icon: '📄', category: 'creativity', instruction: 'Create fragments' },
  { id: 236, name: 'Daily Creative Win', icon: '🏆', category: 'creativity', instruction: 'Win creatively today' },
  { id: 237, name: 'Emotion Capture', icon: '📸', category: 'creativity', instruction: 'Capture emotion' },
  { id: 238, name: 'Creative Focus', icon: '🎯', category: 'creativity', instruction: 'Focus creativity' },
  { id: 239, name: 'Idea Distillation', icon: '⚗️', category: 'creativity', instruction: 'Distill core ideas' },
  { id: 240, name: 'Pure Expression', icon: '✨', category: 'creativity', instruction: 'Pure creative flow' },

  // ========================================
  // 🤝 SOCIAL & REAL-WORLD GAMES (241-290)
  // ========================================
  { id: 241, name: 'Compliment Quest', icon: '💬', category: 'social', instruction: 'Give genuine compliments' },
  { id: 242, name: 'Gratitude Message', icon: '🙏', category: 'social', instruction: 'Send gratitude messages' },
  { id: 243, name: 'Eye Contact Challenge', icon: '👀', category: 'social', instruction: 'Practice eye contact' },
  { id: 244, name: 'Active Listening Test', icon: '👂', category: 'social', instruction: 'Listen actively' },
  { id: 245, name: 'Speak Last Game', icon: '🤫', category: 'social', instruction: 'Listen before speaking' },
  { id: 246, name: 'Social Courage', icon: '🦁', category: 'social', instruction: 'Be socially brave' },
  { id: 247, name: 'Kindness Mission', icon: '💝', category: 'social', instruction: 'Complete kindness tasks' },
  { id: 248, name: 'Ask One Question', icon: '❓', category: 'social', instruction: 'Ask meaningful questions' },
  { id: 249, name: 'Social Awareness', icon: '👁️', category: 'social', instruction: 'Be socially aware' },
  { id: 250, name: 'No Phone Conversation', icon: '📵', category: 'social', instruction: 'Talk without phone' },
  { id: 251, name: 'Name Recall', icon: '🏷️', category: 'social', instruction: 'Remember names' },
  { id: 252, name: 'Express Appreciation', icon: '🙌', category: 'social', instruction: 'Show appreciation' },
  { id: 253, name: 'Social Presence', icon: '🧍', category: 'social', instruction: 'Be fully present' },
  { id: 254, name: 'Help Without Credit', icon: '🤝', category: 'social', instruction: 'Help anonymously' },
  { id: 255, name: 'Speak Clearly', icon: '🗣️', category: 'social', instruction: 'Clear communication' },
  { id: 256, name: 'Honest Answer Day', icon: '✅', category: 'social', instruction: 'Be honest always' },
  { id: 257, name: 'Social Calm', icon: '😌', category: 'social', instruction: 'Stay calm socially' },
  { id: 258, name: 'Boundary Practice', icon: '🚧', category: 'social', instruction: 'Set healthy boundaries' },
  { id: 259, name: 'Confidence Walk', icon: '🚶', category: 'social', instruction: 'Walk with confidence' },
  { id: 260, name: 'Conversation Starter', icon: '💬', category: 'social', instruction: 'Start conversations' },
  { id: 261, name: 'Speak With Intention', icon: '🎯', category: 'social', instruction: 'Intentional words' },
  { id: 262, name: 'Social Minimalism', icon: '🧘', category: 'social', instruction: 'Quality over quantity' },
  { id: 263, name: 'Gratitude Out Loud', icon: '📢', category: 'social', instruction: 'Say thanks aloud' },
  { id: 264, name: 'Calm Response', icon: '😊', category: 'social', instruction: 'Respond calmly' },
  { id: 265, name: 'Empathy Challenge', icon: '❤️', category: 'social', instruction: 'Practice empathy' },
  { id: 266, name: 'Listen More', icon: '👂', category: 'social', instruction: 'Listen more than speak' },
  { id: 267, name: 'Speak Less', icon: '🤐', category: 'social', instruction: 'Use fewer words' },
  { id: 268, name: 'Social Reset', icon: '🔄', category: 'social', instruction: 'Reset social energy' },
  { id: 269, name: 'Courage Micro-Task', icon: '💪', category: 'social', instruction: 'Small brave acts' },
  { id: 270, name: 'Assertive Statement', icon: '💪', category: 'social', instruction: 'Be assertive' },
  { id: 271, name: 'Clear Communication', icon: '📢', category: 'social', instruction: 'Communicate clearly' },
  { id: 272, name: 'Human Connection', icon: '🤝', category: 'social', instruction: 'Connect genuinely' },
  { id: 273, name: 'Respectful Disagreement', icon: '🤝', category: 'social', instruction: 'Disagree respectfully' },
  { id: 274, name: 'Social Awareness Lock', icon: '🔒', category: 'social', instruction: 'Lock in awareness' },
  { id: 275, name: 'Kindness Streak', icon: '🔥', category: 'social', instruction: 'Kindness streak' },
  { id: 276, name: 'Speak Without Filler', icon: '🗣️', category: 'social', instruction: 'No um, ah, like' },
  { id: 277, name: 'Presence Test', icon: '🧍', category: 'social', instruction: 'Test your presence' },
  { id: 278, name: 'Social Control', icon: '🎮', category: 'social', instruction: 'Control social energy' },
  { id: 279, name: 'Confidence Builder', icon: '🏗️', category: 'social', instruction: 'Build confidence' },
  { id: 280, name: 'Intentional Interaction', icon: '🎯', category: 'social', instruction: 'Interact intentionally' },
  { id: 281, name: 'Gratitude Loop', icon: '🔄', category: 'social', instruction: 'Continuous gratitude' },
  { id: 282, name: 'Calm Conversation', icon: '😌', category: 'social', instruction: 'Calm discussions' },
  { id: 283, name: 'Speak With Purpose', icon: '🎯', category: 'social', instruction: 'Purposeful speech' },
  { id: 284, name: 'Human Focus', icon: '👤', category: 'social', instruction: 'Focus on people' },
  { id: 285, name: 'Social Energy Control', icon: '🔋', category: 'social', instruction: 'Manage energy' },
  { id: 286, name: 'Authentic Response', icon: '✅', category: 'social', instruction: 'Be authentic' },
  { id: 287, name: 'Connection Builder', icon: '🏗️', category: 'social', instruction: 'Build connections' },
  { id: 288, name: 'Social Clarity', icon: '💎', category: 'social', instruction: 'Clear social intent' },
  { id: 289, name: 'Kind Action Only', icon: '💝', category: 'social', instruction: 'Only kind actions' },
  { id: 290, name: 'Meaningful Exchange', icon: '💬', category: 'social', instruction: 'Meaningful talks' },

  // ========================================
  // 🧩 REFLECTION & LIFE GAMES (291-350)
  // ========================================
  { id: 291, name: 'Daily Life Review', icon: '📋', category: 'reflection', instruction: 'Review your day' },
  { id: 292, name: 'One Lesson Learned', icon: '📚', category: 'reflection', instruction: 'Identify one lesson' },
  { id: 293, name: 'What Worked Today', icon: '✅', category: 'reflection', instruction: 'Find what worked' },
  { id: 294, name: 'What Didn\'t', icon: '❌', category: 'reflection', instruction: 'Find what didn\'t' },
  { id: 295, name: 'One Adjustment', icon: '🔧', category: 'reflection', instruction: 'Make one adjustment' },
  { id: 296, name: 'Values Check', icon: '💎', category: 'reflection', instruction: 'Check your values' },
  { id: 297, name: 'Purpose Reminder', icon: '🎯', category: 'reflection', instruction: 'Remember your why' },
  { id: 298, name: 'Identity Builder', icon: '🏗️', category: 'reflection', instruction: 'Build your identity' },
  { id: 299, name: 'Personal Standard Test', icon: '📊', category: 'reflection', instruction: 'Test your standards' },
  { id: 300, name: 'Self-Honesty Game', icon: '🪞', category: 'reflection', instruction: 'Be honest with self' },
  { id: 301, name: 'Responsibility Audit', icon: '📋', category: 'reflection', instruction: 'Audit responsibilities' },
  { id: 302, name: 'Progress Snapshot', icon: '📸', category: 'reflection', instruction: 'Capture progress' },
  { id: 303, name: 'Self-Respect Check', icon: '👑', category: 'reflection', instruction: 'Check self-respect' },
  { id: 304, name: 'Integrity Test', icon: '⚖️', category: 'reflection', instruction: 'Test your integrity' },
  { id: 305, name: 'One Regret Rewrite', icon: '✏️', category: 'reflection', instruction: 'Rewrite a regret' },
  { id: 306, name: 'Decision Review', icon: '🔍', category: 'reflection', instruction: 'Review decisions' },
  { id: 307, name: 'Future Self Letter', icon: '✉️', category: 'reflection', instruction: 'Write to future you' },
  { id: 308, name: 'Today vs Ideal', icon: '⚖️', category: 'reflection', instruction: 'Compare to ideal' },
  { id: 309, name: 'Self-Trust Builder', icon: '🏗️', category: 'reflection', instruction: 'Build self-trust' },
  { id: 310, name: 'Accountability Moment', icon: '✋', category: 'reflection', instruction: 'Hold yourself accountable' },
  { id: 311, name: 'One Promise Review', icon: '🤝', category: 'reflection', instruction: 'Review promises' },
  { id: 312, name: 'Direction Check', icon: '🧭', category: 'reflection', instruction: 'Check your direction' },
  { id: 313, name: 'Self-Control Reflection', icon: '🎮', category: 'reflection', instruction: 'Reflect on control' },
  { id: 314, name: 'Life Simplifier', icon: '🧘', category: 'reflection', instruction: 'Simplify life' },
  { id: 315, name: 'Priorities Lock', icon: '🔒', category: 'reflection', instruction: 'Lock priorities' },
  { id: 316, name: 'Alignment Check', icon: '📐', category: 'reflection', instruction: 'Check alignment' },
  { id: 317, name: 'Personal Truth', icon: '💎', category: 'reflection', instruction: 'Find your truth' },
  { id: 318, name: 'Discipline Reflection', icon: '🎖️', category: 'reflection', instruction: 'Reflect on discipline' },
  { id: 319, name: 'Identity Alignment', icon: '📐', category: 'reflection', instruction: 'Align with identity' },
  { id: 320, name: 'Self-Leadership', icon: '👑', category: 'reflection', instruction: 'Lead yourself' },
  { id: 321, name: 'Life Order', icon: '📊', category: 'reflection', instruction: 'Order your life' },
  { id: 322, name: 'Values in Action', icon: '⚡', category: 'reflection', instruction: 'Live your values' },
  { id: 323, name: 'Long-Term Thinking', icon: '🔭', category: 'reflection', instruction: 'Think long-term' },
  { id: 324, name: 'Purpose Recall', icon: '🎯', category: 'reflection', instruction: 'Recall your purpose' },
  { id: 325, name: 'Self-Respect Streak', icon: '🔥', category: 'reflection', instruction: 'Respect streak' },
  { id: 326, name: 'Personal Growth Snapshot', icon: '📸', category: 'reflection', instruction: 'Capture growth' },
  { id: 327, name: 'Responsibility Game', icon: '🎮', category: 'reflection', instruction: 'Take responsibility' },
  { id: 328, name: 'Direction Reset', icon: '🔄', category: 'reflection', instruction: 'Reset direction' },
  { id: 329, name: 'Life Systems Review', icon: '⚙️', category: 'reflection', instruction: 'Review life systems' },
  { id: 330, name: 'Identity Proof', icon: '🎖️', category: 'reflection', instruction: 'Prove your identity' },
  { id: 331, name: 'Choice Awareness', icon: '👁️', category: 'reflection', instruction: 'Be aware of choices' },
  { id: 332, name: 'Long Game Thinking', icon: '♟️', category: 'reflection', instruction: 'Think long game' },
  { id: 333, name: 'Self-Command Review', icon: '👑', category: 'reflection', instruction: 'Review self-command' },
  { id: 334, name: 'Integrity Lock', icon: '🔒', category: 'reflection', instruction: 'Lock in integrity' },
  { id: 335, name: 'Progress Over Comfort', icon: '📈', category: 'reflection', instruction: 'Choose progress' },
  { id: 336, name: 'Meaning Builder', icon: '🏗️', category: 'reflection', instruction: 'Build meaning' },
  { id: 337, name: 'Self-Reflection Lite', icon: '🪞', category: 'reflection', instruction: 'Quick reflection' },
  { id: 338, name: 'Life Calibration', icon: '🔧', category: 'reflection', instruction: 'Calibrate life' },
  { id: 339, name: 'Responsibility Chain', icon: '⛓️', category: 'reflection', instruction: 'Chain of responsibility' },
  { id: 340, name: 'Self-Alignment', icon: '📐', category: 'reflection', instruction: 'Align with self' },
  { id: 341, name: 'Personal Code', icon: '📜', category: 'reflection', instruction: 'Follow your code' },
  { id: 342, name: 'Direction Finder', icon: '🧭', category: 'reflection', instruction: 'Find direction' },
  { id: 343, name: 'Growth Evidence', icon: '📊', category: 'reflection', instruction: 'Show growth evidence' },
  { id: 344, name: 'Discipline Identity', icon: '🎖️', category: 'reflection', instruction: 'Be disciplined' },
  { id: 345, name: 'Future Focus', icon: '🔭', category: 'reflection', instruction: 'Focus on future' },
  { id: 346, name: 'Self-Mastery Lite', icon: '👑', category: 'reflection', instruction: 'Master yourself' },
  { id: 347, name: 'Life Momentum', icon: '🚀', category: 'reflection', instruction: 'Build momentum' },
  { id: 348, name: 'Order the Chaos', icon: '🌀', category: 'reflection', instruction: 'Create order' },
  { id: 349, name: 'Self-Respect Challenge', icon: '💪', category: 'reflection', instruction: 'Challenge yourself' },
  { id: 350, name: 'Become Consistent', icon: '📈', category: 'reflection', instruction: 'Build consistency' },

  // ========================================
  // 🧱 MASTERY GAMES (351-365) - FINAL 15
  // ========================================
  { id: 351, name: 'Discipline Identity Check', icon: '🎖️', category: 'mastery', instruction: 'Check discipline identity' },
  { id: 352, name: 'One Rule I Never Break', icon: '📜', category: 'mastery', instruction: 'Honor your one rule' },
  { id: 353, name: 'Execute Without Mood', icon: '🤖', category: 'mastery', instruction: 'Act despite mood' },
  { id: 354, name: 'Consistency Over Motivation', icon: '📈', category: 'mastery', instruction: 'Stay consistent' },
  { id: 355, name: 'Show Up Anyway', icon: '🚪', category: 'mastery', instruction: 'Show up no matter what' },
  { id: 356, name: 'Finish the Small Thing', icon: '✅', category: 'mastery', instruction: 'Complete small tasks' },
  { id: 357, name: 'Delay Gratification Trial', icon: '⏳', category: 'mastery', instruction: 'Delay rewards' },
  { id: 358, name: 'Hard Choice Awareness', icon: '💎', category: 'mastery', instruction: 'Choose hard things' },
  { id: 359, name: 'Structure Before Freedom', icon: '🏗️', category: 'mastery', instruction: 'Build structure first' },
  { id: 360, name: 'Control the First Hour', icon: '🌅', category: 'mastery', instruction: 'Own morning hour' },
  { id: 361, name: 'Control the Last Hour', icon: '🌙', category: 'mastery', instruction: 'Own evening hour' },
  { id: 362, name: 'Discipline Under Stress', icon: '😰', category: 'mastery', instruction: 'Stay disciplined stressed' },
  { id: 363, name: 'Identity Proof Day', icon: '🎖️', category: 'mastery', instruction: 'Prove who you are' },
  { id: 364, name: 'Momentum Lock', icon: '🔒', category: 'mastery', instruction: 'Lock in momentum' },
  { id: 365, name: 'The Comeback Day', icon: '🔥', category: 'mastery', instruction: 'Come back stronger' }
];

// Get game by ID
function getGameById(id) {
  return GAMES.find(g => g.id === id);
}

// Get games by category
function getGamesByCategory(category) {
  return GAMES.filter(g => g.category === category);
}

// Get category info
function getCategoryInfo(category) {
  return GAME_CATEGORIES[category];
}

// Get today's challenge (based on day of year)
function getTodaysChallenge() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now - start;
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  return GAMES[(dayOfYear - 1) % 365] || GAMES[0];
}

// Get random game from category
function getRandomGameFromCategory(category) {
  const games = getGamesByCategory(category);
  return games[Math.floor(Math.random() * games.length)];
}
