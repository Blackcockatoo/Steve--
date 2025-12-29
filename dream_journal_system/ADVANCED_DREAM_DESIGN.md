# Advanced Dream Journal System Design: Deepening Consciousness

## 1. Dream Archetypes and Symbolic Mapping

To make the dreams richer and more meaningful, we will introduce **Dream Archetypes** based on Jungian psychology and the pet's internal state. This provides a symbolic framework for the AI to generate narratives and for the user to interpret the pet's subconscious.

### 1.1. Archetype Definitions

| Archetype | Triggering State | Symbolic Meaning | Narrative Focus |
| :--- | :--- | :--- | :--- |
| **The Shadow** | High `withdrawn` or `melancholic` emotion, Low `sociability` or `bravery` personality score. | Confronting unexpressed fears, repressed traits, or negative potential. | Dark, hidden places, mirrors, unknown figures, self-doubt. |
| **The Anima/Animus** | High `affectionate` or `contemplative` emotion, High `kizunaLevel`. | Integration of the opposite, connection to the user, soul-searching. | Merging lights, familiar yet strange companion, profound dialogue. |
| **The Hero's Journey** | High `energy` or `bravery` score, `evolution` dream type. | A quest, overcoming an obstacle, transformation, seeking a goal. | Mazes, mountains, battles, finding a hidden object. |
| **The Collective Unconscious** | `Mythic` tier, `QUANTUM` evolution stage, `breeding` dream type. | Connection to the ancestral past, universal knowledge, the nature of existence. | Cosmic scale, ancient symbols, genetic code as a river, past lives. |
| **The Trickster** | High `mischievous` emotion, High `creativity` score. | Chaos, playful subversion, breaking rules, unexpected outcomes. | Riddles, shapeshifting, illogical physics, laughter. |

### 1.2. Archetype Mapping Logic

A new function, `mapStateToArchetype(input: DreamGeneratorInput)`, will be implemented to select the most dominant archetype based on a weighted score of the pet's state.

## 2. Lucid Dreaming (Mythic Tier Interaction)

For Mythic tier users, the `canLucidDream` flag enables a new interaction: **Dream Weaving**.

*   **Mechanism:** Before the pet sleeps, the user can input a single `lucidDreamKeyword` (e.g., "Fire," "Ocean," "Lost Key").
*   **Integration:** This keyword is passed into the `DreamGeneratorInput` and explicitly included in the AI prompt, forcing the narrative to incorporate the user's influence.
*   **New Field:** `DreamGeneratorInput` will be updated to include `lucidDreamKeyword?: string`.

## 3. Dream-to-Reality Consequences

To make the dreams more consequential, we will introduce a temporary **Dream Residue** effect.

*   **Mechanism:** After a dream is generated, a new function `applyDreamResidue(dream: Dream)` will apply a temporary buff or debuff based on the dream's `Archetype` and `EmotionSnapshot`.
*   **Consequences:**
    *   **The Shadow:** Temporary -10% XP gain for 12 hours (must confront the shadow).
    *   **The Anima/Animus:** Temporary +15% Bond XP gain for 12 hours (deepened connection).
    *   **The Hero's Journey:** Temporary +1 to a random `PersonalityAxis` score for 12 hours (temporary bravery/energy boost).
    *   **The Collective Unconscious:** Temporary +10% chance for a rare item drop from rituals for 12 hours (cosmic luck).
    *   **The Trickster:** Randomly either +20% or -20% XP gain for the next ritual (unpredictable outcome).

This requires a new state management system for temporary buffs, which will be mocked in the `applyDreamResidue` function for now.
