# Flipbreakers — Updated Game Spec

A roguelite coin-flip score-chaser built around:

- **3-choice random challenges**
- **Streak multipliers**
- **3 equipped power-up slots**
- **A special coin bag**
- **Always-ordered coin placement**
- **Unlimited Standard Coins**
- **A Shard currency used to buy special coins in shops**

The player chooses one of three challenges each round, places coins into ordered slots, flips them left-to-right, uses power-ups tactically, and builds a stronger coin bag over the run.

---

# 1. Core Design Pillars

## 1.1 Challenge Choice

Each round, the player chooses from **3 random challenges**.

The challenges differ by:

- Rarity
- Difficulty
- Required coin slots
- Streak multiplier gain
- Challenge family
- Power-up reward pool

The player should constantly ask:

> “Which challenge can my current build handle?”

---

## 1.2 Coin Build Strategy

Coins are chosen **before any flipping happens**.

Coins define the player’s probability engine, risk profile, and challenge synergy.

The player should ask:

> “Which coins should I commit to this challenge before I see the results?”

---

## 1.3 Power-Up Tactics

Power-ups are equipped separately from coins.

Power-ups let the player bend, protect, or exploit outcomes during or after the challenge.

The player should ask:

> “Is this result worth spending one of my limited power-ups?”

---

## 1.4 Escalation

The game escalates through:

- Higher-rarity challenges
- Larger streak multipliers
- Better power-up reward pools
- Stronger coin shops
- More specialized coin builds
- Higher-risk decisions

---

# 2. Core Loop

Each round follows this structure:

```text
1. Deal 3 random challenges.
2. Player chooses 1 challenge.
3. Challenge creates numbered coin slots.
4. Player places coins into all required slots.
5. Player locks coin placement.
6. Coins are flipped from left to right.
7. Coin effects resolve.
8. Player may use valid power-ups.
9. Challenge success or failure is checked.
10. If successful:
    - Add challenge streak multiplier.
    - Award Shards.
    - Offer 3 power-ups from a pool based on challenge rarity.
11. If failed:
    - No multiplier gain.
    - No power-up reward.
    - Streak penalty applies unless prevented or softened.
12. Every 3 rounds, open the coin shop.
13. Continue to next round.
```

---

# 3. Scoring and Streak Multiplier

Challenges do **not** award flat reward points directly.

Instead, each challenge has a **streak multiplier gain**.

## 3.1 Streak Multiplier

```text
Current Streak Multiplier starts at x1.0.
```

On challenge success:

```text
Current Streak Multiplier += Challenge Streak Multiplier Gain
```

On challenge failure:

```text
Current Streak Multiplier resets to x1.0
```

Unless modified by a coin or power-up.

## 3.2 Example

```text
Current Streak Multiplier: x2.5
Challenge Multiplier Gain: +0.8

Success:
New Streak Multiplier = x3.3
```

This keeps growth exciting without immediately becoming exponential.

---

# 4. Challenge Rarity

Challenge rarity controls:

1. Difficulty
2. Streak multiplier gain
3. End-of-round power-up reward pool
4. Shards earned

| Challenge Rarity | Difficulty | Streak Multiplier Gain | Shards Earned | Reward Pool |
|---|---:|---:|---:|---|
| Common | Easy | +0.3 to +0.5 | 1 | Mostly Common powers |
| Uncommon | Moderate | +0.6 to +0.9 | 2 | Common / Uncommon powers |
| Rare | Hard | +1.0 to +1.5 | 3 | Uncommon / Rare powers |
| Epic | Very Hard | +1.8 to +2.5 | 5 | Rare / Epic powers |
| Legendary | Extreme | +3.0 to +4.0 | 8 | Epic / Legendary powers |

---

# 5. Challenge Offers

Each round offers **3 random challenges**.

Recommended structure:

```text
Slot 1: Lower-risk challenge
Slot 2: Medium-risk challenge
Slot 3: Higher-risk challenge
```

## 5.1 Suggested Rarity Curve

| Round | Challenge Offer Pattern |
|---:|---|
| 1–3 | Common, Common, Uncommon |
| 4–6 | Common, Uncommon, Rare |
| 7–10 | Uncommon, Rare, Epic |
| 11+ | Rare, Epic, Legendary |

## 5.2 Family Variety Rule

Avoid offering 3 challenges from the same family.

Bad:

```text
Triple Match
Perfect Five
Perfect Storm
```

Better:

```text
Triple Match
Royal Majority
Exact Triple
```

---

# 6. Challenge Families

Challenges belong to one or more families.

| Family | Meaning | Synergizes With |
|---|---|---|
| Match | Coins must match each other | Heavy Coin, Echo Coin, Blank Coin |
| Majority | One side must dominate | Crown Coin, Anchor Coin, Twin Coin |
| Prediction | Player calls results before flipping | Lucky Coin, Fate Coin |
| Streak | Results must repeat or succeed in sequence | Heavy Coin, Echo Coin, Safe Coin |
| Pattern | Slot order or pattern matters | Switch Coin, Rebel Coin, Mirror Coin |
| Risk | High multiplier, high penalty | Gold Coin, Cracked Coin, Doom Coin, Safe Coin |

---

# 7. Always-Ordered Coin Placement

All challenges use **ordered coin slots**.

Even if the challenge’s success condition does not care about order, the player still places coins into numbered slots.

## 7.1 Rule

```text
Every challenge has numbered coin slots.
The player fills all required slots before any coin is flipped.
Coins are resolved from left to right.
Challenge success may or may not care about slot order.
Coin effects may care about slot order.
```

## 7.2 Why This Rule Exists

Some challenges are position-insensitive, but some coins care about adjacency or placement.

Example:

```text
Challenge: Pair Match
Slots: 2
Success: Both final results must match.

Slot 1: Standard Coin
Slot 2: Copy Coin
```

If Copy Coin copies the result of the coin to its left, then order matters because of the coin, even though Pair Match is a simple matching challenge.

---

# 8. Position-Sensitive vs Position-Insensitive Challenges

Since all challenges have ordered slots, the better distinction is:

| Type | Meaning |
|---|---|
| Position-insensitive | The challenge checks totals, counts, or whether results match. Slot order does not matter to the challenge rule. |
| Position-sensitive | The challenge checks sequence, adjacency, exact positions, or mirrored positions. |

## 8.1 Position-Insensitive Examples

| Challenge | Why |
|---|---|
| Pair Match | Only checks whether 2 results match |
| Simple Majority | Only counts chosen-side results |
| No Lonely Coin | Only checks whether at least 2 results match |
| Triple Match | Only checks whether all results match |
| Strong Majority | Only counts chosen-side results |
| Royal Majority | Only counts chosen-side results |
| Perfect Five | Only checks whether all results match |
| Dominion | Only counts chosen-side results |
| Perfect Storm | Only checks whether all results match |

## 8.2 Position-Sensitive Examples

| Challenge | Why |
|---|---|
| Double Call | Player predicts flip 1 and flip 2 exactly |
| Repeat Chain | Each result must match the previous result |
| Mirror Match | Coin 1 compares to coin 4, coin 2 compares to coin 3 |
| Exact Triple | Player predicts exact 3-slot sequence |
| Alternator | Results must alternate by slot |
| Exact Quad | Player predicts exact 4-slot sequence |
| No Breaks | Requires sequential predictions |
| Prophecy | Player predicts exact 5-slot sequence |
| Royal Flush | Results must alternate perfectly |
| Last Stand | Can be position-sensitive if the version uses sequence rules |

---

# 9. Coin System Overview

The coin system adds long-term build strategy.

Core rule:

> **Coins shape the challenge before it happens. Power-ups create tactical exceptions during or after the challenge.**

## 9.1 Coins Affect

- Odds
- Counting rules
- Slot adjacency
- Risk
- Streak multiplier bonuses
- Challenge compatibility

## 9.2 Power-Ups Affect

- Rerolls
- Conversions
- Shields
- Peeking
- Failure protection
- Reward manipulation

## 9.3 Coins Should Not Usually

- Reroll after seeing results
- Convert a result after seeing all flips
- Prevent failure completely as a one-time item

Those effects belong mostly to power-ups.

---

# 10. Unlimited Standard Coins

The player has unlimited **Standard Coins**.

## 10.1 Rule

```text
The player has unlimited Standard Coins.
Standard Coins are always valid.
Standard Coins do not count against coin bag size.
Standard Coins cannot be purchased.
Standard Coins cannot be sold.
Standard Coins cannot be upgraded.
Standard Coins have no special effect.
Standard Coins are used to fill slots not occupied by special coins.
```

## 10.2 Why

Unlimited Standard Coins prevent soft-locks.

Example:

```text
Challenge requires 5 coins.
Player owns only 2 special coins.

Player may use:
[Special Coin] [Special Coin] [Standard] [Standard] [Standard]
```

The player can always attempt any challenge.

---

# 11. Special Coin Bag

Only **special coins** are tracked in the coin bag.

Example:

```text
Special Coin Bag:
[Heavy Coin]
[Switch Coin]
[Gold Coin]
[Crown Coin]
[Safe Coin]
```

Standard Coins are not shown as inventory items unless needed for UI clarity.

## 11.1 Recommended Coin Bag Limit

```text
Maximum Special Coin Bag Size: 8
```

If the player buys a special coin while at the limit, they must:

```text
Replace an existing special coin
or
Skip the purchase
```

## 11.2 Duplicate Rule

Recommended:

```text
The player may own up to 2 copies of the same special coin.
Standard Coins are unlimited.
```

This prevents overly degenerate builds while still allowing specialization.

---

# 12. Coin Selection Rules

## 12.1 Required Coin Slots

Each challenge specifies how many coin slots must be filled.

Example:

```text
Triple Match
Required Coin Slots: 3
```

The player fills all slots using:

- Special coins from their coin bag
- Unlimited Standard Coins

## 12.2 Lock-In Rule

All coins are selected and placed before any flipping happens.

```text
Once the first coin flips, coin placement is locked.
```

## 12.3 Left-To-Right Resolution

Coins resolve from left to right unless a challenge says otherwise.

```text
Slot 1 flips first.
Slot 2 flips second.
Slot 3 flips third.
...
```

This makes adjacency-based coins easy to understand.

---

# 13. Coin Compatibility

Coins should only be blocked if their effect cannot be evaluated by the challenge.

## 13.1 Valid But Suboptimal

Bad-but-valid choices should be allowed.

Example:

```text
Heavy Coin in Alternator
```

Heavy Coin tends to repeat, while Alternator wants alternating results. This is a poor choice, but the coin still works.

## 13.2 Invalid

A coin is invalid only if its rule cannot function.

Example:

```text
Mirror Coin in a 2-slot non-mirrored challenge
```

If there is no mirrored position to compare against, the coin cannot be evaluated.

## 13.3 UI States

Recommended UI labels:

```text
Recommended
Valid
Invalid
```

Example:

```text
Challenge: Royal Majority

Recommended:
- Crown Coin
- Anchor Coin
- Lucky Coin

Valid:
- Heavy Coin
- Switch Coin
- Gold Coin
- Cracked Coin
- Standard Coin

Invalid:
- Mirror Coin
```

---

# 14. Shards Currency

Add a run currency called **Shards**.

Shards are used to buy special coins in shops.

```text
Currency Name: Shards
Primary Use: Purchase special coins
Optional Use: Shop rerolls or coin upgrades later
```

Shards are separate from score.

Score measures performance. Shards drive build progression.

---

# 15. Earning Shards

The player earns Shards when completing challenges.

| Completed Challenge Rarity | Shards Earned |
|---|---:|
| Common | 1 |
| Uncommon | 2 |
| Rare | 3 |
| Epic | 5 |
| Legendary | 8 |

Optional future bonuses:

| Bonus Condition | Extra Shards |
|---|---:|
| Complete challenge without using power-ups | +1 |
| Complete 3 challenges in a row | +1 |
| Complete a position-sensitive challenge | +1 |
| Complete a Legendary challenge | +2 |
| Skip power-up reward | +1 |

First prototype recommendation:

```text
Use only the base Shards by challenge rarity.
Add bonuses later if the economy feels too flat.
```

---

# 16. Coin Shop

A coin shop appears every **3 rounds**.

```text
Shop Frequency: Every 3 rounds
```

Example:

```text
After Round 3: Shop
After Round 6: Shop
After Round 9: Shop
After Round 12: Shop
```

The shop sells **special coins only**.

Standard Coins are never sold because the player already has unlimited Standard Coins.

---

# 17. Shop Structure

Each shop offers **3 special coins**.

Example:

```text
Coin Shop

1. Heavy Coin — 3 Shards
2. Crown Coin — 5 Shards
3. Safe Coin — 12 Shards
```

The player may:

```text
Buy any number of offered coins they can afford.
Skip the shop.
Replace an existing special coin if their bag is full.
```

Recommended first prototype:

```text
No shop reroll.
No selling coins.
No upgrades.
```

Add those later only if the shop needs more depth.

---

# 18. Shop Rarity Pools

The shop’s coin rarity pool improves as the run progresses.

| Shop Visit | Appears After | Common | Uncommon | Rare | Epic | Legendary |
|---:|---:|---:|---:|---:|---:|---:|
| 1 | Round 3 | 70% | 30% | 0% | 0% | 0% |
| 2 | Round 6 | 45% | 40% | 15% | 0% | 0% |
| 3 | Round 9 | 25% | 40% | 25% | 10% | 0% |
| 4 | Round 12 | 10% | 30% | 35% | 23% | 2% |
| 5+ | Round 15+ | 5% | 20% | 35% | 30% | 10% |

Each shop slot rolls independently.

---

# 19. Coin Pricing

Recommended base prices:

| Coin Rarity | Price |
|---|---:|
| Common | 3 Shards |
| Uncommon | 5 Shards |
| Rare | 8 Shards |
| Epic | 12 Shards |
| Legendary | 18 Shards |

Optional modifiers for later:

| Modifier | Price Change |
|---|---:|
| Broadly useful | +2 |
| Very narrow synergy | -1 |
| Safety coin | +1 |
| Volatile coin | -1 |
| Greed coin | +1 |

First prototype recommendation:

```text
Use fixed prices by rarity.
```

---

# 20. Shop Synergy Rule

The shop should not be fully random.

Recommended generation:

```text
Shop Slot 1:
Random coin from current shop rarity pool.

Shop Slot 2:
Random coin from current shop rarity pool.

Shop Slot 3:
Synergy coin based on challenge families seen recently.
```

Example:

If recent challenges were mostly Majority challenges, Slot 3 prefers:

```text
Crown Coin
Anchor Coin
Lucky Coin
Twin Coin
Fate Coin
```

If recent challenges were mostly Pattern challenges, Slot 3 prefers:

```text
Switch Coin
Rebel Coin
Mirror Coin
Safe Coin
```

This makes shops feel useful without making them predictable.

---

# 21. Power-Up System

The player has exactly **3 equipped power-up slots**.

```text
[Power Slot 1] [Power Slot 2] [Power Slot 3]
```

Power-ups can be:

## 21.1 Consumable

Used once, then removed.

```text
Small Shield
Prevents one failed challenge from breaking your streak.
Then breaks.
```

## 21.2 Passive

Stays equipped until replaced.

```text
Heads Specialist
Heads-based challenges gain +0.2 extra streak multiplier on success.
```

## 21.3 Charged

Has limited uses, then breaks.

```text
Reroll Charm
2 charges.
Spend 1 charge to reroll one coin.
Breaks at 0 charges.
```

## 21.4 Power-Up Slot Rule

When a power-up is consumed, its slot becomes empty.

Example:

```text
Before:
[Shield] [Reroll] [Coin Convert]

Shield activates.

After:
[Empty] [Reroll] [Coin Convert]
```

---

# 22. Power-Up Reward Pool

After completing a challenge, the player is offered **3 power-ups**.

Power-up rarity is based on completed challenge rarity.

| Completed Challenge | Common Power | Uncommon Power | Rare Power | Epic Power | Legendary Power |
|---|---:|---:|---:|---:|---:|
| Common | 75% | 25% | 0% | 0% | 0% |
| Uncommon | 45% | 45% | 10% | 0% | 0% |
| Rare | 20% | 45% | 30% | 5% | 0% |
| Epic | 5% | 25% | 45% | 24% | 1% |
| Legendary | 0% | 10% | 35% | 40% | 15% |

Recommended generation:

```text
Power Slot 1:
Roll from rarity table.

Power Slot 2:
Roll from rarity table.

Power Slot 3:
Roll from a synergy pool matching the completed challenge family.
```

---

# 23. Core Challenge List

## 23.1 Common Challenges

### Pair Match

```text
Rarity: Common
Family: Match
Position Type: Position-insensitive
Required Coin Slots: 2
Requirement: Both final results must match.
Success Examples: HH, TT
Failure Examples: HT, TH
Streak Multiplier Gain: +0.4
```

Synergistic coins:

```text
Heavy Coin
Echo Coin
Gold Coin
Blank Coin
```

---

### Call One

```text
Rarity: Common
Family: Prediction
Position Type: Position-sensitive only because the prediction maps to slot 1
Required Coin Slots: 1
Requirement: Predict Heads or Tails, then flip 1 coin.
Streak Multiplier Gain: +0.3
```

Synergistic coins:

```text
Lucky Coin
Fate Coin
Gold Coin
```

---

### Simple Majority

```text
Rarity: Common
Family: Majority
Position Type: Position-insensitive
Required Coin Slots: 3
Requirement: Get at least 2 of the chosen side.
Streak Multiplier Gain: +0.5
```

Synergistic coins:

```text
Crown Coin
Anchor Coin
Lucky Coin
Twin Coin
```

---

### No Lonely Coin

```text
Rarity: Common
Family: Match
Position Type: Position-insensitive
Required Coin Slots: 3
Requirement: At least 2 final results must match.
Streak Multiplier Gain: +0.3
```

Synergistic coins:

```text
Heavy Coin
Gold Coin
Blank Coin
```

---

## 23.2 Uncommon Challenges

### Triple Match

```text
Rarity: Uncommon
Family: Match
Position Type: Position-insensitive
Required Coin Slots: 3
Requirement: All final results must match.
Success Examples: HHH, TTT
Streak Multiplier Gain: +0.8
```

Synergistic coins:

```text
Heavy Coin
Echo Coin
Blank Coin
Twin Coin
```

---

### Double Call

```text
Rarity: Uncommon
Family: Prediction
Position Type: Position-sensitive
Required Coin Slots: 2
Requirement: Predict slot 1 and slot 2 exactly.
Example Prediction: H then T
Streak Multiplier Gain: +0.9
```

Synergistic coins:

```text
Lucky Coin
Fate Coin
Gold Coin
Safe Coin
```

---

### Strong Majority

```text
Rarity: Uncommon
Family: Majority
Position Type: Position-insensitive
Required Coin Slots: 5
Requirement: Get at least 3 of the chosen side.
Streak Multiplier Gain: +0.7
```

Synergistic coins:

```text
Crown Coin
Anchor Coin
Lucky Coin
Twin Coin
```

---

### Repeat Chain

```text
Rarity: Uncommon
Family: Streak / Match
Position Type: Position-sensitive
Required Coin Slots: 3
Requirement: Each result must match the previous result.
Success Examples: HHH, TTT
Streak Multiplier Gain: +0.9
```

Synergistic coins:

```text
Heavy Coin
Echo Coin
Safe Coin
```

---

## 23.3 Rare Challenges

### Royal Majority

```text
Rarity: Rare
Family: Majority
Position Type: Position-insensitive
Required Coin Slots: 5
Requirement: Get at least 4 of the chosen side.
Streak Multiplier Gain: +1.3
```

Synergistic coins:

```text
Crown Coin
Anchor Coin
Lucky Coin
Twin Coin
Fate Coin
```

---

### Mirror Match

```text
Rarity: Rare
Family: Pattern / Match
Position Type: Position-sensitive
Required Coin Slots: 4
Requirement: Slot 1 must match slot 4, and slot 2 must match slot 3.
Success Examples: HTTH, THHT, HHHH, TTTT
Streak Multiplier Gain: +1.2
```

Synergistic coins:

```text
Mirror Coin
Echo Coin
Blank Coin
Safe Coin
```

---

### Exact Triple

```text
Rarity: Rare
Family: Prediction
Position Type: Position-sensitive
Required Coin Slots: 3
Requirement: Predict the exact 3-slot sequence.
Streak Multiplier Gain: +1.5
```

Synergistic coins:

```text
Lucky Coin
Fate Coin
Safe Coin
Gold Coin
```

---

### Alternator

```text
Rarity: Rare
Family: Pattern
Position Type: Position-sensitive
Required Coin Slots: 4
Requirement: Results must alternate.
Success Examples: HTHT, THTH
Streak Multiplier Gain: +1.4
```

Synergistic coins:

```text
Switch Coin
Rebel Coin
Safe Coin
```

---

## 23.4 Epic Challenges

### Perfect Five

```text
Rarity: Epic
Family: Match
Position Type: Position-insensitive
Required Coin Slots: 5
Requirement: All final results must match.
Success Examples: HHHHH, TTTTT
Streak Multiplier Gain: +2.3
```

Synergistic coins:

```text
Heavy Coin
Echo Coin
Blank Coin
Twin Coin
Safe Coin
```

---

### Exact Quad

```text
Rarity: Epic
Family: Prediction
Position Type: Position-sensitive
Required Coin Slots: 4
Requirement: Predict the exact 4-slot sequence.
Streak Multiplier Gain: +2.5
```

Synergistic coins:

```text
Lucky Coin
Fate Coin
Safe Coin
Gold Coin
```

---

### Dominion

```text
Rarity: Epic
Family: Majority
Position Type: Position-insensitive
Required Coin Slots: 7
Requirement: Get at least 6 of the chosen side.
Streak Multiplier Gain: +2.2
```

Synergistic coins:

```text
Crown Coin
Anchor Coin
Twin Coin
Fate Coin
Safe Coin
```

---

### No Breaks

```text
Rarity: Epic
Family: Streak / Prediction
Position Type: Position-sensitive
Required Coin Slots: 3
Requirement: Complete 3 single-slot predictions in a row.
Streak Multiplier Gain: +2.0
```

Synergistic coins:

```text
Lucky Coin
Fate Coin
Safe Coin
Gold Coin
```

---

## 23.5 Legendary Challenges

### Perfect Storm

```text
Rarity: Legendary
Family: Match / Risk
Position Type: Position-insensitive
Required Coin Slots: 6
Requirement: All final results must match.
Success Examples: HHHHHH, TTTTTT
Streak Multiplier Gain: +3.5
```

Synergistic coins:

```text
Heavy Coin
Echo Coin
Blank Coin
Twin Coin
Safe Coin
Doom Coin
```

---

### Prophecy

```text
Rarity: Legendary
Family: Prediction / Pattern
Position Type: Position-sensitive
Required Coin Slots: 5
Requirement: Predict the exact 5-slot sequence.
Streak Multiplier Gain: +4.0
```

Synergistic coins:

```text
Lucky Coin
Fate Coin
Safe Coin
Gold Coin
```

---

### Royal Flush

```text
Rarity: Legendary
Family: Pattern
Position Type: Position-sensitive
Required Coin Slots: 5
Requirement: Results must alternate perfectly.
Success Examples: HTHTH, THTHT
Streak Multiplier Gain: +3.6
```

Synergistic coins:

```text
Switch Coin
Rebel Coin
Safe Coin
```

---

### Last Stand

```text
Rarity: Legendary
Family: Risk
Position Type: Position-insensitive by default
Required Coin Slots: 4
Requirement: All final results must match.
Special Rule: Reroll power-ups are disabled.
Streak Multiplier Gain: +3.2
```

Synergistic coins:

```text
Safe Coin
Gold Coin
Cracked Coin
Doom Coin
Heavy Coin
```

---

# 24. Core Special Coin Set

This set is designed to synergize with the challenge list.

---

## 24.1 Heavy Coin

```text
Rarity: Common
Family: Match / Streak
Valid In: All challenges
Timing: Before Flip

Effect:
First time this coin is flipped in a run: 50% Heads / 50% Tails.
After that, it has a 65% chance to repeat its own previous result.
```

Good for:

```text
Triple Match
Repeat Chain
Perfect Five
Perfect Storm
```

Bad for:

```text
Alternator
Royal Flush
```

---

## 24.2 Switch Coin

```text
Rarity: Common
Family: Alternating / Pattern
Valid In: All challenges
Timing: Before Flip

Effect:
First time this coin is flipped in a run: 50% Heads / 50% Tails.
After that, it has a 65% chance to land opposite of its own previous result.
```

Good for:

```text
Alternator
Royal Flush
Pattern challenges
```

Bad for:

```text
Triple Match
Perfect Five
Perfect Storm
```

---

## 24.3 Gold Coin

```text
Rarity: Uncommon
Family: Greed
Valid In: All challenges
Timing: On Success
Odds: 50% Heads / 50% Tails

Effect:
If the challenge succeeds while this coin was used, gain +0.2 additional streak multiplier.
```

Good for:

```text
Safe challenges
Long streak builds
Low-risk farming
```

Bad for:

```text
Hard challenges where consistency matters more than upside
```

---

## 24.4 Cracked Coin

```text
Rarity: Uncommon
Family: Greed / Volatile / Risk
Valid In: All challenges
Timing: On Success / On Failure
Odds: 50% Heads / 50% Tails

Effect:
If the challenge succeeds, gain +0.4 additional streak multiplier.
If the challenge fails, your streak multiplier resets to x0.5 instead of x1.0.
```

Good for:

```text
Shield builds
Streak Guard builds
High-confidence challenges
```

Bad for:

```text
Unprotected risky challenges
```

---

## 24.5 Crown Coin

```text
Rarity: Uncommon
Family: Majority
Valid In: All challenges
Timing: Before Flip / On Result
Odds: 60% Heads / 40% Tails

Effect:
In Majority challenges, this coin counts as 2 Heads if it lands Heads.
```

Good for:

```text
Simple Majority
Strong Majority
Royal Majority
Dominion
Heads Specialist builds
```

Bad for:

```text
Tails-focused challenges
Exact prediction challenges
```

---

## 24.6 Anchor Coin

```text
Rarity: Uncommon
Family: Majority
Valid In: All challenges
Timing: Before Flip / On Result
Odds: 40% Heads / 60% Tails

Effect:
In Majority challenges, this coin counts as 2 Tails if it lands Tails.
```

Good for:

```text
Simple Majority
Strong Majority
Royal Majority
Dominion
Tails Specialist builds
```

Bad for:

```text
Heads-focused challenges
Exact prediction challenges
```

---

## 24.7 Echo Coin

```text
Rarity: Rare
Family: Match / Streak / Adjacency
Valid In: All challenges
Timing: Before Flip

Effect:
When flipped after another coin, Echo Coin has a 70% chance to match the result of the coin immediately to its left.

If placed in slot 1, it behaves as a Standard Coin.
```

Good for:

```text
Pair Match
Triple Match
Repeat Chain
Perfect Five
Perfect Storm
```

Bad for:

```text
Alternator
Royal Flush
```

---

## 24.8 Rebel Coin

```text
Rarity: Rare
Family: Alternating / Pattern / Adjacency
Valid In: All challenges
Timing: Before Flip

Effect:
When flipped after another coin, Rebel Coin has a 70% chance to land opposite of the coin immediately to its left.

If placed in slot 1, it behaves as a Standard Coin.
```

Good for:

```text
Alternator
Royal Flush
Pattern challenges
```

Bad for:

```text
Repeat Chain
Triple Match
Perfect Five
```

---

## 24.9 Mirror Coin

```text
Rarity: Rare
Family: Pattern / Mirrored Position
Valid In: Challenges with 4 or more slots
Timing: On Result

Effect:
This coin compares itself to the coin in the mirrored slot.

In a 4-slot challenge:
Slot 1 mirrors Slot 4.
Slot 2 mirrors Slot 3.

In a 5-slot challenge:
Slot 1 mirrors Slot 5.
Slot 2 mirrors Slot 4.
Slot 3 has no mirror.

If a challenge has a mirror-based success rule, Mirror Coin gains its bonus effect.
```

Recommended prototype effect:

```text
In Mirror Match challenges, if Mirror Coin fails to match its mirrored partner, it may be treated as neutral once per challenge.
```

Good for:

```text
Mirror Match
Future mirrored pattern challenges
```

Bad for:

```text
Majority
Simple Match
Prediction
```

Design note:

```text
Mirror Coin is intentionally narrow. It should be strong in mirror challenges and mediocre elsewhere.
```

---

## 24.10 Lucky Coin

```text
Rarity: Rare
Family: Prediction / Majority
Valid In: Challenges where the player declares Heads or Tails before flipping
Timing: Before Flip

Effect:
Before the challenge, declare Heads or Tails.
Lucky Coin has a 65% chance to land on the declared side.
```

Good for:

```text
Call One
Double Call
Exact Triple
Exact Quad
Royal Majority
Dominion
```

Bad for:

```text
Challenges with no declared target
Mirror Match
No Lonely Coin
```

---

## 24.11 Blank Coin

```text
Rarity: Rare
Family: Safety / Match
Valid In: Match and Pattern challenges
Timing: On Result
Odds: 50% Heads / 50% Tails

Effect:
If this coin would be the only coin causing a Match challenge to fail, it is ignored for the success check.

If ignoring it would not create success, it counts normally.
```

Example:

```text
Challenge: Perfect Five
Result: H H H H T
The T is the Blank Coin.

Blank Coin is ignored.
Remaining counted coins are H H H H.
Challenge succeeds.
```

Good for:

```text
Triple Match
Perfect Five
Perfect Storm
Mirror Match
```

Bad for:

```text
Majority
Prediction
```

---

## 24.12 Safe Coin

```text
Rarity: Epic
Family: Safety
Valid In: All challenges
Timing: On Failure
Odds: 50% Heads / 50% Tails

Effect:
If the challenge fails while Safe Coin was used, reduce streak loss.

Instead of resetting to x1.0, the current streak multiplier is reduced by 50%.

Example:
Current Streak Multiplier: x4.0
Failure with Safe Coin: drops to x2.0
```

Important distinction:

```text
Safe Coin softens failure.
Shield power-ups prevent failure penalties entirely.
```

Good for:

```text
Risk challenges
Legendary challenges
Crown of Greed builds
```

---

## 24.13 Twin Coin

```text
Rarity: Epic
Family: Match / Majority
Valid In: Match and Majority challenges
Timing: On Result
Odds: 50% Heads / 50% Tails

Effect:
This coin produces two identical results.

Heads becomes HH.
Tails becomes TT.

Both results count for Majority challenges.
For Match challenges, both linked results are considered together.
```

Good for:

```text
Strong Majority
Royal Majority
Dominion
Triple Match
Perfect Five
```

Bad for:

```text
Exact Prediction
Alternator
Royal Flush
```

---

## 24.14 Doom Coin

```text
Rarity: Epic
Family: Volatile / Risk / Greed
Valid In: All challenges
Timing: On Success / On Failure
Odds: 50% Heads / 50% Tails

Effect:
If the challenge succeeds, gain +0.8 additional streak multiplier.
If the challenge fails, the current streak multiplier resets to x0.
```

Good for:

```text
Iron Shield builds
Streak Guard builds
High-confidence challenges
Legendary challenge chasing
```

Bad for:

```text
Unprotected risky attempts
```

---

## 24.15 Fate Coin

```text
Rarity: Legendary
Family: Prediction / Majority / Greed
Valid In: Challenges where the player declares Heads or Tails
Timing: Before Flip / On Success

Effect:
Before flipping, declare Heads or Tails.
Fate Coin has a 70% chance to land on the declared side.

If the challenge succeeds and Fate Coin lands on the declared side, gain +0.5 additional streak multiplier.
```

Good for:

```text
Prediction challenges
Majority challenges
Heads/Tails Specialist builds
```

Bad for:

```text
Challenges without declared sides
```

---

# 25. Recommended Prototype Coin Set

Start with 10 coins:

```text
Heavy Coin
Switch Coin
Gold Coin
Cracked Coin
Crown Coin
Anchor Coin
Echo Coin
Rebel Coin
Lucky Coin
Safe Coin
```

This covers:

```text
Match
Streak
Alternating
Pattern
Majority
Prediction
Greed
Safety
Risk
Adjacency
```

Add later:

```text
Blank Coin
Twin Coin
Doom Coin
Fate Coin
Mirror Coin
```

---

# 26. Challenge-to-Coin Synergy Map

| Challenge | Family | Best Coins |
|---|---|---|
| Pair Match | Match | Heavy Coin, Echo Coin, Gold Coin, Blank Coin |
| Call One | Prediction | Lucky Coin, Fate Coin, Gold Coin |
| Simple Majority | Majority | Crown Coin, Anchor Coin, Lucky Coin, Twin Coin |
| No Lonely Coin | Match | Heavy Coin, Gold Coin, Blank Coin |
| Triple Match | Match | Heavy Coin, Echo Coin, Blank Coin, Twin Coin |
| Double Call | Prediction | Lucky Coin, Fate Coin, Gold Coin, Safe Coin |
| Strong Majority | Majority | Crown Coin, Anchor Coin, Twin Coin, Lucky Coin |
| Repeat Chain | Streak / Match | Heavy Coin, Echo Coin, Safe Coin |
| Royal Majority | Majority | Crown Coin, Anchor Coin, Lucky Coin, Twin Coin, Fate Coin |
| Mirror Match | Pattern / Match | Mirror Coin, Echo Coin, Blank Coin, Safe Coin |
| Exact Triple | Prediction | Lucky Coin, Fate Coin, Safe Coin, Gold Coin |
| Alternator | Pattern | Switch Coin, Rebel Coin, Safe Coin |
| Perfect Five | Match | Heavy Coin, Echo Coin, Blank Coin, Twin Coin, Safe Coin |
| Exact Quad | Prediction | Lucky Coin, Fate Coin, Safe Coin, Gold Coin |
| Dominion | Majority | Crown Coin, Anchor Coin, Twin Coin, Fate Coin, Safe Coin |
| No Breaks | Streak / Prediction | Lucky Coin, Fate Coin, Safe Coin, Gold Coin |
| Perfect Storm | Match / Risk | Heavy Coin, Echo Coin, Blank Coin, Twin Coin, Safe Coin, Doom Coin |
| Prophecy | Prediction / Pattern | Lucky Coin, Fate Coin, Safe Coin, Gold Coin |
| Royal Flush | Pattern | Switch Coin, Rebel Coin, Safe Coin |
| Last Stand | Risk | Safe Coin, Gold Coin, Cracked Coin, Doom Coin, Heavy Coin |

---

# 27. Effect Resolution Order

Use this order to avoid ambiguity.

```text
1. Player chooses challenge.
2. Player places coins in ordered slots.
3. Player locks placement.
4. Apply pre-flip coin effects.
5. Flip coins left-to-right.
6. Apply on-result coin effects.
7. Player may use valid power-ups.
8. Re-check challenge success.
9. Apply success or failure effects.
10. Award Shards and power-up reward if successful.
```

## 27.1 Coin Effects Before Power-Ups

Coin counting rules apply before power-ups.

Example:

```text
Crown Coin lands Heads.
It counts as 2 Heads in Majority challenges.

Then the player decides whether to use Coin Convert on another coin.
```

## 27.2 Power-Ups Can Modify Coin Results

Unless a challenge forbids it, power-ups may modify coin results.

Example:

```text
Coin Convert changes Crown Coin from Tails to Heads.
Crown Coin now counts as 2 Heads.
```

## 27.3 Challenge Rules Override Coins and Power-Ups

Example:

```text
Last Stand disables rerolls.
Reroll powers cannot be used.
```

---

# 28. Failure Modifier Stacking

Multiple failure effects can conflict.

Recommended rule:

```text
Protective effects resolve after volatile penalties.
```

Example:

```text
Current Streak Multiplier: x5.0
Challenge fails.
Cracked Coin says reset to x0.5.
Safe Coin says reduce current streak by 50%.

Safe Coin resolves last.
Final Streak Multiplier: x2.5
```

Reason:

```text
Defensive builds should feel coherent and useful.
```

Alternative harder rule:

```text
Volatile penalties override protection unless a Shield power-up is used.
```

Use the harder rule only if greed builds are too safe.

---

# 29. Success Multiplier Stacking

Success bonuses stack additively.

Example:

```text
Challenge Multiplier Gain: +1.3
Gold Coin Bonus: +0.2
Cracked Coin Bonus: +0.4
Heads Specialist Bonus: +0.2

Total Gain: +2.1
```

---

# 30. Full Round Example

Current state:

```text
Round: 7
Current Streak Multiplier: x3.1
Shards: 4

Special Coin Bag:
[Heavy Coin]
[Crown Coin]
[Gold Coin]

Unlimited:
[Standard Coins]

Equipped Power-Ups:
[Coin Convert]
[Streak Guard]
[Heads Specialist]
```

Challenge offer:

```text
1. Pair Match
   Rarity: Common
   Family: Match
   Required Slots: 2
   Streak Multiplier Gain: +0.4

2. Royal Majority
   Rarity: Rare
   Family: Majority
   Required Slots: 5
   Streak Multiplier Gain: +1.3

3. Exact Triple
   Rarity: Rare
   Family: Prediction
   Required Slots: 3
   Streak Multiplier Gain: +1.5
```

Player chooses:

```text
Royal Majority
Target: Heads
```

Player places coins:

```text
Slot 1: Standard Coin
Slot 2: Standard Coin
Slot 3: Heavy Coin
Slot 4: Crown Coin
Slot 5: Gold Coin
```

Coins are locked.

Flip result:

```text
Slot 1: Standard Coin = H
Slot 2: Standard Coin = T
Slot 3: Heavy Coin = H
Slot 4: Crown Coin = H
Slot 5: Gold Coin = T
```

Royal Majority needs at least 4 Heads.

Counting:

```text
Standard H = 1 Head
Standard T = 0 Heads
Heavy H = 1 Head
Crown H = 2 Heads
Gold T = 0 Heads

Total Heads Count = 4
```

Challenge succeeds.

Multiplier gain:

```text
Royal Majority: +1.3
Heads Specialist: +0.2
Gold Coin: +0.2

Total Gain: +1.7
```

New streak multiplier:

```text
x3.1 + x1.7 = x4.8
```

Shard reward:

```text
Rare challenge completed = +3 Shards
```

New Shards:

```text
4 + 3 = 7 Shards
```

Then the player receives the normal end-of-round power-up reward.

---

# 31. Shop Example

After Round 6, the shop appears.

Current state:

```text
Shards: 9

Special Coin Bag:
[Heavy Coin]
[Gold Coin]
[Crown Coin]
```

Shop:

```text
1. Switch Coin
   Rarity: Common
   Price: 3 Shards
   Effect: Tends to land opposite of its own previous result.

2. Anchor Coin
   Rarity: Uncommon
   Price: 5 Shards
   Effect: 60% Tails. Counts as 2 Tails in Majority challenges.

3. Safe Coin
   Rarity: Epic
   Price: 12 Shards
   Effect: Failure reduces streak by 50% instead of resetting.
```

Player can afford:

```text
Switch Coin
Anchor Coin
Switch Coin + Anchor Coin
```

Player cannot afford Safe Coin.

If the player buys Switch Coin and Anchor Coin:

```text
New Shards: 1

Special Coin Bag:
[Heavy Coin]
[Gold Coin]
[Crown Coin]
[Switch Coin]
[Anchor Coin]
```

---

# 32. Balance Notes

## 32.1 Keep Standard Coins Relevant

Standard Coins should remain useful because they are:

- Always valid
- No downside
- Predictable baseline
- Compatible with every challenge and power-up

Special coins should be situational, not strict upgrades.

## 32.2 Greed Coins Should Not Improve Odds

Gold Coin, Cracked Coin, and Doom Coin should increase reward, not success chance.

This keeps them distinct from control coins.

## 32.3 Safety Coins Should Not Grant Success

Safe Coin reduces loss, but does not turn failure into success.

That keeps it distinct from Shield power-ups and result-changing powers.

## 32.4 Adjacency Coins Need Ordered Slots

Echo Coin and Rebel Coin become interesting because every challenge uses ordered placement.

Even position-insensitive challenges can create coin-order decisions.

## 32.5 Avoid Automatic Choices

If one coin is always best, add one of these:

```text
Increase price.
Reduce odds.
Add a drawback.
Make its effect family-specific.
Reduce duplicate limit.
```

---

# 33. Recommended Implementation Phases

## Phase 1 — Basic Coin Bag and Shop

Implement:

```text
Unlimited Standard Coins
Special coin bag
Coin placement into ordered slots
Shards
Shop every 3 rounds
Shop offers 3 coins
```

Coins:

```text
Heavy Coin
Switch Coin
Gold Coin
Crown Coin
Anchor Coin
```

## Phase 2 — Risk and Safety

Add:

```text
Cracked Coin
Safe Coin
Doom Coin
```

Systems:

```text
Failure modifiers
Success multiplier stacking
Shop rarity scaling
```

## Phase 3 — Adjacency and Pattern Coins

Add:

```text
Echo Coin
Rebel Coin
Mirror Coin
```

Systems:

```text
Left-neighbor effects
Mirrored slot effects
Position-sensitive challenge support
```

## Phase 4 — Advanced Build Coins

Add:

```text
Lucky Coin
Blank Coin
Twin Coin
Fate Coin
```

Systems:

```text
Declared-side coins
Counting exceptions
Multi-result coins
Legendary shop pool
```

---

# 34. Clean Rule Summary

```text
Each round offers 3 challenges.

The player chooses 1 challenge.

Each challenge has numbered coin slots.

The player fills every slot before any coin flips.

The player has unlimited Standard Coins.

Standard Coins do not count against the coin bag.

The player owns a limited bag of special coins.

Special coins are purchased using Shards.

Shards are earned by completing challenges.

Every 3 rounds, a shop offers 3 special coins.

Coins are flipped left-to-right.

Challenge success may be position-sensitive or position-insensitive.

Coin effects may care about position even when the challenge does not.

Power-ups remain separate from coins.

Coins shape the challenge before the flip.

Power-ups create tactical exceptions during or after the flip.
```

---

# 35. Design North Star

The coin system works when the player thinks:

> “This challenge is hard, but my coin bag is built for it.”

The power-up system works when the player thinks:

> “This result is bad, but I have one tactical tool that can save it.”

Together:

```text
Coins = build strategy before the flip
Power-ups = tactical decisions around the flip
Challenges = pressure tests for the current build
```
