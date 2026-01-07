import { DEGREE_TEMPLATES } from './degreeTemplates';
import type {
  AbilityProfile,
  Branch,
  DegreeTemplate,
  EvolutionState,
  GlyphSkin,
  Palette,
  ParticleProfile,
  SigilLayer,
  TrailProfile,
  EyeProfile,
  RuleMod,
} from './types';

const BRANCHES: Branch[] = ['solar', 'lunar', 'void'];

const TIER_MODIFIERS = {
  0: { brightness: 0.88, sigilIntensity: 0.35, particleDensity: 0.45, trailStrength: 0.35 },
  1: { brightness: 1.0, sigilIntensity: 0.55, particleDensity: 0.6, trailStrength: 0.55 },
  2: { brightness: 1.06, sigilIntensity: 0.72, particleDensity: 0.78, trailStrength: 0.72 },
  3: { brightness: 1.12, sigilIntensity: 0.88, particleDensity: 0.95, trailStrength: 0.88 },
} as const;

const BRANCH_BASE_HUE: Record<Branch, number> = { solar: 45, lunar: 210, void: 275 };
const BRANCH_HUE_RANGE: Record<Branch, number> = { solar: 28, lunar: 35, void: 45 };

const BRANCH_PARTICLE_FAMILIES: Record<Branch, string[]> = {
  solar: ['sunMotes', 'emberSparks', 'goldPollen', 'petalGlints'],
  lunar: ['moonDust', 'starPoints', 'mistBeads', 'pearlShimmer'],
  void: ['glitchPixels', 'inkDrops', 'fractureShards', 'prismNoise'],
};

const TRAIL_FAMILIES: Record<Branch, string[]> = {
  solar: ['orbit', 'heatHaze', 'cometGold', 'mandalaRibbon'],
  lunar: ['starlight', 'mistRibbon', 'constellationLine', 'tideFlow'],
  void: ['riftLine', 'glitchSmear', 'inkRibbon', 'spectralGhost'],
};

const EYE_FAMILIES: Record<Branch, string[]> = {
  solar: ['sunburst', 'tripleRing', 'spiralIris', 'haloDot'],
  lunar: ['crescent', 'star', 'pearlRing', 'nebula'],
  void: ['fracture', 'eclipse', 'voidHole', 'prismSplit'],
};

const SOUND_MOTIFS: Record<Branch, string[]> = {
  solar: ['radiantBell', 'goldenChime', 'dawnPulse'],
  lunar: ['moonHarp', 'mistChord', 'silverDrift'],
  void: ['riftHum', 'glitchTone', 'abyssDrone'],
};

const GESTURE_FAMILIES: Record<string, string[]> = {
  tap: ['pulse', 'spark', 'chirp'],
  doubleTap: ['flicker', 'echoClone', 'flash'],
  hold: ['orbitSummon', 'mantle', 'gravityPull'],
  slowSwipe: ['driftTrail', 'weaveThread', 'tideRipple'],
  fastSwipe: ['flareSlash', 'riftTear', 'glitchStreak'],
  trace: ['sigilDraw', 'constellationBind', 'fractalBloom'],
  rhythm: ['syncBurst', 'tempoGlow', 'beatRipple'],
  twoFingerSwipe: ['dualitySplit', 'prismCut', 'shadowSweep'],
};

function hash32(input: string): number {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function mulberry32(seed: number): () => number {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function rngFromKey(key: string): () => number {
  return mulberry32(hash32(key));
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function hslToHex(h: number, s: number, l: number): string {
  const normalizedH = ((h % 360) + 360) % 360;
  const sat = clamp(s, 0, 100) / 100;
  const light = clamp(l, 0, 100) / 100;
  const c = (1 - Math.abs(2 * light - 1)) * sat;
  const x = c * (1 - Math.abs(((normalizedH / 60) % 2) - 1));
  const m = light - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;

  if (normalizedH < 60) {
    r = c;
    g = x;
  } else if (normalizedH < 120) {
    r = x;
    g = c;
  } else if (normalizedH < 180) {
    g = c;
    b = x;
  } else if (normalizedH < 240) {
    g = x;
    b = c;
  } else if (normalizedH < 300) {
    r = x;
    b = c;
  } else {
    r = c;
    b = x;
  }

  const toHex = (value: number) => {
    const channel = Math.round((value + m) * 255);
    return channel.toString(16).padStart(2, '0');
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function buildSkinKey(state: EvolutionState): string {
  const ruleSignature = (state.ruleMods ?? []).map((mod) => mod.id).join('|');
  return [
    'moss60-v1',
    state.tier,
    state.branch,
    state.degree,
    state.seed.a,
    state.seed.b,
    state.seed.c,
    state.seed.d,
    state.seed.e,
    state.seed.f,
    ruleSignature,
  ].join(':');
}

function getDegreeTemplate(degree: number): DegreeTemplate {
  const template = DEGREE_TEMPLATES.find((item) => item.degree === degree);
  if (!template) {
    throw new Error(`Missing degree template for ${degree}`);
  }
  return template;
}

function pick<T>(items: T[], rand: () => number): T {
  return items[Math.floor(rand() * items.length)];
}

function pickWeightedChoice(choices: Record<string, number>, rand: () => number): string {
  const entries = Object.entries(choices);
  const total = entries.reduce((sum, [, weight]) => sum + weight, 0);
  if (total <= 0) {
    return entries[0]?.[0] ?? 'tap';
  }
  let roll = rand() * total;
  for (const [key, weight] of entries) {
    roll -= weight;
    if (roll <= 0) {
      return key;
    }
  }
  return entries[entries.length - 1]?.[0] ?? 'tap';
}

function buildPalette(state: EvolutionState, rand: () => number): Palette {
  const baseHue = BRANCH_BASE_HUE[state.branch];
  const hueRange = BRANCH_HUE_RANGE[state.branch];
  const hue = baseHue + (rand() * 2 - 1) * hueRange + state.seed.e;
  const sat = clamp(60 + rand() * 20 + state.tier * 5, 40, 95);
  const light = clamp(45 + state.tier * 8 + rand() * 10, 35, 85);
  const glow = hslToHex(hue + 8, sat + 8, clamp(light + 10, 0, 100));
  const accent = hslToHex(hue - 12, sat - 8, clamp(light - 8, 0, 100));
  return {
    primary: hslToHex(hue, sat, light),
    glow,
    accent,
  };
}

function buildSigils(template: DegreeTemplate, rand: () => number): SigilLayer[] {
  const sigilCount = 2;
  const sigils: SigilLayer[] = [];
  for (let i = 0; i < sigilCount; i += 1) {
    sigils.push({
      family: pick(template.sigilFamily, rand),
      ornament: pick(template.ornament, rand),
      motion: pick(template.motion, rand),
    });
  }
  return sigils;
}

function buildParticles(state: EvolutionState, rand: () => number): ParticleProfile {
  const tierMod = TIER_MODIFIERS[state.tier];
  return {
    family: pick(BRANCH_PARTICLE_FAMILIES[state.branch], rand),
    density: clamp(rand() * tierMod.particleDensity, 0.1, 1),
    size: clamp(0.4 + rand() * 0.6, 0.2, 1),
    speed: clamp(0.3 + rand() * 0.7, 0.2, 1),
  };
}

function buildTrail(state: EvolutionState, rand: () => number): TrailProfile {
  const tierMod = TIER_MODIFIERS[state.tier];
  return {
    family: pick(TRAIL_FAMILIES[state.branch], rand),
    strength: clamp(tierMod.trailStrength + rand() * 0.2, 0.2, 1),
  };
}

function buildEyes(state: EvolutionState, rand: () => number): EyeProfile {
  const tierMod = TIER_MODIFIERS[state.tier];
  return {
    family: pick(EYE_FAMILIES[state.branch], rand),
    intensity: clamp(tierMod.sigilIntensity + rand() * 0.2, 0.3, 1),
  };
}

function buildSound(state: EvolutionState, rand: () => number): { motif: string; intensity: number } {
  const tierMod = TIER_MODIFIERS[state.tier];
  return {
    motif: pick(SOUND_MOTIFS[state.branch], rand),
    intensity: clamp(0.4 + rand() * tierMod.sigilIntensity, 0.2, 1),
  };
}

function buildAbility(template: DegreeTemplate, rand: () => number, state: EvolutionState): AbilityProfile {
  const gesture = pickWeightedChoice(template.abilityBias, rand);
  const effectPool = GESTURE_FAMILIES[gesture] ?? ['pulse'];
  return {
    gesture,
    effect: pick(effectPool, rand),
    intensity: clamp(0.5 + rand() * 0.5 + state.tier * 0.1, 0.3, 1.2),
  };
}

function buildRuleMod(template: DegreeTemplate, rand: () => number): RuleMod {
  return {
    id: `${template.degree}-${Math.floor(rand() * 10000)}`,
    ...template.ruleBias,
  };
}

export function branchFromDegree(degree: number): Branch {
  if (degree < 20) {
    return 'solar';
  }
  if (degree < 40) {
    return 'lunar';
  }
  return 'void';
}

export function normalizeState(state: EvolutionState): EvolutionState {
  const branch = state.branch ?? branchFromDegree(state.degree);
  const degree = clamp(state.degree, 0, 59);
  return { ...state, branch: BRANCHES.includes(branch) ? branch : 'solar', degree };
}

export function generateGlyphSkin(state: EvolutionState): GlyphSkin {
  const normalized = normalizeState(state);
  const template = getDegreeTemplate(normalized.degree);
  const key = buildSkinKey(normalized);
  const rand = rngFromKey(key);
  const palette = buildPalette(normalized, rand);

  return {
    id: key,
    tier: normalized.tier,
    branch: normalized.branch,
    degree: normalized.degree,
    palette,
    sigils: buildSigils(template, rand),
    particles: buildParticles(normalized, rand),
    trail: buildTrail(normalized, rand),
    eyes: buildEyes(normalized, rand),
    sound: buildSound(normalized, rand),
    ability: buildAbility(template, rand, normalized),
    ruleMod: buildRuleMod(template, rand),
  };
}
