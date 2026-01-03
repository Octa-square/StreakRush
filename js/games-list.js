// ============================================
// STREAKRUSH - 60 GAME DATABASE
// 15 Free Games + 45 Premium Games
// ============================================

const GAMES = [
  // ==========================================
  // FREE TIER: GAMES 1-15 (Unlocked for all)
  // ==========================================
  
  // GAME 1: Color Sequence (Visual) - HIGHEST PRIORITY - Most addictive
  {
    id: 1,
    name: 'Color Sequence',
    category: 'Visual',
    icon: '🎨',
    difficulty: 'easy',
    timeLimit: 60,
    instruction: 'Watch the color sequence, then repeat it in the exact order!',
    benefits: 'Strengthens visual working memory and sequential processing.',
    technique: 'Chunking Tip: Group colors into pairs (red-blue, green-yellow) to remember longer sequences.',
    pointsCorrect: 25,
    pointsWrong: -15
  },
  
  // GAME 2: Number Flash (Numeric) - Simple, proven effective
  {
    id: 2,
    name: 'Number Flash',
    category: 'Numeric',
    icon: '🔢',
    difficulty: 'easy',
    timeLimit: 60,
    instruction: 'Numbers will flash briefly. Remember and type them in order!',
    benefits: 'Improves digit span memory and numerical processing speed.',
    technique: 'Rhythm Tip: Create a rhythm as numbers appear - your brain remembers patterns better than random digits.',
    pointsCorrect: 25,
    pointsWrong: -15
  },
  
  // GAME 3: Reaction Test (Speed) - Already exists, polish it
  {
    id: 3,
    name: 'Reaction Test',
    category: 'Speed',
    icon: '⚡',
    difficulty: 'easy',
    timeLimit: 60,
    instruction: 'Tap as FAST as possible when the circle turns green! Don\'t tap on red!',
    benefits: 'Boosts reflexes, hand-eye coordination, and impulse control.',
    technique: 'Focus Tip: Keep your eyes on the center and let your peripheral vision detect the color change.',
    pointsCorrect: 25,
    pointsWrong: -15
  },
  
  // GAME 4: Card Match Rush (Visual) - Classic, easy to implement
  {
    id: 4,
    name: 'Card Match Rush',
    category: 'Visual',
    icon: '🃏',
    difficulty: 'easy',
    timeLimit: 60,
    instruction: 'Find matching pairs of cards! Remember where each card is located.',
    benefits: 'Enhances spatial memory and visual pattern recognition.',
    technique: 'Location Tip: Create a mental map - associate each card position with a familiar location.',
    pointsCorrect: 25,
    pointsWrong: -10
  },
  
  // GAME 5: Shape Shifter (Visual) - Similar to Color Sequence
  {
    id: 5,
    name: 'Shape Shifter',
    category: 'Visual',
    icon: '🔷',
    difficulty: 'easy',
    timeLimit: 60,
    instruction: 'Watch the shapes transform. Remember and repeat the sequence!',
    benefits: 'Develops visual-spatial memory and shape recognition.',
    technique: 'Story Tip: Create a story - "Circle became triangle, then square joined the party."',
    pointsCorrect: 25,
    pointsWrong: -15
  },
  
  // GAME 6: Speed Math (Numeric) - Already exists, enhance it
  {
    id: 6,
    name: 'Speed Math',
    category: 'Numeric',
    icon: '➕',
    difficulty: 'easy',
    timeLimit: 60,
    instruction: 'Solve math problems as fast as you can! Addition, subtraction, multiplication.',
    benefits: 'Sharpens mental calculation and numerical fluency.',
    technique: 'Shortcut Tip: For 9×, multiply by 10 and subtract the number (9×7 = 70-7 = 63).',
    pointsCorrect: 25,
    pointsWrong: -15
  },
  
  // GAME 7: World Capitals (Spatial) - Already exists, keep it
  {
    id: 7,
    name: 'World Capitals',
    category: 'Spatial',
    icon: '🌍',
    difficulty: 'easy',
    timeLimit: 60,
    instruction: 'Name the capital of each country! Quick - 5 seconds per question!',
    benefits: 'Builds geographic knowledge and improves memory recall.',
    technique: 'Association Tip: Link capitals to something memorable - "Paris sounds like paradise."',
    pointsCorrect: 25,
    pointsWrong: -15
  },
  
  // GAME 8: Word Chain (Verbal) - Moderate complexity
  {
    id: 8,
    name: 'Word Chain',
    category: 'Verbal',
    icon: '🔗',
    difficulty: 'medium',
    timeLimit: 60,
    instruction: 'Remember the growing chain of words! Each round adds a new word.',
    benefits: 'Expands verbal working memory and word association skills.',
    technique: 'Story Tip: Weave words into a bizarre story - strange = memorable!',
    pointsCorrect: 25,
    pointsWrong: -15
  },
  
  // GAME 9: What\'s Missing (Visual) - Moderate complexity
  {
    id: 9,
    name: 'What\'s Missing',
    category: 'Visual',
    icon: '❓',
    difficulty: 'medium',
    timeLimit: 60,
    instruction: 'Study the objects, then identify which one disappeared!',
    benefits: 'Sharpens attention to detail and visual memory.',
    technique: 'Scan Tip: Quickly scan objects left-to-right, creating a mental "photograph."',
    pointsCorrect: 25,
    pointsWrong: -15
  },
  
  // GAME 10: Position Perfect (Spatial) - Grid-based, straightforward
  {
    id: 10,
    name: 'Position Perfect',
    category: 'Spatial',
    icon: '📍',
    difficulty: 'medium',
    timeLimit: 60,
    instruction: 'Remember where each icon appears on the grid, then place them correctly!',
    benefits: 'Develops spatial memory and mental mapping abilities.',
    technique: 'Landmark Tip: Use grid edges as landmarks - "Cat was top-left, dog was center."',
    pointsCorrect: 25,
    pointsWrong: -15
  },
  
  // GAME 11: Emoji Story (Verbal) - Fun, moderate difficulty
  {
    id: 11,
    name: 'Emoji Story',
    category: 'Verbal',
    icon: '📖',
    difficulty: 'medium',
    timeLimit: 60,
    instruction: 'Watch the emoji story unfold, then put them back in the right order!',
    benefits: 'Enhances narrative memory and sequential processing.',
    technique: 'Narrative Tip: Turn emojis into a vivid story - "😀 saw 🐕 chase 🎾 into 🏠."',
    pointsCorrect: 25,
    pointsWrong: -15
  },
  
  // GAME 12: Pattern Breaker (Pattern) - Visual comparison
  {
    id: 12,
    name: 'Pattern Breaker',
    category: 'Pattern',
    icon: '🔍',
    difficulty: 'medium',
    timeLimit: 60,
    instruction: 'Find the one that doesn\'t belong! Spot the pattern and find the outlier.',
    benefits: 'Develops pattern recognition and logical reasoning.',
    technique: 'Process Tip: Compare first two items to find the rule, then scan for the breaker.',
    pointsCorrect: 25,
    pointsWrong: -15
  },
  
  // GAME 13: Sound Sequence (Auditory) - Requires audio
  {
    id: 13,
    name: 'Sound Sequence',
    category: 'Auditory',
    icon: '🔊',
    difficulty: 'medium',
    timeLimit: 60,
    instruction: 'Listen to the sounds and repeat them in the exact order!',
    benefits: 'Strengthens auditory memory and sequential processing.',
    technique: 'Echo Tip: Silently "replay" each sound in your head immediately after hearing it.',
    pointsCorrect: 25,
    pointsWrong: -15
  },
  
  // GAME 14: Face Memory (Visual) - Requires face images
  {
    id: 14,
    name: 'Face Memory',
    category: 'Visual',
    icon: '👤',
    difficulty: 'medium',
    timeLimit: 60,
    instruction: 'Study the faces and their names, then match them correctly!',
    benefits: 'Improves facial recognition and name-face association.',
    technique: 'Feature Tip: Focus on one unique feature per face - "Big nose Bob, Curly hair Carol."',
    pointsCorrect: 25,
    pointsWrong: -15
  },
  
  // GAME 15: Number Grid (Numeric) - Challenging but feasible
  {
    id: 15,
    name: 'Number Grid',
    category: 'Numeric',
    icon: '🔢',
    difficulty: 'medium',
    timeLimit: 60,
    instruction: 'Remember the position of numbers on a grid, then recreate it!',
    benefits: 'Combines spatial and numerical memory for enhanced brain power.',
    technique: 'Path Tip: Trace a path through numbers like reading a book - creates order from chaos.',
    pointsCorrect: 25,
    pointsWrong: -15
  },
  
  // ==========================================
  // PREMIUM TIER BATCH 1: GAMES 16-30
  // Medium Difficulty - Variety Across Categories
  // ==========================================
  
  // GAME 16: Dual N-Back (Pattern) - Classic brain game
  {
    id: 16,
    name: 'Dual N-Back',
    category: 'Pattern',
    icon: '🧠',
    difficulty: 'hard',
    timeLimit: 60,
    instruction: 'Remember both position AND letter from N steps back!',
    benefits: 'The gold standard for working memory improvement - proven to increase fluid intelligence.',
    technique: 'Stream Tip: Mentally repeat "position: center, letter: K" as each item appears.',
    pointsCorrect: 30,
    pointsWrong: -20
  },
  
  // GAME 17: Speed Typing (Speed)
  {
    id: 17,
    name: 'Speed Typing',
    category: 'Speed',
    icon: '⌨️',
    difficulty: 'medium',
    timeLimit: 60,
    instruction: 'Type the words as fast and accurately as possible!',
    benefits: 'Improves typing speed, visual processing, and motor coordination.',
    technique: 'Look Ahead Tip: Start reading the next word while typing the current one.',
    pointsCorrect: 25,
    pointsWrong: -10
  },
  
  // GAME 18: Backwards Spell (Verbal)
  {
    id: 18,
    name: 'Backwards Spell',
    category: 'Verbal',
    icon: '🔄',
    difficulty: 'hard',
    timeLimit: 60,
    instruction: 'Spell the word backwards! HELLO becomes OLLEH.',
    benefits: 'Strengthens mental manipulation and working memory.',
    technique: 'Visual Tip: Picture the word written down, then read it from right to left.',
    pointsCorrect: 30,
    pointsWrong: -15
  },
  
  // GAME 19: Color Word Clash (Speed) - Stroop test
  {
    id: 19,
    name: 'Color Word Clash',
    category: 'Speed',
    icon: '🎨',
    difficulty: 'medium',
    timeLimit: 60,
    instruction: 'Tap the COLOR of the word, not what it says! (Stroop Test)',
    benefits: 'Builds cognitive flexibility and inhibitory control.',
    technique: 'Blur Tip: Slightly unfocus your eyes to see color before reading the word.',
    pointsCorrect: 25,
    pointsWrong: -15
  },
  
  // GAME 20: Sequence Builder (Pattern)
  {
    id: 20,
    name: 'Sequence Builder',
    category: 'Pattern',
    icon: '📊',
    difficulty: 'medium',
    timeLimit: 60,
    instruction: 'Find the pattern and complete the sequence!',
    benefits: 'Develops logical reasoning and pattern prediction.',
    technique: 'Difference Tip: Calculate the difference between consecutive items to find the rule.',
    pointsCorrect: 25,
    pointsWrong: -15
  },
  
  // GAME 21: Rapid Recall (Visual)
  {
    id: 21,
    name: 'Rapid Recall',
    category: 'Visual',
    icon: '👁️',
    difficulty: 'medium',
    timeLimit: 60,
    instruction: 'Objects flash briefly - remember as many as you can!',
    benefits: 'Expands visual memory capacity and recall speed.',
    technique: 'Group Tip: Mentally group items by category - "3 fruits, 2 animals, 1 vehicle."',
    pointsCorrect: 25,
    pointsWrong: -10
  },
  
  // GAME 22: Math Chains (Numeric)
  {
    id: 22,
    name: 'Math Chains',
    category: 'Numeric',
    icon: '⛓️',
    difficulty: 'medium',
    timeLimit: 60,
    instruction: 'Keep a running total as operations chain together! 5 +3 ×2 -4 = ?',
    benefits: 'Enhances mental arithmetic and working memory simultaneously.',
    technique: 'Voice Tip: Quietly say each new total to reinforce it in memory.',
    pointsCorrect: 30,
    pointsWrong: -15
  },
  
  // GAME 23: Word Morph (Verbal)
  {
    id: 23,
    name: 'Word Morph',
    category: 'Verbal',
    icon: '🔀',
    difficulty: 'medium',
    timeLimit: 60,
    instruction: 'Change one letter at a time to transform the word! CAT → COT → COG → DOG',
    benefits: 'Improves vocabulary and flexible thinking.',
    technique: 'Vowel Tip: Try changing vowels first - they often create the most valid words.',
    pointsCorrect: 25,
    pointsWrong: -15
  },
  
  // GAME 24: Grid Navigator (Spatial)
  {
    id: 24,
    name: 'Grid Navigator',
    category: 'Spatial',
    icon: '🗺️',
    difficulty: 'medium',
    timeLimit: 60,
    instruction: 'Follow the path of arrows and find where you end up!',
    benefits: 'Strengthens spatial reasoning and mental navigation.',
    technique: 'Finger Tip: Trace the path with your finger (or mentally) step by step.',
    pointsCorrect: 25,
    pointsWrong: -15
  },
  
  // GAME 25: Symbol Match (Visual)
  {
    id: 25,
    name: 'Symbol Match',
    category: 'Visual',
    icon: '⚛️',
    difficulty: 'medium',
    timeLimit: 60,
    instruction: 'Learn the symbol-number pairs, then decode the secret number!',
    benefits: 'Develops associative memory and coding/decoding skills.',
    technique: 'Story Tip: Create mini-stories - "Star ⭐ has 5 points, so it\'s 5."',
    pointsCorrect: 25,
    pointsWrong: -15
  },
  
  // GAME 26: True or False Blitz (Verbal)
  {
    id: 26,
    name: 'True or False Blitz',
    category: 'Verbal',
    icon: '✓✗',
    difficulty: 'easy',
    timeLimit: 60,
    instruction: 'Rapid fire facts - TRUE or FALSE? Trust your instincts!',
    benefits: 'Builds general knowledge and quick decision-making.',
    technique: 'Gut Tip: Your first instinct is usually right - don\'t overthink!',
    pointsCorrect: 20,
    pointsWrong: -10
  },
  
  // GAME 27: Rhythm Recall (Auditory)
  {
    id: 27,
    name: 'Rhythm Recall',
    category: 'Auditory',
    icon: '🥁',
    difficulty: 'medium',
    timeLimit: 60,
    instruction: 'Listen to the rhythm pattern and tap it back!',
    benefits: 'Develops auditory memory and rhythmic timing.',
    technique: 'Count Tip: Count the beats internally - "1-2, 1-2-3, 1" etc.',
    pointsCorrect: 25,
    pointsWrong: -15
  },
  
  // GAME 28: Flag Finder (Spatial)
  {
    id: 28,
    name: 'Flag Finder',
    category: 'Spatial',
    icon: '🏳️',
    difficulty: 'medium',
    timeLimit: 60,
    instruction: 'Match the flag to its country! How well do you know world flags?',
    benefits: 'Enhances visual recognition and cultural awareness.',
    technique: 'Color Tip: Focus on unique color combinations - they\'re like fingerprints!',
    pointsCorrect: 25,
    pointsWrong: -15
  },
  
  // GAME 29: Odd One Out (Pattern)
  {
    id: 29,
    name: 'Odd One Out',
    category: 'Pattern',
    icon: '🎯',
    difficulty: 'medium',
    timeLimit: 60,
    instruction: 'Find the one item that doesn\'t fit the pattern!',
    benefits: 'Sharpens categorization and logical exclusion skills.',
    technique: 'Rule Tip: Ask "What do most have in common?" - the exception is your answer.',
    pointsCorrect: 25,
    pointsWrong: -15
  },
  
  // GAME 30: Quick Count (Numeric)
  {
    id: 30,
    name: 'Quick Count',
    category: 'Numeric',
    icon: '🔢',
    difficulty: 'medium',
    timeLimit: 60,
    instruction: 'Count the objects as fast as you can! Numbers appear and disappear.',
    benefits: 'Improves subitizing ability and rapid enumeration.',
    technique: 'Group Tip: See groups of 3-4 instead of counting one by one.',
    pointsCorrect: 25,
    pointsWrong: -15
  },
  
  // ==========================================
  // PREMIUM TIER BATCH 2: GAMES 31-45
  // Medium-Hard Difficulty - Complex Mechanics
  // ==========================================
  
  // GAME 31: Triple N-Back (Pattern)
  {
    id: 31,
    name: 'Triple N-Back',
    category: 'Pattern',
    icon: '🧠',
    difficulty: 'hard',
    timeLimit: 90,
    instruction: 'Track position, color, AND sound from N steps back!',
    benefits: 'Maximum working memory challenge - elite brain challenge.',
    technique: 'Focus Tip: Start with N=1 and only increase when you hit 80% accuracy.',
    pointsCorrect: 35,
    pointsWrong: -20
  },
  
  // GAME 32: Reverse Order (Visual)
  {
    id: 32,
    name: 'Reverse Order',
    category: 'Visual',
    icon: '↩️',
    difficulty: 'hard',
    timeLimit: 60,
    instruction: 'Watch the sequence, then repeat it BACKWARDS!',
    benefits: 'Strengthens working memory manipulation and reversal.',
    technique: 'End Tip: Focus extra hard on the last item - it becomes your first answer.',
    pointsCorrect: 30,
    pointsWrong: -15
  },
  
  // GAME 33: Letter Equations (Verbal)
  {
    id: 33,
    name: 'Letter Equations',
    category: 'Verbal',
    icon: '🔤',
    difficulty: 'medium',
    timeLimit: 60,
    instruction: '26 = L in the A. What phrase do the initials represent?',
    benefits: 'Develops lateral thinking and knowledge integration.',
    technique: 'Number Tip: Start with the number - what famous quantities match it?',
    pointsCorrect: 30,
    pointsWrong: -10
  },
  
  // GAME 34: Memory Palace (Spatial)
  {
    id: 34,
    name: 'Memory Palace',
    category: 'Spatial',
    icon: '🏛️',
    difficulty: 'hard',
    timeLimit: 90,
    instruction: 'Place items in rooms, then recall which item was where!',
    benefits: 'Teaches the ancient memory palace technique used by memory champions.',
    technique: 'Vivid Tip: Make images bizarre and interactive - they stick better!',
    pointsCorrect: 30,
    pointsWrong: -15
  },
  
  // GAME 35: Landmark Memory (Spatial)
  {
    id: 35,
    name: 'Landmark Memory',
    category: 'Spatial',
    icon: '🗽',
    difficulty: 'medium',
    timeLimit: 60,
    instruction: 'Match famous landmarks to their countries!',
    benefits: 'Builds cultural knowledge and visual-geographic associations.',
    technique: 'Style Tip: Look for architectural style clues - domes, pagodas, spires.',
    pointsCorrect: 25,
    pointsWrong: -15
  },
  
  // GAME 36: Mental Rotation (Spatial)
  {
    id: 36,
    name: 'Mental Rotation',
    category: 'Spatial',
    icon: '🔄',
    difficulty: 'hard',
    timeLimit: 60,
    instruction: 'Which shape is the same, just rotated? Not mirrored!',
    benefits: 'Strengthens spatial visualization - key for STEM skills.',
    technique: 'Feature Tip: Pick one unique feature and mentally rotate just that part.',
    pointsCorrect: 30,
    pointsWrong: -15
  },
  
  // GAME 37: Word Recall (Verbal)
  {
    id: 37,
    name: 'Word Recall',
    category: 'Verbal',
    icon: '📝',
    difficulty: 'medium',
    timeLimit: 60,
    instruction: 'Study the word list, then type as many as you remember!',
    benefits: 'Expands verbal memory capacity and free recall.',
    technique: 'Category Tip: Mentally group words - animals, foods, objects - for better recall.',
    pointsCorrect: 20,
    pointsWrong: 0
  },
  
  // GAME 38: Calculation Sprint (Numeric)
  {
    id: 38,
    name: 'Calculation Sprint',
    category: 'Numeric',
    icon: '🏃',
    difficulty: 'hard',
    timeLimit: 60,
    instruction: 'Solve increasingly difficult calculations under pressure!',
    benefits: 'Pushes mental math limits and builds calculation confidence.',
    technique: 'Break Tip: Break complex problems into simple steps - 23×4 = 20×4 + 3×4.',
    pointsCorrect: 30,
    pointsWrong: -15
  },
  
  // GAME 39: Emotional Faces (Visual)
  {
    id: 39,
    name: 'Emotional Faces',
    category: 'Visual',
    icon: '😊',
    difficulty: 'medium',
    timeLimit: 60,
    instruction: 'Identify the emotion shown on each face!',
    benefits: 'Improves emotional intelligence and facial expression reading.',
    technique: 'Eyes Tip: Focus on the eyes and mouth - they reveal emotions most clearly.',
    pointsCorrect: 25,
    pointsWrong: -15
  },
  
  // GAME 40: Synonym Sprint (Verbal)
  {
    id: 40,
    name: 'Synonym Sprint',
    category: 'Verbal',
    icon: '📚',
    difficulty: 'medium',
    timeLimit: 60,
    instruction: 'Find the word that means the same thing!',
    benefits: 'Expands vocabulary and strengthens word associations.',
    technique: 'Context Tip: Picture the word in a sentence to grasp its true meaning.',
    pointsCorrect: 25,
    pointsWrong: -15
  },
  
  // GAME 41: Photo Memory (Visual)
  {
    id: 41,
    name: 'Photo Memory',
    category: 'Visual',
    icon: '📸',
    difficulty: 'hard',
    timeLimit: 60,
    instruction: 'Study the photo, then answer questions about what you saw!',
    benefits: 'Develops photographic memory skills and attention to detail.',
    technique: 'Sweep Tip: Systematically scan the image - top to bottom, left to right.',
    pointsCorrect: 30,
    pointsWrong: -15
  },
  
  // GAME 42: Melody Memory (Auditory)
  {
    id: 42,
    name: 'Melody Memory',
    category: 'Auditory',
    icon: '🎵',
    difficulty: 'medium',
    timeLimit: 60,
    instruction: 'Listen to the melody and identify which one matches!',
    benefits: 'Enhances musical memory and auditory discrimination.',
    technique: 'Hum Tip: Silently hum along to encode the melody in muscle memory.',
    pointsCorrect: 25,
    pointsWrong: -15
  },
  
  // GAME 43: Split Attention (Pattern)
  {
    id: 43,
    name: 'Split Attention',
    category: 'Pattern',
    icon: '👀',
    difficulty: 'hard',
    timeLimit: 60,
    instruction: 'Track two things at once - tap when EITHER matches!',
    benefits: 'Improves divided attention and multitasking abilities.',
    technique: 'Peripheral Tip: Don\'t focus on one thing - use soft focus to see both.',
    pointsCorrect: 30,
    pointsWrong: -20
  },
  
  // GAME 44: Number Bonds (Numeric)
  {
    id: 44,
    name: 'Number Bonds',
    category: 'Numeric',
    icon: '🔗',
    difficulty: 'medium',
    timeLimit: 60,
    instruction: 'Find the pair of numbers that sum to the target!',
    benefits: 'Strengthens number sense and mental addition.',
    technique: 'Complement Tip: Calculate the complement of each number to the target.',
    pointsCorrect: 25,
    pointsWrong: -15
  },
  
  // GAME 45: Context Switch (Speed)
  {
    id: 45,
    name: 'Context Switch',
    category: 'Speed',
    icon: '🔀',
    difficulty: 'hard',
    timeLimit: 60,
    instruction: 'Rules change mid-game! Adapt quickly to new instructions.',
    benefits: 'Develops cognitive flexibility and adaptive thinking.',
    technique: 'Reset Tip: When rules change, take a mental breath and fully commit to the new rule.',
    pointsCorrect: 30,
    pointsWrong: -20
  },
  
  // ==========================================
  // PREMIUM TIER BATCH 3: GAMES 46-60
  // Hard & Expert - Advanced Challenges
  // ==========================================
  
  // GAME 46: Speed Patterns (Speed)
  {
    id: 46,
    name: 'Speed Patterns',
    category: 'Speed',
    icon: '💨',
    difficulty: 'hard',
    timeLimit: 60,
    instruction: 'Patterns flash rapidly - recreate them before they fade from memory!',
    benefits: 'Pushes visual processing speed and immediate recall to the limit.',
    technique: 'Snapshot Tip: Take mental "photographs" - don\'t try to trace the pattern.',
    pointsCorrect: 30,
    pointsWrong: -15
  },
  
  // GAME 47: Logic Chains (Pattern)
  {
    id: 47,
    name: 'Logic Chains',
    category: 'Pattern',
    icon: '🔗',
    difficulty: 'hard',
    timeLimit: 90,
    instruction: 'If A→B and B→C, what can you conclude? Follow the logic!',
    benefits: 'Strengthens deductive reasoning and logical thinking.',
    technique: 'Chain Tip: Draw arrows mentally connecting each statement.',
    pointsCorrect: 35,
    pointsWrong: -15
  },
  
  // GAME 48: Category Sort (Verbal)
  {
    id: 48,
    name: 'Category Sort',
    category: 'Verbal',
    icon: '📂',
    difficulty: 'medium',
    timeLimit: 60,
    instruction: 'Sort items into the correct categories as fast as possible!',
    benefits: 'Improves categorization speed and semantic memory.',
    technique: 'First Tip: Focus on the first letter or sound - it often suggests category.',
    pointsCorrect: 25,
    pointsWrong: -15
  },
  
  // GAME 49: Maze Memory (Spatial)
  {
    id: 49,
    name: 'Maze Memory',
    category: 'Spatial',
    icon: '🔀',
    difficulty: 'hard',
    timeLimit: 90,
    instruction: 'Study the maze path, then navigate it from memory!',
    benefits: 'Develops spatial memory and mental navigation.',
    technique: 'Landmark Tip: Note key turns - "right at dead end, left at T-junction."',
    pointsCorrect: 35,
    pointsWrong: -20
  },
  
  // GAME 50: Verbal Fluency (Verbal)
  {
    id: 50,
    name: 'Verbal Fluency',
    category: 'Verbal',
    icon: '💬',
    difficulty: 'medium',
    timeLimit: 60,
    instruction: 'Name as many words as you can that start with the given letter!',
    benefits: 'Expands vocabulary access and verbal processing speed.',
    technique: 'Category Tip: Think in categories - animals, foods, names, places.',
    pointsCorrect: 20,
    pointsWrong: 0
  },
  
  // GAME 51: Prime Time (Numeric)
  {
    id: 51,
    name: 'Prime Time',
    category: 'Numeric',
    icon: '🔢',
    difficulty: 'hard',
    timeLimit: 60,
    instruction: 'Is it prime or not? Quick decisions on number properties!',
    benefits: 'Strengthens number theory knowledge and quick analysis.',
    technique: 'Divide Tip: Check divisibility by 2, 3, 5, 7 - covers most cases.',
    pointsCorrect: 30,
    pointsWrong: -15
  },
  
  // GAME 52: Visual Equations (Pattern)
  {
    id: 52,
    name: 'Visual Equations',
    category: 'Pattern',
    icon: '⚖️',
    difficulty: 'hard',
    timeLimit: 90,
    instruction: 'Shapes have values - solve the visual equation!',
    benefits: 'Develops abstract reasoning and algebraic thinking.',
    technique: 'Substitute Tip: Find the simplest equation first, then substitute.',
    pointsCorrect: 35,
    pointsWrong: -15
  },
  
  // GAME 53: Attention Filter (Speed)
  {
    id: 53,
    name: 'Attention Filter',
    category: 'Speed',
    icon: '🎯',
    difficulty: 'hard',
    timeLimit: 60,
    instruction: 'Tap only the target shape while ignoring distractors!',
    benefits: 'Sharpens selective attention and distractor suppression.',
    technique: 'Tunnel Tip: Imagine tunnel vision - only the target matters.',
    pointsCorrect: 25,
    pointsWrong: -20
  },
  
  // GAME 54: Story Sequence (Verbal)
  {
    id: 54,
    name: 'Story Sequence',
    category: 'Verbal',
    icon: '📖',
    difficulty: 'medium',
    timeLimit: 60,
    instruction: 'Put the story events in the correct chronological order!',
    benefits: 'Enhances narrative comprehension and temporal ordering.',
    technique: 'Cause Tip: Ask "What caused what?" - causes come before effects.',
    pointsCorrect: 25,
    pointsWrong: -15
  },
  
  // GAME 55: Peripheral Vision (Visual)
  {
    id: 55,
    name: 'Peripheral Vision',
    category: 'Visual',
    icon: '👁️',
    difficulty: 'hard',
    timeLimit: 60,
    instruction: 'Keep eyes on center - detect and tap objects in your peripheral vision!',
    benefits: 'Expands visual awareness and peripheral processing.',
    technique: 'Relax Tip: Relax your focus - trying too hard narrows your vision.',
    pointsCorrect: 30,
    pointsWrong: -20
  },
  
  // GAME 56: Estimation Master (Numeric)
  {
    id: 56,
    name: 'Estimation Master',
    category: 'Numeric',
    icon: '📏',
    difficulty: 'medium',
    timeLimit: 60,
    instruction: 'Estimate quantities, distances, and values without counting!',
    benefits: 'Develops numerical intuition and estimation skills.',
    technique: 'Anchor Tip: Use known references - "That looks like about 3 hands wide."',
    pointsCorrect: 25,
    pointsWrong: -10
  },
  
  // GAME 57: Code Breaker (Pattern)
  {
    id: 57,
    name: 'Code Breaker',
    category: 'Pattern',
    icon: '🔐',
    difficulty: 'hard',
    timeLimit: 90,
    instruction: 'Crack the code! Use logic and feedback to find the secret sequence.',
    benefits: 'Strengthens logical deduction and hypothesis testing.',
    technique: 'Eliminate Tip: Each guess eliminates possibilities - track what you\'ve learned.',
    pointsCorrect: 40,
    pointsWrong: -10
  },
  
  // GAME 58: Audio Location (Auditory)
  {
    id: 58,
    name: 'Audio Location',
    category: 'Auditory',
    icon: '🎧',
    difficulty: 'hard',
    timeLimit: 60,
    instruction: 'Where did the sound come from? Point to its location!',
    benefits: 'Develops spatial audio processing and directional hearing.',
    technique: 'Head Tip: Keep your head still - movement confuses directional cues.',
    pointsCorrect: 30,
    pointsWrong: -15
  },
  
  // GAME 59: Multi-Modal Match (Pattern)
  {
    id: 59,
    name: 'Multi-Modal Match',
    category: 'Pattern',
    icon: '🔷',
    difficulty: 'hard',
    timeLimit: 90,
    instruction: 'Match items across visual, verbal, and spatial representations!',
    benefits: 'Integrates multiple cognitive systems for enhanced brain connectivity.',
    technique: 'Bridge Tip: Find one common feature that works across all modes.',
    pointsCorrect: 35,
    pointsWrong: -20
  },
  
  // GAME 60: Ultimate Memory Challenge (Pattern) - FINAL BOSS
  {
    id: 60,
    name: 'Ultimate Challenge',
    category: 'Pattern',
    icon: '👑',
    difficulty: 'expert',
    timeLimit: 120,
    instruction: 'The final test! Combines ALL memory types in one epic challenge.',
    benefits: 'The ultimate test of your enhanced memory abilities - you\'ve got this!',
    technique: 'Calm Tip: You\'ve practiced all these skills. Trust your skills and stay calm.',
    pointsCorrect: 50,
    pointsWrong: -25
  }
];

// ==========================================
// HELPER FUNCTIONS
// ==========================================

const getGameById = (id) => GAMES.find(g => g.id === id);

const getGamesByCategory = (category) => GAMES.filter(g => g.category === category);

const getGamesByDifficulty = (difficulty) => GAMES.filter(g => g.difficulty === difficulty);

const getFreeGames = () => GAMES.filter(g => g.id <= 15);

const getPremiumGames = () => GAMES.filter(g => g.id > 15);

const getTotalGames = () => GAMES.length;

const getRandomGame = (excludeId = null) => {
  const available = GAMES.filter(g => g.id !== excludeId);
  return available[Math.floor(Math.random() * available.length)];
};

// Category distribution for stats
const CATEGORIES = {
  Visual: { color: '#8B5CF6', icon: '👁️' },
  Numeric: { color: '#F59E0B', icon: '🔢' },
  Verbal: { color: '#10B981', icon: '📝' },
  Spatial: { color: '#3B82F6', icon: '🗺️' },
  Pattern: { color: '#EC4899', icon: '🧩' },
  Speed: { color: '#EF4444', icon: '⚡' },
  Auditory: { color: '#6366F1', icon: '🔊' }
};

// Difficulty distribution
const DIFFICULTIES = {
  easy: { multiplier: 1.0, color: '#22c55e' },
  medium: { multiplier: 1.2, color: '#f59e0b' },
  hard: { multiplier: 1.5, color: '#ef4444' },
  expert: { multiplier: 2.0, color: '#8b5cf6' }
};

// Make available globally
window.GAMES = GAMES;
window.getGameById = getGameById;
window.getGamesByCategory = getGamesByCategory;
window.getGamesByDifficulty = getGamesByDifficulty;
window.getFreeGames = getFreeGames;
window.getPremiumGames = getPremiumGames;
window.getTotalGames = getTotalGames;
window.getRandomGame = getRandomGame;
window.CATEGORIES = CATEGORIES;
window.DIFFICULTIES = DIFFICULTIES;
