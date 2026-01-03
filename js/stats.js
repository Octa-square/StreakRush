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
    const scores = JSON.parse(localStorage.getItem('cognixis_game_scores') || '{}');
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
    const scores = JSON.parse(localStorage.getItem('cognixis_game_scores') || '{}');
    const memoryProfile = Storage.getMemoryProfile();
    const brainScore = Storage.getBrainScore();
    const mastery = Stats.getMasteryBreakdown();
    
    const totalGames = Object.keys(scores).length;
    const averageScore = totalGames > 0 
      ? Math.round(Object.values(scores).reduce((sum, s) => sum + s.percentage, 0) / totalGames)
      : 0;
    
    const passedGames = Object.values(scores).filter(s => s.percentage >= 70).length;
    const passRate = totalGames > 0 ? Math.round((passedGames / totalGames) * 100) : 0;
    
    // Update brain score section (stats screen)
    const brainEmoji = document.getElementById('stats-brain-emoji');
    const brainScoreEl = document.getElementById('stats-brain-score');
    const brainLevel = document.getElementById('stats-brain-level');
    const brainFill = document.getElementById('stats-brain-fill');
    
    if (brainEmoji) brainEmoji.textContent = brainScore.emoji;
    if (brainScoreEl) brainScoreEl.textContent = brainScore.score;
    if (brainLevel) brainLevel.textContent = brainScore.level;
    if (brainFill) brainFill.style.width = `${brainScore.score}%`;
    
    // Update overview stats (stats screen)
    const statsTotal = document.getElementById('stats-total-games');
    const statsAvg = document.getElementById('stats-avg-score');
    const statsStreak = document.getElementById('stats-best-streak');
    const statsPass = document.getElementById('stats-pass-rate');
    
    if (statsTotal) statsTotal.textContent = totalGames;
    if (statsAvg) statsAvg.textContent = `${averageScore}%`;
    if (statsStreak) statsStreak.textContent = user.bestStreak || 0;
    if (statsPass) statsPass.textContent = `${passRate}%`;
    
    // Render memory profile
    const profileContainer = document.getElementById('stats-memory-profile');
    const profileEmpty = document.getElementById('stats-memory-empty');
    
    const profileEntries = Object.entries(memoryProfile);
    
    if (profileContainer && profileEmpty) {
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
    }
    
    // Update mastery breakdown (stats screen)
    const platCount = document.getElementById('mastery-platinum-count');
    const goldCount = document.getElementById('mastery-gold-count');
    const silverCount = document.getElementById('mastery-silver-count');
    const bronzeCount = document.getElementById('mastery-bronze-count');
    
    if (platCount) platCount.textContent = mastery.platinum;
    if (goldCount) goldCount.textContent = mastery.gold;
    if (silverCount) silverCount.textContent = mastery.silver;
    if (bronzeCount) bronzeCount.textContent = mastery.bronze;
    
    // Calculate mastery percentages for bars
    const maxMastery = Math.max(mastery.platinum, mastery.gold, mastery.silver, mastery.bronze, 1);
    const platBar = document.getElementById('mastery-platinum-bar');
    const goldBar = document.getElementById('mastery-gold-bar');
    const silverBar = document.getElementById('mastery-silver-bar');
    const bronzeBar = document.getElementById('mastery-bronze-bar');
    
    if (platBar) platBar.style.width = `${(mastery.platinum / maxMastery) * 100}%`;
    if (goldBar) goldBar.style.width = `${(mastery.gold / maxMastery) * 100}%`;
    if (silverBar) silverBar.style.width = `${(mastery.silver / maxMastery) * 100}%`;
    if (bronzeBar) bronzeBar.style.width = `${(mastery.bronze / maxMastery) * 100}%`;
    
    // Update strengths/weaknesses (stats screen)
    const strongest = document.getElementById('stats-strongest');
    const weakest = document.getElementById('stats-weakest');
    if (strongest) strongest.textContent = Stats.getStrongestSkill(memoryProfile);
    if (weakest) weakest.textContent = Stats.getWeakestSkill(memoryProfile);
    
    // Update total stars
    const totalStars = (mastery.platinum * 4) + (mastery.gold * 3) + (mastery.silver * 2) + mastery.bronze;
    const totalStarsEl = document.getElementById('stats-total-stars');
    if (totalStarsEl) totalStarsEl.textContent = totalStars;
    
    // ========================================
    // UPDATE RANKS SCREEN STATS (merged view)
    // ========================================
    
    // Brain score in ranks
    const ranksBrainEmoji = document.getElementById('ranks-brain-emoji');
    const ranksBrainScore = document.getElementById('ranks-brain-score');
    const ranksBrainLevel = document.getElementById('ranks-brain-level');
    const ranksBrainFill = document.getElementById('ranks-brain-fill');
    
    if (ranksBrainEmoji) ranksBrainEmoji.textContent = brainScore.emoji;
    if (ranksBrainScore) ranksBrainScore.textContent = brainScore.score;
    if (ranksBrainLevel) ranksBrainLevel.textContent = brainScore.level;
    if (ranksBrainFill) ranksBrainFill.style.width = `${brainScore.score}%`;
    
    // Overview stats in ranks
    const ranksTotal = document.getElementById('ranks-total-games');
    const ranksAvg = document.getElementById('ranks-avg-score');
    const ranksStreak = document.getElementById('ranks-best-streak');
    const ranksPass = document.getElementById('ranks-pass-rate');
    
    if (ranksTotal) ranksTotal.textContent = totalGames;
    if (ranksAvg) ranksAvg.textContent = `${averageScore}%`;
    if (ranksStreak) ranksStreak.textContent = user.bestStreak || 0;
    if (ranksPass) ranksPass.textContent = `${passRate}%`;
    
    // Strengths in ranks
    const ranksStrongest = document.getElementById('ranks-strongest');
    const ranksWeakest = document.getElementById('ranks-weakest');
    if (ranksStrongest) ranksStrongest.textContent = Stats.getStrongestSkill(memoryProfile);
    if (ranksWeakest) ranksWeakest.textContent = Stats.getWeakestSkill(memoryProfile);
    
    // Mastery in ranks
    const ranksPlatinum = document.getElementById('ranks-platinum');
    const ranksGold = document.getElementById('ranks-gold');
    const ranksSilver = document.getElementById('ranks-silver');
    const ranksBronze = document.getElementById('ranks-bronze');
    
    if (ranksPlatinum) ranksPlatinum.textContent = mastery.platinum;
    if (ranksGold) ranksGold.textContent = mastery.gold;
    if (ranksSilver) ranksSilver.textContent = mastery.silver;
    if (ranksBronze) ranksBronze.textContent = mastery.bronze;
  }
};

