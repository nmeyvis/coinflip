import { CHALLENGE_DEFS } from '../game/challenges';
import { COIN_DEFS } from '../game/coins';
import type { CoinId, CoinSide, GameState, PlacedCoin } from '../game/types';
import { OutcomeBanner } from './OutcomeBanner';
import { SplashBurst } from './SplashBurst';

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
  const challengeDef = state.activeChallenge ? CHALLENGE_DEFS[state.activeChallenge] : null;
  const slots = challengeDef?.slots ?? 0;
  const isMajority = challengeDef?.families.includes('majority') ?? false;
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
        isMajority={isMajority}
        onClick={() => {
          if (state.phase === 'placing' && placed) onRemovePlaced(placed.uid);
          else onSlotClick(i, placed);
        }}
      />,
    );
  }

  const showSplash = state.phase === 'resolved' && state.outcome?.success === true;
  const showGameOverBoard = state.phase === 'game_over';
  const showOutcome =
    (state.phase === 'resolved' || state.phase === 'game_over') && state.outcome != null;
  const hintText = computeHint(state, postFlipMode);

  return (
    <section className="board-area">
      <div className="results-slot">
        {showOutcome && <OutcomeBanner outcome={state.outcome!} round={state.round} />}
      </div>
      <div
        className={`board ${state.phase} ${showSplash ? 'success' : ''} ${
          showGameOverBoard ? 'game-over' : ''
        }`}
      >
        {showSplash && <SplashBurst key={`splash-${state.round}`} />}
        <div className="slot-row">{slotEls}</div>
        <div className="board-hint">{hintText ?? ' '}</div>
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

function computeHint(
  state: GameState,
  postFlipMode: 'convert' | 'reroll' | null,
): string | null {
  if (state.phase === 'placing' && state.placed.length === 0) {
    return 'Click coins from your bag to fill slots in order.';
  }
  if (state.phase === 'post_flip') {
    if (postFlipMode === 'convert') return 'Convert mode: click a coin to flip its result.';
    if (postFlipMode === 'reroll') return 'Reroll mode: click a coin to reroll it.';
    return 'Coins landed. Use a power-up or continue.';
  }
  return null;
}

interface SlotProps {
  index: number;
  placed: PlacedCoin | null;
  phase: GameState['phase'];
  revealed: boolean;
  flipping: boolean;
  showResults: boolean;
  postFlipMode: 'convert' | 'reroll' | null;
  isMajority: boolean;
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
  isMajority,
  onClick,
}: SlotProps) {
  const empty = placed == null;
  const def = placed ? COIN_DEFS[placed.coinId] : null;
  const result = placed?.result;
  const showFace = showResults && revealed && result != null;
  const showWeightBadge =
    showFace &&
    isMajority &&
    ((placed?.coinId === 'crown' && result === 'H') ||
      (placed?.coinId === 'anchor' && result === 'T'));

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
              {showWeightBadge && <span className="weight-badge" title="Counts as 2 in Majority">×2</span>}
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
  memoryBadge,
}: {
  coinId: CoinId;
  declared?: CoinSide;
  memoryBadge?: CoinSide | '?';
}) {
  const map: Record<CoinId, string> = {
    standard: '◯',
    heavy: '⬢',
    switch: '⇄',
    crown: '♛',
    anchor: '⚓',
    echo: '◐',
    rebel: '◑',
    lucky: '✧',
  };
  const memoryClass =
    memoryBadge === '?'
      ? 'unused'
      : memoryBadge === 'H'
      ? 'face-heads'
      : memoryBadge === 'T'
      ? 'face-tails'
      : '';
  return (
    <span className="coin-glyph">
      {map[coinId]}
      {declared && <span className="declared-tag">{declared}</span>}
      {memoryBadge && <span className={`memory-tag ${memoryClass}`}>{memoryBadge}</span>}
    </span>
  );
}
