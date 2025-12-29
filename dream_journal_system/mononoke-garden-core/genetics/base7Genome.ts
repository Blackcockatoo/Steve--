/**
 * Mononoke Garden - Base-7 Genetics System
 *
 * Three 60-digit base-7 sequences encode:
 * - RED60: Personality dominance matrix (7 axes × ~8-9 digits each)
 * - BLUE60: Appearance/trait blueprint
 * - BLACK60: Special ability encoding
 *
 * Philosophy: Hidden complexity, visible beauty
 */

export type Base7Digit = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export type Base7Sequence = Base7Digit[]; // Length 60

export interface Genome {
  red60: Base7Sequence;   // Personality dominance
  blue60: Base7Sequence;  // Appearance traits
  black60: Base7Sequence; // Special abilities
}

// ===== BASE-7 UTILITIES =====

/**
 * Generate a random base-7 digit (0-6)
 */
export function randomBase7Digit(): Base7Digit {
  return Math.floor(Math.random() * 7) as Base7Digit;
}

/**
 * Generate a random 60-digit base-7 sequence
 */
export function generateRandomSequence(): Base7Sequence {
  return Array.from({ length: 60 }, () => randomBase7Digit());
}

/**
 * Generate a completely random genome
 */
export function generateRandomGenome(): Genome {
  return {
    red60: generateRandomSequence(),
    blue60: generateRandomSequence(),
    black60: generateRandomSequence(),
  };
}

/**
 * Convert base-7 sequence to string (for display)
 */
export function sequenceToString(seq: Base7Sequence): string {
  return seq.join('');
}

/**
 * Convert string to base-7 sequence (for parsing)
 */
export function stringToSequence(str: string): Base7Sequence {
  return str.split('').map((char) => {
    const digit = parseInt(char, 10);
    if (digit >= 0 && digit <= 6) {
      return digit as Base7Digit;
    }
    throw new Error(`Invalid base-7 digit: ${char}`);
  }) as Base7Sequence;
}

/**
 * Extract a sub-sequence from a larger sequence
 */
export function extractSubSequence(
  seq: Base7Sequence,
  start: number,
  length: number
): Base7Sequence {
  return seq.slice(start, start + length) as Base7Sequence;
}

/**
 * Average two base-7 digits (used in breeding)
 */
export function averageDigits(a: Base7Digit, b: Base7Digit): Base7Digit {
  return Math.round((a + b) / 2) as Base7Digit;
}

/**
 * Mutate a base-7 digit slightly (drift ±1, clamped to 0-6)
 */
export function mutateDigit(digit: Base7Digit, amount: -1 | 0 | 1 = 1): Base7Digit {
  const mutated = digit + amount;
  return Math.max(0, Math.min(6, mutated)) as Base7Digit;
}

// ===== PERSONALITY ENCODING (RED60) =====

/**
 * RED60 is divided into 7 sections (one per personality axis)
 * Each section is ~8-9 digits
 */
export const PERSONALITY_AXES = [
  'shyness',       // 内気 ↔ 外向 (0=shy, 6=outgoing)
  'emotionality',  // 論理的 ↔ 感情的 (0=logical, 6=emotional)
  'energy',        // 活発 ↔ 穏やか (0=calm, 6=energetic)
  'sociability',   // 社交 ↔ 孤独 (0=solitary, 6=social)
  'bravery',       // 勇敢 ↔ 慎重 (0=cautious, 6=brave)
  'creativity',    // 創造的 ↔ 実践的 (0=practical, 6=creative)
  'openness',      // 開放 ↔ 保守 (0=conservative, 6=open)
] as const;

export type PersonalityAxis = typeof PERSONALITY_AXES[number];

export interface PersonalityScores {
  shyness: Base7Digit;
  emotionality: Base7Digit;
  energy: Base7Digit;
  sociability: Base7Digit;
  bravery: Base7Digit;
  creativity: Base7Digit;
  openness: Base7Digit;
}

/**
 * Extract personality scores from RED60
 *
 * Strategy:
 * - Each axis gets ~8-9 digits (60 / 7 ≈ 8.57)
 * - We average the digits in each section to get a 0-6 score
 */
export function extractPersonality(red60: Base7Sequence): PersonalityScores {
  const axisLength = Math.floor(60 / 7); // 8 digits per axis
  const remainder = 60 % 7; // 4 extra digits

  const scores: Partial<PersonalityScores> = {};

  PERSONALITY_AXES.forEach((axis, index) => {
    const start = index * axisLength;
    const extraDigit = index < remainder ? 1 : 0; // Distribute remainder
    const length = axisLength + extraDigit;

    const section = extractSubSequence(red60, start, length);

    // Average the section to get a 0-6 score
    const sum = section.reduce((acc, digit) => acc + digit, 0);
    const avg = Math.round(sum / section.length) as Base7Digit;

    scores[axis] = avg;
  });

  return scores as PersonalityScores;
}

/**
 * Encode personality scores into RED60
 *
 * Strategy:
 * - Spread each score across ~8-9 digits with slight variation
 * - This allows for "drift" over time while maintaining the score
 */
export function encodePersonality(scores: PersonalityScores): Base7Sequence {
  const axisLength = Math.floor(60 / 7); // 8
  const remainder = 60 % 7; // 4

  const red60: Base7Digit[] = [];

  PERSONALITY_AXES.forEach((axis, index) => {
    const score = scores[axis];
    const extraDigit = index < remainder ? 1 : 0;
    const length = axisLength + extraDigit;

    // Create section with slight variation around the score
    for (let i = 0; i < length; i++) {
      const variation = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
      const digit = Math.max(0, Math.min(6, score + variation)) as Base7Digit;
      red60.push(digit);
    }
  });

  return red60.slice(0, 60) as Base7Sequence;
}

/**
 * Apply personality drift (gradual change based on rituals)
 */
export function applyPersonalityDrift(
  red60: Base7Sequence,
  axis: PersonalityAxis,
  direction: -1 | 1, // -1 = decrease, 1 = increase
  amount: number = 1
): Base7Sequence {
  const axisIndex = PERSONALITY_AXES.indexOf(axis);
  const axisLength = Math.floor(60 / 7);
  const start = axisIndex * axisLength;
  const length = axisLength + (axisIndex < 4 ? 1 : 0);

  const newRed60 = [...red60];

  // Mutate a few random digits in this axis section
  for (let i = 0; i < amount; i++) {
    const randomIndex = start + Math.floor(Math.random() * length);
    newRed60[randomIndex] = mutateDigit(newRed60[randomIndex], direction);
  }

  return newRed60 as Base7Sequence;
}

// ===== APPEARANCE ENCODING (BLUE60) =====

/**
 * BLUE60 encodes physical appearance traits
 */
export interface AppearanceTraits {
  bodyShape: number;      // 0-6 (spherical to elongated)
  size: number;           // 0-6 (tiny to large)
  primaryColor: number;   // 0-6 (maps to color palette)
  secondaryColor: number; // 0-6
  pattern: number;        // 0-6 (solid, gradient, spots, stripes, etc)
  features: number[];     // Array of feature IDs
}

/**
 * Extract appearance from BLUE60
 */
export function extractAppearance(blue60: Base7Sequence): AppearanceTraits {
  return {
    bodyShape: blue60[0],
    size: blue60[1],
    primaryColor: blue60[2],
    secondaryColor: blue60[3],
    pattern: blue60[4],
    features: blue60.slice(5, 15), // Use 10 digits for features
  };
}

/**
 * Encode appearance into BLUE60
 */
export function encodeAppearance(traits: AppearanceTraits): Base7Sequence {
  const blue60: Base7Digit[] = [
    traits.bodyShape as Base7Digit,
    traits.size as Base7Digit,
    traits.primaryColor as Base7Digit,
    traits.secondaryColor as Base7Digit,
    traits.pattern as Base7Digit,
    ...traits.features.slice(0, 10).map((f) => (f % 7) as Base7Digit),
  ];

  // Fill remaining with random
  while (blue60.length < 60) {
    blue60.push(randomBase7Digit());
  }

  return blue60.slice(0, 60) as Base7Sequence;
}

// ===== SPECIAL ABILITIES (BLACK60) =====

/**
 * BLACK60 encodes special abilities and rare traits
 */
export interface SpecialAbilities {
  rarity: number;         // 0-6 (common to mythic)
  specialPowers: number[]; // Array of power IDs
  affinities: number[];   // Seasonal/elemental affinities
}

/**
 * Extract special abilities from BLACK60
 */
export function extractAbilities(black60: Base7Sequence): SpecialAbilities {
  // Rarity is based on how many 6s appear in the sequence
  const sixes = black60.filter((d) => d === 6).length;
  const rarity = Math.min(6, Math.floor(sixes / 10)) as Base7Digit;

  return {
    rarity,
    specialPowers: black60.slice(0, 10),
    affinities: black60.slice(10, 17), // 7 seasonal affinities
  };
}

// ===== GENOME UTILITIES =====

/**
 * Calculate genome "distance" (how different two genomes are)
 * Used for breeding compatibility
 */
export function calculateGenomeDistance(genome1: Genome, genome2: Genome): number {
  let distance = 0;

  for (let i = 0; i < 60; i++) {
    distance += Math.abs(genome1.red60[i] - genome2.red60[i]);
    distance += Math.abs(genome1.blue60[i] - genome2.blue60[i]);
    distance += Math.abs(genome1.black60[i] - genome2.black60[i]);
  }

  return distance / (60 * 3); // Normalize to 0-6 range
}

/**
 * Serialize genome to JSON-safe format
 */
export function serializeGenome(genome: Genome): string {
  return JSON.stringify({
    red: sequenceToString(genome.red60),
    blue: sequenceToString(genome.blue60),
    black: sequenceToString(genome.black60),
  });
}

/**
 * Deserialize genome from JSON
 */
export function deserializeGenome(json: string): Genome {
  const data = JSON.parse(json);
  return {
    red60: stringToSequence(data.red),
    blue60: stringToSequence(data.blue),
    black60: stringToSequence(data.black),
  };
}

/**
 * Generate a genome with specific personality
 */
export function generateGenomeWithPersonality(scores: PersonalityScores): Genome {
  return {
    red60: encodePersonality(scores),
    blue60: generateRandomSequence(),
    black60: generateRandomSequence(),
  };
}

/**
 * Clone a genome (deep copy)
 */
export function cloneGenome(genome: Genome): Genome {
  return {
    red60: [...genome.red60] as Base7Sequence,
    blue60: [...genome.blue60] as Base7Sequence,
    black60: [...genome.black60] as Base7Sequence,
  };
}
