/**
 * Mononoke-specific React Hooks
 */

import { useState, useEffect, useCallback } from 'react';
import { getCurrentSeason, getActiveEvent, type Season, type SeasonalEvent } from '../../../mononoke-garden-core/seasons/calendar';
import { KIZUNA_TIERS, calculateRitualXP, addKizunaXP, type KizunaLevel, type KizunaState } from '../../../mononoke-garden-core/kizuna/bondSystem';
import { extractPersonality, type Genome, type PersonalityScores } from '../../../mononoke-garden-core/genetics/base7Genome';

/**
 * Hook for seasonal calendar
 */
export function useSeason() {
  const [season, setSeason] = useState<Season>(getCurrentSeason());
  const [nextEvent, setNextEvent] = useState<SeasonalEvent | null>(getActiveEvent());

  useEffect(() => {
    // Update season every hour
    const interval = setInterval(() => {
      setSeason(getCurrentSeason());
      setNextEvent(getActiveEvent());
    }, 1000 * 60 * 60); // 1 hour

    return () => clearInterval(interval);
  }, []);

  return { season, nextEvent };
}

/**
 * Hook for Kizuna system
 */
export function useKizuna(initialState: KizunaState) {
  const [kizuna, setKizuna] = useState<KizunaState>(initialState);

  const performRitual = useCallback((ritualType: string, hasPass: boolean = false) => {
    const timeSinceLastInteraction = kizuna.lastInteraction
      ? (Date.now() - kizuna.lastInteraction.getTime()) / (1000 * 60 * 60)
      : 24;

    const xpGain = calculateRitualXP(ritualType, kizuna, { hasPass });

    setKizuna((prev) => {
      const newState = addKizunaXP(prev, xpGain);
      return newState;
    });
  }, [kizuna.lastInteraction]);

  const currentLevelInfo = KIZUNA_TIERS[kizuna.level];
  const nextLevelInfo = kizuna.level < 7 ? KIZUNA_TIERS[(kizuna.level + 1) as KizunaLevel] : null;

  return {
    kizuna,
    currentLevelInfo,
    nextLevelInfo,
    performRitual,
    canBreed: kizuna.level >= 7,
  };
}

/**
 * Hook for personality traits (from genome)
 */
export function usePersonality(genome: Genome) {
  const [personality, setPersonality] = useState<PersonalityScores>(extractPersonality(genome.red60));

  useEffect(() => {
    setPersonality(extractPersonality(genome.red60));
  }, [genome]);

  // Get dominant trait (highest score)
  const dominantTrait = Object.entries(personality).reduce((max, [trait, score]) => {
    return score > max.score ? { trait, score } : max;
  }, { trait: 'shyness', score: 0 });

  return {
    personality,
    dominantTrait: dominantTrait.trait,
  };
}

/**
 * Hook for shrine blessing status
 */
export function useShrineBlessing() {
  const [blessings, setBlessings] = useState<Array<{
    shrineId: string;
    type: string;
    expiresAt: Date;
  }>>([]);

  const addBlessing = useCallback((shrineId: string, type: string, durationHours: number) => {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + durationHours);

    setBlessings((prev) => [...prev, { shrineId, type, expiresAt }]);
  }, []);

  const activeBlessings = blessings.filter((b) => b.expiresAt > new Date());

  return {
    activeBlessings,
    addBlessing,
    hasBlessing: (type: string) => activeBlessings.some((b) => b.type === type),
  };
}

/**
 * Hook for breeding cooldown management
 */
export function useBreedingCooldown(tier: 'free' | 'premium' | 'mythic') {
  const [lastBreedDate, setLastBreedDate] = useState<Date | null>(null);
  const [canBreed, setCanBreed] = useState(true);

  useEffect(() => {
    if (!lastBreedDate) {
      setCanBreed(true);
      return;
    }

    const cooldowns = {
      free: 365,
      premium: 120,
      mythic: 0,
    };

    const cooldownDays = cooldowns[tier];
    if (cooldownDays === 0) {
      setCanBreed(true);
      return;
    }

    const daysSinceLastBreed = (Date.now() - lastBreedDate.getTime()) / (1000 * 60 * 60 * 24);
    setCanBreed(daysSinceLastBreed >= cooldownDays);
  }, [lastBreedDate, tier]);

  const recordBreeding = useCallback(() => {
    setLastBreedDate(new Date());
  }, []);

  return {
    canBreed,
    lastBreedDate,
    recordBreeding,
  };
}
