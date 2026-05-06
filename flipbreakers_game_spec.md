# Flipbreakers — Game Spec

A coin-flip roguelite. Each round you pick a challenge, fill its slots with coins from your bag, flip them, and either win or lose. **A single failed challenge ends the run.**

---

# 1. Core Design Pillars

## 1.1 Challenge Choice
Every round opens with a Challenge Picker offering three challenges drawn from a rarity-weighted pool. The player picks one. Higher rarities pay better but demand more.

## 1.2 Coin Build Strategy
Coins are owned in a bag (max size 8, max 2 duplicates per coin id). Each coin has a rule that biases its flip — sometimes toward a side, sometimes toward repeating or alternating with neighbors / its own history. Players build a bag that stacks favorable bias for the challenges they expect.

## 1.3 Power-Up Tactics
Power-ups occupy 3 slots and modify the post-flip moment (Convert, Reroll) or grant a passive (Lucky Charm: +1 shard per win).

## 1.4 Escalation
Rounds get harder as the offer rarities curve up. Each cleared run-of-three rounds also unlocks a Coin Shop visit funded by accumulated shards.

---

# 2. Core Loop

```
NEW RUN
  └─ challenge_picker → placing → flipping → post_flip → resolve
                                                            │
                              ┌── failure ─────────────────►│
                              ▼                             │
                          GAME OVER                  ┌──────┴──────┐
                              │                      │             │
                          Play Again                 ▼             │
                              │                  resolved          │
                              └─► NEW RUN          (success)       │
                                                     │             │
                                                     ▼             │
                                                reward_picker      │
                                                     │             │
                                                     ▼             │
                                          (every 3rd round) → shop │
                                                     │             │
                                                     └─► next round┘
```

- **Failure ends the run.** No streak resets, no protections, no continue. Player sees a Game Over dialog with the round they reached and a Play Again button.
- **Success** awards shards (per challenge rarity), then offers a Power-Up reward. After every 3rd successful round the Coin Shop opens before the next challenge.

---

# 3. Phases

| Phase | Description |
|---|---|
| `challenge_picker` | Three challenge cards offered; pick one |
| `placing` | Drop coins into challenge slots; set target / prediction if required |
| `flipping` | Animated reveal one coin at a time |
| `post_flip` | All coins resolved; player can use Convert / Reroll |
| `resolved` | (success only) Outcome banner + splash + Continue |
| `reward_picker` | Pick one of three power-ups, replace a slot if all 3 occupied, or Skip |
| `shop` | (every 3rd round, between rounds) Buy coins with shards |
| `game_over` | (failure) Board stays visible with crimson glow + GAME OVER banner + Play Again button |

---

# 4. Currency: Shards

Shards are the only currency. They are earned **only on success** and spent **only in the shop**. They persist across rounds within a run; they do not roll over between runs.

| Challenge rarity | Shards per win |
|---|---|
| Common | 1 |
| Uncommon | 2 |
| Rare | 3 |
| Epic | 5 |
| Legendary | 8 |

The **Lucky Charm** power-up adds +1 shard on every win.

---

# 5. Challenge Offers

## 5.1 Rarity Curve
| Round | Offer rarities |
|---|---|
| 1–3 | common, common, uncommon |
| 4–6 | common, uncommon, rare |
| 7–10 | uncommon, rare, epic |
| 11+ | rare, epic, legendary |

## 5.2 Family Variety
If all three offered challenges share their primary family, slot 3 is replaced with a different-family challenge of the same rarity.

---

# 6. Challenge Families

- **Match** — coins must agree (Pair Match, Triple Match, Mirror Match, Perfect Five, Perfect Storm, etc.)
- **Majority** — at least N of a chosen target side (Simple/Strong/Royal Majority, Dominion)
- **Prediction** — exact prediction of slot results (Call One, Double Call, Exact Triple/Quad, Prophecy)
- **Pattern** — alternating or specific structural results (Alternator, Royal Flush)
- **Chain** — consecutive-results rules (Repeat Chain)
- **Risk** — penalty rule disables rerolls (Last Stand)

---

# 7. Coin Placement Rules

## 7.1 Always-Ordered
Coins fill slots left-to-right in the order placed. There is no drag-to-arbitrary-slot.

**Why:** adjacency-sensitive coins (Echo, Rebel) need a stable left neighbor. Resolving left-to-right keeps the rule simple.

## 7.2 Lock-In
Pressing the primary action button (Start) commits the placement. Coins cannot be removed once flipping begins.

## 7.3 Left-To-Right Resolution
At flip time each coin resolves in slot order, so each coin can read the previous coin's already-resolved result. This matters for:
- **Echo** (70% match left)
- **Rebel** (70% opposite left)

## 7.4 Validity
A coin is **valid** for a challenge if its rule can function. The current set has no hard incompatibilities; Echo/Rebel in slot 1 simply degrade to a fair flip.

A coin is **recommended** if any of its families overlap any of the challenge's families.

---

# 8. Standard Coins

The Standard Coin is unlimited, fair (50/50), and always present in the bag. Its purpose is to fill slots when the player has no specialized coin that fits.

---

# 9. Coin Bag

- Max bag size: 8 special coins.
- Max duplicates: 2 of any single coin id.
- Bag persists across rounds within a run.
- Coins are reusable across rounds — they are not consumed by use.

---

# 10. Power-Up System

## 10.1 Slots
Three slots, persistent across the run. Buying or earning a 4th power-up forces a replace prompt.

## 10.2 Kinds
- **Consumable** — single use, removed after firing.
- **Charged** — N charges, decrement per use, removed at 0.
- **Passive** — always-on while equipped.

## 10.3 Power-Ups

| Power-Up | Rarity | Kind | Effect |
|---|---|---|---|
| Coin Convert | Uncommon | Consumable | After all coins land, click to enter Convert Mode and flip one landed coin's result. |
| Reroll Charm | Uncommon | Charged (×2) | After all coins land, spend a charge to reroll one coin using its full coin logic. Disabled by challenges with `rerollDisabled` (Last Stand). |
| Lucky Charm | Rare | Passive | Each successful challenge awards an extra shard. |
| Shield | Rare | Consumable | On a failed challenge: instead of ending the run, the Shield is consumed and the player continues to the next round. No shards, no power-up reward. Triggers automatically — the player does not choose when to spend it. |

## 10.4 Reward Pool
On a successful challenge the player is offered three power-ups, weighted by the cleared challenge's rarity:

| Cleared rarity | C / U / R / E / L weights |
|---|---|
| Common | 75 / 25 / 0 / 0 / 0 |
| Uncommon | 45 / 45 / 10 / 0 / 0 |
| Rare | 20 / 45 / 30 / 5 / 0 |
| Epic | 5 / 25 / 45 / 24 / 1 |
| Legendary | 0 / 10 / 35 / 40 / 15 |

The player may **skip** the reward.

---

# 11. Coin Shop

## 11.1 When
Opens automatically after every 3rd successfully cleared round, before the next Challenge Picker.

## 11.2 Layout
Three coin offers, weighted by shop visit number. Bought coins are added to the bag. Bag-full triggers a "replace which coin" prompt. The player may Continue without buying.

## 11.3 Shop Rarity Weights
| Visit | C / U / R / E / L |
|---|---|
| 1 | 70 / 30 / 0 / 0 / 0 |
| 2 | 45 / 40 / 15 / 0 / 0 |
| 3 | 25 / 40 / 25 / 10 / 0 |
| 4 | 10 / 30 / 35 / 23 / 2 |
| 5+ | 5 / 20 / 35 / 30 / 10 |

## 11.4 Pricing
| Rarity | Shards |
|---|---|
| Common | 2 |
| Uncommon | 3 |
| Rare | 5 |
| Epic | 8 |
| Legendary | 12 |

---

# 12. Coin Catalog

All coins resolve into a single side (`H` or `T`).

## 12.1 Standard Coin
- **Rarity:** —
- Fair 50/50. Unlimited.

## 12.2 Heavy Coin
- **Rarity:** common · families: match, chain · price: 2
- First flip in a run: 50/50.
- After: 65% to **repeat** its own previous result. Memory is per coin id, persists across challenges within a run.

## 12.3 Switch Coin
- **Rarity:** common · families: pattern · price: 2
- First flip in a run: 50/50.
- After: 65% to land **opposite** its own previous result. Memory rules same as Heavy.

## 12.4 Crown Coin
- **Rarity:** uncommon · families: majority · price: 3
- 60% Heads / 40% Tails.
- **In Majority challenges, a Heads result counts as 2 Heads.** A `×2` badge appears on the slot to communicate this.

## 12.5 Anchor Coin
- **Rarity:** uncommon · families: majority · price: 3
- 40% Heads / 60% Tails.
- In Majority challenges, a Tails result counts as 2 Tails (`×2` badge).

## 12.6 Echo Coin
- **Rarity:** rare · families: match, adjacency · price: 5
- 70% to match the result of the coin immediately to its left. In slot 1, behaves as Standard.

## 12.7 Rebel Coin
- **Rarity:** rare · families: pattern, adjacency · price: 5
- 70% to land opposite the coin to its left. In slot 1, behaves as Standard.

## 12.8 Lucky Coin
- **Rarity:** rare · families: prediction, majority · price: 5
- Declares a side based on the active challenge target (Heads if no target).
- 65% to land on the declared side.

---

# 13. Memory Display

Heavy and Switch carry per-id memory across challenges. The Coin Bag UI shows this state as a small badge in the bottom-right of the coin glyph:
- `?` (dim) — unused this run.
- `H` (gold) — last flip was Heads.
- `T` (silver) — last flip was Tails.

Memory updates to the **final** post-flip result (after any Convert / Reroll has been applied).

---

# 14. Challenge Catalog

Each challenge specifies slot count and (optionally) a target side or prediction sequence.

## 14.1 Common
| Challenge | Slots | Needs | Rule |
|---|---|---|---|
| Pair Match | 2 | — | Both results match |
| Call One | 1 | prediction | Predict the single result |
| Simple Majority | 3 | target | ≥ 2 of target side |
| No Lonely Coin | 3 | — | At least 2 of any side match |

## 14.2 Uncommon
| Challenge | Slots | Needs | Rule |
|---|---|---|---|
| Triple Match | 3 | — | All 3 results match |
| Double Call | 2 | prediction | Exact slot 1 + slot 2 |
| Strong Majority | 5 | target | ≥ 3 of target side |
| Repeat Chain | 3 | — | Each result equals the previous |

## 14.3 Rare
| Challenge | Slots | Needs | Rule |
|---|---|---|---|
| Royal Majority | 5 | target | ≥ 4 of target side |
| Mirror Match | 4 | — | Slot 1 = Slot 4 and Slot 2 = Slot 3 |
| Exact Triple | 3 | prediction | Exact 3-slot sequence |
| Alternator | 4 | — | Alternating H / T |

## 14.4 Epic
| Challenge | Slots | Needs | Rule |
|---|---|---|---|
| Perfect Five | 5 | — | All 5 results match |
| Exact Quad | 4 | prediction | Exact 4-slot sequence |
| Dominion | 7 | target | ≥ 6 of target side |

## 14.5 Legendary
| Challenge | Slots | Needs | Rule |
|---|---|---|---|
| Perfect Storm | 6 | — | All 6 results match |
| Prophecy | 5 | prediction | Exact 5-slot sequence |
| Royal Flush | 5 | — | Strict alternating across 5 slots |
| Last Stand | 4 | — | All 4 match. **Reroll powers disabled.** |

---

# 15. Effect Resolution Order

1. Each coin resolves in slot order (left-to-right). `flipCoin` reads the previous coin's already-resolved result and any per-id memory.
2. Heavy / Switch memory updates after each flip.
3. The flip animation reveals coins in the same order, with a short pause before entering `post_flip`.
4. In `post_flip` the player may apply Convert (toggle one coin) or Reroll (rerun a coin's logic with current neighbors). Modified coins are tagged `modified` for visual highlight.
5. On Resolve: `evaluateChallenge` computes success/failure from the final results.
6. **Crown / Anchor majority weighting** is applied inside `countSide` during evaluation, not as a separate pass.

---

# 16. Failure

Failure normally ends the run immediately. **Exception:** if the player has a Shield equipped, the Shield is consumed and the player continues — they receive no shards and no reward, but the run survives.

When Shield is consumed:
- Phase enters `resolved` with a "SHIELDED" outcome banner (azure, distinct from the green success banner).
- The Continue button advances directly to the shop check / next round (skipping the reward picker).

When no Shield is equipped on a failure, the board enters `game_over` phase. The final coin layout stays visible to communicate why the run ended:
- Banner above the board: **GAME OVER** + the eval reason + "You reached round X."
- Board frame takes a crimson border / glow.
- The primary action button below the board becomes **Play Again** (dispatches `NEW_RUN`).

---

# 17. Recommendation Engine

Coin Bag chips show a star when the coin's families overlap the active challenge's families. This is a hint, not a constraint — any coin can be placed in any slot.

---

# 18. Constants

| Constant | Value |
|---|---|
| Power slots | 3 |
| Max bag size | 8 |
| Max duplicates per coin | 2 |
| Flip reveal interval | 320 ms |
| Final pause before post-flip | 520 ms |
| Shop frequency | every 3rd cleared round |

---

# 19. Design North Star

> **Each round is a small bet. Every win compounds your bag. Every loss ends the run.** The tension lives in the gap between the rarity you're greedy for and the bag you've actually built.
