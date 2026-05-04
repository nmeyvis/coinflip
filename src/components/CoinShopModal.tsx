import { COIN_DEFS } from '../game/coins';
import { MAX_BAG_SIZE, MAX_DUPLICATES } from '../game/engine';
import type { GameState, ShopOffer } from '../game/types';
import { CoinIcon } from './Board';
import { RarityBadge } from './Rarity';

interface Props {
  state: GameState;
  onBuy: (idx: number) => void;
  onReplaceBagSlot: (idx: number) => void;
  onCancelPurchase: () => void;
  onContinue: () => void;
}

export function CoinShopModal({
  state,
  onBuy,
  onReplaceBagSlot,
  onCancelPurchase,
  onContinue,
}: Props) {
  const replacing = state.pendingPurchase != null;

  return (
    <div className="modal-backdrop">
      <div className="modal coin-shop">
        <div className="shop-header">
          <h2 className="modal-title">Coin Shop</h2>
          <div className="shop-shards">Shards: <span className="shard-icon">◆</span> {state.shards}</div>
        </div>

        {!replacing && (
          <div className="card-row">
            {state.shopOffers.length === 0 && (
              <div className="empty-shop">All bought! Click Continue to advance.</div>
            )}
            {state.shopOffers.map((offer, i) => (
              <ShopCard
                key={`${offer.coinId}-${i}`}
                offer={offer}
                state={state}
                onClick={() => onBuy(i)}
              />
            ))}
          </div>
        )}

        {replacing && state.pendingPurchase && (
          <>
            <div className="incoming-power">
              <div className="incoming-label">Bag full — replace which coin?</div>
              <div className="incoming-coin">
                <CoinIcon coinId={state.pendingPurchase.coinId} />
                <span>{COIN_DEFS[state.pendingPurchase.coinId].name}</span>
                <span className="price">{state.pendingPurchase.price} ◆</span>
              </div>
            </div>
            <div className="card-row">
              {state.bag.map((coinId, i) => (
                <button
                  key={i}
                  className={`shop-card rarity-${COIN_DEFS[coinId].rarity}`}
                  onClick={() => onReplaceBagSlot(i)}
                >
                  <CoinIcon coinId={coinId} />
                  <div className="coin-name">{COIN_DEFS[coinId].name}</div>
                  <div className="coin-short">{COIN_DEFS[coinId].short}</div>
                </button>
              ))}
            </div>
          </>
        )}

        <div className="modal-footer">
          {replacing ? (
            <button className="ghost-btn" onClick={onCancelPurchase}>
              Cancel
            </button>
          ) : (
            <button className="primary-btn" onClick={onContinue}>
              Continue
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

interface CardProps {
  offer: ShopOffer;
  state: GameState;
  onClick: () => void;
}

function ShopCard({ offer, state, onClick }: CardProps) {
  const def = COIN_DEFS[offer.coinId];
  const dupCount = state.bag.filter((c) => c === offer.coinId).length;
  const atDupLimit = dupCount >= MAX_DUPLICATES;
  const tooPoor = state.shards < offer.price;
  const bagFull = state.bag.length >= MAX_BAG_SIZE;
  const reason = atDupLimit
    ? 'Already at max duplicates'
    : tooPoor
    ? `Need ${offer.price - state.shards} more Shards`
    : bagFull
    ? 'Bag is full — click to replace a coin'
    : null;
  const disabled = atDupLimit || tooPoor;

  return (
    <button
      className={`shop-card rarity-${def.rarity} ${disabled ? 'disabled' : ''}`}
      onClick={onClick}
      disabled={disabled}
      title={`${def.name}\n${def.long}${reason ? `\n— ${reason}` : ''}`}
    >
      <div className="shop-card-header">
        <h3>{def.name}</h3>
        <RarityBadge rarity={def.rarity} />
      </div>
      <CoinIcon coinId={offer.coinId} />
      <p className="coin-short">{def.short}</p>
      <div className={`price ${tooPoor ? 'too-poor' : ''}`}>{offer.price} ◆</div>
      {reason && <div className="card-warn">{reason}</div>}
    </button>
  );
}
