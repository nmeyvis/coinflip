import { CHALLENGE_DEFS } from '../game/challenges';
import type { CoinSide, GameState } from '../game/types';
import { RarityBadge } from './Rarity';

interface Props {
  state: GameState;
  onSetTarget: (side: CoinSide) => void;
  onSetPrediction: (index: number, side: CoinSide) => void;
  ready: boolean;
}

export function ChallengeHeader({ state, onSetTarget, onSetPrediction, ready }: Props) {
  if (!state.activeChallenge) {
    return (
      <section className="challenge-header empty">
        <div className="challenge-name">Awaiting challenge…</div>
      </section>
    );
  }
  const def = CHALLENGE_DEFS[state.activeChallenge];

  return (
    <section className={`challenge-header ${ready ? 'ready' : ''}`}>
      <div className="challenge-title">
        <h2 className="challenge-name">{def.name}</h2>
        <RarityBadge rarity={def.rarity} />
      </div>
      <p className="challenge-desc">{def.description}</p>

      {def.needsTarget && (
        <div className="target-picker">
          <span className="picker-label">Target:</span>
          <button
            className={`coin-toggle ${state.target === 'H' ? 'on' : ''}`}
            onClick={() => onSetTarget('H')}
            aria-pressed={state.target === 'H'}
          >
            <CoinFace side="H" />
            Heads
          </button>
          <button
            className={`coin-toggle ${state.target === 'T' ? 'on' : ''}`}
            onClick={() => onSetTarget('T')}
            aria-pressed={state.target === 'T'}
          >
            <CoinFace side="T" />
            Tails
          </button>
        </div>
      )}

      {def.needsPrediction && (
        <div className="prediction-picker">
          <span className="picker-label">Prediction:</span>
          {state.prediction.map((p, i) => (
            <button
              key={i}
              className={`pred-toggle ${p === 'H' ? 'h' : 't'}`}
              onClick={() => onSetPrediction(i, p === 'H' ? 'T' : 'H')}
              title={`Slot ${i + 1}: click to toggle`}
            >
              <span className="slot-num">{i + 1}</span>
              <CoinFace side={p} />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

function CoinFace({ side }: { side: CoinSide }) {
  return <span className={`face face-${side === 'H' ? 'heads' : 'tails'}`}>{side}</span>;
}
