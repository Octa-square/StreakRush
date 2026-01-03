// ========================================
// STREAKRUSH - THEME SYSTEM
// 4 Different Themes
// ========================================

const Themes = {
  current: 'fire',
  
  themes: {
    fire: {
      name: 'Fire Rush 🔥',
      primary: '#0d0d1a',
      secondary: '#1a1a2e',
      card: '#1f1f3a',
      accent1: '#ff6b35',
      accent2: '#f72585',
      gradient: 'linear-gradient(135deg, #ff6b35 0%, #f72585 100%)',
      glow: 'rgba(255, 107, 53, 0.4)'
    },
    ocean: {
      name: 'Ocean Wave 🌊',
      primary: '#0a1628',
      secondary: '#0f2540',
      card: '#163050',
      accent1: '#00d4ff',
      accent2: '#0099cc',
      gradient: 'linear-gradient(135deg, #00d4ff 0%, #0099cc 100%)',
      glow: 'rgba(0, 212, 255, 0.4)'
    },
    forest: {
      name: 'Forest Zen 🌿',
      primary: '#0d1a0d',
      secondary: '#1a2e1a',
      card: '#1f3a1f',
      accent1: '#4ade80',
      accent2: '#22c55e',
      gradient: 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)',
      glow: 'rgba(74, 222, 128, 0.4)'
    },
    galaxy: {
      name: 'Galaxy Mode 🌌',
      primary: '#0d0d1f',
      secondary: '#1a1a3a',
      card: '#2a2a5a',
      accent1: '#a855f7',
      accent2: '#7c3aed',
      gradient: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)',
      glow: 'rgba(168, 85, 247, 0.4)'
    }
  },
  
  // Initialize theme
  init: () => {
    const saved = localStorage.getItem('streakrush_theme');
    if (saved && Themes.themes[saved]) {
      Themes.current = saved;
    }
    Themes.apply(Themes.current);
  },
  
  // Apply a theme
  apply: (themeName) => {
    const theme = Themes.themes[themeName];
    if (!theme) return;
    
    Themes.current = themeName;
    localStorage.setItem('streakrush_theme', themeName);
    
    const root = document.documentElement;
    root.style.setProperty('--bg-primary', theme.primary);
    root.style.setProperty('--bg-secondary', theme.secondary);
    root.style.setProperty('--bg-card', theme.card);
    root.style.setProperty('--accent-orange', theme.accent1);
    root.style.setProperty('--accent-pink', theme.accent2);
    root.style.setProperty('--gradient-fire', theme.gradient);
    root.style.setProperty('--shadow-glow-orange', `0 0 30px ${theme.glow}`);
    
    // Update body background
    document.body.style.background = theme.primary;
  },
  
  // Get theme list for UI
  getList: () => {
    return Object.keys(Themes.themes).map(key => ({
      id: key,
      name: Themes.themes[key].name,
      active: key === Themes.current
    }));
  },
  
  // Cycle to next theme
  next: () => {
    const keys = Object.keys(Themes.themes);
    const currentIndex = keys.indexOf(Themes.current);
    const nextIndex = (currentIndex + 1) % keys.length;
    Themes.apply(keys[nextIndex]);
    return Themes.themes[keys[nextIndex]].name;
  }
};

