/**
 * Seasonal Overlay Effects
 *
 * Renders season-specific particle effects:
 * - Risshun: Sakura petals falling
 * - Shoman: Rain droplets
 * - Tsuyu: Moss spores drifting
 * - Shocho: Star trails
 * - Kanro: Autumn leaves
 * - Ritto: Frost crystals
 * - Daikan: Snow falling
 */

import { useEffect, useState } from 'react';
import { getCurrentSeason, type SeasonId } from '../../../mononoke-garden-core/seasons/calendar';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  rotation: number;
}

export function SeasonalOverlay() {
  const season = getCurrentSeason();
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Generate particles based on season
    const particleCount = getParticleCount(season.id);
    const newParticles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * -100, // Start above viewport
        size: getParticleSize(season.id),
        speed: getParticleSpeed(season.id),
        opacity: Math.random() * 0.5 + 0.3,
        rotation: Math.random() * 360,
      });
    }

    setParticles(newParticles);
  }, [season.id]);

  const particleStyle = getParticleStyle(season.id);

  return (
    <div className="seasonal-overlay">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={`seasonal-particle ${season.id}`}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
            transform: `rotate(${particle.rotation}deg)`,
            animationDuration: `${particle.speed}s`,
            animationDelay: `${Math.random() * 5}s`,
            ...particleStyle,
          }}
        />
      ))}
    </div>
  );
}

function getParticleCount(season: SeasonId): number {
  const counts: Record<SeasonId, number> = {
    risshun: 40,  // Sakura petals
    shoman: 25,   // Rain droplets
    tsuyu: 20,    // Moss spores
    shocho: 50,   // Star trails (MASSIVE EVENT)
    kanro: 30,    // Autumn leaves
    ritto: 15,    // Frost crystals
    daikan: 35,   // Snow
  };
  return counts[season];
}

function getParticleSize(season: SeasonId): number {
  const sizes: Record<SeasonId, number> = {
    risshun: 12,  // Sakura petals
    shoman: 4,    // Rain droplets
    tsuyu: 6,     // Moss spores
    shocho: 8,    // Stars
    kanro: 14,    // Leaves
    ritto: 10,    // Frost
    daikan: 8,    // Snow
  };
  return sizes[season] + Math.random() * 4;
}

function getParticleSpeed(season: SeasonId): number {
  const speeds: Record<SeasonId, number> = {
    risshun: 8,   // Gentle fall
    shoman: 3,    // Fast rain
    tsuyu: 12,    // Slow drift
    shocho: 6,    // Twinkling
    kanro: 7,     // Swaying fall
    ritto: 10,    // Slow descent
    daikan: 9,    // Floating snow
  };
  return speeds[season] + Math.random() * 3;
}

function getParticleStyle(season: SeasonId): React.CSSProperties {
  const styles: Record<SeasonId, React.CSSProperties> = {
    risshun: {
      background: 'linear-gradient(135deg, #ffc0cb, #ffb6c1)',
      borderRadius: '50% 0 50% 0',
      boxShadow: '0 2px 4px rgba(255, 192, 203, 0.3)',
    },
    shoman: {
      background: 'linear-gradient(180deg, #93c5fd, #60a5fa)',
      borderRadius: '50%',
      boxShadow: '0 2px 4px rgba(96, 165, 250, 0.4)',
    },
    tsuyu: {
      background: 'radial-gradient(circle, #86efac, #4ade80)',
      borderRadius: '50%',
      opacity: 0.3,
    },
    shocho: {
      background: 'radial-gradient(circle, #fbbf24, #fef3c7)',
      borderRadius: '50%',
      boxShadow: '0 0 12px rgba(251, 191, 36, 0.8)',
    },
    kanro: {
      background: 'linear-gradient(135deg, #fb923c, #f59e0b)',
      borderRadius: '50% 0 50% 50%',
      boxShadow: '0 2px 4px rgba(245, 158, 11, 0.3)',
    },
    ritto: {
      background: 'radial-gradient(circle, #e0f2fe, #bae6fd)',
      borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
      boxShadow: '0 0 8px rgba(186, 230, 253, 0.5)',
    },
    daikan: {
      background: 'radial-gradient(circle, #ffffff, #f0f9ff)',
      borderRadius: '50%',
      boxShadow: '0 2px 6px rgba(255, 255, 255, 0.4)',
    },
  };
  return styles[season];
}
