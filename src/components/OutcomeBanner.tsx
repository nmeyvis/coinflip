import type { Outcome } from '../game/types';

interface Props {
  outcome: Outcome;
  round: number;
}

export function OutcomeBanner({ outcome, round }: Props) {
  if (outcome.success) {
    return (
      <div className="banner success" role="status">
        <div className="banner-title">SUCCESS</div>
        <div className="banner-reason">{outcome.reason}</div>
        <div className="banner-rewards">
          <span>+{outcome.shardsGained} ◆</span>
        </div>
      </div>
    );
  }
  if (outcome.shielded) {
    return (
      <div className="banner shielded" role="status">
        <div className="banner-title">SHIELDED</div>
        <div className="banner-reason">
          {outcome.reason} — Shield consumed to prevent game over.
        </div>
      </div>
    );
  }
  return (
    <div className="banner failure" role="status">
      <div className="banner-title">GAME OVER</div>
      <div className="banner-reason">
        {outcome.reason} — You reached round {round}.
      </div>
    </div>
  );
}
