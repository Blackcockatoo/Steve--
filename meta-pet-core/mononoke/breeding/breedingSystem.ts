/**
 * Breeding System with Kizuna Gates
 *
 * Breeding is locked until Kizuna Level 7 (輪廻 Reincarnation).
 * Uses Base-7 genome inheritance with seasonal bonuses.
 */

import type { Genome, Base7Digit } from '../../../mononoke-garden-core/genetics/base7Genome';
import { getCurrentSeason, getBreedingBonus } from '../../../mononoke-garden-core/seasons/calendar';
import type { KizunaLevel } from '../../../mononoke-garden-core/kizuna/bondSystem';

export interface BreedingRequest {
  parent1: {
    genome: Genome;
    kizunaLevel: KizunaLevel;
  };
  parent2: {
    genome: Genome;
    kizunaLevel: KizunaLevel;
  };
  shrineBlessing?: boolean; // Did user scan Fushimi Inari shrine?
}

export interface BreedingResult {
  success: boolean;
  offspring?: {
    genome: Genome;
    inheritedTraits: string[];
    specialAbility?: string;
  };
  error?: string;
  incubationDays: number;
}

/**
 * Attempt breeding between two companions
 */
export function attemptBreeding(request: BreedingRequest): BreedingResult {
  // Check Kizuna level requirement
  if (request.parent1.kizunaLevel < 7 || request.parent2.kizunaLevel < 7) {
    return {
      success: false,
      error: 'Both companions must reach Kizuna Level 7 (輪廻 Reincarnation) to breed',
      incubationDays: 0,
    };
  }

  // Calculate breeding success chance
  const baseChance = 0.7; // 70% base success
  const season = getCurrentSeason();
  const breedingBonus = season.breedingBonus || 0;
  const seasonalBonus = breedingBonus > 0 ? breedingBonus : 0;
  const shrineBonus = request.shrineBlessing ? 1.0 : 0; // +100% from Fushimi Inari

  const totalChance = Math.min(1.0, baseChance + seasonalBonus + shrineBonus);

  // Roll for success
  const success = Math.random() < totalChance;

  if (!success) {
    return {
      success: false,
      error: 'Breeding was unsuccessful. Try again during a seasonal event or visit a shrine.',
      incubationDays: 0,
    };
  }

  // Generate offspring genome (60% parent avg + 40% random)
  const offspring = inheritGenome(request.parent1.genome, request.parent2.genome);

  // Determine special abilities (rare)
  const specialAbility = rollForSpecialAbility(request.parent1.genome, request.parent2.genome);

  // Incubation period: 7 days (can be reduced with premium tier)
  const incubationDays = 7;

  return {
    success: true,
    offspring: {
      genome: offspring,
      inheritedTraits: [
        'Personality blend of both parents',
        'Color combination',
        'Element affinity fusion',
      ],
      specialAbility,
    },
    incubationDays,
  };
}

/**
 * Inherit genome from two parents (Base-7 math)
 */
function inheritGenome(parent1: Genome, parent2: Genome): Genome {
  const offspring: Genome = {
    red60: [],
    blue60: [],
    black60: [],
  };

  // For each strand, blend parents (60%) + mutation (40%)
  for (let i = 0; i < 60; i++) {
    // RED strand (personality)
    const avgRed = Math.floor((parent1.red60[i] + parent2.red60[i]) / 2);
    const mutationRed = Math.floor(Math.random() * 7); // Base-7 random
    offspring.red60[i] = Math.floor(avgRed * 0.6 + mutationRed * 0.4) % 7 as Base7Digit;

    // BLUE strand (appearance)
    const avgBlue = Math.floor((parent1.blue60[i] + parent2.blue60[i]) / 2);
    const mutationBlue = Math.floor(Math.random() * 7);
    offspring.blue60[i] = Math.floor(avgBlue * 0.6 + mutationBlue * 0.4) % 7 as Base7Digit;

    // BLACK strand (special abilities)
    const avgBlack = Math.floor((parent1.black60[i] + parent2.black60[i]) / 2);
    const mutationBlack = Math.floor(Math.random() * 7);
    offspring.black60[i] = Math.floor(avgBlack * 0.6 + mutationBlack * 0.4) % 7 as Base7Digit;
  }

  return offspring;
}

/**
 * Roll for rare special ability (5% chance)
 */
function rollForSpecialAbility(parent1: Genome, parent2: Genome): string | undefined {
  if (Math.random() > 0.05) return undefined; // 95% no special ability

  const abilities = [
    'Celestial Resonance - Enhanced emotional expression',
    'Temporal Echo - Remembers past interactions longer',
    'Element Mastery - Stronger yantra affinity',
    'Shrine Blessing - Permanent +10% Kizuna gain',
    'Seasonal Attunement - Adapts to seasonal events faster',
    'Ancient Wisdom - Unlocks rare dialogue options',
  ];

  return abilities[Math.floor(Math.random() * abilities.length)];
}

/**
 * Get breeding cooldown (tier-dependent)
 */
export function getBreedingCooldown(tier: 'free' | 'premium' | 'mythic'): number {
  const cooldowns = {
    free: 365,    // 1 per year
    premium: 120, // 3 per year (~4 months each)
    mythic: 0,    // Unlimited
  };
  return cooldowns[tier];
}
