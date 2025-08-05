import React, { useState } from 'react';
import { WindowPanel, InventoryItem, PlayerStats } from '@/types/gameTypes';
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
        />
      </div>
    </WindowManagerProvider>
  );
};
