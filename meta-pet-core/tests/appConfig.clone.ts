declare const process: { exitCode?: number };

import {
  cloneConfig,
  getConfig,
  subscribeToConfigChanges,
  upgradeTier,
  type AppConfig,
} from '../appConfig';

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

function assertEqual<T>(actual: T, expected: T, message: string): void {
  if (actual !== expected) {
    throw new Error(`${message}. Expected: ${String(expected)}, Received: ${String(actual)}`);
  }
}

function assertNotEqual<T>(actual: T, expected: T, message: string): void {
  if (actual === expected) {
    throw new Error(`${message}. Value: ${String(actual)}`);
  }
}

async function run() {
  const baseConfig = getConfig();
  const cloned = cloneConfig(baseConfig);

  // Mutate clone and ensure base is untouched
  cloned.emotions.enabledStates.add('mischievous');
  cloned.visuals.cosmeticPacksAvailable.push('customPack');
  cloned.audio.enabledScales.add('locrian');

  assert(
    !baseConfig.emotions.enabledStates.has('mischievous'),
    'Base emotions set should not be mutated by clone edits'
  );
  assert(
    !baseConfig.visuals.cosmeticPacksAvailable.includes('customPack'),
    'Base cosmetic packs should not be mutated by clone edits'
  );
  assert(
    !baseConfig.audio.enabledScales.has('locrian'),
    'Base audio scales should not be mutated by clone edits'
  );

  // Ensure getConfig always returns fresh references even after caller mutation
  const mutated = getConfig();
  mutated.visuals.cosmeticPacksAvailable.push('intruder');
  const refreshed = getConfig();
  assert(
    !refreshed.visuals.cosmeticPacksAvailable.includes('intruder'),
    'Mutating returned configs should not leak into stored state'
  );

  // Subscription delivers fresh objects and nested references per notification
  const seen: AppConfig[] = [];
  const unsubscribe = subscribeToConfigChanges((config) => {
    seen.push(config);
  });

  upgradeTier('premium');
  upgradeTier('free');

  unsubscribe();

  assert(seen.length >= 2, 'Should receive notifications for tier upgrades');
  for (let i = 1; i < seen.length; i += 1) {
    const prev = seen[i - 1];
    const next = seen[i];
    assertNotEqual(next, prev, 'Each notification should provide a new config object');
    assertNotEqual(
      next.emotions.enabledStates,
      prev.emotions.enabledStates,
      'Emotions set should be cloned per notification'
    );
    assertNotEqual(
      next.audio.enabledScales,
      prev.audio.enabledScales,
      'Audio scale set should be cloned per notification'
    );
    assertNotEqual(
      next.visuals.cosmeticPacksAvailable,
      prev.visuals.cosmeticPacksAvailable,
      'Cosmetic packs array should be cloned per notification'
    );
  }

  // Reset to free for cleanliness
  upgradeTier('free');
}

run()
  .then(() => {
    console.log('Clone/config integrity tests passed');
  })
  .catch((error) => {
    console.error('Clone/config integrity tests failed:', error.message);
    process.exitCode = 1;
  });
