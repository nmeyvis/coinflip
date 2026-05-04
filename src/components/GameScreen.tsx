import type { Dispatch } from 'react';
import { useEffect, useReducer } from 'react';
import { CHALLENGE_DEFS } from '../game/challenges';
import { isReady, newRun, reducer } from '../game/engine';
import type { Action } from '../game/engine';
import type { CoinId, CoinSide, GameState, PlacedCoin } from '../game/types';
import { Board } from './Board';
import { ChallengeHeader } from './ChallengeHeader';
import { ChallengePickerModal } from './ChallengePickerModal';
import { CoinShopModal } from './CoinShopModal';
import { CoinTray } from './CoinTray';
import { PowerUpRewardModal } from './PowerUpRewardModal';
import { TopHud } from './TopHud';

const FLIP_DELAY_MS = 320;
const FINAL_PAUSE_MS = 520;

export function GameScreen() {
  const [state, dispatch] = useReducer(reducer, undefined, newRun);

  const ready = isReady(state);
  const primary = derivePrimary(state, ready, dispatch);

  // Drive flip animation timing.
  useEffect(() => {
    if (state.phase !== 'flipping') return;
    const total = state.placed.length;
    if (state.flippingIndex < total) {
      const t = window.setTimeout(() => dispatch({ type: 'REVEAL_NEXT' }), FLIP_DELAY_MS);
      return () => window.clearTimeout(t);
    }
    const t = window.setTimeout(() => dispatch({ type: 'BEGIN_POST_FLIP' }), FINAL_PAUSE_MS);
    return () => window.clearTimeout(t);
  }, [state.phase, state.flippingIndex, state.placed.length]);

  // Keyboard shortcuts: Enter advances primary, Backspace removes last, Esc cancels mode.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;
      if (e.key === 'Enter' && primary.onClick && !primary.disabled) {
        primary.onClick();
        e.preventDefault();
      }
      if (e.key === 'Backspace' && state.phase === 'placing' && state.placed.length > 0) {
        dispatch({ type: 'REMOVE_PLACED', uid: state.placed[state.placed.length - 1].uid });
      }
      if (e.key === 'Escape') {
        if (state.phase === 'post_flip' && state.postFlipMode != null) {
          dispatch({ type: 'ENTER_POST_FLIP_MODE', mode: null });
        }
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const handlePlaceCoin = (coinId: CoinId) => dispatch({ type: 'PLACE_COIN', coinId });
  const handleRemovePlaced = (uid: string) => dispatch({ type: 'REMOVE_PLACED', uid });
  const handleSetTarget = (side: CoinSide) => dispatch({ type: 'SET_TARGET', side });
  const handleSetPrediction = (index: number, side: CoinSide) =>
    dispatch({ type: 'SET_PREDICTION', index, side });

  const handleSlotClick = (_idx: number, placed: PlacedCoin | null) => {
    if (state.phase !== 'post_flip' || !placed || !state.postFlipMode) return;
    dispatch({ type: 'POST_FLIP_APPLY', uid: placed.uid });
  };

  const handlePowerUpClick = (slotIdx: number) => {
    const slot = state.powerUps[slotIdx];
    if (!slot) return;
    if (state.phase !== 'post_flip') return;
    if (slot.id === 'coin_convert') {
      dispatch({
        type: 'ENTER_POST_FLIP_MODE',
        mode: state.postFlipMode === 'convert' ? null : 'convert',
      });
    } else if (slot.id === 'reroll_charm') {
      dispatch({
        type: 'ENTER_POST_FLIP_MODE',
        mode: state.postFlipMode === 'reroll' ? null : 'reroll',
      });
    }
  };

  const handleNewRun = () => {
    if (window.confirm('Abandon this run and start a new one?')) {
      dispatch({ type: 'NEW_RUN' });
    }
  };

  const showChallengePicker = state.phase === 'challenge_picker';
  const showRewardPicker = state.phase === 'reward_picker';
  const showShop = state.phase === 'shop';
  const trayElevated = showChallengePicker || showShop;

  return (
    <div className={`game-screen ${trayElevated ? 'tray-elevated' : ''}`}>
      <TopHud state={state} onNewRun={handleNewRun} />
      <ChallengeHeader
        state={state}
        onSetTarget={handleSetTarget}
        onSetPrediction={handleSetPrediction}
        ready={ready}
      />
      <Board
        state={state}
        onRemovePlaced={handleRemovePlaced}
        onSlotClick={handleSlotClick}
        postFlipMode={state.postFlipMode}
        primaryButton={primary}
      />
      <CoinTray
        state={state}
        onPlaceCoin={handlePlaceCoin}
        onPowerUpClick={handlePowerUpClick}
      />

      {showChallengePicker && (
        <ChallengePickerModal
          offers={state.challengeOffers}
          onChoose={(id) => dispatch({ type: 'CHOOSE_CHALLENGE', id })}
        />
      )}
      {showRewardPicker && (
        <PowerUpRewardModal
          state={state}
          onChoose={(id) => dispatch({ type: 'CHOOSE_REWARD', id })}
          onReplaceSlot={(slotIdx) => dispatch({ type: 'REPLACE_REWARD_SLOT', slotIdx })}
          onSkip={() => dispatch({ type: 'SKIP_REWARD' })}
        />
      )}
      {showShop && (
        <CoinShopModal
          state={state}
          onBuy={(idx) => dispatch({ type: 'BUY_COIN', idx })}
          onReplaceBagSlot={(idx) => dispatch({ type: 'REPLACE_BAG_SLOT', idx })}
          onCancelPurchase={() => dispatch({ type: 'CANCEL_PURCHASE' })}
          onContinue={() => dispatch({ type: 'SHOP_CONTINUE' })}
        />
      )}
    </div>
  );
}

interface PrimaryButton {
  label: string;
  disabled: boolean;
  pulse?: boolean;
  onClick?: () => void;
}

function derivePrimary(
  state: GameState,
  ready: boolean,
  dispatch: Dispatch<Action>,
): PrimaryButton {
  const def = state.activeChallenge ? CHALLENGE_DEFS[state.activeChallenge] : null;

  if (state.phase === 'challenge_picker') {
    return { label: 'Choose a Challenge', disabled: true };
  }
  if (state.phase === 'placing') {
    if (!def) return { label: 'Choose a Challenge', disabled: true };
    if (def.needsTarget && state.target == null) {
      return { label: 'Choose Target', disabled: true };
    }
    if (state.placed.length < def.slots) {
      return {
        label: `Fill Slots (${state.placed.length} / ${def.slots})`,
        disabled: true,
      };
    }
    if (!ready) return { label: 'Set up challenge', disabled: true };
    return {
      label: 'Start',
      disabled: false,
      pulse: true,
      onClick: () => dispatch({ type: 'LOCK_AND_FLIP' }),
    };
  }
  if (state.phase === 'flipping') {
    return { label: 'Flipping…', disabled: true };
  }
  if (state.phase === 'post_flip') {
    return {
      label: 'Resolve',
      disabled: false,
      pulse: true,
      onClick: () => dispatch({ type: 'RESOLVE' }),
    };
  }
  if (state.phase === 'resolved') {
    return {
      label: 'Continue',
      disabled: false,
      pulse: true,
      onClick: () => dispatch({ type: 'CONTINUE_FROM_OUTCOME' }),
    };
  }
  if (state.phase === 'reward_picker' || state.phase === 'shop') {
    return { label: '…', disabled: true };
  }
  return { label: '—', disabled: true };
}
