import type {
  ChallengeDef,
  ChallengeId,
  CoinSide,
  PlacedCoin,
  Rarity,
} from './types';

export const CHALLENGE_DEFS: Record<ChallengeId, ChallengeDef> = {
  // Common
  pair_match: {
    id: 'pair_match',
    name: 'Pair Match',
    rarity: 'common',
    families: ['match'],
    description: 'Both final results must match.',
    slots: 2,
    needsTarget: false,
    needsPrediction: false,
  },
  call_one: {
    id: 'call_one',
    name: 'Call One',
    rarity: 'common',
    families: ['prediction'],
    description: 'Predict the result of a single coin flip.',
    slots: 1,
    needsTarget: false,
    needsPrediction: true,
  },
  simple_majority: {
    id: 'simple_majority',
    name: 'Simple Majority',
    rarity: 'common',
    families: ['majority'],
    description: 'Get at least 2 of your chosen side in 3 slots.',
    slots: 3,
    needsTarget: true,
    needsPrediction: false,
  },
  no_lonely_coin: {
    id: 'no_lonely_coin',
    name: 'No Lonely Coin',
    rarity: 'common',
    families: ['match'],
    description: 'At least 2 of the 3 final results must match.',
    slots: 3,
    needsTarget: false,
    needsPrediction: false,
  },

  // Uncommon
  triple_match: {
    id: 'triple_match',
    name: 'Triple Match',
    rarity: 'uncommon',
    families: ['match'],
    description: 'All 3 final results must match.',
    slots: 3,
    needsTarget: false,
    needsPrediction: false,
  },
  double_call: {
    id: 'double_call',
    name: 'Double Call',
    rarity: 'uncommon',
    families: ['prediction'],
    description: 'Predict slot 1 and slot 2 exactly.',
    slots: 2,
    needsTarget: false,
    needsPrediction: true,
  },
  strong_majority: {
    id: 'strong_majority',
    name: 'Strong Majority',
    rarity: 'uncommon',
    families: ['majority'],
    description: 'Get at least 3 of your chosen side in 5 slots.',
    slots: 5,
    needsTarget: true,
    needsPrediction: false,
  },
  repeat_chain: {
    id: 'repeat_chain',
    name: 'Repeat Chain',
    rarity: 'uncommon',
    families: ['chain', 'match'],
    description: 'Each result must match the previous result.',
    slots: 3,
    needsTarget: false,
    needsPrediction: false,
  },

  // Rare
  royal_majority: {
    id: 'royal_majority',
    name: 'Royal Majority',
    rarity: 'rare',
    families: ['majority'],
    description: 'Get at least 4 of your chosen side in 5 slots.',
    slots: 5,
    needsTarget: true,
    needsPrediction: false,
  },
  mirror_match: {
    id: 'mirror_match',
    name: 'Mirror Match',
    rarity: 'rare',
    families: ['pattern', 'match'],
    description: 'Slot 1 must match slot 4, and slot 2 must match slot 3.',
    slots: 4,
    needsTarget: false,
    needsPrediction: false,
  },
  exact_triple: {
    id: 'exact_triple',
    name: 'Exact Triple',
    rarity: 'rare',
    families: ['prediction'],
    description: 'Predict the exact 3-slot sequence.',
    slots: 3,
    needsTarget: false,
    needsPrediction: true,
  },
  alternator: {
    id: 'alternator',
    name: 'Alternator',
    rarity: 'rare',
    families: ['pattern'],
    description: 'Results must alternate between Heads and Tails.',
    slots: 4,
    needsTarget: false,
    needsPrediction: false,
  },

  // Epic
  perfect_five: {
    id: 'perfect_five',
    name: 'Perfect Five',
    rarity: 'epic',
    families: ['match'],
    description: 'All 5 final results must match.',
    slots: 5,
    needsTarget: false,
    needsPrediction: false,
  },
  exact_quad: {
    id: 'exact_quad',
    name: 'Exact Quad',
    rarity: 'epic',
    families: ['prediction'],
    description: 'Predict the exact 4-slot sequence.',
    slots: 4,
    needsTarget: false,
    needsPrediction: true,
  },
  dominion: {
    id: 'dominion',
    name: 'Dominion',
    rarity: 'epic',
    families: ['majority'],
    description: 'Get at least 6 of your chosen side in 7 slots.',
    slots: 7,
    needsTarget: true,
    needsPrediction: false,
  },

  // Legendary
  perfect_storm: {
    id: 'perfect_storm',
    name: 'Perfect Storm',
    rarity: 'legendary',
    families: ['match', 'risk'],
    description: 'All 6 final results must match.',
    slots: 6,
    needsTarget: false,
    needsPrediction: false,
  },
  prophecy: {
    id: 'prophecy',
    name: 'Prophecy',
    rarity: 'legendary',
    families: ['prediction', 'pattern'],
    description: 'Predict the exact 5-slot sequence.',
    slots: 5,
    needsTarget: false,
    needsPrediction: true,
  },
  royal_flush: {
    id: 'royal_flush',
    name: 'Royal Flush',
    rarity: 'legendary',
    families: ['pattern'],
    description: 'Results must alternate perfectly across 5 slots.',
    slots: 5,
    needsTarget: false,
    needsPrediction: false,
  },
  last_stand: {
    id: 'last_stand',
    name: 'Last Stand',
    rarity: 'legendary',
    families: ['risk'],
    description: 'All 4 final results must match. Reroll powers disabled.',
    slots: 4,
    needsTarget: false,
    needsPrediction: false,
    rerollDisabled: true,
  },
};

export const ALL_CHALLENGE_IDS: ChallengeId[] = Object.keys(CHALLENGE_DEFS) as ChallengeId[];

export function challengesByRarity(r: Rarity): ChallengeId[] {
  return ALL_CHALLENGE_IDS.filter((id) => CHALLENGE_DEFS[id].rarity === r);
}

/** Earned shards by challenge rarity. */
export function shardsForChallenge(r: Rarity): number {
  switch (r) {
    case 'common':
      return 1;
    case 'uncommon':
      return 2;
    case 'rare':
      return 3;
    case 'epic':
      return 5;
    case 'legendary':
      return 8;
  }
}

/** Recommended rarity curve from spec section 5.1. */
export function offerRaritiesForRound(round: number): [Rarity, Rarity, Rarity] {
  if (round <= 3) return ['common', 'common', 'uncommon'];
  if (round <= 6) return ['common', 'uncommon', 'rare'];
  if (round <= 10) return ['uncommon', 'rare', 'epic'];
  return ['rare', 'epic', 'legendary'];
}

/**
 * Count occurrences of `side`, applying Crown / Anchor majority weighting.
 * Crown counts as 2 Heads when it lands Heads.
 * Anchor counts as 2 Tails when it lands Tails.
 */
export function countSide(placed: PlacedCoin[], side: CoinSide): number {
  let n = 0;
  for (const c of placed) {
    if (c.result !== side) continue;
    if (side === 'H' && c.coinId === 'crown') n += 2;
    else if (side === 'T' && c.coinId === 'anchor') n += 2;
    else n += 1;
  }
  return n;
}

export interface SuccessResult {
  success: boolean;
  reason: string;
  headsCount: number;
  tailsCount: number;
}

export function evaluateChallenge(
  id: ChallengeId,
  placed: PlacedCoin[],
  target: CoinSide | null,
  prediction: CoinSide[],
): SuccessResult {
  const results = placed.map((p) => p.result!);
  const headsCount = countSide(placed, 'H');
  const tailsCount = countSide(placed, 'T');
  const rawHeads = results.filter((r) => r === 'H').length;
  const rawTails = results.length - rawHeads;
  const allSame = results.every((r) => r === results[0]);
  const sideName = (s: CoinSide) => (s === 'H' ? 'Heads' : 'Tails');

  switch (id) {
    case 'pair_match':
      return {
        success: results[0] === results[1],
        reason:
          results[0] === results[1]
            ? `${sideName(results[0])} pair matched`
            : `${sideName(results[0])} vs ${sideName(results[1])} — no match`,
        headsCount,
        tailsCount,
      };

    case 'call_one': {
      const want = prediction[0] ?? 'H';
      const got = results[0];
      return {
        success: got === want,
        reason:
          got === want
            ? `Called ${sideName(want)}, got ${sideName(got)}`
            : `Called ${sideName(want)}, got ${sideName(got)}`,
        headsCount,
        tailsCount,
      };
    }

    case 'simple_majority': {
      const t = target ?? 'H';
      const need = 2;
      const got = t === 'H' ? headsCount : tailsCount;
      return {
        success: got >= need,
        reason: `${got}/${need} ${sideName(t)}`,
        headsCount,
        tailsCount,
      };
    }

    case 'no_lonely_coin':
      return {
        success: rawHeads >= 2 || rawTails >= 2,
        reason:
          rawHeads >= 2 || rawTails >= 2
            ? `${Math.max(rawHeads, rawTails)} matched`
            : `All 3 results different`,
        headsCount,
        tailsCount,
      };

    case 'triple_match':
      return {
        success: allSame,
        reason: allSame ? `Triple ${sideName(results[0])}` : `Mixed results`,
        headsCount,
        tailsCount,
      };

    case 'double_call': {
      const ok = results[0] === prediction[0] && results[1] === prediction[1];
      return {
        success: ok,
        reason: ok ? `Both calls correct` : `Predictions missed`,
        headsCount,
        tailsCount,
      };
    }

    case 'strong_majority': {
      const t = target ?? 'H';
      const need = 3;
      const got = t === 'H' ? headsCount : tailsCount;
      return {
        success: got >= need,
        reason: `${got}/${need} ${sideName(t)}`,
        headsCount,
        tailsCount,
      };
    }

    case 'repeat_chain': {
      let ok = true;
      for (let i = 1; i < results.length; i++) {
        if (results[i] !== results[i - 1]) {
          ok = false;
          break;
        }
      }
      return {
        success: ok,
        reason: ok ? `Chain held` : `Chain broke`,
        headsCount,
        tailsCount,
      };
    }

    case 'royal_majority': {
      const t = target ?? 'H';
      const need = 4;
      const got = t === 'H' ? headsCount : tailsCount;
      return {
        success: got >= need,
        reason: `${got}/${need} ${sideName(t)}`,
        headsCount,
        tailsCount,
      };
    }

    case 'dominion': {
      const t = target ?? 'H';
      const need = 6;
      const got = t === 'H' ? headsCount : tailsCount;
      return {
        success: got >= need,
        reason: `${got}/${need} ${sideName(t)}`,
        headsCount,
        tailsCount,
      };
    }

    case 'mirror_match': {
      const ok = results[0] === results[3] && results[1] === results[2];
      return {
        success: ok,
        reason: ok ? `Mirror held` : `Mirror broke`,
        headsCount,
        tailsCount,
      };
    }

    case 'exact_triple':
    case 'exact_quad':
    case 'prophecy': {
      const ok = results.every((r, i) => r === prediction[i]);
      return {
        success: ok,
        reason: ok ? `Exact match` : `Sequence missed`,
        headsCount,
        tailsCount,
      };
    }

    case 'alternator':
    case 'royal_flush': {
      let ok = true;
      for (let i = 1; i < results.length; i++) {
        if (results[i] === results[i - 1]) {
          ok = false;
          break;
        }
      }
      return {
        success: ok,
        reason: ok ? `Alternating` : `Two of a kind broke pattern`,
        headsCount,
        tailsCount,
      };
    }

    case 'perfect_five':
    case 'perfect_storm':
    case 'last_stand':
      return {
        success: allSame,
        reason: allSame ? `All ${sideName(results[0])}` : `Mixed results`,
        headsCount,
        tailsCount,
      };
  }

  // Unreachable but satisfies exhaustive return.
  return { success: false, reason: 'Unknown challenge', headsCount, tailsCount };
}
