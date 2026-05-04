# Flipbreakers — UI Design Spec

## 1. UI Direction

The game UI should feel like a **game board / arcade roguelite interface**, not a website or dashboard.

The player should feel like they are manipulating physical game pieces:

- Coins are **tokens**
- Power-ups are **inventory items**
- Challenges are **cards/contracts**
- The board is the **main play surface**
- Shops and challenge selection are **modal game screens**, not pages
- Primary actions should be big, tactile, and minimal

Avoid:

- Too many buttons
- Website-style cards with equal-weight CTAs
- Navigation bars
- Form-like layouts
- Dense text blocks
- Tables during active gameplay
- Multiple competing action buttons

The main round screen should have one obvious flow:

> Choose challenge → place coins → start flip → watch result → see success/failure → continue.

---

## 2. Main Screen Layout

### 2.1 Screen Regions

The main gameplay screen has four major regions:

```text
┌──────────────────────────────────────────────┐
│                  Top HUD                     │
├──────────────────────────────────────────────┤
│           Challenge Header Panel             │
├──────────────────────────────────────────────┤
│                                              │
│                  Board                       │
│                                              │
├──────────────────────────────────────────────┤
│              Bottom Inventory Tray           │
│       Coin Bag                  Power-Ups    │
└──────────────────────────────────────────────┘
```

The **board** is the visual center of the game.

The **bottom tray** is the player’s toolbelt.

The **challenge header** tells the player what they are trying to do.

The **top HUD** shows run-level state.

---

## 3. Top HUD

The top HUD should be compact and persistent.

### 3.1 Required HUD Items

| Item | Purpose |
|---|---|
| **Round** | Shows current round number |
| **Streak Multiplier** | Shows current multiplier, visually emphasized |
| **Shards** | Shows current shop currency |
| **Run Progress** | Shows progression toward next shop / boss / end |

Example:

```text
Round 4        Streak x2.6        Shards 46        Run Progress ● ● ● ○ ○
```

### 3.2 Visual Style

The HUD should feel like a game overlay:

- Dark background panel
- Metallic / stone / arcade frame
- Large multiplier text
- Shard icon next to currency
- Progress pips or nodes, not a progress bar that feels like a website loading bar

### 3.3 Interaction

The HUD should mostly be non-interactive.

Avoid making every HUD item clickable.

---

## 4. Challenge Header Panel

The challenge header sits **above the board**.

It tells the player:

- Challenge name
- Rarity
- Description
- Required slots
- Streak multiplier gain
- Selected target, if applicable

Example:

```text
Royal Majority        Rare

Choose Heads or Tails.
Get at least 4 of your chosen side in 5 slots.

Slots: 5      Streak Gain: +1.3
Target: Heads
```

### 4.1 Header Requirements

The header should be readable at a glance.

It should include:

| Element | Example |
|---|---|
| Challenge name | Royal Majority |
| Rarity badge | Rare |
| Description | Get at least 4 Heads in 5 slots |
| Slot count | 5 slots |
| Streak gain | +1.3 |
| Target selector | Heads / Tails, only when needed |

### 4.2 Target Selection

Some challenges require the player to choose Heads or Tails.

Examples:

- Simple Majority
- Strong Majority
- Royal Majority
- Dominion
- Lucky Coin / Fate Coin interactions

For those challenges, the target selector should be prominent but not website-like.

Good:

```text
Choose Target:
[ HEADS ]   [ TAILS ]
```

Better game feel:

- Two large coin-face toggles
- Selected side glows
- The selected side is reflected in the board outline color or challenge header

Avoid:

- Small radio buttons
- Dropdowns
- Form labels

---

## 5. Board

The board is the center of the screen and the most important visual area.

### 5.1 Board States

The board has several states:

1. **Empty**
2. **Partially filled**
3. **Ready**
4. **Flipping**
5. **Resolved success**
6. **Resolved failure**

### 5.2 Empty State

At the start of each challenge, the board shows empty numbered slots.

Example:

```text
[ 1 ] [ 2 ] [ 3 ] [ 4 ] [ 5 ]
```

Each slot should look like a physical socket or pedestal.

Empty slots should be visually obvious:

- Glowing outline
- Slot number
- Empty coin silhouette
- Subtle pulsing if the board is waiting for input

Instruction text:

```text
Select coins from your bag to fill slots in order.
```

### 5.3 Coin Placement

The player places coins by clicking coins in the Coin Bag.

Rule:

> Clicking a coin in the Coin Bag places it into the next empty board slot.

Example flow:

```text
Board starts:
[ Empty ] [ Empty ] [ Empty ]

Player clicks Heavy Coin:
[ Heavy ] [ Empty ] [ Empty ]

Player clicks Crown Coin:
[ Heavy ] [ Crown ] [ Empty ]

Player clicks Standard Coin:
[ Heavy ] [ Crown ] [ Standard ]
```

The player does **not** need to click the board slot first.

This keeps the interaction fast and game-like.

### 5.4 Placement Order

Coins are placed in the order clicked.

Board slots are filled from left to right.

```text
First clicked coin → Slot 1
Second clicked coin → Slot 2
Third clicked coin → Slot 3
```

This matters because coins flip left to right and some coin effects care about the coin to their left.

### 5.5 Removing Coins From Board

The player needs a way to undo placement, but this should not create button clutter.

Recommended interactions:

| Action | Behavior |
|---|---|
| Click placed coin | Remove it from the board |
| Right-click placed coin | Remove it from the board |
| Drag placed coin back to tray | Optional advanced interaction |
| Press Backspace | Remove most recently placed coin |

Best default:

> Clicking a placed coin removes it and shifts later placed coins left.

Example:

```text
Before:
[ Heavy ] [ Crown ] [ Gold ] [ Empty ]

Player clicks Crown.

After:
[ Heavy ] [ Gold ] [ Empty ] [ Empty ]
```

This keeps ordering simple.

### 5.6 Ready State

When all required slots are filled, the Start button becomes active.

Before ready:

```text
Start button disabled / dimmed
Text: Fill all slots
```

After ready:

```text
Start button active / glowing
Text: Start
```

The board should visually communicate readiness:

- Slot frames glow
- Board outline brightens
- Start button pulses subtly
- Challenge header confirms readiness

Example:

```text
5 / 5 slots filled
Ready to flip
```

---

## 6. Start Button

There should be **one primary button** during the board phase.

```text
START
```

### 6.1 Location

The Start button should be near the board, ideally:

- Right side of the board
- Below the board
- Integrated into the board frame

Avoid putting it in the bottom tray, because the tray is for inventory.

### 6.2 States

| State | Label | Behavior |
|---|---|---|
| Not ready | Fill Slots | Disabled |
| Ready | Start | Begins coin flipping |
| Flipping | Flipping… | Disabled |
| Resolved | Continue | Advances after success/failure presentation |

You can either reuse the same button location or show a separate Continue prompt after resolution.

For a game feel, reusing the same large action button is clean:

```text
Fill Slots → Start → Flipping… → Continue
```

---

## 7. Coin Flipping Animation

After clicking Start, coins flip one at a time from left to right.

### 7.1 Flip Timing

Recommended timing:

```text
Slot 1 flips immediately.
Slot 2 flips after 250–350ms.
Slot 3 flips after 250–350ms.
Slot 4 flips after 250–350ms.
Slot 5 flips after 250–350ms.
```

The delay should be long enough to create tension, but short enough to avoid feeling slow.

Recommended default:

```text
300ms delay between coin flips
500ms final result pause before success/failure banner
```

### 7.2 Per-Coin Flip States

Each coin slot can have these visual states:

| State | Visual |
|---|---|
| Waiting | Dimmed coin |
| Flipping | Spinning / glow / blur |
| Landed Heads | Heads face with bright impact |
| Landed Tails | Tails face with bright impact |
| Modified | Special outline if affected by coin or power-up |
| Counted | Small badge showing contribution |

Example for Crown Coin:

```text
Crown Coin lands Heads.
Badge appears: +2 Heads
```

Example for Gold Coin:

```text
Gold Coin lands Tails.
No success bonus badge yet.
```

---

## 8. Outcome Display

The success or failure result must be impossible to miss.

### 8.1 Success State

Success should feel rewarding.

Display:

```text
SUCCESS
4 Heads — Challenge Cleared
Streak +1.3
New Streak x4.8
+3 Shards
```

Visual treatment:

- Bright green / gold glow
- Board outline pulses
- Coins shimmer
- Sound cue
- Streak multiplier animates upward
- Shards fly toward HUD

### 8.2 Failure State

Failure should feel clear, but not overly punishing visually.

Display:

```text
FAILED
Only 3 Heads — Needed 4
Streak Reset to x1.0
```

If protected:

```text
FAILED
Only 3 Heads — Needed 4
Streak Guard prevented reset
```

Visual treatment:

- Red / orange / dark smoke
- Board outline cracks or dims
- Failed requirement is highlighted
- If a shield saves the player, show shield animation prominently

### 8.3 Outcome Banner Location

The outcome banner should appear directly above or over the board.

Do not hide it in a toast.

Good:

```text
          SUCCESS
  4 Heads — Challenge Cleared

[ Coin ] [ Coin ] [ Coin ] [ Coin ] [ Coin ]
```

Bad:

```text
Small notification in corner: success
```

The board is the event, so the result belongs on the board.

---

## 9. Bottom Inventory Tray

The bottom tray is persistent during main gameplay.

It has two columns:

```text
┌──────────────────────────────────────────────┐
│ Coin Bag                         Power-Ups   │
│ [Coins...]                       [3 slots]   │
└──────────────────────────────────────────────┘
```

The tray should feel like a physical inventory tray, not a website panel.

---

## 10. Coin Bag Column

The left side of the tray is the Coin Bag.

### 10.1 Coin Bag Contents

The Coin Bag shows:

- Special coins owned
- Standard Coin source
- Counts for duplicates, if applicable
- Disabled state for invalid coins
- Recommended glow for strong coins

Example:

```text
Coin Bag

[ Standard x∞ ] [ Heavy x1 ] [ Crown x1 ] [ Gold x1 ] [ Echo x1 ]
```

### 10.2 Standard Coin

Standard Coin should always be visible and always usable.

Recommended visual:

```text
Standard Coin ∞
```

or

```text
Standard Coin
Unlimited
```

It should not look like a limited inventory item.

### 10.3 Coin Card / Token Design

Each coin in the tray should show:

| Element | Example |
|---|---|
| Coin icon | Crown symbol |
| Name | Crown Coin |
| Count | x2 or ∞ |
| Rarity frame | Common / Rare / Epic |
| Validity state | Normal, recommended, invalid |
| Short effect on hover/inspect | Counts as 2 Heads in Majority |

Keep the default card compact.

Long explanations should appear only on hover, focus, or inspection.

### 10.4 Clicking Coins

Clicking a valid coin:

```text
Places that coin into the next empty board slot.
```

If the coin has multiple copies:

```text
Count decreases visually until coins are removed or challenge resolves.
```

If Standard Coin is clicked:

```text
Places a Standard Coin.
No count reduction, because it is unlimited.
```

### 10.5 Invalid Coins

Invalid coins should remain visible but disabled.

Example disabled tooltip:

```text
Requires a declared Heads/Tails target.
```

or:

```text
Requires a mirrored slot challenge.
```

Do not hide invalid coins, because that makes the inventory feel inconsistent.

---

## 11. Power-Ups Column

The right side of the bottom tray contains exactly **3 power-up slots**.

```text
Power-Ups

[ Shield ] [ Coin Convert ] [ Heads Specialist ]
```

### 11.1 Power-Up Slot Design

Each slot should look like an equipped item slot.

Each power-up shows:

| Element | Example |
|---|---|
| Icon | Shield |
| Name | Shield |
| Type | Consumable / Passive / Charged |
| Charges | 2, if relevant |
| Rarity border | Rare, Epic, etc. |
| Usable state | Glowing if usable now |

### 11.2 Power-Up States

| State | Visual |
|---|---|
| Passive active | Constant subtle glow |
| Usable now | Strong glow / pulse |
| Not usable now | Dimmed |
| Empty slot | Empty socket |
| Consumed | Break animation, then empty |

### 11.3 Power-Up Usage

Power-ups should not all be buttons all the time.

Only show a strong clickable state when the power-up is relevant.

Example:

- Coin Convert glows after coins land and before resolution is finalized
- Shield glows when a failure is about to break streak
- Heads Specialist may be passive and never clickable

This avoids “too many buttons.”

---

## 12. Main Gameplay Interaction Flow

### 12.1 Pre-Flip Flow

```text
1. Challenge appears.
2. Board shows empty slots.
3. Player clicks coins in Coin Bag.
4. Coins fill slots left to right.
5. Player may click placed coins to remove/reorder by replacement.
6. Once all slots are filled, Start activates.
7. Player clicks Start.
```

### 12.2 Flip Flow

```text
1. Start button changes to Flipping…
2. Slot 1 flips.
3. Short delay.
4. Slot 2 flips.
5. Short delay.
6. Continue until all slots resolve.
7. Coin effects apply.
8. Power-up window opens if relevant.
9. Challenge success/failure resolves.
```

### 12.3 Post-Flip Flow

On success:

```text
1. Success banner appears.
2. Multiplier gain animates.
3. Shards animate to HUD.
4. Continue button appears.
5. Power-up reward popup opens.
```

On failure:

```text
1. Failure banner appears.
2. Failure reason is shown.
3. Streak penalty animates.
4. Protective powers trigger if available.
5. Continue button appears.
```

---

## 13. Challenge Picker Popup

The challenge picker is a modal popup over a dimmed gameplay screen.

It should not feel like a webpage section.

### 13.1 Layout

The popup has three columns.

```text
┌──────────────────────────────────────────────┐
│              Choose a Challenge              │
├──────────────┬──────────────┬───────────────┤
│ Challenge 1  │ Challenge 2  │ Challenge 3   │
└──────────────┴──────────────┴───────────────┘
```

### 13.2 Challenge Card Contents

Each challenge card should show:

| Element | Example |
|---|---|
| Name | Royal Majority |
| Rarity | Rare |
| Family icon | Majority |
| Short requirement | Get 4 of chosen side in 5 slots |
| Required slots | 5 |
| Streak gain | +1.3 |
| Special rules | Rerolls disabled, if relevant |

Example card:

```text
Royal Majority
Rare

Choose Heads or Tails.
Get at least 4 of your chosen side in 5 slots.

Slots: 5
Streak Gain: +1.3
```

### 13.3 Card Interaction

The whole card should be clickable.

Avoid adding multiple buttons inside each card.

Recommended:

```text
Click card to choose.
Selected card expands or glows.
Confirm automatically after short delay, or show one large Confirm button.
```

Best low-click version:

> Clicking a challenge card immediately selects it and closes the popup.

This keeps the game fast.

If you want to avoid accidental clicks:

> First click selects, second click confirms, or one large Confirm button appears below the three cards.

But avoid individual “Choose” buttons on all three cards if the whole card can already be clicked.

---

## 14. Power-Up Reward Popup

After successful challenges, show a reward popup with 3 power-up choices.

### 14.1 Layout

```text
┌──────────────────────────────────────────────┐
│              Choose a Power-Up               │
├──────────────┬──────────────┬───────────────┤
│ Power 1      │ Power 2      │ Power 3       │
└──────────────┴──────────────┴───────────────┘
```

### 14.2 Interaction

The whole power-up card is clickable.

If the player has an empty slot:

```text
Clicking a power-up equips it immediately.
```

If all 3 slots are full:

```text
Clicking a power-up enters Replace Mode.
The bottom tray highlights the 3 equipped power-ups.
Player clicks which one to replace.
```

### 14.3 Replace Mode

Replace Mode should feel like a game inventory swap, not a confirmation form.

Example:

```text
Choose a slot to replace:
[ Shield ] [ Coin Convert ] [ Heads Specialist ]
```

The selected new power-up remains shown above.

There should be one small cancel/back option, but not many buttons.

---

## 15. Coin Shop Popup

The coin shop appears every 3 rounds.

It is a modal popup over a dimmed gameplay screen.

### 15.1 Shop Layout

```text
┌──────────────────────────────────────────────┐
│                 Coin Shop                    │
│                 Shards: 46                   │
├───────────┬───────────┬───────────┬─────────┤
│ Coin 1    │ Coin 2    │ Coin 3    │ Coin 4  │
└───────────┴───────────┴───────────┴─────────┘
│                 Continue                     │
└──────────────────────────────────────────────┘
```

Even though the game spec says 3 shop coins, the UI can support 3 or 4. For simplicity and consistency, use **3 shop coin cards** in the first version.

### 15.2 Shop Card Contents

Each shop coin card shows:

| Element | Example |
|---|---|
| Coin name | Crown Coin |
| Rarity | Uncommon |
| Coin icon | Crown symbol |
| Short effect | Counts Heads as 2 in Majority |
| Price | 5 Shards |
| Buy affordance | Buy button or click card |

### 15.3 Shop Interaction

To reduce button clutter:

Preferred:

> Clicking the coin card buys it if affordable.

The Buy button can exist visually, but the whole card should behave as the click target.

If the player cannot afford the coin:

- Card is dimmed
- Price is red or muted
- Tooltip says “Need 3 more Shards”

### 15.4 Buying With Full Coin Bag

If the special coin bag is full:

```text
Click coin to buy.
Inventory replacement overlay appears.
Player chooses which special coin to replace.
```

Standard Coins are not part of replacement because they are unlimited and not in the special coin bag.

### 15.5 Continue Button

The shop should have one obvious exit button:

```text
Continue
```

Avoid:

- Close icon
- Back button
- Skip button
- Continue button
- Confirm button

Use only one exit affordance unless absolutely necessary.

---

## 16. Visual Language

### 16.1 Overall Feel

The UI should feel like:

- Arcade cabinet
- Roguelite board game
- Fantasy gambling machine
- Physical tokens and sockets
- Dramatic challenge contracts

It should not feel like:

- SaaS dashboard
- Landing page
- Pricing table
- Mobile banking app
- Form wizard

### 16.2 Materials

Use game-like material cues:

| Component | Suggested Material |
|---|---|
| Board | Stone, metal, dark glass, glowing channels |
| Coins | Metal tokens, embossed icons |
| Power-ups | Gemmed cards, relic slots, item icons |
| Challenge cards | Contract plaques, framed cards |
| Shop cards | Loot cards / merchant wares |
| HUD | Dark metal frame |

### 16.3 Rarity Colors

Suggested rarity palette:

| Rarity | Color Direction |
|---|---|
| Common | Steel / white |
| Uncommon | Green |
| Rare | Blue |
| Epic | Purple |
| Legendary | Gold / orange |

Use rarity color mostly in borders, glows, and badges.

Do not flood entire cards with saturated colors.

---

## 17. Button Philosophy

The game should minimize explicit buttons.

### 17.1 Primary Buttons

During main gameplay, only one primary button should be visible:

```text
Start / Continue
```

### 17.2 Clickable Objects

Most interactions should happen by clicking game objects:

| Object | Interaction |
|---|---|
| Coin in bag | Place into next board slot |
| Coin on board | Remove from board |
| Challenge card | Choose challenge |
| Power-up card | Equip / use / replace |
| Shop coin card | Buy coin |
| Power-up slot | Replace or inspect |

This feels more game-like than surrounding everything with buttons.

### 17.3 Avoid

Avoid UI like:

```text
[Select] [Details] [Confirm] [Cancel] [Back] [Next] [Skip] [Info]
```

Instead:

- Click object to act
- Hover/focus to inspect
- One primary button for major flow advance

---

## 18. Information Density

Keep active gameplay text short.

### 18.1 Main Challenge Text

Good:

```text
Get at least 4 Heads in 5 slots.
```

Bad:

```text
In this challenge, you must select a target side, then attempt to get at least four matching outcomes from the selected side across five total coin flips.
```

### 18.2 Details on Hover

Coin and power-up details can be shown in an inspection panel or tooltip.

Example:

Hover Crown Coin:

```text
Crown Coin
Uncommon

60% Heads / 40% Tails.
In Majority challenges, Heads counts as 2.
```

Do not show all of this permanently in the bottom tray.

---

## 19. Accessibility and Readability

Even though the UI should feel game-like, it must remain readable.

### 19.1 Requirements

- Large text for challenge name and outcome
- Clear slot numbers
- Clear Heads/Tails icons
- Color is not the only indicator
- Rarity uses color + label
- Success/failure uses text + animation + color
- Disabled coins explain why they are disabled
- Keyboard support for coin placement

### 19.2 Keyboard Controls

Suggested controls:

| Key | Action |
|---|---|
| 1–9 | Select coin from bag |
| Enter | Start / Continue |
| Backspace | Remove last placed coin |
| Esc | Close popup / cancel replace mode |
| Arrow keys | Navigate cards |
| Space | Confirm selected card |

---

## 20. Animation Guidelines

Animations should create tension and clarity, not slow the player down.

### 20.1 Recommended Durations

| Animation | Duration |
|---|---:|
| Coin placement | 100–150ms |
| Coin flip | 250–350ms |
| Delay between flips | 250–350ms |
| Result banner entrance | 250ms |
| Multiplier count-up | 400–700ms |
| Shard gain animation | 400–600ms |
| Popup entrance | 150–250ms |

### 20.2 Skip / Speed-Up

After the player understands the game, repeated animations may feel slow.

Recommended:

- Clicking during flip sequence speeds up remaining flips
- Holding Space fast-forwards animations
- Settings can enable “Fast Animations”

Do not remove animations entirely by default because they are central to the game feel.

---

## 21. Screen State Details

### 21.1 Main Round — Empty Board

Visible:

- Top HUD
- Challenge header
- Empty board slots
- Bottom tray
- Disabled Start button

Primary instruction:

```text
Select coins from the bag to fill the board in order.
```

### 21.2 Main Round — Partially Filled

Visible:

- Filled slots show placed coins
- Empty slots remain obvious
- Coin bag counts update
- Start button remains disabled

Instruction:

```text
3 / 5 slots filled
```

### 21.3 Main Round — Ready

Visible:

- All slots filled
- Start button active
- Board outline glows

Instruction:

```text
Ready to flip.
```

### 21.4 Main Round — Flipping

Visible:

- Start button becomes disabled
- Coins flip left to right
- Active slot glows
- Future slots are dimmed
- Completed slots show final result

Instruction:

```text
Resolving slot 3 of 5...
```

### 21.5 Main Round — Power-Up Window

If a power-up can affect the outcome, pause briefly after flips.

Example:

```text
You are 1 Head short.
Use Coin Convert?
```

But do not create a website-like dialog with many buttons.

Better:

- Coin Convert power-up glows
- Failing coin pulses
- Player clicks the power-up, then clicks the coin to convert
- Or clicks Continue to accept failure

### 21.6 Main Round — Success

Visible:

- Success banner
- Requirement summary
- Multiplier gain
- Shard gain
- Continue button

Example:

```text
SUCCESS
4 Heads — Challenge Cleared

+1.3 Streak
+3 Shards
```

### 21.7 Main Round — Failure

Visible:

- Failure banner
- Failure reason
- Streak impact
- Protective effect, if any
- Continue button

Example:

```text
FAILED
3 Heads — Needed 4

Streak reset to x1.0
```

Protected example:

```text
FAILED
3 Heads — Needed 4

Safe Coin softened the loss.
Streak reduced to x2.5
```

---

## 22. Component Inventory

### 22.1 Main Components

```text
GameScreen
TopHud
ChallengeHeader
Board
BoardSlot
CoinTray
CoinBag
CoinToken
PowerUpInventory
PowerUpSlot
PrimaryActionButton
OutcomeBanner
ChallengePickerModal
ChallengeCard
PowerUpRewardModal
PowerUpCard
CoinShopModal
ShopCoinCard
InspectTooltip
ReplaceModeOverlay
```

---

## 23. Component Responsibilities

### 23.1 GameScreen

Owns the main layout.

Contains:

- TopHud
- ChallengeHeader
- Board
- BottomTray
- Modal layer

### 23.2 ChallengeHeader

Displays current challenge.

Props / data:

```ts
challengeName
rarity
description
requiredSlots
streakGain
family
targetSide?
```

Should not handle coin placement.

### 23.3 Board

Displays slots and controls coin placement state.

Responsibilities:

- Render numbered slots
- Show placed coins
- Show flip states
- Show result states
- Show outcome banner region
- Communicate readiness

### 23.4 CoinBag

Displays available coins.

Responsibilities:

- Show Standard Coin as unlimited
- Show special coin counts
- Show valid / invalid / recommended states
- Allow click-to-place

### 23.5 PowerUpInventory

Displays 3 equipped power-up slots.

Responsibilities:

- Show empty slots
- Show passive/consumable/charged state
- Highlight usable powers
- Handle use or replace mode

### 23.6 ChallengePickerModal

Displays 3 challenge options.

Responsibilities:

- Show challenge cards in 3 columns
- Allow card selection
- Close after choice

### 23.7 CoinShopModal

Displays shop inventory.

Responsibilities:

- Show Shards
- Show 3 shop coin cards
- Allow purchases
- Handle full bag replacement
- Continue to next round

---

## 24. Recommended Main Layout Proportions

For a 16:9 desktop layout:

```text
Top HUD:              8–10% height
Challenge Header:     14–18% height
Board Area:           40–45% height
Bottom Tray:          25–30% height
```

Approximate:

```text
┌────────────────────────────┐
│ Top HUD                    │ 10%
├────────────────────────────┤
│ Challenge Header           │ 15%
├────────────────────────────┤
│ Board                      │ 45%
├────────────────────────────┤
│ Bottom Tray                │ 30%
└────────────────────────────┘
```

The board should not be squeezed by the tray.

If space is tight, reduce HUD height before reducing board height.

---

## 25. Mobile / Small Screen Considerations

The primary design should target desktop first.

For small screens:

- Board remains central
- Bottom tray becomes horizontally scrollable
- Coin Bag and Power-Ups may become tabs
- Challenge picker remains 3 cards but can become vertical stack
- Shop cards can scroll horizontally

But the core game feel should not be compromised by designing mobile-first.

---

## 26. Example Full Interaction

### Start of Round

Challenge selected:

```text
Royal Majority
Get at least 4 Heads in 5 slots.
Streak Gain: +1.3
```

Board:

```text
[ Empty 1 ] [ Empty 2 ] [ Empty 3 ] [ Empty 4 ] [ Empty 5 ]
```

Tray:

```text
Coin Bag:
[ Standard ∞ ] [ Heavy x1 ] [ Crown x1 ] [ Gold x1 ]

Power-Ups:
[ Shield ] [ Coin Convert ] [ Heads Specialist ]
```

Player clicks:

```text
Crown → Gold → Standard → Heavy → Standard
```

Board becomes:

```text
[ Crown ] [ Gold ] [ Standard ] [ Heavy ] [ Standard ]
```

Start button activates.

Player clicks Start.

Coins flip left to right:

```text
Slot 1: Crown = Heads
Slot 2: Gold = Tails
Slot 3: Standard = Heads
Slot 4: Heavy = Heads
Slot 5: Standard = Tails
```

Counting:

```text
Crown Heads counts as 2 Heads.
Total Heads = 4.
```

Outcome:

```text
SUCCESS
4 Heads — Challenge Cleared
+1.3 Streak
+3 Shards
```

Then:

```text
Power-up reward popup opens.
```

---

## 27. Design North Star

The player should never feel like they are filling out a form.

They should feel like they are:

- Choosing a dangerous contract
- Loading coins into a machine
- Watching the machine resolve
- Using relics to bend fate
- Collecting stronger tools for future rounds

The UI should make the core loop feel physical, dramatic, and fast:

```text
Pick challenge.
Load board.
Flip coins.
React.
Collect reward.
Move on.
```
