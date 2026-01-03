# COGNIXIS - QA TESTING CHECKLIST
## Pre-Submission Quality Assurance

---

## FUNCTIONAL TESTING

### App Launch
- [ ] App launches without crash
- [ ] Splash screen displays correctly
- [ ] Home screen loads within 3 seconds
- [ ] No console errors on launch

### Navigation
- [ ] All bottom nav buttons work
- [ ] Settings opens correctly
- [ ] Back navigation works
- [ ] No dead-end screens

### User Setup
- [ ] Onboarding flow completes
- [ ] Name entry works (with validation)
- [ ] Skip name option works
- [ ] Settings persist after app restart

---

## GAME TESTING

### All 60 Games
Test each game for:
- [ ] Game loads without error
- [ ] Instructions display correctly
- [ ] Countdown timer works
- [ ] Game mechanics function
- [ ] Score calculates correctly
- [ ] Results display accurately
- [ ] Mastery tier assigns correctly
- [ ] Return to home works

### Specific Game Tests
| Game # | Name | Status | Notes |
|--------|------|--------|-------|
| 1 | Color Sequence | ☐ | |
| 2 | Speed Math | ☐ | |
| 3 | Word Scramble | ☐ | |
| ... | ... | ☐ | |
| 60 | [Last Game] | ☐ | |

### Edge Cases
- [ ] Answer during countdown (should ignore)
- [ ] Rapid tapping (debounce works)
- [ ] No answer given (handles timeout)
- [ ] All correct answers
- [ ] All wrong answers
- [ ] Mixed correct/wrong

---

## SCORING SYSTEM

- [ ] Correct answers add points
- [ ] Wrong answers handle correctly
- [ ] Timer bonus applies
- [ ] Streak bonus applies
- [ ] Brain Score updates
- [ ] Mastery tiers unlock:
  - [ ] Bronze (70%+)
  - [ ] Silver (85%+)
  - [ ] Gold (95%+)
  - [ ] Platinum (100%)

---

## UI/UX TESTING

### Themes
Test all 4 themes:
- [ ] Cyber Neural
- [ ] Neon Nights
- [ ] Gradient Fusion
- [ ] Dark Matter

For each theme verify:
- [ ] All colors apply
- [ ] Text readable
- [ ] Buttons visible
- [ ] Progress bars colored
- [ ] No hardcoded colors remain

### Responsive Design
- [ ] iPhone SE (smallest)
- [ ] iPhone 14/15 (standard)
- [ ] iPhone 14/15 Pro Max (largest)
- [ ] iPad (if supported)
- [ ] Android small phone
- [ ] Android large phone

### Layout
- [ ] No content cut off
- [ ] No horizontal scroll
- [ ] Safe areas respected
- [ ] Keyboard doesn't cover inputs
- [ ] Modals center properly

---

## SETTINGS

- [ ] Sound toggle works
- [ ] Vibration toggle works
- [ ] Theme selection applies
- [ ] Language selection works
- [ ] Difficulty selection saves
- [ ] Reset progress works
- [ ] Settings persist after restart

---

## IN-APP PURCHASES

### Premium Unlock
- [ ] Purchase button displays
- [ ] Purchase flow initiates
- [ ] Sandbox purchase completes
- [ ] Premium features unlock
- [ ] Premium state persists

### Party Host
- [ ] Purchase button displays
- [ ] Purchase flow works
- [ ] Host features unlock

### Restore Purchases
- [ ] Restore button exists
- [ ] Restore retrieves purchases
- [ ] UI updates after restore

---

## PARTY MODE (MULTIPLAYER)

- [ ] Party tab accessible
- [ ] Join room with code works
- [ ] Host room (premium) works
- [ ] Waiting room displays
- [ ] Game starts with 2+ players
- [ ] All 5 rounds play
- [ ] Final standings display
- [ ] Return to lobby works

---

## OFFLINE MODE

- [ ] App works without internet
- [ ] All single-player games work
- [ ] Scores save locally
- [ ] Settings persist
- [ ] Graceful handling when party mode unavailable

---

## PERFORMANCE

### Speed
- [ ] App launch < 3 seconds
- [ ] Screen transitions smooth
- [ ] Game animations smooth
- [ ] No jank or stuttering

### Memory
- [ ] Memory usage < 200MB
- [ ] No memory leaks
- [ ] Long sessions stable
- [ ] Background/foreground stable

### Battery
- [ ] Normal battery usage
- [ ] No unusual drain
- [ ] Background not active

---

## ACCESSIBILITY

- [ ] VoiceOver works (iOS)
- [ ] TalkBack works (Android)
- [ ] Text size respects system
- [ ] Contrast sufficient
- [ ] Tap targets 44x44 minimum

---

## LOCALIZATION

Test each language:
- [ ] English (US)
- [ ] Spanish
- [ ] French

For each:
- [ ] All strings translated
- [ ] No truncation
- [ ] Layout adapts to text length
- [ ] RTL support (if applicable)

---

## EDGE CASES

- [ ] App backgrounded during game
- [ ] App killed during game
- [ ] Low memory warning
- [ ] Incoming call during game
- [ ] Orientation change (if allowed)
- [ ] Screen lock during game
- [ ] Airplane mode toggle

---

## SECURITY

- [ ] No sensitive data exposed
- [ ] Local storage encrypted (device)
- [ ] HTTPS for all network calls
- [ ] No hardcoded credentials
- [ ] Input validation works

---

## CRASH TESTING

- [ ] No crashes in normal use
- [ ] No crashes on rapid input
- [ ] No crashes on memory pressure
- [ ] No crashes on network loss
- [ ] Crash logs collected (if applicable)

---

## FINAL CHECKS

- [ ] Version number correct
- [ ] Build number correct
- [ ] App icon displays
- [ ] Launch screen displays
- [ ] No placeholder content
- [ ] No TODO comments visible
- [ ] Debug mode disabled
- [ ] Analytics configured (if any)
- [ ] Demo mode toggleable

---

## SIGN-OFF

| Tester | Date | Device | Result |
|--------|------|--------|--------|
| | | | ☐ Pass / ☐ Fail |
| | | | ☐ Pass / ☐ Fail |
| | | | ☐ Pass / ☐ Fail |

**Ready for Submission:** ☐ Yes / ☐ No

**Notes:**
_______________________


