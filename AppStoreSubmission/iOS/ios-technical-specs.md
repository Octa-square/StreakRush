# COGNIXIS - iOS TECHNICAL SPECIFICATIONS
## App Store Connect Submission Requirements

---

## APP IDENTITY

### Bundle Information
| Property | Value |
|----------|-------|
| **Bundle ID** | com.octasquare.cognixis |
| **Bundle Name** | CogniXis |
| **Version** | 1.0.0 |
| **Build Number** | 1 |
| **SKU** | COGNIXIS001 |

---

## PLATFORM REQUIREMENTS

### iOS Version Support
| Property | Value |
|----------|-------|
| **Minimum iOS** | 14.0 |
| **Target iOS** | 17.0 |
| **Recommended** | 15.0+ |

### Supported Devices
- ✅ iPhone (all models iPhone 6s and later)
- ✅ iPod touch (7th generation)
- ⚠️ iPad (optimized for iPhone, runs in compatibility mode)

### Orientations
| Device | Portrait | Landscape |
|--------|----------|-----------|
| iPhone | ✅ Required | ❌ Disabled |
| iPad | ✅ Required | ❌ Disabled |

---

## DEVICE CAPABILITIES

### Required Capabilities
```xml
<key>UIRequiredDeviceCapabilities</key>
<array>
    <string>arm64</string>
</array>
```

### Background Modes
- None required (app is foreground-only)

---

## PERMISSIONS & USAGE DESCRIPTIONS

### Current Permissions Required
| Permission | Required | Usage Description |
|------------|----------|-------------------|
| Camera | ❌ No | Not used |
| Photo Library | ❌ No | Not used |
| Location | ❌ No | Not used |
| Microphone | ❌ No | Not used |
| Contacts | ❌ No | Not used |
| Notifications | ⚠️ Optional | For daily reminders (future feature) |

### Info.plist Entries (if notifications added)
```xml
<key>NSUserNotificationsUsageDescription</key>
<string>CogniXis would like to send you daily brain training reminders.</string>
```

---

## IN-APP PURCHASES

### Products
| Product ID | Type | Price | Description |
|------------|------|-------|-------------|
| com.octasquare.cognixis.fullaccess | Non-Consumable | $19.99 | Unlock all 60 games and advanced features |
| com.octasquare.cognixis.partyhost | Non-Consumable | $30.00 | Host multiplayer party rooms |

### StoreKit Configuration
- Restore Purchases: ✅ Implemented
- Receipt Validation: Server-side recommended
- Sandbox Testing: ✅ Supported

---

## APP ICONS (Required Sizes)

### App Store Icon
| Size | Scale | Filename | Pixels |
|------|-------|----------|--------|
| 1024pt | 1x | AppIcon-1024.png | 1024×1024 |

### iPhone Icons
| Size | Scale | Filename | Pixels |
|------|-------|----------|--------|
| 20pt | 2x | AppIcon-20@2x.png | 40×40 |
| 20pt | 3x | AppIcon-20@3x.png | 60×60 |
| 29pt | 2x | AppIcon-29@2x.png | 58×58 |
| 29pt | 3x | AppIcon-29@3x.png | 87×87 |
| 40pt | 2x | AppIcon-40@2x.png | 80×80 |
| 40pt | 3x | AppIcon-40@3x.png | 120×120 |
| 60pt | 2x | AppIcon-60@2x.png | 120×120 |
| 60pt | 3x | AppIcon-60@3x.png | 180×180 |

### iPad Icons (if supporting iPad)
| Size | Scale | Filename | Pixels |
|------|-------|----------|--------|
| 20pt | 1x | AppIcon-20.png | 20×20 |
| 20pt | 2x | AppIcon-20@2x.png | 40×40 |
| 29pt | 1x | AppIcon-29.png | 29×29 |
| 29pt | 2x | AppIcon-29@2x.png | 58×58 |
| 40pt | 1x | AppIcon-40.png | 40×40 |
| 40pt | 2x | AppIcon-40@2x.png | 80×80 |
| 76pt | 1x | AppIcon-76.png | 76×76 |
| 76pt | 2x | AppIcon-76@2x.png | 152×152 |
| 83.5pt | 2x | AppIcon-83.5@2x.png | 167×167 |

### Icon Requirements
- Format: PNG
- Color space: sRGB or P3
- No alpha channel (no transparency)
- No rounded corners (iOS applies them automatically)
- No shadows or badges

---

## SCREENSHOTS

### Required Screenshot Sizes
| Device | Resolution | Required |
|--------|------------|----------|
| 6.7" iPhone 14 Pro Max | 1290 × 2796 | ✅ Yes (primary) |
| 6.5" iPhone 11 Pro Max | 1242 × 2688 | ✅ Yes |
| 5.5" iPhone 8 Plus | 1242 × 2208 | ⚠️ Recommended |
| 12.9" iPad Pro (3rd gen) | 2048 × 2732 | ⚠️ If iPad supported |

### Screenshot Requirements
- Minimum: 3 screenshots per device
- Maximum: 10 screenshots per device
- Format: PNG or JPEG
- No alpha channel
- 72 dpi minimum
- Status bar can be included or excluded

### Recommended Screenshots
1. Home screen with game list
2. Active gameplay
3. Results screen with mastery
4. Settings/Theme selection
5. Party Mode lobby

---

## APP PREVIEW VIDEOS

### Specifications
| Property | Requirement |
|----------|-------------|
| Format | M4V, MP4, or MOV |
| Codec | H.264 |
| Audio | AAC stereo |
| Duration | 15-30 seconds |
| Frame Rate | 30 fps |
| Resolution | Match screenshot sizes |

### Video Resolutions
| Device | Resolution |
|--------|------------|
| 6.7" | 1290 × 2796 |
| 6.5" | 1242 × 2688 |
| 5.5" | 1242 × 2208 |
| 12.9" iPad | 2048 × 2732 |

---

## BUILD SETTINGS

### Xcode Configuration
```
PRODUCT_BUNDLE_IDENTIFIER = com.octasquare.cognixis
MARKETING_VERSION = 1.0.0
CURRENT_PROJECT_VERSION = 1
TARGETED_DEVICE_FAMILY = 1 (iPhone only) or 1,2 (Universal)
IPHONEOS_DEPLOYMENT_TARGET = 14.0
SWIFT_VERSION = 5.0
ENABLE_BITCODE = NO (deprecated in Xcode 14+)
```

### Capacitor Configuration
```json
{
  "appId": "com.octasquare.cognixis",
  "appName": "CogniXis",
  "webDir": "www",
  "server": {
    "androidScheme": "https"
  },
  "ios": {
    "contentInset": "automatic"
  }
}
```

---

## APP STORE CONNECT SETTINGS

### App Information
| Field | Value |
|-------|-------|
| Primary Language | English (U.S.) |
| Primary Category | Games |
| Secondary Category | Puzzle |
| Content Rights | No third-party content requiring rights |

### Pricing
| Field | Value |
|-------|-------|
| Price | Free |
| In-App Purchases | Yes |
| Subscription | No |

### App Review Information
| Field | Value |
|-------|-------|
| Contact First Name | [Your Name] |
| Contact Last Name | [Your Name] |
| Contact Phone | [Your Phone] |
| Contact Email | appstore@cognixis.app |
| Demo Account | Not required (no login) |
| Notes | Premium features can be tested via Settings → Developer Mode → Enable Premium |

### Version Release
| Field | Value |
|-------|-------|
| Release Type | Manual release |
| Phased Release | Recommended for v1.0 |

---

## EXPORT COMPLIANCE

### Encryption Questions
| Question | Answer |
|----------|--------|
| Does your app use encryption? | Yes (HTTPS) |
| Is it exempt? | Yes - standard HTTPS only |
| Export Compliance Key | YES (exempt) |

### Info.plist
```xml
<key>ITSAppUsesNonExemptEncryption</key>
<false/>
```

---

## CONTENT RATINGS

### Apple Age Rating
| Category | Frequency |
|----------|-----------|
| Cartoon/Fantasy Violence | None |
| Realistic Violence | None |
| Sexual Content | None |
| Profanity | None |
| Drugs | None |
| Gambling | None |
| Horror/Fear | None |
| Mature/Suggestive | None |
| Medical/Treatment | None |
| Alcohol/Tobacco/Drugs | None |

**Result: 4+ (Everyone)**

---

## DATA COLLECTION (App Privacy)

### Privacy Nutrition Labels
| Data Type | Collected | Linked to Identity | Used for Tracking |
|-----------|-----------|-------------------|-------------------|
| Contact Info | ❌ No | - | - |
| Health & Fitness | ❌ No | - | - |
| Financial Info | ❌ No | - | - |
| Location | ❌ No | - | - |
| Sensitive Info | ❌ No | - | - |
| Contacts | ❌ No | - | - |
| User Content | ❌ No | - | - |
| Browsing History | ❌ No | - | - |
| Search History | ❌ No | - | - |
| Identifiers | ❌ No | - | - |
| Purchases | ❌ No | - | - |
| Usage Data | ⚠️ Optional | ❌ No | ❌ No |
| Diagnostics | ⚠️ Optional | ❌ No | ❌ No |

**Declaration: Data not collected / Data not linked to you**

---

## TESTING CHECKLIST

### Pre-Submission Testing
- [ ] App launches successfully on all supported iOS versions
- [ ] All 60 games function correctly
- [ ] In-app purchases complete successfully (sandbox)
- [ ] Restore purchases works
- [ ] App works offline
- [ ] All themes apply correctly
- [ ] Safe area insets respected on all devices
- [ ] No crashes in Crashlytics/console
- [ ] Memory usage acceptable (< 200MB)
- [ ] App size acceptable (< 200MB)

### Device Testing
- [ ] iPhone SE (2nd/3rd gen) - smallest screen
- [ ] iPhone 14/15 - standard
- [ ] iPhone 14/15 Pro Max - largest screen
- [ ] iPad (if universal) - compatibility mode

---

## FILES TO PREPARE

### Required Files
- [ ] AppIcon-1024.png (1024×1024, no transparency)
- [ ] All iPhone icon sizes
- [ ] Screenshots (6.7", 6.5" minimum)
- [ ] App binary (.ipa or Xcode archive)
- [ ] Privacy Policy URL
- [ ] Support URL

### Optional Files
- [ ] App Preview video
- [ ] iPad screenshots
- [ ] Promotional text
- [ ] Marketing URL


