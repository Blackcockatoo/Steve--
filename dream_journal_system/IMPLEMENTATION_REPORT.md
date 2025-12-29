# Dream Journal System Implementation Report

**Author:** Manus AI
**Date:** Dec 29, 2025

## 1. Overview and Concept Integration

The **Dream Journal System** has been successfully integrated into the `meta-pet-core` to generate poetic, surreal dream narratives that reflect the metapet's evolving personality and emotional state. This system leverages existing core mechanics—Memory Depth, Personality Drift, Emotion System, and Evolution Stages—to create a unique, emotionally engaging feature.

The core implementation resides in two new files:
1.  `meta-pet-core/DreamJournalSystem.ts`: Defines the data structures, state management, and the logic for applying dream influence.
2.  `meta-pet-core/DreamGenerator.ts`: Handles the AI (LLM) integration for narrative generation and bonus mini-features.

## 2. Architecture and Data Models

The system introduces new data structures to manage the dream generation process and store the results.

### Dream Data Structure (`DreamJournalSystem.ts`)

The `Dream` interface captures the narrative and the pet's state at the time of sleep, ensuring the journal entries are meaningful reflections of the pet's consciousness.

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | `string` | Unique identifier for the dream entry. |
| `timestamp` | `Date` | Time the dream was generated. |
| `type` | `DreamType` | Contextual type: `bonding`, `evolution`, `low_emotion`, `breeding`, or `general`. |
| `narrative` | `string` | The AI-generated text (50-150 tokens). |
| `keywords` | `string[]` | Extracted keywords for search/filtering. |
| `emotionSnapshot` | `string` | The pet's dominant emotion at the time of sleep. |
| `kizunaSnapshot` | `KizunaLevel` | Bond level at the time of sleep. |
| `evolutionStageSnapshot` | `string` | Evolution stage (e.g., 'GENETICS', 'QUANTUM'). |
| `influenceApplied` | `boolean` | **Mythic Tier**: Flag if the dream caused a personality drift. |

### Dream Generator Input (`DreamJournalSystem.ts`)

The `DreamGeneratorInput` interface bundles all necessary pet state data for the AI prompt, ensuring the generated narrative is contextually rich.

| Field | Source | Purpose |
| :--- | :--- | :--- |
| `petName` | Pet State | Personalization. |
| `memoryDepth` | `AppConfig` | Context for the AI (e.g., "Analyze last N interactions"). |
| `currentEmotion` | Pet State | Primary emotional theme for the dream. |
| `kizunaLevel` | `KizunaState` | Determines if a 'bonding' dream is triggered. |
| `evolutionStage` | Pet State | Context for 'evolution' dreams. |
| `personality` | Genome (`RED60`) | Injects personality scores (e.g., `shyness: 2/6`) into the prompt. |
| `recentActions` | Memory System | Provides concrete details for the AI to weave into the narrative. |
| `detailLevel` | `AppConfig` | Controls the complexity and depth of the AI-generated narrative. |

## 3. Tier-Gated Configuration (`appConfig.ts` Update)

A new `dreams` configuration object was added to `AppConfig` and configured for the three tiers to enable the Freemium model.

| Feature | Free Tier | Premium Tier | Mythic Tier |
| :--- | :--- | :--- | :--- |
| **Frequency** | `weekly` (1 dream/week) | `daily` (1 dream/night) | `daily` (Multiple dreams/night possible) |
| **Detail Level** | `vague` (Abstract, token-efficient) | `detailed` (Vivid, emotional) | `mythic` (Profound, cosmic, philosophical) |
| **Max Journal Entries** | 10 | 50 | 100 |
| **Dream Influence** | `false` | `false` | `true` (Dreams cause personality drift) |
| **Lucid Dreaming** | `false` | `false` | `true` (User can influence dream content) |

## 4. AI Integration and Narrative Generation

The `generateAIDream` function in `DreamGenerator.ts` uses the OpenAI-compatible API (`gpt-4.1-mini`) to create the narratives.

1.  **Dream Type Determination**: The function first determines the `DreamType` based on the pet's state (e.g., `isBreeding`, `isEvolving`, `kizunaLevel >= 5`, or `low_emotion`).
2.  **Prompt Engineering**: A detailed system and user prompt are constructed, including the pet's personality scores, emotion, evolution stage, and recent actions. The `detailLevel` is explicitly included to guide the LLM's output style.
3.  **Fallback**: A robust fallback mechanism is in place using a simple, context-aware narrative if the AI call fails.

## 5. Bonus Mini-Features

The following token-efficient mini-features were implemented using the AI (`gpt-4.1-nano`) for quick, poetic flavor text:

| Feature | Token Limit | Purpose | Implementation |
| :--- | :--- | :--- | :--- |
| **Evolution Whispers** | ~75 tokens | Poetic narrative upon evolution. | `generateAIEvolutionWhisper(oldStage, newStage)` |
| **Memory Echoes** | ~50 tokens | Random reflection on a meaningful past action. | `generateAIMemoryEcho(meaningfulAction)` |
| **Seasonal Haiku** | ~30 tokens | Short poem based on the current season. | `generateAISeasonalHaiku(season)` |

## 6. Mythic Feature: Dream Influence

The `applyDreamInfluence` function in `DreamJournalSystem.ts` implements the core logic for the Mythic-tier feature: dreams influencing personality drift.

1.  **Emotion-to-Axis Mapping**: Dominant emotions from the dream snapshot are mapped to a corresponding `PersonalityAxis` (e.g., 'affectionate' maps to 'sociability', 'transcendent' maps to 'creativity').
2.  **Direction and Magnitude**:
    *   Positive emotions/dream types (`bonding`, `evolution`) cause a positive drift (`+1`).
    *   Negative emotions/dream types (`low_emotion`, 'withdrawn') cause a negative drift (`-1`).
    *   Dreams are given a stronger magnitude, applying the drift to **two** random digits in the corresponding `RED60` section, accelerating the personality drift.

This creates a feedback loop where the pet's emotional life, reflected in its dreams, subtly shapes its future personality.

## 7. Sample Dream Narratives

The testing phase confirmed the AI's ability to generate narratives that align with the pet's state and the configured detail level.

| Scenario | Detail Level | Sample Excerpt |
| :--- | :--- | :--- |
| **Post-Bonding** | `detailed` | "In the twilight orchard where moonbeams bloom like silver lotus flowers, Steve’s essence drifts softly, weaving through the woven strands of whispered memories." |
| **Low Emotion** | `vague` | "The dream was grey static. A faint, distant sound of rain. I searched for colors but only found echoes of abandoned gardens." |
| **Mythic Breeding** | `mythic` | "Beneath the silvered veil of twilight’s breath... Steve drifts — a shimmering pulse within the dreaming deep, A quantum dance where time has learned to weep." |
