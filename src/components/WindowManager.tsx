import React, { useState, createContext, useContext } from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { Button } from '@/components/ui/button';
import { Plus, Minus, SplitSquareHorizontal, SplitSquareVertical } from 'lucide-react';

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

  return (
    <div className="h-full border border-border bg-card">
      {/* Panel Header */}
      <div className="border-b border-border bg-muted p-2">
        <div className="flex items-center justify-between">
          <select
            value={panel.type}
            onChange={(e) => setPanelType(panel.id, e.target.value as PanelType)}
            className="bg-background border border-border rounded px-2 py-1 text-sm"
          >
            {panelTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          
          <div className="flex gap-1">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => splitPanel(panel.id, 'horizontal')}
              className="h-6 w-6"
            >
              <SplitSquareHorizontal className="h-3 w-3" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => splitPanel(panel.id, 'vertical')}
              className="h-6 w-6"
            >
              <SplitSquareVertical className="h-3 w-3" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => removePanel(panel.id)}
              className="h-6 w-6"
            >
              <Minus className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>

      {/* Panel Content */}
      <div className="p-4 h-full">
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

// Placeholder Panel Components
const MonsterHuntsPanel = () => (
  <div className="h-full">
    <h2 className="text-lg font-bold mb-4">Monster Hunts</h2>
    <div className="space-y-2">
      <div className="p-3 border border-border rounded bg-muted/50">
        <h3 className="font-semibold">Shadow Wolf</h3>
        <p className="text-sm text-muted-foreground">Drops: Shadow Essence, Wolf Pelt</p>
        <div className="mt-2">
          <Button size="sm">Start Hunt</Button>
        </div>
      </div>
      <div className="p-3 border border-border rounded bg-muted/50">
        <h3 className="font-semibold">Crystal Drake</h3>
        <p className="text-sm text-muted-foreground">Drops: Crystal Shard, Drake Scale</p>
        <div className="mt-2">
          <Button size="sm">Start Hunt</Button>
        </div>
      </div>
    </div>
  </div>
);

const InventoryPanel = () => (
  <div className="h-full">
    <h2 className="text-lg font-bold mb-4">Inventory</h2>
    <div className="grid grid-cols-6 gap-2">
      {Array.from({ length: 24 }, (_, i) => (
        <div key={i} className="aspect-square border border-border rounded bg-muted/30 p-1">
          {i < 4 && (
            <div className="w-full h-full bg-primary/20 rounded flex items-center justify-center text-xs">
              Item {i + 1}
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
);

const SkillTreePanel = () => (
  <div className="h-full">
    <h2 className="text-lg font-bold mb-4">Skill Tree</h2>
    <div className="space-y-4">
      <div className="p-3 border border-border rounded">
        <h3 className="font-semibold">Combat Skills</h3>
        <div className="mt-2 space-y-1">
          <div className="flex justify-between">
            <span>Attack Speed</span>
            <span>Level 5</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div className="bg-primary h-2 rounded-full" style={{ width: '50%' }}></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const MarketplacePanel = () => (
  <div className="h-full">
    <h2 className="text-lg font-bold mb-4">Marketplace</h2>
    <div className="space-y-2">
      <div className="p-3 border border-border rounded bg-muted/50">
        <div className="flex justify-between">
          <span>Shadow Essence x10</span>
          <span className="text-primary">1,500 gold</span>
        </div>
        <Button size="sm" className="mt-2">Buy</Button>
      </div>
      <div className="p-3 border border-border rounded bg-muted/50">
        <div className="flex justify-between">
          <span>Crystal Shard x5</span>
          <span className="text-primary">2,000 gold</span>
        </div>
        <Button size="sm" className="mt-2">Buy</Button>
      </div>
    </div>
  </div>
);

const CraftingPanel = () => (
  <div className="h-full">
    <h2 className="text-lg font-bold mb-4">Crafting</h2>
    <div className="space-y-4">
      <div className="p-3 border border-border rounded">
        <h3 className="font-semibold">Shadow Blade</h3>
        <p className="text-sm text-muted-foreground">Requires: Shadow Essence x3, Iron Ore x2</p>
        <Button size="sm" className="mt-2">Craft</Button>
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