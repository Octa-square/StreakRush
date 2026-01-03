// ========================================
// STREAKRUSH - ONBOARDING FLOW
// Welcome new users with 3-screen intro
// ========================================

const Onboarding = {
  STORAGE_KEY: 'streakrush_onboarding_complete',
  currentScreen: 0,
  
  screens: [
    {
      id: 'welcome',
      title: '🧠 Train Your Brain',
      content: `
        <p class="onboarding-intro">Scientifically-designed games to boost:</p>
        <ul class="benefits-list">
          <li><span class="benefit-icon">⚡</span> Reaction Speed</li>
          <li><span class="benefit-icon">🎯</span> Focus & Attention</li>
          <li><span class="benefit-icon">🧠</span> Working Memory</li>
          <li><span class="benefit-icon">🧩</span> Pattern Recognition</li>
          <li><span class="benefit-icon">🔢</span> Mental Math</li>
        </ul>
        <p class="onboarding-tagline">Your brain is a muscle. Train it daily.</p>
      `
    },
    {
      id: 'how-it-works',
      title: '📈 How It Works',
      content: `
        <div class="onboarding-steps">
          <div class="step">
            <div class="step-number">1</div>
            <div class="step-text">Play 60-second challenges</div>
          </div>
          <div class="step">
            <div class="step-number">2</div>
            <div class="step-text">Score 70%+ to unlock next game</div>
          </div>
          <div class="step">
            <div class="step-number">3</div>
            <div class="step-text">Track your cognitive improvement</div>
          </div>
          <div class="step">
            <div class="step-number">4</div>
            <div class="step-text">Compete with friends worldwide</div>
          </div>
        </div>
        <p class="onboarding-highlight">🎁 First 20 games are FREE!</p>
      `
    },
    {
      id: 'profile-setup',
      title: '👤 Set Up Your Profile',
      content: `
        <div class="profile-setup">
          <div class="setup-field">
            <label for="onboarding-name">What should we call you?</label>
            <input type="text" id="onboarding-name" placeholder="Enter your name" maxlength="20" autocomplete="off">
          </div>
          
          <div class="setup-field">
            <label>Pick your avatar:</label>
            <div class="avatar-options" id="avatar-options">
              <button class="avatar-btn selected" data-avatar="🧠">🧠</button>
              <button class="avatar-btn" data-avatar="⚡">⚡</button>
              <button class="avatar-btn" data-avatar="🎯">🎯</button>
              <button class="avatar-btn" data-avatar="🔥">🔥</button>
              <button class="avatar-btn" data-avatar="💪">💪</button>
              <button class="avatar-btn" data-avatar="🚀">🚀</button>
              <button class="avatar-btn" data-avatar="🎮">🎮</button>
              <button class="avatar-btn" data-avatar="💎">💎</button>
            </div>
          </div>
          
          <div class="setup-field">
            <label>What's your main goal?</label>
            <div class="goal-options" id="goal-options">
              <button class="goal-btn" data-goal="memory">🧠 Improve Memory</button>
              <button class="goal-btn" data-goal="speed">⚡ Get Faster</button>
              <button class="goal-btn" data-goal="compete">🏆 Beat Friends</button>
              <button class="goal-btn selected" data-goal="all">✨ All of These</button>
            </div>
          </div>
        </div>
      `
    }
  ],

  // Check if onboarding is needed
  needsOnboarding: () => {
    return !localStorage.getItem(Onboarding.STORAGE_KEY);
  },

  // Show onboarding
  show: () => {
    Onboarding.currentScreen = 0;
    Onboarding.renderScreen();
  },

  // Render current screen
  renderScreen: () => {
    const screen = Onboarding.screens[Onboarding.currentScreen];
    const isFirst = Onboarding.currentScreen === 0;
    const isLast = Onboarding.currentScreen === Onboarding.screens.length - 1;

    let modal = document.getElementById('onboarding-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'onboarding-modal';
      modal.className = 'onboarding-modal';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="onboarding-container">
        <!-- Progress Dots -->
        <div class="onboarding-progress">
          ${Onboarding.screens.map((_, i) => `
            <span class="progress-dot ${i === Onboarding.currentScreen ? 'active' : ''} ${i < Onboarding.currentScreen ? 'completed' : ''}"></span>
          `).join('')}
        </div>

        <!-- Screen Content -->
        <div class="onboarding-content" data-screen="${screen.id}">
          <h2 class="onboarding-title">${screen.title}</h2>
          <div class="onboarding-body">
            ${screen.content}
          </div>
        </div>

        <!-- Navigation -->
        <div class="onboarding-nav">
          ${!isFirst ? `
            <button class="onboarding-btn secondary" id="onboarding-back">
              ← Back
            </button>
          ` : '<div></div>'}
          <button class="onboarding-btn primary" id="onboarding-next">
            ${isLast ? 'Start Training 🔥' : 'Next →'}
          </button>
        </div>

        <!-- Skip Option -->
        ${!isLast ? `
          <button class="onboarding-skip" id="onboarding-skip">Skip intro</button>
        ` : ''}
      </div>
    `;

    modal.classList.add('active');

    // Add event listeners
    Onboarding.attachListeners();
  },

  // Attach event listeners
  attachListeners: () => {
    // Next button
    document.getElementById('onboarding-next')?.addEventListener('click', () => {
      if (typeof Sounds !== 'undefined') Sounds.click();
      Onboarding.next();
    });

    // Back button
    document.getElementById('onboarding-back')?.addEventListener('click', () => {
      if (typeof Sounds !== 'undefined') Sounds.click();
      Onboarding.previous();
    });

    // Skip button
    document.getElementById('onboarding-skip')?.addEventListener('click', () => {
      if (typeof Sounds !== 'undefined') Sounds.click();
      Onboarding.complete('Player', '🧠', 'all');
    });

    // Avatar selection
    document.querySelectorAll('.avatar-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (typeof Sounds !== 'undefined') Sounds.click();
        document.querySelectorAll('.avatar-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
      });
    });

    // Goal selection
    document.querySelectorAll('.goal-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (typeof Sounds !== 'undefined') Sounds.click();
        document.querySelectorAll('.goal-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
      });
    });
  },

  // Go to next screen
  next: () => {
    if (Onboarding.currentScreen === Onboarding.screens.length - 1) {
      // Last screen - complete onboarding
      const name = document.getElementById('onboarding-name')?.value.trim() || 'Player';
      const avatar = document.querySelector('.avatar-btn.selected')?.dataset.avatar || '🧠';
      const goal = document.querySelector('.goal-btn.selected')?.dataset.goal || 'all';

      Onboarding.complete(name, avatar, goal);
    } else {
      Onboarding.currentScreen++;
      Onboarding.renderScreen();
    }
  },

  // Go to previous screen
  previous: () => {
    if (Onboarding.currentScreen > 0) {
      Onboarding.currentScreen--;
      Onboarding.renderScreen();
    }
  },

  // Complete onboarding
  complete: (name, avatar, goal) => {
    // Save user data
    Storage.updateUser({
      displayName: name,
      avatar: avatar,
      goal: goal,
      onboardedAt: new Date().toISOString()
    });

    // Mark onboarding complete
    localStorage.setItem(Onboarding.STORAGE_KEY, 'true');

    // Hide modal
    const modal = document.getElementById('onboarding-modal');
    if (modal) {
      modal.classList.remove('active');
      setTimeout(() => modal.remove(), 300);
    }

    // Show welcome toast
    if (typeof UI !== 'undefined') {
      UI.showToast(`Welcome, ${name}! Let's train your brain 🧠`, 'success');
    }

    // Render home screen
    if (typeof App !== 'undefined' && App.renderHomeScreen) {
      App.renderHomeScreen();
    }
  },

  // Reset onboarding (for testing)
  reset: () => {
    localStorage.removeItem(Onboarding.STORAGE_KEY);
    console.log('Onboarding reset - will show on next app load');
  }
};

// Add onboarding CSS
const onboardingStyles = document.createElement('style');
onboardingStyles.textContent = `
  .onboarding-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(180deg, #0d0d1a 0%, #1a1a2e 100%);
    z-index: 10000;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }

  .onboarding-modal.active {
    opacity: 1;
    visibility: visible;
  }

  .onboarding-container {
    width: 100%;
    max-width: 400px;
    animation: fadeInUp 0.4s ease;
  }

  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .onboarding-progress {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-bottom: 30px;
  }

  .progress-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
    transition: all 0.3s ease;
  }

  .progress-dot.active {
    background: #ff6b35;
    transform: scale(1.3);
  }

  .progress-dot.completed {
    background: #22c55e;
  }

  .onboarding-content {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 24px;
    padding: 30px 25px;
    margin-bottom: 25px;
    min-height: 350px;
  }

  .onboarding-title {
    font-size: 1.8rem;
    text-align: center;
    margin-bottom: 25px;
    color: #fff;
  }

  .onboarding-body {
    color: #ccc;
  }

  .onboarding-intro {
    text-align: center;
    font-size: 1.1rem;
    margin-bottom: 20px;
    color: #aaa;
  }

  .benefits-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .benefits-list li {
    display: flex;
    align-items: center;
    padding: 12px 15px;
    margin: 8px 0;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    font-size: 1.05rem;
  }

  .benefit-icon {
    font-size: 1.3rem;
    margin-right: 12px;
  }

  .onboarding-tagline {
    text-align: center;
    font-size: 1rem;
    color: #888;
    margin-top: 20px;
    font-style: italic;
  }

  /* Steps */
  .onboarding-steps {
    margin-bottom: 20px;
  }

  .step {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 15px;
    margin: 10px 0;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 12px;
  }

  .step-number {
    width: 36px;
    height: 36px;
    background: linear-gradient(135deg, #7209b7 0%, #f72585 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 1.1rem;
    flex-shrink: 0;
  }

  .step-text {
    font-size: 1rem;
    color: #ddd;
  }

  .onboarding-highlight {
    text-align: center;
    font-size: 1.2rem;
    color: #22c55e;
    font-weight: 600;
    margin-top: 15px;
    padding: 12px;
    background: rgba(34, 197, 94, 0.1);
    border-radius: 12px;
  }

  /* Profile Setup */
  .profile-setup {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .setup-field {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .setup-field label {
    font-size: 0.95rem;
    color: #aaa;
  }

  .setup-field input {
    padding: 14px 16px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 12px;
    color: #fff;
    font-size: 1.1rem;
    outline: none;
    transition: border-color 0.2s;
  }

  .setup-field input:focus {
    border-color: #ff6b35;
  }

  .setup-field input::placeholder {
    color: #666;
  }

  .avatar-options {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .avatar-btn {
    width: 48px;
    height: 48px;
    font-size: 1.5rem;
    background: rgba(255, 255, 255, 0.1);
    border: 2px solid transparent;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .avatar-btn:hover {
    background: rgba(255, 255, 255, 0.15);
  }

  .avatar-btn.selected {
    border-color: #ff6b35;
    background: rgba(255, 107, 53, 0.2);
  }

  .goal-options {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }

  .goal-btn {
    padding: 12px 10px;
    background: rgba(255, 255, 255, 0.1);
    border: 2px solid transparent;
    border-radius: 12px;
    color: #ccc;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .goal-btn:hover {
    background: rgba(255, 255, 255, 0.15);
  }

  .goal-btn.selected {
    border-color: #22c55e;
    background: rgba(34, 197, 94, 0.2);
    color: #fff;
  }

  /* Navigation */
  .onboarding-nav {
    display: flex;
    justify-content: space-between;
    gap: 15px;
  }

  .onboarding-btn {
    flex: 1;
    padding: 16px 20px;
    border: none;
    border-radius: 25px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .onboarding-btn.primary {
    background: linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%);
    color: white;
  }

  .onboarding-btn.primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(255, 107, 53, 0.4);
  }

  .onboarding-btn.secondary {
    background: rgba(255, 255, 255, 0.1);
    color: #aaa;
  }

  .onboarding-btn.secondary:hover {
    background: rgba(255, 255, 255, 0.15);
    color: #fff;
  }

  .onboarding-skip {
    display: block;
    width: 100%;
    text-align: center;
    margin-top: 20px;
    padding: 10px;
    background: none;
    border: none;
    color: #666;
    font-size: 0.9rem;
    cursor: pointer;
    transition: color 0.2s;
  }

  .onboarding-skip:hover {
    color: #aaa;
    text-decoration: underline;
  }
`;
document.head.appendChild(onboardingStyles);

