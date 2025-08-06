export type PanelType = 'monster-hunts' | 'inventory' | 'skill-tree' | 'marketplace' | 'crafting' | 'gear-upgrading' | 'empty';

export interface WindowPanel {
  id: string;
  type: PanelType;
  direction?: 'horizontal' | 'vertical';
  children?: WindowPanel[];
  size?: number;
}

export interface Monster {
  id: string;
  name: string;
  biome: string;
  level: number;
  icon: string;
  huntTime: number; // in seconds
  drops: InventoryItem[];
  goldReward: number;
  defeatedCount: number;
  isAutoHuntUnlocked: boolean;
}

export interface InventoryItem {
  id: string;
  name: string;
  icon: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  quantity: number;
  type?: 'material' | 'equipment' | 'consumable';
  stats?: { [key: string]: number };
  level?: number;
  experience?: number;
  source?: string; // Where the item can be obtained
}

export interface PlayerStats {
  stamina: number;
  maxStamina: number;
  staminaRegenRate: number; // per minute
  activeHunts: string[]; // monster IDs
  skills: { [skillName: string]: number };
}

export interface Biome {
  id: string;
  name: string;
  color: string;
  monsters: Monster[];
}

export interface CraftingRecipe {
  id: string;
  name: string;
  category: 'weapon' | 'armor' | 'consumable';
  result: InventoryItem;
  materials: { itemId: string; quantity: number }[];
  requiredLevel?: number;
}

export interface GearUpgrade {
  id: string;
  name: string;
  currentRarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  nextRarity: 'uncommon' | 'rare' | 'epic' | 'legendary';
  materials: { itemId: string; quantity: number }[];
  goldCost: number;
  successRate: number;
}