/**
 * Shrine QR Code System
 *
 * Integrates with real Japanese shrines via QR codes.
 * Players scan codes at partner shrines to receive blessings.
 */

export interface Shrine {
  id: string;
  name: string;
  nameJa: string;
  location: {
    prefecture: string;
    city: string;
    coordinates: { lat: number; lng: number };
  };
  tier: 'local' | 'regional' | 'major' | 'grand';
  blessing: ShrineBlessing;
  visitCount: number;
  lastVisit: Date | null;
}

export interface ShrineBlessing {
  type: 'kizuna' | 'breeding' | 'seasonal' | 'cosmetic' | 'rare';
  duration: number; // hours
  effect: {
    kizunaBonus?: number;      // +X% Kizuna XP
    breedingBonus?: number;    // +X% breeding success
    seasonalBonus?: number;    // +X% seasonal event rewards
    cosmeticUnlock?: string;   // Unlock exclusive cosmetic
    rareChance?: number;       // +X% chance for rare traits
  };
  description: string;
  descriptionJa: string;
}

// Partner shrine database (examples)
export const PARTNER_SHRINES: Record<string, Shrine> = {
  'meiji-jingu': {
    id: 'meiji-jingu',
    name: 'Meiji Shrine',
    nameJa: '明治神宮',
    location: {
      prefecture: 'Tokyo',
      city: 'Shibuya',
      coordinates: { lat: 35.6764, lng: 139.6993 },
    },
    tier: 'grand',
    blessing: {
      type: 'kizuna',
      duration: 24,
      effect: { kizunaBonus: 50 },
      description: 'Kizuna XP +50% for 24 hours',
      descriptionJa: '絆経験値 +50% (24時間)',
    },
    visitCount: 0,
    lastVisit: null,
  },
  'fushimi-inari': {
    id: 'fushimi-inari',
    name: 'Fushimi Inari Taisha',
    nameJa: '伏見稲荷大社',
    location: {
      prefecture: 'Kyoto',
      city: 'Fushimi',
      coordinates: { lat: 34.9671, lng: 135.7727 },
    },
    tier: 'grand',
    blessing: {
      type: 'breeding',
      duration: 48,
      effect: { breedingBonus: 100 },
      description: 'Breeding success +100% for 48 hours',
      descriptionJa: '繁殖成功率 +100% (48時間)',
    },
    visitCount: 0,
    lastVisit: null,
  },
  'itsukushima': {
    id: 'itsukushima',
    name: 'Itsukushima Shrine',
    nameJa: '厳島神社',
    location: {
      prefecture: 'Hiroshima',
      city: 'Miyajima',
      coordinates: { lat: 34.2957, lng: 132.3197 },
    },
    tier: 'grand',
    blessing: {
      type: 'cosmetic',
      duration: 0, // Permanent
      effect: { cosmeticUnlock: 'floating-torii' },
      description: 'Unlock exclusive "Floating Torii" cosmetic',
      descriptionJa: '限定コスメ「浮き鳥居」解放',
    },
    visitCount: 0,
    lastVisit: null,
  },
};

/**
 * Scan QR code and apply shrine blessing
 */
export function scanShrineQR(qrCode: string, userId: string): {
  success: boolean;
  shrine?: Shrine;
  blessing?: ShrineBlessing;
  error?: string;
} {
  // Validate QR code format: "MONONOKE-SHRINE-{shrine-id}-{verification-hash}"
  const qrPattern = /^MONONOKE-SHRINE-([a-z-]+)-([a-f0-9]{8})$/;
  const match = qrCode.match(qrPattern);

  if (!match) {
    return { success: false, error: 'Invalid QR code format' };
  }

  const [, shrineId, verificationHash] = match;

  // Check if shrine exists
  const shrine = PARTNER_SHRINES[shrineId];
  if (!shrine) {
    return { success: false, error: 'Shrine not found' };
  }

  // Verify hash (simplified - production would use proper crypto)
  const expectedHash = generateVerificationHash(shrineId);
  if (verificationHash !== expectedHash) {
    return { success: false, error: 'Invalid QR code verification' };
  }

  // Check if already visited today (prevent spam)
  if (shrine.lastVisit) {
    const hoursSinceVisit = (Date.now() - shrine.lastVisit.getTime()) / (1000 * 60 * 60);
    if (hoursSinceVisit < 24) {
      return {
        success: false,
        error: `You can revisit this shrine in ${Math.ceil(24 - hoursSinceVisit)} hours`,
      };
    }
  }

  // Apply blessing
  shrine.visitCount++;
  shrine.lastVisit = new Date();

  return {
    success: true,
    shrine,
    blessing: shrine.blessing,
  };
}

/**
 * Generate verification hash (simplified)
 */
function generateVerificationHash(shrineId: string): string {
  // In production, use proper HMAC with secret key
  let hash = 0;
  for (let i = 0; i < shrineId.length; i++) {
    hash = (hash << 5) - hash + shrineId.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(8, '0').substring(0, 8);
}

/**
 * Get nearby shrines (if location permission granted)
 */
export function getNearbyShrines(
  userLat: number,
  userLng: number,
  radiusKm: number = 50
): Shrine[] {
  const nearby: Shrine[] = [];

  for (const shrine of Object.values(PARTNER_SHRINES)) {
    const distance = calculateDistance(
      userLat,
      userLng,
      shrine.location.coordinates.lat,
      shrine.location.coordinates.lng
    );

    if (distance <= radiusKm) {
      nearby.push(shrine);
    }
  }

  // Sort by distance
  nearby.sort((a, b) => {
    const distA = calculateDistance(userLat, userLng, a.location.coordinates.lat, a.location.coordinates.lng);
    const distB = calculateDistance(userLat, userLng, b.location.coordinates.lat, b.location.coordinates.lng);
    return distA - distB;
  });

  return nearby;
}

/**
 * Calculate distance between two coordinates (Haversine formula)
 */
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}
