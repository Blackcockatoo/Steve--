export type Branch = 'solar' | 'lunar' | 'void';
export type Tier = 0 | 1 | 2 | 3;

export type FateSeed = {
  a: number;
  b: number;
  c: number;
  d: number;
  e: number;
  f: number;
};

export type RuleMod = {
  id: string;
  branchBiasDelta?: { solar?: number; lunar?: number; void?: number };
  mirrorThresholdDelta?: number;
  mutationRateDelta?: number;
  recursionStrengthDelta?: number;
  degreeWeightDelta?: number[];
  aestheticDriftDelta?: number;
};

export type EvolutionState = {
  tier: Tier;
  branch: Branch;
  degree: number;
  seed: FateSeed;
  ruleMods?: RuleMod[];
};

export type Palette = {
  primary: string;
  glow: string;
  accent: string;
};

export type SigilLayer = {
  family: string;
  ornament: string;
  motion: string;
};

export type ParticleProfile = {
  family: string;
  density: number;
  size: number;
  speed: number;
};

export type TrailProfile = {
  family: string;
  strength: number;
};

export type EyeProfile = {
  family: string;
  intensity: number;
};

export type SoundProfile = {
  motif: string;
  intensity: number;
};

export type AbilityProfile = {
  gesture: string;
  effect: string;
  intensity: number;
};

export type DegreeTemplate = {
  degree: number;
  name: string;
  sigilFamily: string[];
  ornament: string[];
  motion: string[];
  abilityBias: Record<string, number>;
  ruleBias: Omit<RuleMod, 'id'>;
};

export type GlyphSkin = {
  id: string;
  tier: Tier;
  branch: Branch;
  degree: number;
  palette: Palette;
  sigils: SigilLayer[];
  particles: ParticleProfile;
  trail: TrailProfile;
  eyes: EyeProfile;
  sound: SoundProfile;
  ability: AbilityProfile;
  ruleMod: RuleMod;
};
