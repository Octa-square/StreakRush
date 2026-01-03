// ========================================
// STREAKRUSH - 365 UNIQUE GAME MECHANICS
// Continuously reshuffling, challenging games!
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
    
    // Route to specific unique game based on ID
    switch(gameId) {
      case 1: SimpleGames.game1_WorldCapitals(zone); break;
      case 2: SimpleGames.game2_FlagMatch(zone); break;
      case 3: SimpleGames.game3_ContinentSort(zone); break;
      case 4: SimpleGames.game4_SpeedMath(zone); break;
      case 5: SimpleGames.game5_CountryPopulation(zone); break;
      case 6: SimpleGames.game6_ReactionTest(zone); break;
      case 7: SimpleGames.game7_MemorySequence(zone); break;
      case 8: SimpleGames.game8_WordScramble(zone); break;
      case 9: SimpleGames.game9_TrueFalseBlitz(zone); break;
      case 10: SimpleGames.game10_UltimateQuiz(zone); break;
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

  // Generic game for IDs > 10
  gameGeneric: (zone, game) => {
    const mechanic = game.id % 5;
    switch(mechanic) {
      case 0: SimpleGames.game1_WorldCapitals(zone); break;
      case 1: SimpleGames.game4_SpeedMath(zone); break;
      case 2: SimpleGames.game9_TrueFalseBlitz(zone); break;
      case 3: SimpleGames.game6_ReactionTest(zone); break;
      case 4: SimpleGames.game7_MemorySequence(zone); break;
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
