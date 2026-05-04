import {
  CHALLENGE_DEFS,
  countSide,
  evaluateChallenge,
  offerRaritiesForRound,
  shardsForChallenge,
} from './challenges';
import {
  ALL_SPECIAL_COIN_IDS,
  COIN_DEFS,
  flipCoin,
  priceFor,
  recordMemory,
} from './coins';
import {
  ALL_POWERUP_IDS,
  POWERUP_DEFS,
  isRerollDisabled,
  powerRewardWeights,
  shopRarityWeights,
} from './powerups';
import { pick, uid, weightedPick } from './random';
import type {
  ChallengeId,
  CoinId,
  CoinSide,
  GameState,
  Outcome,
  PlacedCoin,
  PowerUpId,
  PowerUpInstance,
  Rarity,
  ShopOffer,
  SpecialCoinId,
} from './types';

export const POWER_SLOTS = 3;
export const MAX_BAG_SIZE = 8;
export const MAX_DUPLICATES = 2;

const RARITIES: Rarity[] = ['common', 'uncommon', 'rare', 'epic', 'legendary'];

/* -------------------------------------------------------------------------- */
/*  Action types                                                              */
/* -------------------------------------------------------------------------- */

export type Action =
  | { type: 'NEW_RUN' }
  | { type: 'CHOOSE_CHALLENGE'; id: ChallengeId }
  | { type: 'SET_TARGET'; side: CoinSide }
  | { type: 'SET_PREDICTION'; index: number; side: CoinSide }
  | { type: 'PLACE_COIN'; coinId: CoinId }
  | { type: 'REMOVE_PLACED'; uid: string }
  | { type: 'CLEAR_BOARD' }
  | { type: 'LOCK_AND_FLIP' }
  | { type: 'REVEAL_NEXT' }
  | { type: 'BEGIN_POST_FLIP' }
  | { type: 'ENTER_POST_FLIP_MODE'; mode: 'convert' | 'reroll' | null }
  | { type: 'POST_FLIP_APPLY'; uid: string }
  | { type: 'RESOLVE' }
  | { type: 'CONTINUE_FROM_OUTCOME' }
  | { type: 'CHOOSE_REWARD'; id: PowerUpId }
  | { type: 'REPLACE_REWARD_SLOT'; slotIdx: number }
  | { type: 'SKIP_REWARD' }
  | { type: 'BUY_COIN'; idx: number }
  | { type: 'REPLACE_BAG_SLOT'; idx: number }
  | { type: 'CANCEL_PURCHASE' }
  | { type: 'SHOP_CONTINUE' };

/* -------------------------------------------------------------------------- */
/*  Initial state                                                             */
/* -------------------------------------------------------------------------- */

export function newRun(): GameState {
  const offers = generateChallengeOffers(1);
  return {
    phase: 'challenge_picker',
    round: 1,
    streak: 1.0,
    shards: 0,
    bag: [],
    powerUps: [null, null, null],
    coinMemory: {},
    challengeOffers: offers,
    activeChallenge: null,
    target: null,
    prediction: [],
    placed: [],
    flippingIndex: 0,
    postFlipMode: null,
    outcome: null,
    rewardOffers: [],
    pendingReward: null,
    shopOffers: [],
    pendingPurchase: null,
    toNextShop: 0,
  };
}

/* -------------------------------------------------------------------------- */
/*  Generators                                                                */
/* -------------------------------------------------------------------------- */

export function generateChallengeOffers(round: number): ChallengeId[] {
  const rarities = offerRaritiesForRound(round);
  const used = new Set<ChallengeId>();
  const out: ChallengeId[] = [];
  for (const r of rarities) {
    const pool = (Object.keys(CHALLENGE_DEFS) as ChallengeId[]).filter(
      (id) => CHALLENGE_DEFS[id].rarity === r && !used.has(id),
    );
    if (pool.length === 0) {
      // Fallback: any unused challenge.
      const any = (Object.keys(CHALLENGE_DEFS) as ChallengeId[]).filter((id) => !used.has(id));
      const choice = pick(any);
      out.push(choice);
      used.add(choice);
    } else {
      const choice = pick(pool);
      out.push(choice);
      used.add(choice);
    }
  }
  // Family variety: if all 3 share a single family, swap slot 3.
  const families = out.map((id) => CHALLENGE_DEFS[id].families[0]);
  if (families[0] === families[1] && families[1] === families[2]) {
    const replacement = (Object.keys(CHALLENGE_DEFS) as ChallengeId[]).find(
      (id) =>
        !used.has(id) &&
        CHALLENGE_DEFS[id].rarity === rarities[2] &&
        CHALLENGE_DEFS[id].families[0] !== families[0],
    );
    if (replacement) out[2] = replacement;
  }
  return out;
}

export function generateRewardOffers(completedRarity: Rarity): PowerUpId[] {
  const weights = powerRewardWeights(completedRarity);
  const out: PowerUpId[] = [];
  for (let i = 0; i < 3; i++) {
    const r = weightedPick(RARITIES, weights);
    const pool = ALL_POWERUP_IDS.filter((id) => POWERUP_DEFS[id].rarity === r && !out.includes(id));
    if (pool.length === 0) {
      // Allow duplicate if pool exhausted at this rarity.
      const fallback = ALL_POWERUP_IDS.filter((id) => POWERUP_DEFS[id].rarity === r);
      if (fallback.length === 0) {
        out.push(pick(ALL_POWERUP_IDS));
      } else {
        out.push(pick(fallback));
      }
    } else {
      out.push(pick(pool));
    }
  }
  return out;
}

export function generateShopOffers(visit: number): ShopOffer[] {
  const weights = shopRarityWeights(visit);
  const out: ShopOffer[] = [];
  for (let i = 0; i < 3; i++) {
    const r = weightedPick(RARITIES, weights);
    const pool = ALL_SPECIAL_COIN_IDS.filter((id) => COIN_DEFS[id].rarity === r);
    if (pool.length === 0) {
      // Fall back to any rarity.
      const any = ALL_SPECIAL_COIN_IDS;
      const id = pick(any);
      out.push({ coinId: id, price: priceFor(COIN_DEFS[id].rarity) });
      continue;
    }
    const id = pick(pool);
    out.push({ coinId: id, price: priceFor(r) });
  }
  return out;
}

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

export function activeDef(s: GameState) {
  return s.activeChallenge ? CHALLENGE_DEFS[s.activeChallenge] : null;
}

export function isReady(s: GameState): boolean {
  const def = activeDef(s);
  if (!def) return false;
  if (s.placed.length !== def.slots) return false;
  if (def.needsTarget && s.target == null) return false;
  if (def.needsPrediction && s.prediction.length !== def.slots) return false;
  return true;
}

/** Counts of each special coin in the bag. */
export function bagCounts(bag: SpecialCoinId[]): Record<SpecialCoinId, number> {
  const counts = {} as Record<SpecialCoinId, number>;
  for (const id of ALL_SPECIAL_COIN_IDS) counts[id] = 0;
  for (const c of bag) counts[c] = (counts[c] ?? 0) + 1;
  return counts;
}

/** Available count for placement: bag count minus already-placed. */
export function availableCount(s: GameState, coinId: CoinId): number {
  if (coinId === 'standard') return Infinity;
  const inBag = s.bag.filter((c) => c === coinId).length;
  const placed = s.placed.filter((p) => p.coinId === coinId).length;
  return Math.max(0, inBag - placed);
}

/** Validity: a coin is invalid if its rule cannot function in this challenge. */
export function isCoinValid(s: GameState, _coinId: CoinId): boolean {
  const def = activeDef(s);
  if (!def) return false;
  // No invalid-coin rules for the current prototype set; Mirror Coin would go
  // here once added. Echo / Rebel are valid even in slot 1 (degrade to fair).
  return true;
}

export function isCoinRecommended(s: GameState, coinId: CoinId): boolean {
  const def = activeDef(s);
  if (!def) return false;
  const fams = COIN_DEFS[coinId].families as readonly string[];
  return def.families.some((f) => fams.includes(f));
}

/* -------------------------------------------------------------------------- */
/*  Reducer                                                                   */
/* -------------------------------------------------------------------------- */

export function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'NEW_RUN':
      return newRun();

    case 'CHOOSE_CHALLENGE': {
      const def = CHALLENGE_DEFS[action.id];
      return {
        ...state,
        phase: 'placing',
        activeChallenge: action.id,
        target: def.needsTarget ? 'H' : null,
        prediction: def.needsPrediction ? new Array(def.slots).fill('H') : [],
        placed: [],
        flippingIndex: 0,
        postFlipMode: null,
        outcome: null,
      };
    }

    case 'SET_TARGET':
      if (state.phase !== 'placing') return state;
      return { ...state, target: action.side };

    case 'SET_PREDICTION': {
      if (state.phase !== 'placing') return state;
      const next = state.prediction.slice();
      next[action.index] = action.side;
      return { ...state, prediction: next };
    }

    case 'PLACE_COIN': {
      if (state.phase !== 'placing') return state;
      const def = activeDef(state);
      if (!def) return state;
      if (state.placed.length >= def.slots) return state;
      if (availableCount(state, action.coinId) <= 0) return state;
      if (!isCoinValid(state, action.coinId)) return state;

      const declaredSide: CoinSide | undefined =
        action.coinId === 'lucky' ? state.target ?? 'H' : undefined;

      const placed: PlacedCoin = {
        uid: uid(),
        coinId: action.coinId,
        declaredSide,
      };
      return { ...state, placed: [...state.placed, placed] };
    }

    case 'REMOVE_PLACED': {
      if (state.phase !== 'placing') return state;
      return { ...state, placed: state.placed.filter((p) => p.uid !== action.uid) };
    }

    case 'CLEAR_BOARD':
      if (state.phase !== 'placing') return state;
      return { ...state, placed: [] };

    case 'LOCK_AND_FLIP': {
      if (state.phase !== 'placing') return state;
      if (!isReady(state)) return state;
      // Refresh Lucky Coin declared-side from current target before flipping
      // (if the player changed the target after placing).
      let memory = { ...state.coinMemory };
      const placed = state.placed.map((p) =>
        p.coinId === 'lucky' ? { ...p, declaredSide: state.target ?? 'H' } : p,
      );
      let prev: CoinSide | null = null;
      for (let i = 0; i < placed.length; i++) {
        const result = flipCoin(placed[i], prev, memory);
        placed[i] = { ...placed[i], result };
        memory = recordMemory(placed[i], result, memory);
        prev = result;
      }
      return {
        ...state,
        phase: 'flipping',
        coinMemory: memory,
        placed,
        flippingIndex: 0,
        postFlipMode: null,
      };
    }

    case 'REVEAL_NEXT':
      if (state.phase !== 'flipping') return state;
      if (state.flippingIndex >= state.placed.length) return state;
      return { ...state, flippingIndex: state.flippingIndex + 1 };

    case 'BEGIN_POST_FLIP':
      if (state.phase !== 'flipping') return state;
      return { ...state, phase: 'post_flip', postFlipMode: null };

    case 'ENTER_POST_FLIP_MODE': {
      if (state.phase !== 'post_flip') return state;
      // Validate that a usable power exists for the requested mode.
      if (action.mode === 'reroll' && isRerollDisabled(state.activeChallenge)) return state;
      return { ...state, postFlipMode: action.mode };
    }

    case 'POST_FLIP_APPLY': {
      if (state.phase !== 'post_flip' || !state.postFlipMode) return state;
      const target = state.placed.find((p) => p.uid === action.uid);
      if (!target || target.result == null) return state;

      let placed = state.placed.slice();
      let powerUps = state.powerUps.slice();

      if (state.postFlipMode === 'convert') {
        const slotIdx = powerUps.findIndex((p) => p?.id === 'coin_convert');
        if (slotIdx < 0) return state;
        // Toggle this coin's result.
        placed = placed.map((p) =>
          p.uid === action.uid
            ? { ...p, result: p.result === 'H' ? 'T' : 'H', modified: true }
            : p,
        );
        powerUps[slotIdx] = null;
      } else if (state.postFlipMode === 'reroll') {
        const slotIdx = powerUps.findIndex((p) => p?.id === 'reroll_charm');
        if (slotIdx < 0) return state;
        // Reroll this coin using full coin logic, with the prior coin's *current* result.
        const idx = placed.findIndex((p) => p.uid === action.uid);
        const prev = idx > 0 ? placed[idx - 1].result ?? null : null;
        let memory = { ...state.coinMemory };
        const newResult = flipCoin(target, prev, memory);
        memory = recordMemory(target, newResult, memory);
        placed = placed.map((p) =>
          p.uid === action.uid ? { ...p, result: newResult, modified: true } : p,
        );
        const charges = (powerUps[slotIdx]?.charges ?? 1) - 1;
        powerUps[slotIdx] = charges > 0 ? { id: 'reroll_charm', charges } : null;
        return { ...state, placed, powerUps, coinMemory: memory, postFlipMode: null };
      }

      return { ...state, placed, powerUps, postFlipMode: null };
    }

    case 'RESOLVE': {
      if (state.phase !== 'post_flip' && state.phase !== 'flipping') return state;
      return resolveOutcome(state);
    }

    case 'CONTINUE_FROM_OUTCOME':
      if (state.phase !== 'resolved') return state;
      return advanceFromResolved(state);

    case 'CHOOSE_REWARD': {
      if (state.phase !== 'reward_picker') return state;
      const emptyIdx = state.powerUps.findIndex((p) => p == null);
      const def = POWERUP_DEFS[action.id];
      const inst: PowerUpInstance =
        def.kind === 'charged' ? { id: action.id, charges: def.charges ?? 1 } : { id: action.id };
      if (emptyIdx >= 0) {
        const next = state.powerUps.slice();
        next[emptyIdx] = inst;
        return finishReward({ ...state, powerUps: next });
      }
      // No empty slot: enter replace mode.
      return { ...state, pendingReward: action.id };
    }

    case 'REPLACE_REWARD_SLOT': {
      if (state.phase !== 'reward_picker' || !state.pendingReward) return state;
      const def = POWERUP_DEFS[state.pendingReward];
      const inst: PowerUpInstance =
        def.kind === 'charged'
          ? { id: state.pendingReward, charges: def.charges ?? 1 }
          : { id: state.pendingReward };
      const next = state.powerUps.slice();
      next[action.slotIdx] = inst;
      return finishReward({ ...state, powerUps: next, pendingReward: null });
    }

    case 'SKIP_REWARD':
      if (state.phase !== 'reward_picker') return state;
      return finishReward({ ...state, pendingReward: null });

    case 'BUY_COIN': {
      if (state.phase !== 'shop') return state;
      const offer = state.shopOffers[action.idx];
      if (!offer) return state;
      if (state.shards < offer.price) return state;
      const dupCount = state.bag.filter((c) => c === offer.coinId).length;
      if (dupCount >= MAX_DUPLICATES) return state;
      if (state.bag.length >= MAX_BAG_SIZE) {
        return {
          ...state,
          pendingPurchase: { coinId: offer.coinId, price: offer.price, offerIdx: action.idx },
        };
      }
      const newOffers = state.shopOffers.slice();
      newOffers.splice(action.idx, 1);
      return {
        ...state,
        bag: [...state.bag, offer.coinId],
        shards: state.shards - offer.price,
        shopOffers: newOffers,
      };
    }

    case 'REPLACE_BAG_SLOT': {
      if (state.phase !== 'shop' || !state.pendingPurchase) return state;
      const newBag = state.bag.slice();
      newBag[action.idx] = state.pendingPurchase.coinId;
      const newOffers = state.shopOffers.slice();
      newOffers.splice(state.pendingPurchase.offerIdx, 1);
      return {
        ...state,
        bag: newBag,
        shards: state.shards - state.pendingPurchase.price,
        shopOffers: newOffers,
        pendingPurchase: null,
      };
    }

    case 'CANCEL_PURCHASE':
      if (state.phase !== 'shop') return state;
      return { ...state, pendingPurchase: null };

    case 'SHOP_CONTINUE':
      if (state.phase !== 'shop') return state;
      return startNextRound(state);

    default:
      return state;
  }
}

/* -------------------------------------------------------------------------- */
/*  Resolution                                                                */
/* -------------------------------------------------------------------------- */

function resolveOutcome(state: GameState): GameState {
  const def = activeDef(state);
  if (!def) return state;
  const evalRes = evaluateChallenge(def.id, state.placed, state.target, state.prediction);

  // Tally coin / power-up presence
  const goldCount = state.placed.filter((p) => p.coinId === 'gold').length;
  const crackedCount = state.placed.filter((p) => p.coinId === 'cracked').length;
  const safeCount = state.placed.filter((p) => p.coinId === 'safe').length;
  const headsSpec = state.powerUps.findIndex((p) => p?.id === 'heads_specialist');
  const tailsSpec = state.powerUps.findIndex((p) => p?.id === 'tails_specialist');
  const luckyCharm = state.powerUps.findIndex((p) => p?.id === 'lucky_charm');
  const safetyNet = state.powerUps.findIndex((p) => p?.id === 'safety_net');
  const shieldIdx = state.powerUps.findIndex((p) => p?.id === 'shield');
  const streakSaverIdx = state.powerUps.findIndex((p) => p?.id === 'streak_saver');

  let outcome: Outcome;
  let nextPowerUps = state.powerUps.slice();
  let nextStreak = state.streak;
  let shardsGained = 0;

  if (evalRes.success) {
    let gain = def.streakGain + 0.2 * goldCount + 0.4 * crackedCount;
    const heads = countSide(state.placed, 'H');
    const tails = countSide(state.placed, 'T');
    const headsDominant = state.target === 'H' || (state.target == null && heads > tails);
    const tailsDominant = state.target === 'T' || (state.target == null && tails > heads);
    if (headsSpec >= 0 && headsDominant) gain += 0.2;
    if (tailsSpec >= 0 && tailsDominant) gain += 0.2;

    nextStreak = Math.round((state.streak + gain) * 100) / 100;
    shardsGained = shardsForChallenge(def.rarity) + (luckyCharm >= 0 ? 1 : 0);

    outcome = {
      success: true,
      reason: evalRes.reason,
      streakBefore: state.streak,
      streakAfter: nextStreak,
      streakGain: Math.round(gain * 100) / 100,
      shardsGained,
      headsCount: evalRes.headsCount,
      tailsCount: evalRes.tailsCount,
    };
  } else {
    // Failure protection priority:
    // 1. Shield (consume) - prevents reset entirely
    // 2. Streak Saver (charge) - prevents reset entirely
    // 3. Safe Coin or Safety Net - halve current
    // 4. Cracked Coin - reset to 0.5
    // 5. Default - reset to 1.0
    let protectionApplied: Outcome['protectionApplied'] | undefined = undefined;

    if (shieldIdx >= 0 && state.streak > 1.0) {
      nextPowerUps[shieldIdx] = null;
      nextStreak = state.streak;
      protectionApplied = 'shield';
    } else if (streakSaverIdx >= 0 && state.streak > 1.0) {
      const charges = (nextPowerUps[streakSaverIdx]?.charges ?? 1) - 1;
      nextPowerUps[streakSaverIdx] = charges > 0 ? { id: 'streak_saver', charges } : null;
      nextStreak = state.streak;
      protectionApplied = 'streak_saver';
    } else if (safeCount > 0 || safetyNet >= 0) {
      nextStreak = Math.max(0.5, Math.round(state.streak * 0.5 * 100) / 100);
      protectionApplied = safeCount > 0 ? undefined : 'safety_net';
    } else if (crackedCount > 0) {
      nextStreak = 0.5;
      protectionApplied = 'cracked';
    } else {
      nextStreak = 1.0;
    }

    outcome = {
      success: false,
      reason: evalRes.reason,
      streakBefore: state.streak,
      streakAfter: nextStreak,
      streakGain: 0,
      shardsGained: 0,
      protectionApplied,
      headsCount: evalRes.headsCount,
      tailsCount: evalRes.tailsCount,
    };
  }

  return {
    ...state,
    phase: 'resolved',
    streak: nextStreak,
    shards: state.shards + shardsGained,
    powerUps: nextPowerUps,
    outcome,
  };
}

function advanceFromResolved(state: GameState): GameState {
  if (!state.outcome) return state;
  if (state.outcome.success) {
    const def = activeDef(state);
    if (!def) return startNextRound(state);
    const offers = generateRewardOffers(def.rarity);
    return { ...state, phase: 'reward_picker', rewardOffers: offers };
  }
  // Failure: skip reward, possibly enter shop, then start next round.
  return maybeShopOrNext(state);
}

function finishReward(state: GameState): GameState {
  return maybeShopOrNext(state);
}

function maybeShopOrNext(state: GameState): GameState {
  const justCompletedRound = state.round;
  // Shop appears after every 3rd completed round.
  if (justCompletedRound % 3 === 0) {
    const visit = Math.floor(justCompletedRound / 3);
    return {
      ...state,
      phase: 'shop',
      shopOffers: generateShopOffers(visit),
    };
  }
  return startNextRound(state);
}

function startNextRound(state: GameState): GameState {
  const round = state.round + 1;
  return {
    ...state,
    round,
    phase: 'challenge_picker',
    activeChallenge: null,
    target: null,
    prediction: [],
    placed: [],
    flippingIndex: 0,
    postFlipMode: null,
    outcome: null,
    rewardOffers: [],
    pendingReward: null,
    shopOffers: [],
    pendingPurchase: null,
    challengeOffers: generateChallengeOffers(round),
    toNextShop: round % 3 === 1 ? 0 : (round - 1) % 3,
  };
}
