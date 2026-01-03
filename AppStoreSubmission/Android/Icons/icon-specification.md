# COGNIXIS - ANDROID APP ICON SPECIFICATIONS

## Play Store Icon (Required)
| File | Size | Format | Notes |
|------|------|--------|-------|
| icon-512.png | 512×512 | PNG 32-bit | Alpha allowed |

## Feature Graphic (Required)
| File | Size | Format | Notes |
|------|------|--------|-------|
| feature-graphic.png | 1024×500 | PNG/JPEG 24-bit | No alpha, promotional banner |

## Promo Graphic (Optional)
| File | Size | Format |
|------|------|--------|
| promo-graphic.png | 180×120 | PNG |

## Adaptive Icons (Android 8.0+)

### Foreground Layer
| Density | Size | File |
|---------|------|------|
| mdpi | 108×108 | ic_launcher_foreground.png |
| hdpi | 162×162 | ic_launcher_foreground.png |
| xhdpi | 216×216 | ic_launcher_foreground.png |
| xxhdpi | 324×324 | ic_launcher_foreground.png |
| xxxhdpi | 432×432 | ic_launcher_foreground.png |

### Background Layer
| Density | Size | File |
|---------|------|------|
| mdpi | 108×108 | ic_launcher_background.png |
| hdpi | 162×162 | ic_launcher_background.png |
| xhdpi | 216×216 | ic_launcher_background.png |
| xxhdpi | 324×324 | ic_launcher_background.png |
| xxxhdpi | 432×432 | ic_launcher_background.png |

### Safe Zone
- **Total icon:** 108dp × 108dp
- **Safe zone:** 66dp × 66dp (centered)
- **Masked area:** Varies by device (circle, squircle, etc.)

## Legacy Icons (Pre-Android 8.0)
| Density | Size | File |
|---------|------|------|
| mdpi | 48×48 | ic_launcher.png |
| hdpi | 72×72 | ic_launcher.png |
| xhdpi | 96×96 | ic_launcher.png |
| xxhdpi | 144×144 | ic_launcher.png |
| xxxhdpi | 192×192 | ic_launcher.png |

## Design Guidelines

### Foreground Layer
- Contains the brain logo
- Centered within safe zone (66dp)
- Transparent background (alpha)

### Background Layer
- Dark gradient: #0A0E1A → #151B2E
- Or solid color: #0A0E1A
- No transparency

### Colors
| Element | Color |
|---------|-------|
| Background | #0A0E1A (dark) |
| Brain | #00D4FF (cyan) |
| Neural | #8B7FFF (purple) |
| Glow | rgba(0, 212, 255, 0.3) |

## Folder Structure
```
android/app/src/main/res/
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
    ├── ic_launcher.xml
    └── ic_launcher_round.xml
```

## ic_launcher.xml (Adaptive Icon Definition)
```xml
<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@mipmap/ic_launcher_background"/>
    <foreground android:drawable="@mipmap/ic_launcher_foreground"/>
</adaptive-icon>
```

