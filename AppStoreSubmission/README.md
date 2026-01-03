# CogniXis App Store Submission Package

Complete submission package for iOS App Store and Google Play Store.

## 📁 Folder Structure

```
AppStoreSubmission/
├── iOS/
│   ├── Icons/
│   │   ├── AppIcon-1024.svg          # Source icon (convert to PNG)
│   │   ├── Contents.json             # Xcode asset catalog
│   │   └── icon-specification.md     # Size requirements
│   ├── Screenshots/
│   │   ├── iPhone6.7/                # 1290×2796 screenshots
│   │   ├── iPhone6.5/                # 1242×2688 screenshots
│   │   ├── iPhone5.5/                # 1242×2208 screenshots
│   │   ├── iPad12.9/                 # 2048×2732 screenshots
│   │   └── screenshot-guidelines.md
│   ├── AppPreviews/
│   │   └── video-specs.md
│   └── ios-technical-specs.md
│
├── Android/
│   ├── Icons/
│   │   ├── ic_launcher_foreground.svg
│   │   ├── ic_launcher_background.svg
│   │   └── icon-specification.md
│   ├── Screenshots/
│   │   ├── Phone/                    # 1080×1920 screenshots
│   │   ├── Tablet7/                  # 7-inch tablet
│   │   ├── Tablet10/                 # 10-inch tablet
│   │   └── screenshot-guidelines.md
│   ├── FeatureGraphics/
│   │   └── feature-graphic.svg       # 1024×500
│   └── android-technical-specs.md
│
├── Metadata/
│   ├── app-metadata.md               # All store listing text
│   ├── keywords.txt                  # iOS keywords
│   └── whats-new.txt                 # Release notes
│
├── Legal/
│   ├── privacy-policy.html           # Required by both stores
│   ├── terms-of-service.html
│   ├── eula.html
│   ├── data-safety-declaration.md    # For Play Store Data Safety
│   └── third-party-licenses.md
│
├── Marketing/
│   ├── press-kit.md                  # For media/press
│   ├── video-script.md               # App preview script
│   └── brand-guidelines.md           # Visual identity
│
├── TestingNotes/
│   ├── review-notes.md               # For App Store reviewers
│   └── qa-checklist.md               # Pre-submission testing
│
├── SUBMISSION_CHECKLIST.md           # Master checklist
└── README.md                         # This file
```

## 🚀 Quick Start

### 1. Generate PNG Icons from SVG

```bash
# iOS - using ImageMagick or similar
convert iOS/Icons/AppIcon-1024.svg iOS/Icons/AppIcon-1024.png

# Generate all sizes
for size in 40 60 58 87 80 120 180 20 29 76 152 167; do
  convert iOS/Icons/AppIcon-1024.png -resize ${size}x${size} iOS/Icons/AppIcon-${size}.png
done

# Android
convert Android/Icons/ic_launcher_foreground.svg Android/Icons/ic_launcher_foreground.png
convert Android/Icons/ic_launcher_background.svg Android/Icons/ic_launcher_background.png
convert Android/FeatureGraphics/feature-graphic.svg Android/FeatureGraphics/feature-graphic.png
```

### 2. Create Screenshots

See `iOS/Screenshots/screenshot-guidelines.md` and `Android/Screenshots/screenshot-guidelines.md` for detailed instructions.

### 3. Host Legal Documents

Upload these files to your web server:
- `Legal/privacy-policy.html` → https://cognixis.app/privacy
- `Legal/terms-of-service.html` → https://cognixis.app/terms

### 4. Follow Submission Checklist

Open `SUBMISSION_CHECKLIST.md` and complete all items.

## 📋 Key Files

| File | Purpose |
|------|---------|
| `Metadata/app-metadata.md` | All store listing text (copy-paste ready) |
| `Legal/privacy-policy.html` | Required privacy policy |
| `SUBMISSION_CHECKLIST.md` | Complete pre-flight checklist |
| `TestingNotes/review-notes.md` | Notes for App Store reviewers |

## 🔧 Tools Needed

### Icon Generation
- [ImageMagick](https://imagemagick.org/) - Command-line conversion
- [Figma](https://figma.com/) - Design and export
- [App Icon Generator](https://appicon.co/) - Web-based

### Screenshots
- [Previewed.app](https://previewed.app/) - Mockup generator
- [Rotato](https://rotato.app/) - 3D device mockups
- [Figma](https://figma.com/) - Custom designs

### Video
- QuickTime (Mac) - Screen recording
- iMovie/DaVinci Resolve - Editing

## 📱 Submission URLs

- **App Store Connect:** https://appstoreconnect.apple.com
- **Google Play Console:** https://play.google.com/console

## 📞 Support

- Email: appstore@cognixis.app
- Developer: Octa Square

---

*Package created: January 3, 2026*
*App Version: 1.0.0*

