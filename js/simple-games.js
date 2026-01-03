// ========================================
// STREAKRUSH - UNIQUE GAME IMPLEMENTATIONS
// Every game has completely different gameplay!
// ========================================

const SimpleGames = {
  score: 0,
  gameArea: null,
  isActive: false,
  gameType: null,
  intervals: [],
  timeouts: [],
  
  clearTimers: () => {
    SimpleGames.intervals.forEach(i => clearInterval(i));
    SimpleGames.timeouts.forEach(t => clearTimeout(t));
    SimpleGames.intervals = [];
    SimpleGames.timeouts = [];
  },
  
  init: (gameArea, gameId) => {
    SimpleGames.gameArea = gameArea;
    SimpleGames.score = 0;
    SimpleGames.isActive = true;
    SimpleGames.gameType = gameId;
    SimpleGames.clearTimers();
    gameArea.innerHTML = '';
  },
  
  start: (gameId) => {
    const game = getGameById(gameId);
    if (!game) return;
    
    // Each game has unique implementation
    switch(gameId) {
      case 1: SimpleGames.game1_TapGreen(); break;
      case 2: SimpleGames.game2_PopBubbles(); break;
      case 3: SimpleGames.game3_CatchStars(); break;
      case 4: SimpleGames.game4_WhackMole(); break;
      case 5: SimpleGames.game5_TapFast(); break;
      case 6: SimpleGames.game6_AvoidRed(); break;
      case 7: SimpleGames.game7_ShrinkingDots(); break;
      case 8: SimpleGames.game8_MovingTargets(); break;
      case 9: SimpleGames.game9_ColorMatch(); break;
      case 10: SimpleGames.game10_QuickTap(); break;
      default:
        if (game.category === 'memory') SimpleGames.startMemoryGame(gameId);
        else if (game.category === 'math') SimpleGames.startMathGame(gameId);
        else if (game.category === 'reaction') SimpleGames.startReactionGame(gameId);
        else if (game.category === 'words') SimpleGames.startWordGame(gameId);
        else if (game.category === 'visual') SimpleGames.startVisualGame(gameId);
    }
  },
  
  end: () => {
    SimpleGames.isActive = false;
    SimpleGames.clearTimers();
    return { score: Math.max(0, SimpleGames.score) };
  },
  
  updateScore: () => {
    const scoreEl = document.getElementById('game-score');
    if (scoreEl) scoreEl.textContent = SimpleGames.score;
  },
  
  showPopup: (x, y, text, isPositive) => {
    const popup = document.createElement('div');
    popup.className = `score-popup ${isPositive ? 'positive' : 'negative'}`;
    popup.textContent = text;
    popup.style.left = `${x}px`;
    popup.style.top = `${y}px`;
    SimpleGames.gameArea.appendChild(popup);
    setTimeout(() => popup.remove(), 800);
    if (isPositive) Sounds.correct(); else Sounds.wrong();
  },

  // ========================================
  // GAME 1: TAP GREEN - Tap green circles
  // ========================================
  game1_TapGreen: () => {
    const area = SimpleGames.gameArea;
    const rect = area.getBoundingClientRect();
    
    const spawnCircle = () => {
      if (!SimpleGames.isActive) return;
      
      const circle = document.createElement('div');
      circle.className = 'game1-circle';
      
      const size = 60 + Math.random() * 30;
      circle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: radial-gradient(circle at 30% 30%, #4ade80, #22c55e, #16a34a);
        box-shadow: 0 0 20px rgba(74,222,128,0.6), inset 0 -5px 15px rgba(0,0,0,0.2);
        cursor: pointer;
        transition: transform 0.1s;
        left: ${Math.random() * (rect.width - size - 20) + 10}px;
        top: ${Math.random() * (rect.height - size - 20) + 10}px;
      `;
      
      circle.onclick = (e) => {
        SimpleGames.score += 10;
        SimpleGames.updateScore();
        SimpleGames.showPopup(e.clientX - rect.left, e.clientY - rect.top, '+10', true);
        circle.style.transform = 'scale(1.5)';
        circle.style.opacity = '0';
        setTimeout(() => circle.remove(), 150);
      };
      
      area.appendChild(circle);
      
      SimpleGames.timeouts.push(setTimeout(() => {
        if (circle.parentNode) {
          circle.style.opacity = '0';
          setTimeout(() => circle.remove(), 200);
        }
      }, 1500));
    };
    
    SimpleGames.intervals.push(setInterval(spawnCircle, 600));
    spawnCircle();
  },

  // ========================================
  // GAME 2: POP BUBBLES - Bubbles float UP
  // ========================================
  game2_PopBubbles: () => {
    const area = SimpleGames.gameArea;
    const rect = area.getBoundingClientRect();
    
    const spawnBubble = () => {
      if (!SimpleGames.isActive) return;
      
      const bubble = document.createElement('div');
      const size = 30 + Math.random() * 50;
      const startX = Math.random() * (rect.width - size);
      const speed = 1 + Math.random() * 2;
      let y = rect.height;
      
      bubble.className = 'game2-bubble';
      bubble.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.9), rgba(135,206,250,0.5), transparent);
        border: 2px solid rgba(255,255,255,0.6);
        box-shadow: inset -5px -5px 10px rgba(0,0,0,0.05), 0 0 10px rgba(255,255,255,0.3);
        cursor: pointer;
        left: ${startX}px;
        top: ${y}px;
      `;
      
      bubble.onclick = (e) => {
        SimpleGames.score += 10;
        SimpleGames.updateScore();
        SimpleGames.showPopup(e.clientX - rect.left, e.clientY - rect.top, '+10', true);
        // Pop animation
        bubble.style.transform = 'scale(1.5)';
        bubble.style.opacity = '0';
        bubble.innerHTML = '💨';
        setTimeout(() => bubble.remove(), 200);
      };
      
      area.appendChild(bubble);
      
      // Float upward with wobble
      const float = setInterval(() => {
        if (!SimpleGames.isActive || !bubble.parentNode) {
          clearInterval(float);
          return;
        }
        y -= speed;
        const wobble = Math.sin(Date.now() / 200) * 3;
        bubble.style.top = `${y}px`;
        bubble.style.left = `${startX + wobble}px`;
        
        if (y < -size) {
          bubble.remove();
          clearInterval(float);
        }
      }, 16);
      SimpleGames.intervals.push(float);
    };
    
    SimpleGames.intervals.push(setInterval(spawnBubble, 400));
    spawnBubble();
  },

  // ========================================
  // GAME 3: CATCH STARS - Stars fall, catch with basket
  // ========================================
  game3_CatchStars: () => {
    const area = SimpleGames.gameArea;
    const rect = area.getBoundingClientRect();
    
    // Create basket
    const basket = document.createElement('div');
    basket.className = 'game3-basket';
    basket.innerHTML = '🧺';
    basket.style.cssText = `
      position: absolute;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 60px;
      cursor: grab;
      user-select: none;
      touch-action: none;
      filter: drop-shadow(0 5px 10px rgba(0,0,0,0.3));
    `;
    area.appendChild(basket);
    
    let basketX = rect.width / 2 - 30;
    
    // Mouse/Touch control
    const moveBasket = (clientX) => {
      basketX = clientX - rect.left - 30;
      basketX = Math.max(0, Math.min(rect.width - 60, basketX));
      basket.style.left = `${basketX}px`;
      basket.style.transform = 'none';
    };
    
    area.addEventListener('mousemove', (e) => moveBasket(e.clientX));
    area.addEventListener('touchmove', (e) => {
      e.preventDefault();
      moveBasket(e.touches[0].clientX);
    }, { passive: false });
    
    // Spawn stars
    const spawnStar = () => {
      if (!SimpleGames.isActive) return;
      
      const star = document.createElement('div');
      const x = Math.random() * (rect.width - 40);
      let y = -40;
      const speed = 3 + Math.random() * 3;
      
      star.className = 'game3-star';
      star.innerHTML = '⭐';
      star.style.cssText = `
        position: absolute;
        font-size: 35px;
        left: ${x}px;
        top: ${y}px;
        animation: twinkleStar 0.5s ease infinite alternate;
        text-shadow: 0 0 10px gold;
      `;
      area.appendChild(star);
      
      const fall = setInterval(() => {
        if (!SimpleGames.isActive || !star.parentNode) {
          clearInterval(fall);
          return;
        }
        y += speed;
        star.style.top = `${y}px`;
        
        // Check catch
        if (y > rect.height - 90) {
          const starX = x + 20;
          if (Math.abs(starX - (basketX + 30)) < 50) {
            SimpleGames.score += 15;
            SimpleGames.updateScore();
            star.innerHTML = '✨';
            star.style.transform = 'scale(1.5)';
            Sounds.correct();
            setTimeout(() => star.remove(), 200);
            clearInterval(fall);
            return;
          }
        }
        
        // Missed
        if (y > rect.height) {
          star.remove();
          clearInterval(fall);
        }
      }, 16);
      SimpleGames.intervals.push(fall);
    };
    
    SimpleGames.intervals.push(setInterval(spawnStar, 700));
    spawnStar();
  },

  // ========================================
  // GAME 4: WHACK MOLE - Moles pop from holes
  // ========================================
  game4_WhackMole: () => {
    const area = SimpleGames.gameArea;
    
    area.innerHTML = `
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; padding: 30px; max-width: 350px; margin: 0 auto;">
        ${[0,1,2,3,4,5,6,7,8].map(i => `
          <div class="mole-hole" data-hole="${i}" style="
            aspect-ratio: 1;
            background: radial-gradient(ellipse at bottom, #3d2817 0%, #251709 100%);
            border-radius: 50%;
            position: relative;
            box-shadow: inset 0 10px 20px rgba(0,0,0,0.5);
            cursor: pointer;
            overflow: hidden;
          ">
            <div class="mole" style="
              position: absolute;
              bottom: -60px;
              left: 50%;
              transform: translateX(-50%);
              font-size: 50px;
              transition: bottom 0.15s ease-out;
            ">🐹</div>
          </div>
        `).join('')}
      </div>
    `;
    
    const holes = area.querySelectorAll('.mole-hole');
    
    const popMole = () => {
      if (!SimpleGames.isActive) return;
      
      const holeIndex = Math.floor(Math.random() * 9);
      const hole = holes[holeIndex];
      const mole = hole.querySelector('.mole');
      
      // Pop up
      mole.style.bottom = '5px';
      
      let clicked = false;
      const whack = () => {
        if (clicked) return;
        clicked = true;
        SimpleGames.score += 15;
        SimpleGames.updateScore();
        mole.innerHTML = '😵';
        Sounds.correct();
        if ('vibrate' in navigator) navigator.vibrate(30);
        setTimeout(() => {
          mole.style.bottom = '-60px';
          mole.innerHTML = '🐹';
        }, 200);
      };
      
      hole.onclick = whack;
      
      // Go back down
      SimpleGames.timeouts.push(setTimeout(() => {
        mole.style.bottom = '-60px';
        hole.onclick = null;
      }, 800 + Math.random() * 400));
    };
    
    SimpleGames.intervals.push(setInterval(popMole, 600));
    popMole();
  },

  // ========================================
  // GAME 5: TAP FAST - Rapid tapping counter
  // ========================================
  game5_TapFast: () => {
    const area = SimpleGames.gameArea;
    let taps = 0;
    
    area.innerHTML = `
      <div style="text-align: center; padding-top: 30px;">
        <div style="font-size: 80px; font-weight: bold; color: #ff6b35; text-shadow: 0 0 20px rgba(255,107,53,0.5);" id="tap-counter">0</div>
        <div style="font-size: 18px; color: rgba(255,255,255,0.6); margin-bottom: 30px;">TAPS</div>
        <button id="tap-btn" style="
          width: 200px;
          height: 200px;
          border-radius: 50%;
          background: linear-gradient(145deg, #ff6b35, #f7931e);
          border: none;
          font-size: 60px;
          cursor: pointer;
          box-shadow: 0 10px 30px rgba(255,107,53,0.4), inset 0 -5px 20px rgba(0,0,0,0.2);
          transition: transform 0.05s;
          user-select: none;
          touch-action: manipulation;
        ">👆</button>
        <div style="margin-top: 30px; font-size: 24px; color: rgba(255,255,255,0.8);">TAP AS FAST AS YOU CAN!</div>
      </div>
    `;
    
    const counter = document.getElementById('tap-counter');
    const btn = document.getElementById('tap-btn');
    
    const handleTap = (e) => {
      e.preventDefault();
      taps++;
      counter.textContent = taps;
      SimpleGames.score = taps * 2;
      SimpleGames.updateScore();
      
      btn.style.transform = 'scale(0.92)';
      setTimeout(() => btn.style.transform = '', 50);
      
      if ('vibrate' in navigator) navigator.vibrate(5);
    };
    
    btn.addEventListener('mousedown', handleTap);
    btn.addEventListener('touchstart', handleTap, { passive: false });
  },

  // ========================================
  // GAME 6: AVOID RED - Green good, Red bad
  // ========================================
  game6_AvoidRed: () => {
    const area = SimpleGames.gameArea;
    const rect = area.getBoundingClientRect();
    
    const spawnCircle = () => {
      if (!SimpleGames.isActive) return;
      
      const isGood = Math.random() > 0.35;
      const circle = document.createElement('div');
      const size = 50 + Math.random() * 30;
      
      circle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        cursor: pointer;
        left: ${Math.random() * (rect.width - size - 20) + 10}px;
        top: ${Math.random() * (rect.height - size - 20) + 10}px;
        ${isGood 
          ? 'background: radial-gradient(circle at 30% 30%, #4ade80, #22c55e); box-shadow: 0 0 15px rgba(74,222,128,0.6);'
          : 'background: radial-gradient(circle at 30% 30%, #f87171, #ef4444); box-shadow: 0 0 15px rgba(248,113,113,0.6); animation: dangerPulse 0.3s infinite;'
        }
      `;
      
      circle.onclick = (e) => {
        if (isGood) {
          SimpleGames.score += 10;
          SimpleGames.showPopup(e.clientX - rect.left, e.clientY - rect.top, '+10', true);
        } else {
          SimpleGames.score -= 20;
          SimpleGames.showPopup(e.clientX - rect.left, e.clientY - rect.top, '-20', false);
          if ('vibrate' in navigator) navigator.vibrate([50, 30, 50]);
        }
        SimpleGames.updateScore();
        circle.style.transform = 'scale(1.3)';
        circle.style.opacity = '0';
        setTimeout(() => circle.remove(), 150);
      };
      
      area.appendChild(circle);
      
      SimpleGames.timeouts.push(setTimeout(() => {
        if (circle.parentNode) circle.remove();
      }, 1800));
    };
    
    SimpleGames.intervals.push(setInterval(spawnCircle, 500));
    spawnCircle();
  },

  // ========================================
  // GAME 7: SHRINKING DOTS - Tap before gone
  // ========================================
  game7_ShrinkingDots: () => {
    const area = SimpleGames.gameArea;
    const rect = area.getBoundingClientRect();
    
    const spawnDot = () => {
      if (!SimpleGames.isActive) return;
      
      const dot = document.createElement('div');
      const startSize = 80 + Math.random() * 40;
      const x = Math.random() * (rect.width - startSize - 20) + 10;
      const y = Math.random() * (rect.height - startSize - 20) + 10;
      
      dot.style.cssText = `
        position: absolute;
        width: ${startSize}px;
        height: ${startSize}px;
        border-radius: 50%;
        background: radial-gradient(circle, #a855f7, #7c3aed, #5b21b6);
        box-shadow: 0 0 30px rgba(168,85,247,0.6);
        cursor: pointer;
        left: ${x}px;
        top: ${y}px;
        transition: width 2.5s linear, height 2.5s linear, opacity 2.5s linear;
      `;
      
      area.appendChild(dot);
      
      // Start shrinking
      setTimeout(() => {
        dot.style.width = '5px';
        dot.style.height = '5px';
        dot.style.opacity = '0.2';
      }, 50);
      
      dot.onclick = (e) => {
        const currentSize = parseFloat(dot.style.width);
        const points = Math.max(5, Math.floor(currentSize / 3));
        SimpleGames.score += points;
        SimpleGames.updateScore();
        SimpleGames.showPopup(e.clientX - rect.left, e.clientY - rect.top, `+${points}`, true);
        dot.remove();
      };
      
      SimpleGames.timeouts.push(setTimeout(() => {
        if (dot.parentNode) dot.remove();
      }, 2600));
    };
    
    SimpleGames.intervals.push(setInterval(spawnDot, 800));
    spawnDot();
  },

  // ========================================
  // GAME 8: MOVING TARGETS - Chase & tap
  // ========================================
  game8_MovingTargets: () => {
    const area = SimpleGames.gameArea;
    const rect = area.getBoundingClientRect();
    
    const spawnTarget = () => {
      if (!SimpleGames.isActive) return;
      
      const target = document.createElement('div');
      const size = 50;
      let x = Math.random() * (rect.width - size - 20) + 10;
      let y = Math.random() * (rect.height - size - 20) + 10;
      let vx = (Math.random() - 0.5) * 8;
      let vy = (Math.random() - 0.5) * 8;
      
      target.innerHTML = '🎯';
      target.style.cssText = `
        position: absolute;
        font-size: 40px;
        cursor: crosshair;
        left: ${x}px;
        top: ${y}px;
        filter: drop-shadow(0 0 10px rgba(255,0,255,0.5));
      `;
      
      target.onclick = (e) => {
        SimpleGames.score += 15;
        SimpleGames.updateScore();
        SimpleGames.showPopup(e.clientX - rect.left, e.clientY - rect.top, '+15', true);
        target.innerHTML = '💥';
        setTimeout(() => target.remove(), 150);
      };
      
      area.appendChild(target);
      
      // Movement
      const move = setInterval(() => {
        if (!SimpleGames.isActive || !target.parentNode) {
          clearInterval(move);
          return;
        }
        x += vx;
        y += vy;
        
        if (x < 0 || x > rect.width - size) vx *= -1;
        if (y < 0 || y > rect.height - size) vy *= -1;
        
        target.style.left = `${x}px`;
        target.style.top = `${y}px`;
      }, 16);
      SimpleGames.intervals.push(move);
      
      SimpleGames.timeouts.push(setTimeout(() => {
        if (target.parentNode) target.remove();
      }, 3000));
    };
    
    SimpleGames.intervals.push(setInterval(spawnTarget, 900));
    spawnTarget();
  },

  // ========================================
  // GAME 9: COLOR MATCH - Match the color shown
  // ========================================
  game9_ColorMatch: () => {
    const area = SimpleGames.gameArea;
    const rect = area.getBoundingClientRect();
    
    const colors = [
      { name: 'RED', hex: '#ef4444' },
      { name: 'BLUE', hex: '#3b82f6' },
      { name: 'GREEN', hex: '#22c55e' },
      { name: 'YELLOW', hex: '#eab308' },
      { name: 'PINK', hex: '#ec4899' },
      { name: 'ORANGE', hex: '#f97316' }
    ];
    
    let targetColor = colors[0];
    
    // Target display
    const targetEl = document.createElement('div');
    targetEl.style.cssText = `
      position: absolute;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0,0,0,0.5);
      padding: 15px 30px;
      border-radius: 12px;
      font-size: 24px;
      font-weight: bold;
      z-index: 10;
    `;
    area.appendChild(targetEl);
    
    const updateTarget = () => {
      targetColor = colors[Math.floor(Math.random() * colors.length)];
      targetEl.innerHTML = `TAP <span style="color:${targetColor.hex}">${targetColor.name}</span>`;
    };
    updateTarget();
    
    const spawnCircle = () => {
      if (!SimpleGames.isActive) return;
      
      const color = colors[Math.floor(Math.random() * colors.length)];
      const circle = document.createElement('div');
      const size = 55;
      
      circle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: ${color.hex};
        box-shadow: 0 0 15px ${color.hex}80;
        cursor: pointer;
        left: ${Math.random() * (rect.width - size - 20) + 10}px;
        top: ${80 + Math.random() * (rect.height - size - 100)}px;
      `;
      
      circle.onclick = (e) => {
        if (color.name === targetColor.name) {
          SimpleGames.score += 12;
          SimpleGames.showPopup(e.clientX - rect.left, e.clientY - rect.top, '+12', true);
          updateTarget();
        } else {
          SimpleGames.score -= 8;
          SimpleGames.showPopup(e.clientX - rect.left, e.clientY - rect.top, '-8', false);
        }
        SimpleGames.updateScore();
        circle.remove();
      };
      
      area.appendChild(circle);
      
      SimpleGames.timeouts.push(setTimeout(() => {
        if (circle.parentNode) circle.remove();
      }, 2000));
    };
    
    SimpleGames.intervals.push(setInterval(spawnCircle, 450));
    spawnCircle();
  },

  // ========================================
  // GAME 10: QUICK TAP - Reaction time
  // ========================================
  game10_QuickTap: () => {
    const area = SimpleGames.gameArea;
    
    area.innerHTML = `
      <div style="text-align: center; padding-top: 50px;">
        <div id="light" style="
          width: 180px;
          height: 180px;
          border-radius: 50%;
          background: #ef4444;
          margin: 0 auto 40px;
          box-shadow: 0 0 40px rgba(239,68,68,0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          font-weight: bold;
          color: white;
          cursor: pointer;
          user-select: none;
        ">WAIT...</div>
        <div id="result" style="font-size: 36px; font-weight: bold; min-height: 50px;"></div>
        <div id="best" style="font-size: 18px; color: rgba(255,255,255,0.5); margin-top: 20px;">Best: ---</div>
      </div>
    `;
    
    const light = document.getElementById('light');
    const result = document.getElementById('result');
    const bestEl = document.getElementById('best');
    
    let canTap = false;
    let startTime = 0;
    let best = Infinity;
    
    const startRound = () => {
      if (!SimpleGames.isActive) return;
      
      canTap = false;
      light.textContent = 'WAIT...';
      light.style.background = '#ef4444';
      light.style.boxShadow = '0 0 40px rgba(239,68,68,0.6)';
      result.textContent = '';
      
      const delay = 1500 + Math.random() * 3000;
      
      SimpleGames.timeouts.push(setTimeout(() => {
        if (!SimpleGames.isActive) return;
        canTap = true;
        startTime = Date.now();
        light.textContent = 'TAP!';
        light.style.background = '#22c55e';
        light.style.boxShadow = '0 0 60px rgba(34,197,94,0.8)';
      }, delay));
    };
    
    light.onclick = () => {
      if (!canTap) {
        result.textContent = '❌ TOO EARLY!';
        result.style.color = '#ef4444';
        SimpleGames.score -= 15;
        if ('vibrate' in navigator) navigator.vibrate([50, 30, 50]);
      } else {
        const time = Date.now() - startTime;
        const points = Math.max(5, 50 - Math.floor(time / 10));
        result.textContent = `⚡ ${time}ms! +${points}`;
        result.style.color = '#22c55e';
        SimpleGames.score += points;
        Sounds.correct();
        
        if (time < best) {
          best = time;
          bestEl.textContent = `Best: ${best}ms`;
        }
      }
      SimpleGames.updateScore();
      canTap = false;
      setTimeout(startRound, 1500);
    };
    
    startRound();
  },

  // ========== MEMORY GAMES (11-20) ==========
  startMemoryGame: (gameId) => {
    const area = SimpleGames.gameArea;
    
    // Simon Says pattern game
    let pattern = [];
    let userPattern = [];
    let showingPattern = false;
    let level = 3;
    
    const colors = [
      { bg: 'linear-gradient(145deg, #ef233c, #b91c1c)', glow: 'rgba(239,35,60,0.6)' },
      { bg: 'linear-gradient(145deg, #3b82f6, #1d4ed8)', glow: 'rgba(59,130,246,0.6)' },
      { bg: 'linear-gradient(145deg, #10b981, #059669)', glow: 'rgba(16,185,129,0.6)' },
      { bg: 'linear-gradient(145deg, #fbbf24, #d97706)', glow: 'rgba(251,191,36,0.6)' }
    ];
    
    const container = document.createElement('div');
    container.className = 'memory-game-container';
    container.innerHTML = `
      <div class="memory-status" id="memory-status" style="text-align:center;font-size:24px;margin-bottom:20px;">🔮 Watch the pattern...</div>
      <div class="memory-grid" id="memory-grid" style="display:grid;grid-template-columns:repeat(2,1fr);gap:16px;max-width:280px;margin:0 auto;"></div>
    `;
    area.appendChild(container);
    
    const grid = document.getElementById('memory-grid');
    const status = document.getElementById('memory-status');
    const tiles = [];
    
    for (let i = 0; i < 4; i++) {
      const tile = document.createElement('div');
      tile.className = 'memory-tile';
      tile.dataset.index = i;
      tile.style.cssText = `
        aspect-ratio: 1;
        border-radius: 50%;
        background: rgba(255,255,255,0.1);
        cursor: pointer;
        transition: all 0.2s;
      `;
      
      tile.addEventListener('click', () => {
        if (showingPattern || !SimpleGames.isActive) return;
        
        tile.style.background = colors[i].bg;
        tile.style.boxShadow = `0 0 30px ${colors[i].glow}`;
        Sounds.correct();
        
        setTimeout(() => {
          tile.style.background = 'rgba(255,255,255,0.1)';
          tile.style.boxShadow = '';
        }, 300);
        
        userPattern.push(i);
        
        if (userPattern[userPattern.length - 1] !== pattern[userPattern.length - 1]) {
          status.textContent = '❌ Wrong!';
          Sounds.wrong();
          SimpleGames.score -= 10;
          SimpleGames.updateScore();
          setTimeout(startRound, 1000);
        } else if (userPattern.length === pattern.length) {
          SimpleGames.score += level * 25;
          SimpleGames.updateScore();
          status.textContent = `✨ Level ${level + 1}!`;
          level++;
          setTimeout(startRound, 1000);
        }
      });
      
      grid.appendChild(tile);
      tiles.push(tile);
    }
    
    const startRound = async () => {
      if (!SimpleGames.isActive) return;
      
      pattern = [];
      userPattern = [];
      showingPattern = true;
      status.textContent = '🔮 Watch...';
      
      for (let i = 0; i < level; i++) {
        pattern.push(Math.floor(Math.random() * 4));
      }
      
      await Utils.delay(500);
      
      for (let i = 0; i < pattern.length; i++) {
        if (!SimpleGames.isActive) return;
        
        const tile = tiles[pattern[i]];
        const colorIdx = pattern[i];
        
        tile.style.background = colors[colorIdx].bg;
        tile.style.boxShadow = `0 0 40px ${colors[colorIdx].glow}`;
        Sounds.correct();
        
        await Utils.delay(400);
        
        tile.style.background = 'rgba(255,255,255,0.1)';
        tile.style.boxShadow = '';
        
        await Utils.delay(200);
      }
      
      showingPattern = false;
      status.textContent = '👆 Your turn!';
    };
    
    startRound();
  },

  // ========== MATH GAMES (21-30) ==========
  startMathGame: (gameId) => {
    const area = SimpleGames.gameArea;
    
    const container = document.createElement('div');
    container.className = 'math-game-container';
    container.innerHTML = `
      <div class="math-problem" id="math-problem" style="font-size:48px;text-align:center;margin-bottom:30px;font-weight:bold;">Loading...</div>
      <div class="math-options" id="math-options" style="display:grid;grid-template-columns:repeat(2,1fr);gap:16px;max-width:300px;margin:0 auto;"></div>
    `;
    area.appendChild(container);
    
    const problemEl = document.getElementById('math-problem');
    const optionsEl = document.getElementById('math-options');
    
    const generateProblem = () => {
      if (!SimpleGames.isActive) return;
      
      let problem, answer, options;
      const a = Math.floor(Math.random() * 10) + 1;
      const b = Math.floor(Math.random() * 10) + 1;
      
      switch(gameId) {
        case 21: problem = `${a} + ${b} = ?`; answer = a + b; break;
        case 22: problem = `${Math.max(a,b)} - ${Math.min(a,b)} = ?`; answer = Math.max(a,b) - Math.min(a,b); break;
        case 23: problem = `${a} × ${b} = ?`; answer = a * b; break;
        case 24:
          problem = 'Which is BIGGER?';
          answer = Math.max(a * 10, b * 10);
          options = [a * 10, b * 10];
          break;
        case 27:
          const num = Math.floor(Math.random() * 20) + 1;
          problem = `Is ${num} EVEN or ODD?`;
          answer = num % 2 === 0 ? 'EVEN' : 'ODD';
          options = ['EVEN', 'ODD'];
          break;
        case 28: problem = `Double ${a} = ?`; answer = a * 2; break;
        case 29: problem = `Half of ${a * 2} = ?`; answer = a; break;
        default: problem = `${a} + ${b} = ?`; answer = a + b;
      }
      
      problemEl.innerHTML = problem;
      
      if (!options) {
        options = [answer];
        while (options.length < 4) {
          const wrong = answer + Math.floor(Math.random() * 10) - 5;
          if (wrong !== answer && wrong > 0 && !options.includes(wrong)) options.push(wrong);
        }
        options.sort(() => Math.random() - 0.5);
      }
      
      optionsEl.innerHTML = '';
      options.forEach(opt => {
        const btn = document.createElement('button');
        btn.style.cssText = `
          padding: 20px;
          font-size: 24px;
          font-weight: bold;
          background: rgba(255,255,255,0.1);
          border: 2px solid rgba(255,255,255,0.2);
          border-radius: 12px;
          color: white;
          cursor: pointer;
        `;
        btn.textContent = opt;
        btn.onclick = () => {
          if (opt === answer || opt.toString() === answer.toString()) {
            SimpleGames.score += 10;
            btn.style.background = '#22c55e';
            Sounds.correct();
          } else {
            SimpleGames.score -= 5;
            btn.style.background = '#ef4444';
            Sounds.wrong();
          }
          SimpleGames.updateScore();
          setTimeout(generateProblem, 400);
        };
        optionsEl.appendChild(btn);
      });
    };
    
    generateProblem();
  },

  // ========== REACTION GAMES (31-40) ==========
  startReactionGame: (gameId) => {
    SimpleGames.game10_QuickTap(); // Use reaction game template
  },

  // ========== WORD GAMES (41-50) ==========
  startWordGame: (gameId) => {
    const area = SimpleGames.gameArea;
    const words = ['cat', 'dog', 'sun', 'moon', 'star', 'tree', 'book', 'fish', 'bird', 'cake'];
    
    const container = document.createElement('div');
    container.innerHTML = `
      <div style="text-align:center;padding:20px;">
        <div id="word" style="font-size:64px;margin-bottom:30px;letter-spacing:8px;font-weight:bold;"></div>
        <input type="text" id="input" style="
          width:100%;max-width:300px;padding:20px;font-size:32px;text-align:center;
          background:rgba(0,0,0,0.3);border:2px solid rgba(255,255,255,0.3);
          border-radius:12px;color:white;
        " autocomplete="off" autocorrect="off">
      </div>
    `;
    area.appendChild(container);
    
    const wordEl = document.getElementById('word');
    const input = document.getElementById('input');
    let currentWord = '';
    
    const newWord = () => {
      currentWord = words[Math.floor(Math.random() * words.length)];
      wordEl.textContent = currentWord.toUpperCase();
      input.value = '';
      input.focus();
    };
    
    input.addEventListener('input', () => {
      if (input.value.toLowerCase() === currentWord) {
        SimpleGames.score += currentWord.length * 5;
        SimpleGames.updateScore();
        Sounds.correct();
        newWord();
      }
    });
    
    newWord();
  },

  // ========== VISUAL GAMES (51-60) ==========
  startVisualGame: (gameId) => {
    const area = SimpleGames.gameArea;
    const shapes = ['🔴', '🟢', '🔵', '🟡', '🟣', '🟠'];
    
    const container = document.createElement('div');
    container.innerHTML = `
      <div id="question" style="text-align:center;font-size:24px;margin-bottom:20px;">Find the different one!</div>
      <div id="grid" style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;max-width:280px;margin:0 auto;"></div>
    `;
    area.appendChild(container);
    
    const questionEl = document.getElementById('question');
    const gridEl = document.getElementById('grid');
    
    const generateRound = () => {
      if (!SimpleGames.isActive) return;
      gridEl.innerHTML = '';
      
      const main = shapes[Math.floor(Math.random() * shapes.length)];
      let odd = shapes[Math.floor(Math.random() * shapes.length)];
      while (odd === main) odd = shapes[Math.floor(Math.random() * shapes.length)];
      
      const oddIndex = Math.floor(Math.random() * 9);
      
      for (let i = 0; i < 9; i++) {
        const item = document.createElement('div');
        item.textContent = i === oddIndex ? odd : main;
        item.style.cssText = `
          font-size: 48px;
          aspect-ratio: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,0.05);
          border-radius: 12px;
          cursor: pointer;
        `;
        item.onclick = () => {
          if (i === oddIndex) {
            SimpleGames.score += 15;
            item.style.background = 'rgba(34,197,94,0.3)';
            Sounds.correct();
          } else {
            SimpleGames.score -= 5;
            item.style.background = 'rgba(239,68,68,0.3)';
            Sounds.wrong();
          }
          SimpleGames.updateScore();
          setTimeout(generateRound, 500);
        };
        gridEl.appendChild(item);
      }
    };
    
    generateRound();
  }
};
