// ========================================
// STREAKRUSH - STATS & BRAIN PROFILE
// Memory performance analytics
// ========================================

const Stats = {
  // Get trend icon
  getTrendIcon: (trend) => {
    switch(trend) {
      case 'improving': return '📈';
      case 'stable': return '➡️';
      case 'declining': return '📉';
      default: return '—';
    }
  },
  
  // Get strongest skill from profile
  getStrongestSkill: (profile) => {
    const entries = Object.entries(profile);
    if (entries.length === 0) return 'Play more games!';
    
    entries.sort((a, b) => b[1].average - a[1].average);
    const strongest = entries[0];
    return `${strongest[1].emoji} ${strongest[0]} (${strongest[1].average}%)`;
  },
  
  // Get weakest skill from profile
  getWeakestSkill: (profile) => {
    const entries = Object.entries(profile);
    if (entries.length === 0) return 'Play more games!';
    
    entries.sort((a, b) => a[1].average - b[1].average);
    const weakest = entries[0];
    return `${weakest[1].emoji} ${weakest[0]} (${weakest[1].average}%)`;
  },
  
  // Get mastery breakdown from scores
  getMasteryBreakdown: () => {
    const scores = JSON.parse(localStorage.getItem('streakrush_game_scores') || '{}');
    const values = Object.values(scores);
    
    return {
      platinum: values.filter(s => s.tier === 'PLATINUM').length,
      gold: values.filter(s => s.tier === 'GOLD').length,
      silver: values.filter(s => s.tier === 'SILVER').length,
      bronze: values.filter(s => s.tier === 'BRONZE').length,
      total: values.length
    };
  },
  
  // Render stats page content
  render: () => {
    const user = Storage.getUser();
    const scores = JSON.parse(localStorage.getItem('streakrush_game_scores') || '{}');
    const memoryProfile = Storage.getMemoryProfile();
    const brainScore = Storage.getBrainScore();
    const mastery = Stats.getMasteryBreakdown();
    
    const totalGames = Object.keys(scores).length;
    const averageScore = totalGames > 0 
      ? Math.round(Object.values(scores).reduce((sum, s) => sum + s.percentage, 0) / totalGames)
      : 0;
    
    const passedGames = Object.values(scores).filter(s => s.percentage >= 70).length;
    const passRate = totalGames > 0 ? Math.round((passedGames / totalGames) * 100) : 0;
    
    // Update brain score section
    const brainEmoji = document.getElementById('stats-brain-emoji');
    const brainScoreEl = document.getElementById('stats-brain-score');
    const brainLevel = document.getElementById('stats-brain-level');
    const brainFill = document.getElementById('stats-brain-fill');
    
    if (brainEmoji) brainEmoji.textContent = brainScore.emoji;
    if (brainScoreEl) brainScoreEl.textContent = brainScore.score;
    if (brainLevel) brainLevel.textContent = brainScore.level;
    if (brainFill) brainFill.style.width = `${brainScore.score}%`;
    
    // Update overview stats
    document.getElementById('stats-total-games').textContent = totalGames;
    document.getElementById('stats-avg-score').textContent = `${averageScore}%`;
    document.getElementById('stats-best-streak').textContent = user.bestStreak || 0;
    document.getElementById('stats-pass-rate').textContent = `${passRate}%`;
    
    // Render memory profile
    const profileContainer = document.getElementById('stats-memory-profile');
    const profileEmpty = document.getElementById('stats-memory-empty');
    
    const profileEntries = Object.entries(memoryProfile);
    
    if (profileEntries.length === 0) {
      profileEmpty.style.display = 'block';
      profileContainer.innerHTML = '';
    } else {
      profileEmpty.style.display = 'none';
      profileContainer.innerHTML = profileEntries.map(([type, data]) => `
        <div class="memory-type-row">
          <div class="type-header">
            <span class="type-icon">${data.emoji}</span>
            <span class="type-name">${type}</span>
            <span class="type-trend">${Stats.getTrendIcon(data.trend)}</span>
            <span class="type-score">${data.average}%</span>
          </div>
          <div class="type-progress-bar">
            <div class="type-progress-fill ${type.toLowerCase()}" style="width: ${data.average}%"></div>
          </div>
          <div class="type-meta">${data.gamesPlayed}/${data.totalGames} games played</div>
        </div>
      `).join('');
    }
    
    // Update mastery breakdown
    document.getElementById('mastery-platinum-count').textContent = mastery.platinum;
    document.getElementById('mastery-gold-count').textContent = mastery.gold;
    document.getElementById('mastery-silver-count').textContent = mastery.silver;
    document.getElementById('mastery-bronze-count').textContent = mastery.bronze;
    
    // Calculate mastery percentages for bars
    const maxMastery = Math.max(mastery.platinum, mastery.gold, mastery.silver, mastery.bronze, 1);
    document.getElementById('mastery-platinum-bar').style.width = `${(mastery.platinum / maxMastery) * 100}%`;
    document.getElementById('mastery-gold-bar').style.width = `${(mastery.gold / maxMastery) * 100}%`;
    document.getElementById('mastery-silver-bar').style.width = `${(mastery.silver / maxMastery) * 100}%`;
    document.getElementById('mastery-bronze-bar').style.width = `${(mastery.bronze / maxMastery) * 100}%`;
    
    // Update strengths/weaknesses
    document.getElementById('stats-strongest').textContent = Stats.getStrongestSkill(memoryProfile);
    document.getElementById('stats-weakest').textContent = Stats.getWeakestSkill(memoryProfile);
    
    // Update total stars
    const totalStars = (mastery.platinum * 4) + (mastery.gold * 3) + (mastery.silver * 2) + mastery.bronze;
    document.getElementById('stats-total-stars').textContent = totalStars;
  }
};

