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
    direction: 'vertical',
    children: [
      {
        id: 'top-row',
        type: 'empty',
        direction: 'horizontal',
        children: [
          {
            id: 'player-panel',
            type: 'player-profile',
            size: 25
          },
          {
            id: 'inventory-panel',
            type: 'inventory',
            size: 25
          },
          {
            id: 'skills-panel',
            type: 'skill-tree',
            size: 25
          },
          {
            id: 'achievements-panel',
            type: 'achievements',
            size: 25
          }
        ],
        size: 30
      },
      {
        id: 'middle-row',
        type: 'empty',
        direction: 'horizontal',
        children: [
          {
            id: 'hunt-panel',
            type: 'monster-hunts',
            size: 40
          },
          {
            id: 'marketplace-panel',
            type: 'marketplace',
            size: 30
          },
          {
            id: 'history-panel',
            type: 'hunt-history',
            size: 30
          }
        ],
        size: 40
      },
      {
        id: 'bottom-row',
        type: 'empty',
        direction: 'horizontal',
        children: [
          {
            id: 'crafting-panel',
            type: 'crafting',
            size: 50
          },
          {
            id: 'upgrading-panel',
            type: 'gear-upgrading',
            size: 50
          }
        ],
        size: 30
      }
    ]
  });

  const [playerStats, setPlayerStats] = useState<PlayerStats>({
    stamina: 100,
    maxStamina: 100,
    staminaRegenRate: 10,
    activeHunts: [],
    skills: {}
  });

  const [inventory, setInventory] = useState<InventoryItem[]>([
    { id: 'iron-sword', name: 'Iron Sword', icon: '⚔️', rarity: 'common', quantity: 1, type: 'equipment', equipmentType: 'weapon', stats: { 'attack speed': 10 } },
    { id: 'leather-armor', name: 'Leather Armor', icon: '🛡️', rarity: 'common', quantity: 1, type: 'equipment', equipmentType: 'armor', stats: { 'defense': 5 } },
    { id: 'health-potion', name: 'Health Potion', icon: '🧪', rarity: 'common', quantity: 5, type: 'consumable' },
    { id: 'shadow-essence', name: 'Shadow Essence', icon: '🌑', rarity: 'uncommon', quantity: 2, type: 'material' },
    { id: 'iron-ore', name: 'Iron Ore', icon: '⛏️', rarity: 'common', quantity: 5, type: 'material' },
    { id: 'crystal-shard', name: 'Crystal Shard', icon: '💎', rarity: 'rare', quantity: 3, type: 'material' },
    { id: 'leather', name: 'Leather', icon: '🦴', rarity: 'common', quantity: 4, type: 'material' },
    { id: 'herb', name: 'Herb', icon: '🌿', rarity: 'common', quantity: 8, type: 'material' },
    { id: 'pure-water', name: 'Pure Water', icon: '💧', rarity: 'common', quantity: 3, type: 'material' },
    { id: 'luck-ring', name: 'Lucky Ring', icon: '💍', rarity: 'uncommon', quantity: 1, type: 'equipment', equipmentType: 'ring', stats: { 'loot bonus': 15 } },
    { id: 'speed-amulet', name: 'Speed Amulet', icon: '🔮', rarity: 'rare', quantity: 1, type: 'equipment', equipmentType: 'amulet', stats: { 'hunt speed': 20 } },
    { id: 'exp-trinket', name: 'Experience Trinket', icon: '✨', rarity: 'epic', quantity: 1, type: 'equipment', equipmentType: 'trinket', stats: { 'xp bonus': 25 } }
  ]);

  const [playerGold, setPlayerGold] = useState(10000);
  const [playerProfile, setPlayerProfile] = useState<PlayerProfile>({
    username: 'ShadowHunter',
    faction: 'Shadow Hunters',
    level: 1,
    xp: 0,
    xpToNextLevel: 1000,
    avatar: '🦸‍♂️',
    equippedGear: {},
    totalMonstersHunted: 0,
    totalGoldEarned: 0,
    totalIdleTime: 0,
    autoEquipEnabled: false
  });
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: 'first-hunt',
      name: 'First Hunt',
      description: 'Complete your first monster hunt',
      icon: '🎯',
      isCompleted: false,
      progress: 0,
      maxProgress: 1,
      type: 'monsters'
    },
    {
      id: 'master-crafter',
      name: 'Master Crafter',
      description: 'Craft 10 items',
      icon: '🔨',
      isCompleted: false,
      progress: 0,
      maxProgress: 10,
      type: 'crafting'
    },
    {
      id: 'gold-collector',
      name: 'Gold Collector',
      description: 'Earn 50,000 gold',
      icon: '💰',
      isCompleted: false,
      progress: 0,
      maxProgress: 50000,
      type: 'gold'
    }
  ]);
  const [huntHistory, setHuntHistory] = useState<any[]>([]);
  const [zoomLevel, setZoomLevel] = useState(1);

  const addToHuntHistory = (entry: any) => {
    setHuntHistory(prev => [entry, ...prev].slice(0, 100)); // Keep last 100 entries
  };

  const updatePlayerProfile = (updates: Partial<PlayerProfile>) => {
    setPlayerProfile(prev => ({ ...prev, ...updates }));
  };

  const updateAchievements = (newAchievements: Achievement[]) => {
    setAchievements(newAchievements);
  };

  const updatePlayerStats = (stats: Partial<PlayerStats>) => {
    setPlayerStats(prev => ({ ...prev, ...stats }));
  };

  const addToInventory = (item: InventoryItem) => {
    setInventory(prev => {
      const existingItem = prev.find(i => i.id === item.id);
      if (existingItem) {
        return prev.map(i => 
          i.id === item.id 
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }
      return [...prev, item];
    });
  };

  const equipItem = (item: InventoryItem) => {
    if (!item.type || item.type !== 'equipment') return;
    
    // Determine equipment slot based on equipmentType or stats
    let slotType = item.equipmentType;
    if (!slotType) {
      if (item.stats && 'defense' in item.stats) slotType = 'armor';
      else if (item.stats && ('attack speed' in item.stats || 'crit chance' in item.stats)) slotType = 'weapon';
      else slotType = 'ring'; // Default accessory slot
    }
    
    setPlayerProfile(prev => ({
      ...prev,
      equippedGear: {
        ...prev.equippedGear,
        [slotType]: item
      }
    }));
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

  const updateMonsterDefeatedCount = (monsterId: string, loot: InventoryItem[], goldReward: number, xpGained: number) => {
    console.log(`Monster ${monsterId} defeated!`);
    
    // Add loot to inventory
    loot.forEach(item => addToInventory(item));
    
    // Add gold and XP
    setPlayerGold(prev => prev + goldReward);
    setPlayerProfile(prev => {
      const newXp = prev.xp + xpGained;
      const levelUp = newXp >= prev.xpToNextLevel;
      return {
        ...prev,
        xp: levelUp ? newXp - prev.xpToNextLevel : newXp,
        level: levelUp ? prev.level + 1 : prev.level,
        xpToNextLevel: levelUp ? prev.xpToNextLevel * 1.5 : prev.xpToNextLevel,
        totalMonstersHunted: prev.totalMonstersHunted + 1,
        totalGoldEarned: prev.totalGoldEarned + goldReward
      };
    });

    // Add to hunt history
    addToHuntHistory({
      id: Date.now().toString(),
      monsterId,
      timeCompleted: new Date().toLocaleTimeString(),
      loot,
      goldEarned: goldReward,
      xpGained
    });

    // Update achievements
    setAchievements(prev => prev.map(achievement => {
      if (achievement.id === 'first-hunt' && !achievement.isCompleted) {
        return { ...achievement, progress: 1, isCompleted: true };
      }
      if (achievement.id === 'gold-collector') {
        const newProgress = Math.min(achievement.progress + goldReward, achievement.maxProgress);
        return { ...achievement, progress: newProgress, isCompleted: newProgress >= achievement.maxProgress };
      }
      return achievement;
    }));
  };

  return (
    <WindowManagerProvider panels={panels} setPanels={setPanels}>
      <div className="h-screen bg-background text-foreground">
        <div className="fixed bottom-4 right-4 z-50 flex gap-2">
          <button 
            onClick={() => setZoomLevel(prev => Math.max(0.5, prev - 0.1))}
            className="px-3 py-1 bg-card border border-border rounded text-sm hover:bg-accent shadow-lg"
          >
            Zoom Out
          </button>
          <span className="px-3 py-1 bg-card border border-border rounded text-sm shadow-lg">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button 
            onClick={() => setZoomLevel(prev => Math.min(2, prev + 0.1))}
            className="px-3 py-1 bg-card border border-border rounded text-sm hover:bg-accent shadow-lg"
          >
            Zoom In
          </button>
        </div>
        <div style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top left', width: `${100 / zoomLevel}%`, height: `${100 / zoomLevel}%` }}>
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
            equipItem={equipItem}
            huntHistory={huntHistory}
          />
        </div>
      </div>
    </WindowManagerProvider>
  );
};