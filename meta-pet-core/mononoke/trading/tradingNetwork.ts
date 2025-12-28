/**
 * Mononoke Garden - Community Trading Network
 *
 * P2P companion trading system with:
 * - Public marketplace
 * - Private trades
 * - Friend-only trades
 * - Trade history
 * - Reputation system
 */

import type { Genome } from '../../../mononoke-garden-core/genetics/base7Genome';
import type { KizunaLevel } from '../../../mononoke-garden-core/kizuna/bondSystem';
import type { SeasonId } from '../../../mononoke-garden-core/seasons/calendar';

// ===== TRADE TYPES =====

export type TradeStatus = 'pending' | 'accepted' | 'rejected' | 'cancelled' | 'completed';
export type TradeVisibility = 'public' | 'private' | 'friends';

export interface Companion {
  id: string;
  genome: Genome;
  kizunaLevel: KizunaLevel;
  birthSeason: SeasonId;
  specialAbility?: string;
  cosmetics: string[];
  ownerId: string;
  ownerName: string;
}

export interface TradeOffer {
  id: string;
  offeredCompanion: Companion;
  requestedTraits?: {
    minKizunaLevel?: KizunaLevel;
    preferredSeason?: SeasonId;
    requiredAbility?: string;
    personalityPreference?: string;
  };
  visibility: TradeVisibility;
  createdAt: Date;
  expiresAt: Date;
  status: TradeStatus;
}

export interface Trade {
  id: string;
  offerId: string;
  giver: {
    userId: string;
    userName: string;
    companion: Companion;
  };
  receiver: {
    userId: string;
    userName: string;
    companion: Companion;
  };
  status: TradeStatus;
  createdAt: Date;
  completedAt?: Date;
  rating?: {
    giverRating: number; // 1-5
    receiverRating: number; // 1-5
  };
}

export interface UserReputation {
  userId: string;
  totalTrades: number;
  averageRating: number;
  successRate: number; // % of trades not cancelled
  badges: TradeBadge[];
}

export type TradeBadge =
  | 'newcomer'           // 1st trade
  | 'experienced'        // 10 trades
  | 'veteran'            // 50 trades
  | 'legendary'          // 100 trades
  | 'fair_trader'        // 4.5+ rating
  | 'seasonal_collector' // Traded companions from all 7 seasons
  | 'breeder'            // Traded offspring
  | 'generous';          // High value trades

// ===== MARKETPLACE =====

export interface MarketplaceFilters {
  season?: SeasonId;
  minKizunaLevel?: KizunaLevel;
  maxKizunaLevel?: KizunaLevel;
  hasSpecialAbility?: boolean;
  visibility?: TradeVisibility;
  sortBy?: 'newest' | 'oldest' | 'kizuna_high' | 'kizuna_low';
}

class TradingNetwork {
  private offers: Map<string, TradeOffer> = new Map();
  private trades: Map<string, Trade> = new Map();
  private reputations: Map<string, UserReputation> = new Map();

  /**
   * Create a new trade offer
   */
  createOffer(
    companion: Companion,
    requestedTraits: TradeOffer['requestedTraits'],
    visibility: TradeVisibility,
    durationHours: number = 72 // 3 days default
  ): TradeOffer {
    const offer: TradeOffer = {
      id: `offer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      offeredCompanion: companion,
      requestedTraits,
      visibility,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + durationHours * 60 * 60 * 1000),
      status: 'pending',
    };

    this.offers.set(offer.id, offer);
    console.log(`[Trading] Created offer ${offer.id}`);

    return offer;
  }

  /**
   * Browse marketplace with filters
   */
  browseMarketplace(filters: MarketplaceFilters = {}, currentUserId: string): TradeOffer[] {
    let offers = Array.from(this.offers.values()).filter((offer) => {
      // Only show pending offers
      if (offer.status !== 'pending') return false;

      // Don't show expired offers
      if (offer.expiresAt < new Date()) return false;

      // Don't show own offers
      if (offer.offeredCompanion.ownerId === currentUserId) return false;

      // Apply visibility filter
      if (filters.visibility && offer.visibility !== filters.visibility) return false;

      // Apply season filter
      if (filters.season && offer.offeredCompanion.birthSeason !== filters.season) return false;

      // Apply kizuna level filters
      if (filters.minKizunaLevel && offer.offeredCompanion.kizunaLevel < filters.minKizunaLevel) return false;
      if (filters.maxKizunaLevel && offer.offeredCompanion.kizunaLevel > filters.maxKizunaLevel) return false;

      // Apply special ability filter
      if (filters.hasSpecialAbility && !offer.offeredCompanion.specialAbility) return false;

      return true;
    });

    // Sort
    switch (filters.sortBy) {
      case 'newest':
        offers.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
      case 'oldest':
        offers.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
        break;
      case 'kizuna_high':
        offers.sort((a, b) => b.offeredCompanion.kizunaLevel - a.offeredCompanion.kizunaLevel);
        break;
      case 'kizuna_low':
        offers.sort((a, b) => a.offeredCompanion.kizunaLevel - b.offeredCompanion.kizunaLevel);
        break;
      default:
        offers.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    return offers;
  }

  /**
   * Propose a trade (respond to an offer)
   */
  proposeTrade(
    offerId: string,
    receiverUserId: string,
    receiverUserName: string,
    offeredCompanion: Companion
  ): Trade | null {
    const offer = this.offers.get(offerId);
    if (!offer || offer.status !== 'pending') {
      console.error(`[Trading] Offer ${offerId} not available`);
      return null;
    }

    // Check if offered companion meets requested traits
    if (offer.requestedTraits) {
      const { minKizunaLevel, preferredSeason, requiredAbility } = offer.requestedTraits;

      if (minKizunaLevel && offeredCompanion.kizunaLevel < minKizunaLevel) {
        console.error(`[Trading] Companion does not meet minimum Kizuna level`);
        return null;
      }

      if (preferredSeason && offeredCompanion.birthSeason !== preferredSeason) {
        console.warn(`[Trading] Companion does not match preferred season`);
      }

      if (requiredAbility && offeredCompanion.specialAbility !== requiredAbility) {
        console.error(`[Trading] Companion does not have required ability`);
        return null;
      }
    }

    // Create trade
    const trade: Trade = {
      id: `trade_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      offerId,
      giver: {
        userId: offer.offeredCompanion.ownerId,
        userName: offer.offeredCompanion.ownerName,
        companion: offer.offeredCompanion,
      },
      receiver: {
        userId: receiverUserId,
        userName: receiverUserName,
        companion: offeredCompanion,
      },
      status: 'pending',
      createdAt: new Date(),
    };

    this.trades.set(trade.id, trade);
    console.log(`[Trading] Created trade ${trade.id}`);

    return trade;
  }

  /**
   * Accept a trade
   */
  acceptTrade(tradeId: string, userId: string): boolean {
    const trade = this.trades.get(tradeId);
    if (!trade || trade.status !== 'pending') {
      console.error(`[Trading] Trade ${tradeId} not available`);
      return false;
    }

    // Only the giver can accept
    if (trade.giver.userId !== userId) {
      console.error(`[Trading] Only the original offer creator can accept`);
      return false;
    }

    trade.status = 'accepted';
    trade.completedAt = new Date();

    // Mark offer as completed
    const offer = this.offers.get(trade.offerId);
    if (offer) {
      offer.status = 'completed';
    }

    // Update reputations
    this.updateReputation(trade.giver.userId, true);
    this.updateReputation(trade.receiver.userId, true);

    console.log(`[Trading] Trade ${tradeId} accepted`);
    return true;
  }

  /**
   * Reject a trade
   */
  rejectTrade(tradeId: string, userId: string, reason?: string): boolean {
    const trade = this.trades.get(tradeId);
    if (!trade || trade.status !== 'pending') {
      console.error(`[Trading] Trade ${tradeId} not available`);
      return false;
    }

    // Only the giver can reject
    if (trade.giver.userId !== userId) {
      console.error(`[Trading] Only the original offer creator can reject`);
      return false;
    }

    trade.status = 'rejected';
    console.log(`[Trading] Trade ${tradeId} rejected: ${reason || 'No reason provided'}`);

    return true;
  }

  /**
   * Cancel an offer
   */
  cancelOffer(offerId: string, userId: string): boolean {
    const offer = this.offers.get(offerId);
    if (!offer || offer.status !== 'pending') {
      console.error(`[Trading] Offer ${offerId} not available`);
      return false;
    }

    if (offer.offeredCompanion.ownerId !== userId) {
      console.error(`[Trading] Only the owner can cancel this offer`);
      return false;
    }

    offer.status = 'cancelled';
    console.log(`[Trading] Offer ${offerId} cancelled`);

    return true;
  }

  /**
   * Rate a completed trade
   */
  rateTrade(tradeId: string, userId: string, rating: number): boolean {
    const trade = this.trades.get(tradeId);
    if (!trade || trade.status !== 'accepted') {
      console.error(`[Trading] Trade ${tradeId} not available for rating`);
      return false;
    }

    if (rating < 1 || rating > 5) {
      console.error(`[Trading] Invalid rating: ${rating}`);
      return false;
    }

    if (!trade.rating) {
      trade.rating = { giverRating: 0, receiverRating: 0 };
    }

    if (userId === trade.giver.userId) {
      trade.rating.receiverRating = rating;
      this.updateRating(trade.receiver.userId, rating);
    } else if (userId === trade.receiver.userId) {
      trade.rating.giverRating = rating;
      this.updateRating(trade.giver.userId, rating);
    } else {
      console.error(`[Trading] User not part of this trade`);
      return false;
    }

    console.log(`[Trading] Trade ${tradeId} rated ${rating} stars`);
    return true;
  }

  /**
   * Get user's trade history
   */
  getUserTradeHistory(userId: string): Trade[] {
    return Array.from(this.trades.values())
      .filter((trade) => trade.giver.userId === userId || trade.receiver.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  /**
   * Get user's active offers
   */
  getUserOffers(userId: string): TradeOffer[] {
    return Array.from(this.offers.values())
      .filter((offer) => offer.offeredCompanion.ownerId === userId)
      .filter((offer) => offer.status === 'pending' && offer.expiresAt > new Date())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  /**
   * Get user's pending trade proposals
   */
  getUserPendingTrades(userId: string): Trade[] {
    return Array.from(this.trades.values())
      .filter((trade) => trade.status === 'pending')
      .filter((trade) => trade.giver.userId === userId || trade.receiver.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  /**
   * Get user reputation
   */
  getUserReputation(userId: string): UserReputation {
    let reputation = this.reputations.get(userId);

    if (!reputation) {
      reputation = {
        userId,
        totalTrades: 0,
        averageRating: 0,
        successRate: 0,
        badges: ['newcomer'],
      };
      this.reputations.set(userId, reputation);
    }

    return reputation;
  }

  /**
   * Update reputation after trade
   */
  private updateReputation(userId: string, success: boolean): void {
    const reputation = this.getUserReputation(userId);
    reputation.totalTrades++;

    // Update success rate
    const userTrades = this.getUserTradeHistory(userId);
    const successfulTrades = userTrades.filter((t) => t.status === 'accepted').length;
    reputation.successRate = (successfulTrades / userTrades.length) * 100;

    // Award badges
    if (reputation.totalTrades >= 1 && !reputation.badges.includes('newcomer')) {
      reputation.badges.push('newcomer');
    }
    if (reputation.totalTrades >= 10 && !reputation.badges.includes('experienced')) {
      reputation.badges.push('experienced');
    }
    if (reputation.totalTrades >= 50 && !reputation.badges.includes('veteran')) {
      reputation.badges.push('veteran');
    }
    if (reputation.totalTrades >= 100 && !reputation.badges.includes('legendary')) {
      reputation.badges.push('legendary');
    }

    this.reputations.set(userId, reputation);
  }

  /**
   * Update rating
   */
  private updateRating(userId: string, rating: number): void {
    const reputation = this.getUserReputation(userId);

    // Calculate new average
    const totalRatings = reputation.totalTrades;
    const currentTotal = reputation.averageRating * (totalRatings - 1);
    reputation.averageRating = (currentTotal + rating) / totalRatings;

    // Award fair trader badge
    if (reputation.averageRating >= 4.5 && !reputation.badges.includes('fair_trader')) {
      reputation.badges.push('fair_trader');
    }

    this.reputations.set(userId, reputation);
  }

  /**
   * Clean up expired offers
   */
  cleanupExpiredOffers(): number {
    let cleanedCount = 0;

    for (const [id, offer] of this.offers.entries()) {
      if (offer.expiresAt < new Date() && offer.status === 'pending') {
        offer.status = 'cancelled';
        cleanedCount++;
      }
    }

    console.log(`[Trading] Cleaned up ${cleanedCount} expired offers`);
    return cleanedCount;
  }
}

// ===== SINGLETON INSTANCE =====

let tradingNetworkInstance: TradingNetwork | null = null;

/**
 * Get trading network instance
 */
export function getTradingNetwork(): TradingNetwork {
  if (!tradingNetworkInstance) {
    tradingNetworkInstance = new TradingNetwork();

    // Schedule periodic cleanup (every hour)
    setInterval(() => {
      tradingNetworkInstance?.cleanupExpiredOffers();
    }, 60 * 60 * 1000);
  }

  return tradingNetworkInstance;
}
