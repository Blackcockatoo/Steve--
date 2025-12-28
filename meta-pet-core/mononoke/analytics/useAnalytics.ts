/**
 * Mononoke Garden - Analytics React Hooks
 */

import { useCallback, useEffect } from 'react';
import { trackEvent, identifyUser, setUserProperties } from './analyticsAdapter';
import type { AnalyticsEvent, UserProperties } from './events';
import {
  OnboardingEvents,
  KizunaEvents,
  SeasonalEvents,
  BreedingEvents,
  ShrineEvents,
  TradingEvents,
  MonetizationEvents,
  RetentionEvents,
  SocialEvents,
  createEvent,
} from './events';

/**
 * Main analytics hook
 */
export function useAnalytics() {
  const track = useCallback((event: AnalyticsEvent) => {
    trackEvent(event);
  }, []);

  const identify = useCallback((userId: string, properties?: UserProperties) => {
    identifyUser(userId, properties);
  }, []);

  const updateUser = useCallback((properties: Partial<UserProperties>) => {
    setUserProperties(properties);
  }, []);

  return {
    track,
    identify,
    updateUser,
  };
}

/**
 * Hook for tracking kizuna events
 */
export function useKizunaAnalytics() {
  const { track } = useAnalytics();

  const trackRitual = useCallback(
    (ritualType: string, kizunaLevel: number, xpGained: number, consecutiveDays: number, hasPass: boolean) => {
      track(
        createEvent(KizunaEvents.RITUAL_PERFORMED, {
          ritual_type: ritualType,
          kizuna_level: kizunaLevel,
          xp_gained: xpGained,
          consecutive_days: consecutiveDays,
          has_pass: hasPass,
        })
      );
    },
    [track]
  );

  const trackLevelUp = useCallback(
    (previousLevel: number, newLevel: number, totalXp: number, daysToLevelUp: number) => {
      track(
        createEvent(KizunaEvents.LEVEL_UP, {
          previous_level: previousLevel,
          new_level: newLevel,
          total_xp: totalXp,
          days_to_level_up: daysToLevelUp,
        })
      );
    },
    [track]
  );

  const trackStreakMilestone = useCallback(
    (consecutiveDays: number, milestone: string) => {
      track(
        createEvent(KizunaEvents.STREAK_MILESTONE, {
          consecutive_days: consecutiveDays,
          milestone,
        })
      );
    },
    [track]
  );

  const trackStreakBroken = useCallback(
    (previousStreak: number, daysMissed: number, kizunaLevel: number) => {
      track(
        createEvent(KizunaEvents.STREAK_BROKEN, {
          previous_streak: previousStreak,
          days_missed: daysMissed,
          kizuna_level: kizunaLevel,
        })
      );
    },
    [track]
  );

  return {
    trackRitual,
    trackLevelUp,
    trackStreakMilestone,
    trackStreakBroken,
  };
}

/**
 * Hook for tracking breeding events
 */
export function useBreedingAnalytics() {
  const { track } = useAnalytics();

  const trackBreedingUnlocked = useCallback(
    (daysToUnlock: number, totalRituals: number) => {
      track(
        createEvent(BreedingEvents.BREEDING_UNLOCKED, {
          days_to_unlock: daysToUnlock,
          total_rituals: totalRituals,
        })
      );
    },
    [track]
  );

  const trackBreedingAttempt = useCallback(
    (
      parent1Kizuna: number,
      parent2Kizuna: number,
      hasShrineBlessing: boolean,
      seasonBonus: number,
      success: boolean
    ) => {
      track(
        createEvent(BreedingEvents.BREEDING_ATTEMPTED, {
          parent1_kizuna: parent1Kizuna,
          parent2_kizuna: parent2Kizuna,
          has_shrine_blessing: hasShrineBlessing,
          season_bonus: seasonBonus,
          success,
        })
      );
    },
    [track]
  );

  const trackBreedingSuccess = useCallback(
    (offspringGenomeId: string, hasSpecialAbility: boolean, specialAbility: string, incubationDays: number) => {
      track(
        createEvent(BreedingEvents.BREEDING_SUCCESS, {
          offspring_genome_id: offspringGenomeId,
          has_special_ability: hasSpecialAbility,
          special_ability: specialAbility,
          incubation_days: incubationDays,
        })
      );
    },
    [track]
  );

  const trackOffspringHatched = useCallback(
    (offspringGenomeId: string, parentCount: number) => {
      track(
        createEvent(BreedingEvents.OFFSPRING_HATCHED, {
          offspring_genome_id: offspringGenomeId,
          parent_count: parentCount,
        })
      );
    },
    [track]
  );

  return {
    trackBreedingUnlocked,
    trackBreedingAttempt,
    trackBreedingSuccess,
    trackOffspringHatched,
  };
}

/**
 * Hook for tracking monetization events
 */
export function useMonetizationAnalytics() {
  const { track } = useAnalytics();

  const trackPaywallViewed = useCallback(
    (paywallType: string, context: string) => {
      track(
        createEvent(MonetizationEvents.PAYWALL_VIEWED, {
          paywall_type: paywallType,
          context,
        })
      );
    },
    [track]
  );

  const trackPurchaseInitiated = useCallback(
    (productId: string, productType: string, priceJpy: number) => {
      track(
        createEvent(MonetizationEvents.PURCHASE_INITIATED, {
          product_id: productId,
          product_type: productType,
          price_jpy: priceJpy,
          currency: 'JPY',
        })
      );
    },
    [track]
  );

  const trackPurchaseCompleted = useCallback(
    (
      productId: string,
      productType: string,
      priceJpy: number,
      revenueJpy: number,
      isFirstPurchase: boolean,
      paymentMethod: string
    ) => {
      track(
        createEvent(MonetizationEvents.PURCHASE_COMPLETED, {
          product_id: productId,
          product_type: productType,
          price_jpy: priceJpy,
          revenue_jpy: revenueJpy,
          is_first_purchase: isFirstPurchase,
          payment_method: paymentMethod,
        })
      );
    },
    [track]
  );

  const trackSubscriptionStarted = useCallback(
    (tier: string, priceJpy: number, billingPeriod: string) => {
      track(
        createEvent(MonetizationEvents.SUBSCRIPTION_STARTED, {
          tier,
          price_jpy: priceJpy,
          billing_period: billingPeriod,
        })
      );
    },
    [track]
  );

  return {
    trackPaywallViewed,
    trackPurchaseInitiated,
    trackPurchaseCompleted,
    trackSubscriptionStarted,
  };
}

/**
 * Hook for tracking trading events
 */
export function useTradingAnalytics() {
  const { track } = useAnalytics();

  const trackTradeInitiated = useCallback(
    (tradeType: string, offeringGenomeId: string, offeringKizunaLevel: number) => {
      track(
        createEvent(TradingEvents.TRADE_INITIATED, {
          trade_type: tradeType,
          offering_genome_id: offeringGenomeId,
          offering_kizuna_level: offeringKizunaLevel,
        })
      );
    },
    [track]
  );

  const trackTradeAccepted = useCallback(
    (tradeId: string, givenGenomeId: string, receivedGenomeId: string, tradeType: string) => {
      track(
        createEvent(TradingEvents.TRADE_ACCEPTED, {
          trade_id: tradeId,
          given_genome_id: givenGenomeId,
          received_genome_id: receivedGenomeId,
          trade_type: tradeType,
        })
      );
    },
    [track]
  );

  const trackMarketplaceBrowsed = useCallback(
    (filterSeason: string, filterRarity: string, resultsCount: number) => {
      track(
        createEvent(TradingEvents.MARKETPLACE_BROWSED, {
          filter_season: filterSeason,
          filter_rarity: filterRarity,
          results_count: resultsCount,
        })
      );
    },
    [track]
  );

  return {
    trackTradeInitiated,
    trackTradeAccepted,
    trackMarketplaceBrowsed,
  };
}

/**
 * Hook for tracking shrine events
 */
export function useShrineAnalytics() {
  const { track } = useAnalytics();

  const trackShrineVisited = useCallback(
    (
      shrineId: string,
      shrineName: string,
      shrineTier: string,
      blessingType: string,
      blessingDuration: number,
      isFirstVisit: boolean
    ) => {
      track(
        createEvent(ShrineEvents.SHRINE_VISITED, {
          shrine_id: shrineId,
          shrine_name: shrineName,
          shrine_tier: shrineTier,
          blessing_type: blessingType,
          blessing_duration: blessingDuration,
          is_first_visit: isFirstVisit,
        })
      );
    },
    [track]
  );

  const trackBlessingActivated = useCallback(
    (blessingType: string, bonusAmount: number, durationHours: number) => {
      track(
        createEvent(ShrineEvents.BLESSING_ACTIVATED, {
          blessing_type: blessingType,
          bonus_amount: bonusAmount,
          duration_hours: durationHours,
        })
      );
    },
    [track]
  );

  return {
    trackShrineVisited,
    trackBlessingActivated,
  };
}

/**
 * Hook for automatic page view tracking
 */
export function usePageTracking(pageName: string) {
  const { track } = useAnalytics();

  useEffect(() => {
    track({
      name: 'page_viewed',
      category: 'retention',
      properties: {
        page_name: pageName,
        timestamp: new Date().toISOString(),
      },
    });
  }, [pageName, track]);
}

/**
 * Hook for automatic session tracking
 */
export function useSessionTracking(userId: string, sessionCount: number, daysSinceInstall: number) {
  const { track } = useAnalytics();

  useEffect(() => {
    const sessionStartTime = Date.now();

    // Track session start
    track(
      createEvent(RetentionEvents.SESSION_STARTED, {
        session_count: sessionCount,
        days_since_install: daysSinceInstall,
        days_since_last_session: 0, // Calculate from last session
      })
    );

    // Track session end on unmount
    return () => {
      const sessionDuration = Math.floor((Date.now() - sessionStartTime) / 1000);
      track(
        createEvent(RetentionEvents.SESSION_ENDED, {
          session_duration_seconds: sessionDuration,
          rituals_performed: 0, // Track during session
          screens_visited: 0, // Track during session
        })
      );
    };
  }, [userId, sessionCount, daysSinceInstall, track]);
}
