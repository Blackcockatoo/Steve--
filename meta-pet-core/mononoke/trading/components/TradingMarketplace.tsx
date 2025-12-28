/**
 * Trading Marketplace Component
 */

import { useState, useEffect } from 'react';
import { getTradingNetwork, type TradeOffer, type MarketplaceFilters } from '../tradingNetwork';
import { SEASONS, type SeasonId } from '../../../../mononoke-garden-core/seasons/calendar';
import { KIZUNA_TIERS, type KizunaLevel } from '../../../../mononoke-garden-core/kizuna/bondSystem';

interface TradingMarketplaceProps {
  currentUserId: string;
  currentUserName: string;
  onTradeProposed: (offerId: string) => void;
}

export function TradingMarketplace({ currentUserId, currentUserName, onTradeProposed }: TradingMarketplaceProps) {
  const tradingNetwork = getTradingNetwork();
  const [offers, setOffers] = useState<TradeOffer[]>([]);
  const [filters, setFilters] = useState<MarketplaceFilters>({
    sortBy: 'newest',
  });
  const [selectedOffer, setSelectedOffer] = useState<TradeOffer | null>(null);

  useEffect(() => {
    // Load marketplace offers
    const loadOffers = () => {
      const marketplaceOffers = tradingNetwork.browseMarketplace(filters, currentUserId);
      setOffers(marketplaceOffers);
    };

    loadOffers();

    // Refresh every 30 seconds
    const interval = setInterval(loadOffers, 30000);
    return () => clearInterval(interval);
  }, [filters, currentUserId]);

  const handleSeasonFilter = (season: SeasonId | 'all') => {
    setFilters({
      ...filters,
      season: season === 'all' ? undefined : season,
    });
  };

  const handleKizunaFilter = (level: KizunaLevel | 'all') => {
    setFilters({
      ...filters,
      minKizunaLevel: level === 'all' ? undefined : level,
    });
  };

  const handleSortChange = (sortBy: MarketplaceFilters['sortBy']) => {
    setFilters({ ...filters, sortBy });
  };

  return (
    <div className="trading-marketplace">
      {/* Header */}
      <div className="marketplace-header">
        <h2>🤝 Trading Marketplace</h2>
        <p className="subtitle">Find your perfect companion</p>
      </div>

      {/* Filters */}
      <div className="marketplace-filters glass">
        <div className="filter-group">
          <label>Season</label>
          <select onChange={(e) => handleSeasonFilter(e.target.value as SeasonId | 'all')}>
            <option value="all">All Seasons</option>
            {Object.values(SEASONS).map((season) => (
              <option key={season.id} value={season.id}>
                {season.icon} {season.nameEN}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Kizuna Level</label>
          <select onChange={(e) => handleKizunaFilter(e.target.value === 'all' ? 'all' : parseInt(e.target.value) as KizunaLevel)}>
            <option value="all">Any Level</option>
            {[1, 2, 3, 4, 5, 6, 7].map((level) => (
              <option key={level} value={level}>
                Level {level} ({KIZUNA_TIERS[level as KizunaLevel].nameEN})
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Sort By</label>
          <select onChange={(e) => handleSortChange(e.target.value as MarketplaceFilters['sortBy'])}>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="kizuna_high">Highest Kizuna</option>
            <option value="kizuna_low">Lowest Kizuna</option>
          </select>
        </div>

        <div className="filter-stats">
          <span className="result-count">{offers.length} companions available</span>
        </div>
      </div>

      {/* Marketplace Grid */}
      <div className="marketplace-grid">
        {offers.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">🏮</span>
            <h3>No Companions Available</h3>
            <p>Check back later or adjust your filters</p>
          </div>
        ) : (
          offers.map((offer) => (
            <div key={offer.id} className="companion-card glass" onClick={() => setSelectedOffer(offer)}>
              {/* Companion Icon */}
              <div className="companion-icon">
                {SEASONS[offer.offeredCompanion.birthSeason].icon}
              </div>

              {/* Companion Info */}
              <div className="companion-info">
                <div className="kizuna-badge">
                  {KIZUNA_TIERS[offer.offeredCompanion.kizunaLevel].icon} Lv.{offer.offeredCompanion.kizunaLevel}
                </div>
                <div className="season-badge">
                  {SEASONS[offer.offeredCompanion.birthSeason].nameEN}
                </div>

                {offer.offeredCompanion.specialAbility && (
                  <div className="special-ability">
                    ✨ {offer.offeredCompanion.specialAbility}
                  </div>
                )}
              </div>

              {/* Owner Info */}
              <div className="owner-info">
                <span className="owner-name">👤 {offer.offeredCompanion.ownerName}</span>
              </div>

              {/* Trade Button */}
              <button className="cta-primary" onClick={(e) => {
                e.stopPropagation();
                onTradeProposed(offer.id);
              }}>
                Propose Trade
              </button>

              {/* Expires */}
              <div className="expires-info">
                Expires {new Date(offer.expiresAt).toLocaleDateString()}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Selected Offer Modal */}
      {selectedOffer && (
        <div className="modal-overlay" onClick={() => setSelectedOffer(null)}>
          <div className="modal-content glass" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedOffer(null)}>×</button>

            <h3>Companion Details</h3>

            <div className="companion-details">
              <div className="detail-row">
                <span className="label">Birth Season:</span>
                <span className="value">
                  {SEASONS[selectedOffer.offeredCompanion.birthSeason].icon}{' '}
                  {SEASONS[selectedOffer.offeredCompanion.birthSeason].nameEN}
                </span>
              </div>

              <div className="detail-row">
                <span className="label">Kizuna Level:</span>
                <span className="value">
                  {KIZUNA_TIERS[selectedOffer.offeredCompanion.kizunaLevel].nameEN} (Lv.{selectedOffer.offeredCompanion.kizunaLevel})
                </span>
              </div>

              {selectedOffer.offeredCompanion.specialAbility && (
                <div className="detail-row">
                  <span className="label">Special Ability:</span>
                  <span className="value">✨ {selectedOffer.offeredCompanion.specialAbility}</span>
                </div>
              )}

              {selectedOffer.offeredCompanion.cosmetics.length > 0 && (
                <div className="detail-row">
                  <span className="label">Cosmetics:</span>
                  <span className="value">{selectedOffer.offeredCompanion.cosmetics.length} unlocked</span>
                </div>
              )}

              <div className="detail-row">
                <span className="label">Owner:</span>
                <span className="value">👤 {selectedOffer.offeredCompanion.ownerName}</span>
              </div>
            </div>

            {selectedOffer.requestedTraits && (
              <div className="requested-traits">
                <h4>Looking For:</h4>
                {selectedOffer.requestedTraits.minKizunaLevel && (
                  <div className="trait">
                    ⭐ Kizuna Level {selectedOffer.requestedTraits.minKizunaLevel}+
                  </div>
                )}
                {selectedOffer.requestedTraits.preferredSeason && (
                  <div className="trait">
                    {SEASONS[selectedOffer.requestedTraits.preferredSeason].icon}{' '}
                    {SEASONS[selectedOffer.requestedTraits.preferredSeason].nameEN}
                  </div>
                )}
                {selectedOffer.requestedTraits.requiredAbility && (
                  <div className="trait">
                    ✨ {selectedOffer.requestedTraits.requiredAbility}
                  </div>
                )}
              </div>
            )}

            <button className="cta-primary" onClick={() => {
              onTradeProposed(selectedOffer.id);
              setSelectedOffer(null);
            }}>
              Propose Trade
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
