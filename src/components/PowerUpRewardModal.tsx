import { POWERUP_DEFS } from '../game/powerups';
import type { GameState, PowerUpId } from '../game/types';
import { RarityBadge } from './Rarity';

interface Props {
  state: GameState;
  onChoose: (id: PowerUpId) => void;
  onReplaceSlot: (slotIdx: number) => void;
  onSkip: () => void;
}

export function PowerUpRewardModal({ state, onChoose, onReplaceSlot, onSkip }: Props) {
  const replacing = state.pendingReward != null;
  return (
    <div className="modal-backdrop">
      <div className="modal reward-picker">
        <h2 className="modal-title">{replacing ? 'Replace which slot?' : 'Choose a Power-Up'}</h2>

        {replacing && state.pendingReward && (
          <div className="incoming-power">
            <div className="incoming-label">Incoming:</div>
            <PowerCard id={state.pendingReward} highlight />
          </div>
        )}

        <div className="card-row">
          {!replacing &&
            state.rewardOffers.map((id) => (
              <button key={id} className="card-button" onClick={() => onChoose(id)}>
                <PowerCard id={id} />
              </button>
            ))}
          {replacing &&
            state.powerUps.map((slot, i) => (
              <button
                key={i}
                className="card-button"
                onClick={() => onReplaceSlot(i)}
              >
                {slot ? (
                  <PowerCard id={slot.id} />
                ) : (
                  <div className="power-card empty">
                    <div className="power-name">Empty Slot</div>
                  </div>
                )}
              </button>
            ))}
        </div>

        <div className="modal-footer">
          <button className="ghost-btn" onClick={onSkip}>
            {replacing ? 'Cancel' : 'Skip Reward'}
          </button>
        </div>
      </div>
    </div>
  );
}

function PowerCard({ id, highlight }: { id: PowerUpId; highlight?: boolean }) {
  const def = POWERUP_DEFS[id];
  return (
    <div className={`power-card rarity-${def.rarity} kind-${def.kind} ${highlight ? 'highlight' : ''}`}>
      <div className="power-card-header">
        <h3>{def.name}</h3>
        <RarityBadge rarity={def.rarity} />
      </div>
      <div className="power-card-kind">{def.kind}{def.charges ? ` · ${def.charges} charges` : ''}</div>
      <p className="power-card-desc">{def.long}</p>
    </div>
  );
}
