import type { ChallengeId, PowerUpDef, PowerUpId, Rarity } from './types';
import { CHALLENGE_DEFS } from './challenges';

export const POWERUP_DEFS: Record<PowerUpId, PowerUpDef> = {
  shield: {
    id: 'shield',
    name: 'Shield',
    rarity: 'rare',
    kind: 'consumable',
    short: 'Survive one game-ending loss.',
    long: 'On a failed challenge: instead of ending the run, the Shield is consumed and you continue to the next round (no shards, no reward).',
  },
  coin_convert: {
    id: 'coin_convert',
    name: 'Coin Convert',
    rarity: 'uncommon',
    kind: 'consumable',
    short: 'Flip one landed coin.',
    long: 'After all coins land, click to enter Convert Mode. Click a coin to flip its result. Consumed on use.',
  },
  reroll_charm: {
    id: 'reroll_charm',
    name: 'Reroll Charm',
    rarity: 'uncommon',
    kind: 'charged',
    charges: 2,
    short: 'Reroll a coin (x2 charges).',
    long: 'After all coins land, click to enter Reroll Mode. Spend 1 charge to reroll one coin. Disabled in challenges that disable rerolls.',
  },
  lucky_charm: {
    id: 'lucky_charm',
    name: 'Lucky Charm',
    rarity: 'rare',
    kind: 'passive',
    short: '+1 Shard on every win.',
    long: 'Passive. Each successful challenge awards an extra Shard.',
  },
};

export const ALL_POWERUP_IDS: PowerUpId[] = Object.keys(POWERUP_DEFS) as PowerUpId[];

/** Power-up reward rarity table. Returns weights in [common, uncommon, rare, epic, legendary]. */
export function powerRewardWeights(completedRarity: Rarity): number[] {
  switch (completedRarity) {
    case 'common':
      return [75, 25, 0, 0, 0];
    case 'uncommon':
      return [45, 45, 10, 0, 0];
    case 'rare':
      return [20, 45, 30, 5, 0];
    case 'epic':
      return [5, 25, 45, 24, 1];
    case 'legendary':
      return [0, 10, 35, 40, 15];
  }
}

/** Shop coin rarity table. Returns weights for shop visit n (1-indexed). */
export function shopRarityWeights(visit: number): number[] {
  if (visit <= 1) return [70, 30, 0, 0, 0];
  if (visit === 2) return [45, 40, 15, 0, 0];
  if (visit === 3) return [25, 40, 25, 10, 0];
  if (visit === 4) return [10, 30, 35, 23, 2];
  return [5, 20, 35, 30, 10];
}

export function isRerollDisabled(challengeId: ChallengeId | null): boolean {
  if (!challengeId) return false;
  return CHALLENGE_DEFS[challengeId].rerollDisabled === true;
}
