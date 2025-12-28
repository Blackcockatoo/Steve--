/**
 * Trade Manager Component
 *
 * Manages user's active trades, offers, and trade history
 */

import { useState, useEffect } from 'react';
import { getTradingNetwork, type Trade, type TradeOffer, type UserReputation } from '../tradingNetwork';
import { KIZUNA_TIERS } from '../../../../mononoke-garden-core/kizuna/bondSystem';
import { SEASONS } from '../../../../mononoke-garden-core/seasons/calendar';

interface TradeManagerProps {
  userId: string;
}

export function TradeManager({ userId }: TradeManagerProps) {
  const tradingNetwork = getTradingNetwork();
  const [activeTab, setActiveTab] = useState<'offers' | 'pending' | 'history' | 'reputation'>('offers');
  const [offers, setOffers] = useState<TradeOffer[]>([]);
  const [pendingTrades, setPendingTrades] = useState<Trade[]>([]);
  const [tradeHistory, setTradeHistory] = useState<Trade[]>([]);
  const [reputation, setReputation] = useState<UserReputation | null>(null);

  useEffect(() => {
    loadData();

    // Refresh every 30 seconds
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, [userId]);

  const loadData = () => {
    setOffers(tradingNetwork.getUserOffers(userId));
    setPendingTrades(tradingNetwork.getUserPendingTrades(userId));
    setTradeHistory(tradingNetwork.getUserTradeHistory(userId));
    setReputation(tradingNetwork.getUserReputation(userId));
  };

  const handleAcceptTrade = (tradeId: string) => {
    const success = tradingNetwork.acceptTrade(tradeId, userId);
    if (success) {
      loadData();
    }
  };

  const handleRejectTrade = (tradeId: string) => {
    const success = tradingNetwork.rejectTrade(tradeId, userId);
    if (success) {
      loadData();
    }
  };

  const handleCancelOffer = (offerId: string) => {
    const success = tradingNetwork.cancelOffer(offerId, userId);
    if (success) {
      loadData();
    }
  };

  const handleRateTrade = (tradeId: string, rating: number) => {
    const success = tradingNetwork.rateTrade(tradeId, userId, rating);
    if (success) {
      loadData();
    }
  };

  return (
    <div className="trade-manager">
      {/* Tabs */}
      <div className="trade-tabs">
        <button
          className={`tab ${activeTab === 'offers' ? 'active' : ''}`}
          onClick={() => setActiveTab('offers')}
        >
          My Offers ({offers.length})
        </button>
        <button
          className={`tab ${activeTab === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          Pending Trades ({pendingTrades.length})
        </button>
        <button
          className={`tab ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          History ({tradeHistory.length})
        </button>
        <button
          className={`tab ${activeTab === 'reputation' ? 'active' : ''}`}
          onClick={() => setActiveTab('reputation')}
        >
          Reputation
        </button>
      </div>

      {/* My Offers Tab */}
      {activeTab === 'offers' && (
        <div className="offers-list">
          <h3>Your Active Offers</h3>
          {offers.length === 0 ? (
            <div className="empty-state">
              <p>You have no active offers</p>
            </div>
          ) : (
            offers.map((offer) => (
              <div key={offer.id} className="offer-card glass">
                <div className="offer-info">
                  <div className="companion-preview">
                    {SEASONS[offer.offeredCompanion.birthSeason].icon}
                    {KIZUNA_TIERS[offer.offeredCompanion.kizunaLevel].icon} Lv.{offer.offeredCompanion.kizunaLevel}
                  </div>
                  <div className="offer-details">
                    <div className="visibility-badge">{offer.visibility}</div>
                    <div className="expires">
                      Expires: {new Date(offer.expiresAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <button className="cta-secondary" onClick={() => handleCancelOffer(offer.id)}>
                  Cancel Offer
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* Pending Trades Tab */}
      {activeTab === 'pending' && (
        <div className="pending-trades-list">
          <h3>Pending Trade Proposals</h3>
          {pendingTrades.length === 0 ? (
            <div className="empty-state">
              <p>No pending trades</p>
            </div>
          ) : (
            pendingTrades.map((trade) => {
              const isGiver = trade.giver.userId === userId;
              const otherParty = isGiver ? trade.receiver : trade.giver;

              return (
                <div key={trade.id} className="trade-card glass">
                  <div className="trade-header">
                    <h4>{isGiver ? 'Incoming Proposal' : 'Awaiting Response'}</h4>
                    <span className="date">{new Date(trade.createdAt).toLocaleDateString()}</span>
                  </div>

                  <div className="trade-comparison">
                    <div className="companion-side">
                      <h5>You Give</h5>
                      <div className="companion-preview">
                        {SEASONS[trade.giver.companion.birthSeason].icon}
                        {KIZUNA_TIERS[trade.giver.companion.kizunaLevel].icon} Lv.{trade.giver.companion.kizunaLevel}
                      </div>
                    </div>

                    <div className="trade-arrow">⇄</div>

                    <div className="companion-side">
                      <h5>You Get</h5>
                      <div className="companion-preview">
                        {SEASONS[trade.receiver.companion.birthSeason].icon}
                        {KIZUNA_TIERS[trade.receiver.companion.kizunaLevel].icon} Lv.{trade.receiver.companion.kizunaLevel}
                      </div>
                    </div>
                  </div>

                  <div className="other-party">
                    <span>Trading with: 👤 {otherParty.userName}</span>
                  </div>

                  {isGiver && (
                    <div className="trade-actions">
                      <button className="cta-primary" onClick={() => handleAcceptTrade(trade.id)}>
                        Accept Trade
                      </button>
                      <button className="cta-secondary" onClick={() => handleRejectTrade(trade.id)}>
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="trade-history">
          <h3>Trade History</h3>
          {tradeHistory.length === 0 ? (
            <div className="empty-state">
              <p>No trade history yet</p>
            </div>
          ) : (
            tradeHistory.map((trade) => {
              const isGiver = trade.giver.userId === userId;
              const otherParty = isGiver ? trade.receiver : trade.giver;

              return (
                <div key={trade.id} className={`history-card glass ${trade.status}`}>
                  <div className="history-header">
                    <span className={`status-badge ${trade.status}`}>{trade.status}</span>
                    <span className="date">{new Date(trade.createdAt).toLocaleDateString()}</span>
                  </div>

                  <div className="history-details">
                    <div>Traded with: 👤 {otherParty.userName}</div>
                    {trade.status === 'accepted' && trade.completedAt && (
                      <div>Completed: {new Date(trade.completedAt).toLocaleDateString()}</div>
                    )}
                  </div>

                  {trade.status === 'accepted' && !trade.rating && (
                    <div className="rating-section">
                      <p>Rate this trade:</p>
                      <div className="star-rating">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            className="star-button"
                            onClick={() => handleRateTrade(trade.id, star)}
                          >
                            ⭐
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Reputation Tab */}
      {activeTab === 'reputation' && reputation && (
        <div className="reputation-panel glass">
          <h3>Your Trading Reputation</h3>

          <div className="reputation-stats">
            <div className="stat-card">
              <div className="stat-value">{reputation.totalTrades}</div>
              <div className="stat-label">Total Trades</div>
            </div>

            <div className="stat-card">
              <div className="stat-value">
                {reputation.averageRating > 0 ? reputation.averageRating.toFixed(1) : 'N/A'}
                {reputation.averageRating > 0 && ' ⭐'}
              </div>
              <div className="stat-label">Average Rating</div>
            </div>

            <div className="stat-card">
              <div className="stat-value">{reputation.successRate.toFixed(0)}%</div>
              <div className="stat-label">Success Rate</div>
            </div>
          </div>

          <div className="badges-section">
            <h4>Badges Earned</h4>
            <div className="badges-grid">
              {reputation.badges.map((badge) => (
                <div key={badge} className="badge-card">
                  <div className="badge-icon">{getBadgeIcon(badge)}</div>
                  <div className="badge-name">{formatBadgeName(badge)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper functions

function getBadgeIcon(badge: string): string {
  const icons: Record<string, string> = {
    newcomer: '🌱',
    experienced: '🌸',
    veteran: '🏮',
    legendary: '⛩️',
    fair_trader: '✨',
    seasonal_collector: '🌈',
    breeder: '👶',
    generous: '💝',
  };
  return icons[badge] || '🏅';
}

function formatBadgeName(badge: string): string {
  return badge
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
