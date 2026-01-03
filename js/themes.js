// ========================================
// COGNIXIS - 4 THEME SYSTEM
// Cyber Neural, Neon Nights, Gradient Fusion, Dark Matter
// ========================================

const Themes = {
  current: 'cyber-neural',
  
  themes: {
    'cyber-neural': {
      name: 'Cyber Neural ⚡',
      description: 'Default futuristic theme',
      primary: '#00D4FF',
      secondary: '#8B7FFF',
      accent: '#FF3D9A'
    },
    'neon-nights': {
      name: 'Neon Nights 🌃',
      description: 'Vibrant party mode',
      primary: '#00F0FF',
      secondary: '#B362FF',
      accent: '#FF1F8F'
    },
    'gradient-fusion': {
      name: 'Gradient Fusion 🌈',
      description: 'Premium gradient experience',
      primary: '#00D4FF',
      secondary: '#8B7FFF',
      accent: '#FF3D9A'
    },
    'dark-matter': {
      name: 'Dark Matter 🌑',
      description: 'Deep space aesthetic',
      primary: '#4DD0E1',
      secondary: '#7C4DFF',
      accent: '#FF4081'
    }
  },
  
  // Initialize theme
  init: () => {
    const saved = localStorage.getItem('cognixis_theme');
    if (saved && Themes.themes[saved]) {
      Themes.current = saved;
    } else {
      // Auto-detect initial theme
      Themes.autoTheme();
    }
    Themes.apply(Themes.current);
  },
  
  // Apply a theme
  apply: (themeName) => {
    if (!Themes.themes[themeName]) {
      themeName = 'cyber-neural';
    }
    
    Themes.current = themeName;
    localStorage.setItem('cognixis_theme', themeName);
    
    // Set data-theme attribute on document root
    document.documentElement.setAttribute('data-theme', themeName);
    
    // Update theme buttons in settings if they exist
    Themes.updateThemeButtons();
    
    console.log(`Theme applied: ${themeName}`);
  },
  
  // Auto-detect context and switch theme
  autoTheme: () => {
    const hour = new Date().getHours();
    const isPartyMode = window.location.pathname.includes('/party') || 
                        document.querySelector('.party-mode-screen.active');
    const isPremium = localStorage.getItem('cognixis_premium') === 'true';
    
    if (isPartyMode) {
      Themes.current = 'neon-nights'; // Energetic for parties
    } else if (isPremium) {
      Themes.current = 'gradient-fusion'; // Premium feel
    } else if (hour >= 20 || hour <= 6) {
      Themes.current = 'dark-matter'; // Night mode
    } else {
      Themes.current = 'cyber-neural'; // Default
    }
    
    return Themes.current;
  },
  
  // Update theme button states in settings
  updateThemeButtons: () => {
    const buttons = document.querySelectorAll('.settings-theme-btn');
    buttons.forEach(btn => {
      const theme = btn.getAttribute('data-theme');
      btn.classList.toggle('active', theme === Themes.current);
    });
  },
  
  // Get theme list for UI
  getList: () => {
    return Object.keys(Themes.themes).map(key => ({
      id: key,
      name: Themes.themes[key].name,
      description: Themes.themes[key].description,
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
  },
  
  // Get current theme info
  getCurrent: () => {
    return {
      id: Themes.current,
      ...Themes.themes[Themes.current]
    };
  }
};

