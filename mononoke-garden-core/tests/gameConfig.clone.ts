declare const process: { exitCode?: number };

import {
  cloneGameConfig,
  getConfig,
  subscribeToConfigChanges,
  toggleMode,
  upgradeTier,
  type GameConfig,
} from '../gameConfig';

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

function assertNotEqual<T>(actual: T, expected: T, message: string): void {
  if (actual === expected) {
    throw new Error(`${message}. Value: ${String(actual)}`);
  }
}

async function run() {
  const base = getConfig();
  const cloned = cloneGameConfig(base);

  // Mutate clone to ensure base references are protected
  cloned.rituals.available.add('secret_ritual');
  cloned.visuals.cosmeticPacks.push('festival');
  cloned.seasons.enableSeasons = false;

  assert(
    !base.rituals.available.has('secret_ritual'),
    'Base ritual set should not be mutated by clone edits'
  );
  assert(
    !base.visuals.cosmeticPacks.includes('festival'),
    'Base cosmetic packs should not be mutated by clone edits'
  );
  assert(base.seasons.enableSeasons, 'Base season flag should remain unchanged');

  // Caller mutation of returned config should not leak into stored state
  const tempConfig = getConfig();
  tempConfig.visuals.cosmeticPacks.push('intruder');
  const resetCheck = getConfig();
  assert(
    !resetCheck.visuals.cosmeticPacks.includes('intruder'),
    'Mutating returned config should not persist'
  );

  // Subscription notifications should deliver fresh references
  const seen: GameConfig[] = [];
  const unsubscribe = subscribeToConfigChanges((config) => {
    seen.push(config);
  });

  upgradeTier('kizuna_pass');
  toggleMode();
  upgradeTier('eternal');

  unsubscribe();

  assert(seen.length >= 2, 'Should receive notifications for tier/mode changes');
  for (let i = 1; i < seen.length; i += 1) {
    const prev = seen[i - 1];
    const next = seen[i];
    assertNotEqual(next, prev, 'Config objects should be new per notification');
    assertNotEqual(
      next.rituals.available,
      prev.rituals.available,
      'Ritual sets should be cloned per notification'
    );
    assertNotEqual(
      next.visuals.cosmeticPacks,
      prev.visuals.cosmeticPacks,
      'Cosmetic pack arrays should be cloned per notification'
    );
  }

  // Reset to free/simple for cleanliness
  upgradeTier('free');
}

run()
  .then(() => {
    console.log('Mononoke config clone tests passed');
  })
  .catch((error) => {
    console.error('Mononoke config clone tests failed:', error.message);
    process.exitCode = 1;
  });
