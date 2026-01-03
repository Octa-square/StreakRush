# COGNIXIS - COMPLETE DESIGN SPECIFICATION
## Brain Training Game App - Technical Documentation

---

## 1. APP STORE & BRANDING

### 1.1 App Identity
| Property | Value |
|----------|-------|
| **App Name** | CogniXis |
| **Short Name** | CogniXis |
| **Tagline** | "Feed Your Brain" |
| **Description** | "60-second brain games. Challenge yourself, climb the leaderboard!" |
| **App Category** | Games / Brain Training / Puzzle |

### 1.2 Logo Design

#### Primary Logo (logo.svg)
- **Format:** SVG (vector)
- **Viewbox:** 50×50
- **Design Concept:** Split brain - left hemisphere with circuit/tech nodes, right hemisphere with organic brain folds
- **Left Side Colors:**
  - Primary: `#00d4ff` (Cyan)
  - Circuit nodes: 2px radius circles
  - Connections: 1-1.5px stroke width
- **Right Side Colors:**
  - Gradient: `#7b68ee` → `#f72585` (Purple to Pink)
  - Brain folds: 1.5-2px stroke, 40-60% opacity
- **Sparkle Effects:**
  - Top-left: `#00d4ff`, 1.2px radius, 80% opacity
  - Top-right: `#f72585`, 1.5px radius, 80% opacity

#### App Icon Specifications
| Platform | Size | Format | Purpose |
|----------|------|--------|---------|
| iOS | 1024×1024 | PNG | App Store |
| iOS | 180×180 | PNG | iPhone (@3x) |
| iOS | 120×120 | PNG | iPhone (@2x) |
| iOS | 167×167 | PNG | iPad Pro |
| iOS | 152×152 | PNG | iPad |
| Android | 512×512 | PNG | Play Store |
| Android | 192×192 | PNG | Launcher (xxxhdpi) |
| Android | 144×144 | PNG | Launcher (xxhdpi) |
| Android | 96×96 | PNG | Launcher (xhdpi) |
| Android | 72×72 | PNG | Launcher (hdpi) |
| Android | 48×48 | PNG | Launcher (mdpi) |
| Web/PWA | 512×512 | SVG | Maskable icon |
| Web/PWA | 192×192 | SVG | Standard icon |

### 1.3 Color Palette - Default Theme (Cyber Neural)

#### Primary Colors
| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| Primary | `#00D4FF` | 0, 212, 255 | Buttons, highlights, links |
| Primary Hover | `#00BFE8` | 0, 191, 232 | Button hover state |
| Secondary | `#8B7FFF` | 139, 127, 255 | Gradients, secondary elements |
| Accent | `#FF3D9A` | 255, 61, 154 | Warnings, special highlights |

#### Background Colors
| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| BG Primary | `#0A0E1A` | 10, 14, 26 | Main background |
| BG Secondary | `#151B2E` | 21, 27, 46 | Cards, elevated surfaces |
| BG Tertiary | `#1F2638` | 31, 38, 56 | Nested elements |
| BG Darker | `#050810` | 5, 8, 16 | Deep backgrounds |
| BG Card | `rgba(139, 127, 255, 0.08)` | - | Card backgrounds |

#### Status Colors
| Name | Hex | Usage |
|------|-----|-------|
| Success | `#00FF88` | Correct answers, pass states |
| Warning | `#FFB800` | Cautions, timers low |
| Error | `#FF3366` | Wrong answers, fail states |

#### Text Colors
| Name | Value | Usage |
|------|-------|-------|
| Primary | `#FFFFFF` | Main text |
| Secondary | `rgba(255, 255, 255, 0.7)` | Descriptions, hints |
| Muted | `rgba(255, 255, 255, 0.5)` | Disabled, placeholder |

---

## 2. THEME SYSTEM

### 2.1 Available Themes

#### Theme 1: Cyber Neural (Default)
```css
--primary: #00D4FF;
--secondary: #8B7FFF;
--accent: #FF3D9A;
--bg-primary: #0A0E1A;
--success: #00FF88;
```

#### Theme 2: Neon Nights
```css
--primary: #FF00FF;
--secondary: #00FFFF;
--accent: #FF1F8F;
--bg-primary: #120018;
--success: #39FF14;
```

#### Theme 3: Gradient Fusion
```css
--primary: #FF6B35;
--secondary: #FFD700;
--accent: #FF3D9A;
--bg-primary: #1A1008;
--success: #00E6AC;
```

#### Theme 4: Dark Matter
```css
--primary: #00FF88;
--secondary: #00BFFF;
--accent: #1DE9B6;
--bg-primary: #051008;
--success: #00FF88;
```

---

## 3. TYPOGRAPHY

### 3.1 Font Families
| Purpose | Font Family | Fallback |
|---------|-------------|----------|
| Display/Headings | Orbitron | sans-serif |
| Body/UI | Space Grotesk | sans-serif |

### 3.2 Font Size Scale (Responsive)
| Token | Size (Clamp) | Min | Max | Usage |
|-------|--------------|-----|-----|-------|
| --font-xs | clamp(10px, 2.5vw, 12px) | 10px | 12px | Labels, badges |
| --font-sm | clamp(12px, 3vw, 14px) | 12px | 14px | Secondary text |
| --font-md | clamp(14px, 3.5vw, 16px) | 14px | 16px | Body text |
| --font-lg | clamp(16px, 4vw, 20px) | 16px | 20px | Subheadings |
| --font-xl | clamp(20px, 5vw, 28px) | 20px | 28px | Headings |
| --font-2xl | clamp(24px, 6vw, 36px) | 24px | 36px | Large headings |
| --font-3xl | clamp(32px, 8vw, 48px) | 32px | 48px | Hero text |

### 3.3 Font Weights
- 300: Light (body secondary)
- 400: Regular (body)
- 500: Medium (emphasis)
- 600: Semi-Bold (subheadings)
- 700: Bold (headings)
- 800-900: Extra Bold (display, logo)

---

## 4. SPACING SYSTEM

### 4.1 Spacing Scale (Responsive)
| Token | Size (Clamp) | Min | Max |
|-------|--------------|-----|-----|
| --spacing-xs | clamp(4px, 1vw, 8px) | 4px | 8px |
| --spacing-sm | clamp(8px, 2vw, 12px) | 8px | 12px |
| --spacing-md | clamp(12px, 3vw, 20px) | 12px | 20px |
| --spacing-lg | clamp(20px, 5vw, 32px) | 20px | 32px |
| --spacing-xl | clamp(32px, 8vw, 48px) | 32px | 48px |

### 4.2 Fixed Sizes
| Token | Value | Usage |
|-------|-------|-------|
| --nav-height | 70px | Bottom navigation bar |
| --header-height | 60px | Top header bar |
| --content-max-width | 500px | Main content container |

---

## 5. SAFE AREAS & DEVICE HANDLING

### 5.1 Safe Area Variables
```css
--safe-top: max(env(safe-area-inset-top, 0px), 20px);
--safe-bottom: max(env(safe-area-inset-bottom, 0px), 10px);
--safe-left: env(safe-area-inset-left, 0px);
--safe-right: env(safe-area-inset-right, 0px);
```

### 5.2 Dynamic Island Support (iPhone 14 Pro+)
```css
@supports (padding-top: env(safe-area-inset-top)) {
  :root {
    --safe-top: max(env(safe-area-inset-top), 47px);
  }
}
```

---

## 6. SCREEN LAYOUTS

### 6.1 Loading Screen
| Property | Value |
|----------|-------|
| Background | `var(--bg-primary)` |
| Layout | Flex, center/center |
| Logo Size | 80px (flame emoji animation) |
| Logo Text | 2.5rem, Orbitron, 900 weight |
| Letter Spacing | 3px |
| Loader Bar Width | 200px |
| Loader Bar Height | 4px |
| Loader Animation | 2s ease-in-out |

### 6.2 Home Screen Structure
```
┌─────────────────────────────────────┐
│ HEADER (60px + safe-top)            │
│ ┌─────────────────────────────────┐ │
│ │ [Logo] CogniXis        [⚙️]    │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ SCROLLABLE CONTENT                  │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 🔥 Ready to Play! 🎮            │ │ ← Streak Badge
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ Progress: Game 1 of 60          │ │ ← Journey Progress
│ │ ██████████░░░░░░░░░░░░░░░      │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ YOUR NEXT CHALLENGE             │ │
│ │        🌍                        │ │
│ │   World Capitals                 │ │
│ │                                  │ │
│ │ 📖 How to Play                   │ │
│ │ Name the capital...              │ │
│ │                                  │ │
│ │ ⏱️ 60s    🎯 70% to pass        │ │
│ │                                  │ │
│ │ ┌──────────────────────────────┐ │ │
│ │ │     BEGIN CHALLENGE          │ │ │ ← Primary Button
│ │ └──────────────────────────────┘ │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ Games                           │ │
│ │ [1][2][3][4][5][6]             │ │ ← 3×4 Grid
│ │ [7][8][9][10][11][12]          │ │
│ │       [Load More]               │ │
│ └─────────────────────────────────┘ │
│                                     │
├─────────────────────────────────────┤
│ BOTTOM NAV (70px + safe-bottom)     │
│ [🏠 Home][🎮 Party][🏆 Ranks][👤 Me] │
└─────────────────────────────────────┘
```

### 6.3 Header Specifications
| Property | Value |
|----------|-------|
| Height | `calc(60px + var(--safe-top))` |
| Position | Fixed, top: 0 |
| Background | `var(--bg-secondary)` |
| Border Bottom | `1px solid rgba(255, 255, 255, 0.05)` |
| Padding | 16px horizontal |
| Z-index | 100 |
| Layout | Flex, space-between, center |

### 6.4 App Logo (Header)
| Property | Value |
|----------|-------|
| Width | 42px |
| Height | 42px |
| Shadow | `drop-shadow(0 2px 8px rgba(255, 107, 53, 0.4))` |

### 6.5 Settings Button
| Property | Value |
|----------|-------|
| Width | 42px |
| Height | 42px |
| Border Radius | 50% |
| Background | `rgba(255, 255, 255, 0.08)` |
| Active State | `rgba(255, 255, 255, 0.15)` |
| Icon Size | 22px |

---

## 7. BOTTOM NAVIGATION

### 7.1 Structure
```html
<nav class="bottom-nav">
    <button class="nav-item active" data-screen="home">
        <span class="nav-icon">🏠</span>
        <span class="nav-label">Home</span>
    </button>
    <button class="nav-item" data-screen="friends-hub">
        <span class="nav-icon">🎮</span>
        <span class="nav-label">Party</span>
    </button>
    <button class="nav-item" data-screen="leaderboard">
        <span class="nav-icon">🏆</span>
        <span class="nav-label">Ranks</span>
    </button>
    <button class="nav-item" data-screen="profile">
        <span class="nav-icon">👤</span>
        <span class="nav-label">Me</span>
    </button>
</nav>
```

### 7.2 Specifications
| Property | Value |
|----------|-------|
| Height | `calc(70px + var(--safe-bottom))` |
| Position | Fixed, bottom: 0 |
| Background | `var(--bg-secondary)` |
| Border Top | `1px solid rgba(255, 255, 255, 0.08)` |
| Layout | Flex, space-around, center |
| Item Width | 25% each |
| Icon Size | 22px |
| Label Font Size | 10-11px |
| Active Color | `var(--primary)` |
| Inactive Color | `var(--text-muted)` |

---

## 8. GAME CARDS & GRID

### 8.1 Games Grid Layout
| Property | Value |
|----------|-------|
| Display | Grid |
| Columns | `repeat(3, 1fr)` |
| Gap | 12px |
| Default Visible | 12 games |
| Load More | 12 games per batch |

### 8.2 Game Card Specifications
| Property | Value |
|----------|-------|
| Border Radius | 16px |
| Padding | 16px |
| Background | `var(--bg-secondary)` |
| Border | `1px solid rgba(255, 255, 255, 0.1)` |
| Aspect Ratio | Square (1:1) |
| Transition | `transform 0.2s, box-shadow 0.2s` |

### 8.3 Game Card States
| State | Visual |
|-------|--------|
| Default | Standard background |
| Locked | 50% opacity, lock icon |
| Completed (Pass) | Green border `var(--success)` |
| Completed (Fail) | Red border `var(--error)` |
| Current | Primary color glow |
| Hover/Press | Scale 1.02, elevated shadow |

---

## 9. BUTTONS

### 9.1 Primary Button (BEGIN CHALLENGE)
```css
.begin-button {
  width: 100%;
  padding: 16px 24px;
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 700;
  letter-spacing: 1px;
  border: none;
  border-radius: 14px;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  color: white;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 6px 20px rgba(var(--primary-rgb), 0.25);
}

.begin-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(var(--primary-rgb), 0.4);
}

.begin-button:active {
  transform: translateY(2px);
  box-shadow: 0 3px 10px rgba(var(--primary-rgb), 0.2);
}
```

### 9.2 Button Variants
| Type | Background | Text Color | Border |
|------|------------|------------|--------|
| Primary | Gradient (primary→secondary) | White | None |
| Secondary | `rgba(255, 255, 255, 0.08)` | White | None |
| Danger | `var(--error)` | White | None |
| Ghost | Transparent | Primary | 1px primary |

---

## 10. GAME CONFIGURATION

### 10.1 Core Timing
| Setting | Value | Description |
|---------|-------|-------------|
| gameLength | 60 seconds | Standard game duration |
| questionTimeout | 5 seconds | Auto-skip if applicable |
| countdownStart | 3 | 3-2-1-GO countdown |
| resultDelay | 2 seconds | Before showing results |
| feedbackDuration | 1.5 seconds | Correct/wrong feedback |
| nextQuestionDelay | 0.8 seconds | Between questions |

### 10.2 Scoring System
| Action | Points |
|--------|--------|
| Correct Answer | +25 |
| Wrong Answer | -15 |
| Speed Bonus (<1s) | +10 |
| Speed Bonus (<2s) | +5 |
| Speed Bonus (<3s) | +2 |
| Volume Bonus (15+ correct) | +50 |
| Volume Bonus (20+ correct) | +100 |
| Volume Bonus (25+ correct) | +200 |
| 100% Accuracy | +200 |
| 95%+ Accuracy | +100 |
| 90%+ Accuracy | +50 |

### 10.3 Mastery Tiers
| Tier | Score Required | Visual |
|------|----------------|--------|
| Bronze | 70% | 🥉 |
| Silver | 85% | 🥈 |
| Gold | 95% | 🥇 |
| Platinum | 100% | 💎 |

### 10.4 Game Unlock System
| Setting | Value |
|---------|-------|
| Passing Score | 70% |
| Min Questions | 6 |
| Free Games | 15 |
| Total Games | 60 |
| Games Per Batch | 12 |

---

## 11. GAMES DATABASE

### 11.1 Total Games: 60

#### Free Tier (Games 1-15)
| ID | Name | Category | Icon | Difficulty |
|----|------|----------|------|------------|
| 1 | Color Sequence | Visual | 🎨 | Easy |
| 2 | Number Flash | Numeric | 🔢 | Easy |
| 3 | Reaction Test | Speed | ⚡ | Easy |
| 4 | Card Match Rush | Visual | 🃏 | Easy |
| 5 | Shape Shifter | Visual | 🔷 | Easy |
| 6 | Speed Math | Numeric | ➕ | Easy |
| 7 | World Capitals | Spatial | 🌍 | Easy |
| 8 | Word Chain | Verbal | 🔗 | Medium |
| 9 | What's Missing | Visual | ❓ | Medium |
| 10 | Position Perfect | Spatial | 📍 | Medium |
| 11 | Emoji Story | Verbal | 📖 | Medium |
| 12 | Pattern Breaker | Pattern | 🔍 | Medium |
| 13 | Sound Sequence | Auditory | 🔊 | Medium |
| 14 | Face Memory | Visual | 👤 | Medium |
| 15 | Number Grid | Numeric | 🔢 | Medium |

#### Premium Tier (Games 16-60)
- Games 16-30: Medium Difficulty
- Games 31-45: Medium-Hard Difficulty
- Games 46-59: Hard/Expert Difficulty
- Game 60: Ultimate Challenge (Boss Level)

### 11.2 Categories
| Category | Color | Icon | Count |
|----------|-------|------|-------|
| Visual | `#8B5CF6` | 👁️ | ~15 |
| Numeric | `#F59E0B` | 🔢 | ~10 |
| Verbal | `#10B981` | 📝 | ~10 |
| Spatial | `#3B82F6` | 🗺️ | ~8 |
| Pattern | `#EC4899` | 🧩 | ~10 |
| Speed | `#EF4444` | ⚡ | ~5 |
| Auditory | `#6366F1` | 🔊 | ~3 |

### 11.3 Difficulty Levels
| Level | Time | Score Multiplier | Color |
|-------|------|-----------------|-------|
| Easy | 60s | 1.0x | `#22c55e` |
| Medium | 60s | 1.2x | `#f59e0b` |
| Hard | 60s | 1.5x | `#ef4444` |
| Expert | 120s | 2.0x | `#8b5cf6` |

---

## 12. MODALS & OVERLAYS

### 12.1 Modal Base
```css
.modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: var(--bg-secondary);
  border-radius: 24px;
  padding: 32px;
  max-width: 400px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}
```

### 12.2 Settings Modal
| Property | Value |
|----------|-------|
| Max Width | 400px |
| Border Radius | 24px |
| Background | `var(--bg-secondary)` |
| Sections | Sound, Theme, Language, Difficulty, Progress |

---

## 13. ANIMATIONS

### 13.1 Screen Transitions
```css
.screen {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
```

### 13.2 Loading Animation
```css
@keyframes loadingBar {
  0% { width: 0%; }
  50% { width: 70%; }
  100% { width: 100%; }
}
/* Duration: 2s */
```

### 13.3 Flame Pulse (Logo)
```css
@keyframes flamePulse {
  0%, 100% { transform: scale(1); filter: brightness(1); }
  50% { transform: scale(1.1); filter: brightness(1.3); }
}
/* Duration: 1s, infinite */
```

### 13.4 Button Press
- Scale down: `translateY(2px)`
- Shadow reduce: `0 3px 10px`
- Transition: `0.2s ease`

---

## 14. RESPONSIVE DESIGN MATRIX

### 14.1 Breakpoints
| Device | Width | Notes |
|--------|-------|-------|
| iPhone SE | 375px | Small screen |
| iPhone 14 | 390px | Standard |
| iPhone 14 Pro Max | 430px | Large |
| Android Small | ~360px | 5-inch |
| Android Medium | ~400px | 6-inch |
| Android Large | ~430px | 6.7-inch+ |

### 14.2 Responsive Behaviors
- **Font Sizes:** Use `clamp()` for fluid scaling
- **Spacing:** Use `clamp()` for responsive gaps
- **Grid Columns:** Fixed 3 columns, gap adjusts
- **Max Content Width:** 500px centered
- **Safe Areas:** Dynamic inset handling

---

## 15. GAME SCREEN LAYOUT

### 15.1 Structure
```
┌─────────────────────────────────────┐
│ GAME HEADER                         │
│ [SCORE: 0]    [⏸]    [TIMER: 60]   │
├─────────────────────────────────────┤
│                                     │
│           GAME AREA                 │
│      (Dynamic per game type)        │
│                                     │
│                                     │
└─────────────────────────────────────┘
```

### 15.2 Game Header
| Element | Position | Size |
|---------|----------|------|
| Score | Left | Font 1.2rem |
| Pause Button | Center | 42×42px |
| Timer | Right | Font 1.2rem, countdown |

---

## 16. RESULTS SCREEN

### 16.1 Elements
1. **Mastery Display** - Stars & Tier (⭐⭐⭐ GOLD)
2. **Game Icon & Name**
3. **Final Score** - Large display
4. **Score Percentage** - e.g., "95%"
5. **Questions Answered** - e.g., "10 questions"
6. **Unlock Message** - "✅ Next game unlocked!"
7. **Stats Row** - Coins earned, Games won
8. **Action Buttons:**
   - Share Score 📱
   - Play Again 🔄
   - Next Game ▶️
   - Home 🏠

---

## 17. PARTY MODE

### 17.1 Configuration
| Setting | Value |
|---------|-------|
| Max Players | 8 |
| Min Players | 2 |
| Room Code Length | 6 characters |
| Games Per Session | 5 |
| Update Interval | 1000ms |
| Lobby Timeout | 300 seconds |

### 17.2 States
1. **Welcome** - Join or Host options
2. **Lobby** - Room code, player list, waiting
3. **Playing** - Active game with live scores
4. **Results** - Winner crown, final standings

---

## 18. PREMIUM SYSTEM

### 18.1 Monetization
| Product | Price | Access |
|---------|-------|--------|
| Full Access | $19.99 | One-time, lifetime |
| Host Access (Party) | $30.00 | One-time |

### 18.2 Premium Features
- Access to games 16-60
- Hard & Extreme difficulty modes
- Host Party Mode capability

---

## 19. SOUND & HAPTICS

### 19.1 Sound Settings
- Sound Effects: Toggle on/off
- Stored in localStorage: `cognixis_sound`

### 19.2 Haptic Feedback
- Vibration: Toggle on/off
- Trigger points: Button taps, correct/wrong answers, game end

---

## 20. LOCALIZATION

### 20.1 Supported Languages
| Language | Code | Flag |
|----------|------|------|
| English | en | 🇬🇧 |
| Spanish | es | 🇪🇸 |
| French | fr | 🇫🇷 |

### 20.2 Translation Files
Located in `/js/languages/`:
- `en.js`
- `es.js`
- `fr.js`

---

## 21. DATA STORAGE

### 21.1 LocalStorage Keys
| Key | Purpose |
|-----|---------|
| `cognixis_user` | User profile |
| `cognixis_stats` | Game statistics |
| `cognixis_game_scores` | Per-game scores |
| `cognixis_game_progress` | Unlock progress |
| `cognixis_settings` | User settings |
| `cognixis-theme` | Theme preference |
| `cognixis_sound` | Sound setting |
| `cognixis_language` | Language setting |

---

## 22. FILE STRUCTURE

```
CogniXis/
├── index.html              # Main HTML
├── manifest.json           # PWA manifest
├── sw.js                   # Service worker
├── logo.svg                # Main logo
├── icon-192.svg            # Small icon
├── icon-512.svg            # Large icon
├── AppIcon.png             # App icon (1024x1024)
├── css/
│   ├── main.css            # Main styles (~8000 lines)
│   ├── game-themes.css     # Game-specific styles
│   └── party-mode.css      # Party mode styles
├── js/
│   ├── app.js              # Main app controller
│   ├── game.js             # Game engine
│   ├── simple-games.js     # 60 game implementations
│   ├── games-list.js       # Game database
│   ├── config.js           # Centralized config
│   ├── storage.js          # Data persistence
│   ├── themes.js           # Theme management
│   ├── ui.js               # UI rendering
│   ├── sounds.js           # Audio management
│   ├── stats.js            # Statistics
│   ├── unlock-system.js    # Game unlocking
│   ├── streak.js           # Streak tracking
│   ├── i18n.js             # Internationalization
│   ├── friends-hub.js      # Party mode
│   ├── room-manager.js     # Room management
│   ├── party-ui.js         # Party UI
│   ├── utils.js            # Utilities
│   └── languages/          # Translation files
│       ├── en.js
│       ├── es.js
│       └── fr.js
├── ios/                    # iOS build
├── android/                # Android build
└── www/                    # Web build output
```

---

## 23. BUILD & DEPLOYMENT

### 23.1 PWA Configuration
```json
{
  "name": "CogniXis",
  "short_name": "CogniXis",
  "display": "standalone",
  "orientation": "portrait",
  "background_color": "#0a0a1a",
  "theme_color": "#7b68ee"
}
```

### 23.2 Service Worker
- Cache Name: `cognixis-v7` (increment on updates)
- Cached: All HTML, CSS, JS, and assets
- Strategy: Cache-first with network fallback

---

## 24. TESTING CHECKLIST

### Pre-Launch Verification
- [ ] Logo displays correctly on all devices
- [ ] All 4 themes switch properly
- [ ] Safe areas respected (notch, home indicator)
- [ ] Bottom nav fixed at bottom
- [ ] Games grid displays 12 items
- [ ] Load More shows additional games
- [ ] All 60 games are playable
- [ ] Scoring calculates correctly
- [ ] Mastery tiers award properly
- [ ] Settings save and persist
- [ ] Sound toggles work
- [ ] Vibration toggles work
- [ ] Theme persists on reload
- [ ] Language changes apply
- [ ] Premium toggle works (dev mode)
- [ ] Party mode connects
- [ ] Results screen displays correctly
- [ ] Share functionality works
- [ ] No console errors
- [ ] Works offline (PWA)

---

## DOCUMENT VERSION

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | January 2026 | CogniXis Team | Initial documentation |

---

*This document serves as the complete specification for the CogniXis brain training application. All measurements, colors, and specifications should be followed exactly for consistent implementation across platforms.*

