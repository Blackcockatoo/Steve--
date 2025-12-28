/**
 * Torii Gate Navigation
 *
 * Traditional Japanese gate structure as navigation metaphor.
 * Replaces tabs with sacred portals.
 */

import { useState } from 'react';
import { getCurrentSeason } from '../../../mononoke-garden-core/seasons/calendar';
import type { KizunaLevel } from '../../../mononoke-garden-core/kizuna/bondSystem';

type ToriiGate = 'sanctuary' | 'gardens' | 'breeding' | 'events' | 'shrine';

interface ToriiNavigationProps {
  currentGate: ToriiGate;
  onNavigate: (gate: ToriiGate) => void;
  kizunaLevel: KizunaLevel;
}

export function ToriiNavigation({ currentGate, onNavigate, kizunaLevel }: ToriiNavigationProps) {
  const season = getCurrentSeason();
  const [isHovering, setIsHovering] = useState<ToriiGate | null>(null);

  const gates = [
    {
      id: 'sanctuary' as ToriiGate,
      nameJa: '聖域',
      nameEn: 'Sanctuary',
      icon: '🏠',
      unlocked: true,
      description: 'Your companion\'s home',
    },
    {
      id: 'gardens' as ToriiGate,
      nameJa: '庭園',
      nameEn: 'Gardens',
      icon: '🌸',
      unlocked: true,
      description: 'Explore your companions',
    },
    {
      id: 'breeding' as ToriiGate,
      nameJa: '継承',
      nameEn: 'Breeding',
      icon: '👶',
      unlocked: kizunaLevel >= 7,
      description: 'Pass on your legacy',
    },
    {
      id: 'events' as ToriiGate,
      nameJa: '祭事',
      nameEn: 'Events',
      icon: '🎋',
      unlocked: true,
      description: season.specialEvent ? `${season.nameJP} - ${season.specialEvent.nameJP}` : season.nameJP,
    },
    {
      id: 'shrine' as ToriiGate,
      nameJa: '神社',
      nameEn: 'Shrine',
      icon: '⛩️',
      unlocked: true,
      description: 'Visit sacred places',
    },
  ];

  return (
    <nav className="torii-navigation">
      <div className="torii-gates">
        {gates.map((gate) => (
          <button
            key={gate.id}
            className={`torii-gate ${currentGate === gate.id ? 'active' : ''} ${
              !gate.unlocked ? 'locked' : ''
            }`}
            onClick={() => gate.unlocked && onNavigate(gate.id)}
            onMouseEnter={() => setIsHovering(gate.id)}
            onMouseLeave={() => setIsHovering(null)}
            disabled={!gate.unlocked}
          >
            {/* Torii gate arch */}
            <div className="gate-arch">
              <div className="beam top" />
              <div className="pillar left" />
              <div className="pillar right" />
              <div className="beam bottom" />
            </div>

            {/* Gate content */}
            <div className="gate-content">
              <span className="icon">{gate.icon}</span>
              <span className="name-ja">{gate.nameJa}</span>
              <span className="name-en">{gate.nameEn}</span>
            </div>

            {/* Lock indicator */}
            {!gate.unlocked && (
              <div className="lock-overlay">
                <span className="lock-icon">🔒</span>
                <span className="unlock-hint">Kizuna Lv.7</span>
              </div>
            )}

            {/* Hover tooltip */}
            {isHovering === gate.id && (
              <div className="gate-tooltip">
                {gate.description}
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Seasonal indicator */}
      <div className="season-indicator">
        <span className="season-icon">{season.icon}</span>
        <span className="season-name">{season.nameJP}</span>
        <span className="season-name-en">{season.nameEN}</span>
      </div>
    </nav>
  );
}
