export type CoinSide = 'H' | 'T';

export type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export type SpecialCoinId =
  | 'heavy'
  | 'switch'
  | 'gold'
  | 'cracked'
  | 'crown'
  | 'anchor'
  | 'echo'
  | 'rebel'
  | 'lucky'
  | 'safe';

export type CoinId = 'standard' | SpecialCoinId;

export type CoinFamily =
  | 'match'
  | 'streak'
  | 'pattern'
  | 'majority'
  | 'prediction'
  | 'greed'
  | 'safety'
  | 'risk'
  | 'adjacency';

export interface CoinDef {
  id: CoinId;
  name: string;
  rarity: Rarity;
  families: CoinFamily[];
  short: string;
  long: string;
  /** Base price (Standard has no price). */
  price?: number;
}

export type ChallengeFamily =
  | 'match'
  | 'majority'
  | 'prediction'
  | 'streak'
  | 'pattern'
  | 'risk';

export type ChallengeId =
  | 'pair_match'
  | 'call_one'
  | 'simple_majority'
  | 'no_lonely_coin'
  | 'triple_match'
  | 'double_call'
  | 'strong_majority'
  | 'repeat_chain'
  | 'royal_majority'
  | 'mirror_match'
  | 'exact_triple'
  | 'alternator'
  | 'perfect_five'
  | 'exact_quad'
  | 'dominion'
  | 'perfect_storm'
  | 'prophecy'
  | 'royal_flush'
  | 'last_stand';

export interface ChallengeDef {
  id: ChallengeId;
  name: string;
  rarity: Rarity;
  families: ChallengeFamily[];
  description: string;
  slots: number;
  streakGain: number;
  /** Player must pick a target side (Majority-style). */
  needsTarget: boolean;
  /** Player must enter a prediction sequence of length = slots. */
  needsPrediction: boolean;
  /** Reroll-style powers cannot be used (Last Stand). */
  rerollDisabled?: boolean;
}

export interface PlacedCoin {
  /** Stable id for animation keys. */
  uid: string;
  coinId: CoinId;
  /** For Lucky Coin: declared side. */
  declaredSide?: CoinSide;
  /** Final result after flip (set during 'flipping'/'post_flip'). */
  result?: CoinSide;
  /** True once any post-flip power-up has touched this coin. */
  modified?: boolean;
}

export type PowerUpId =
  | 'coin_convert'
  | 'reroll_charm'
  | 'shield'
  | 'streak_saver'
  | 'heads_specialist'
  | 'tails_specialist'
  | 'lucky_charm'
  | 'safety_net';

export type PowerUpKind = 'consumable' | 'charged' | 'passive';

export interface PowerUpDef {
  id: PowerUpId;
  name: string;
  rarity: Rarity;
  kind: PowerUpKind;
  short: string;
  long: string;
  /** Number of charges if 'charged'. */
  charges?: number;
}

export interface PowerUpInstance {
  id: PowerUpId;
  charges?: number;
}

export type Phase =
  | 'challenge_picker'
  | 'placing'
  | 'flipping'
  | 'post_flip'
  | 'resolved'
  | 'reward_picker'
  | 'shop'
  | 'game_over';

export type PostFlipMode = null | 'convert' | 'reroll';

export interface Outcome {
  success: boolean;
  reason: string;
  streakBefore: number;
  streakAfter: number;
  streakGain: number;
  shardsGained: number;
  protectionApplied?: 'shield' | 'streak_saver' | 'safety_net' | 'cracked';
  headsCount: number;
  tailsCount: number;
}

export interface ShopOffer {
  coinId: SpecialCoinId;
  price: number;
}

export interface GameState {
  phase: Phase;
  round: number;
  /** Current streak multiplier (e.g. 1.0, 2.6). */
  streak: number;
  shards: number;

  /** Owned special coins (multiset). */
  bag: SpecialCoinId[];
  /** Equipped power-up slots; null = empty. Length always 3. */
  powerUps: (PowerUpInstance | null)[];

  /** Per-coin memory for Heavy/Switch across challenges in this run. */
  coinMemory: Partial<Record<CoinId, CoinSide>>;

  /** Round-scoped state. */
  challengeOffers: ChallengeId[];
  activeChallenge: ChallengeId | null;
  target: CoinSide | null;
  prediction: CoinSide[];

  placed: PlacedCoin[];
  flippingIndex: number;
  postFlipMode: PostFlipMode;

  outcome: Outcome | null;

  rewardOffers: PowerUpId[];
  /** Set when reward picker needs to enter replace mode. */
  pendingReward: PowerUpId | null;

  shopOffers: ShopOffer[];
  /** Set when buying with full bag forces a replacement. */
  pendingPurchase: { coinId: SpecialCoinId; price: number; offerIdx: number } | null;

  /** Run progress for HUD pips: 0..3 within the current shop cycle. */
  toNextShop: number;
}
