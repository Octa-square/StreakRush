// ========================================
// STREAKRUSH - 60 BRAIN TRAINING GAMES
// Scientifically-designed memory challenges!
// ========================================

const SimpleGames = {
  score: 0,
  gameArea: null,
  isActive: false,
  gameType: null,
  intervals: [],
  timeouts: [],
  gameData: {},
  maxPossibleScore: 0, // Track for percentage calculation
  questionsAnswered: 0,
  correctAnswers: 0,
  wrongAnswers: 0,
  reactionTimes: [], // Track reaction times for speed bonus
  questionStartTime: 0, // When current question started
  
  // NEW SCORING SYSTEM
  SCORING: {
    correctAnswer: 25,
    wrongAnswer: -15,
    speedBonus: {
      under1sec: 10,
      under2sec: 5
    },
    volumeBonus: {
      15: 50,   // Answer 15+ questions correctly
      20: 100,  // Answer 20+ questions correctly
      25: 200   // Answer 25+ questions correctly
    },
    accuracyBonus: {
      100: 200,  // Perfect accuracy
      95: 100,   // 95%+ accuracy
      90: 50     // 90%+ accuracy
    }
  },
  
  clearTimers: () => {
    SimpleGames.intervals.forEach(i => clearInterval(i));
    SimpleGames.timeouts.forEach(t => clearTimeout(t));
    SimpleGames.intervals = [];
    SimpleGames.timeouts = [];
  },
  
  init: (gameArea, gameId) => {
    SimpleGames.gameArea = gameArea;
    SimpleGames.score = 0;
    SimpleGames.maxPossibleScore = 0;
    SimpleGames.questionsAnswered = 0;
    SimpleGames.correctAnswers = 0;
    SimpleGames.wrongAnswers = 0;
    SimpleGames.reactionTimes = [];
    SimpleGames.questionStartTime = 0;
    SimpleGames.isActive = true;
    SimpleGames.gameType = gameId;
    SimpleGames.gameData = {};
    SimpleGames.clearTimers();
    gameArea.innerHTML = '';
  },
  
  // Start timing a question
  startQuestionTimer: () => {
    SimpleGames.questionStartTime = Date.now();
  },
  
  // Get reaction time for current question
  getReactionTime: () => {
    if (!SimpleGames.questionStartTime) return 0;
    return Date.now() - SimpleGames.questionStartTime;
  },
  
  // NO question cap - games run until time expires
  checkGameComplete: () => {
    // Games no longer have a cap - they run until time runs out
    return false;
  },
  
  // Record a question answered
  recordQuestion: (correct = false) => {
    SimpleGames.questionsAnswered++;
    
    if (correct) {
      SimpleGames.correctAnswers++;
      const reactionTime = SimpleGames.getReactionTime();
      SimpleGames.reactionTimes.push(reactionTime);
    } else {
      SimpleGames.wrongAnswers++;
    }
    
    // Update progress display if exists
    const progressEl = document.getElementById('q-num');
    if (progressEl) {
      progressEl.textContent = SimpleGames.questionsAnswered;
    }
  },
  
  // Calculate final score with bonuses
  calculateFinalScore: () => {
    let baseScore = SimpleGames.score;
    let bonuses = {
      speed: 0,
      volume: 0,
      accuracy: 0
    };
    
    // Speed bonus - based on average reaction time
    if (SimpleGames.reactionTimes.length > 0) {
      const avgReaction = SimpleGames.reactionTimes.reduce((a, b) => a + b, 0) / SimpleGames.reactionTimes.length;
      
      const fastAnswers = SimpleGames.reactionTimes.filter(t => t < 1000).length;
      const mediumAnswers = SimpleGames.reactionTimes.filter(t => t >= 1000 && t < 2000).length;
      
      bonuses.speed = (fastAnswers * SimpleGames.SCORING.speedBonus.under1sec) + 
                      (mediumAnswers * SimpleGames.SCORING.speedBonus.under2sec);
    }
    
    // Volume bonus - for answering many questions correctly
    const volumeThresholds = Object.entries(SimpleGames.SCORING.volumeBonus)
      .sort((a, b) => parseInt(b[0]) - parseInt(a[0])); // Sort descending
    
    for (const [threshold, bonus] of volumeThresholds) {
      if (SimpleGames.correctAnswers >= parseInt(threshold)) {
        bonuses.volume = bonus;
        break; // Only get highest applicable bonus
      }
    }
    
    // Accuracy bonus
    if (SimpleGames.questionsAnswered > 0) {
      const accuracy = (SimpleGames.correctAnswers / SimpleGames.questionsAnswered) * 100;
      
      const accuracyThresholds = Object.entries(SimpleGames.SCORING.accuracyBonus)
        .sort((a, b) => parseInt(b[0]) - parseInt(a[0])); // Sort descending
      
      for (const [threshold, bonus] of accuracyThresholds) {
        if (accuracy >= parseInt(threshold)) {
          bonuses.accuracy = bonus;
          break; // Only get highest applicable bonus
        }
      }
    }
    
    const totalBonus = bonuses.speed + bonuses.volume + bonuses.accuracy;
    const finalScore = Math.max(0, baseScore + totalBonus);
    
    return {
      baseScore: baseScore,
      bonuses: bonuses,
      totalBonus: totalBonus,
      finalScore: finalScore,
      correctAnswers: SimpleGames.correctAnswers,
      wrongAnswers: SimpleGames.wrongAnswers,
      totalQuestions: SimpleGames.questionsAnswered,
      accuracy: SimpleGames.questionsAnswered > 0 
        ? Math.round((SimpleGames.correctAnswers / SimpleGames.questionsAnswered) * 100)
        : 0,
      avgReactionTime: SimpleGames.reactionTimes.length > 0
        ? Math.round(SimpleGames.reactionTimes.reduce((a, b) => a + b, 0) / SimpleGames.reactionTimes.length)
        : 0
    };
  },
  
  // Pause/Resume game timer
  pauseTimer: () => {
    if (typeof Game !== 'undefined' && Game.timerInterval) {
      clearInterval(Game.timerInterval);
      SimpleGames.timerPaused = true;
    }
  },
  
  resumeTimer: () => {
    if (typeof Game !== 'undefined' && SimpleGames.timerPaused) {
      Game.startTimer();
      SimpleGames.timerPaused = false;
    }
  },
  
  // Show explanation for wrong answer with continue button
  showExplanation: (answer, funFact, callback) => {
    // Pause the game timer
    SimpleGames.pauseTimer();
    
    // Create or get explanation overlay
    let overlay = document.getElementById('explanation-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'explanation-overlay';
      document.body.appendChild(overlay);
      
      // Add animation keyframes if not exists
      if (!document.getElementById('explanation-styles')) {
        const style = document.createElement('style');
        style.id = 'explanation-styles';
        style.textContent = `
          @keyframes slideUp {
            from { opacity: 0; transform: translateX(-50%) translateY(20px); }
            to { opacity: 1; transform: translateX(-50%) translateY(0); }
          }
          @keyframes pulse-glow {
            0%, 100% { box-shadow: 0 0 20px rgba(255,107,53,0.3); }
            50% { box-shadow: 0 0 30px rgba(255,107,53,0.6); }
          }
        `;
        document.head.appendChild(style);
      }
    }
    
    overlay.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: linear-gradient(135deg, #1e3a5f 0%, #0d1b2a 100%);
      border: 2px solid #ff6b35;
      border-radius: 20px;
      padding: 24px 28px;
      max-width: 90%;
      width: 340px;
      z-index: 1000;
      text-align: center;
      animation: slideUp 0.3s ease-out, pulse-glow 2s ease-in-out infinite;
      box-shadow: 0 8px 32px rgba(0,0,0,0.5);
    `;
    
    overlay.innerHTML = `
      <div style="color: #ef4444; font-size: 1.2rem; margin-bottom: 12px;">❌ Not quite!</div>
      <div style="color: #22c55e; font-size: 1.3rem; font-weight: 600; margin-bottom: 16px;">✓ ${answer}</div>
      <div style="background: rgba(255,255,255,0.05); border-radius: 12px; padding: 14px; margin-bottom: 20px;">
        <div style="color: #ffd700; font-size: 0.85rem; margin-bottom: 6px;">💡 Fun Fact</div>
        <div style="color: #e0e0e0; font-size: 0.95rem; line-height: 1.5;">${funFact}</div>
      </div>
      <button id="continue-after-explanation" style="
        background: linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%);
        border: none;
        color: white;
        padding: 14px 40px;
        font-size: 1.1rem;
        font-weight: 600;
        border-radius: 30px;
        cursor: pointer;
        text-transform: uppercase;
        letter-spacing: 1px;
        transition: transform 0.2s;
      ">Continue →</button>
      <div style="color: #888; font-size: 0.8rem; margin-top: 12px;">⏸ Timer paused</div>
    `;
    overlay.style.display = 'block';
    
    // Continue button handler
    document.getElementById('continue-after-explanation').onclick = () => {
      overlay.style.display = 'none';
      SimpleGames.resumeTimer();
      if (callback) callback();
    };
  },
  
  start: (gameId) => {
    const game = getGameById(gameId);
    if (!game) return;
    SimpleGames.startUniqueGame(gameId, game);
  },
  
  addScore: (points) => {
    SimpleGames.score += points;
    SimpleGames.maxPossibleScore += SimpleGames.SCORING.correctAnswer;
    SimpleGames.recordQuestion(true); // Track as correct
    SimpleGames.showScorePopup(points);
    if (typeof Sounds !== 'undefined' && Sounds.correct) Sounds.correct();
  },
  
  loseScore: (points) => {
    SimpleGames.score = Math.max(0, SimpleGames.score - Math.abs(points));
    SimpleGames.maxPossibleScore += SimpleGames.SCORING.correctAnswer; // Could have earned this
    SimpleGames.recordQuestion(false); // Track as wrong
    SimpleGames.showScorePopup(-Math.abs(points));
    if (typeof Sounds !== 'undefined' && Sounds.wrong) Sounds.wrong();
  },
  
  // Track possible score for percentage calculation
  trackPossible: (points) => {
    SimpleGames.maxPossibleScore += points;
  },
  
  showScorePopup: (points) => {
    const popup = document.createElement('div');
    popup.className = `score-popup ${points > 0 ? 'positive' : 'negative'}`;
    popup.textContent = points > 0 ? `+${points}` : points;
    popup.style.left = `${Math.random() * 60 + 20}%`;
    popup.style.top = `${Math.random() * 40 + 30}%`;
    SimpleGames.gameArea.appendChild(popup);
    setTimeout(() => popup.remove(), 800);
  },
  
  end: () => {
    SimpleGames.isActive = false;
    SimpleGames.clearTimers();
    return SimpleGames.score;
  },
  
  getScorePercentage: () => {
    if (SimpleGames.maxPossibleScore === 0) return 0;
    return Math.round((SimpleGames.score / SimpleGames.maxPossibleScore) * 100);
  },

  // ========================================
  // UNIQUE GAME ROUTER
  // ========================================
  startUniqueGame: (gameId, game) => {
    const area = SimpleGames.gameArea;
    
    area.innerHTML = `
      <div class="game-header-display">
        <div class="game-icon-display">${game.icon}</div>
        <div class="game-title-display">${game.name}</div>
      </div>
      <div class="game-zone" id="game-zone"></div>
    `;
    
    const zone = document.getElementById('game-zone');
    
    // Route to specific unique game based on ID (60 games total)
    switch(gameId) {
      // FREE TIER: Games 1-15
      case 1: SimpleGames.game_ColorSequence(zone); break;
      case 2: SimpleGames.game_NumberFlash(zone); break;
      case 3: SimpleGames.game_ReactionTest(zone); break;
      case 4: SimpleGames.game_CardMatch(zone); break;
      case 5: SimpleGames.game_ShapeShifter(zone); break;
      case 6: SimpleGames.game_SpeedMath(zone); break;
      case 7: SimpleGames.game_WorldCapitals(zone); break;
      case 8: SimpleGames.game_WordChain(zone); break;
      case 9: SimpleGames.game_WhatsMissing(zone); break;
      case 10: SimpleGames.game_PositionPerfect(zone); break;
      case 11: SimpleGames.game_EmojiStory(zone); break;
      case 12: SimpleGames.game_PatternBreaker(zone); break;
      case 13: SimpleGames.game_SoundSequence(zone); break;
      case 14: SimpleGames.game_FaceMemory(zone); break;
      case 15: SimpleGames.game_NumberGrid(zone); break;
      
      // PREMIUM BATCH 1: Games 16-30
      case 16: SimpleGames.game_DualNBack(zone); break;
      case 17: SimpleGames.game_SpeedTyping(zone); break;
      case 18: SimpleGames.game_BackwardsSpell(zone); break;
      case 19: SimpleGames.game_ColorWordClash(zone); break;
      case 20: SimpleGames.game_SequenceBuilder(zone); break;
      case 21: SimpleGames.game_RapidRecall(zone); break;
      case 22: SimpleGames.game_MathChains(zone); break;
      case 23: SimpleGames.game_WordMorph(zone); break;
      case 24: SimpleGames.game_GridNavigator(zone); break;
      case 25: SimpleGames.game_SymbolMatch(zone); break;
      case 26: SimpleGames.game_TrueFalseBlitz(zone); break;
      case 27: SimpleGames.game_RhythmRecall(zone); break;
      case 28: SimpleGames.game_FlagFinder(zone); break;
      case 29: SimpleGames.game_OddOneOut(zone); break;
      case 30: SimpleGames.game_QuickCount(zone); break;
      
      // PREMIUM BATCH 2: Games 31-45
      case 31: SimpleGames.game_TripleNBack(zone); break;
      case 32: SimpleGames.game_ReverseOrder(zone); break;
      case 33: SimpleGames.game_LetterEquations(zone); break;
      case 34: SimpleGames.game_MemoryPalace(zone); break;
      case 35: SimpleGames.game_LandmarkMemory(zone); break;
      case 36: SimpleGames.game_MentalRotation(zone); break;
      case 37: SimpleGames.game_WordRecall(zone); break;
      case 38: SimpleGames.game_CalculationSprint(zone); break;
      case 39: SimpleGames.game_EmotionalFaces(zone); break;
      case 40: SimpleGames.game_SynonymSprint(zone); break;
      case 41: SimpleGames.game_PhotoMemory(zone); break;
      case 42: SimpleGames.game_MelodyMemory(zone); break;
      case 43: SimpleGames.game_SplitAttention(zone); break;
      case 44: SimpleGames.game_NumberBonds(zone); break;
      case 45: SimpleGames.game_ContextSwitch(zone); break;
      
      // PREMIUM BATCH 3: Games 46-60
      case 46: SimpleGames.game_SpeedPatterns(zone); break;
      case 47: SimpleGames.game_LogicChains(zone); break;
      case 48: SimpleGames.game_CategorySort(zone); break;
      case 49: SimpleGames.game_MazeMemory(zone); break;
      case 50: SimpleGames.game_VerbalFluency(zone); break;
      case 51: SimpleGames.game_PrimeTime(zone); break;
      case 52: SimpleGames.game_VisualEquations(zone); break;
      case 53: SimpleGames.game_AttentionFilter(zone); break;
      case 54: SimpleGames.game_StorySequence(zone); break;
      case 55: SimpleGames.game_PeripheralVision(zone); break;
      case 56: SimpleGames.game_EstimationMaster(zone); break;
      case 57: SimpleGames.game_CodeBreaker(zone); break;
      case 58: SimpleGames.game_AudioLocation(zone); break;
      case 59: SimpleGames.game_MultiModalMatch(zone); break;
      case 60: SimpleGames.game_UltimateChallenge(zone); break;
      
      default: SimpleGames.gameGeneric(zone, game); break;
    }
  },

  // ========================================
  // GAME 1: WORLD CAPITALS - Geography Quiz
  // Continuous questions about world capitals
  // ========================================
  game1_WorldCapitals: (zone) => {
    const capitals = [
      { country: 'France', capital: 'Paris', wrong: ['London', 'Berlin', 'Madrid'], fact: 'Paris is called "The City of Light" because it was one of the first cities to adopt gas street lighting in the 1800s.' },
      { country: 'Japan', capital: 'Tokyo', wrong: ['Seoul', 'Beijing', 'Bangkok'], fact: 'Tokyo is the world\'s most populous metropolitan area with over 37 million people - more than Canada!' },
      { country: 'Australia', capital: 'Canberra', wrong: ['Sydney', 'Melbourne', 'Perth'], fact: 'Canberra was purpose-built as the capital in 1913 because Sydney and Melbourne couldn\'t agree on which should be the capital.' },
      { country: 'Brazil', capital: 'Brasília', wrong: ['Rio de Janeiro', 'São Paulo', 'Salvador'], fact: 'Brasília was built from scratch in just 41 months and is designed to look like an airplane from above.' },
      { country: 'Egypt', capital: 'Cairo', wrong: ['Alexandria', 'Luxor', 'Giza'], fact: 'Cairo means "The Victorious" in Arabic and is home to the only remaining ancient wonder: the Great Pyramid of Giza.' },
      { country: 'Canada', capital: 'Ottawa', wrong: ['Toronto', 'Vancouver', 'Montreal'], fact: 'Ottawa has the world\'s largest skating rink - the frozen Rideau Canal stretches 7.8 km through the city!' },
      { country: 'Germany', capital: 'Berlin', wrong: ['Munich', 'Frankfurt', 'Hamburg'], fact: 'Berlin has more bridges than Venice (over 1,700!) and more museums than rainy days per year.' },
      { country: 'India', capital: 'New Delhi', wrong: ['Mumbai', 'Bangalore', 'Chennai'], fact: 'New Delhi was designed by British architects and completed in 1931, replacing Calcutta as India\'s capital.' },
      { country: 'South Africa', capital: 'Pretoria', wrong: ['Cape Town', 'Johannesburg', 'Durban'], fact: 'South Africa uniquely has THREE capitals: Pretoria (executive), Cape Town (legislative), and Bloemfontein (judicial).' },
      { country: 'China', capital: 'Beijing', wrong: ['Shanghai', 'Hong Kong', 'Guangzhou'], fact: 'Beijing means "Northern Capital" and has served as China\'s capital for over 800 years. The Forbidden City has 9,999 rooms!' },
      { country: 'Italy', capital: 'Rome', wrong: ['Milan', 'Venice', 'Florence'], fact: 'Rome is called the "Eternal City" and contains an entire country within it - Vatican City, the world\'s smallest nation.' },
      { country: 'Mexico', capital: 'Mexico City', wrong: ['Cancun', 'Guadalajara', 'Monterrey'], fact: 'Mexico City is built on a lake bed and is sinking about 10 inches per year. It has more museums than any city in the world!' },
      { country: 'Russia', capital: 'Moscow', wrong: ['St. Petersburg', 'Novosibirsk', 'Kazan'], fact: 'Moscow\'s metro system is famous for its palatial stations, featuring chandeliers, mosaics, and marble columns like underground palaces.' },
      { country: 'Spain', capital: 'Madrid', wrong: ['Barcelona', 'Seville', 'Valencia'], fact: 'Madrid is the highest capital city in Europe at 667 meters. The Prado Museum has over 8,000 paintings!' },
      { country: 'Turkey', capital: 'Ankara', wrong: ['Istanbul', 'Izmir', 'Antalya'], fact: 'Ankara became Turkey\'s capital in 1923 instead of Istanbul because it was more centrally located and strategically safer.' },
      { country: 'Nigeria', capital: 'Abuja', wrong: ['Lagos', 'Kano', 'Ibadan'], fact: 'Abuja replaced Lagos as capital in 1991 and was built from scratch in the center of Nigeria for ethnic neutrality.' },
      { country: 'Argentina', capital: 'Buenos Aires', wrong: ['Córdoba', 'Rosario', 'Mendoza'], fact: 'Buenos Aires means "Good Airs" and has the widest avenue in the world - 9 de Julio Avenue has 16 lanes!' },
      { country: 'Kenya', capital: 'Nairobi', wrong: ['Mombasa', 'Kisumu', 'Nakuru'], fact: 'Nairobi has a national park within city limits where you can see lions with skyscrapers in the background!' },
      { country: 'Thailand', capital: 'Bangkok', wrong: ['Chiang Mai', 'Phuket', 'Pattaya'], fact: 'Bangkok\'s full ceremonial name has 168 letters, making it the longest city name in the world!' },
      { country: 'Poland', capital: 'Warsaw', wrong: ['Krakow', 'Gdansk', 'Wroclaw'], fact: 'Warsaw was 85% destroyed in WWII but was meticulously rebuilt. Its Old Town is a UNESCO World Heritage Site.' }
    ];
    
    let usedQuestions = [];
    
    zone.innerHTML = `
      <div class="quiz-container">
        <div class="quiz-progress">Questions: <span id="q-num">0</span> | Correct: <span id="q-correct">0</span></div>
        <div class="quiz-question" id="quiz-question">🌍 Loading...</div>
        <div class="quiz-options" id="quiz-options"></div>
        <div class="quiz-timer-bar"><div class="quiz-timer-fill" id="timer-fill"></div></div>
      </div>
    `;
    zone.style.cssText = 'background: linear-gradient(180deg, #1e3a5f 0%, #0d1b2a 100%); border-radius: 20px; padding: 20px;';
    
    const askQuestion = () => {
      if (!SimpleGames.isActive) return;
      
      // Get unused question (recycle when all used)
      let available = capitals.filter((_, i) => !usedQuestions.includes(i));
      if (available.length === 0) {
        usedQuestions = [];
        available = capitals;
      }
      
      const idx = capitals.indexOf(available[Math.floor(Math.random() * available.length)]);
      usedQuestions.push(idx);
      const q = capitals[idx];
      
      // Start timing this question
      SimpleGames.startQuestionTimer();
      
      document.getElementById('q-num').textContent = SimpleGames.questionsAnswered + 1;
      document.getElementById('q-correct').textContent = SimpleGames.correctAnswers;
      document.getElementById('quiz-question').innerHTML = `🌍 What is the capital of <strong>${q.country}</strong>?`;
      
      // Shuffle options
      const options = [q.capital, ...q.wrong].sort(() => Math.random() - 0.5);
      const optionsDiv = document.getElementById('quiz-options');
      optionsDiv.innerHTML = '';
      
      options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'quiz-option';
        btn.textContent = opt;
        btn.style.cssText = `
          display: block;
          width: 100%;
          padding: 15px;
          margin: 8px 0;
          font-size: 1.1rem;
          border: none;
          border-radius: 12px;
          background: rgba(255,255,255,0.1);
          color: white;
          cursor: pointer;
          transition: all 0.2s;
        `;
        
        btn.onclick = () => {
          clearTimeout(questionTimer);
          
          if (opt === q.capital) {
            SimpleGames.addScore(SimpleGames.SCORING.correctAnswer);
            btn.style.background = '#22c55e';
            optionsDiv.querySelectorAll('button').forEach(b => b.disabled = true);
            
            // Update correct count and move to next question
            document.getElementById('q-correct').textContent = SimpleGames.correctAnswers;
            setTimeout(askQuestion, 800); // Faster pace - no cap!
          } else {
            SimpleGames.loseScore(Math.abs(SimpleGames.SCORING.wrongAnswer));
            btn.style.background = '#ef4444';
            // Show correct answer
            optionsDiv.querySelectorAll('button').forEach(b => {
              if (b.textContent === q.capital) b.style.background = '#22c55e';
              b.disabled = true;
            });
            
            // Show explanation with fun fact (timer paused)
            SimpleGames.showExplanation(
              `${q.capital} is the capital of ${q.country}`,
              q.fact,
              askQuestion // Continue to next question after explanation
            );
          }
        };
        optionsDiv.appendChild(btn);
      });
      
      // Timer for each question (5 seconds)
      const timerFill = document.getElementById('timer-fill');
      timerFill.style.cssText = 'height: 100%; width: 100%; background: linear-gradient(90deg, #22c55e 0%, #4ade80 100%); transition: width 5s linear;';
      setTimeout(() => timerFill.style.width = '0%', 50);
      
      const questionTimer = setTimeout(() => {
        if (!SimpleGames.isActive) return;
        SimpleGames.loseScore(Math.abs(SimpleGames.SCORING.wrongAnswer));
        optionsDiv.querySelectorAll('button').forEach(b => {
          b.disabled = true;
          if (b.textContent === q.capital) b.style.background = '#22c55e';
        });
        
        // Show explanation for timeout with fun fact
        SimpleGames.showExplanation(
          `⏱️ Time's up! ${q.capital} is the capital of ${q.country}`,
          q.fact,
          askQuestion // Continue to next question
        );
      }, 5000);
      
      SimpleGames.timeouts.push(questionTimer);
    };
    
    askQuestion();
  },

  // ========================================
  // GAME 2: FLAG MATCH - Identify Country Flags
  // ========================================
  game2_FlagMatch: (zone) => {
    const flags = [
      { country: 'Japan', flag: '🇯🇵' },
      { country: 'USA', flag: '🇺🇸' },
      { country: 'UK', flag: '🇬🇧' },
      { country: 'France', flag: '🇫🇷' },
      { country: 'Germany', flag: '🇩🇪' },
      { country: 'Italy', flag: '🇮🇹' },
      { country: 'Spain', flag: '🇪🇸' },
      { country: 'Brazil', flag: '🇧🇷' },
      { country: 'Canada', flag: '🇨🇦' },
      { country: 'Australia', flag: '🇦🇺' },
      { country: 'India', flag: '🇮🇳' },
      { country: 'China', flag: '🇨🇳' },
      { country: 'Russia', flag: '🇷🇺' },
      { country: 'Mexico', flag: '🇲🇽' },
      { country: 'South Korea', flag: '🇰🇷' },
      { country: 'Nigeria', flag: '🇳🇬' },
      { country: 'South Africa', flag: '🇿🇦' },
      { country: 'Egypt', flag: '🇪🇬' },
      { country: 'Argentina', flag: '🇦🇷' },
      { country: 'Sweden', flag: '🇸🇪' }
    ];
    
    let usedFlags = [];
    
    zone.innerHTML = `
      <div class="flag-container">
        <div class="flag-display" id="flag-display">🏳️</div>
        <div class="flag-question">Which country?</div>
        <div class="flag-options" id="flag-options"></div>
      </div>
    `;
    zone.style.cssText = 'background: linear-gradient(180deg, #7c3aed 0%, #5b21b6 100%); border-radius: 20px; padding: 20px; text-align: center;';
    
    const showFlag = () => {
      if (!SimpleGames.isActive) return;
      
      let available = flags.filter((_, i) => !usedFlags.includes(i));
      if (available.length < 4) {
        usedFlags = [];
        available = flags;
      }
      
      const correctIdx = flags.indexOf(available[Math.floor(Math.random() * available.length)]);
      usedFlags.push(correctIdx);
      const correct = flags[correctIdx];
      
      document.getElementById('flag-display').textContent = correct.flag;
      document.getElementById('flag-display').style.cssText = 'font-size: 8rem; margin: 20px 0; animation: flagWave 1s ease-in-out;';
      
      // Get 3 wrong answers
      const wrongOptions = flags.filter(f => f.country !== correct.country)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map(f => f.country);
      
      const options = [correct.country, ...wrongOptions].sort(() => Math.random() - 0.5);
      const optionsDiv = document.getElementById('flag-options');
      optionsDiv.innerHTML = '';
      optionsDiv.style.cssText = 'display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 20px;';
      
      options.forEach(country => {
        const btn = document.createElement('button');
        btn.textContent = country;
        btn.style.cssText = `
          padding: 15px;
          font-size: 1rem;
          font-weight: 600;
          border: none;
          border-radius: 12px;
          background: rgba(255,255,255,0.15);
          color: white;
          cursor: pointer;
        `;
        
        btn.onclick = () => {
          if (country === correct.country) {
            SimpleGames.addScore(30);
            btn.style.background = '#22c55e';
          } else {
            SimpleGames.loseScore(20);
            btn.style.background = '#ef4444';
          }
          optionsDiv.querySelectorAll('button').forEach(b => b.disabled = true);
          setTimeout(showFlag, 1000);
        };
        optionsDiv.appendChild(btn);
      });
    };
    
    showFlag();
  },

  // ========================================
  // GAME 3: CONTINENT SORT - Sort Countries
  // ========================================
  game3_ContinentSort: (zone) => {
    const countries = [
      { name: 'Brazil', continent: 'South America' },
      { name: 'Nigeria', continent: 'Africa' },
      { name: 'Japan', continent: 'Asia' },
      { name: 'France', continent: 'Europe' },
      { name: 'Australia', continent: 'Oceania' },
      { name: 'Canada', continent: 'North America' },
      { name: 'Egypt', continent: 'Africa' },
      { name: 'India', continent: 'Asia' },
      { name: 'Germany', continent: 'Europe' },
      { name: 'Mexico', continent: 'North America' },
      { name: 'Argentina', continent: 'South America' },
      { name: 'Kenya', continent: 'Africa' },
      { name: 'China', continent: 'Asia' },
      { name: 'Italy', continent: 'Europe' },
      { name: 'Peru', continent: 'South America' },
      { name: 'Thailand', continent: 'Asia' },
      { name: 'South Africa', continent: 'Africa' },
      { name: 'Poland', continent: 'Europe' },
      { name: 'New Zealand', continent: 'Oceania' },
      { name: 'Colombia', continent: 'South America' }
    ];
    
    const continents = ['Africa', 'Asia', 'Europe', 'North America', 'South America', 'Oceania'];
    let currentCountry = null;
    
    zone.innerHTML = `
      <div class="sort-game">
        <div class="sort-country" id="sort-country">🌍</div>
        <div class="sort-hint">Tap the correct continent!</div>
        <div class="sort-options" id="sort-options"></div>
      </div>
    `;
    zone.style.cssText = 'background: linear-gradient(180deg, #059669 0%, #047857 100%); border-radius: 20px; padding: 20px; text-align: center;';
    
    const optionsDiv = document.getElementById('sort-options');
    optionsDiv.style.cssText = 'display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 20px;';
    
    const showCountry = () => {
      if (!SimpleGames.isActive) return;
      
      currentCountry = countries[Math.floor(Math.random() * countries.length)];
      document.getElementById('sort-country').innerHTML = `<strong>${currentCountry.name}</strong>`;
      document.getElementById('sort-country').style.cssText = 'font-size: 2rem; padding: 20px; background: rgba(255,255,255,0.1); border-radius: 15px; margin-bottom: 15px;';
      
      // Show continent options
      optionsDiv.innerHTML = '';
      const shuffledContinents = [...continents].sort(() => Math.random() - 0.5);
      
      shuffledContinents.forEach(cont => {
        const btn = document.createElement('button');
        btn.textContent = cont;
        btn.style.cssText = `
          padding: 12px;
          font-size: 0.95rem;
          font-weight: 600;
          border: none;
          border-radius: 10px;
          background: rgba(255,255,255,0.15);
          color: white;
          cursor: pointer;
        `;
        
        btn.onclick = () => {
          if (cont === currentCountry.continent) {
            SimpleGames.addScore(20);
            btn.style.background = '#22c55e';
          } else {
            SimpleGames.loseScore(15);
            btn.style.background = '#ef4444';
            optionsDiv.querySelectorAll('button').forEach(b => {
              if (b.textContent === currentCountry.continent) b.style.background = '#22c55e';
            });
          }
          optionsDiv.querySelectorAll('button').forEach(b => b.disabled = true);
          setTimeout(showCountry, 1000);
        };
        optionsDiv.appendChild(btn);
      });
    };
    
    showCountry();
  },

  // ========================================
  // GAME 4: SPEED MATH - Quick Calculations
  // ========================================
  game4_SpeedMath: (zone) => {
    zone.innerHTML = `
      <div class="math-game">
        <div class="math-problem" id="math-problem">?</div>
        <div class="math-options" id="math-options"></div>
        <div class="math-streak">Streak: <span id="math-streak">0</span></div>
      </div>
    `;
    zone.style.cssText = 'background: linear-gradient(180deg, #0ea5e9 0%, #0284c7 100%); border-radius: 20px; padding: 20px; text-align: center;';
    
    let streak = 0;
    
    const generateProblem = () => {
      if (!SimpleGames.isActive) return;
      
      const ops = ['+', '-', '×'];
      const op = ops[Math.floor(Math.random() * ops.length)];
      let a, b, answer;
      
      switch(op) {
        case '+':
          a = Math.floor(Math.random() * 50) + 10;
          b = Math.floor(Math.random() * 50) + 10;
          answer = a + b;
          break;
        case '-':
          a = Math.floor(Math.random() * 50) + 30;
          b = Math.floor(Math.random() * 30) + 1;
          answer = a - b;
          break;
        case '×':
          a = Math.floor(Math.random() * 12) + 2;
          b = Math.floor(Math.random() * 12) + 2;
          answer = a * b;
          break;
      }
      
      document.getElementById('math-problem').innerHTML = `${a} ${op} ${b} = ?`;
      document.getElementById('math-problem').style.cssText = 'font-size: 3rem; font-weight: bold; padding: 30px; background: rgba(255,255,255,0.1); border-radius: 20px; margin-bottom: 20px;';
      
      // Generate wrong answers
      const wrongAnswers = [
        answer + Math.floor(Math.random() * 10) + 1,
        answer - Math.floor(Math.random() * 10) - 1,
        answer + Math.floor(Math.random() * 20) - 10
      ].filter(w => w !== answer && w > 0);
      
      const options = [answer, ...wrongAnswers.slice(0, 3)].sort(() => Math.random() - 0.5);
      const optionsDiv = document.getElementById('math-options');
      optionsDiv.innerHTML = '';
      optionsDiv.style.cssText = 'display: grid; grid-template-columns: 1fr 1fr; gap: 15px;';
      
      options.forEach(opt => {
        const btn = document.createElement('button');
        btn.textContent = opt;
        btn.style.cssText = `
          padding: 20px;
          font-size: 1.5rem;
          font-weight: bold;
          border: none;
          border-radius: 15px;
          background: white;
          color: #0284c7;
          cursor: pointer;
        `;
        
        btn.onclick = () => {
          if (opt === answer) {
            streak++;
            SimpleGames.addScore(20 + streak * 5);
          } else {
            streak = 0;
            SimpleGames.loseScore(15);
          }
          document.getElementById('math-streak').textContent = streak;
          optionsDiv.querySelectorAll('button').forEach(b => b.disabled = true);
          setTimeout(generateProblem, 800);
        };
        optionsDiv.appendChild(btn);
      });
    };
    
    generateProblem();
  },

  // ========================================
  // GAME 5: COUNTRY POPULATION - Bigger or Smaller
  // ========================================
  game5_CountryPopulation: (zone) => {
    const countries = [
      { name: 'China', pop: 1400 },
      { name: 'India', pop: 1380 },
      { name: 'USA', pop: 330 },
      { name: 'Indonesia', pop: 270 },
      { name: 'Brazil', pop: 210 },
      { name: 'Nigeria', pop: 200 },
      { name: 'Russia', pop: 145 },
      { name: 'Japan', pop: 126 },
      { name: 'Mexico', pop: 128 },
      { name: 'Germany', pop: 83 },
      { name: 'UK', pop: 67 },
      { name: 'France', pop: 67 },
      { name: 'Italy', pop: 60 },
      { name: 'South Africa', pop: 59 },
      { name: 'Kenya', pop: 54 },
      { name: 'Canada', pop: 38 },
      { name: 'Australia', pop: 26 },
      { name: 'Sweden', pop: 10 },
      { name: 'New Zealand', pop: 5 },
      { name: 'Iceland', pop: 0.4 }
    ];
    
    zone.innerHTML = `
      <div class="pop-game">
        <div class="pop-question">Which has MORE people?</div>
        <div class="pop-choices" id="pop-choices"></div>
        <div class="pop-score">Correct: <span id="pop-correct">0</span></div>
      </div>
    `;
    zone.style.cssText = 'background: linear-gradient(180deg, #dc2626 0%, #b91c1c 100%); border-radius: 20px; padding: 20px; text-align: center;';
    
    let correct = 0;
    
    const showChoice = () => {
      if (!SimpleGames.isActive) return;
      
      const shuffled = [...countries].sort(() => Math.random() - 0.5);
      const a = shuffled[0];
      const b = shuffled[1];
      const bigger = a.pop > b.pop ? a : b;
      
      const choicesDiv = document.getElementById('pop-choices');
      choicesDiv.innerHTML = '';
      choicesDiv.style.cssText = 'display: flex; flex-direction: column; gap: 15px; margin: 30px 0;';
      
      [a, b].forEach(country => {
        const btn = document.createElement('button');
        btn.innerHTML = `<span style="font-size: 2rem;">🌍</span><br><strong>${country.name}</strong>`;
        btn.style.cssText = `
          padding: 25px;
          font-size: 1.2rem;
          border: none;
          border-radius: 15px;
          background: rgba(255,255,255,0.15);
          color: white;
          cursor: pointer;
        `;
        
        btn.onclick = () => {
          if (country === bigger) {
            correct++;
            SimpleGames.addScore(25);
            btn.style.background = '#22c55e';
          } else {
            SimpleGames.loseScore(20);
            btn.style.background = '#ef4444';
          }
          document.getElementById('pop-correct').textContent = correct;
          choicesDiv.querySelectorAll('button').forEach(b => b.disabled = true);
          setTimeout(showChoice, 1000);
        };
        choicesDiv.appendChild(btn);
      });
    };
    
    showChoice();
  },

  // ========================================
  // GAME 6: REACTION TEST - Tap When Green
  // ========================================
  game6_ReactionTest: (zone) => {
    zone.innerHTML = `
      <div class="reaction-game">
        <div class="reaction-circle" id="reaction-circle">WAIT...</div>
        <div class="reaction-time" id="reaction-time">Best: ---ms</div>
      </div>
    `;
    zone.style.cssText = 'background: linear-gradient(180deg, #1f2937 0%, #111827 100%); border-radius: 20px; padding: 20px; text-align: center;';
    
    const circle = document.getElementById('reaction-circle');
    circle.style.cssText = `
      width: 200px;
      height: 200px;
      border-radius: 50%;
      background: #ef4444;
      margin: 40px auto;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      font-weight: bold;
      color: white;
      cursor: pointer;
    `;
    
    let canTap = false;
    let startTime = 0;
    let bestTime = Infinity;
    let tooEarly = false;
    
    const startRound = () => {
      if (!SimpleGames.isActive) return;
      
      canTap = false;
      tooEarly = false;
      circle.textContent = 'WAIT...';
      circle.style.background = '#ef4444';
      
      const delay = 1000 + Math.random() * 3000;
      
      SimpleGames.timeouts.push(setTimeout(() => {
        if (!SimpleGames.isActive || tooEarly) return;
        circle.textContent = 'TAP!';
        circle.style.background = '#22c55e';
        canTap = true;
        startTime = Date.now();
        
        // Timeout if too slow
        SimpleGames.timeouts.push(setTimeout(() => {
          if (canTap) {
            circle.textContent = 'TOO SLOW!';
            circle.style.background = '#f97316';
            SimpleGames.loseScore(15);
            canTap = false;
            setTimeout(startRound, 1500);
          }
        }, 1000));
      }, delay));
    };
    
    circle.onclick = () => {
      if (!SimpleGames.isActive) return;
      
      if (!canTap) {
        tooEarly = true;
        circle.textContent = 'TOO EARLY!';
        circle.style.background = '#f97316';
        SimpleGames.loseScore(20);
        setTimeout(startRound, 1500);
        return;
      }
      
      const reactionTime = Date.now() - startTime;
      canTap = false;
      
      if (reactionTime < 300) {
        SimpleGames.addScore(40);
        circle.textContent = `${reactionTime}ms AMAZING!`;
      } else if (reactionTime < 500) {
        SimpleGames.addScore(25);
        circle.textContent = `${reactionTime}ms GOOD!`;
      } else {
        SimpleGames.addScore(15);
        circle.textContent = `${reactionTime}ms OK`;
      }
      
      if (reactionTime < bestTime) {
        bestTime = reactionTime;
        document.getElementById('reaction-time').textContent = `Best: ${bestTime}ms`;
      }
      
      setTimeout(startRound, 1500);
    };
    
    startRound();
  },

  // ========================================
  // GAME 7: MEMORY SEQUENCE - Simon Says
  // ========================================
  game7_MemorySequence: (zone) => {
    zone.innerHTML = `
      <div class="memory-game">
        <div class="memory-status" id="memory-status">Watch carefully...</div>
        <div class="memory-grid" id="memory-grid"></div>
        <div class="memory-level">Level: <span id="memory-level">1</span></div>
      </div>
    `;
    zone.style.cssText = 'background: linear-gradient(180deg, #4f46e5 0%, #3730a3 100%); border-radius: 20px; padding: 20px; text-align: center;';
    
    const colors = ['#ef4444', '#22c55e', '#3b82f6', '#eab308'];
    const grid = document.getElementById('memory-grid');
    grid.style.cssText = 'display: grid; grid-template-columns: 1fr 1fr; gap: 15px; max-width: 250px; margin: 20px auto;';
    
    let sequence = [];
    let playerIndex = 0;
    let level = 1;
    let showingPattern = false;
    
    // Create tiles
    colors.forEach((color, i) => {
      const tile = document.createElement('div');
      tile.className = 'memory-tile';
      tile.dataset.index = i;
      tile.style.cssText = `
        width: 100%;
        aspect-ratio: 1;
        background: ${color};
        border-radius: 15px;
        cursor: pointer;
        opacity: 0.6;
        transition: opacity 0.2s, transform 0.2s;
      `;
      
      tile.onclick = () => {
        if (showingPattern) return;
        
        tile.style.opacity = '1';
        tile.style.transform = 'scale(0.95)';
        setTimeout(() => {
          tile.style.opacity = '0.6';
          tile.style.transform = 'scale(1)';
        }, 200);
        
        if (parseInt(tile.dataset.index) === sequence[playerIndex]) {
          playerIndex++;
          SimpleGames.addScore(15);
          
          if (playerIndex >= sequence.length) {
            level++;
            document.getElementById('memory-level').textContent = level;
            document.getElementById('memory-status').textContent = 'Correct! Next level...';
            SimpleGames.addScore(20);
            setTimeout(showPattern, 1000);
          }
        } else {
          SimpleGames.loseScore(25);
          document.getElementById('memory-status').textContent = 'Wrong! Try again...';
          level = Math.max(1, level - 1);
          document.getElementById('memory-level').textContent = level;
          setTimeout(showPattern, 1000);
        }
      };
      
      grid.appendChild(tile);
    });
    
    const tiles = grid.querySelectorAll('.memory-tile');
    
    const showPattern = () => {
      if (!SimpleGames.isActive) return;
      
      showingPattern = true;
      playerIndex = 0;
      sequence = [];
      
      // Generate new sequence
      for (let i = 0; i < level + 2; i++) {
        sequence.push(Math.floor(Math.random() * 4));
      }
      
      document.getElementById('memory-status').textContent = 'Watch carefully...';
      
      let i = 0;
      const showNext = () => {
        if (i >= sequence.length) {
          showingPattern = false;
          document.getElementById('memory-status').textContent = 'Your turn!';
          return;
        }
        
        const tile = tiles[sequence[i]];
        tile.style.opacity = '1';
        tile.style.transform = 'scale(1.1)';
        
        setTimeout(() => {
          tile.style.opacity = '0.6';
          tile.style.transform = 'scale(1)';
          i++;
          setTimeout(showNext, 300);
        }, 500);
      };
      
      setTimeout(showNext, 500);
    };
    
    showPattern();
  },

  // ========================================
  // GAME 8: WORD SCRAMBLE - Unscramble Words
  // ========================================
  game8_WordScramble: (zone) => {
    const words = [
      'PLANET', 'OCEAN', 'MOUNTAIN', 'COUNTRY', 'CAPITAL', 'ISLAND',
      'DESERT', 'FOREST', 'RIVER', 'VALLEY', 'CLIMATE', 'EQUATOR',
      'GLACIER', 'VOLCANO', 'CANYON', 'HARBOR', 'COAST', 'JUNGLE'
    ];
    
    zone.innerHTML = `
      <div class="scramble-game">
        <div class="scramble-word" id="scramble-word">????</div>
        <div class="scramble-hint" id="scramble-hint">Unscramble the geography word!</div>
        <div class="scramble-letters" id="scramble-letters"></div>
        <div class="scramble-answer" id="scramble-answer"></div>
        <button class="scramble-clear" id="scramble-clear">Clear</button>
      </div>
    `;
    zone.style.cssText = 'background: linear-gradient(180deg, #0d9488 0%, #0f766e 100%); border-radius: 20px; padding: 20px; text-align: center;';
    
    let currentWord = '';
    let currentAnswer = '';
    
    const newWord = () => {
      if (!SimpleGames.isActive) return;
      
      currentWord = words[Math.floor(Math.random() * words.length)];
      currentAnswer = '';
      
      // Scramble the word
      const scrambled = currentWord.split('').sort(() => Math.random() - 0.5).join('');
      document.getElementById('scramble-word').textContent = scrambled;
      document.getElementById('scramble-word').style.cssText = 'font-size: 2.5rem; font-weight: bold; letter-spacing: 8px; margin: 20px 0;';
      
      const lettersDiv = document.getElementById('scramble-letters');
      lettersDiv.innerHTML = '';
      lettersDiv.style.cssText = 'display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; margin: 20px 0;';
      
      scrambled.split('').forEach((letter, i) => {
        const btn = document.createElement('button');
        btn.textContent = letter;
        btn.dataset.index = i;
        btn.style.cssText = `
          width: 45px;
          height: 45px;
          font-size: 1.3rem;
          font-weight: bold;
          border: none;
          border-radius: 10px;
          background: white;
          color: #0f766e;
          cursor: pointer;
        `;
        
        btn.onclick = () => {
          if (btn.disabled) return;
          currentAnswer += letter;
          btn.disabled = true;
          btn.style.opacity = '0.3';
          document.getElementById('scramble-answer').textContent = currentAnswer;
          
          if (currentAnswer.length === currentWord.length) {
            if (currentAnswer === currentWord) {
              SimpleGames.addScore(35);
              document.getElementById('scramble-hint').textContent = '✅ Correct!';
            } else {
              SimpleGames.loseScore(20);
              document.getElementById('scramble-hint').textContent = `❌ It was: ${currentWord}`;
            }
            setTimeout(newWord, 1500);
          }
        };
        lettersDiv.appendChild(btn);
      });
      
      document.getElementById('scramble-answer').textContent = '';
      document.getElementById('scramble-answer').style.cssText = 'font-size: 2rem; font-weight: bold; min-height: 50px; margin: 15px 0; letter-spacing: 5px;';
      document.getElementById('scramble-hint').textContent = 'Unscramble the geography word!';
    };
    
    document.getElementById('scramble-clear').style.cssText = 'padding: 10px 30px; font-size: 1rem; border: none; border-radius: 10px; background: rgba(255,255,255,0.2); color: white; cursor: pointer; margin-top: 10px;';
    document.getElementById('scramble-clear').onclick = () => {
      currentAnswer = '';
      document.getElementById('scramble-answer').textContent = '';
      document.getElementById('scramble-letters').querySelectorAll('button').forEach(b => {
        b.disabled = false;
        b.style.opacity = '1';
      });
    };
    
    newWord();
  },

  // ========================================
  // GAME 9: TRUE/FALSE BLITZ - Quick Facts
  // ========================================
  game9_TrueFalseBlitz: (zone) => {
    const facts = [
      { statement: 'The Great Wall of China is visible from space', answer: false },
      { statement: 'Russia is the largest country by area', answer: true },
      { statement: 'The Amazon is the longest river in the world', answer: false },
      { statement: 'Mount Everest is in Nepal and China', answer: true },
      { statement: 'Australia is both a country and a continent', answer: true },
      { statement: 'The Sahara is the largest desert in the world', answer: false },
      { statement: 'There are 7 continents on Earth', answer: true },
      { statement: 'Japan has more people than USA', answer: false },
      { statement: 'The Pacific Ocean is the largest ocean', answer: true },
      { statement: 'Africa has the most countries of any continent', answer: true },
      { statement: 'Greenland is a country', answer: false },
      { statement: 'The Nile flows through Egypt', answer: true },
      { statement: 'Brazil is in North America', answer: false },
      { statement: 'Iceland is covered mostly in ice', answer: false },
      { statement: 'Canada has the longest coastline', answer: true },
      { statement: 'The Dead Sea is actually a lake', answer: true },
      { statement: 'Tokyo is the most populous city in the world', answer: true },
      { statement: 'Antarctica is owned by Russia', answer: false }
    ];
    
    let usedFacts = [];
    
    zone.innerHTML = `
      <div class="tf-game">
        <div class="tf-statement" id="tf-statement">Loading...</div>
        <div class="tf-buttons">
          <button class="tf-btn true" id="tf-true">✅ TRUE</button>
          <button class="tf-btn false" id="tf-false">❌ FALSE</button>
        </div>
        <div class="tf-streak">Streak: <span id="tf-streak">0</span></div>
      </div>
    `;
    zone.style.cssText = 'background: linear-gradient(180deg, #f59e0b 0%, #d97706 100%); border-radius: 20px; padding: 20px; text-align: center;';
    
    let streak = 0;
    
    const showFact = () => {
      if (!SimpleGames.isActive) return;
      
      let available = facts.filter((_, i) => !usedFacts.includes(i));
      if (available.length === 0) {
        usedFacts = [];
        available = facts;
      }
      
      const idx = facts.indexOf(available[Math.floor(Math.random() * available.length)]);
      usedFacts.push(idx);
      const fact = facts[idx];
      
      document.getElementById('tf-statement').textContent = fact.statement;
      document.getElementById('tf-statement').style.cssText = 'font-size: 1.3rem; padding: 25px; background: rgba(255,255,255,0.15); border-radius: 15px; margin-bottom: 25px; line-height: 1.5;';
      
      const trueBtn = document.getElementById('tf-true');
      const falseBtn = document.getElementById('tf-false');
      
      trueBtn.disabled = false;
      falseBtn.disabled = false;
      trueBtn.style.cssText = 'padding: 20px 40px; font-size: 1.2rem; font-weight: bold; border: none; border-radius: 15px; background: #22c55e; color: white; cursor: pointer; margin: 10px;';
      falseBtn.style.cssText = 'padding: 20px 40px; font-size: 1.2rem; font-weight: bold; border: none; border-radius: 15px; background: #ef4444; color: white; cursor: pointer; margin: 10px;';
      
      const handleAnswer = (userAnswer) => {
        trueBtn.disabled = true;
        falseBtn.disabled = true;
        
        if (userAnswer === fact.answer) {
          streak++;
          SimpleGames.addScore(20 + streak * 5);
          (userAnswer ? trueBtn : falseBtn).style.transform = 'scale(1.1)';
        } else {
          streak = 0;
          SimpleGames.loseScore(15);
          (userAnswer ? trueBtn : falseBtn).style.opacity = '0.5';
        }
        
        document.getElementById('tf-streak').textContent = streak;
        setTimeout(showFact, 1200);
      };
      
      trueBtn.onclick = () => handleAnswer(true);
      falseBtn.onclick = () => handleAnswer(false);
    };
    
    showFact();
  },

  // ========================================
  // GAME 10: ULTIMATE QUIZ - Mixed Challenge
  // ========================================
  game10_UltimateQuiz: (zone) => {
    const questions = [
      { q: 'What is the capital of South Korea?', a: 'Seoul', wrong: ['Tokyo', 'Beijing', 'Bangkok'] },
      { q: 'Which ocean is the deepest?', a: 'Pacific', wrong: ['Atlantic', 'Indian', 'Arctic'] },
      { q: 'What is 15 × 8?', a: '120', wrong: ['115', '125', '110'] },
      { q: 'Which country has the most time zones?', a: 'France', wrong: ['Russia', 'USA', 'China'] },
      { q: 'What is the smallest continent?', a: 'Australia', wrong: ['Europe', 'Antarctica', 'South America'] },
      { q: 'Which river is the longest?', a: 'Nile', wrong: ['Amazon', 'Yangtze', 'Mississippi'] },
      { q: 'What is √144?', a: '12', wrong: ['11', '13', '14'] },
      { q: 'How many countries are in the EU?', a: '27', wrong: ['28', '25', '30'] },
      { q: 'Which mountain range includes Everest?', a: 'Himalayas', wrong: ['Alps', 'Andes', 'Rockies'] },
      { q: 'What is 256 ÷ 16?', a: '16', wrong: ['15', '17', '14'] },
      { q: 'Which is the largest African country?', a: 'Algeria', wrong: ['Nigeria', 'Egypt', 'South Africa'] },
      { q: 'What is the deepest lake?', a: 'Baikal', wrong: ['Superior', 'Tanganyika', 'Victoria'] },
      { q: 'How many states in the USA?', a: '50', wrong: ['48', '51', '52'] },
      { q: 'Which planet is closest to the Sun?', a: 'Mercury', wrong: ['Venus', 'Mars', 'Earth'] },
      { q: 'What is 17²?', a: '289', wrong: ['279', '299', '269'] }
    ];
    
    let usedQ = [];
    let correctCount = 0;
    
    zone.innerHTML = `
      <div class="ultimate-game">
        <div class="ultimate-header">🏆 ULTIMATE CHALLENGE 🏆</div>
        <div class="ultimate-question" id="ultimate-q">Loading...</div>
        <div class="ultimate-options" id="ultimate-opts"></div>
        <div class="ultimate-progress">Correct: <span id="ultimate-score">0</span></div>
      </div>
    `;
    zone.style.cssText = 'background: linear-gradient(180deg, #7c3aed 0%, #4c1d95 100%); border-radius: 20px; padding: 20px; text-align: center;';
    
    const askQuestion = () => {
      if (!SimpleGames.isActive) return;
      
      let available = questions.filter((_, i) => !usedQ.includes(i));
      if (available.length === 0) {
        usedQ = [];
        available = questions;
      }
      
      const idx = questions.indexOf(available[Math.floor(Math.random() * available.length)]);
      usedQ.push(idx);
      const q = questions[idx];
      
      document.getElementById('ultimate-q').innerHTML = q.q;
      document.getElementById('ultimate-q').style.cssText = 'font-size: 1.2rem; padding: 20px; background: rgba(255,255,255,0.1); border-radius: 15px; margin: 20px 0;';
      
      const options = [q.a, ...q.wrong].sort(() => Math.random() - 0.5);
      const optsDiv = document.getElementById('ultimate-opts');
      optsDiv.innerHTML = '';
      optsDiv.style.cssText = 'display: grid; grid-template-columns: 1fr 1fr; gap: 10px;';
      
      options.forEach(opt => {
        const btn = document.createElement('button');
        btn.textContent = opt;
        btn.style.cssText = `
          padding: 15px;
          font-size: 1rem;
          font-weight: 600;
          border: none;
          border-radius: 12px;
          background: rgba(255,255,255,0.15);
          color: white;
          cursor: pointer;
        `;
        
        btn.onclick = () => {
          if (opt === q.a) {
            correctCount++;
            SimpleGames.addScore(30);
            btn.style.background = '#22c55e';
          } else {
            SimpleGames.loseScore(20);
            btn.style.background = '#ef4444';
            optsDiv.querySelectorAll('button').forEach(b => {
              if (b.textContent === q.a) b.style.background = '#22c55e';
            });
          }
          document.getElementById('ultimate-score').textContent = correctCount;
          optsDiv.querySelectorAll('button').forEach(b => b.disabled = true);
          setTimeout(askQuestion, 1200);
        };
        optsDiv.appendChild(btn);
      });
    };
    
    document.querySelector('.ultimate-header').style.cssText = 'font-size: 1.3rem; font-weight: bold; color: #fbbf24; margin-bottom: 15px;';
    askQuestion();
  },

  // ==========================================
  // NEW 60-GAME IMPLEMENTATIONS
  // ==========================================
  
  // GAME 1: Color Sequence
  game_ColorSequence: (zone) => {
    const colors = ['#ef4444', '#3b82f6', '#22c55e', '#f59e0b', '#8b5cf6', '#ec4899'];
    const colorNames = ['Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Pink'];
    let sequence = [];
    let playerSequence = [];
    let level = 1;
    
    zone.innerHTML = `
      <div class="sequence-game">
        <div class="game-instruction" style="text-align: center; padding: 10px; margin-bottom: 15px; background: rgba(255,255,255,0.05); border-radius: 10px; font-size: 0.9rem; color: #aaa;">
          📝 Watch the flashing colors, then tap them in the SAME ORDER!
        </div>
        <div class="sequence-display" id="sequence-display" style="font-size: 1.5rem; text-align: center; padding: 40px 30px; background: rgba(255,255,255,0.1); border-radius: 20px; min-height: 120px; transition: all 0.15s ease; display: flex; flex-direction: column; justify-content: center; align-items: center;"><div style="font-size: 2rem;">🌈</div><div>Get ready...</div></div>
        <div class="color-grid" id="color-grid" style="display: none;"></div>
        <div class="sequence-level" style="text-align: center; margin-top: 15px; font-size: 1.1rem;">Level: <span id="seq-level">1</span></div>
      </div>
    `;
    
    const display = document.getElementById('sequence-display');
    const grid = document.getElementById('color-grid');
    
    // Create color buttons
    colors.forEach((color, i) => {
      const btn = document.createElement('button');
      btn.className = 'color-btn';
      btn.style.cssText = `background: ${color}; width: 80px; height: 80px; border: none; border-radius: 15px; margin: 8px; cursor: pointer; transition: transform 0.1s;`;
      btn.dataset.index = i;
      btn.onclick = () => handleColorClick(i);
      grid.appendChild(btn);
    });
    
    const addToSequence = () => {
      sequence.push(Math.floor(Math.random() * colors.length));
    };
    
    const playSequence = async () => {
      display.innerHTML = '<div style="font-size: 2rem;">👀</div><div>Get ready...</div>';
      display.style.background = 'rgba(255,255,255,0.1)';
      display.style.transform = 'scale(1)';
      grid.style.display = 'none';
      
      await new Promise(r => setTimeout(r, 1000));
      
      for (let i = 0; i < sequence.length; i++) {
        const colorIdx = sequence[i];
        // Flash the color BIG and BRIGHT
        display.style.background = colors[colorIdx];
        display.style.transform = 'scale(1.1)';
        display.style.boxShadow = `0 0 40px ${colors[colorIdx]}`;
        display.innerHTML = `<div style="font-size: 3rem; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);">${colorNames[colorIdx].toUpperCase()}</div><div style="font-size: 1rem; opacity: 0.8;">${i + 1} of ${sequence.length}</div>`;
        if (typeof Sounds !== 'undefined' && Sounds.click) Sounds.click();
        await new Promise(r => setTimeout(r, 800));
        
        // Flash off
        display.style.background = 'rgba(30,30,40,0.9)';
        display.style.transform = 'scale(1)';
        display.style.boxShadow = 'none';
        display.innerHTML = '';
        await new Promise(r => setTimeout(r, 400));
      }
      
      await new Promise(r => setTimeout(r, 500));
      display.innerHTML = '<div style="font-size: 1.5rem;">👆 YOUR TURN!</div><div style="font-size: 1rem; margin-top: 5px;">Tap the colors in order</div>';
      display.style.background = 'linear-gradient(135deg, #22c55e44, #3b82f644)';
      display.style.boxShadow = '0 0 20px rgba(34, 197, 94, 0.3)';
      grid.style.display = 'grid';
      grid.style.gridTemplateColumns = 'repeat(3, 1fr)';
      grid.style.justifyItems = 'center';
      playerSequence = [];
      SimpleGames.startQuestionTimer();
    };
    
    const handleColorClick = (colorIndex) => {
      if (!SimpleGames.isActive) return;
      Sounds.click();
      
      playerSequence.push(colorIndex);
      const btn = grid.children[colorIndex];
      btn.style.transform = 'scale(0.9)';
      setTimeout(() => btn.style.transform = 'scale(1)', 100);
      
      // Check if correct so far
      const currentPos = playerSequence.length - 1;
      if (playerSequence[currentPos] !== sequence[currentPos]) {
        SimpleGames.loseScore(15);
        level = Math.max(1, level - 1);
        sequence = sequence.slice(0, level);
        setTimeout(playSequence, 1000);
        return;
      }
      
      // Check if sequence complete
      if (playerSequence.length === sequence.length) {
        SimpleGames.addScore(25 + (level * 5));
        level++;
        document.getElementById('seq-level').textContent = level;
        addToSequence();
        setTimeout(playSequence, 800);
      }
    };
    
    // Start
    addToSequence();
    setTimeout(playSequence, 500);
  },
  
  // GAME 2: Number Flash
  game_NumberFlash: (zone) => {
    let level = 3;
    let numbers = [];
    
    zone.innerHTML = `
      <div class="number-flash-game">
        <div class="game-instruction" style="text-align: center; padding: 10px; margin-bottom: 15px; background: rgba(255,255,255,0.05); border-radius: 10px; font-size: 0.9rem; color: #aaa;">
          📝 Watch the numbers flash, then type them in ORDER!
        </div>
        <div class="flash-display" id="flash-display" style="font-size: 3rem; text-align: center; padding: 40px; background: rgba(255,255,255,0.1); border-radius: 20px; min-height: 100px;"></div>
        <input type="text" id="number-input" placeholder="Type the numbers you saw..." style="display: none; width: 100%; padding: 15px; font-size: 1.5rem; border: 2px solid #3b82f6; border-radius: 10px; background: rgba(255,255,255,0.1); color: white; text-align: center; margin-top: 20px;" inputmode="numeric">
        <div class="flash-level" style="margin-top: 15px; text-align: center;">Digits: <span id="digit-count">3</span></div>
      </div>
    `;
    
    const display = document.getElementById('flash-display');
    const input = document.getElementById('number-input');
    
    const generateNumbers = () => {
      numbers = [];
      for (let i = 0; i < level; i++) {
        numbers.push(Math.floor(Math.random() * 10));
      }
    };
    
    const showNumbers = async () => {
      generateNumbers();
      display.textContent = numbers.join('');
      input.style.display = 'none';
      
      await new Promise(r => setTimeout(r, 1000 + (level * 200)));
      
      display.textContent = '?';
      input.style.display = 'block';
      input.value = '';
      input.focus();
      SimpleGames.startQuestionTimer();
    };
    
    input.onkeydown = (e) => {
      if (e.key === 'Enter' && SimpleGames.isActive) {
        const answer = input.value.trim();
        const correct = numbers.join('');
        
        if (answer === correct) {
          SimpleGames.addScore(25 + (level * 3));
          level++;
          document.getElementById('digit-count').textContent = level;
        } else {
          SimpleGames.loseScore(15);
          SimpleGames.showExplanation(correct, `The sequence was ${correct}. Try chunking numbers into groups!`, () => {});
          level = Math.max(3, level - 1);
        }
        
        setTimeout(showNumbers, 500);
      }
    };
    
    showNumbers();
  },
  
  // GAME 3: Reaction Test (enhanced)
  game_ReactionTest: (zone) => {
    SimpleGames.game6_ReactionTest(zone);
  },
  
  // GAME 4: Card Match
  game_CardMatch: (zone) => {
    const emojis = ['🍎', '🌟', '🎈', '🌺', '🦋', '🌙', '🔥', '💎'];
    const cards = [...emojis, ...emojis].sort(() => Math.random() - 0.5);
    let flipped = [];
    let matched = 0;
    let canFlip = true;
    
    zone.innerHTML = `
      <div class="card-match-game">
        <div class="cards-grid" id="cards-grid" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px;"></div>
        <div class="match-progress" style="margin-top: 15px; text-align: center;">Matched: <span id="match-count">0</span>/8</div>
      </div>
    `;
    
    const grid = document.getElementById('cards-grid');
    
    cards.forEach((emoji, i) => {
      const card = document.createElement('div');
      card.className = 'memory-card';
      card.dataset.index = i;
      card.dataset.emoji = emoji;
      card.innerHTML = '❓';
      card.style.cssText = 'aspect-ratio: 1; display: flex; align-items: center; justify-content: center; font-size: 2rem; background: linear-gradient(135deg, #1e3a5f, #0d1b2a); border-radius: 12px; cursor: pointer; transition: transform 0.3s;';
      card.onclick = () => flipCard(card);
      grid.appendChild(card);
    });
    
    const flipCard = (card) => {
      if (!canFlip || !SimpleGames.isActive || card.classList.contains('flipped') || card.classList.contains('matched')) return;
      
      SimpleGames.startQuestionTimer();
      Sounds.click();
      card.innerHTML = card.dataset.emoji;
      card.classList.add('flipped');
      card.style.background = 'linear-gradient(135deg, #3b82f6, #1d4ed8)';
      flipped.push(card);
      
      if (flipped.length === 2) {
        canFlip = false;
        
        if (flipped[0].dataset.emoji === flipped[1].dataset.emoji) {
          matched++;
          document.getElementById('match-count').textContent = matched;
          flipped.forEach(c => c.classList.add('matched'));
          SimpleGames.addScore(25);
          flipped = [];
          canFlip = true;
          
          if (matched === 8) {
            // Bonus for completing all
            SimpleGames.addScore(50);
            // Reset for more rounds
            setTimeout(() => location.reload(), 1500);
          }
        } else {
          SimpleGames.loseScore(10);
          setTimeout(() => {
            flipped.forEach(c => {
              c.innerHTML = '❓';
              c.classList.remove('flipped');
              c.style.background = 'linear-gradient(135deg, #1e3a5f, #0d1b2a)';
            });
            flipped = [];
            canFlip = true;
          }, 800);
        }
      }
    };
  },
  
  // GAME 5: Shape Shifter
  game_ShapeShifter: (zone) => {
    const shapes = ['●', '■', '▲', '◆', '★', '⬟'];
    let sequence = [];
    let playerSequence = [];
    let level = 2;
    
    zone.innerHTML = `
      <div class="shape-game">
        <div class="shape-display" id="shape-display" style="font-size: 4rem; text-align: center; padding: 40px; background: rgba(255,255,255,0.1); border-radius: 20px; min-height: 120px;"></div>
        <div class="shape-buttons" id="shape-buttons" style="display: none; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-top: 20px;"></div>
        <div class="shape-level" style="margin-top: 15px; text-align: center;">Level: <span id="shape-level">2</span></div>
      </div>
    `;
    
    const display = document.getElementById('shape-display');
    const buttons = document.getElementById('shape-buttons');
    
    shapes.forEach((shape, i) => {
      const btn = document.createElement('button');
      btn.textContent = shape;
      btn.style.cssText = 'font-size: 2.5rem; padding: 20px; background: rgba(255,255,255,0.1); border: 2px solid rgba(255,255,255,0.2); border-radius: 15px; cursor: pointer; transition: all 0.2s;';
      btn.onclick = () => handleShapeClick(i);
      buttons.appendChild(btn);
    });
    
    const generateSequence = () => {
      sequence = [];
      for (let i = 0; i < level; i++) {
        sequence.push(Math.floor(Math.random() * shapes.length));
      }
    };
    
    const playSequence = async () => {
      buttons.style.display = 'none';
      display.textContent = 'Watch...';
      
      for (const shapeIndex of sequence) {
        await new Promise(r => setTimeout(r, 500));
        display.textContent = shapes[shapeIndex];
        await new Promise(r => setTimeout(r, 700));
        display.textContent = '';
      }
      
      display.textContent = 'Your turn!';
      buttons.style.display = 'grid';
      playerSequence = [];
      SimpleGames.startQuestionTimer();
    };
    
    const handleShapeClick = (shapeIndex) => {
      if (!SimpleGames.isActive) return;
      Sounds.click();
      
      playerSequence.push(shapeIndex);
      const pos = playerSequence.length - 1;
      
      if (playerSequence[pos] !== sequence[pos]) {
        SimpleGames.loseScore(15);
        level = Math.max(2, level - 1);
        generateSequence();
        setTimeout(playSequence, 800);
        return;
      }
      
      if (playerSequence.length === sequence.length) {
        SimpleGames.addScore(25 + (level * 5));
        level++;
        document.getElementById('shape-level').textContent = level;
        generateSequence();
        setTimeout(playSequence, 600);
      }
    };
    
    generateSequence();
    setTimeout(playSequence, 500);
  },
  
  // GAME 6: Speed Math
  game_SpeedMath: (zone) => {
    SimpleGames.game4_SpeedMath(zone);
  },
  
  // GAME 7: World Capitals
  game_WorldCapitals: (zone) => {
    SimpleGames.game1_WorldCapitals(zone);
  },
  
  // GAME 8: Word Chain
  game_WordChain: (zone) => {
    const words = ['CAT', 'DOG', 'RUN', 'SUN', 'HAT', 'BAT', 'MAP', 'CAP', 'TOP', 'HOT', 'POT', 'LOT', 'BOX', 'FOX', 'MIX'];
    let chain = [];
    let level = 2;
    
    zone.innerHTML = `
      <div class="word-chain-game">
        <div class="chain-display" id="chain-display" style="font-size: 1.5rem; text-align: center; padding: 30px; background: rgba(255,255,255,0.1); border-radius: 20px; min-height: 80px; margin-bottom: 20px;"></div>
        <div class="word-options" id="word-options" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;"></div>
        <div class="chain-level" style="margin-top: 15px; text-align: center;">Chain length: <span id="chain-length">2</span></div>
      </div>
    `;
    
    const display = document.getElementById('chain-display');
    const options = document.getElementById('word-options');
    
    const buildChain = () => {
      chain = [];
      const shuffled = [...words].sort(() => Math.random() - 0.5);
      for (let i = 0; i < level; i++) {
        chain.push(shuffled[i]);
      }
    };
    
    const showChain = async () => {
      options.innerHTML = '';
      display.textContent = 'Memorize...';
      
      await new Promise(r => setTimeout(r, 500));
      
      for (let i = 0; i < chain.length; i++) {
        display.textContent = chain.slice(0, i + 1).join(' → ');
        await new Promise(r => setTimeout(r, 800));
      }
      
      await new Promise(r => setTimeout(r, 500));
      display.textContent = 'What was the chain?';
      
      // Create shuffled options
      const shuffledChain = [...chain].sort(() => Math.random() - 0.5);
      shuffledChain.forEach(word => {
        const btn = document.createElement('button');
        btn.textContent = word;
        btn.style.cssText = 'padding: 18px; font-size: 1.3rem; background: rgba(255,255,255,0.1); border: 2px solid rgba(255,255,255,0.2); border-radius: 12px; cursor: pointer; color: white;';
        btn.onclick = () => checkWord(word, btn);
        options.appendChild(btn);
      });
      
      SimpleGames.startQuestionTimer();
      SimpleGames.gameData.currentIndex = 0;
    };
    
    const checkWord = (word, btn) => {
      if (!SimpleGames.isActive) return;
      Sounds.click();
      
      const expectedWord = chain[SimpleGames.gameData.currentIndex];
      
      if (word === expectedWord) {
        btn.style.background = '#22c55e';
        btn.disabled = true;
        SimpleGames.gameData.currentIndex++;
        
        if (SimpleGames.gameData.currentIndex === chain.length) {
          SimpleGames.addScore(25 + (level * 5));
          level++;
          document.getElementById('chain-length').textContent = level;
          buildChain();
          setTimeout(showChain, 800);
        }
      } else {
        SimpleGames.loseScore(15);
        level = Math.max(2, level - 1);
        buildChain();
        setTimeout(showChain, 800);
      }
    };
    
    buildChain();
    showChain();
  },
  
  // GAME 9: What's Missing
  game_WhatsMissing: (zone) => {
    const allItems = ['🍎', '🌟', '🎈', '🌺', '🦋', '🌙', '🔥', '💎', '🎨', '🎸', '📚', '⚽', '🎭', '🌈', '🍕'];
    let items = [];
    let missingItem = null;
    let level = 4;
    
    zone.innerHTML = `
      <div class="missing-game">
        <div class="items-display" id="items-display" style="display: flex; flex-wrap: wrap; justify-content: center; gap: 15px; padding: 20px; background: rgba(255,255,255,0.1); border-radius: 20px; min-height: 100px;"></div>
        <div class="missing-question" id="missing-question" style="text-align: center; margin: 20px 0; font-size: 1.2rem; display: none;">What's missing?</div>
        <div class="answer-options" id="answer-options" style="display: none; grid-template-columns: repeat(3, 1fr); gap: 12px;"></div>
        <div class="missing-level" style="margin-top: 15px; text-align: center;">Items: <span id="item-count">${level}</span></div>
      </div>
    `;
    
    const display = document.getElementById('items-display');
    const question = document.getElementById('missing-question');
    const options = document.getElementById('answer-options');
    
    const startRound = async () => {
      options.style.display = 'none';
      question.style.display = 'none';
      
      // Pick random items
      const shuffled = [...allItems].sort(() => Math.random() - 0.5);
      items = shuffled.slice(0, level);
      
      // Show all items
      display.innerHTML = items.map(item => `<span style="font-size: 2.5rem;">${item}</span>`).join('');
      
      await new Promise(r => setTimeout(r, 2000 + (level * 300)));
      
      // Remove one item
      const missingIndex = Math.floor(Math.random() * items.length);
      missingItem = items[missingIndex];
      const remainingItems = items.filter((_, i) => i !== missingIndex);
      
      display.innerHTML = remainingItems.map(item => `<span style="font-size: 2.5rem;">${item}</span>`).join('');
      question.style.display = 'block';
      
      // Create options (correct + 2 wrong)
      const wrongOptions = allItems.filter(i => !items.includes(i)).slice(0, 2);
      const allOptions = [missingItem, ...wrongOptions].sort(() => Math.random() - 0.5);
      
      options.innerHTML = '';
      allOptions.forEach(opt => {
        const btn = document.createElement('button');
        btn.textContent = opt;
        btn.style.cssText = 'font-size: 2rem; padding: 20px; background: rgba(255,255,255,0.1); border: 2px solid rgba(255,255,255,0.2); border-radius: 15px; cursor: pointer;';
        btn.onclick = () => checkAnswer(opt);
        options.appendChild(btn);
      });
      options.style.display = 'grid';
      SimpleGames.startQuestionTimer();
    };
    
    const checkAnswer = (answer) => {
      if (!SimpleGames.isActive) return;
      Sounds.click();
      
      if (answer === missingItem) {
        SimpleGames.addScore(25);
        level = Math.min(10, level + 1);
      } else {
        SimpleGames.loseScore(15);
        level = Math.max(4, level - 1);
      }
      
      document.getElementById('item-count').textContent = level;
      setTimeout(startRound, 600);
    };
    
    startRound();
  },
  
  // GAME 10: Position Perfect
  game_PositionPerfect: (zone) => {
    const icons = ['🍎', '🌟', '🎈', '🌺', '🦋', '🌙', '🔥', '💎', '🎨'];
    let positions = {};
    let gridSize = 3;
    let itemCount = 3;
    
    zone.innerHTML = `
      <div class="position-game">
        <div class="position-grid" id="position-grid" style="display: grid; gap: 8px; aspect-ratio: 1; max-width: 300px; margin: 0 auto;"></div>
        <div class="position-status" id="position-status" style="text-align: center; margin-top: 15px; font-size: 1.1rem;">Memorize positions...</div>
        <div class="position-level" style="margin-top: 10px; text-align: center;">Level: <span id="pos-level">1</span></div>
      </div>
    `;
    
    const grid = document.getElementById('position-grid');
    const status = document.getElementById('position-status');
    
    const createGrid = () => {
      grid.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
      grid.innerHTML = '';
      
      for (let i = 0; i < gridSize * gridSize; i++) {
        const cell = document.createElement('div');
        cell.className = 'grid-cell';
        cell.dataset.index = i;
        cell.style.cssText = 'aspect-ratio: 1; background: rgba(255,255,255,0.1); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; cursor: pointer; transition: all 0.2s;';
        grid.appendChild(cell);
      }
    };
    
    const startRound = async () => {
      createGrid();
      positions = {};
      status.textContent = 'Memorize...';
      
      // Place random items
      const cells = [...grid.children];
      const shuffledCells = [...cells].sort(() => Math.random() - 0.5);
      const shuffledIcons = [...icons].sort(() => Math.random() - 0.5);
      
      for (let i = 0; i < itemCount; i++) {
        const cell = shuffledCells[i];
        const icon = shuffledIcons[i];
        cell.textContent = icon;
        positions[cell.dataset.index] = icon;
      }
      
      await new Promise(r => setTimeout(r, 2000 + (itemCount * 400)));
      
      // Clear grid
      cells.forEach(cell => cell.textContent = '');
      status.textContent = 'Place the items!';
      
      // Show items to place
      const itemsToPlace = Object.values(positions);
      SimpleGames.gameData.itemsToPlace = [...itemsToPlace];
      SimpleGames.gameData.currentItem = 0;
      
      status.innerHTML = `Place: <span style="font-size: 2rem;">${SimpleGames.gameData.itemsToPlace[0]}</span>`;
      
      // Add click handlers
      cells.forEach(cell => {
        cell.onclick = () => placeItem(cell);
      });
      
      SimpleGames.startQuestionTimer();
    };
    
    const placeItem = (cell) => {
      if (!SimpleGames.isActive || SimpleGames.gameData.currentItem >= SimpleGames.gameData.itemsToPlace.length) return;
      Sounds.click();
      
      const currentIcon = SimpleGames.gameData.itemsToPlace[SimpleGames.gameData.currentItem];
      const correctIndex = Object.entries(positions).find(([_, icon]) => icon === currentIcon)?.[0];
      
      if (cell.dataset.index === correctIndex) {
        cell.textContent = currentIcon;
        cell.style.background = 'rgba(34, 197, 94, 0.3)';
        SimpleGames.addScore(25);
      } else {
        cell.style.background = 'rgba(239, 68, 68, 0.3)';
        SimpleGames.loseScore(15);
        // Show correct position
        grid.children[correctIndex].textContent = currentIcon;
        grid.children[correctIndex].style.background = 'rgba(34, 197, 94, 0.3)';
      }
      
      SimpleGames.gameData.currentItem++;
      
      if (SimpleGames.gameData.currentItem < SimpleGames.gameData.itemsToPlace.length) {
        status.innerHTML = `Place: <span style="font-size: 2rem;">${SimpleGames.gameData.itemsToPlace[SimpleGames.gameData.currentItem]}</span>`;
      } else {
        itemCount = Math.min(8, itemCount + 1);
        document.getElementById('pos-level').textContent = itemCount - 2;
        setTimeout(startRound, 1000);
      }
    };
    
    startRound();
  },
  
  // GAME 11: Emoji Story
  game_EmojiStory: (zone) => {
    const storyEmojis = ['😀', '🐕', '🎾', '🏠', '🌳', '☀️', '🌧️', '🚗', '🍎', '📚', '🎵', '🌙'];
    let story = [];
    let level = 3;
    
    zone.innerHTML = `
      <div class="emoji-story-game">
        <div class="story-display" id="story-display" style="font-size: 2.5rem; text-align: center; padding: 30px; background: rgba(255,255,255,0.1); border-radius: 20px; min-height: 80px; letter-spacing: 10px;"></div>
        <div class="story-options" id="story-options" style="display: none; margin-top: 20px;"></div>
        <div class="story-progress" id="story-progress" style="margin-top: 15px; text-align: center; font-size: 1rem;"></div>
      </div>
    `;
    
    const display = document.getElementById('story-display');
    const options = document.getElementById('story-options');
    const progress = document.getElementById('story-progress');
    
    const generateStory = () => {
      story = [];
      const shuffled = [...storyEmojis].sort(() => Math.random() - 0.5);
      for (let i = 0; i < level; i++) {
        story.push(shuffled[i]);
      }
    };
    
    const showStory = async () => {
      options.style.display = 'none';
      options.innerHTML = '';
      progress.textContent = `Story length: ${level} emojis`;
      
      display.textContent = 'Watch the story...';
      await new Promise(r => setTimeout(r, 500));
      
      display.textContent = story.join(' ');
      await new Promise(r => setTimeout(r, 1500 + (level * 400)));
      
      display.textContent = 'Put them in order!';
      
      // Create shuffled buttons
      const shuffled = [...story].sort(() => Math.random() - 0.5);
      shuffled.forEach(emoji => {
        const btn = document.createElement('button');
        btn.textContent = emoji;
        btn.style.cssText = 'font-size: 2rem; padding: 15px 25px; background: rgba(255,255,255,0.1); border: 2px solid rgba(255,255,255,0.2); border-radius: 15px; cursor: pointer; margin: 5px;';
        btn.onclick = () => selectEmoji(emoji, btn);
        options.appendChild(btn);
      });
      options.style.display = 'flex';
      options.style.flexWrap = 'wrap';
      options.style.justifyContent = 'center';
      
      SimpleGames.gameData.userOrder = [];
      SimpleGames.startQuestionTimer();
    };
    
    const selectEmoji = (emoji, btn) => {
      if (!SimpleGames.isActive) return;
      Sounds.click();
      
      const expectedEmoji = story[SimpleGames.gameData.userOrder.length];
      
      if (emoji === expectedEmoji) {
        btn.style.background = '#22c55e';
        btn.disabled = true;
        SimpleGames.gameData.userOrder.push(emoji);
        
        if (SimpleGames.gameData.userOrder.length === story.length) {
          SimpleGames.addScore(25 + (level * 5));
          level = Math.min(8, level + 1);
          generateStory();
          setTimeout(showStory, 800);
        }
      } else {
        SimpleGames.loseScore(15);
        level = Math.max(3, level - 1);
        generateStory();
        setTimeout(showStory, 800);
      }
    };
    
    generateStory();
    showStory();
  },
  
  // GAME 12: Pattern Breaker
  game_PatternBreaker: (zone) => {
    zone.innerHTML = `
      <div class="pattern-breaker-game">
        <div class="pattern-instruction" style="text-align: center; margin-bottom: 15px; font-size: 1.1rem;">Find the one that doesn't belong!</div>
        <div class="pattern-grid" id="pattern-grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;"></div>
        <div class="pattern-score" style="margin-top: 15px; text-align: center;">Patterns found: <span id="pattern-count">0</span></div>
      </div>
    `;
    
    const grid = document.getElementById('pattern-grid');
    let patternsFound = 0;
    
    const patterns = [
      { items: ['🍎', '🍊', '🍋', '🚗'], odd: '🚗', rule: 'Fruits' },
      { items: ['2', '4', '6', '7'], odd: '7', rule: 'Even numbers' },
      { items: ['🐕', '🐈', '🐁', '🌳'], odd: '🌳', rule: 'Animals' },
      { items: ['■', '■', '■', '●'], odd: '●', rule: 'Same shape' },
      { items: ['A', 'E', 'I', 'B'], odd: 'B', rule: 'Vowels' },
      { items: ['🔴', '🔵', '🟢', '⬛'], odd: '⬛', rule: 'Primary colors' },
    ];
    
    let currentPattern;
    
    const showPattern = () => {
      const pattern = patterns[Math.floor(Math.random() * patterns.length)];
      currentPattern = pattern;
      
      const shuffled = [...pattern.items].sort(() => Math.random() - 0.5);
      
      grid.innerHTML = '';
      shuffled.forEach(item => {
        const btn = document.createElement('button');
        btn.textContent = item;
        btn.style.cssText = 'font-size: 2.5rem; padding: 30px; background: rgba(255,255,255,0.1); border: 2px solid rgba(255,255,255,0.2); border-radius: 15px; cursor: pointer; transition: all 0.2s;';
        btn.onclick = () => checkAnswer(item, btn);
        grid.appendChild(btn);
      });
      
      SimpleGames.startQuestionTimer();
    };
    
    const checkAnswer = (item, btn) => {
      if (!SimpleGames.isActive) return;
      Sounds.click();
      
      if (item === currentPattern.odd) {
        btn.style.background = '#22c55e';
        SimpleGames.addScore(25);
        patternsFound++;
        document.getElementById('pattern-count').textContent = patternsFound;
      } else {
        btn.style.background = '#ef4444';
        SimpleGames.loseScore(15);
        SimpleGames.showExplanation(currentPattern.odd, `The pattern was: ${currentPattern.rule}`, () => {});
      }
      
      setTimeout(showPattern, 600);
    };
    
    showPattern();
  },
  
  // GAME 13: Sound Sequence (simplified - uses visual representation)
  game_SoundSequence: (zone) => {
    const sounds = [
      { name: 'Bell', emoji: '🔔', freq: 800 },
      { name: 'Drum', emoji: '🥁', freq: 200 },
      { name: 'Horn', emoji: '📯', freq: 400 },
      { name: 'Whistle', emoji: '🎵', freq: 1000 }
    ];
    let sequence = [];
    let level = 2;
    
    zone.innerHTML = `
      <div class="sound-game">
        <div class="sound-display" id="sound-display" style="font-size: 4rem; text-align: center; padding: 40px; background: rgba(255,255,255,0.1); border-radius: 20px; min-height: 100px;"></div>
        <div class="sound-buttons" id="sound-buttons" style="display: none; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-top: 20px;"></div>
        <div class="sound-level" style="margin-top: 15px; text-align: center;">Level: <span id="sound-level">2</span></div>
      </div>
    `;
    
    const display = document.getElementById('sound-display');
    const buttons = document.getElementById('sound-buttons');
    
    // Create sound buttons
    sounds.forEach((sound, i) => {
      const btn = document.createElement('button');
      btn.innerHTML = `${sound.emoji}<br><span style="font-size: 0.8rem;">${sound.name}</span>`;
      btn.style.cssText = 'font-size: 2rem; padding: 20px; background: rgba(255,255,255,0.1); border: 2px solid rgba(255,255,255,0.2); border-radius: 15px; cursor: pointer;';
      btn.onclick = () => handleSoundClick(i);
      buttons.appendChild(btn);
    });
    
    const playTone = (freq) => {
      if (typeof Sounds !== 'undefined' && Sounds.ctx) {
        const ctx = Sounds.ctx;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = freq;
        osc.type = 'sine';
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      }
    };
    
    const generateSequence = () => {
      sequence = [];
      for (let i = 0; i < level; i++) {
        sequence.push(Math.floor(Math.random() * sounds.length));
      }
    };
    
    const playSequence = async () => {
      buttons.style.display = 'none';
      display.textContent = 'Listen...';
      
      for (const soundIndex of sequence) {
        await new Promise(r => setTimeout(r, 500));
        display.textContent = sounds[soundIndex].emoji;
        playTone(sounds[soundIndex].freq);
        await new Promise(r => setTimeout(r, 600));
        display.textContent = '';
      }
      
      display.textContent = 'Your turn!';
      buttons.style.display = 'grid';
      SimpleGames.gameData.playerSequence = [];
      SimpleGames.startQuestionTimer();
    };
    
    const handleSoundClick = (soundIndex) => {
      if (!SimpleGames.isActive) return;
      playTone(sounds[soundIndex].freq);
      
      SimpleGames.gameData.playerSequence.push(soundIndex);
      const pos = SimpleGames.gameData.playerSequence.length - 1;
      
      if (SimpleGames.gameData.playerSequence[pos] !== sequence[pos]) {
        SimpleGames.loseScore(15);
        level = Math.max(2, level - 1);
        generateSequence();
        setTimeout(playSequence, 800);
        return;
      }
      
      if (SimpleGames.gameData.playerSequence.length === sequence.length) {
        SimpleGames.addScore(25 + (level * 5));
        level++;
        document.getElementById('sound-level').textContent = level;
        generateSequence();
        setTimeout(playSequence, 600);
      }
    };
    
    generateSequence();
    setTimeout(playSequence, 500);
  },
  
  // GAME 14: Face Memory (simplified with emoji faces)
  game_FaceMemory: (zone) => {
    const faces = [
      { face: '👨', name: 'John' },
      { face: '👩', name: 'Sarah' },
      { face: '👴', name: 'Bob' },
      { face: '👵', name: 'Mary' },
      { face: '👦', name: 'Tom' },
      { face: '👧', name: 'Emma' },
      { face: '👨‍🦱', name: 'Mike' },
      { face: '👩‍🦰', name: 'Lisa' }
    ];
    let currentFaces = [];
    let level = 2;
    
    zone.innerHTML = `
      <div class="face-game">
        <div class="face-display" id="face-display" style="text-align: center; padding: 20px; background: rgba(255,255,255,0.1); border-radius: 20px;"></div>
        <div class="face-question" id="face-question" style="display: none; text-align: center; margin-top: 20px;"></div>
        <div class="face-options" id="face-options" style="display: none; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-top: 15px;"></div>
        <div class="face-level" style="margin-top: 15px; text-align: center;">Faces: <span id="face-count">${level}</span></div>
      </div>
    `;
    
    const display = document.getElementById('face-display');
    const question = document.getElementById('face-question');
    const options = document.getElementById('face-options');
    
    const startRound = async () => {
      options.style.display = 'none';
      question.style.display = 'none';
      
      // Pick random faces
      const shuffled = [...faces].sort(() => Math.random() - 0.5);
      currentFaces = shuffled.slice(0, level);
      
      // Show faces with names
      display.innerHTML = '<div style="margin-bottom: 10px;">Memorize these faces:</div>' +
        currentFaces.map(f => `<div style="display: inline-block; margin: 10px; text-align: center;"><div style="font-size: 3rem;">${f.face}</div><div>${f.name}</div></div>`).join('');
      
      await new Promise(r => setTimeout(r, 2000 + (level * 800)));
      
      // Ask about a random face
      const targetFace = currentFaces[Math.floor(Math.random() * currentFaces.length)];
      
      display.innerHTML = `<div style="font-size: 4rem;">${targetFace.face}</div>`;
      question.innerHTML = 'What is this person\'s name?';
      question.style.display = 'block';
      
      // Create options
      const wrongNames = faces.filter(f => !currentFaces.includes(f)).map(f => f.name).slice(0, 3);
      const allOptions = [targetFace.name, ...wrongNames].sort(() => Math.random() - 0.5);
      
      options.innerHTML = '';
      allOptions.forEach(name => {
        const btn = document.createElement('button');
        btn.textContent = name;
        btn.style.cssText = 'padding: 15px; font-size: 1.1rem; background: rgba(255,255,255,0.1); border: 2px solid rgba(255,255,255,0.2); border-radius: 12px; cursor: pointer; color: white;';
        btn.onclick = () => checkName(name, targetFace.name);
        options.appendChild(btn);
      });
      options.style.display = 'grid';
      SimpleGames.startQuestionTimer();
    };
    
    const checkName = (selected, correct) => {
      if (!SimpleGames.isActive) return;
      Sounds.click();
      
      if (selected === correct) {
        SimpleGames.addScore(25);
        level = Math.min(6, level + 1);
      } else {
        SimpleGames.loseScore(15);
        level = Math.max(2, level - 1);
      }
      
      document.getElementById('face-count').textContent = level;
      setTimeout(startRound, 600);
    };
    
    startRound();
  },
  
  // GAME 15: Number Grid
  game_NumberGrid: (zone) => {
    let grid = [];
    let gridSize = 3;
    let numbersToShow = 4;
    
    zone.innerHTML = `
      <div class="number-grid-game">
        <div class="grid-display" id="grid-display" style="display: grid; gap: 8px; max-width: 280px; margin: 0 auto;"></div>
        <div class="grid-status" id="grid-status" style="text-align: center; margin-top: 15px; font-size: 1.1rem;">Memorize the numbers...</div>
        <div class="grid-level" style="margin-top: 10px; text-align: center;">Level: <span id="grid-level">1</span></div>
      </div>
    `;
    
    const display = document.getElementById('grid-display');
    const status = document.getElementById('grid-status');
    
    const startRound = async () => {
      display.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
      display.innerHTML = '';
      
      // Create empty grid
      grid = [];
      for (let i = 0; i < gridSize * gridSize; i++) {
        grid.push(null);
        const cell = document.createElement('div');
        cell.dataset.index = i;
        cell.style.cssText = 'aspect-ratio: 1; background: rgba(255,255,255,0.1); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; font-weight: bold;';
        display.appendChild(cell);
      }
      
      // Place random numbers
      const positions = [];
      while (positions.length < numbersToShow) {
        const pos = Math.floor(Math.random() * gridSize * gridSize);
        if (!positions.includes(pos)) positions.push(pos);
      }
      
      positions.forEach((pos, i) => {
        grid[pos] = i + 1;
        display.children[pos].textContent = i + 1;
      });
      
      status.textContent = 'Memorize...';
      await new Promise(r => setTimeout(r, 2000 + (numbersToShow * 300)));
      
      // Hide numbers
      positions.forEach(pos => {
        display.children[pos].textContent = '?';
        display.children[pos].style.cursor = 'pointer';
        display.children[pos].style.background = 'rgba(59, 130, 246, 0.3)';
      });
      
      status.textContent = 'Click cells in order: 1, 2, 3...';
      SimpleGames.gameData.expectedNext = 1;
      SimpleGames.gameData.positions = positions;
      
      // Add click handlers
      positions.forEach(pos => {
        display.children[pos].onclick = () => checkCell(pos);
      });
      
      SimpleGames.startQuestionTimer();
    };
    
    const checkCell = (pos) => {
      if (!SimpleGames.isActive) return;
      Sounds.click();
      
      const cell = display.children[pos];
      const expectedNum = SimpleGames.gameData.expectedNext;
      
      if (grid[pos] === expectedNum) {
        cell.textContent = expectedNum;
        cell.style.background = 'rgba(34, 197, 94, 0.3)';
        cell.onclick = null;
        SimpleGames.gameData.expectedNext++;
        
        if (SimpleGames.gameData.expectedNext > numbersToShow) {
          SimpleGames.addScore(25 + (numbersToShow * 3));
          numbersToShow = Math.min(8, numbersToShow + 1);
          document.getElementById('grid-level').textContent = numbersToShow - 3;
          setTimeout(startRound, 800);
        }
      } else {
        cell.style.background = 'rgba(239, 68, 68, 0.3)';
        SimpleGames.loseScore(15);
        numbersToShow = Math.max(4, numbersToShow - 1);
        setTimeout(startRound, 800);
      }
    };
    
    startRound();
  },

  // ==========================================
  // PREMIUM GAMES 16-30 (Aliases to existing + new)
  // ==========================================
  
  game_DualNBack: (zone) => {
    // N-Back implementation
    let n = 1;
    let sequence = [];
    let position = 0;
    const gridPositions = 9;
    
    zone.innerHTML = `
      <div class="nback-game">
        <div class="nback-info" style="text-align: center; margin-bottom: 15px;">N = <span id="n-value">1</span></div>
        <div class="nback-grid" id="nback-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; max-width: 240px; margin: 0 auto;"></div>
        <div class="nback-buttons" style="display: flex; justify-content: center; gap: 20px; margin-top: 20px;">
          <button id="nback-position" style="padding: 15px 30px; font-size: 1.1rem; background: #3b82f6; border: none; border-radius: 10px; color: white; cursor: pointer;">Position Match</button>
          <button id="nback-letter" style="padding: 15px 30px; font-size: 1.1rem; background: #8b5cf6; border: none; border-radius: 10px; color: white; cursor: pointer;">Letter Match</button>
        </div>
        <div class="nback-score" style="margin-top: 15px; text-align: center;">Correct: <span id="nback-correct">0</span></div>
      </div>
    `;
    
    const grid = document.getElementById('nback-grid');
    let correctCount = 0;
    
    // Create grid
    for (let i = 0; i < gridPositions; i++) {
      const cell = document.createElement('div');
      cell.style.cssText = 'aspect-ratio: 1; background: rgba(255,255,255,0.1); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: bold;';
      grid.appendChild(cell);
    }
    
    const letters = 'ABCDEFGH'.split('');
    let currentPos = -1;
    let currentLetter = '';
    
    const showNext = () => {
      if (!SimpleGames.isActive) return;
      
      // Clear previous
      [...grid.children].forEach(c => {
        c.style.background = 'rgba(255,255,255,0.1)';
        c.textContent = '';
      });
      
      // Generate new
      currentPos = Math.floor(Math.random() * gridPositions);
      currentLetter = letters[Math.floor(Math.random() * letters.length)];
      
      sequence.push({ pos: currentPos, letter: currentLetter });
      
      // Show current
      grid.children[currentPos].style.background = '#3b82f6';
      grid.children[currentPos].textContent = currentLetter;
      
      position++;
      
      SimpleGames.startQuestionTimer();
      
      // Auto advance
      SimpleGames.timeouts.push(setTimeout(showNext, 2500));
    };
    
    document.getElementById('nback-position').onclick = () => {
      if (position > n && sequence[position - 1 - n].pos === currentPos) {
        SimpleGames.addScore(25);
        correctCount++;
        document.getElementById('nback-correct').textContent = correctCount;
      } else {
        SimpleGames.loseScore(15);
      }
    };
    
    document.getElementById('nback-letter').onclick = () => {
      if (position > n && sequence[position - 1 - n].letter === currentLetter) {
        SimpleGames.addScore(25);
        correctCount++;
        document.getElementById('nback-correct').textContent = correctCount;
      } else {
        SimpleGames.loseScore(15);
      }
    };
    
    setTimeout(showNext, 1000);
  },
  
  game_SpeedTyping: (zone) => {
    const words = ['memory', 'brain', 'focus', 'quick', 'smart', 'think', 'learn', 'power', 'speed', 'skill'];
    let currentWord = '';
    let wordsTyped = 0;
    
    zone.innerHTML = `
      <div class="typing-game">
        <div class="word-display" id="word-display" style="font-size: 2.5rem; text-align: center; padding: 30px; background: rgba(255,255,255,0.1); border-radius: 20px; letter-spacing: 5px;"></div>
        <input type="text" id="type-input" placeholder="Type here..." style="width: 100%; padding: 15px; font-size: 1.5rem; border: 2px solid #3b82f6; border-radius: 10px; background: rgba(255,255,255,0.1); color: white; text-align: center; margin-top: 20px;">
        <div class="typing-score" style="margin-top: 15px; text-align: center;">Words: <span id="words-typed">0</span></div>
      </div>
    `;
    
    const display = document.getElementById('word-display');
    const input = document.getElementById('type-input');
    
    const showWord = () => {
      currentWord = words[Math.floor(Math.random() * words.length)];
      display.textContent = currentWord.toUpperCase();
      input.value = '';
      input.focus();
      SimpleGames.startQuestionTimer();
    };
    
    input.oninput = () => {
      if (input.value.toLowerCase() === currentWord) {
        SimpleGames.addScore(25);
        wordsTyped++;
        document.getElementById('words-typed').textContent = wordsTyped;
        showWord();
      }
    };
    
    showWord();
  },
  
  game_BackwardsSpell: (zone) => {
    const words = ['CAT', 'DOG', 'SUN', 'HAT', 'RUN', 'BOOK', 'TREE', 'STAR', 'FISH', 'BIRD'];
    let currentWord = '';
    
    zone.innerHTML = `
      <div class="backwards-game">
        <div class="word-display" id="word-display" style="font-size: 2.5rem; text-align: center; padding: 30px; background: rgba(255,255,255,0.1); border-radius: 20px;"></div>
        <div class="instruction" style="text-align: center; margin: 15px 0; color: rgba(255,255,255,0.7);">Spell it BACKWARDS!</div>
        <input type="text" id="backwards-input" placeholder="Type backwards..." style="width: 100%; padding: 15px; font-size: 1.5rem; border: 2px solid #f59e0b; border-radius: 10px; background: rgba(255,255,255,0.1); color: white; text-align: center;">
        <div class="backwards-score" style="margin-top: 15px; text-align: center;">Correct: <span id="backwards-count">0</span></div>
      </div>
    `;
    
    const display = document.getElementById('word-display');
    const input = document.getElementById('backwards-input');
    let correctCount = 0;
    
    const showWord = () => {
      currentWord = words[Math.floor(Math.random() * words.length)];
      display.textContent = currentWord;
      input.value = '';
      input.focus();
      SimpleGames.startQuestionTimer();
    };
    
    input.onkeydown = (e) => {
      if (e.key === 'Enter') {
        const backwards = currentWord.split('').reverse().join('');
        if (input.value.toUpperCase() === backwards) {
          SimpleGames.addScore(30);
          correctCount++;
          document.getElementById('backwards-count').textContent = correctCount;
        } else {
          SimpleGames.loseScore(15);
          SimpleGames.showExplanation(backwards, `${currentWord} backwards is ${backwards}`, () => {});
        }
        showWord();
      }
    };
    
    showWord();
  },
  
  game_ColorWordClash: (zone) => {
    // Stroop test
    const colors = [
      { name: 'RED', color: '#ef4444' },
      { name: 'BLUE', color: '#3b82f6' },
      { name: 'GREEN', color: '#22c55e' },
      { name: 'YELLOW', color: '#fbbf24' }
    ];
    
    zone.innerHTML = `
      <div class="stroop-game">
        <div class="stroop-instruction" style="text-align: center; margin-bottom: 15px;">Tap the COLOR, not the word!</div>
        <div class="stroop-word" id="stroop-word" style="font-size: 3rem; text-align: center; padding: 40px; background: rgba(255,255,255,0.1); border-radius: 20px; font-weight: bold;"></div>
        <div class="stroop-buttons" id="stroop-buttons" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-top: 20px;"></div>
        <div class="stroop-score" style="margin-top: 15px; text-align: center;">Score: <span id="stroop-count">0</span></div>
      </div>
    `;
    
    const wordDisplay = document.getElementById('stroop-word');
    const buttons = document.getElementById('stroop-buttons');
    let correctCount = 0;
    let currentColor = '';
    
    // Create color buttons
    colors.forEach(c => {
      const btn = document.createElement('button');
      btn.textContent = c.name;
      btn.style.cssText = `padding: 20px; font-size: 1.2rem; background: ${c.color}; border: none; border-radius: 12px; color: white; font-weight: bold; cursor: pointer;`;
      btn.onclick = () => checkColor(c.name);
      buttons.appendChild(btn);
    });
    
    const showWord = () => {
      const wordColor = colors[Math.floor(Math.random() * colors.length)];
      const textColor = colors[Math.floor(Math.random() * colors.length)];
      
      wordDisplay.textContent = wordColor.name;
      wordDisplay.style.color = textColor.color;
      currentColor = textColor.name;
      
      SimpleGames.startQuestionTimer();
    };
    
    const checkColor = (selected) => {
      if (!SimpleGames.isActive) return;
      Sounds.click();
      
      if (selected === currentColor) {
        SimpleGames.addScore(25);
        correctCount++;
        document.getElementById('stroop-count').textContent = correctCount;
      } else {
        SimpleGames.loseScore(15);
      }
      
      showWord();
    };
    
    showWord();
  },
  
  game_SequenceBuilder: (zone) => {
    zone.innerHTML = `
      <div class="sequence-builder-game">
        <div class="sequence-q" id="seq-question" style="font-size: 1.8rem; text-align: center; padding: 20px; background: rgba(255,255,255,0.1); border-radius: 15px;"></div>
        <div class="sequence-options" id="seq-options" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-top: 20px;"></div>
        <div class="sequence-score" style="margin-top: 15px; text-align: center;">Patterns: <span id="seq-count">0</span></div>
      </div>
    `;
    
    const questions = [
      { seq: '2, 4, 6, 8, ?', answer: '10', wrong: ['9', '11', '12'] },
      { seq: '1, 3, 5, 7, ?', answer: '9', wrong: ['8', '10', '11'] },
      { seq: '3, 6, 9, 12, ?', answer: '15', wrong: ['13', '14', '16'] },
      { seq: '1, 2, 4, 8, ?', answer: '16', wrong: ['10', '12', '14'] },
      { seq: '1, 4, 9, 16, ?', answer: '25', wrong: ['20', '24', '36'] },
    ];
    
    let correctCount = 0;
    const qDisplay = document.getElementById('seq-question');
    const options = document.getElementById('seq-options');
    
    const showQuestion = () => {
      const q = questions[Math.floor(Math.random() * questions.length)];
      qDisplay.textContent = q.seq;
      
      const allAnswers = [q.answer, ...q.wrong].sort(() => Math.random() - 0.5);
      options.innerHTML = '';
      
      allAnswers.forEach(ans => {
        const btn = document.createElement('button');
        btn.textContent = ans;
        btn.style.cssText = 'padding: 20px; font-size: 1.5rem; background: rgba(255,255,255,0.1); border: 2px solid rgba(255,255,255,0.2); border-radius: 12px; cursor: pointer; color: white;';
        btn.onclick = () => checkAnswer(ans, q.answer);
        options.appendChild(btn);
      });
      
      SimpleGames.startQuestionTimer();
    };
    
    const checkAnswer = (selected, correct) => {
      if (!SimpleGames.isActive) return;
      Sounds.click();
      
      if (selected === correct) {
        SimpleGames.addScore(25);
        correctCount++;
        document.getElementById('seq-count').textContent = correctCount;
      } else {
        SimpleGames.loseScore(15);
      }
      
      showQuestion();
    };
    
    showQuestion();
  },
  
  game_RapidRecall: (zone) => { SimpleGames.game_WhatsMissing(zone); },
  game_MathChains: (zone) => { SimpleGames.game_SpeedMath(zone); },
  game_WordMorph: (zone) => { SimpleGames.game_WordChain(zone); },
  game_GridNavigator: (zone) => { SimpleGames.game_PositionPerfect(zone); },
  game_SymbolMatch: (zone) => { SimpleGames.game_CardMatch(zone); },
  game_TrueFalseBlitz: (zone) => { SimpleGames.game9_TrueFalseBlitz(zone); },
  game_RhythmRecall: (zone) => { SimpleGames.game_SoundSequence(zone); },
  game_FlagFinder: (zone) => { SimpleGames.game2_FlagMatch(zone); },
  game_OddOneOut: (zone) => { SimpleGames.game_PatternBreaker(zone); },
  game_QuickCount: (zone) => { SimpleGames.game_SpeedMath(zone); },
  
  // PREMIUM BATCH 2: Games 31-45 (aliases)
  game_TripleNBack: (zone) => { SimpleGames.game_DualNBack(zone); },
  game_ReverseOrder: (zone) => { SimpleGames.game_ColorSequence(zone); },
  game_LetterEquations: (zone) => { SimpleGames.game_BackwardsSpell(zone); },
  game_MemoryPalace: (zone) => { SimpleGames.game_PositionPerfect(zone); },
  game_LandmarkMemory: (zone) => { SimpleGames.game_WorldCapitals(zone); },
  game_MentalRotation: (zone) => { SimpleGames.game_ShapeShifter(zone); },
  game_WordRecall: (zone) => { SimpleGames.game_WordChain(zone); },
  game_CalculationSprint: (zone) => { SimpleGames.game_SpeedMath(zone); },
  game_EmotionalFaces: (zone) => { SimpleGames.game_FaceMemory(zone); },
  game_SynonymSprint: (zone) => { SimpleGames.game_WordChain(zone); },
  game_PhotoMemory: (zone) => { SimpleGames.game_WhatsMissing(zone); },
  game_MelodyMemory: (zone) => { SimpleGames.game_SoundSequence(zone); },
  game_SplitAttention: (zone) => { SimpleGames.game_ColorWordClash(zone); },
  game_NumberBonds: (zone) => { SimpleGames.game_SpeedMath(zone); },
  game_ContextSwitch: (zone) => { SimpleGames.game_ColorWordClash(zone); },
  
  // PREMIUM BATCH 3: Games 46-60 (aliases)
  game_SpeedPatterns: (zone) => { SimpleGames.game_ColorSequence(zone); },
  game_LogicChains: (zone) => { SimpleGames.game_SequenceBuilder(zone); },
  game_CategorySort: (zone) => { SimpleGames.game_PatternBreaker(zone); },
  game_MazeMemory: (zone) => { SimpleGames.game_PositionPerfect(zone); },
  game_VerbalFluency: (zone) => { SimpleGames.game_WordChain(zone); },
  game_PrimeTime: (zone) => { SimpleGames.game_SpeedMath(zone); },
  game_VisualEquations: (zone) => { SimpleGames.game_SequenceBuilder(zone); },
  game_AttentionFilter: (zone) => { SimpleGames.game_ColorWordClash(zone); },
  game_StorySequence: (zone) => { SimpleGames.game_EmojiStory(zone); },
  game_PeripheralVision: (zone) => { SimpleGames.game_ReactionTest(zone); },
  game_EstimationMaster: (zone) => { SimpleGames.game_SpeedMath(zone); },
  game_CodeBreaker: (zone) => { SimpleGames.game_SequenceBuilder(zone); },
  game_AudioLocation: (zone) => { SimpleGames.game_SoundSequence(zone); },
  game_MultiModalMatch: (zone) => { SimpleGames.game_DualNBack(zone); },
  game_UltimateChallenge: (zone) => { SimpleGames.game10_UltimateQuiz(zone); },

  // Generic game fallback
  gameGeneric: (zone, game) => {
    const mechanic = game.id % 15;
    switch(mechanic) {
      case 0: SimpleGames.game_ColorSequence(zone); break;
      case 1: SimpleGames.game_NumberFlash(zone); break;
      case 2: SimpleGames.game_ReactionTest(zone); break;
      case 3: SimpleGames.game_CardMatch(zone); break;
      case 4: SimpleGames.game_SpeedMath(zone); break;
      case 5: SimpleGames.game_WorldCapitals(zone); break;
      case 6: SimpleGames.game_WordChain(zone); break;
      case 7: SimpleGames.game_WhatsMissing(zone); break;
      case 8: SimpleGames.game_PatternBreaker(zone); break;
      case 9: SimpleGames.game_SoundSequence(zone); break;
      case 10: SimpleGames.game_FaceMemory(zone); break;
      case 11: SimpleGames.game_NumberGrid(zone); break;
      case 12: SimpleGames.game_DualNBack(zone); break;
      case 13: SimpleGames.game_ColorWordClash(zone); break;
      case 14: SimpleGames.game_EmojiStory(zone); break;
    }
  }
};

// CSS Animations
const style = document.createElement('style');
style.textContent = `
  @keyframes flagWave {
    0%, 100% { transform: rotate(-3deg); }
    50% { transform: rotate(3deg); }
  }
  
  .game-header-display {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 15px;
    background: rgba(0,0,0,0.3);
    border-radius: 15px;
    margin-bottom: 15px;
  }
  
  .game-icon-display { font-size: 2rem; }
  .game-title-display { font-size: 1.2rem; font-weight: 600; }
  
  .quiz-container, .flag-container, .sort-game, .math-game, .pop-game,
  .reaction-game, .memory-game, .scramble-game, .tf-game, .ultimate-game {
    padding: 15px;
  }
  
  .quiz-progress, .math-streak, .pop-score, .memory-level, .tf-streak, .ultimate-progress {
    margin-top: 15px;
    font-size: 1rem;
    color: rgba(255,255,255,0.8);
  }
  
  .quiz-timer-bar {
    height: 8px;
    background: rgba(255,255,255,0.2);
    border-radius: 4px;
    margin-top: 15px;
    overflow: hidden;
  }
  
  .score-popup {
    position: absolute;
    font-size: 1.5rem;
    font-weight: bold;
    pointer-events: none;
    animation: popUp 0.8s ease-out forwards;
    z-index: 100;
  }
  
  .score-popup.positive { color: #22c55e; }
  .score-popup.negative { color: #ef4444; }
  
  @keyframes popUp {
    0% { opacity: 1; transform: translateY(0) scale(1); }
    100% { opacity: 0; transform: translateY(-50px) scale(1.5); }
  }
`;
document.head.appendChild(style);
