/**
 * Mononoke Garden - Breeding Engine
 *
 * Genetic inheritance system:
 * - Child = 60% parent average + 40% random variation
 * - Personality drifts based on rituals
 * - Appearance blends both parents
 * - Special abilities = rare genetic combinations
 *
 * Philosophy: Deep genetics without complexity
 */

import {
  Genome,
  Base7Sequence,
  Base7Digit,
  averageDigits,
  randomBase7Digit,
  extractPersonality,
  extractAppearance,
  extractAbilities,
  encodePersonality,
  encodeAppearance,
  cloneGenome,
  PersonalityScores,
} from '../genetics/base7Genome';

// ===== BREEDING MECHANICS =====

/**
 * Breed two genomes to create offspring
 *
 * Inheritance formula:
 * - 60% parent average
 * - 40% random variation
 */
export function breedGenomes(parent1: Genome, parent2: Genome): Genome {
  const childRed60 = breedSequence(parent1.red60, parent2.red60, 0.6);
  const childBlue60 = breedSequence(parent1.blue60, parent2.blue60, 0.6);
  const childBlack60 = breedSequence(parent1.black60, parent2.black60, 0.6);

  return {
    red60: childRed60,
    blue60: childBlue60,
    black60: childBlack60,
  };
}

/**
 * Breed two base-7 sequences
 *
 * @param seq1 Parent 1 sequence
 * @param seq2 Parent 2 sequence
 * @param inheritanceRatio How much to inherit vs randomize (0-1)
 */
function breedSequence(
  seq1: Base7Sequence,
  seq2: Base7Sequence,
  inheritanceRatio: number
): Base7Sequence {
  const child: Base7Digit[] = [];

  for (let i = 0; i < 60; i++) {
    if (Math.random() < inheritanceRatio) {
      // Inherit from parents (average)
      const avg = averageDigits(seq1[i], seq2[i]);
      child.push(avg);
    } else {
      // Random variation
      child.push(randomBase7Digit());
    }
  }

  return child as Base7Sequence;
}

// ===== PEDIGREE SYSTEM =====

export interface PedigreeNode {
  id: string;
  name: string;
  genome: Genome;
  parent1?: PedigreeNode;
  parent2?: PedigreeNode;
  generation: number;
  birthDate: Date;
}

/**
 * Create a new pedigree node
 */
export function createPedigreeNode(
  id: string,
  name: string,
  genome: Genome,
  parent1?: PedigreeNode,
  parent2?: PedigreeNode
): PedigreeNode {
  const generation = parent1 && parent2
    ? Math.max(parent1.generation, parent2.generation) + 1
    : 0;

  return {
    id,
    name,
    genome: cloneGenome(genome),
    parent1,
    parent2,
    generation,
    birthDate: new Date(),
  };
}

/**
 * Get all ancestors (recursive)
 */
export function getAncestors(node: PedigreeNode): PedigreeNode[] {
  const ancestors: PedigreeNode[] = [];

  if (node.parent1) {
    ancestors.push(node.parent1);
    ancestors.push(...getAncestors(node.parent1));
  }

  if (node.parent2) {
    ancestors.push(node.parent2);
    ancestors.push(...getAncestors(node.parent2));
  }

  return ancestors;
}

/**
 * Calculate pedigree depth
 */
export function getPedigreeDepth(node: PedigreeNode): number {
  if (!node.parent1 && !node.parent2) {
    return 0;
  }

  const depth1 = node.parent1 ? getPedigreeDepth(node.parent1) : 0;
  const depth2 = node.parent2 ? getPedigreeDepth(node.parent2) : 0;

  return Math.max(depth1, depth2) + 1;
}

/**
 * Serialize pedigree to JSON (limited depth to avoid huge files)
 */
export function serializePedigree(node: PedigreeNode, maxDepth: number = 3): any {
  const simplified: any = {
    id: node.id,
    name: node.name,
    generation: node.generation,
    birthDate: node.birthDate.toISOString(),
  };

  if (maxDepth > 0) {
    if (node.parent1) {
      simplified.parent1 = serializePedigree(node.parent1, maxDepth - 1);
    }
    if (node.parent2) {
      simplified.parent2 = serializePedigree(node.parent2, maxDepth - 1);
    }
  }

  return simplified;
}

// ===== BREEDING COMPATIBILITY =====

/**
 * Check if two companions are compatible for breeding
 */
export interface BreedingCompatibility {
  compatible: boolean;
  reason?: string;
  successRate: number; // 0-1
  predictedTraits: {
    personalityRange: { min: PersonalityScores; max: PersonalityScores };
    rarity: number;
  };
}

/**
 * Calculate breeding compatibility
 */
export function calculateCompatibility(
  companion1: { genome: Genome; kizunaLevel: number },
  companion2: { genome: Genome; kizunaLevel: number }
): BreedingCompatibility {
  // Must both be at Kizuna level 7 (輪廻)
  if (companion1.kizunaLevel < 7 || companion2.kizunaLevel < 7) {
    return {
      compatible: false,
      reason: 'Both companions must reach Kizuna level 7 (輪廻) to breed',
      successRate: 0,
      predictedTraits: {
        personalityRange: { min: {} as any, max: {} as any },
        rarity: 0,
      },
    };
  }

  // Calculate genetic distance (diversity = better outcomes)
  const distance = calculateGeneticDistance(companion1.genome, companion2.genome);

  // Success rate: higher diversity = higher success
  // Sweet spot: distance 2-4 (out of 6)
  let successRate = 0.5;
  if (distance >= 2 && distance <= 4) {
    successRate = 0.8;
  } else if (distance < 1) {
    successRate = 0.3; // Too similar (inbreeding)
  } else if (distance > 5) {
    successRate = 0.4; // Too different (incompatible)
  }

  // Predict offspring traits
  const personality1 = extractPersonality(companion1.genome.red60);
  const personality2 = extractPersonality(companion2.genome.red60);

  const predictedMin = averagePersonalityScores(personality1, personality2, -1);
  const predictedMax = averagePersonalityScores(personality1, personality2, 1);

  const abilities1 = extractAbilities(companion1.genome.black60);
  const abilities2 = extractAbilities(companion2.genome.black60);
  const predictedRarity = Math.min(6, Math.round((abilities1.rarity + abilities2.rarity) / 2 + 1));

  return {
    compatible: true,
    successRate,
    predictedTraits: {
      personalityRange: { min: predictedMin, max: predictedMax },
      rarity: predictedRarity,
    },
  };
}

/**
 * Calculate genetic distance between two genomes
 */
function calculateGeneticDistance(genome1: Genome, genome2: Genome): number {
  let distance = 0;

  for (let i = 0; i < 60; i++) {
    distance += Math.abs(genome1.red60[i] - genome2.red60[i]);
    distance += Math.abs(genome1.blue60[i] - genome2.blue60[i]);
    distance += Math.abs(genome1.black60[i] - genome2.black60[i]);
  }

  return distance / (60 * 3); // Normalize to 0-6
}

/**
 * Average two personality scores with variation
 */
function averagePersonalityScores(
  p1: PersonalityScores,
  p2: PersonalityScores,
  variation: number // -1, 0, or 1
): PersonalityScores {
  const averaged: Partial<PersonalityScores> = {};

  for (const axis of Object.keys(p1) as Array<keyof PersonalityScores>) {
    const avg = Math.round((p1[axis] + p2[axis]) / 2) + variation;
    averaged[axis] = Math.max(0, Math.min(6, avg)) as Base7Digit;
  }

  return averaged as PersonalityScores;
}

// ===== BREEDING REQUESTS =====

export interface BreedingRequest {
  id: string;
  companion1Id: string;
  companion2Id: string;
  requesterId: string; // Player who initiated
  partnerId?: string;  // Other player (if cross-player breeding)
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  eggIncubationDays: number; // 7 days default
  createdAt: Date;
  completedAt?: Date;
  offspring?: Genome;
}

/**
 * Create a breeding request
 */
export function createBreedingRequest(
  companion1Id: string,
  companion2Id: string,
  requesterId: string,
  partnerId?: string
): BreedingRequest {
  return {
    id: generateBreedingId(),
    companion1Id,
    companion2Id,
    requesterId,
    partnerId,
    status: 'pending',
    eggIncubationDays: 7,
    createdAt: new Date(),
  };
}

/**
 * Complete breeding (after incubation period)
 */
export function completeBreeding(
  request: BreedingRequest,
  parent1Genome: Genome,
  parent2Genome: Genome
): BreedingRequest {
  const offspring = breedGenomes(parent1Genome, parent2Genome);

  return {
    ...request,
    status: 'completed',
    completedAt: new Date(),
    offspring,
  };
}

/**
 * Check if breeding request is ready (incubation complete)
 */
export function isBreedingReady(request: BreedingRequest): boolean {
  if (request.status !== 'pending') return false;

  const now = new Date();
  const elapsed = now.getTime() - request.createdAt.getTime();
  const requiredTime = request.eggIncubationDays * 24 * 60 * 60 * 1000; // Days to ms

  return elapsed >= requiredTime;
}

/**
 * Calculate breeding progress (0-1)
 */
export function getBreedingProgress(request: BreedingRequest): number {
  if (request.status === 'completed') return 1;
  if (request.status !== 'pending') return 0;

  const now = new Date();
  const elapsed = now.getTime() - request.createdAt.getTime();
  const requiredTime = request.eggIncubationDays * 24 * 60 * 60 * 1000;

  return Math.min(1, elapsed / requiredTime);
}

// ===== UTILITIES =====

/**
 * Generate unique breeding ID
 */
function generateBreedingId(): string {
  return `breed_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Calculate breeding bonus based on seasonal events
 */
export function getSeasonalBreedingBonus(season: string): number {
  // Risshun (Spring Awakening) and Shocho (Star Festival) have breeding bonuses
  const bonuses: Record<string, number> = {
    'risshun': 1.0,  // +100% XP bonus (double)
    'shocho': 1.5,   // +150% XP bonus (2.5x)
  };

  return bonuses[season] || 0;
}

/**
 * Calculate rarity tier based on genetic complexity
 */
export function calculateRarityTier(genome: Genome): string {
  const abilities = extractAbilities(genome.black60);
  const rarity = abilities.rarity;

  const tiers = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Mythic', 'Eternal'];
  return tiers[rarity] || 'Common';
}

/**
 * Generate breeding prediction message
 */
export function generateBreedingPrediction(
  parent1Name: string,
  parent2Name: string,
  compatibility: BreedingCompatibility
): string {
  const { successRate, predictedTraits } = compatibility;

  const rateDesc = successRate > 0.7 ? '高い' : successRate > 0.4 ? '中程度' : '低い';

  return `
${parent1Name} と ${parent2Name} の繁殖:
成功率: ${rateDesc} (${Math.round(successRate * 100)}%)
予想される希少度: ${calculateRarityTierJP(predictedTraits.rarity)}
  `.trim();
}

function calculateRarityTierJP(rarity: number): string {
  const tiers = ['普通', '珍しい', 'レア', 'エピック', '伝説', '神話', '永遠'];
  return tiers[rarity] || '普通';
}
