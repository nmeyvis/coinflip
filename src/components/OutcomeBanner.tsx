import type { Outcome } from '../game/types';

const protectionLabel: Record<NonNullable<Outcome['protectionApplied']>, string> = {
  shield: 'Shield prevented streak break.',
  streak_saver: 'Streak Saver prevented streak break.',
  safety_net: 'Safety Net halved the streak.',
  cracked: 'Cracked Coin softened the reset.',
};

export function OutcomeBanner({ outcome }: { outcome: Outcome }) {
  const cls = outcome.success ? 'banner success' : 'banner failure';
  return (
    <div className={cls} role="status">
      <div className="banner-title">{outcome.success ? 'SUCCESS' : 'FAILED'}</div>
      <div className="banner-reason">{outcome.reason}</div>
      {outcome.success ? (
        <div className="banner-rewards">
          <span>+{outcome.streakGain.toFixed(1)} Streak</span>
          <span className="dot">•</span>
          <span>x{outcome.streakBefore.toFixed(1)} → x{outcome.streakAfter.toFixed(1)}</span>
          <span className="dot">•</span>
          <span>+{outcome.shardsGained} ◆</span>
        </div>
      ) : (
        <div className="banner-rewards">
          <span>x{outcome.streakBefore.toFixed(1)} → x{outcome.streakAfter.toFixed(1)}</span>
          {outcome.protectionApplied && (
            <>
              <span className="dot">•</span>
              <span>{protectionLabel[outcome.protectionApplied]}</span>
            </>
          )}
        </div>
      )}
    </div>
  );
}
