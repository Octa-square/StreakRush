// ========================================
// STREAKRUSH - MILESTONE CELEBRATIONS
// Celebrate achievements & show progress
// ========================================

const Milestones = {
  // Storage keys for tracking which promos have been seen
  KEYS: {
    HALFWAY_SEEN: 'streakrush_halfway_seen',
    FIRST_GOLD_SEEN: 'streakrush_first_gold_seen',
    STREAK_5_SEEN: 'streakrush_streak_5_seen',
    STREAK_10_SEEN: 'streakrush_streak_10_seen',
    STREAK_25_SEEN: 'streakrush_streak_25_seen',
    FIRST_PERFECT_SEEN: 'streakrush_first_perfect_seen'
  },

  // Check if a milestone has been seen
  hasSeen: (key) => {
    return localStorage.getItem(key) === 'true';
  },

  // Mark a milestone as seen
  markSeen: (key) => {
    localStorage.setItem(key, 'true');
  },

  // Show a milestone modal
  showModal: (content, autoClose = false) => {
    let modal = document.getElementById('milestone-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'milestone-modal';
      modal.className = 'milestone-modal';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="milestone-content">
        ${content}
      </div>
    `;
    modal.classList.add('active');

    // Play celebration sound
    if (typeof Sounds !== 'undefined' && Sounds.achievement) {
      Sounds.achievement();
    } else if (typeof Sounds !== 'undefined') {
      Sounds.correct();
    }

    if (autoClose) {
      setTimeout(() => Milestones.closeModal(), 3000);
    }
  },

  // Close the modal
  closeModal: () => {
    const modal = document.getElementById('milestone-modal');
    if (modal) {
      modal.classList.remove('active');
    }
  },

  // Check and trigger milestones after game completion
  checkMilestones: (results) => {
    const user = Storage.getUser();
    const completedGames = UnlockSystem.getHighestUnlocked() - 1;

    // Priority order - only show one milestone per game
    
    // 1. Halfway to premium (Game 10)
    if (completedGames === 10 && !Milestones.hasSeen(Milestones.KEYS.HALFWAY_SEEN)) {
      setTimeout(() => Milestones.showHalfwayModal(), 1500);
      Milestones.markSeen(Milestones.KEYS.HALFWAY_SEEN);
      return;
    }

    // 2. First Gold mastery
    if (results.tier === 'GOLD' && !Milestones.hasSeen(Milestones.KEYS.FIRST_GOLD_SEEN)) {
      setTimeout(() => Milestones.showFirstGoldModal(results.percentage), 1500);
      Milestones.markSeen(Milestones.KEYS.FIRST_GOLD_SEEN);
      return;
    }

    // 3. First Perfect (Platinum)
    if (results.tier === 'PLATINUM' && !Milestones.hasSeen(Milestones.KEYS.FIRST_PERFECT_SEEN)) {
      setTimeout(() => Milestones.showFirstPerfectModal(results.game), 1500);
      Milestones.markSeen(Milestones.KEYS.FIRST_PERFECT_SEEN);
      return;
    }

    // 4. Win streaks (5, 10, 25)
    if (results.streak === 5 && !Milestones.hasSeen(Milestones.KEYS.STREAK_5_SEEN)) {
      setTimeout(() => Milestones.showStreakModal(5), 1500);
      Milestones.markSeen(Milestones.KEYS.STREAK_5_SEEN);
      return;
    }

    if (results.streak === 10 && !Milestones.hasSeen(Milestones.KEYS.STREAK_10_SEEN)) {
      setTimeout(() => Milestones.showStreakModal(10), 1500);
      Milestones.markSeen(Milestones.KEYS.STREAK_10_SEEN);
      return;
    }

    if (results.streak === 25 && !Milestones.hasSeen(Milestones.KEYS.STREAK_25_SEEN)) {
      setTimeout(() => Milestones.showStreakModal(25), 1500);
      Milestones.markSeen(Milestones.KEYS.STREAK_25_SEEN);
      return;
    }
  },

  // Halfway to premium modal (Game 10)
  showHalfwayModal: () => {
    Milestones.showModal(`
      <div class="milestone-icon">🎉</div>
      <h3>Halfway to Premium!</h3>
      <p class="milestone-message">You've completed <strong>10 games</strong>!</p>
      <p class="milestone-sub">10 more games until you unlock premium features.</p>
      <div class="milestone-progress">
        <div class="progress-bar">
          <div class="progress-fill" style="width: 50%"></div>
        </div>
        <span class="progress-text">10 / 20</span>
      </div>
      <button class="milestone-btn primary" onclick="Milestones.closeModal()">
        Continue Training 💪
      </button>
    `);
  },

  // First Gold mastery modal
  showFirstGoldModal: (percentage) => {
    Milestones.showModal(`
      <div class="milestone-icon gold-glow">⭐⭐⭐</div>
      <h3>First Gold Mastery!</h3>
      <p class="milestone-message">You scored <strong>${percentage}%</strong> - excellent work!</p>
      <p class="milestone-sub">Premium users compete for Gold on <strong>345 more games</strong>.</p>
      <div class="milestone-buttons">
        <button class="milestone-btn secondary" onclick="Milestones.closeModal()">
          Keep Training
        </button>
        <button class="milestone-btn primary" onclick="Milestones.showPremiumInfo()">
          Learn More
        </button>
      </div>
    `);
  },

  // First Perfect score modal
  showFirstPerfectModal: (game) => {
    Milestones.showModal(`
      <div class="milestone-icon platinum-glow">💎</div>
      <h3>PERFECT SCORE!</h3>
      <p class="milestone-message">100% on <strong>${game.name}</strong>!</p>
      <p class="milestone-sub">You've achieved Platinum mastery - the highest tier!</p>
      <p class="milestone-note">Only 2% of players achieve this.</p>
      <button class="milestone-btn primary" onclick="Milestones.closeModal()">
        Amazing! 🎉
      </button>
    `);
  },

  // Win streak modal
  showStreakModal: (streak) => {
    const messages = {
      5: {
        title: '5-Game Win Streak!',
        message: "You're on fire! Keep your momentum going.",
        sub: 'Premium users have achieved streaks of 50+ games.',
        emoji: '🔥'
      },
      10: {
        title: '10-Game Win Streak!',
        message: "Incredible consistency! Your brain is getting sharper.",
        sub: 'Top 15% of players reach this milestone.',
        emoji: '🔥🔥'
      },
      25: {
        title: '25-Game Win Streak!',
        message: "Legendary performance! You're in elite territory.",
        sub: 'Only 3% of players achieve this streak.',
        emoji: '🔥🔥🔥'
      }
    };

    const data = messages[streak] || messages[5];

    Milestones.showModal(`
      <div class="milestone-icon fire-glow">${data.emoji}</div>
      <h3>${data.title}</h3>
      <p class="milestone-message">${data.message}</p>
      <p class="milestone-sub">${data.sub}</p>
      <div class="streak-display">
        <span class="streak-number">${streak}</span>
        <span class="streak-label">Game Streak</span>
      </div>
      <button class="milestone-btn primary" onclick="Milestones.closeModal()">
        Keep Going! 💪
      </button>
    `);
  },

  // Show premium info from milestone
  showPremiumInfo: () => {
    Milestones.closeModal();
    if (typeof CommitmentScreen !== 'undefined') {
      CommitmentScreen.show();
    }
  },

  // Reset all milestone flags (for testing)
  resetAll: () => {
    Object.values(Milestones.KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    console.log('All milestone flags reset');
  }
};

// Add CSS for milestone modals
const milestoneStyles = document.createElement('style');
milestoneStyles.textContent = `
  .milestone-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2500;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    padding: 20px;
  }

  .milestone-modal.active {
    opacity: 1;
    visibility: visible;
  }

  .milestone-content {
    background: linear-gradient(180deg, #1a1a2e 0%, #0d0d1a 100%);
    border-radius: 24px;
    padding: 35px 25px;
    max-width: 360px;
    width: 100%;
    text-align: center;
    animation: celebrateIn 0.5s ease;
    border: 2px solid rgba(255, 215, 0, 0.3);
    box-shadow: 0 0 40px rgba(255, 215, 0, 0.2);
  }

  @keyframes celebrateIn {
    0% { transform: scale(0.5) rotate(-5deg); opacity: 0; }
    50% { transform: scale(1.05) rotate(2deg); }
    100% { transform: scale(1) rotate(0deg); opacity: 1; }
  }

  .milestone-icon {
    font-size: 4rem;
    margin-bottom: 15px;
    animation: bounce 0.6s ease infinite alternate;
  }

  @keyframes bounce {
    from { transform: translateY(0); }
    to { transform: translateY(-10px); }
  }

  .milestone-icon.gold-glow {
    text-shadow: 0 0 30px rgba(255, 215, 0, 0.8);
  }

  .milestone-icon.platinum-glow {
    text-shadow: 0 0 30px rgba(229, 228, 226, 0.8);
  }

  .milestone-icon.fire-glow {
    text-shadow: 0 0 30px rgba(255, 107, 53, 0.8);
  }

  .milestone-content h3 {
    font-size: 1.5rem;
    color: #fff;
    margin-bottom: 12px;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .milestone-message {
    font-size: 1.1rem;
    color: #ddd;
    margin-bottom: 8px;
  }

  .milestone-message strong {
    color: #ffd700;
  }

  .milestone-sub {
    font-size: 0.95rem;
    color: #888;
    margin-bottom: 20px;
  }

  .milestone-sub strong {
    color: #22c55e;
  }

  .milestone-note {
    font-size: 0.85rem;
    color: #666;
    font-style: italic;
    margin-bottom: 20px;
  }

  .milestone-progress {
    margin: 20px 0;
  }

  .milestone-progress .progress-bar {
    height: 12px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 6px;
    overflow: hidden;
    margin-bottom: 8px;
  }

  .milestone-progress .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #22c55e, #4ade80);
    border-radius: 6px;
    transition: width 0.5s ease;
  }

  .milestone-progress .progress-text {
    font-size: 0.9rem;
    color: #aaa;
  }

  .streak-display {
    margin: 20px 0;
    padding: 15px;
    background: rgba(255, 107, 53, 0.15);
    border-radius: 16px;
    border: 1px solid rgba(255, 107, 53, 0.3);
  }

  .streak-number {
    display: block;
    font-size: 3rem;
    font-weight: 800;
    color: #ff6b35;
  }

  .streak-label {
    font-size: 0.9rem;
    color: #888;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .milestone-buttons {
    display: flex;
    gap: 10px;
    margin-top: 20px;
  }

  .milestone-btn {
    flex: 1;
    padding: 14px 20px;
    border: none;
    border-radius: 25px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .milestone-btn.primary {
    background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
    color: white;
  }

  .milestone-btn.primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(34, 197, 94, 0.4);
  }

  .milestone-btn.secondary {
    background: rgba(255, 255, 255, 0.1);
    color: #aaa;
  }

  .milestone-btn.secondary:hover {
    background: rgba(255, 255, 255, 0.15);
    color: #fff;
  }
`;
document.head.appendChild(milestoneStyles);

