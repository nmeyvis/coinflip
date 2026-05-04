import { CHALLENGE_DEFS } from '../game/challenges';
import type { ChallengeId } from '../game/types';
import { RarityBadge } from './Rarity';

interface Props {
  offers: ChallengeId[];
  onChoose: (id: ChallengeId) => void;
}

export function ChallengePickerModal({ offers, onChoose }: Props) {
  return (
    <div className="modal-backdrop">
      <div className="modal challenge-picker">
        <h2 className="modal-title">Choose a Challenge</h2>
        <div className="card-row">
          {offers.map((id) => {
            const def = CHALLENGE_DEFS[id];
            return (
              <button
                key={id}
                className={`challenge-card rarity-${def.rarity}`}
                onClick={() => onChoose(id)}
              >
                <div className="card-header">
                  <h3>{def.name}</h3>
                  <RarityBadge rarity={def.rarity} />
                </div>
                <div className="card-family">{def.families.join(' · ')}</div>
                <p className="card-desc">{def.description}</p>
                <div className="card-stats">
                  <span>
                    <span className="stat-label">Slots</span>
                    <span className="stat-value">{def.slots}</span>
                  </span>
                  <span>
                    <span className="stat-label">Streak</span>
                    <span className="stat-value">+{def.streakGain.toFixed(1)}</span>
                  </span>
                </div>
                {def.rerollDisabled && (
                  <div className="card-warn">Rerolls disabled</div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
