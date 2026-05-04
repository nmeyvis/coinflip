import type { GameState } from '../game/types';

interface Props {
  state: GameState;
  onNewRun: () => void;
}

export function TopHud({ state, onNewRun }: Props) {
  const pips = [0, 1, 2].map((i) => i < state.toNextShop);
  return (
    <header className="top-hud">
      <div className="hud-cell">
        <div className="hud-label">Round</div>
        <div className="hud-value">{state.round}</div>
      </div>
      <div className="hud-cell streak-cell">
        <div className="hud-label">Streak</div>
        <div className="hud-streak">
          <span className="streak-x">x</span>
          <span className="streak-num">{state.streak.toFixed(1)}</span>
        </div>
      </div>
      <div className="hud-cell">
        <div className="hud-label">Shards</div>
        <div className="hud-value">
          <span className="shard-icon">◆</span>
          {state.shards}
        </div>
      </div>
      <div className="hud-cell">
        <div className="hud-label">Next Shop</div>
        <div className="pips">
          {pips.map((on, i) => (
            <span key={i} className={`pip ${on ? 'pip-on' : ''}`} />
          ))}
        </div>
      </div>
      <button className="hud-restart" onClick={onNewRun} title="Start a new run">
        ⟲
      </button>
    </header>
  );
}
