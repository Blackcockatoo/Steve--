/**
 * Mononoke Garden - Analytics Event Definitions
 *
 * Comprehensive event tracking for player behavior, retention, and monetization.
 * Compatible with Mixpanel, Amplitude, and Firebase Analytics.
 */

// ===== EVENT CATEGORIES =====

export type EventCategory =
  | 'onboarding'
  | 'kizuna'
  | 'seasonal'
  | 'breeding'
  | 'shrine'
  | 'trading'
  | 'monetization'
  | 'retention'
  | 'social';

// ===== EVENT DEFINITIONS =====

export interface AnalyticsEvent {
  name: string;
  category: EventCategory;
  properties?: Record<string, any>;
}

// ===== ONBOARDING EVENTS =====

export const OnboardingEvents = {
  STARTED: {
    name: 'onboarding_started',
    category: 'onboarding' as EventCategory,
  },
  COMPANION_CREATED: {
    name: 'companion_created',
    category: 'onboarding' as EventCategory,
    properties: {
      genome_id: '',
      personality_dominant: '',
      appearance_primary_color: '',
    },
  },
  FIRST_RITUAL: {
    name: 'first_ritual_completed',
    category: 'onboarding' as EventCategory,
    properties: {
      ritual_type: '',
      time_to_complete_seconds: 0,
    },
  },
  TUTORIAL_COMPLETED: {
    name: 'tutorial_completed',
    category: 'onboarding' as EventCategory,
    properties: {
      completion_time_seconds: 0,
    },
  },
};

// ===== KIZUNA EVENTS =====

export const KizunaEvents = {
  RITUAL_PERFORMED: {
    name: 'ritual_performed',
    category: 'kizuna' as EventCategory,
    properties: {
      ritual_type: '',
      kizuna_level: 0,
      xp_gained: 0,
      consecutive_days: 0,
      has_pass: false,
    },
  },
  LEVEL_UP: {
    name: 'kizuna_level_up',
    category: 'kizuna' as EventCategory,
    properties: {
      previous_level: 0,
      new_level: 0,
      total_xp: 0,
      days_to_level_up: 0,
    },
  },
  STREAK_MILESTONE: {
    name: 'streak_milestone',
    category: 'kizuna' as EventCategory,
    properties: {
      consecutive_days: 0,
      milestone: '', // '7_days', '30_days', '100_days'
    },
  },
  STREAK_BROKEN: {
    name: 'streak_broken',
    category: 'retention' as EventCategory,
    properties: {
      previous_streak: 0,
      days_missed: 0,
      kizuna_level: 0,
    },
  },
};

// ===== SEASONAL EVENTS =====

export const SeasonalEvents = {
  SEASON_STARTED: {
    name: 'season_started',
    category: 'seasonal' as EventCategory,
    properties: {
      season_id: '',
      season_name: '',
      has_special_event: false,
    },
  },
  EVENT_PARTICIPATED: {
    name: 'seasonal_event_participated',
    category: 'seasonal' as EventCategory,
    properties: {
      event_name: '',
      season_id: '',
      participation_type: '', // 'ritual', 'community_goal', 'cosmetic_unlock'
    },
  },
  COSMETIC_UNLOCKED: {
    name: 'cosmetic_unlocked',
    category: 'seasonal' as EventCategory,
    properties: {
      cosmetic_id: '',
      cosmetic_name: '',
      season_id: '',
      unlock_method: '', // 'event', 'purchase', 'community_goal'
      rarity: '',
    },
  },
  COMMUNITY_GOAL_CONTRIBUTED: {
    name: 'community_goal_contributed',
    category: 'social' as EventCategory,
    properties: {
      event_name: '',
      contribution_amount: 0,
      total_progress: 0,
    },
  },
};

// ===== BREEDING EVENTS =====

export const BreedingEvents = {
  BREEDING_UNLOCKED: {
    name: 'breeding_unlocked',
    category: 'breeding' as EventCategory,
    properties: {
      days_to_unlock: 0,
      total_rituals: 0,
    },
  },
  BREEDING_ATTEMPTED: {
    name: 'breeding_attempted',
    category: 'breeding' as EventCategory,
    properties: {
      parent1_kizuna: 0,
      parent2_kizuna: 0,
      has_shrine_blessing: false,
      season_bonus: 0,
      success: false,
    },
  },
  BREEDING_SUCCESS: {
    name: 'breeding_success',
    category: 'breeding' as EventCategory,
    properties: {
      offspring_genome_id: '',
      has_special_ability: false,
      special_ability: '',
      incubation_days: 0,
    },
  },
  OFFSPRING_HATCHED: {
    name: 'offspring_hatched',
    category: 'breeding' as EventCategory,
    properties: {
      offspring_genome_id: '',
      parent_count: 0, // How many companions the player now has
    },
  },
};

// ===== SHRINE EVENTS =====

export const ShrineEvents = {
  QR_SCAN_ATTEMPTED: {
    name: 'shrine_qr_scan_attempted',
    category: 'shrine' as EventCategory,
  },
  SHRINE_VISITED: {
    name: 'shrine_visited',
    category: 'shrine' as EventCategory,
    properties: {
      shrine_id: '',
      shrine_name: '',
      shrine_tier: '',
      blessing_type: '',
      blessing_duration: 0,
      is_first_visit: false,
    },
  },
  BLESSING_ACTIVATED: {
    name: 'blessing_activated',
    category: 'shrine' as EventCategory,
    properties: {
      blessing_type: '',
      bonus_amount: 0,
      duration_hours: 0,
    },
  },
  BLESSING_USED: {
    name: 'blessing_used',
    category: 'shrine' as EventCategory,
    properties: {
      blessing_type: '',
      action_type: '', // 'ritual', 'breeding', 'seasonal_event'
    },
  },
};

// ===== TRADING EVENTS =====

export const TradingEvents = {
  TRADE_INITIATED: {
    name: 'trade_initiated',
    category: 'trading' as EventCategory,
    properties: {
      trade_type: '', // 'public', 'private', 'friend'
      offering_genome_id: '',
      offering_kizuna_level: 0,
    },
  },
  TRADE_OFFER_RECEIVED: {
    name: 'trade_offer_received',
    category: 'trading' as EventCategory,
    properties: {
      offered_genome_id: '',
      offered_kizuna_level: 0,
      requester_id: '',
    },
  },
  TRADE_ACCEPTED: {
    name: 'trade_accepted',
    category: 'trading' as EventCategory,
    properties: {
      trade_id: '',
      given_genome_id: '',
      received_genome_id: '',
      trade_type: '',
    },
  },
  TRADE_REJECTED: {
    name: 'trade_rejected',
    category: 'trading' as EventCategory,
    properties: {
      trade_id: '',
      rejection_reason: '',
    },
  },
  MARKETPLACE_BROWSED: {
    name: 'marketplace_browsed',
    category: 'trading' as EventCategory,
    properties: {
      filter_season: '',
      filter_rarity: '',
      results_count: 0,
    },
  },
};

// ===== MONETIZATION EVENTS =====

export const MonetizationEvents = {
  PAYWALL_VIEWED: {
    name: 'paywall_viewed',
    category: 'monetization' as EventCategory,
    properties: {
      paywall_type: '', // 'breeding_cooldown', 'cosmetic', 'pass'
      context: '', // Where the paywall appeared
    },
  },
  PURCHASE_INITIATED: {
    name: 'purchase_initiated',
    category: 'monetization' as EventCategory,
    properties: {
      product_id: '',
      product_type: '', // 'pass', 'cosmetic', 'bundle'
      price_jpy: 0,
      currency: 'JPY',
    },
  },
  PURCHASE_COMPLETED: {
    name: 'purchase_completed',
    category: 'monetization' as EventCategory,
    properties: {
      product_id: '',
      product_type: '',
      price_jpy: 0,
      revenue_jpy: 0,
      is_first_purchase: false,
      payment_method: '',
    },
  },
  PURCHASE_FAILED: {
    name: 'purchase_failed',
    category: 'monetization' as EventCategory,
    properties: {
      product_id: '',
      error_code: '',
      error_message: '',
    },
  },
  SUBSCRIPTION_STARTED: {
    name: 'subscription_started',
    category: 'monetization' as EventCategory,
    properties: {
      tier: '', // 'premium', 'mythic'
      price_jpy: 0,
      billing_period: '', // 'monthly', 'yearly'
    },
  },
  SUBSCRIPTION_RENEWED: {
    name: 'subscription_renewed',
    category: 'monetization' as EventCategory,
    properties: {
      tier: '',
      renewal_count: 0,
      ltv_jpy: 0, // Lifetime value
    },
  },
  SUBSCRIPTION_CANCELLED: {
    name: 'subscription_cancelled',
    category: 'monetization' as EventCategory,
    properties: {
      tier: '',
      reason: '',
      days_subscribed: 0,
      total_spent_jpy: 0,
    },
  },
};

// ===== RETENTION EVENTS =====

export const RetentionEvents = {
  SESSION_STARTED: {
    name: 'session_started',
    category: 'retention' as EventCategory,
    properties: {
      session_count: 0,
      days_since_install: 0,
      days_since_last_session: 0,
    },
  },
  SESSION_ENDED: {
    name: 'session_ended',
    category: 'retention' as EventCategory,
    properties: {
      session_duration_seconds: 0,
      rituals_performed: 0,
      screens_visited: 0,
    },
  },
  PUSH_NOTIFICATION_RECEIVED: {
    name: 'push_notification_received',
    category: 'retention' as EventCategory,
    properties: {
      notification_type: '', // 'seasonal_event', 'streak_reminder', 'blessing_expiring'
      notification_id: '',
    },
  },
  PUSH_NOTIFICATION_OPENED: {
    name: 'push_notification_opened',
    category: 'retention' as EventCategory,
    properties: {
      notification_type: '',
      notification_id: '',
      time_since_sent_minutes: 0,
    },
  },
  DAY_N_RETENTION: {
    name: 'day_n_retention',
    category: 'retention' as EventCategory,
    properties: {
      day: 0, // 1, 3, 7, 14, 30, 60, 90
      has_pass: false,
      kizuna_level: 0,
      consecutive_days: 0,
    },
  },
};

// ===== SOCIAL EVENTS =====

export const SocialEvents = {
  FRIEND_ADDED: {
    name: 'friend_added',
    category: 'social' as EventCategory,
    properties: {
      friend_id: '',
      method: '', // 'qr_code', 'username', 'recommendation'
    },
  },
  COMPANION_SHARED: {
    name: 'companion_shared',
    category: 'social' as EventCategory,
    properties: {
      genome_id: '',
      platform: '', // 'twitter', 'instagram', 'line', 'native'
    },
  },
  REFERRAL_SENT: {
    name: 'referral_sent',
    category: 'social' as EventCategory,
    properties: {
      referral_code: '',
      method: '',
    },
  },
  REFERRAL_COMPLETED: {
    name: 'referral_completed',
    category: 'social' as EventCategory,
    properties: {
      referral_code: '',
      referred_user_id: '',
      reward_received: '',
    },
  },
};

// ===== USER PROPERTIES =====

export interface UserProperties {
  user_id: string;
  install_date: string;
  days_since_install: number;

  // Kizuna
  kizuna_level: number;
  total_kizuna_xp: number;
  consecutive_days: number;
  total_rituals: number;

  // Companions
  companion_count: number;
  highest_kizuna_level: number;
  has_bred: boolean;

  // Monetization
  is_subscriber: boolean;
  subscription_tier: 'free' | 'premium' | 'mythic';
  ltv_jpy: number;
  first_purchase_date?: string;

  // Seasonal
  current_season: string;
  cosmetics_unlocked: number;

  // Social
  friend_count: number;
  trades_completed: number;

  // Retention
  total_sessions: number;
  avg_session_duration_seconds: number;
  last_session_date: string;
}

// ===== HELPER FUNCTIONS =====

/**
 * Create an event with properties
 */
export function createEvent(
  eventTemplate: AnalyticsEvent,
  properties?: Record<string, any>
): AnalyticsEvent {
  return {
    ...eventTemplate,
    properties: {
      ...eventTemplate.properties,
      ...properties,
      timestamp: new Date().toISOString(),
    },
  };
}

/**
 * Get all event names (for validation)
 */
export function getAllEventNames(): string[] {
  const allEvents = [
    ...Object.values(OnboardingEvents),
    ...Object.values(KizunaEvents),
    ...Object.values(SeasonalEvents),
    ...Object.values(BreedingEvents),
    ...Object.values(ShrineEvents),
    ...Object.values(TradingEvents),
    ...Object.values(MonetizationEvents),
    ...Object.values(RetentionEvents),
    ...Object.values(SocialEvents),
  ];

  return allEvents.map((event) => event.name);
}
