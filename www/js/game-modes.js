// ========================================
// STREAKRUSH - GAME MODES SYSTEM
// Speed, Practice, and Challenge modes
// ========================================

const GameModes = {
  MODES: {
    SPEED: {
      id: 'speed',
      name: 'Speed Mode',
      icon: '⏱️',
      description: 'Race against the clock - 60 seconds!',
      color: '#ff6b35',
      hasTimer: true,
      timeLimit: 60,
      penaltyForWrong: true,
      questionTimeLimit: 5, // 5 seconds per question
      scoreMultiplier: 1.0,
      premium: false
    },
    PRACTICE: {
      id: 'practice',
      name: 'Practice Mode',
      icon: '🧠',
      description: 'No time pressure - focus on learning',
      color: '#22c55e',
      hasTimer: false,
      timeLimit: null,
      penaltyForWrong: false,
      questionTimeLimit: null, // No time limit per question
      maxQuestions: 20,
      scoreMultiplier: 0.5, // Half points (no pressure = less reward)
      premium: false
    },
    CHALLENGE: {
      id: 'challenge',
      name: 'Challenge Mode',
      icon: '💪',
      description: 'Harder questions, less time, bigger rewards!',
      color: '#f72585',
      hasTimer: true,
      timeLimit: 45, // Only 45 seconds
      penaltyForWrong: true,
      questionTimeLimit: 3, // Only 3 seconds per question!
      scoreMultiplier: 2.0, // Double points
      premium: true
    }
  },

  currentMode: null,

  // Check if user has premium
  isPremium: () => {
    const user = Storage.getUser();
    return user.isPremium || Storage.DEMO_MODE;
  },

  // Get available modes for user
  getAvailableModes: () => {
    const isPremium = GameModes.isPremium();
    return Object.entries(GameModes.MODES).map(([key, mode]) => ({
      key,
      ...mode,
      available: !mode.premium || isPremium
    }));
  },

  // Set current mode
  setMode: (modeKey) => {
    GameModes.currentMode = GameModes.MODES[modeKey] || GameModes.MODES.SPEED;
    return GameModes.currentMode;
  },

  // Get current mode settings
  getMode: () => {
    return GameModes.currentMode || GameModes.MODES.SPEED;
  },

  // Show mode selector UI
  showModeSelector: (gameId, callback) => {
    const isPremium = GameModes.isPremium();
    const modes = GameModes.getAvailableModes();
    
    // Create modal
    let modal = document.getElementById('mode-selector-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'mode-selector-modal';
      document.body.appendChild(modal);
    }
    
    modal.className = 'mode-selector-modal active';
    modal.innerHTML = `
      <div class="mode-selector-content">
        <div class="mode-selector-header">
          <h3>🎮 Select Game Mode</h3>
          <p>Choose how you want to play</p>
        </div>
        
        <div class="mode-cards">
          ${modes.map(mode => `
            <div class="mode-card ${!mode.available ? 'locked' : ''} ${mode.id === 'speed' ? 'recommended' : ''}" 
                 data-mode="${mode.key}"
                 style="--mode-color: ${mode.color}">
              <div class="mode-icon">${mode.icon}</div>
              <div class="mode-info">
                <div class="mode-name">${mode.name}</div>
                <div class="mode-description">${mode.description}</div>
                ${mode.hasTimer ? 
                  `<div class="mode-detail">⏱️ ${mode.timeLimit}s • ${mode.questionTimeLimit}s/question</div>` : 
                  `<div class="mode-detail">📚 ${mode.maxQuestions} questions • No timer</div>`
                }
                ${mode.scoreMultiplier !== 1.0 ? 
                  `<div class="mode-multiplier">${mode.scoreMultiplier > 1 ? '🔥' : '📖'} ${mode.scoreMultiplier}x points</div>` : 
                  ''
                }
              </div>
              ${!mode.available ? '<div class="premium-lock">💎 Premium</div>' : ''}
              ${mode.id === 'speed' ? '<div class="recommended-badge">Default</div>' : ''}
            </div>
          `).join('')}
        </div>
        
        <button class="mode-cancel-btn" id="mode-cancel-btn">← Back</button>
      </div>
    `;
    
    // Add event listeners
    modal.querySelectorAll('.mode-card').forEach(card => {
      card.addEventListener('click', () => {
        const modeKey = card.dataset.mode;
        const mode = GameModes.MODES[modeKey];
        
        if (mode.premium && !isPremium) {
          UI.showToast('💎 Challenge Mode requires Premium!', 'warning');
          return;
        }
        
        Sounds.click();
        GameModes.setMode(modeKey);
        modal.classList.remove('active');
        
        if (callback) callback(modeKey);
      });
    });
    
    document.getElementById('mode-cancel-btn').addEventListener('click', () => {
      Sounds.click();
      modal.classList.remove('active');
    });
  },

  // Hide mode selector
  hideModeSelector: () => {
    const modal = document.getElementById('mode-selector-modal');
    if (modal) modal.classList.remove('active');
  },

  // Apply mode settings to game
  applyModeToGame: (mode) => {
    return {
      timeLimit: mode.timeLimit,
      hasTimer: mode.hasTimer,
      questionTimeLimit: mode.questionTimeLimit,
      penaltyForWrong: mode.penaltyForWrong,
      maxQuestions: mode.maxQuestions || null,
      scoreMultiplier: mode.scoreMultiplier
    };
  },

  // Get score with mode multiplier
  calculateScore: (baseScore) => {
    const mode = GameModes.getMode();
    return Math.round(baseScore * mode.scoreMultiplier);
  }
};

// Add CSS for mode selector
const modeSelectorStyles = document.createElement('style');
modeSelectorStyles.textContent = `
  .mode-selector-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
  }
  
  .mode-selector-modal.active {
    opacity: 1;
    visibility: visible;
  }
  
  .mode-selector-content {
    background: var(--bg-card, #1a1a2e);
    border-radius: 24px;
    padding: 24px;
    max-width: 400px;
    width: 90%;
    max-height: 85vh;
    overflow-y: auto;
    animation: slideUp 0.3s ease;
  }
  
  @keyframes slideUp {
    from { transform: translateY(30px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  
  .mode-selector-header {
    text-align: center;
    margin-bottom: 20px;
  }
  
  .mode-selector-header h3 {
    font-size: 1.5rem;
    margin-bottom: 8px;
    color: var(--text-primary, #fff);
  }
  
  .mode-selector-header p {
    color: var(--text-muted, #888);
    font-size: 0.95rem;
  }
  
  .mode-cards {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 20px;
  }
  
  .mode-card {
    background: rgba(255, 255, 255, 0.05);
    border: 2px solid transparent;
    border-radius: 16px;
    padding: 16px;
    display: flex;
    align-items: center;
    gap: 14px;
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;
    overflow: hidden;
  }
  
  .mode-card:hover:not(.locked) {
    background: rgba(255, 255, 255, 0.1);
    border-color: var(--mode-color);
    transform: translateX(5px);
  }
  
  .mode-card.locked {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .mode-card.recommended {
    border-color: rgba(255, 107, 53, 0.5);
    background: rgba(255, 107, 53, 0.1);
  }
  
  .mode-icon {
    font-size: 2.2rem;
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 12px;
  }
  
  .mode-info {
    flex: 1;
  }
  
  .mode-name {
    font-weight: 600;
    font-size: 1.1rem;
    color: var(--text-primary, #fff);
    margin-bottom: 4px;
  }
  
  .mode-description {
    font-size: 0.85rem;
    color: var(--text-secondary, #aaa);
    margin-bottom: 6px;
  }
  
  .mode-detail {
    font-size: 0.8rem;
    color: var(--text-muted, #888);
  }
  
  .mode-multiplier {
    font-size: 0.85rem;
    color: var(--accent-yellow, #ffd700);
    margin-top: 4px;
    font-weight: 600;
  }
  
  .premium-lock {
    position: absolute;
    top: 8px;
    right: 8px;
    background: linear-gradient(135deg, #7209b7 0%, #f72585 100%);
    color: white;
    font-size: 0.75rem;
    padding: 4px 10px;
    border-radius: 12px;
    font-weight: 600;
  }
  
  .recommended-badge {
    position: absolute;
    top: 8px;
    right: 8px;
    background: rgba(255, 107, 53, 0.2);
    color: #ff6b35;
    font-size: 0.7rem;
    padding: 3px 8px;
    border-radius: 8px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  .mode-cancel-btn {
    width: 100%;
    padding: 14px;
    background: rgba(255, 255, 255, 0.1);
    border: none;
    border-radius: 12px;
    color: var(--text-secondary, #aaa);
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .mode-cancel-btn:hover {
    background: rgba(255, 255, 255, 0.15);
    color: var(--text-primary, #fff);
  }
`;
document.head.appendChild(modeSelectorStyles);

