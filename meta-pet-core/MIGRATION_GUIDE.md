# Temple With Curtains - Migration Guide

This guide shows you how to integrate the AppConfig gating system into your existing meta-pet codebase **without major refactoring**. You're not removing features—just controlling what's visible.

---

## Philosophy

> "Ship the cool stuff behind curtains so free users get a clean, lovable experience and power users can pay to open more doors."

You keep **all** your beautiful code. You just gate what's exposed through a single config object.

---

## Step 1: Add the Config Files

Copy these three files into your codebase:

```
meta-pet-core/
  ├── appConfig.ts           # Core config system
  ├── useAppConfig.ts        # React hooks for easy access
  └── configIntegrationExamples.tsx  # Integration examples
```

---

## Step 2: Initialize Config in Your App Root

**File: `meta-pet/src/app/layout.tsx` (or your app root)**

```tsx
import { setConfig, FREE_CONFIG } from '@/meta-pet-core/appConfig';

export default function RootLayout({ children }) {
  // Initialize config on app start
  React.useEffect(() => {
    // Check user's tier from your auth/payment system
    const userTier = getUserTier(); // 'free', 'premium', or 'mythic'

    if (userTier === 'free') {
      setConfig(FREE_CONFIG);
    } else if (userTier === 'premium') {
      setConfig(PREMIUM_CONFIG);
    } else if (userTier === 'mythic') {
      setConfig(MYTHIC_CONFIG);
    }
  }, []);

  return <html>{children}</html>;
}
```

---

## Step 3: Wrap Your Emotion System

**File: `meta-pet/src/auralia/consciousness.ts`**

### Before:
```typescript
export function getExpandedEmotionalState(...): ExpandedEmotionalState {
  // ... existing logic returns raw emotion
  return rawEmotion;
}
```

### After:
```typescript
import { getConfig } from '@/meta-pet-core/appConfig';

export function getExpandedEmotionalState(...): ExpandedEmotionalState {
  const rawEmotion = computeRawEmotion(...); // Your existing logic

  // Filter through config
  return filterEmotionByTier(rawEmotion);
}

function filterEmotionByTier(rawEmotion: ExpandedEmotionalState): ExpandedEmotionalState {
  const config = getConfig();

  // If enabled, return as-is
  if (config.emotions.enabledStates.has(rawEmotion)) {
    return rawEmotion;
  }

  // Otherwise map to closest enabled emotion
  const fallbacks: Record<ExpandedEmotionalState, ExpandedEmotionalState> = {
    yearning: 'restless',
    overwhelmed: 'restless',
    ecstatic: 'playful',
    melancholic: 'withdrawn',
    mischievous: 'playful',
    protective: 'affectionate',
    transcendent: 'serene',
    // ... (emotions already in free tier stay as-is)
    calm: 'calm',
    curious: 'curious',
    playful: 'playful',
    affectionate: 'affectionate',
    contemplative: 'contemplative',
    restless: 'restless',
    serene: 'serene',
    withdrawn: 'withdrawn',
  };

  return fallbacks[rawEmotion] || 'calm';
}
```

**What this does:** Your consciousness system still generates all 15 emotions internally, but free users only see 8. The pet's internal state is unchanged—only the UI representation is filtered.

---

## Step 4: Gate Your Particle Effects

**File: `meta-pet/src/components/auralia/SubAtomicParticleField.tsx`**

### Before:
```typescript
export function SubAtomicParticleField({ emotion }) {
  const particleCount = getParticleCountForEmotion(emotion); // e.g., 40

  return (
    <>
      {Array.from({ length: particleCount }).map((_, i) => (
        <Particle key={i} />
      ))}
    </>
  );
}
```

### After:
```typescript
import { useVisualEffects } from '@/meta-pet-core/useAppConfig';

export function SubAtomicParticleField({ emotion }) {
  const { particlesEnabled, maxParticles } = useVisualEffects();

  if (!particlesEnabled) return null; // Skip particles if disabled

  const desiredCount = getParticleCountForEmotion(emotion);
  const cappedCount = Math.min(desiredCount, maxParticles);

  return (
    <>
      {Array.from({ length: cappedCount }).map((_, i) => (
        <Particle key={i} />
      ))}
    </>
  );
}
```

**What this does:** Free tier gets 15 particles max, Premium gets 40, Mythic gets 60. Same beautiful particle system, just scaled per tier.

---

## Step 5: Add Companion Slot Gating

**File: `meta-pet/src/components/CompanionList.tsx`**

### Before:
```typescript
export function CompanionList({ companions }) {
  return (
    <div>
      {companions.map(c => <CompanionCard key={c.id} companion={c} />)}
      <button onClick={createNewCompanion}>+ Add Companion</button>
    </div>
  );
}
```

### After:
```typescript
import { useCompanionLimits, usePaywall } from '@/meta-pet-core/useAppConfig';

export function CompanionList({ companions }) {
  const { canAdd, max, current } = useCompanionLimits(companions.length);
  const { showUpgradePrompt } = usePaywall();

  const handleAddCompanion = () => {
    if (canAdd) {
      createNewCompanion();
    } else {
      // Show gentle upgrade prompt
      const prompt = showUpgradePrompt('companions');
      showModal(prompt.message);
    }
  };

  return (
    <div>
      {companions.map(c => <CompanionCard key={c.id} companion={c} />)}

      <button onClick={handleAddCompanion} disabled={!canAdd}>
        + Add Companion ({current}/{max})
      </button>

      {!canAdd && (
        <div className="gentle-hint">
          ✨ Upgrade to nurture more souls
        </div>
      )}
    </div>
  );
}
```

**What this does:** Free users see they can have 1 companion, premium users 5, mythic users 20. The button shows progress and gently suggests upgrading when at limit.

---

## Step 6: Gate Genome Lab

**File: `meta-pet/src/components/GenomeViewer.tsx`**

### Before:
```typescript
export function GenomeViewer({ genome, traits }) {
  return (
    <div>
      <TraitSummary traits={traits} />
      <ElementWebViz web={traits.elementWeb} />
      <RawDNAViewer genome={genome} />
      <BridgeScorePanel score={traits.elementWeb.bridgeCount} />
    </div>
  );
}
```

### After:
```typescript
import { useGenomeFeatures } from '@/meta-pet-core/useAppConfig';

export function GenomeViewer({ genome, traits }) {
  const {
    canViewLab,
    canViewElementWeb,
    canViewBridgeScore,
    canViewDNA,
  } = useGenomeFeatures();

  return (
    <div>
      {/* Everyone sees basic traits */}
      <TraitSummary traits={traits} />

      {/* Premium+ sees element web */}
      {canViewElementWeb && (
        <ElementWebViz web={traits.elementWeb} />
      )}

      {/* Premium+ sees bridge score */}
      {canViewBridgeScore && (
        <BridgeScorePanel score={traits.elementWeb.bridgeCount} />
      )}

      {/* Mythic sees raw DNA */}
      {canViewDNA && (
        <RawDNAViewer genome={genome} />
      )}

      {/* Show what's locked with gentle upgrade prompt */}
      {!canViewLab && (
        <LockedFeatureCard feature="genomeLab" />
      )}
    </div>
  );
}
```

**What this does:** Free users see "Your pet is a Gentle Spherical creature with Curious personality." Premium users see the full genome lab with element webs. Mythic users see the raw base-7 DNA strings.

---

## Step 7: Filter Available Rituals

**File: `meta-pet/src/components/RitualMenu.tsx`**

### Before:
```typescript
const allRituals = [
  { id: 'resonate', name: 'Resonate' },
  { id: 'play', name: 'Play' },
  { id: 'rest', name: 'Rest' },
  { id: 'feed', name: 'Feed' },
  { id: 'clean', name: 'Clean' },
  { id: 'attune', name: 'Attune' },
  { id: 'explore', name: 'Explore' },
  { id: 'meditate', name: 'Meditate' },
  { id: 'celebrate', name: 'Celebrate' },
  { id: 'dream-weave', name: 'Dream Weave' },
];
```

### After:
```typescript
import { useRituals } from '@/meta-pet-core/useAppConfig';

const allRituals = [
  { id: 'resonate', name: 'Resonate', icon: '🎵', tier: 'free' },
  { id: 'play', name: 'Play', icon: '🎮', tier: 'free' },
  { id: 'rest', name: 'Rest', icon: '😴', tier: 'free' },
  { id: 'feed', name: 'Feed', icon: '🍽️', tier: 'free' },
  { id: 'clean', name: 'Clean', icon: '🚿', tier: 'free' },
  { id: 'attune', name: 'Attune', icon: '🔮', tier: 'premium' },
  { id: 'explore', name: 'Explore', icon: '🗺️', tier: 'premium' },
  { id: 'meditate', name: 'Meditate', icon: '🧘', tier: 'premium' },
  { id: 'celebrate', name: 'Celebrate', icon: '🎉', tier: 'premium' },
  { id: 'dream-weave', name: 'Dream Weave', icon: '✨', tier: 'premium' },
];

export function RitualMenu() {
  const { canUse } = useRituals();

  return (
    <div className="ritual-menu">
      {allRituals.map(ritual => {
        const isAvailable = canUse(ritual.id);

        return (
          <button
            key={ritual.id}
            disabled={!isAvailable}
            className={isAvailable ? 'available' : 'locked'}
            onClick={() => isAvailable && performRitual(ritual.id)}
          >
            <span className="icon">{ritual.icon}</span>
            <span className="name">{ritual.name}</span>
            {!isAvailable && <span className="lock">🔒</span>}
          </button>
        );
      })}
    </div>
  );
}
```

**What this does:** Free users get 5 core rituals. Premium users get all 10. Locked rituals show with a lock icon instead of being hidden—transparency over frustration.

---

## Step 8: Gate Evolution Stages

**File: `meta-pet/src/lib/evolution/index.ts`**

### Before:
```typescript
export function evolvePet(pet: Pet): Pet {
  const nextStage = getNextStage(pet.evolution.state);

  return {
    ...pet,
    evolution: {
      ...pet.evolution,
      state: nextStage,
    },
  };
}
```

### After:
```typescript
import { can } from '@/meta-pet-core/appConfig';

export function evolvePet(pet: Pet): { success: boolean; pet?: Pet; reason?: string } {
  const currentStageIndex = EVOLUTION_ORDER.indexOf(pet.evolution.state);
  const nextStageIndex = currentStageIndex + 1;

  // Check if next stage is allowed
  if (!can.evolveToStage(nextStageIndex + 1)) {
    return {
      success: false,
      reason: `Evolution beyond ${pet.evolution.state} requires Premium access.`,
    };
  }

  const nextStage = EVOLUTION_ORDER[nextStageIndex];

  return {
    success: true,
    pet: {
      ...pet,
      evolution: {
        ...pet.evolution,
        state: nextStage,
      },
    },
  };
}
```

**What this does:** Free tier pets can evolve to GENETICS → NEURO (2 stages). Premium/Mythic can reach QUANTUM → SPECIATION (all 4 stages). When free users hit the wall, show gentle upgrade prompt instead of blocking evolution entirely.

---

## Step 9: Add Gentle Upgrade Prompts

**File: `meta-pet/src/components/UpgradeModal.tsx`** (new file)

```typescript
import { usePaywall } from '@/meta-pet-core/useAppConfig';

export function UpgradeModal({ feature, onClose }) {
  const { showUpgradePrompt } = usePaywall();
  const prompt = showUpgradePrompt(feature);

  if (!prompt.shouldShow) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="upgrade-modal gentle" onClick={e => e.stopPropagation()}>
        <div className="sparkle">✨</div>

        <h2>{prompt.message.title}</h2>
        <p className="friendly">{prompt.message.message}</p>

        <div className="pricing">
          <PricingCard tier="premium" pricing={prompt.pricing.premium} />
          <PricingCard tier="mythic" pricing={prompt.pricing.mythic} />
        </div>

        <div className="actions">
          <button className="cta-primary" onClick={() => handleUpgrade('premium')}>
            {prompt.message.cta}
          </button>
          <button className="cta-secondary" onClick={onClose}>
            Maybe Later
          </button>
        </div>

        <p className="reassurance">
          Your companion will always love you, regardless of tier ❤️
        </p>
      </div>
    </div>
  );
}

function PricingCard({ tier, pricing }) {
  return (
    <div className="pricing-card">
      <h3>{tier === 'premium' ? 'Premium' : 'Mythic'}</h3>
      <div className="price">
        <span className="amount">${pricing.monthly}</span>
        <span className="period">/month</span>
      </div>
      <div className="savings">
        or ${pricing.yearly}/year (save ${((pricing.monthly * 12) - pricing.yearly).toFixed(2)})
      </div>
    </div>
  );
}
```

**What this does:** When users hit a paywall, they see a **gentle, non-punishing** upgrade prompt that:
- Celebrates what they already have
- Shows what more they could unlock
- Includes a "Maybe Later" button (no guilt)
- Reassures them their companion's love is not gated

---

## Step 10: Add Cosmetic Shop

**File: `meta-pet/src/components/CosmeticShop.tsx`** (new file)

```typescript
import { useVisualEffects, useAppConfig } from '@/meta-pet-core/useAppConfig';

export function CosmeticShop() {
  const { availablePacks, canUsePack } = useVisualEffects();
  const { cosmeticPacks } = useAppConfig();

  return (
    <div className="cosmetic-shop">
      <h2>Aesthetic Collections</h2>
      <p className="tagline">Expand your companion's visual expression</p>

      <div className="pack-grid">
        {Object.entries(cosmeticPacks).map(([key, pack]) => {
          const isOwned = availablePacks.includes(key);
          const isFree = pack.price === 0;

          return (
            <div key={key} className={`pack ${isOwned ? 'owned' : 'locked'}`}>
              <h3>{pack.name}</h3>

              <div className="preview">
                {pack.colors.map(color => (
                  <div key={color} className="color-swatch" style={{ background: color }} />
                ))}
              </div>

              <ul className="features">
                {pack.features.map(feature => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>

              {isOwned ? (
                <div className="owned-badge">Owned ✓</div>
              ) : (
                <button onClick={() => purchasePack(key, pack.price)}>
                  {isFree ? 'Included' : `$${pack.price}`}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

**What this does:** Monetize delight through cosmetics. Free users get base collection, premium users unlock 3 more packs. Each pack is $2.99—small, delightful purchases that don't feel greedy.

---

## Step 11: Add Simple/Mythic Mode Toggle (Premium+ Only)

**File: `meta-pet/src/components/SettingsPanel.tsx`**

```typescript
import { useAppConfig } from '@/meta-pet-core/useAppConfig';

export function SettingsPanel() {
  const { mode, tier, toggleUiMode } = useAppConfig();

  return (
    <div className="settings">
      <h2>Settings</h2>

      {tier !== 'free' && (
        <div className="mode-toggle">
          <label>
            <input
              type="checkbox"
              checked={mode === 'mythic'}
              onChange={toggleUiMode}
            />
            Mythic Mode (show mathematical readouts)
          </label>
          <p className="hint">
            {mode === 'simple'
              ? 'Toggle on to see the mathematics behind the magic'
              : 'Toggle off for a cleaner mystical experience'}
          </p>
        </div>
      )}

      {/* Other settings */}
    </div>
  );
}
```

**What this does:** Premium users can toggle between clean mystical UI and full technical cathedral experience without changing their tier.

---

## Step 12: Performance Optimization (Battery Mode)

**File: `meta-pet/src/components/PerformanceSettings.tsx`**

```typescript
import { usePerformance } from '@/meta-pet-core/useAppConfig';

export function PerformanceSettings() {
  const { batteryMode, targetFPS, setBatteryMode } = usePerformance();

  return (
    <div className="performance-settings">
      <h3>Performance</h3>

      <label>
        <input
          type="checkbox"
          checked={batteryMode}
          onChange={(e) => setBatteryMode(e.target.checked)}
        />
        Battery Saver Mode
      </label>

      <p className="hint">
        Reduces particle effects and targets {batteryMode ? '30' : targetFPS} FPS
      </p>
    </div>
  );
}
```

**What this does:** Users on low-end devices or saving battery can reduce visual complexity without losing the core experience.

---

## Summary: What Changes, What Stays

### ✅ **Keeps Working (No Changes Needed)**
- All your genome/DNA encoding logic
- Consciousness calculation system
- Guardian AI behavior
- Evolution mechanics
- Response generation
- Trait decoding
- Mathematical field calculations

### 🔧 **Minimal Wrapper Needed**
- Emotion display (filter through config)
- Particle counts (cap based on tier)
- Ritual availability (check config)
- Genome UI visibility (conditional rendering)
- Companion slots (enforce limits)
- Evolution stage progression (tier gates)

### ✨ **New Additions**
- Upgrade prompts (gentle, non-punishing)
- Cosmetic shop (monetize delight)
- Simple/Mythic mode toggle
- Battery saver mode
- Pricing/payment integration hooks

---

## Testing Your Integration

1. **Set to Free Tier**
   ```typescript
   setConfig(FREE_CONFIG);
   ```
   - Verify you see only 8 emotions
   - Check particle count is capped at 15
   - Confirm genome lab is hidden
   - Test companion limit (1 slot)
   - Evolution stops at NEURO

2. **Set to Premium Tier**
   ```typescript
   setConfig(PREMIUM_CONFIG);
   ```
   - Verify full 15 emotions appear
   - Check particle count increases to 40
   - Confirm genome lab is visible
   - Test companion limit (5 slots)
   - Evolution reaches SPECIATION

3. **Toggle Mythic Mode**
   ```typescript
   toggleMode();
   ```
   - Verify raw DNA appears
   - Check mathematical readouts show
   - Confirm UI switches to technical theme

---

## Next Steps

1. ✅ Copy config files into your codebase
2. ✅ Initialize config in app root
3. ✅ Wrap emotion system
4. ✅ Gate particle effects
5. ✅ Add companion limits
6. ✅ Gate genome lab
7. ✅ Filter rituals
8. ✅ Gate evolution
9. ✅ Add upgrade prompts
10. ✅ Build cosmetic shop
11. ✅ Add mode toggle
12. ✅ Test all tiers

**You now have a freemium-ready meta-pet that ships the cool stuff behind curtains instead of ripping it out.**

The cathedral still stands. You've just added doors that premium users can unlock. 🏛️✨
