import { CHALLENGE_DEFS } from '../game/challenges';
import { ALL_SPECIAL_COIN_IDS, COIN_DEFS } from '../game/coins';
import {
  availableCount,
  isCoinRecommended,
  isCoinValid,
} from '../game/engine';
import { POWERUP_DEFS } from '../game/powerups';
import type { CoinId, CoinSide, GameState, PowerUpInstance, SpecialCoinId } from '../game/types';
import { CoinIcon } from './Board';

interface Props {
  state: GameState;
  onPlaceCoin: (coinId: CoinId) => void;
  onPowerUpClick: (slotIdx: number) => void;
}

export function CoinTray({ state, onPlaceCoin, onPowerUpClick }: Props) {
  const ownedSpecials = uniqueSpecials(state.bag);
  const placing = state.phase === 'placing';
  const def = state.activeChallenge ? CHALLENGE_DEFS[state.activeChallenge] : null;
  const slotsLeft = def ? def.slots - state.placed.length : 0;

  const canPlace = (id: CoinId) => placing && slotsLeft > 0 && availableCount(state, id) > 0;

  return (
    <section className="bottom-tray">
      <div className="tray-col coin-bag-col">
        <div className="tray-title">Coin Bag</div>
        <div className="coin-bag-row">
          <CoinChip
            coinId="standard"
            count={Infinity}
            recommended={state.activeChallenge ? isCoinRecommended(state, 'standard') : false}
            valid={state.activeChallenge ? isCoinValid(state, 'standard') : true}
            disabled={!canPlace('standard')}
            onClick={() => onPlaceCoin('standard')}
          />
          {ownedSpecials.map(({ id, count }) => {
            const avail = availableCount(state, id);
            return (
              <CoinChip
                key={id}
                coinId={id}
                count={avail}
                totalCount={count}
                recommended={state.activeChallenge ? isCoinRecommended(state, id) : false}
                valid={state.activeChallenge ? isCoinValid(state, id) : true}
                disabled={!canPlace(id) || avail <= 0}
                memoryBadge={memoryBadgeFor(id, state.coinMemory)}
                onClick={() => onPlaceCoin(id)}
              />
            );
          })}
          {ownedSpecials.length === 0 && (
            <div className="empty-bag-note">No special coins yet — try the shop after round 3.</div>
          )}
        </div>
      </div>
      <div className="tray-col power-col">
        <div className="tray-title">Power-Ups</div>
        <div className="power-row">
          {state.powerUps.map((slot, i) => (
            <PowerSlot
              key={i}
              slot={slot}
              slotIdx={i}
              state={state}
              onClick={() => onPowerUpClick(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function memoryBadgeFor(
  id: CoinId,
  memory: GameState['coinMemory'],
): CoinSide | '?' | undefined {
  if (id !== 'heavy' && id !== 'switch') return undefined;
  return memory[id] ?? '?';
}

function uniqueSpecials(bag: SpecialCoinId[]): { id: SpecialCoinId; count: number }[] {
  const counts = new Map<SpecialCoinId, number>();
  for (const id of bag) counts.set(id, (counts.get(id) ?? 0) + 1);
  // Stable order via canonical list.
  return ALL_SPECIAL_COIN_IDS.filter((id) => counts.has(id)).map((id) => ({
    id,
    count: counts.get(id)!,
  }));
}

interface ChipProps {
  coinId: CoinId;
  count: number;
  totalCount?: number;
  recommended: boolean;
  valid: boolean;
  disabled: boolean;
  memoryBadge?: CoinSide | '?';
  onClick: () => void;
}

function CoinChip({
  coinId,
  count,
  totalCount,
  recommended,
  valid,
  disabled,
  memoryBadge,
  onClick,
}: ChipProps) {
  const def = COIN_DEFS[coinId];
  const cls = [
    'coin-chip',
    `rarity-${def.rarity}`,
    `coin-${def.id}`,
    recommended ? 'recommended' : '',
    valid ? '' : 'invalid',
    disabled ? 'disabled' : '',
  ]
    .filter(Boolean)
    .join(' ');
  const countLabel =
    count === Infinity ? '∞' : totalCount && totalCount !== count ? `${count}/${totalCount}` : `x${count}`;
  return (
    <button
      className={cls}
      onClick={onClick}
      disabled={disabled}
      title={`${def.name}\n${def.long}`}
    >
      <CoinIcon coinId={coinId} memoryBadge={memoryBadge} />
      <div className="coin-meta">
        <div className="coin-name">{def.name}</div>
        <div className="coin-short">{def.short}</div>
      </div>
      <div className="coin-count">{countLabel}</div>
      {recommended && <div className="reco-flag" title="Recommended for this challenge">★</div>}
    </button>
  );
}

interface PowerSlotProps {
  slot: PowerUpInstance | null;
  slotIdx: number;
  state: GameState;
  onClick: () => void;
}

function PowerSlot({ slot, slotIdx, state, onClick }: PowerSlotProps) {
  if (!slot) {
    return (
      <button className="power-slot empty" disabled aria-label={`Empty slot ${slotIdx + 1}`}>
        <span className="empty-socket">⬡</span>
        <span className="slot-label">Empty</span>
      </button>
    );
  }
  const def = POWERUP_DEFS[slot.id];
  const usable = isPowerUsable(slot, state);
  const active = isPowerActiveForMode(slot, state);
  const cls = [
    'power-slot',
    `rarity-${def.rarity}`,
    `kind-${def.kind}`,
    usable ? 'usable' : '',
    active ? 'active-mode' : '',
  ]
    .filter(Boolean)
    .join(' ');
  return (
    <button
      className={cls}
      onClick={onClick}
      disabled={!usable}
      title={`${def.name}\n${def.long}`}
    >
      <div className="power-icon">{powerIcon(slot.id)}</div>
      <div className="power-meta">
        <div className="power-name">{def.name}</div>
        <div className="power-kind">
          {def.kind}
          {slot.charges != null && ` · ${slot.charges} charges`}
        </div>
      </div>
    </button>
  );
}

function powerIcon(id: PowerUpInstance['id']): string {
  switch (id) {
    case 'coin_convert':
      return '⇋';
    case 'reroll_charm':
      return '↻';
    case 'lucky_charm':
      return '☘';
    case 'shield':
      return '⛨';
  }
}

function isPowerUsable(slot: PowerUpInstance, state: GameState): boolean {
  if (state.phase !== 'post_flip') return false;
  if (slot.id === 'coin_convert') return true;
  if (slot.id === 'reroll_charm') {
    if (!state.activeChallenge) return false;
    const def = CHALLENGE_DEFS[state.activeChallenge];
    if (def?.rerollDisabled) return false;
    return (slot.charges ?? 0) > 0;
  }
  return false;
}

function isPowerActiveForMode(slot: PowerUpInstance, state: GameState): boolean {
  if (state.phase !== 'post_flip') return false;
  if (state.postFlipMode === 'convert' && slot.id === 'coin_convert') return true;
  if (state.postFlipMode === 'reroll' && slot.id === 'reroll_charm') return true;
  return false;
}
