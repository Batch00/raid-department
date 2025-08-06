import React from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { WindowPanel, PanelType, InventoryItem, PlayerStats, PlayerProfile, Achievement } from '@/types/gameTypes';
import { PanelContent } from './PanelContent';

interface PanelRendererProps {
  panel: WindowPanel;
  playerStats: PlayerStats;
  updatePlayerStats: (stats: Partial<PlayerStats>) => void;
  inventory: InventoryItem[];
  addToInventory: (item: InventoryItem) => void;
  removeFromInventory: (itemId: string, quantity: number) => void;
  playerGold: number;
  updatePlayerGold: (gold: number) => void;
  updateMonsterDefeatedCount: (monsterId: string) => void;
  playerProfile: PlayerProfile;
  updatePlayerProfile: (updates: Partial<PlayerProfile>) => void;
  achievements: Achievement[];
  updateAchievements: (achievements: Achievement[]) => void;
}

export const PanelRenderer: React.FC<PanelRendererProps> = ({ 
  panel, 
  playerStats, 
  updatePlayerStats, 
  inventory, 
  addToInventory, 
  removeFromInventory, 
  playerGold, 
  updatePlayerGold,
  updateMonsterDefeatedCount,
  playerProfile,
  updatePlayerProfile,
  achievements,
  updateAchievements
}) => {
  if (panel.children && panel.children.length > 0) {
    return (
      <ResizablePanelGroup direction={panel.direction || 'horizontal'}>
        {panel.children.map((child, index) => (
          <React.Fragment key={child.id}>
            <ResizablePanel defaultSize={child.size || 50} minSize={20}>
              <PanelRenderer 
                panel={child} 
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
            </ResizablePanel>
            {index < panel.children!.length - 1 && (
              <ResizableHandle withHandle />
            )}
          </React.Fragment>
        ))}
      </ResizablePanelGroup>
    );
  }

  return (
    <PanelContent 
      panel={panel} 
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
  );
};