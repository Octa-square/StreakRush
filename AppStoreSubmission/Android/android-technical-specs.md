# COGNIXIS - ANDROID TECHNICAL SPECIFICATIONS
## Google Play Console Submission Requirements

---

## APP IDENTITY

### Package Information
| Property | Value |
|----------|-------|
| **Package Name** | com.octasquare.cognixis |
| **App Name** | CogniXis |
| **Version Name** | 1.0.0 |
| **Version Code** | 1 |

---

## SDK REQUIREMENTS

### Android SDK Versions
| Property | Value | Notes |
|----------|-------|-------|
| **minSdkVersion** | 24 | Android 7.0 (Nougat) |
| **targetSdkVersion** | 34 | Android 14 (required for new apps) |
| **compileSdkVersion** | 34 | Latest stable |

### Build Configuration (build.gradle)
```groovy
android {
    namespace = "com.octasquare.cognixis"
    compileSdk = 34
    
    defaultConfig {
        applicationId = "com.octasquare.cognixis"
        minSdk = 24
        targetSdk = 34
        versionCode = 1
        versionName = "1.0.0"
    }
}
```

---

## PERMISSIONS

### AndroidManifest.xml Permissions
```xml
<manifest>
    <!-- Internet for optional features -->
    <uses-permission android:name="android.permission.INTERNET" />
    
    <!-- Vibration for haptic feedback -->
    <uses-permission android:name="android.permission.VIBRATE" />
    
    <!-- Optional: Notifications (if added later) -->
    <!-- <uses-permission android:name="android.permission.POST_NOTIFICATIONS" /> -->
</manifest>
```

### Permission Declarations for Play Console
| Permission | Required | Reason |
|------------|----------|--------|
| INTERNET | Yes | Party mode multiplayer |
| VIBRATE | Yes | Haptic feedback in games |
| POST_NOTIFICATIONS | No | Future feature |

---

## APP ICONS & GRAPHICS

### High-Res Icon (Required)
| Property | Specification |
|----------|---------------|
| Size | 512 × 512 pixels |
| Format | PNG (32-bit with alpha) |
| Shape | Full bleed, no rounding |
| File | icon-512.png |

### Adaptive Icon (Required for Android 8+)
| Property | Specification |
|----------|---------------|
| Foreground | 108 × 108 dp (432×432 px @4x) |
| Background | 108 × 108 dp (432×432 px @4x) |
| Safe Zone | 66 dp centered (for circular masks) |
| Format | PNG or Vector (XML) |

### Adaptive Icon Files
```
res/
├── mipmap-mdpi/
│   ├── ic_launcher.png (48×48)
│   ├── ic_launcher_foreground.png (108×108)
│   └── ic_launcher_background.png (108×108)
├── mipmap-hdpi/
│   ├── ic_launcher.png (72×72)
│   ├── ic_launcher_foreground.png (162×162)
│   └── ic_launcher_background.png (162×162)
├── mipmap-xhdpi/
│   ├── ic_launcher.png (96×96)
│   ├── ic_launcher_foreground.png (216×216)
│   └── ic_launcher_background.png (216×216)
├── mipmap-xxhdpi/
│   ├── ic_launcher.png (144×144)
│   ├── ic_launcher_foreground.png (324×324)
│   └── ic_launcher_background.png (324×324)
├── mipmap-xxxhdpi/
│   ├── ic_launcher.png (192×192)
│   ├── ic_launcher_foreground.png (432×432)
│   └── ic_launcher_background.png (432×432)
└── mipmap-anydpi-v26/
    └── ic_launcher.xml
```

### ic_launcher.xml (Adaptive Icon)
```xml
<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@mipmap/ic_launcher_background"/>
    <foreground android:drawable="@mipmap/ic_launcher_foreground"/>
</adaptive-icon>
```

### Feature Graphic (Required)
| Property | Specification |
|----------|---------------|
| Size | 1024 × 500 pixels |
| Format | JPEG or PNG (24-bit, no alpha) |
| Content | App logo, tagline, key visuals |
| File | feature-graphic.png |

### Promo Graphic (Optional)
| Property | Specification |
|----------|---------------|
| Size | 180 × 120 pixels |
| Format | PNG |
| File | promo-graphic.png |

### TV Banner (If supporting TV)
| Property | Specification |
|----------|---------------|
| Size | 1280 × 720 pixels |
| Format | PNG (24-bit, no alpha) |

---

## SCREENSHOTS

### Phone Screenshots
| Property | Specification |
|----------|---------------|
| Minimum | 2 screenshots |
| Maximum | 8 screenshots |
| Min dimension | 320 px (shortest side) |
| Max dimension | 3840 px (longest side) |
| Aspect ratio | 16:9 or 9:16 |
| Recommended | 1080 × 1920 px (portrait) |
| Format | JPEG or PNG (24-bit) |

### 7-inch Tablet Screenshots (Optional)
| Property | Specification |
|----------|---------------|
| Minimum | 2 screenshots (if provided) |
| Recommended | 1200 × 1920 px |

### 10-inch Tablet Screenshots (Optional)
| Property | Specification |
|----------|---------------|
| Minimum | 2 screenshots (if provided) |
| Recommended | 1600 × 2560 px |

### Recommended Screenshot Set
1. Home screen with games grid
2. Active gameplay (mid-game)
3. Results screen with score
4. Theme selection in settings
5. Party mode / Multiplayer
6. Leaderboard / Stats

---

## PROMO VIDEO

### Specifications
| Property | Specification |
|----------|---------------|
| Platform | YouTube URL |
| Duration | 30 seconds - 2 minutes |
| Quality | HD (1080p) recommended |
| Content | Gameplay, features, no inappropriate content |

---

## APP SIGNING

### Google Play App Signing (Required)
- Enroll in Google Play App Signing
- Upload app bundle (.aab) not APK
- Google manages signing key

### Keystore Information
```
Key alias: cognixis-release
Validity: 25+ years
Algorithm: RSA 2048-bit
```

---

## APP BUNDLE

### Build Format
- ✅ Android App Bundle (.aab) - Required
- ❌ APK - Not recommended (legacy)

### Bundle Configuration
```groovy
android {
    bundle {
        language {
            enableSplit = true
        }
        density {
            enableSplit = true
        }
        abi {
            enableSplit = true
        }
    }
}
```

---

## IN-APP PURCHASES

### Products
| Product ID | Type | Price | Description |
|------------|------|-------|-------------|
| full_access | One-time | $19.99 | Unlock all 60 games |
| party_host | One-time | $30.00 | Host party rooms |

### Google Play Billing
- Version: Billing Library 6.0+
- Product Type: One-time (non-consumable)
- Test with license testing accounts

---

## CONTENT RATING

### Rating Questionnaire
| Question | Answer |
|----------|--------|
| Violence | No |
| Sexual content | No |
| Crude humor | No |
| Fear | No |
| Gambling | No |
| User interaction | Limited (multiplayer with room codes) |
| Shares location | No |
| Shares personal info | No |
| Digital purchases | Yes (optional) |

### Expected Rating
- **ESRB:** Everyone (E)
- **PEGI:** 3
- **IARC:** 3+

---

## DATA SAFETY

### Data Collection Declaration
| Data Type | Collected | Shared | Required |
|-----------|-----------|--------|----------|
| Personal info | ❌ No | - | - |
| Financial info | ❌ No | - | - |
| Location | ❌ No | - | - |
| Web browsing | ❌ No | - | - |
| Email/Contacts | ❌ No | - | - |
| App activity | ⚠️ Local only | ❌ No | No |
| App info/Performance | ⚠️ Crash logs | ❌ No | No |
| Device IDs | ❌ No | - | - |

### Security Practices
- ✅ Data encrypted in transit (HTTPS)
- ✅ Data stored locally on device
- ✅ Users can delete data (reset progress)

---

## STORE LISTING

### App Details
| Field | Value |
|-------|-------|
| Title | CogniXis |
| Short Description | 60-second brain games to boost memory, focus & cognitive skills. Play daily! |
| Full Description | [See metadata file] |
| App Category | Games > Puzzle |
| Tags | Brain Games, Memory, Educational, Mind, Trivia |
| Content Rating | Everyone |

### Contact Details
| Field | Value |
|-------|-------|
| Email | support@cognixis.app |
| Website | https://cognixis.app |
| Privacy Policy | https://cognixis.app/privacy |

---

## RELEASE MANAGEMENT

### Release Tracks
| Track | Purpose | Rollout |
|-------|---------|---------|
| Internal | Dev team testing | Immediate |
| Closed | Beta testers | Immediate |
| Open | Public beta | Immediate |
| Production | Full release | Staged (10% → 50% → 100%) |

### Staged Rollout (Recommended for v1.0)
- Day 1: 10% rollout
- Day 3: 50% rollout (if no issues)
- Day 7: 100% rollout

---

## OPTIMIZATION

### Android Vitals Targets
| Metric | Target |
|--------|--------|
| Crash-free users | > 99% |
| ANR rate | < 0.5% |
| Startup time | < 2 seconds |
| Battery usage | Normal |

### Performance Optimization
- Enable ProGuard/R8 minification
- Remove unused resources
- Optimize images
- Use WebP format where possible

---

## TESTING CHECKLIST

### Pre-Submission Testing
- [ ] App installs successfully
- [ ] All games function correctly
- [ ] In-app purchases work (test track)
- [ ] App works offline
- [ ] All themes apply correctly
- [ ] Edge-to-edge display works
- [ ] Navigation bar handling
- [ ] Back button behavior
- [ ] No ANRs or crashes

### Device Testing Matrix
- [ ] Small phone (5" 720p)
- [ ] Medium phone (6" 1080p)
- [ ] Large phone (6.7" 1440p)
- [ ] Tablet 7" (if supported)
- [ ] Tablet 10" (if supported)
- [ ] Android 7 (API 24)
- [ ] Android 10 (API 29)
- [ ] Android 13 (API 33)
- [ ] Android 14 (API 34)

---

## FILES TO PREPARE

### Required Files
- [ ] App Bundle (.aab)
- [ ] High-res icon (512×512)
- [ ] Feature graphic (1024×500)
- [ ] Phone screenshots (minimum 2)
- [ ] Privacy Policy URL
- [ ] Full description
- [ ] Short description

### Optional Files
- [ ] Promo video (YouTube URL)
- [ ] Tablet screenshots
- [ ] Promo graphic (180×120)
- [ ] Wear OS assets (if applicable)


