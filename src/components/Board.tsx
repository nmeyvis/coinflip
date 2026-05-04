import { CHALLENGE_DEFS } from '../game/challenges';
import { COIN_DEFS } from '../game/coins';
import type { CoinId, CoinSide, GameState, PlacedCoin } from '../game/types';
import { OutcomeBanner } from './OutcomeBanner';

interface Props {
  state: GameState;
  onRemovePlaced: (uid: string) => void;
  onSlotClick: (slotIdx: number, placed: PlacedCoin | null) => void;
  postFlipMode: 'convert' | 'reroll' | null;
  primaryButton: { label: string; disabled: boolean; onClick?: () => void; pulse?: boolean };
}

export function Board({
  state,
  onRemovePlaced,
  onSlotClick,
  postFlipMode,
  primaryButton,
}: Props) {
  const slots = state.activeChallenge ? CHALLENGE_DEFS[state.activeChallenge].slots : 0;
  const showResults =
    state.phase === 'flipping' || state.phase === 'post_flip' || state.phase === 'resolved';

  const slotEls = [];
  for (let i = 0; i < Math.max(slots, 1); i++) {
    const placed = state.placed[i] ?? null;
    const revealedHere = i < state.flippingIndex;
    const isFlippingNow = state.phase === 'flipping' && i === state.flippingIndex;
    slotEls.push(
      <Slot
        key={i}
        index={i}
        placed={placed}
        phase={state.phase}
        revealed={revealedHere}
        flipping={isFlippingNow}
        showResults={showResults}
        postFlipMode={postFlipMode}
        onClick={() => {
          if (state.phase === 'placing' && placed) onRemovePlaced(placed.uid);
          else onSlotClick(i, placed);
        }}
      />,
    );
  }

  const showBanner = state.phase === 'resolved' && state.outcome != null;
  const placingHint =
    state.phase === 'placing' && state.placed.length === 0
      ? 'Click coins from your bag to fill slots in order.'
      : null;

  return (
    <section className="board-area">
      {showBanner && <OutcomeBanner outcome={state.outcome!} />}
      <div className={`board ${state.phase}`}>
        <div className="slot-row">{slotEls}</div>
        {placingHint && <div className="board-hint">{placingHint}</div>}
        {state.phase === 'post_flip' && (
          <div className="board-hint">
            {postFlipMode === 'convert' && 'Convert mode: click a coin to flip its result.'}
            {postFlipMode === 'reroll' && 'Reroll mode: click a coin to reroll it.'}
            {postFlipMode == null && 'Coins landed. Use a power-up or continue.'}
          </div>
        )}
      </div>
      <div className="primary-action">
        <button
          className={`primary-btn ${primaryButton.pulse ? 'pulse' : ''}`}
          disabled={primaryButton.disabled}
          onClick={primaryButton.onClick}
        >
          {primaryButton.label}
        </button>
      </div>
    </section>
  );
}

interface SlotProps {
  index: number;
  placed: PlacedCoin | null;
  phase: GameState['phase'];
  revealed: boolean;
  flipping: boolean;
  showResults: boolean;
  postFlipMode: 'convert' | 'reroll' | null;
  onClick: () => void;
}

function Slot({
  index,
  placed,
  phase,
  revealed,
  flipping,
  showResults,
  postFlipMode,
  onClick,
}: SlotProps) {
  const empty = placed == null;
  const def = placed ? COIN_DEFS[placed.coinId] : null;
  const result = placed?.result;
  const showFace = showResults && revealed && result != null;

  let stateClass = '';
  if (empty) stateClass = 'empty';
  else if (phase === 'placing') stateClass = 'placed';
  else if (flipping) stateClass = 'flipping';
  else if (showFace) stateClass = `landed face-${result === 'H' ? 'heads' : 'tails'}`;
  else stateClass = 'waiting';

  const interactive =
    (phase === 'placing' && placed) ||
    (phase === 'post_flip' && postFlipMode != null && placed && result != null);

  return (
    <button
      className={`board-slot ${stateClass} ${interactive ? 'interactive' : ''} ${
        placed && def ? `coin-${def.id} rarity-${def.rarity}` : ''
      } ${placed?.modified ? 'modified' : ''}`}
      onClick={onClick}
      disabled={!interactive}
      title={
        empty
          ? `Slot ${index + 1}`
          : showFace
          ? `${def!.name}: ${result === 'H' ? 'Heads' : 'Tails'}`
          : `${def!.name}`
      }
    >
      <span className="slot-num">{index + 1}</span>
      {empty ? (
        <span className="slot-placeholder">◯</span>
      ) : (
        <div className="slot-coin">
          {showFace ? (
            <span className={`face big face-${result === 'H' ? 'heads' : 'tails'}`}>
              {result}
            </span>
          ) : flipping ? (
            <span className="face big spinning">?</span>
          ) : (
            <CoinIcon coinId={def!.id} declared={placed?.declaredSide} />
          )}
          <div className="slot-coin-name">{def!.name.split(' ')[0]}</div>
        </div>
      )}
    </button>
  );
}

export function CoinIcon({
  coinId,
  declared,
}: {
  coinId: CoinId;
  declared?: CoinSide;
}) {
  const map: Record<CoinId, string> = {
    standard: '◯',
    heavy: '⬢',
    switch: '⇄',
    gold: '★',
    cracked: '✦',
    crown: '♛',
    anchor: '⚓',
    echo: '◐',
    rebel: '◑',
    lucky: '✧',
    safe: '⛨',
  };
  return (
    <span className="coin-glyph">
      {map[coinId]}
      {declared && <span className="declared-tag">{declared}</span>}
    </span>
  );
}
