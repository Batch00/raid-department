export type PanelType = 'monster-hunts' | 'inventory' | 'skill-tree' | 'marketplace' | 'crafting' | 'gear-upgrading' | 'player-profile' | 'achievements' | 'leaderboards' | 'hunt-history' | 'empty';

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
  isEvolved?: boolean;
  evolvedFrom?: string;
  evolutionRequirement?: {
    type: 'kills' | 'playerLevel';
    value: number;
  };
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

export interface PlayerProfile {
  username: string;
  faction: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  avatar: string;
  equippedGear: {
    weapon?: InventoryItem;
    armor?: InventoryItem;
    accessory?: InventoryItem;
  };
  totalMonstersHunted: number;
  totalGoldEarned: number;
  totalIdleTime: number; // in seconds
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

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  isCompleted: boolean;
  progress: number;
  maxProgress: number;
  type: 'monsters' | 'crafting' | 'gold' | 'skills' | 'idle';
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  value: number;
  faction: string;
}