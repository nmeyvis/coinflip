# Flipbreakers — UI Design Spec

## 1. UI Direction

The game UI should feel like a **game board / arcade roguelite interface**, not a website or dashboard. Every panel reads as a tactile object — coins are chips, slots are sockets, the board has weight. The flow is: pick → place → flip → resolve → reward (or game over).

The single most important rhythm: **a failed challenge ends the run** and presents the player with a Game Over dialog. There is no streak meter to defend, no protection chain. The player either succeeds and moves on, or fails and starts over.

---

## 2. Main Screen Layout

### 2.1 Screen Regions
Top-to-bottom, single column on desktop:

1. **Top HUD** — round, shards, "next shop" pip indicator, restart button.
2. **Challenge Header** — active challenge name, family, description, target/prediction picker if applicable.
3. **Board** — slot row, optional banner (success only), splash burst (success), Primary action button.
4. **Bottom Tray** — Coin Bag column + Power-Ups column.
5. **Modals** (overlay): Challenge Picker, Power-Up Reward, Coin Shop, Game Over.

---

## 3. Top HUD

### 3.1 Cells
Three info cells + a restart button:
- **Round** — current round number.
- **Shards** — current shard balance (◆ icon + integer).
- **Next Shop** — three pips, lit as you progress through the current 3-round cycle.
- **Restart** — circular ⟲ button. Confirms before discarding the run.

### 3.2 Visual
Dark panel with subtle inner shadow; cells separated visually by spacing rather than dividers. Numbers use tabular-nums.

---

## 4. Challenge Header

### 4.1 Required Fields
- Challenge name + rarity badge.
- Family tags (e.g. "majority").
- Description text.
- Slot count + Filled count (e.g. "Filled 3 / 5").

### 4.2 Target Selection
For Majority-style challenges: two buttons (Heads / Tails) toggle the target. Selected button shows the corresponding face.

### 4.3 Prediction Selection
For Prediction-style challenges: one toggle button per slot, each cycling H ↔ T.

---

## 5. Board

### 5.1 Slot Row
N empty sockets matching `challenge.slots`. Each socket displays its index. Empty sockets show a dashed border and an `◯` placeholder.

### 5.2 States
- **Empty** — dashed border, dim text.
- **Placed** — coin glyph + name; clickable to remove during placing.
- **Flipping** — spinning `?` face during reveal.
- **Landed Heads/Tails** — the face shows `H` or `T`.
- **Modified** — a coin altered by Convert/Reroll has a subtle outer ring.

### 5.3 Crown / Anchor Multiplier Badge
When the active challenge is a Majority challenge **and** the slot landed in a way that triggers the doubled count (Crown landed Heads, or Anchor landed Tails), the slot face shows a small `×2` badge in its top-right. This communicates the otherwise-invisible weighting that decides the outcome.

### 5.4 Success Splash
On entering `resolved` with a successful outcome, a particle burst emits from both vertical midpoints of the board. Particles are emerald and gold, fan out in a cone, fade in 0.18s and out by 1.2s. Suppressed under `prefers-reduced-motion`.

### 5.5 Outcome Banner
Only shown on success. Sits above the board. No frame or background of its own — the board itself takes the green border + emerald glow when a success is showing. The banner contents:
- Title: **SUCCESS**
- Reason text (e.g. "4/4 Heads")
- Reward chip: `+N ◆`

### 5.6 Primary Action Button
Below the board. Label / behavior changes by phase:

| Phase | Label | Behavior |
|---|---|---|
| `challenge_picker` | "Choose a Challenge" | disabled |
| `placing` (slots empty) | "Fill Slots (X / Y)" | disabled |
| `placing` (needs target/pred) | "Choose Target" / "Set up challenge" | disabled |
| `placing` (ready) | "Start" | pulses; commits and starts flipping |
| `flipping` | "Flipping…" | disabled |
| `post_flip` | "Resolve" | pulses; computes outcome |
| `resolved` (success) | "Continue" | pulses; advances to reward picker |

Pulsing buttons use a gold-glow border animation (`pulse-glow`).

---

## 6. Coin Tray

### 6.1 Coin Bag Column
- Always shows the Standard Coin chip first (count = ∞).
- Then one chip per owned special coin id, ordered by canonical coin order.
- Each chip displays: rarity color border, coin glyph, coin name, short description, and a count.
- A **★ recommended badge** appears when the coin's families overlap the active challenge's families.
- An **invalid** state dims the chip if the coin cannot be placed (none currently in this prototype).
- Heavy / Switch chips display a **memory badge** in the bottom-right of the glyph: `?` (panel), `H` (gold), `T` (silver) reflecting the per-id memory. Other coins display nothing.

### 6.2 Power-Ups Column
Three slots side-by-side. Each slot:
- **Empty** — `⬡` socket glyph + "Empty".
- **Filled** — power icon + name + kind/charges. Highlights when usable in the current phase. Active mode (Convert / Reroll selected) gets a stronger highlight.

### 6.3 Power Icons
- `⇋` Coin Convert
- `↻` Reroll Charm
- `☘` Lucky Charm
- `⛨` Shield

---

## 7. Flow Details

### 7.1 Placing
- Click a coin in the bag → it appears in the next empty slot.
- Click a placed coin → it returns to the bag.
- Backspace removes the most recently placed coin.

### 7.2 Flipping
- After Start: each slot reveals a result every 320 ms in slot order.
- After the last reveal there's a 520 ms hold, then phase becomes `post_flip`.

### 7.3 Post-Flip
- The board hint reads "Coins landed. Use a power-up or continue."
- Clicking Coin Convert enters Convert Mode → board hint changes; clicking a coin toggles its result and consumes the power.
- Clicking Reroll Charm enters Reroll Mode → clicking a coin re-runs `flipCoin` (with current neighbors), spends a charge, marks the coin modified.
- Pressing Resolve evaluates the challenge.

### 7.4 Resolved (Success Only)
- Outcome banner + splash burst + green-bordered board.
- Continue button advances to Reward Picker.

### 7.5 Shielded Failure
If the player has a Shield equipped when a challenge fails, the Shield is automatically consumed and phase enters `resolved` with a `shielded` outcome instead of `game_over`. The board shows a **SHIELDED** banner in azure tones (no green border, no splash) explaining the save. Continue advances to the next round (with shop check) — no shards, no reward.

### 7.6 Game Over (Failure with no Shield)
Game over is rendered **inline on the board**, mirroring the success flow — no modal. The final coin layout stays visible so the player can see why they lost.
- Banner above the board: **GAME OVER** title (crimson) + reason ("`<eval reason>` — You reached round X.").
- Board frame takes a crimson border + glow (analogue of the green success border).
- The primary action button below the board changes to **Play Again** (pulsing, dispatches `NEW_RUN`). It occupies the same slot as Continue does on success.
- The bottom tray (coin bag, power-ups) remains visible.

---

## 8. Challenge Picker Modal

- Backdrop dims and blurs the board.
- Title: "Choose a Challenge".
- Three challenge cards in a row. Each card:
  - Header: name + rarity badge.
  - Family line.
  - Description.
  - Stats: slot count.
  - Optional warning: "Rerolls disabled" (Last Stand).
- Click a card to commit. No Skip option — choosing is mandatory.

---

## 9. Power-Up Reward Modal

- Title: "Choose a Power-Up" (or "Replace which slot?" in replace mode).
- Three offered power-up cards. Click to take.
- If all 3 power-up slots are full when a card is chosen, the modal switches to replace mode: shows the incoming card up top and the player's three current slots (or empty) as targets.
- Footer: **Skip Reward** (or **Cancel** in replace mode).

---

## 10. Coin Shop Modal

- Title: "Coin Shop", with current shard balance in the header.
- Three coin offers. Each card shows: name + rarity badge, glyph, short description, price (`N ◆`).
- Disabled states: insufficient shards, at max duplicates. Bag-full triggers a replace prompt instead of disabling.
- Footer: **Continue** to leave the shop without buying.

---

## 11. Visual Language

### 11.1 Materials
- Surface palette: deep navy panels (`--bg`, `--panel`, `--panel-2`).
- Frame color `--frame` for borders; subtle inset highlight on raised surfaces.
- Outcome-success accent: `--emerald`. Failure / game-over accent: `--crimson`.

### 11.2 Coin Faces
- Heads: warm gold gradient.
- Tails: cool silver gradient.
- Both faces share the same circular socket size.

### 11.3 Rarity Colors
- common — slate gray
- uncommon — green
- rare — blue
- epic — violet
- legendary — gold

### 11.4 Coin Tints (glyph color in the bag)
- Heavy: warm tan
- Switch: cool blue
- Crown: bright gold
- Anchor: deep blue
- Echo: lavender
- Rebel: pink
- Lucky: mint

---

## 12. Buttons

### 12.1 Primary
Pill-shaped, raised, gold border when in pulse state. The single primary action sits below the board and is the player's main next-step affordance.

### 12.2 Ghost
Used for Skip / Cancel buttons in modal footers. Transparent background, frame border on hover.

### 12.3 Avoid
- Tiny secondary buttons floating in the playfield.
- Any state where two equally-styled buttons compete for attention. The primary button changes label by phase rather than splitting into multiple buttons.

---

## 13. Accessibility

- Color is never the only signal — every state also uses text or shape changes (badge text, dashed vs solid border, glyph swap).
- All interactive elements are real `<button>`s with titles for hover info.
- `prefers-reduced-motion` disables the success splash burst and minimizes pulse animations.

---

## 14. Keyboard

- **Enter** — fires the primary action when enabled.
- **Backspace** — removes the most recently placed coin during `placing`.
- **Escape** — exits Convert/Reroll mode if active.

---

## 15. Animation Cheat Sheet

| Animation | Duration |
|---|---|
| Coin reveal step | 320 ms |
| Final pause before post-flip | 520 ms |
| Banner fade-in | 250 ms |
| Modal fade-in | 200 ms |
| Pulse glow loop | 1.6 s |
| Splash burst | 0.65–1.2 s per particle |

---

## 16. Component Inventory

- `App` → `GameScreen`
- `GameScreen` — owns the reducer; routes phases to the right modal/board state.
- `TopHud` — round / shards / next-shop pips / restart.
- `ChallengeHeader` — name, description, target/prediction pickers.
- `Board` — slot row, hints, splash burst, primary button, success banner.
  - `Slot` (internal)
  - `CoinIcon` (exported; reused by the bag and shop)
- `OutcomeBanner` — success-only banner under the board area.
- `SplashBurst` — particle burst on success.
- `CoinTray` — bag column + power-ups column.
- `ChallengePickerModal`, `PowerUpRewardModal`, `CoinShopModal`, `GameOverModal`.

---

## 17. Layout Proportions

- Single column, max width ~720 px on desktop.
- Top HUD: thin strip across the top.
- Challenge header: ~80–120 px tall (varies with target/prediction picker).
- Board: dominant area, min 520 px wide on desktop, ~240 px tall.
- Bottom tray: ~160–200 px, two columns (bag wider than power-ups).

On mobile (≤ 720 px wide): tray columns stack to a single column, slot row wraps.

---

## 18. Design North Star

> The board feels like a small machine. You load it, you start it, you read the result. When it pays out, the room lights up. When it doesn't, the run is over and you start a new one.
