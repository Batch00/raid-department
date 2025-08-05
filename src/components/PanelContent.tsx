import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Minus, SplitSquareHorizontal, SplitSquareVertical, Sword, Package, BookOpen, ShoppingCart, Hammer } from 'lucide-react';
import { WindowPanel, PanelType, InventoryItem, PlayerStats } from '@/types/gameTypes';
import { useWindowManager } from './WindowManagerProvider';
import { MonsterHuntsPanel } from './panels/MonsterHuntsPanel';
import { InventoryPanel } from './panels/InventoryPanel';
import { SkillTreePanel } from './panels/SkillTreePanel';
import { MarketplacePanel } from './panels/MarketplacePanel';
import { CraftingPanel } from './panels/CraftingPanel';

interface PanelContentProps {
  panel: WindowPanel;
  playerStats: PlayerStats;
  updatePlayerStats: (stats: Partial<PlayerStats>) => void;
  inventory: InventoryItem[];
  addToInventory: (item: InventoryItem) => void;
  removeFromInventory: (itemId: string, quantity: number) => void;
  playerGold: number;
  updatePlayerGold: (gold: number) => void;
  updateMonsterDefeatedCount: (monsterId: string) => void;
}

export const PanelContent: React.FC<PanelContentProps> = ({ 
  panel, 
  playerStats, 
  updatePlayerStats, 
  inventory, 
  addToInventory, 
  removeFromInventory, 
  playerGold, 
  updatePlayerGold,
  updateMonsterDefeatedCount
}) => {
  const { splitPanel, setPanelType, removePanel } = useWindowManager();

  const panelTypes: { value: PanelType; label: string }[] = [
    { value: 'monster-hunts', label: 'Monster Hunts' },
    { value: 'inventory', label: 'Inventory' },
    { value: 'skill-tree', label: 'Skill Tree' },
    { value: 'marketplace', label: 'Marketplace' },
    { value: 'crafting', label: 'Crafting' },
    { value: 'empty', label: 'Empty' }
  ];

  const getPanelIcon = (type: PanelType) => {
    switch (type) {
      case 'monster-hunts': return <Sword className="h-4 w-4" />;
      case 'inventory': return <Package className="h-4 w-4" />;
      case 'skill-tree': return <BookOpen className="h-4 w-4" />;
      case 'marketplace': return <ShoppingCart className="h-4 w-4" />;
      case 'crafting': return <Hammer className="h-4 w-4" />;
      default: return <Plus className="h-4 w-4" />;
    }
  };

  const getPanelThemeClass = (type: PanelType) => {
    switch (type) {
      case 'monster-hunts': return 'panel-monster-hunt';
      case 'inventory': return 'panel-inventory';
      case 'skill-tree': return 'panel-skill-tree';
      case 'marketplace': return 'panel-marketplace';
      case 'crafting': return 'panel-crafting';
      default: return '';
    }
  };

  const renderPanelContent = () => {
    switch (panel.type) {
      case 'monster-hunts':
        return (
          <MonsterHuntsPanel 
            playerStats={playerStats}
            updatePlayerStats={updatePlayerStats}
            updateMonsterDefeatedCount={updateMonsterDefeatedCount}
          />
        );
      case 'inventory':
        return <InventoryPanel inventory={inventory} />;
      case 'skill-tree':
        return (
          <SkillTreePanel 
            playerStats={playerStats}
            updatePlayerStats={updatePlayerStats}
          />
        );
      case 'marketplace':
        return (
          <MarketplacePanel 
            playerGold={playerGold}
            updatePlayerGold={updatePlayerGold}
            addToInventory={addToInventory}
          />
        );
      case 'crafting':
        return (
          <CraftingPanel 
            inventory={inventory}
            addToInventory={addToInventory}
            removeFromInventory={removeFromInventory}
          />
        );
      case 'empty':
      default:
        return (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <Plus className="h-8 w-8 mx-auto mb-2" />
              <p>Select a panel type above</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`h-full border-2 bg-card panel-hover ${getPanelThemeClass(panel.type)}`}>
      {/* Panel Header */}
      <div className="border-b border-border bg-muted/80 backdrop-blur-sm p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getPanelIcon(panel.type)}
            <select
              value={panel.type}
              onChange={(e) => setPanelType(panel.id, e.target.value as PanelType)}
              className="bg-background border border-border rounded px-2 py-1 text-sm font-medium"
            >
              {panelTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex gap-1">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => splitPanel(panel.id, 'horizontal')}
              className="h-7 w-7 hover:bg-muted"
            >
              <SplitSquareHorizontal className="h-3 w-3" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => splitPanel(panel.id, 'vertical')}
              className="h-7 w-7 hover:bg-muted"
            >
              <SplitSquareVertical className="h-3 w-3" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => removePanel(panel.id)}
              className="h-7 w-7 hover:bg-destructive/20"
            >
              <Minus className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>

      {/* Panel Content */}
      <div className="p-4 h-full overflow-auto">
        {renderPanelContent()}
      </div>
    </div>
  );
};