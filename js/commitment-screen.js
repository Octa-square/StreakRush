// ========================================
// STREAKRUSH - COMMITMENT SCREEN
// Shows brain improvement & premium offer
// ========================================

const CommitmentScreen = {
  
  // Calculate average score for a range of games
  calculateAverageScore: (startGame, endGame) => {
    const scores = Storage.getGameScores();
    let total = 0;
    let count = 0;
    
    for (let i = startGame; i <= endGame; i++) {
      if (scores[i] && scores[i].percentage) {
        total += scores[i].percentage;
        count++;
      }
    }
    
    return count > 0 ? Math.round(total / count) : 0;
  },
  
  // Calculate reaction time improvement
  calculateReactionImprovement: () => {
    const reactionTimes = Storage.getAllReactionTimes ? Storage.getAllReactionTimes() : {};
    const allTimes = [];
    
    Object.values(reactionTimes).forEach(gameHistory => {
      if (Array.isArray(gameHistory)) {
        gameHistory.forEach(entry => {
          if (entry.time) allTimes.push(entry.time);
        });
      }
    });
    
    if (allTimes.length < 2) return 0;
    
    // Compare first half vs second half
    const mid = Math.floor(allTimes.length / 2);
    const firstHalf = allTimes.slice(0, mid);
    const secondHalf = allTimes.slice(mid);
    
    const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
    
    return Math.max(0, Math.round(firstAvg - secondAvg));
  },
  
  // Calculate user percentile (simulated for MVP)
  calculateUserPercentile: (avgScore) => {
    // Simulated percentile based on score
    if (avgScore >= 95) return 1;
    if (avgScore >= 90) return 5;
    if (avgScore >= 85) return 10;
    if (avgScore >= 80) return 15;
    if (avgScore >= 75) return 25;
    if (avgScore >= 70) return 35;
    return 50;
  },
  
  // Get improvement data
  getImprovementData: () => {
    const firstFiveAvg = CommitmentScreen.calculateAverageScore(1, 5);
    const lastFiveAvg = CommitmentScreen.calculateAverageScore(11, 15);
    const improvement = Math.max(0, lastFiveAvg - firstFiveAvg);
    const reactionImprovement = CommitmentScreen.calculateReactionImprovement();
    const topPercentile = CommitmentScreen.calculateUserPercentile(lastFiveAvg);
    
    return {
      firstFiveAvg,
      lastFiveAvg,
      improvement,
      reactionImprovement,
      topPercentile
    };
  },
  
  // Show the commitment screen
  show: () => {
    const user = Storage.getUser();
    const data = CommitmentScreen.getImprovementData();
    
    // Get or create modal
    let modal = document.getElementById('commitment-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'commitment-modal';
      modal.className = 'commitment-modal';
      document.body.appendChild(modal);
    }
    
    modal.innerHTML = `
      <div class="commitment-content">
        <div class="commitment-header">
          <div class="brain-icon">🧠</div>
          <h2>YOUR BRAIN HAS IMPROVED</h2>
          <p class="subtitle">15 games completed • Real progress made</p>
        </div>
        
        <div class="improvement-stats">
          <div class="improvement-stat">
            <div class="stat-icon">📈</div>
            <div class="stat-value ${data.improvement > 0 ? 'positive' : ''}">
              ${data.improvement > 0 ? '+' : ''}${data.improvement}%
            </div>
            <div class="stat-label">Score Improvement</div>
          </div>
          <div class="improvement-stat">
            <div class="stat-icon">⚡</div>
            <div class="stat-value ${data.reactionImprovement > 0 ? 'positive' : ''}">
              ${data.reactionImprovement > 0 ? '-' : ''}${data.reactionImprovement}ms
            </div>
            <div class="stat-label">Faster Reactions</div>
          </div>
          <div class="improvement-stat">
            <div class="stat-icon">🏆</div>
            <div class="stat-value">Top ${data.topPercentile}%</div>
            <div class="stat-label">Of All Players</div>
          </div>
        </div>
        
        <div class="unlock-message">
          <p>You've mastered the foundations.</p>
          <p class="highlight"><strong>45 more brain challenges await.</strong></p>
        </div>
        
        <div class="premium-preview-section">
          <h4>🔓 Unlock These Next:</h4>
          <div class="preview-games">
            ${CommitmentScreen.getPreviewGames()}
          </div>
          <p class="more-games">...and 39 more challenging games</p>
        </div>
        
        <div class="pricing-section">
          <div class="pricing-card">
            <div class="best-value-badge">BEST VALUE</div>
            <div class="price-amount">$19.99</div>
            <div class="price-type">One-Time Payment</div>
            <ul class="features-list">
              <li>✅ Unlock all 60 games</li>
              <li>✅ All memory categories mastered</li>
              <li>✅ Challenge Mode (2x points)</li>
              <li>✅ Lifetime access</li>
              <li>✅ All future updates</li>
            </ul>
            <button class="unlock-button" id="purchase-premium-btn">
              <span class="button-icon">🧠</span>
              <span>UNLOCK FULL POTENTIAL</span>
            </button>
          </div>
        </div>
        
        <div class="continue-free-section">
          <button class="continue-free-btn" id="continue-free-btn">
            I want to replay free games first
          </button>
          <p class="unlock-later-note">You can unlock premium anytime from Settings</p>
        </div>
        
        <div class="social-proof">
          <div class="review">
            <div class="stars">⭐⭐⭐⭐⭐</div>
            <p>"My memory has noticeably improved after just 2 weeks!"</p>
            <span class="reviewer">— Sarah K.</span>
          </div>
          <div class="review">
            <div class="stars">⭐⭐⭐⭐⭐</div>
            <p>"Best brain game app I've ever used. Worth every penny."</p>
            <span class="reviewer">— Mike T.</span>
          </div>
        </div>
      </div>
    `;
    
    modal.classList.add('active');
    
    // Add event listeners
    document.getElementById('purchase-premium-btn')?.addEventListener('click', () => {
      Sounds.click();
      CommitmentScreen.purchasePremium();
    });
    
    document.getElementById('continue-free-btn')?.addEventListener('click', () => {
      Sounds.click();
      CommitmentScreen.continueFree();
    });
  },
  
  // Get preview games HTML (show first 6 premium games: 16-21)
  getPreviewGames: () => {
    const premiumGames = typeof GAMES !== 'undefined' ? GAMES.slice(15, 21) : [];
    
    return premiumGames.map(game => `
      <div class="preview-game">
        <span class="preview-icon">${game.icon}</span>
        <span class="preview-name">${game.name}</span>
      </div>
    `).join('');
  },
  
  // Handle premium purchase (placeholder for actual payment)
  purchasePremium: () => {
    if (Storage.DEMO_MODE) {
      // In demo mode, just unlock
      Storage.updateUser({ isPremium: true });
      UI.showToast('🎉 Premium unlocked! (Demo Mode)', 'success');
      CommitmentScreen.hide();
      App.renderHomeScreen();
    } else {
      // Show coming soon for real payment
      UI.showToast('💳 Premium payment coming soon!', 'info');
    }
  },
  
  // Continue with free games
  continueFree: () => {
    CommitmentScreen.hide();
    UI.showToast('No rush. Enjoy replaying your completed games!', 'info');
    App.renderHomeScreen();
  },
  
  // Hide the commitment screen
  hide: () => {
    const modal = document.getElementById('commitment-modal');
    if (modal) {
      modal.classList.remove('active');
    }
  }
};

// Add CSS for commitment screen
const commitmentStyles = document.createElement('style');
commitmentStyles.textContent = `
  .commitment-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.95);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
    opacity: 0;
    visibility: hidden;
    transition: all 0.4s ease;
    overflow-y: auto;
    padding: 20px;
  }
  
  .commitment-modal.active {
    opacity: 1;
    visibility: visible;
  }
  
  .commitment-content {
    background: linear-gradient(180deg, #1a1a2e 0%, #0d0d1a 100%);
    border-radius: 24px;
    max-width: 420px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    animation: slideUp 0.5s ease;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .commitment-header {
    text-align: center;
    padding: 30px 20px 20px;
    background: linear-gradient(180deg, rgba(114, 9, 183, 0.2) 0%, transparent 100%);
  }
  
  .commitment-header .brain-icon {
    font-size: 3.5rem;
    animation: pulse 2s infinite;
  }
  
  .commitment-header h2 {
    font-size: 1.5rem;
    margin: 15px 0 8px;
    background: linear-gradient(90deg, #7209b7, #f72585);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .commitment-header .subtitle {
    color: #888;
    font-size: 0.95rem;
  }
  
  .improvement-stats {
    display: flex;
    justify-content: space-around;
    padding: 20px;
    gap: 10px;
  }
  
  .improvement-stat {
    text-align: center;
    flex: 1;
    padding: 15px 10px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 16px;
  }
  
  .improvement-stat .stat-icon {
    font-size: 1.5rem;
    margin-bottom: 8px;
  }
  
  .improvement-stat .stat-value {
    font-size: 1.3rem;
    font-weight: 700;
    color: #fff;
  }
  
  .improvement-stat .stat-value.positive {
    color: #22c55e;
  }
  
  .improvement-stat .stat-label {
    font-size: 0.75rem;
    color: #888;
    margin-top: 4px;
  }
  
  .unlock-message {
    text-align: center;
    padding: 15px 25px;
  }
  
  .unlock-message p {
    color: #aaa;
    font-size: 1rem;
    margin: 5px 0;
  }
  
  .unlock-message .highlight {
    color: #ffd700;
    font-size: 1.15rem;
  }
  
  .premium-preview-section {
    padding: 15px 20px;
  }
  
  .premium-preview-section h4 {
    text-align: center;
    color: #fff;
    margin-bottom: 12px;
    font-size: 1rem;
  }
  
  .preview-games {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
  }
  
  .preview-game {
    background: rgba(114, 9, 183, 0.2);
    border: 1px solid rgba(114, 9, 183, 0.3);
    border-radius: 12px;
    padding: 12px 8px;
    text-align: center;
    opacity: 0.8;
  }
  
  .preview-game .preview-icon {
    font-size: 1.5rem;
    display: block;
    margin-bottom: 4px;
  }
  
  .preview-game .preview-name {
    font-size: 0.7rem;
    color: #aaa;
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .more-games {
    text-align: center;
    color: #666;
    font-size: 0.85rem;
    margin-top: 10px;
  }
  
  .pricing-section {
    padding: 20px;
  }
  
  .pricing-card {
    background: linear-gradient(135deg, rgba(114, 9, 183, 0.3) 0%, rgba(247, 37, 133, 0.2) 100%);
    border: 2px solid #7209b7;
    border-radius: 20px;
    padding: 25px 20px;
    position: relative;
    text-align: center;
  }
  
  .best-value-badge {
    position: absolute;
    top: -12px;
    left: 50%;
    transform: translateX(-50%);
    background: linear-gradient(90deg, #7209b7, #f72585);
    color: white;
    font-size: 0.7rem;
    font-weight: 700;
    padding: 5px 15px;
    border-radius: 20px;
    letter-spacing: 1px;
  }
  
  .price-amount {
    font-size: 2.5rem;
    font-weight: 800;
    color: #fff;
    margin-top: 10px;
  }
  
  .price-type {
    color: #888;
    font-size: 0.9rem;
    margin-bottom: 15px;
  }
  
  .features-list {
    list-style: none;
    padding: 0;
    margin: 0 0 20px;
    text-align: left;
  }
  
  .features-list li {
    color: #ccc;
    font-size: 0.9rem;
    padding: 6px 0;
    padding-left: 10px;
  }
  
  .unlock-button {
    width: 100%;
    background: linear-gradient(90deg, #7209b7, #f72585);
    border: none;
    color: white;
    padding: 16px;
    font-size: 1.1rem;
    font-weight: 700;
    border-radius: 30px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  
  .unlock-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(114, 9, 183, 0.4);
  }
  
  .continue-free-section {
    text-align: center;
    padding: 15px 20px 25px;
  }
  
  .continue-free-btn {
    background: none;
    border: none;
    color: #666;
    font-size: 0.95rem;
    cursor: pointer;
    padding: 10px;
    text-decoration: underline;
    transition: color 0.2s;
  }
  
  .continue-free-btn:hover {
    color: #888;
  }
  
  .unlock-later-note {
    color: #555;
    font-size: 0.8rem;
    margin-top: 8px;
  }
  
  .social-proof {
    background: rgba(255, 255, 255, 0.03);
    padding: 20px;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
  }
  
  .social-proof .review {
    margin-bottom: 15px;
    text-align: center;
  }
  
  .social-proof .review:last-child {
    margin-bottom: 0;
  }
  
  .social-proof .stars {
    font-size: 0.9rem;
    margin-bottom: 5px;
  }
  
  .social-proof .review p {
    color: #aaa;
    font-size: 0.9rem;
    font-style: italic;
    margin: 0;
  }
  
  .social-proof .reviewer {
    color: #666;
    font-size: 0.8rem;
  }
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }
  
  @keyframes slideUp {
    from { transform: translateY(50px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
`;
document.head.appendChild(commitmentStyles);

