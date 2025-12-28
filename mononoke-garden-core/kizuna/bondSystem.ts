/**
 * Mononoke Garden - Kizuna (絆) Bond System
 *
 * 7 levels of sacred bonding:
 * 1. 見つけた (Found) - Initial connection
 * 2. 友達 (Friend) - Morning prayer unlocks
 * 3. 家族 (Family) - Midday play unlocks
 * 4. 魂 (Soul-Bound) - Evening meal unlocks
 * 5. 共鳴 (Resonance) - Night stories unlocks
 * 6. 永遠 (Eternal) - Meditation unlocks
 * 7. 輪廻 (Reincarnation) - Breeding unlocks
 *
 * Philosophy: Progression is emotional, not numerical
 */

export type KizunaLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface KizunaTier {
  level: KizunaLevel;
  nameJP: string;
  nameEN: string;
  kanji: string;
  descriptionJP: string;
  descriptionEN: string;
  requiredXP: number;
  unlockedRituals: string[];
  icon: string;
}

// ===== KIZUNA TIER DEFINITIONS =====

export const KIZUNA_TIERS: Record<KizunaLevel, KizunaTier> = {
  1: {
    level: 1,
    nameJP: '見つけた',
    nameEN: 'Found',
    kanji: '見',
    descriptionJP: '初めての出会い',
    descriptionEN: 'Initial connection',
    requiredXP: 0,
    unlockedRituals: ['morning_prayer'],
    icon: '🌱',
  },

  2: {
    level: 2,
    nameJP: '友達',
    nameEN: 'Friend',
    kanji: '友',
    descriptionJP: '友情が芽生える',
    descriptionEN: 'Friendship blooms',
    requiredXP: 100,
    unlockedRituals: ['morning_prayer', 'midday_play'],
    icon: '🌸',
  },

  3: {
    level: 3,
    nameJP: '家族',
    nameEN: 'Family',
    kanji: '家',
    descriptionJP: '家族のような絆',
    descriptionEN: 'Bond like family',
    requiredXP: 300,
    unlockedRituals: ['morning_prayer', 'midday_play', 'evening_meal'],
    icon: '🏮',
  },

  4: {
    level: 4,
    nameJP: '魂',
    nameEN: 'Soul-Bound',
    kanji: '魂',
    descriptionJP: '魂の繋がり',
    descriptionEN: 'Connection of souls',
    requiredXP: 600,
    unlockedRituals: ['morning_prayer', 'midday_play', 'evening_meal', 'night_story'],
    icon: '✨',
  },

  5: {
    level: 5,
    nameJP: '共鳴',
    nameEN: 'Resonance',
    kanji: '共',
    descriptionJP: '心が共鳴する',
    descriptionEN: 'Hearts resonate',
    requiredXP: 1000,
    unlockedRituals: ['morning_prayer', 'midday_play', 'evening_meal', 'night_story', 'meditation'],
    icon: '🔮',
  },

  6: {
    level: 6,
    nameJP: '永遠',
    nameEN: 'Eternal',
    kanji: '永',
    descriptionJP: '永遠の絆',
    descriptionEN: 'Eternal bond',
    requiredXP: 1500,
    unlockedRituals: ['morning_prayer', 'midday_play', 'evening_meal', 'night_story', 'meditation', 'shrine_visit'],
    icon: '💫',
  },

  7: {
    level: 7,
    nameJP: '輪廻',
    nameEN: 'Reincarnation',
    kanji: '輪',
    descriptionJP: '魂の継承',
    descriptionEN: 'Legacy of souls',
    requiredXP: 2200,
    unlockedRituals: ['morning_prayer', 'midday_play', 'evening_meal', 'night_story', 'meditation', 'shrine_visit', 'breeding_ceremony'],
    icon: '👶',
  },
};

// ===== KIZUNA STATE =====

export interface KizunaState {
  level: KizunaLevel;
  xp: number;
  lastInteraction: Date;
  totalRitualsPerformed: number;
  consecutiveDays: number;
  missedDays: number;
}

/**
 * Create initial Kizuna state
 */
export function createKizunaState(): KizunaState {
  return {
    level: 1,
    xp: 0,
    lastInteraction: new Date(),
    totalRitualsPerformed: 0,
    consecutiveDays: 1,
    missedDays: 0,
  };
}

/**
 * Add XP to Kizuna state
 */
export function addKizunaXP(state: KizunaState, amount: number): KizunaState {
  const newXP = state.xp + amount;
  const newLevel = calculateLevel(newXP);

  return {
    ...state,
    xp: newXP,
    level: newLevel,
    totalRitualsPerformed: state.totalRitualsPerformed + 1,
    lastInteraction: new Date(),
  };
}

/**
 * Calculate Kizuna level from XP
 */
export function calculateLevel(xp: number): KizunaLevel {
  if (xp >= 2200) return 7;
  if (xp >= 1500) return 6;
  if (xp >= 1000) return 5;
  if (xp >= 600) return 4;
  if (xp >= 300) return 3;
  if (xp >= 100) return 2;
  return 1;
}

/**
 * Get XP needed for next level
 */
export function getXPForNextLevel(currentLevel: KizunaLevel): number {
  if (currentLevel >= 7) return 0; // Max level

  const nextLevel = (currentLevel + 1) as KizunaLevel;
  return KIZUNA_TIERS[nextLevel].requiredXP;
}

/**
 * Get XP progress to next level (0-1)
 */
export function getLevelProgress(state: KizunaState): number {
  if (state.level >= 7) return 1; // Max level

  const currentTier = KIZUNA_TIERS[state.level];
  const nextTier = KIZUNA_TIERS[(state.level + 1) as KizunaLevel];

  const xpIntoLevel = state.xp - currentTier.requiredXP;
  const xpNeededForLevel = nextTier.requiredXP - currentTier.requiredXP;

  return Math.min(1, xpIntoLevel / xpNeededForLevel);
}

/**
 * Check if a ritual is unlocked at current level
 */
export function isRitualUnlocked(state: KizunaState, ritual: string): boolean {
  const tier = KIZUNA_TIERS[state.level];
  return tier.unlockedRituals.includes(ritual);
}

/**
 * Get all unlocked rituals at current level
 */
export function getUnlockedRituals(state: KizunaState): string[] {
  return KIZUNA_TIERS[state.level].unlockedRituals;
}

// ===== DAILY RITUALS & XP =====

export interface RitualXPConfig {
  baseXP: number;
  consecutiveDayBonus: number; // Multiplier per consecutive day
  seasonalBonus?: number; // Seasonal event bonus
  passBonus?: number; // Kizuna Pass bonus
}

export const RITUAL_XP_CONFIG: Record<string, RitualXPConfig> = {
  morning_prayer: {
    baseXP: 15,
    consecutiveDayBonus: 0.1,
  },
  midday_play: {
    baseXP: 12,
    consecutiveDayBonus: 0.1,
  },
  evening_meal: {
    baseXP: 12,
    consecutiveDayBonus: 0.1,
  },
  night_story: {
    baseXP: 10,
    consecutiveDayBonus: 0.1,
  },
  meditation: {
    baseXP: 20,
    consecutiveDayBonus: 0.15,
  },
  shrine_visit: {
    baseXP: 25,
    consecutiveDayBonus: 0.2,
  },
  breeding_ceremony: {
    baseXP: 50,
    consecutiveDayBonus: 0.0, // One-time event
  },

  // Seasonal rituals
  sakura_viewing: {
    baseXP: 30,
    consecutiveDayBonus: 0.1,
    seasonalBonus: 1.0, // 2x during Risshun
  },
  moon_viewing: {
    baseXP: 30,
    consecutiveDayBonus: 0.1,
    seasonalBonus: 1.0, // 2x during Kanro
  },
  tea_ceremony: {
    baseXP: 18,
    consecutiveDayBonus: 0.1,
  },
  lantern_lighting: {
    baseXP: 18,
    consecutiveDayBonus: 0.1,
  },
  shrine_cleaning: {
    baseXP: 15,
    consecutiveDayBonus: 0.1,
  },
};

/**
 * Calculate XP gained from performing a ritual
 */
export function calculateRitualXP(
  ritual: string,
  state: KizunaState,
  bonuses: {
    hasPass?: boolean;
    seasonalBonus?: number;
  } = {}
): number {
  const config = RITUAL_XP_CONFIG[ritual];
  if (!config) return 10; // Default

  let xp = config.baseXP;

  // Consecutive day bonus
  const consecutiveBonus = 1 + (config.consecutiveDayBonus * state.consecutiveDays);
  xp *= consecutiveBonus;

  // Seasonal bonus
  if (bonuses.seasonalBonus && config.seasonalBonus) {
    xp *= (1 + config.seasonalBonus);
  }

  // Kizuna Pass bonus
  if (bonuses.hasPass) {
    xp *= 1.5;
  }

  return Math.round(xp);
}

/**
 * Update consecutive days streak
 */
export function updateConsecutiveDays(state: KizunaState): KizunaState {
  const now = new Date();
  const lastInteraction = state.lastInteraction;

  const daysSinceLastInteraction = Math.floor(
    (now.getTime() - lastInteraction.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysSinceLastInteraction === 0) {
    // Same day, no change
    return state;
  } else if (daysSinceLastInteraction === 1) {
    // Next day, increase streak
    return {
      ...state,
      consecutiveDays: state.consecutiveDays + 1,
      missedDays: 0,
    };
  } else {
    // Missed days, reset streak
    return {
      ...state,
      consecutiveDays: 1,
      missedDays: state.missedDays + daysSinceLastInteraction - 1,
    };
  }
}

/**
 * Apply gentle penalty for missed days
 * Philosophy: Never harsh, just gentle reminder
 */
export function applyMissedDaysPenalty(state: KizunaState): KizunaState {
  const now = new Date();
  const lastInteraction = state.lastInteraction;

  const daysSinceLastInteraction = Math.floor(
    (now.getTime() - lastInteraction.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysSinceLastInteraction > 7) {
    // After 7 days, lose small amount of XP (never levels)
    const penalty = Math.min(50, state.xp * 0.05); // Max 5% or 50 XP
    const currentLevelMinXP = KIZUNA_TIERS[state.level].requiredXP;

    return {
      ...state,
      xp: Math.max(currentLevelMinXP, state.xp - penalty),
      missedDays: daysSinceLastInteraction,
    };
  }

  return state;
}

// ===== KIZUNA MANDALA (7-POINTED STAR) =====

/**
 * Calculate mandala points for 7-pointed star visualization
 * Returns array of {x, y} coordinates
 */
export function calculateMandalaPoints(
  centerX: number,
  centerY: number,
  radius: number,
  currentLevel: KizunaLevel
): Array<{ x: number; y: number; level: KizunaLevel; active: boolean }> {
  const points: Array<{ x: number; y: number; level: KizunaLevel; active: boolean }> = [];

  for (let i = 0; i < 7; i++) {
    const angle = (i * 2 * Math.PI) / 7 - Math.PI / 2; // Start at top
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    const level = (i + 1) as KizunaLevel;

    points.push({
      x,
      y,
      level,
      active: level <= currentLevel,
    });
  }

  return points;
}

/**
 * Generate SVG path for mandala
 */
export function generateMandalaPath(
  points: Array<{ x: number; y: number }>
): string {
  if (points.length === 0) return '';

  const start = points[0];
  let path = `M ${start.x} ${start.y}`;

  for (let i = 1; i < points.length; i++) {
    path += ` L ${points[i].x} ${points[i].y}`;
  }

  path += ' Z'; // Close path

  return path;
}

// ===== UTILITIES =====

/**
 * Get Kizuna tier display info
 */
export function getKizunaTierInfo(level: KizunaLevel): KizunaTier {
  return KIZUNA_TIERS[level];
}

/**
 * Format XP display (with thousands separator)
 */
export function formatXP(xp: number): string {
  return xp.toLocaleString('ja-JP');
}

/**
 * Check if companion can breed (must be level 7)
 */
export function canBreed(state: KizunaState): boolean {
  return state.level >= 7;
}

/**
 * Get congratulations message for level up
 */
export function getLevelUpMessage(newLevel: KizunaLevel): string {
  const tier = KIZUNA_TIERS[newLevel];
  return `レベルアップ！${tier.nameJP}（${tier.nameEN}）に到達しました！${tier.icon}`;
}

/**
 * Serialize Kizuna state
 */
export function serializeKizunaState(state: KizunaState): string {
  return JSON.stringify({
    ...state,
    lastInteraction: state.lastInteraction.toISOString(),
  });
}

/**
 * Deserialize Kizuna state
 */
export function deserializeKizunaState(json: string): KizunaState {
  const data = JSON.parse(json);
  return {
    ...data,
    lastInteraction: new Date(data.lastInteraction),
  };
}
