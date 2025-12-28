/**
 * Mononoke Garden - Game Configuration System
 *
 * Japanese-market digital companion game with:
 * - 7-level Kizuna bond system
 * - Base-7 genetics (RED60, BLUE60, BLACK60)
 * - 7 Japanese seasons
 * - Ethical freemium monetization
 *
 * Philosophy: "Kizuna Through Daily Ritual"
 */

export type TierLevel = 'free' | 'kizuna_pass' | 'eternal';
export type GameMode = 'simple' | 'shrine'; // shrine = full view

export function cloneGameConfig(config: GameConfig): GameConfig {
  return {
    ...config,
    companions: { ...config.companions },
    kizuna: { ...config.kizuna },
    genetics: { ...config.genetics },
    personality: { ...config.personality },
    seasons: { ...config.seasons },
    rituals: {
      ...config.rituals,
      available: new Set(config.rituals.available),
    },
    breeding: { ...config.breeding },
    visuals: {
      ...config.visuals,
      cosmeticPacks: [...config.visuals.cosmeticPacks],
    },
    community: { ...config.community },
    data: { ...config.data },
  };
}

export interface GameConfig {
  // User's current tier
  tier: TierLevel;

  // UI mode
  mode: GameMode;

  // Companion limits
  companions: {
    maxSlots: number;
    canName: boolean;
    canCustomize: boolean;
  };

  // Kizuna (Bond) System
  kizuna: {
    maxLevel: number; // 7 levels total
    showLevelNames: boolean; // Show Japanese names
    showProgress: boolean; // Show XP progress
    showMandala: boolean; // Show 7-pointed mandala
    ritualXpMultiplier: number; // Bonus XP for rituals
  };

  // Genetics & Base-7 System
  genetics: {
    showPersonality: boolean; // Show personality traits
    showPersonalityScores: boolean; // Show 0-6 scores on axes
    showGenome: boolean; // Show raw RED60/BLUE60/BLACK60
    showInheritance: boolean; // Show parent traits
    canViewDNA: boolean; // Full genome viewer
  };

  // Personality (7 axes, 0-6 scale)
  personality: {
    showAxes: boolean; // Show personality spider chart
    showDrift: boolean; // Show personality evolution over time
    enableDrift: boolean; // Personality can change based on rituals
    showBehaviorTags: boolean; // Show behavior descriptions
  };

  // Seasonal System (7 Japanese seasons)
  seasons: {
    enableSeasons: boolean;
    showCalendar: boolean; // Show seasonal calendar
    showEvents: boolean; // Show seasonal events
    showCosmetics: boolean; // Show seasonal cosmetics
    unlockSeasonalContent: boolean; // Can unlock seasonal items
  };

  // Daily Rituals
  rituals: {
    available: Set<string>; // Which rituals are unlocked
    showEffects: boolean; // Show ritual outcomes
    showKizunaGain: boolean; // Show how much bond was gained
    enableAdvanced: boolean; // Advanced ritual interactions
  };

  // Breeding System
  breeding: {
    enabled: boolean;
    maxPerYear: number; // Breeding limit (1, 3, unlimited)
    showPedigree: boolean; // Show family tree
    showGeneticPreview: boolean; // Preview offspring traits
    canTradePedigree: boolean; // Share family trees
  };

  // Visual effects
  visuals: {
    enableSakuraFall: boolean; // Seasonal particle effects
    enableLanternGlow: boolean; // Shrine lantern animations
    enableToriiGates: boolean; // Navigation gates
    maxParticles: number; // Performance cap
    cosmeticPacks: string[]; // Available cosmetic packs
  };

  // Community features
  community: {
    enableTrading: boolean; // Trade companions
    enableBreedingNetwork: boolean; // Find breeding partners
    enableGlobalGoals: boolean; // Community events
    showLeaderboards: boolean; // Kizuna rankings
  };

  // Data & sync
  data: {
    enableCloudSync: boolean;
    enableMultiDevice: boolean;
    enableBackup: boolean;
    enableExport: boolean;
  };
}

// ===== TIER PRESETS =====

export const FREE_CONFIG: GameConfig = {
  tier: 'free',
  mode: 'simple',

  companions: {
    maxSlots: 1,
    canName: true,
    canCustomize: true,
  },

  kizuna: {
    maxLevel: 7, // All 7 levels available
    showLevelNames: true, // Show Japanese names
    showProgress: true,
    showMandala: false, // Locked to Pass+
    ritualXpMultiplier: 1.0,
  },

  genetics: {
    showPersonality: true, // Can see personality through behavior
    showPersonalityScores: false, // Scores hidden
    showGenome: false,
    showInheritance: false,
    canViewDNA: false,
  },

  personality: {
    showAxes: false, // Spider chart locked
    showDrift: false,
    enableDrift: true, // Personality still evolves
    showBehaviorTags: true, // See "Shy", "Playful" etc
  },

  seasons: {
    enableSeasons: true,
    showCalendar: true,
    showEvents: true,
    showCosmetics: true,
    unlockSeasonalContent: false, // Can see but not unlock
  },

  rituals: {
    available: new Set(['morning_prayer', 'midday_play', 'evening_meal', 'night_story', 'meditation']),
    showEffects: true,
    showKizunaGain: true,
    enableAdvanced: false,
  },

  breeding: {
    enabled: false, // Locked until Kizuna level 7
    maxPerYear: 0,
    showPedigree: false,
    showGeneticPreview: false,
    canTradePedigree: false,
  },

  visuals: {
    enableSakuraFall: true,
    enableLanternGlow: true,
    enableToriiGates: true,
    maxParticles: 20,
    cosmeticPacks: ['base'],
  },

  community: {
    enableTrading: false,
    enableBreedingNetwork: false,
    enableGlobalGoals: true, // Can see but not participate fully
    showLeaderboards: false,
  },

  data: {
    enableCloudSync: false,
    enableMultiDevice: false,
    enableBackup: false,
    enableExport: true,
  },
};

export const KIZUNA_PASS_CONFIG: GameConfig = {
  tier: 'kizuna_pass',
  mode: 'simple',

  companions: {
    maxSlots: 7, // Sacred number
    canName: true,
    canCustomize: true,
  },

  kizuna: {
    maxLevel: 7,
    showLevelNames: true,
    showProgress: true,
    showMandala: true, // ⭐ Unlocked
    ritualXpMultiplier: 1.5, // Faster bonding
  },

  genetics: {
    showPersonality: true,
    showPersonalityScores: true, // ⭐ Can see 0-6 scores
    showGenome: false, // Still hidden
    showInheritance: true,
    canViewDNA: false,
  },

  personality: {
    showAxes: true, // ⭐ Spider chart unlocked
    showDrift: true,
    enableDrift: true,
    showBehaviorTags: true,
  },

  seasons: {
    enableSeasons: true,
    showCalendar: true,
    showEvents: true,
    showCosmetics: true,
    unlockSeasonalContent: true, // ⭐ Can unlock seasonal items
  },

  rituals: {
    available: new Set([
      'morning_prayer', 'midday_play', 'evening_meal', 'night_story',
      'meditation', 'sakura_viewing', 'shrine_cleaning', 'lantern_lighting',
      'tea_ceremony', 'moon_viewing',
    ]),
    showEffects: true,
    showKizunaGain: true,
    enableAdvanced: true, // ⭐ Advanced interactions
  },

  breeding: {
    enabled: true, // ⭐ Breeding unlocked
    maxPerYear: 3,
    showPedigree: true,
    showGeneticPreview: true,
    canTradePedigree: true,
  },

  visuals: {
    enableSakuraFall: true,
    enableLanternGlow: true,
    enableToriiGates: true,
    maxParticles: 40,
    cosmeticPacks: ['base', 'sakura', 'shrine', 'celestial', 'seasonal'],
  },

  community: {
    enableTrading: true, // ⭐ Can trade
    enableBreedingNetwork: true, // ⭐ Find breeding partners
    enableGlobalGoals: true,
    showLeaderboards: true,
  },

  data: {
    enableCloudSync: true, // ⭐ Cloud sync
    enableMultiDevice: true,
    enableBackup: true,
    enableExport: true,
  },
};

export const ETERNAL_CONFIG: GameConfig = {
  ...KIZUNA_PASS_CONFIG,
  tier: 'eternal',
  mode: 'shrine', // Full cathedral view

  companions: {
    maxSlots: 20,
    canName: true,
    canCustomize: true,
  },

  kizuna: {
    maxLevel: 7,
    showLevelNames: true,
    showProgress: true,
    showMandala: true,
    ritualXpMultiplier: 2.0, // ⭐ Fastest bonding
  },

  genetics: {
    showPersonality: true,
    showPersonalityScores: true,
    showGenome: true, // ⭐ Raw genome visible
    showInheritance: true,
    canViewDNA: true, // ⭐ Full DNA viewer
  },

  breeding: {
    enabled: true,
    maxPerYear: 999, // ⭐ Unlimited
    showPedigree: true,
    showGeneticPreview: true,
    canTradePedigree: true,
  },

  visuals: {
    enableSakuraFall: true,
    enableLanternGlow: true,
    enableToriiGates: true,
    maxParticles: 60,
    cosmeticPacks: ['base', 'sakura', 'shrine', 'celestial', 'seasonal', 'mythic', 'eternal'],
  },
};

// ===== CONFIG MANAGEMENT =====

type ConfigChangeListener = (config: GameConfig) => void;

const configListeners = new Set<ConfigChangeListener>();

export function subscribeToConfigChanges(listener: ConfigChangeListener): () => void {
  configListeners.add(listener);
  return () => configListeners.delete(listener);
}

function notifyConfigChange(config: GameConfig): void {
  configListeners.forEach((listener) => listener(cloneGameConfig(config)));
}

let currentConfig: GameConfig = cloneGameConfig(FREE_CONFIG);

export function getConfig(): GameConfig {
  return cloneGameConfig(currentConfig);
}

export function setConfig(config: GameConfig): void {
  currentConfig = cloneGameConfig(config);
  notifyConfigChange(currentConfig);
}

export function upgradeTier(tier: TierLevel): void {
  switch (tier) {
    case 'free':
      currentConfig = cloneGameConfig(FREE_CONFIG);
      break;
    case 'kizuna_pass':
      currentConfig = cloneGameConfig(KIZUNA_PASS_CONFIG);
      break;
    case 'eternal':
      currentConfig = cloneGameConfig(ETERNAL_CONFIG);
      break;
  }

  notifyConfigChange(currentConfig);
}

export function toggleMode(): void {
  if (currentConfig.tier === 'free') {
    console.warn('Free tier cannot access Shrine Mode');
    return;
  }

  const base = cloneGameConfig(currentConfig);
  const nextMode = base.mode === 'simple' ? 'shrine' : 'simple';

  currentConfig = {
    ...base,
    mode: nextMode,
  };

  notifyConfigChange(currentConfig);
}

// ===== FEATURE CHECKS =====

export const can = {
  addCompanion: (currentCount: number) =>
    currentCount < currentConfig.companions.maxSlots,

  reachKizunaLevel: (level: number) =>
    level <= currentConfig.kizuna.maxLevel,

  seePersonalityScores: () =>
    currentConfig.genetics.showPersonalityScores,

  viewGenome: () =>
    currentConfig.genetics.canViewDNA,

  breed: () =>
    currentConfig.breeding.enabled,

  breedThisYear: (currentBreedings: number) =>
    currentConfig.breeding.enabled && currentBreedings < currentConfig.breeding.maxPerYear,

  trade: () =>
    currentConfig.community.enableTrading,

  useRitual: (ritual: string) =>
    currentConfig.rituals.available.has(ritual),

  unlockSeasonalCosmetic: () =>
    currentConfig.seasons.unlockSeasonalContent,

  syncToCloud: () =>
    currentConfig.data.enableCloudSync,

  viewMandala: () =>
    currentConfig.kizuna.showMandala,

  seePersonalityAxes: () =>
    currentConfig.personality.showAxes,
};

// ===== PRICING (Japanese Yen) =====

export const PRICING = {
  kizuna_pass: {
    monthly: 4990, // ¥4,990
    yearly: 39990, // ¥39,990 (33% savings)
  },
  eternal: {
    monthly: 9990, // ¥9,990
    yearly: 79990, // ¥79,990
    lifetime: 29990, // ¥29,990 (one-time)
  },
  cosmetics: {
    seasonal_pack: 600, // ¥600
    companion_slot: 2000, // ¥2,000 (adds +2 slots)
    festival_pass: 1500, // ¥1,500 per season
  },
};

// ===== PAYWALL MESSAGES (Japanese-focused) =====

export const PAYWALL_MESSAGES = {
  companions: {
    title: '庭を広げる', // Expand Your Garden
    titleEn: 'Expand Your Garden',
    message: 'あなたの仲間は元気です！もっと多くの魂を育てたいですか？',
    messageEn: 'Your companion thrives! Want to nurture more souls at once?',
    cta: '解除する',
    ctaEn: 'Unlock More Slots',
  },

  personalityScores: {
    title: '性格の深さ', // Personality Depth
    titleEn: 'Personality Depth',
    message: '仲間の性格軸を詳しく見ることができます。',
    messageEn: 'See the detailed personality axes that make your companion unique.',
    cta: 'きずなパスを開く',
    ctaEn: 'Open Kizuna Pass',
  },

  genome: {
    title: 'ゲノムラボ', // Genome Lab
    titleEn: 'Genome Lab',
    message: '仲間のDNAを数学的に探索できます。',
    messageEn: 'Explore the mathematical DNA that shapes your companion.',
    cta: '永遠のきずなへ',
    ctaEn: 'Enter Eternal Kizuna',
  },

  breeding: {
    title: '繁殖システム', // Breeding System
    titleEn: 'Breeding System',
    message: 'きずなレベル7で繁殖が解除されます。',
    messageEn: 'Breeding unlocks at Kizuna Level 7 with Kizuna Pass.',
    cta: 'きずなパスを開く',
    ctaEn: 'Open Kizuna Pass',
  },

  trading: {
    title: 'コミュニティ取引', // Community Trading
    titleEn: 'Community Trading',
    message: '他のプレイヤーと仲間を交換し、繁殖パートナーを見つけます。',
    messageEn: 'Trade companions and find breeding partners with other players.',
    cta: 'きずなパスを開く',
    ctaEn: 'Open Kizuna Pass',
  },

  cloudSync: {
    title: 'クラウド同期', // Cloud Sync
    titleEn: 'Cloud Sync',
    message: 'すべてのデバイスで仲間を安全に保ちます。',
    messageEn: 'Keep your companions safe across all your devices.',
    cta: '同期を有効にする',
    ctaEn: 'Enable Cloud Sync',
  },
};
