/**
 * Mononoke Garden - 7 Japanese Seasonal Calendar
 *
 * Based on traditional 72 micro-seasons (七十二候), condensed to 7 major seasons:
 * 1. Risshun (立春) - Feb 4, Spring Awakening
 * 2. Shōman (小満) - May 21, Gentle Rain
 * 3. Tsuyu (梅雨) - Jun 6, Plum Rains
 * 4. Shochō (小暑) - Jul 7, Star Festival ⭐
 * 5. Kanro (寒露) - Oct 8, Autumn Dew
 * 6. Rittō (立冬) - Nov 7, Winter Arrival
 * 7. Daikan (大寒) - Jan 20, Great Cold
 *
 * Philosophy: 7-fold rhythm matches game's sacred number
 */

export type SeasonId =
  | 'risshun'
  | 'shoman'
  | 'tsuyu'
  | 'shocho'
  | 'kanro'
  | 'ritto'
  | 'daikan';

export interface Season {
  id: SeasonId;
  nameJP: string;
  nameEN: string;
  kanji: string;
  startMonth: number;  // 1-12
  startDay: number;
  descriptionJP: string;
  descriptionEN: string;
  theme: string;
  colors: string[];
  icon: string;
  breedingBonus?: number; // XP multiplier
  specialEvent?: SeasonalEvent;
}

export interface SeasonalEvent {
  nameJP: string;
  nameEN: string;
  descriptionJP: string;
  descriptionEN: string;
  durationDays: number;
  rewards: string[];
  communityGoal?: {
    targetRituals: number;
    reward: string;
  };
}

// ===== SEASONAL DEFINITIONS =====

export const SEASONS: Record<SeasonId, Season> = {
  risshun: {
    id: 'risshun',
    nameJP: '立春',
    nameEN: 'Spring Awakening',
    kanji: '春',
    startMonth: 2,
    startDay: 4,
    descriptionJP: '春の目覚め、桜の季節',
    descriptionEN: 'Spring awakening, season of sakura',
    theme: 'Renewal and blooming',
    colors: ['#ec4899', '#fbcfe8', '#fce7f3'], // Sakura pinks
    icon: '🌸',
    breedingBonus: 1.0, // +100% breeding XP
    specialEvent: {
      nameJP: '桜祭り',
      nameEN: 'Sakura Bloom Festival',
      descriptionJP: '桜の花が満開になる美しい祭り',
      descriptionEN: 'Beautiful festival when sakura blooms',
      durationDays: 14,
      rewards: ['sakura_cosmetics', 'spring_lantern'],
      communityGoal: {
        targetRituals: 100000,
        reward: 'eternal_sakura_tree',
      },
    },
  },

  shoman: {
    id: 'shoman',
    nameJP: '小満',
    nameEN: 'Gentle Rain',
    kanji: '雨',
    startMonth: 5,
    startDay: 21,
    descriptionJP: '優しい雨、万物が満ちる',
    descriptionEN: 'Gentle rain, all things become full',
    theme: 'Growth and nourishment',
    colors: ['#3b82f6', '#93c5fd', '#dbeafe'], // Water blues
    icon: '💧',
    specialEvent: {
      nameJP: '雨の調和',
      nameEN: 'Rain Harmony Challenge',
      descriptionJP: '雨の中で瞑想し、調和を見つける',
      descriptionEN: 'Meditate in rain and find harmony',
      durationDays: 10,
      rewards: ['rain_cosmetics', 'water_blessing'],
    },
  },

  tsuyu: {
    id: 'tsuyu',
    nameJP: '梅雨',
    nameEN: 'Plum Rains',
    kanji: '梅',
    startMonth: 6,
    startDay: 6,
    descriptionJP: '梅雨の季節、苔の庭',
    descriptionEN: 'Plum rain season, moss gardens',
    theme: 'Introspection and quiet beauty',
    colors: ['#10b981', '#6ee7b7', '#d1fae5'], // Moss greens
    icon: '🌿',
    specialEvent: {
      nameJP: '静かな熟考',
      nameEN: 'Quiet Contemplation',
      descriptionJP: '静寂の中で深く考える時間',
      descriptionEN: 'Time for deep thought in silence',
      durationDays: 7,
      rewards: ['moss_cosmetics', 'contemplation_scroll'],
    },
  },

  shocho: {
    id: 'shocho',
    nameJP: '小暑',
    nameEN: 'Star Festival',
    kanji: '星',
    startMonth: 7,
    startDay: 7,
    descriptionJP: '七夕祭り、星に願いを',
    descriptionEN: 'Tanabata Festival, wish upon stars',
    theme: 'Celestial celebration',
    colors: ['#f59e0b', '#fbbf24', '#fef3c7'], // Golden stars
    icon: '⭐',
    breedingBonus: 1.5, // +150% breeding XP (MAJOR EVENT)
    specialEvent: {
      nameJP: '織姫星祭り',
      nameEN: 'Weaving Star Festival',
      descriptionJP: '最大の祭り！星に願いを書き、仲間と祝う',
      descriptionEN: 'Biggest festival! Write wishes and celebrate',
      durationDays: 21, // 3 weeks!
      rewards: ['star_cosmetics', 'celestial_blessing', 'tanabata_banner'],
      communityGoal: {
        targetRituals: 500000,
        reward: 'eternal_star_companion',
      },
    },
  },

  kanro: {
    id: 'kanro',
    nameJP: '寒露',
    nameEN: 'Autumn Dew',
    kanji: '秋',
    startMonth: 10,
    startDay: 8,
    descriptionJP: '秋の露、月見の季節',
    descriptionEN: 'Autumn dew, moon-viewing season',
    theme: 'Harvest and reflection',
    colors: ['#f97316', '#fb923c', '#fed7aa'], // Autumn orange
    icon: '🍂',
    specialEvent: {
      nameJP: '月見の儀式',
      nameEN: 'Moon Viewing Ceremony',
      descriptionJP: '満月を見ながら収穫を祝う',
      descriptionEN: 'Celebrate harvest under full moon',
      durationDays: 7,
      rewards: ['moon_cosmetics', 'harvest_blessing'],
    },
  },

  ritto: {
    id: 'ritto',
    nameJP: '立冬',
    nameEN: 'Winter Arrival',
    kanji: '冬',
    startMonth: 11,
    startDay: 7,
    descriptionJP: '冬の訪れ、絆の試練',
    descriptionEN: 'Winter arrives, bonds are tested',
    theme: 'Endurance and warmth',
    colors: ['#6b46c1', '#a78bfa', '#e9d5ff'], // Purple twilight
    icon: '❄️',
    specialEvent: {
      nameJP: '冬の絆チャレンジ',
      nameEN: 'Winter Bonding Challenge',
      descriptionJP: '寒い冬、絆を深めよう',
      descriptionEN: 'Deepen bonds through cold winter',
      durationDays: 14,
      rewards: ['frost_cosmetics', 'winter_warmth'],
    },
  },

  daikan: {
    id: 'daikan',
    nameJP: '大寒',
    nameEN: 'Great Cold',
    kanji: '寒',
    startMonth: 1,
    startDay: 20,
    descriptionJP: '大寒、浄化と再生',
    descriptionEN: 'Great cold, purification and renewal',
    theme: 'Purification and new beginnings',
    colors: ['#e5e7eb', '#f3f4f6', '#ffffff'], // Snow white
    icon: '⛩️',
    specialEvent: {
      nameJP: '新年神社清掃',
      nameEN: 'New Year Shrine Cleaning',
      descriptionJP: '新しい年を迎えるため神社を清める',
      descriptionEN: 'Cleanse shrines for the new year',
      durationDays: 10,
      rewards: ['snow_cosmetics', 'purification_blessing'],
    },
  },
};

// ===== SEASON UTILITIES =====

/**
 * Get current season based on date
 */
export function getCurrentSeason(date: Date = new Date()): Season {
  const month = date.getMonth() + 1; // 0-indexed to 1-indexed
  const day = date.getDate();

  // Create array of seasons sorted by date
  const sortedSeasons = Object.values(SEASONS).sort((a, b) => {
    if (a.startMonth !== b.startMonth) {
      return a.startMonth - b.startMonth;
    }
    return a.startDay - b.startDay;
  });

  // Find the current season
  for (let i = sortedSeasons.length - 1; i >= 0; i--) {
    const season = sortedSeasons[i];
    if (
      month > season.startMonth ||
      (month === season.startMonth && day >= season.startDay)
    ) {
      return season;
    }
  }

  // If before first season of year, return last season of previous year
  return sortedSeasons[sortedSeasons.length - 1];
}

/**
 * Get next season
 */
export function getNextSeason(currentSeason: Season): Season {
  const seasonIds: SeasonId[] = ['risshun', 'shoman', 'tsuyu', 'shocho', 'kanro', 'ritto', 'daikan'];
  const currentIndex = seasonIds.indexOf(currentSeason.id);
  const nextIndex = (currentIndex + 1) % 7;
  return SEASONS[seasonIds[nextIndex]];
}

/**
 * Get days until next season
 */
export function getDaysUntilNextSeason(date: Date = new Date()): number {
  const currentSeason = getCurrentSeason(date);
  const nextSeason = getNextSeason(currentSeason);

  const nextSeasonDate = new Date(date.getFullYear(), nextSeason.startMonth - 1, nextSeason.startDay);

  // If next season is earlier in year, it's next year
  if (nextSeasonDate <= date) {
    nextSeasonDate.setFullYear(date.getFullYear() + 1);
  }

  const msUntilNext = nextSeasonDate.getTime() - date.getTime();
  return Math.ceil(msUntilNext / (1000 * 60 * 60 * 24));
}

/**
 * Check if currently in a seasonal event
 */
export function isInSeasonalEvent(date: Date = new Date()): boolean {
  const season = getCurrentSeason(date);
  if (!season.specialEvent) return false;

  const seasonStart = new Date(date.getFullYear(), season.startMonth - 1, season.startDay);
  const eventEnd = new Date(seasonStart);
  eventEnd.setDate(eventEnd.getDate() + season.specialEvent.durationDays);

  return date >= seasonStart && date <= eventEnd;
}

/**
 * Get active seasonal event (if any)
 */
export function getActiveEvent(date: Date = new Date()): SeasonalEvent | null {
  if (!isInSeasonalEvent(date)) return null;

  const season = getCurrentSeason(date);
  return season.specialEvent || null;
}

/**
 * Get event progress (0-1)
 */
export function getEventProgress(date: Date = new Date()): number {
  const event = getActiveEvent(date);
  if (!event) return 0;

  const season = getCurrentSeason(date);
  const seasonStart = new Date(date.getFullYear(), season.startMonth - 1, season.startDay);

  const elapsed = date.getTime() - seasonStart.getTime();
  const total = event.durationDays * 24 * 60 * 60 * 1000;

  return Math.min(1, elapsed / total);
}

// ===== COSMETIC UNLOCKS =====

export interface SeasonalCosmetic {
  id: string;
  nameJP: string;
  nameEN: string;
  season: SeasonId;
  type: 'color' | 'pattern' | 'accessory';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockMethod: 'event' | 'purchase' | 'community_goal';
  price?: number; // ¥ if purchasable
}

export const SEASONAL_COSMETICS: SeasonalCosmetic[] = [
  // Risshun (Spring)
  {
    id: 'sakura_pink',
    nameJP: '桜ピンク',
    nameEN: 'Sakura Pink',
    season: 'risshun',
    type: 'color',
    rarity: 'common',
    unlockMethod: 'event',
  },
  {
    id: 'cherry_blossom_pattern',
    nameJP: '桜花模様',
    nameEN: 'Cherry Blossom Pattern',
    season: 'risshun',
    type: 'pattern',
    rarity: 'rare',
    unlockMethod: 'event',
  },
  {
    id: 'spring_crown',
    nameJP: '春の冠',
    nameEN: 'Spring Crown',
    season: 'risshun',
    type: 'accessory',
    rarity: 'epic',
    unlockMethod: 'purchase',
    price: 600,
  },

  // Shochō (Star Festival)
  {
    id: 'starlight_gold',
    nameJP: '星光ゴールド',
    nameEN: 'Starlight Gold',
    season: 'shocho',
    type: 'color',
    rarity: 'rare',
    unlockMethod: 'event',
  },
  {
    id: 'constellation_pattern',
    nameJP: '星座模様',
    nameEN: 'Constellation Pattern',
    season: 'shocho',
    type: 'pattern',
    rarity: 'epic',
    unlockMethod: 'event',
  },
  {
    id: 'tanabata_wish_scroll',
    nameJP: '短冊',
    nameEN: 'Tanabata Wish Scroll',
    season: 'shocho',
    type: 'accessory',
    rarity: 'legendary',
    unlockMethod: 'community_goal',
  },

  // Daikan (Great Cold)
  {
    id: 'snow_white',
    nameJP: '雪白',
    nameEN: 'Snow White',
    season: 'daikan',
    type: 'color',
    rarity: 'common',
    unlockMethod: 'event',
  },
  {
    id: 'snowflake_pattern',
    nameJP: '雪結晶模様',
    nameEN: 'Snowflake Pattern',
    season: 'daikan',
    type: 'pattern',
    rarity: 'rare',
    unlockMethod: 'event',
  },
];

/**
 * Get cosmetics available in current season
 */
export function getSeasonalCosmetics(season: Season): SeasonalCosmetic[] {
  return SEASONAL_COSMETICS.filter((cosmetic) => cosmetic.season === season.id);
}

/**
 * Check if cosmetic is unlocked
 */
export function isCosmeticUnlocked(
  cosmetic: SeasonalCosmetic,
  playerData: {
    unlockedCosmetics: string[];
    hasPass: boolean;
  }
): boolean {
  if (playerData.unlockedCosmetics.includes(cosmetic.id)) {
    return true;
  }

  // Pass users get all event cosmetics
  if (cosmetic.unlockMethod === 'event' && playerData.hasPass) {
    return true;
  }

  return false;
}

// ===== UTILITIES =====

/**
 * Get season by ID
 */
export function getSeasonById(id: SeasonId): Season {
  return SEASONS[id];
}

/**
 * Format season name for display
 */
export function formatSeasonName(season: Season, locale: 'ja' | 'en' = 'ja'): string {
  return locale === 'ja' ? season.nameJP : season.nameEN;
}

/**
 * Get season icon emoji
 */
export function getSeasonIcon(season: Season): string {
  return season.icon;
}

/**
 * Check if season has breeding bonus
 */
export function hasBreedingBonus(season: Season): boolean {
  return season.breedingBonus !== undefined && season.breedingBonus > 0;
}

/**
 * Get breeding bonus multiplier
 */
export function getBreedingBonus(season: Season): number {
  return season.breedingBonus || 0;
}

/**
 * Serialize seasonal progress
 */
export function serializeSeasonalProgress(data: {
  currentSeason: SeasonId;
  unlockedCosmetics: string[];
  eventProgress: Record<string, number>;
}): string {
  return JSON.stringify(data);
}

/**
 * Deserialize seasonal progress
 */
export function deserializeSeasonalProgress(json: string): {
  currentSeason: SeasonId;
  unlockedCosmetics: string[];
  eventProgress: Record<string, number>;
} {
  return JSON.parse(json);
}
