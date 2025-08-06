import React, { useState } from 'react';
import { WindowPanel, InventoryItem, PlayerStats, PlayerProfile, Achievement } from '@/types/gameTypes';
import { WindowManagerProvider } from './WindowManagerProvider';
import { PanelRenderer } from './PanelRenderer';

interface WindowManagerProps {
  children?: React.ReactNode;
}

export const WindowManager: React.FC<WindowManagerProps> = ({ children }) => {
  const [panels, setPanels] = useState<WindowPanel>({
    id: 'root',
    type: 'empty',
    direction: 'horizontal',
    children: [
      { id: 'panel-1', type: 'monster-hunts', size: 50 },
      { id: 'panel-2', type: 'inventory', size: 50 }
    ]
  });

  const [playerStats, setPlayerStats] = useState<PlayerStats>({
    stamina: 100,
    maxStamina: 100,
    staminaRegenRate: 5, // per minute
    activeHunts: [],
    skills: {
      attackSpeed: 2,
      criticalStrike: 1,
      resourceGathering: 3,
      staminaRecovery: 1
    }
  });

  const [inventory, setInventory] = useState<InventoryItem[]>([
    { id: 'crystal-fang', name: 'Crystal Fang', icon: '💎', rarity: 'epic', quantity: 3 },
    { id: 'wolf-hide', name: 'Wolf Hide', icon: '🐺', rarity: 'common', quantity: 15 },
    { id: 'shadow-core', name: 'Shadow Core', icon: '🌑', rarity: 'legendary', quantity: 1 },
    { id: 'drake-scale', name: 'Drake Scale', icon: '🛡️', rarity: 'rare', quantity: 7 },
    { id: 'ancient-bone', name: 'Ancient Bone', icon: '🦴', rarity: 'uncommon', quantity: 12 },
    { id: 'mystic-ore', name: 'Mystic Ore', icon: '⚡', rarity: 'epic', quantity: 5 }
  ]);

  const [playerGold, setPlayerGold] = useState(25000);

  const [playerProfile, setPlayerProfile] = useState<PlayerProfile>({
    username: 'DragonSlayer',
    faction: 'Shadow Hunters',
    level: 15,
    xp: 45000,
    xpToNextLevel: 60000,
    avatar: '🗡️',
    equippedGear: {
      weapon: { id: 'starter-sword', name: 'Starter Sword', icon: '⚔️', rarity: 'common', quantity: 1, type: 'equipment', stats: { 'attack speed': 10 } },
      armor: undefined,
      accessory: undefined
    },
    totalMonstersHunted: 234,
    totalGoldEarned: 125000,
    totalIdleTime: 86400 // 24 hours in seconds
  });

  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: 'first-hunt',
      name: 'First Hunt',
      description: 'Complete your first monster hunt',
      icon: '🗡️',
      isCompleted: true,
      progress: 1,
      maxProgress: 1,
      type: 'monsters'
    },
    {
      id: 'monster-slayer',
      name: 'Monster Slayer',
      description: 'Hunt 100 monsters',
      icon: '💀',
      isCompleted: false,
      progress: 234,
      maxProgress: 100,
      type: 'monsters'
    },
    {
      id: 'craft-master',
      name: 'Craft Master',
      description: 'Craft 50 items',
      icon: '🔨',
      isCompleted: false,
      progress: 12,
      maxProgress: 50,
      type: 'crafting'
    },
    {
      id: 'gold-hoarder',
      name: 'Gold Hoarder',
      description: 'Earn 100,000 gold',
      icon: '💰',
      isCompleted: true,
      progress: 125000,
      maxProgress: 100000,
      type: 'gold'
    },
    {
      id: 'skill-adept',
      name: 'Skill Adept',
      description: 'Reach level 5 in any skill',
      icon: '📚',
      isCompleted: false,
      progress: 3,
      maxProgress: 5,
      type: 'skills'
    },
    {
      id: 'idle-master',
      name: 'Idle Master',
      description: 'Accumulate 72 hours of idle time',
      icon: '⏰',
      isCompleted: false,
      progress: 24,
      maxProgress: 72,
      type: 'idle'
    }
  ]);

  const updatePlayerProfile = (updates: Partial<PlayerProfile>) => {
    setPlayerProfile(prev => ({ ...prev, ...updates }));
  };

  const updateAchievements = (newAchievements: Achievement[]) => {
    setAchievements(newAchievements);
  };

  const updatePlayerStats = (updates: Partial<PlayerStats>) => {
    setPlayerStats(prev => ({ ...prev, ...updates }));
  };

  const addToInventory = (newItem: InventoryItem) => {
    setInventory(prev => {
      const existingIndex = prev.findIndex(item => item.id === newItem.id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + newItem.quantity
        };
        return updated;
      } else {
        return [...prev, newItem];
      }
    });
  };

  const removeFromInventory = (itemId: string, quantity: number) => {
    setInventory(prev => 
      prev.map(item => 
        item.id === itemId 
          ? { ...item, quantity: Math.max(0, item.quantity - quantity) }
          : item
      ).filter(item => item.quantity > 0)
    );
  };

  const updatePlayerGold = (gold: number) => {
    setPlayerGold(gold);
  };

  const updateMonsterDefeatedCount = (monsterId: string) => {
    // This would normally update monster data in a more complex state
    console.log(`Monster ${monsterId} defeated!`);
  };

  return (
    <WindowManagerProvider panels={panels} setPanels={setPanels}>
      <div className="h-screen bg-background text-foreground">
        <PanelRenderer 
          panel={panels} 
          playerStats={playerStats}
          updatePlayerStats={updatePlayerStats}
          inventory={inventory}
          addToInventory={addToInventory}
          removeFromInventory={removeFromInventory}
          playerGold={playerGold}
          updatePlayerGold={updatePlayerGold}
          updateMonsterDefeatedCount={updateMonsterDefeatedCount}
          playerProfile={playerProfile}
          updatePlayerProfile={updatePlayerProfile}
          achievements={achievements}
          updateAchievements={updateAchievements}
        />
      </div>
    </WindowManagerProvider>
  );
};
