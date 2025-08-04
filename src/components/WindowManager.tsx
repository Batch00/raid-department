import React, { useState, createContext, useContext } from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { Button } from '@/components/ui/button';
import { Plus, Minus, SplitSquareHorizontal, SplitSquareVertical, Sword, Package, BookOpen, ShoppingCart, Hammer, Zap, Shield, Gem } from 'lucide-react';

export type PanelType = 'monster-hunts' | 'inventory' | 'skill-tree' | 'marketplace' | 'crafting' | 'empty';

export interface WindowPanel {
  id: string;
  type: PanelType;
  direction?: 'horizontal' | 'vertical';
  children?: WindowPanel[];
  size?: number;
}

interface WindowManagerContextType {
  splitPanel: (panelId: string, direction: 'horizontal' | 'vertical') => void;
  setPanelType: (panelId: string, type: PanelType) => void;
  removePanel: (panelId: string) => void;
}

const WindowManagerContext = createContext<WindowManagerContextType | null>(null);

export const useWindowManager = () => {
  const context = useContext(WindowManagerContext);
  if (!context) {
    throw new Error('useWindowManager must be used within WindowManagerProvider');
  }
  return context;
};

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

  const splitPanel = (panelId: string, direction: 'horizontal' | 'vertical') => {
    setPanels(prev => {
      const updatePanel = (panel: WindowPanel): WindowPanel => {
        if (panel.id === panelId && !panel.children) {
          // Convert leaf panel to container with two children
          return {
            ...panel,
            direction,
            children: [
              { id: `${panelId}-1`, type: panel.type, size: 50 },
              { id: `${panelId}-2`, type: 'empty', size: 50 }
            ],
            type: 'empty' // Container panels are empty
          };
        }
        
        if (panel.children) {
          return {
            ...panel,
            children: panel.children.map(updatePanel)
          };
        }
        
        return panel;
      };
      
      return updatePanel(prev);
    });
  };

  const setPanelType = (panelId: string, type: PanelType) => {
    setPanels(prev => {
      const updatePanel = (panel: WindowPanel): WindowPanel => {
        if (panel.id === panelId) {
          return { ...panel, type };
        }
        
        if (panel.children) {
          return {
            ...panel,
            children: panel.children.map(updatePanel)
          };
        }
        
        return panel;
      };
      
      return updatePanel(prev);
    });
  };

  const removePanel = (panelId: string) => {
    setPanels(prev => {
      const removeFromPanel = (panel: WindowPanel): WindowPanel | null => {
        if (panel.children) {
          const filteredChildren = panel.children
            .map(removeFromPanel)
            .filter((child): child is WindowPanel => child !== null);
          
          // If only one child remains, promote it up
          if (filteredChildren.length === 1) {
            return filteredChildren[0];
          }
          
          return {
            ...panel,
            children: filteredChildren
          };
        }
        
        return panel.id === panelId ? null : panel;
      };
      
      return removeFromPanel(prev) || { id: 'root', type: 'empty', direction: 'horizontal', children: [] };
    });
  };

  const contextValue: WindowManagerContextType = {
    splitPanel,
    setPanelType,
    removePanel
  };

  return (
    <WindowManagerContext.Provider value={contextValue}>
      <div className="h-screen bg-background text-foreground">
        <RenderPanel panel={panels} />
      </div>
    </WindowManagerContext.Provider>
  );
};

interface RenderPanelProps {
  panel: WindowPanel;
}

const RenderPanel: React.FC<RenderPanelProps> = ({ panel }) => {
  if (panel.children && panel.children.length > 0) {
    return (
      <ResizablePanelGroup direction={panel.direction || 'horizontal'}>
        {panel.children.map((child, index) => (
          <React.Fragment key={child.id}>
            <ResizablePanel defaultSize={child.size || 50}>
              <RenderPanel panel={child} />
            </ResizablePanel>
            {index < panel.children!.length - 1 && (
              <ResizableHandle withHandle />
            )}
          </React.Fragment>
        ))}
      </ResizablePanelGroup>
    );
  }

  return <PanelContent panel={panel} />;
};

interface PanelContentProps {
  panel: WindowPanel;
}

const PanelContent: React.FC<PanelContentProps> = ({ panel }) => {
  const { splitPanel, setPanelType, removePanel } = useWindowManager();

  const panelTypes: { value: PanelType; label: string }[] = [
    { value: 'monster-hunts', label: 'Monster Hunts' },
    { value: 'inventory', label: 'Inventory' },
    { value: 'skill-tree', label: 'Skill Tree' },
    { value: 'marketplace', label: 'Marketplace' },
    { value: 'crafting', label: 'Crafting' },
    { value: 'empty', label: 'Empty' }
  ];

  const getCurrentPanelLabel = () => {
    return panelTypes.find(p => p.value === panel.type)?.label || 'Unknown';
  };

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
        <PanelRenderer type={panel.type} />
      </div>
    </div>
  );
};

interface PanelRendererProps {
  type: PanelType;
}

const PanelRenderer: React.FC<PanelRendererProps> = ({ type }) => {
  switch (type) {
    case 'monster-hunts':
      return <MonsterHuntsPanel />;
    case 'inventory':
      return <InventoryPanel />;
    case 'skill-tree':
      return <SkillTreePanel />;
    case 'marketplace':
      return <MarketplacePanel />;
    case 'crafting':
      return <CraftingPanel />;
    case 'empty':
    default:
      return <EmptyPanel />;
  }
};

// Enhanced Panel Components
const MonsterHuntsPanel = () => (
  <div className="h-full">
    <div className="flex items-center gap-2 mb-4">
      <Sword className="h-5 w-5 text-red-400" />
      <h2 className="text-lg font-bold">Active Hunts</h2>
    </div>
    <div className="space-y-3">
      <div className="p-4 border-2 border-red-500/30 rounded-lg bg-gradient-to-r from-red-950/20 to-red-900/10 hover:border-red-400/50 transition-all">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
            <Zap className="h-5 w-5 text-red-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-red-100">Shadow Wolf</h3>
            <p className="text-sm text-red-300">Drops: Shadow Essence, Wolf Pelt</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="text-xs text-red-400">⚔️ Level 15</div>
              <div className="text-xs text-yellow-400">💰 150 gold/kill</div>
            </div>
          </div>
          <Button size="sm" className="bg-red-600 hover:bg-red-500 text-white">Hunt</Button>
        </div>
      </div>
      <div className="p-4 border-2 border-purple-500/30 rounded-lg bg-gradient-to-r from-purple-950/20 to-purple-900/10 hover:border-purple-400/50 transition-all">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
            <Shield className="h-5 w-5 text-purple-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-purple-100">Crystal Drake</h3>
            <p className="text-sm text-purple-300">Drops: Crystal Shard, Drake Scale</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="text-xs text-purple-400">⚔️ Level 25</div>
              <div className="text-xs text-yellow-400">💰 350 gold/kill</div>
            </div>
          </div>
          <Button size="sm" className="bg-purple-600 hover:bg-purple-500 text-white">Hunt</Button>
        </div>
      </div>
    </div>
  </div>
);

const InventoryPanel = () => {
  const inventoryItems = [
    { id: 1, name: "Crystal Fang", icon: "💎", rarity: "epic", quantity: 3 },
    { id: 2, name: "Wolf Hide", icon: "🐺", rarity: "common", quantity: 15 },
    { id: 3, name: "Shadow Core", icon: "🌑", rarity: "legendary", quantity: 1 },
    { id: 4, name: "Drake Scale", icon: "🛡️", rarity: "rare", quantity: 7 },
    { id: 5, name: "Ancient Bone", icon: "🦴", rarity: "uncommon", quantity: 12 },
    { id: 6, name: "Mystic Ore", icon: "⚡", rarity: "epic", quantity: 5 }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-400 border-gray-600';
      case 'uncommon': return 'text-green-400 border-green-600';
      case 'rare': return 'text-blue-400 border-blue-600';
      case 'epic': return 'text-purple-400 border-purple-600';
      case 'legendary': return 'text-yellow-400 border-yellow-600';
      default: return 'text-gray-400 border-gray-600';
    }
  };

  return (
    <div className="h-full">
      <div className="flex items-center gap-2 mb-4">
        <Package className="h-5 w-5 text-green-400" />
        <h2 className="text-lg font-bold">Inventory</h2>
        <div className="ml-auto text-sm text-muted-foreground">6/24 slots</div>
      </div>
      <div className="grid grid-cols-6 gap-2">
        {Array.from({ length: 24 }, (_, i) => {
          const item = inventoryItems[i];
          return (
            <div key={i} className="aspect-square border border-border rounded-lg p-1 hover:bg-muted/50 transition-all cursor-pointer">
              {item ? (
                <div className={`w-full h-full rounded-md border-2 rarity-${item.rarity} ${getRarityColor(item.rarity)} flex flex-col items-center justify-center relative overflow-hidden`}>
                  <div className="text-lg mb-1">{item.icon}</div>
                  <div className="text-[10px] font-medium text-center leading-tight px-1">{item.name}</div>
                  <div className="absolute bottom-0 right-0 bg-black/70 text-white text-[8px] px-1 rounded-tl">
                    {item.quantity}
                  </div>
                </div>
              ) : (
                <div className="w-full h-full bg-muted/20 rounded-md border border-dashed border-muted-foreground/30" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const SkillTreePanel = () => (
  <div className="h-full">
    <div className="flex items-center gap-2 mb-4">
      <BookOpen className="h-5 w-5 text-yellow-400" />
      <h2 className="text-lg font-bold">Skill Tree</h2>
    </div>
    <div className="space-y-4">
      <div className="p-4 border-2 border-yellow-500/30 rounded-lg bg-gradient-to-r from-yellow-950/20 to-yellow-900/10">
        <div className="flex items-center gap-3 mb-3">
          <Zap className="h-4 w-4 text-yellow-400" />
          <h3 className="font-semibold text-yellow-100">Combat Skills</h3>
        </div>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm">Attack Speed</span>
              <span className="text-sm text-yellow-400">Level 5/10</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-gradient-to-r from-yellow-600 to-yellow-400 h-2 rounded-full" style={{ width: '50%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm">Critical Strike</span>
              <span className="text-sm text-yellow-400">Level 3/10</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-gradient-to-r from-yellow-600 to-yellow-400 h-2 rounded-full" style={{ width: '30%' }}></div>
            </div>
          </div>
        </div>
      </div>
      <div className="p-4 border-2 border-green-500/30 rounded-lg bg-gradient-to-r from-green-950/20 to-green-900/10">
        <div className="flex items-center gap-3 mb-3">
          <Shield className="h-4 w-4 text-green-400" />
          <h3 className="font-semibold text-green-100">Survival Skills</h3>
        </div>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm">Resource Gathering</span>
              <span className="text-sm text-green-400">Level 7/10</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-gradient-to-r from-green-600 to-green-400 h-2 rounded-full" style={{ width: '70%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const MarketplacePanel = () => (
  <div className="h-full">
    <div className="flex items-center gap-2 mb-4">
      <ShoppingCart className="h-5 w-5 text-purple-400" />
      <h2 className="text-lg font-bold">Marketplace</h2>
    </div>
    <div className="space-y-3">
      <div className="p-4 border-2 border-purple-500/30 rounded-lg bg-gradient-to-r from-purple-950/20 to-purple-900/10 hover:border-purple-400/50 transition-all">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-lg">🌑</div>
            <div>
              <div className="font-semibold text-purple-100">Shadow Essence</div>
              <div className="text-sm text-purple-300">Quantity: 10</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-yellow-400 font-bold">1,500 💰</div>
            <Button size="sm" className="mt-1 bg-purple-600 hover:bg-purple-500">Buy</Button>
          </div>
        </div>
      </div>
      <div className="p-4 border-2 border-blue-500/30 rounded-lg bg-gradient-to-r from-blue-950/20 to-blue-900/10 hover:border-blue-400/50 transition-all">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-lg">💎</div>
            <div>
              <div className="font-semibold text-blue-100">Crystal Shard</div>
              <div className="text-sm text-blue-300">Quantity: 5</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-yellow-400 font-bold">2,000 💰</div>
            <Button size="sm" className="mt-1 bg-blue-600 hover:bg-blue-500">Buy</Button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const CraftingPanel = () => (
  <div className="h-full">
    <div className="flex items-center gap-2 mb-4">
      <Hammer className="h-5 w-5 text-orange-400" />
      <h2 className="text-lg font-bold">Crafting</h2>
    </div>
    <div className="space-y-4">
      <div className="p-4 border-2 border-orange-500/30 rounded-lg bg-gradient-to-r from-orange-950/20 to-orange-900/10">
        <div className="flex items-center gap-3 mb-3">
          <Sword className="h-4 w-4 text-orange-400" />
          <h3 className="font-semibold text-orange-100">Shadow Blade</h3>
        </div>
        <div className="mb-3">
          <p className="text-sm text-orange-300 mb-2">Required Materials:</p>
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-1 bg-orange-950/40 px-2 py-1 rounded text-xs">
              <span>🌑</span>
              <span>Shadow Essence x3</span>
            </div>
            <div className="flex items-center gap-1 bg-orange-950/40 px-2 py-1 rounded text-xs">
              <span>⛏️</span>
              <span>Iron Ore x2</span>
            </div>
          </div>
        </div>
        <Button size="sm" className="bg-orange-600 hover:bg-orange-500 text-white">Craft Weapon</Button>
      </div>
      <div className="p-4 border-2 border-green-500/30 rounded-lg bg-gradient-to-r from-green-950/20 to-green-900/10">
        <div className="flex items-center gap-3 mb-3">
          <Gem className="h-4 w-4 text-green-400" />
          <h3 className="font-semibold text-green-100">Health Potion</h3>
        </div>
        <div className="mb-3">
          <p className="text-sm text-green-300 mb-2">Required Materials:</p>
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-1 bg-green-950/40 px-2 py-1 rounded text-xs">
              <span>🌿</span>
              <span>Herb x5</span>
            </div>
            <div className="flex items-center gap-1 bg-green-950/40 px-2 py-1 rounded text-xs">
              <span>💧</span>
              <span>Pure Water x1</span>
            </div>
          </div>
        </div>
        <Button size="sm" className="bg-green-600 hover:bg-green-500 text-white">Craft Potion</Button>
      </div>
    </div>
  </div>
);

const EmptyPanel = () => (
  <div className="h-full flex items-center justify-center text-muted-foreground">
    <div className="text-center">
      <Plus className="h-8 w-8 mx-auto mb-2" />
      <p>Select a panel type above</p>
    </div>
  </div>
);