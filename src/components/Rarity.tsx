import type { Rarity } from '../game/types';

export function RarityBadge({ rarity }: { rarity: Rarity }) {
  return <span className={`rarity-badge rarity-${rarity}`}>{rarity}</span>;
}

export function rarityClass(r: Rarity): string {
  return `rarity-${r}`;
}
