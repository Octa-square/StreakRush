// ============================================================================
// COGNIXIS - INTERNATIONALIZATION (i18n) MANAGER
// ============================================================================

const I18n = {
  // Current language code
  currentLanguage: 'en',
  
  // Available languages
  languages: {
    en: { name: 'English', flag: '🇬🇧', native: 'English' },
    es: { name: 'Spanish', flag: '🇪🇸', native: 'Español' },
    fr: { name: 'French', flag: '🇫🇷', native: 'Français' },
    de: { name: 'German', flag: '🇩🇪', native: 'Deutsch' },
    pt: { name: 'Portuguese', flag: '🇧🇷', native: 'Português' },
    it: { name: 'Italian', flag: '🇮🇹', native: 'Italiano' },
    ja: { name: 'Japanese', flag: '🇯🇵', native: '日本語' },
    ko: { name: 'Korean', flag: '🇰🇷', native: '한국어' },
    zh: { name: 'Chinese', flag: '🇨🇳', native: '中文' },
    ar: { name: 'Arabic', flag: '🇸🇦', native: 'العربية' }
  },
  
  // Current translations object
  translations: null,
  
  // Listeners for language changes
  listeners: [],
  
  // Initialize i18n system
  init: () => {
    // Check for saved language preference
    const saved = localStorage.getItem('cognixis_language');
    
    if (saved && I18n.languages[saved]) {
      I18n.currentLanguage = saved;
    } else {
      // Detect browser language
      const browserLang = (navigator.language || navigator.userLanguage || 'en').split('-')[0];
      if (I18n.languages[browserLang]) {
        I18n.currentLanguage = browserLang;
      }
    }
    
    // Load translations
    I18n.loadLanguage(I18n.currentLanguage);
    
    // Set document direction
    I18n.updateDirection();
    
    console.log(`[i18n] Initialized with language: ${I18n.currentLanguage}`);
  },
  
  // Load language translations
  loadLanguage: (langCode) => {
    // Map language code to global variable
    const langMap = {
      en: window.LANG_EN,
      es: window.LANG_ES,
      fr: window.LANG_FR,
      de: window.LANG_DE,
      pt: window.LANG_PT,
      it: window.LANG_IT,
      ja: window.LANG_JA,
      ko: window.LANG_KO,
      zh: window.LANG_ZH,
      ar: window.LANG_AR
    };
    
    I18n.translations = langMap[langCode] || window.LANG_EN || I18n.getDefaultTranslations();
  },
  
  // Get default translations if none loaded
  getDefaultTranslations: () => ({
    meta: { appName: 'CogniXis', direction: 'ltr' },
    common: { beginChallenge: 'BEGIN CHALLENGE' },
    nav: { home: 'Home', stats: 'Stats', ranks: 'Ranks', me: 'Me' }
  }),
  
  // Get translation by key path (e.g., "nav.home")
  t: (keyPath, params = {}) => {
    if (!I18n.translations) {
      I18n.loadLanguage(I18n.currentLanguage);
    }
    
    const keys = keyPath.split('.');
    let value = I18n.translations;
    
    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        // Key not found, return the key path
        console.warn(`[i18n] Translation key not found: ${keyPath}`);
        return keyPath;
      }
    }
    
    // Replace parameters in translation string
    if (typeof value === 'string' && Object.keys(params).length > 0) {
      return value.replace(/\{(\w+)\}/g, (match, key) => {
        return params[key] !== undefined ? params[key] : match;
      });
    }
    
    return value;
  },
  
  // Change language
  changeLanguage: (langCode) => {
    if (!I18n.languages[langCode]) {
      console.error(`[i18n] Language not supported: ${langCode}`);
      return false;
    }
    
    I18n.currentLanguage = langCode;
    localStorage.setItem('cognixis_language', langCode);
    
    // Load new translations
    I18n.loadLanguage(langCode);
    
    // Update document direction for RTL languages
    I18n.updateDirection();
    
    // Notify all listeners
    I18n.notifyListeners();
    
    console.log(`[i18n] Language changed to: ${langCode}`);
    return true;
  },
  
  // Update document direction for RTL languages
  updateDirection: () => {
    const direction = I18n.translations?.meta?.direction || 'ltr';
    document.documentElement.dir = direction;
    document.documentElement.lang = I18n.currentLanguage;
    
    if (direction === 'rtl') {
      document.body.classList.add('rtl');
    } else {
      document.body.classList.remove('rtl');
    }
  },
  
  // Get current language code
  getCurrentLanguage: () => I18n.currentLanguage,
  
  // Get current language info
  getCurrentLanguageInfo: () => I18n.languages[I18n.currentLanguage],
  
  // Get all available languages
  getAvailableLanguages: () => {
    return Object.keys(I18n.languages).map(code => ({
      code,
      ...I18n.languages[code],
      current: code === I18n.currentLanguage
    }));
  },
  
  // Subscribe to language changes
  onLanguageChange: (callback) => {
    I18n.listeners.push(callback);
    
    // Return unsubscribe function
    return () => {
      I18n.listeners = I18n.listeners.filter(cb => cb !== callback);
    };
  },
  
  // Notify all listeners
  notifyListeners: () => {
    I18n.listeners.forEach(callback => {
      try {
        callback(I18n.currentLanguage);
      } catch (e) {
        console.error('[i18n] Listener error:', e);
      }
    });
  },
  
  // Get a random quote
  getRandomQuote: () => {
    const quotes = I18n.t('quotes');
    if (Array.isArray(quotes) && quotes.length > 0) {
      return quotes[Math.floor(Math.random() * quotes.length)];
    }
    return { text: "Train your brain!", author: "CogniXis" };
  },
  
  // Format number according to locale
  formatNumber: (number) => {
    try {
      return new Intl.NumberFormat(I18n.currentLanguage).format(number);
    } catch (e) {
      return number.toString();
    }
  },
  
  // Show language selector modal
  showLanguageSelector: () => {
    const languages = I18n.getAvailableLanguages();
    
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.id = 'language-modal';
    modal.innerHTML = `
      <div class="language-selector-modal">
        <div class="language-modal-header">
          <h2>🌍 ${I18n.t('settings.selectLanguage')}</h2>
          <button class="close-language-btn" onclick="I18n.closeLanguageSelector()">✕</button>
        </div>
        
        <div class="language-list">
          ${languages.map(lang => `
            <button 
              class="language-option ${lang.current ? 'active' : ''}"
              onclick="I18n.selectLanguage('${lang.code}')"
            >
              <span class="language-flag">${lang.flag}</span>
              <div class="language-info">
                <span class="language-native">${lang.native}</span>
                <span class="language-english">${lang.name}</span>
              </div>
              ${lang.current ? '<span class="language-check">✓</span>' : ''}
            </button>
          `).join('')}
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close on backdrop click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        I18n.closeLanguageSelector();
      }
    });
  },
  
  // Close language selector
  closeLanguageSelector: () => {
    const modal = document.getElementById('language-modal');
    if (modal) {
      modal.remove();
    }
  },
  
  // Select a language from the modal
  selectLanguage: (langCode) => {
    const success = I18n.changeLanguage(langCode);
    
    if (success) {
      I18n.closeLanguageSelector();
      
      // Show success toast
      if (typeof UI !== 'undefined' && UI.showToast) {
        UI.showToast(`${I18n.languages[langCode].flag} ${I18n.t('messages.languageChanged')}`, 'success');
      }
      
      // Refresh UI
      if (typeof App !== 'undefined' && App.renderHomeScreen) {
        App.renderHomeScreen();
      }
    }
  }
};

// Auto-initialize when loaded
if (typeof window !== 'undefined') {
  window.I18n = I18n;
  
  // Initialize after all language files are loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', I18n.init);
  } else {
    // DOM already loaded, but wait for language files
    setTimeout(I18n.init, 100);
  }
}

