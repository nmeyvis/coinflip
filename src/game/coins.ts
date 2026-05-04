import type { CoinDef, CoinId, CoinSide, PlacedCoin, SpecialCoinId } from './types';
import { biased, chance, flipFair } from './random';

export const COIN_DEFS: Record<CoinId, CoinDef> = {
  standard: {
    id: 'standard',
    name: 'Standard Coin',
    rarity: 'common',
    families: [],
    short: 'Fair 50/50.',
    long: 'A plain coin. 50% Heads, 50% Tails. Always valid. Unlimited.',
  },
  heavy: {
    id: 'heavy',
    name: 'Heavy Coin',
    rarity: 'common',
    families: ['match', 'streak'],
    short: '65% to repeat itself.',
    long: 'First flip in a run is 50/50. After that, 65% to repeat its own previous result.',
    price: 3,
  },
  switch: {
    id: 'switch',
    name: 'Switch Coin',
    rarity: 'common',
    families: ['pattern'],
    short: '65% to flip its own last result.',
    long: 'First flip in a run is 50/50. After that, 65% to land opposite of its own previous result.',
    price: 3,
  },
  gold: {
    id: 'gold',
    name: 'Gold Coin',
    rarity: 'uncommon',
    families: ['greed'],
    short: 'On success: +0.2 streak.',
    long: '50/50 flip. If the challenge succeeds while this coin was used, gain +0.2 additional streak.',
    price: 5,
  },
  cracked: {
    id: 'cracked',
    name: 'Cracked Coin',
    rarity: 'uncommon',
    families: ['greed', 'risk'],
    short: '+0.4 on win, x0.5 reset on loss.',
    long: '50/50 flip. Success: +0.4 streak. Failure: streak resets to x0.5 instead of x1.0.',
    price: 5,
  },
  crown: {
    id: 'crown',
    name: 'Crown Coin',
    rarity: 'uncommon',
    families: ['majority'],
    short: '60% Heads. Counts as 2H in Majority.',
    long: '60% Heads / 40% Tails. In Majority challenges, Heads counts as 2 Heads.',
    price: 5,
  },
  anchor: {
    id: 'anchor',
    name: 'Anchor Coin',
    rarity: 'uncommon',
    families: ['majority'],
    short: '60% Tails. Counts as 2T in Majority.',
    long: '40% Heads / 60% Tails. In Majority challenges, Tails counts as 2 Tails.',
    price: 5,
  },
  echo: {
    id: 'echo',
    name: 'Echo Coin',
    rarity: 'rare',
    families: ['match', 'adjacency'],
    short: '70% to match left neighbor.',
    long: '70% to match the result of the coin immediately to its left. In slot 1, behaves as Standard.',
    price: 8,
  },
  rebel: {
    id: 'rebel',
    name: 'Rebel Coin',
    rarity: 'rare',
    families: ['pattern', 'adjacency'],
    short: '70% to invert left neighbor.',
    long: '70% to land opposite the coin immediately to its left. In slot 1, behaves as Standard.',
    price: 8,
  },
  lucky: {
    id: 'lucky',
    name: 'Lucky Coin',
    rarity: 'rare',
    families: ['prediction', 'majority'],
    short: '65% to land on declared side.',
    long: 'Declares a side based on the challenge target (Heads if no target). 65% to land on that side.',
    price: 8,
  },
  safe: {
    id: 'safe',
    name: 'Safe Coin',
    rarity: 'epic',
    families: ['safety'],
    short: 'Failure halves streak instead of reset.',
    long: '50/50 flip. If challenge fails while this coin was used, streak is halved instead of fully reset.',
    price: 12,
  },
};

export const ALL_COIN_IDS: CoinId[] = Object.keys(COIN_DEFS) as CoinId[];
export const ALL_SPECIAL_COIN_IDS: SpecialCoinId[] = ALL_COIN_IDS.filter(
  (c) => c !== 'standard',
) as SpecialCoinId[];

/**
 * Resolve a single coin into a final side, given its predecessor's result and
 * a per-run memory map for sticky/anti-sticky coins.
 *
 * Memory is keyed by coin id (not per-instance) — a deliberate prototype
 * shortcut: if the player owns two Heavy Coins, they share a memory cell.
 */
export function flipCoin(
  placed: PlacedCoin,
  prev: CoinSide | null,
  memory: Partial<Record<CoinId, CoinSide>>,
): CoinSide {
  const id = placed.coinId;
  switch (id) {
    case 'standard':
    case 'gold':
    case 'cracked':
    case 'safe':
      return flipFair();
    case 'crown':
      return biased(0.6);
    case 'anchor':
      return biased(0.4);
    case 'heavy': {
      const prior = memory.heavy;
      if (prior == null) return flipFair();
      return chance(0.65) ? prior : prior === 'H' ? 'T' : 'H';
    }
    case 'switch': {
      const prior = memory.switch;
      if (prior == null) return flipFair();
      return chance(0.65) ? (prior === 'H' ? 'T' : 'H') : prior;
    }
    case 'echo': {
      if (prev == null) return flipFair();
      return chance(0.7) ? prev : prev === 'H' ? 'T' : 'H';
    }
    case 'rebel': {
      if (prev == null) return flipFair();
      return chance(0.7) ? (prev === 'H' ? 'T' : 'H') : prev;
    }
    case 'lucky': {
      const target = placed.declaredSide ?? 'H';
      return chance(0.65) ? target : target === 'H' ? 'T' : 'H';
    }
  }
}

/**
 * Memory-update for sticky coins: only Heavy and Switch persist their last
 * result across challenges. Echo / Rebel depend on their neighbor not memory.
 */
export function recordMemory(
  placed: PlacedCoin,
  result: CoinSide,
  memory: Partial<Record<CoinId, CoinSide>>,
): Partial<Record<CoinId, CoinSide>> {
  if (placed.coinId !== 'heavy' && placed.coinId !== 'switch') return memory;
  return { ...memory, [placed.coinId]: result };
}

export function rarityRank(r: CoinDef['rarity']): number {
  return ['common', 'uncommon', 'rare', 'epic', 'legendary'].indexOf(r);
}

export function priceFor(rarity: CoinDef['rarity']): number {
  switch (rarity) {
    case 'common':
      return 3;
    case 'uncommon':
      return 5;
    case 'rare':
      return 8;
    case 'epic':
      return 12;
    case 'legendary':
      return 18;
  }
}
