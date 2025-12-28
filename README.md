# Steve - Meta Pet

A cosmic digital companion experience built on the "Temple With Curtains" freemium philosophy.

## 🌌 Overview

Steve (Meta-Pet) is a TypeScript/React configuration and feature-gating library for building freemium digital companion applications. It implements a sophisticated three-tier business model that balances free user experience with premium value.

## ✨ Features

### Core Configuration System
- **Tier-based feature gating** (FREE, PREMIUM, MYTHIC)
- **Immutable configuration** with reactive updates
- **Type-safe TypeScript** interfaces
- **React hooks** for easy integration
- **Comprehensive testing** suite

### Design System
- **Cosmic, mystical aesthetic** with glass morphism effects
- **Animated particle fields** that respond to emotional states
- **Non-punishing paywalls** with gentle upgrade prompts
- **Responsive layouts** optimized for all devices
- **Accessibility-focused** with WCAG AA compliance

## 🎨 Design System

The Meta-Pet design system features:

- **Deep space color palette** with cosmic gradients
- **Glass morphism components** with blur and transparency
- **Smooth animations** using GPU-accelerated transforms
- **Interactive particle effects** for visual feedback
- **Tier-specific visual indicators** (Free/Premium/Mythic badges)

### View the Design System

```bash
# Open the interactive demo
open meta-pet-core/demo.html

# Read the design documentation
cat meta-pet-core/DESIGN_SYSTEM.md
```

## 🏗️ Project Structure

```
Steve--/
├── meta-pet-core/
│   ├── appConfig.ts                  # Core configuration system
│   ├── useAppConfig.ts               # React hooks
│   ├── configIntegrationExamples.tsx # Integration examples
│   ├── styles.css                    # Design system CSS
│   ├── demo.html                     # Interactive demo
│   ├── DESIGN_SYSTEM.md             # Design documentation
│   ├── FREEMIUM_STRATEGY.md         # Business model docs
│   ├── MIGRATION_GUIDE.md           # Integration guide
│   └── tests/
│       └── appConfig.sanity.ts      # Config tests
├── README.md                         # This file
└── LICENSE                           # MIT License
```

## 🚀 Quick Start

### 1. Integration

```typescript
import { useAppConfig } from './meta-pet-core/useAppConfig';

function MyComponent() {
  const { config, tier, canUseFeature } = useAppConfig();

  // Check feature availability
  if (canUseFeature('genome.showGenomeLab')) {
    return <GenomeLab />;
  }

  // Show upgrade prompt
  return <UpgradePrompt feature="genomeLab" />;
}
```

### 2. Styling

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="meta-pet-core/styles.css">
</head>
<body>
  <div class="genome-display glass">
    <!-- Your components -->
  </div>
</body>
</html>
```

## 🎯 Freemium Tiers

### 🌱 Free Tier: "Soul Garden"
- 1 companion
- 8 curated emotions
- Evolution to NEURO stage (2/4)
- Base cosmetic collection
- 2 sound scales

### 💜 Premium Tier: "Expanded Garden"
**$4.99/mo • $39.99/yr • $99.99 lifetime**

- 5 companions
- 15 emotions (full spectrum)
- Full evolution (all 4 stages)
- All cosmetic packs
- 4 sound scales
- Cloud sync & multi-device

### ⭐ Mythic Tier: "Cathedral"
**$9.99/mo • $79.99/yr • $199.99 lifetime**

- 20 companions
- 15 emotions
- Full evolution
- All cosmetics
- 4 sound scales
- Deep memory (500 entries)
- Raw DNA viewer
- Mathematical readouts

## 📚 Documentation

- **[Design System](meta-pet-core/DESIGN_SYSTEM.md)** - Complete design language reference
- **[Freemium Strategy](meta-pet-core/FREEMIUM_STRATEGY.md)** - Business model details
- **[Migration Guide](meta-pet-core/MIGRATION_GUIDE.md)** - Integration instructions

## 🎨 Design Highlights

### Color Palette
- **Cosmic Foundation:** Deep space blacks and purples (#0a0118 → #6b46c1)
- **Accent Colors:** Celestial purples, quantum blues, energy greens
- **Gradients:** Cosmic, ethereal, quantum, and energy gradients

### Key Components
- **Glass Morphism Cards** - Frosted containers with backdrop blur
- **Animated Stat Bars** - Smooth gradient fills with shimmer effects
- **Particle Fields** - Dynamic particles responding to emotional states
- **Ritual Buttons** - Interactive elements with hover glow
- **DNA Viewer** - Color-coded genetic strand display
- **Upgrade Prompts** - Non-punishing paywalls with gentle CTAs

### Animations
- Cosmic background drift (20s loop)
- Gentle bounce for emojis (2s loop)
- Pulse glow for active elements (3s loop)
- Shimmer effect on stat bars (2s loop)
- Cursor particle trails on interaction

## 🛠️ Development

### Running Tests
```bash
# Run sanity tests
npm test
```

### Viewing the Demo
```bash
# Open in browser
open meta-pet-core/demo.html
```

## 🎯 Design Philosophy

### Temple With Curtains
> "A freemium companion app dies the moment free users feel emotionally punished."

**Core Principles:**
1. ✅ Never paywall the core bond/personality
2. ✅ Make locked features visible (creates desire without punishment)
3. ✅ Gate EXPANSION, DEPTH, DELIGHT, and CONVENIENCE
4. ✅ Free tier is complete, not a demo
5. ✅ Premium users get meaningful value

## 🤝 Contributing

This is a personal project, but suggestions and feedback are welcome!

## 📄 License

MIT License - See [LICENSE](LICENSE) for details

---

**Built with ✨ cosmic wonder for digital companions**
