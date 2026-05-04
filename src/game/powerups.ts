import type { ChallengeId, PowerUpDef, PowerUpId, Rarity } from './types';
import { CHALLENGE_DEFS } from './challenges';

export const POWERUP_DEFS: Record<PowerUpId, PowerUpDef> = {
  shield: {
    id: 'shield',
    name: 'Shield',
    rarity: 'common',
    kind: 'consumable',
    short: 'Block one streak break.',
    long: 'On failure: prevents your streak from breaking. Consumed on use.',
  },
  heads_specialist: {
    id: 'heads_specialist',
    name: 'Heads Specialist',
    rarity: 'common',
    kind: 'passive',
    short: '+0.2 streak when Heads dominate.',
    long: 'Passive. On success, if Heads outnumber Tails (or target is Heads), gain +0.2 extra streak.',
  },
  tails_specialist: {
    id: 'tails_specialist',
    name: 'Tails Specialist',
    rarity: 'common',
    kind: 'passive',
    short: '+0.2 streak when Tails dominate.',
    long: 'Passive. On success, if Tails outnumber Heads (or target is Tails), gain +0.2 extra streak.',
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
  streak_saver: {
    id: 'streak_saver',
    name: 'Streak Saver',
    rarity: 'rare',
    kind: 'charged',
    charges: 2,
    short: 'Block streak break (x2 charges).',
    long: 'On failure: prevents your streak from breaking. Spends 1 charge.',
  },
  safety_net: {
    id: 'safety_net',
    name: 'Safety Net',
    rarity: 'epic',
    kind: 'passive',
    short: 'Failure halves streak instead of reset.',
    long: 'Passive. On failure, your streak is halved instead of fully reset.',
  },
};

export const ALL_POWERUP_IDS: PowerUpId[] = Object.keys(POWERUP_DEFS) as PowerUpId[];

/** Power-up reward rarity table (spec 22). Returns weights in [common, uncommon, rare, epic, legendary]. */
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

/** Shop coin rarity table (spec 18). Returns weights for shop visit n (1-indexed). */
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
