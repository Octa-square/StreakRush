# COGNIXIS - iOS APP ICON SPECIFICATIONS

## App Store Icon (Marketing)
| File | Size | Notes |
|------|------|-------|
| AppIcon-1024.png | 1024×1024 | No transparency, no rounded corners |

## iPhone Icons (All Required)
| Size (pt) | Scale | Pixels | Filename | Usage |
|-----------|-------|--------|----------|-------|
| 20 | 2x | 40×40 | AppIcon-20@2x.png | Notifications |
| 20 | 3x | 60×60 | AppIcon-20@3x.png | Notifications |
| 29 | 2x | 58×58 | AppIcon-29@2x.png | Settings |
| 29 | 3x | 87×87 | AppIcon-29@3x.png | Settings |
| 40 | 2x | 80×80 | AppIcon-40@2x.png | Spotlight |
| 40 | 3x | 120×120 | AppIcon-40@3x.png | Spotlight |
| 60 | 2x | 120×120 | AppIcon-60@2x.png | Home Screen |
| 60 | 3x | 180×180 | AppIcon-60@3x.png | Home Screen |

## iPad Icons (If Universal App)
| Size (pt) | Scale | Pixels | Filename | Usage |
|-----------|-------|--------|----------|-------|
| 20 | 1x | 20×20 | AppIcon-20.png | Notifications |
| 20 | 2x | 40×40 | AppIcon-20@2x.png | Notifications |
| 29 | 1x | 29×29 | AppIcon-29.png | Settings |
| 29 | 2x | 58×58 | AppIcon-29@2x.png | Settings |
| 40 | 1x | 40×40 | AppIcon-40.png | Spotlight |
| 40 | 2x | 80×80 | AppIcon-40@2x.png | Spotlight |
| 76 | 1x | 76×76 | AppIcon-76.png | Home Screen |
| 76 | 2x | 152×152 | AppIcon-76@2x.png | Home Screen |
| 83.5 | 2x | 167×167 | AppIcon-83.5@2x.png | iPad Pro |

## Design Requirements
- **Format:** PNG only
- **Color Space:** sRGB or Display P3
- **Transparency:** NOT allowed (no alpha channel)
- **Rounded Corners:** NOT included (iOS applies automatically)
- **Layers:** Flattened, single layer
- **Resolution:** 72 dpi minimum

## CogniXis Icon Design
- **Background:** Dark gradient (#0A0E1A → #151B2E)
- **Main Element:** Brain illustration in cyan (#00D4FF)
- **Accent:** Neural connections in purple (#8B7FFF)
- **Style:** Minimalist, modern, glowing effect

## Generation Command (ImageMagick)
```bash
# From 1024px source, generate all sizes
sizes=(40 60 58 87 80 120 180 20 29 76 152 167)
for size in "${sizes[@]}"; do
  convert AppIcon-1024.png -resize ${size}x${size} AppIcon-${size}.png
done
```

## Xcode Asset Catalog Structure
```
Assets.xcassets/
└── AppIcon.appiconset/
    ├── Contents.json
    ├── AppIcon-20@2x.png
    ├── AppIcon-20@3x.png
    ├── AppIcon-29@2x.png
    ├── AppIcon-29@3x.png
    ├── AppIcon-40@2x.png
    ├── AppIcon-40@3x.png
    ├── AppIcon-60@2x.png
    ├── AppIcon-60@3x.png
    └── AppIcon-1024.png
```

