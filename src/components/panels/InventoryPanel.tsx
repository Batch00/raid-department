import React from 'react';
import { Package } from 'lucide-react';
import { InventoryItem } from '@/types/gameTypes';

interface InventoryPanelProps {
  inventory: InventoryItem[];
  equipItem?: (item: InventoryItem) => void;
}

export const InventoryPanel: React.FC<InventoryPanelProps> = ({ inventory, equipItem }) => {
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-400 border-gray-500';
      case 'uncommon': return 'text-green-400 border-green-500';
      case 'rare': return 'text-blue-400 border-blue-500';
      case 'epic': return 'text-purple-400 border-purple-500';
      case 'legendary': return 'text-yellow-400 border-yellow-500';
      default: return 'text-gray-400 border-gray-500';
    }
  };

  const getItemTooltip = (item: InventoryItem) => {
    let tooltip = `${item.name} (${item.rarity})`;
    if (item.stats) {
      const statsText = Object.entries(item.stats).map(([stat, value]) => 
        `+${value}${stat.includes('rate') || stat.includes('regen') ? '%' : ''} ${stat}`
      ).join(', ');
      tooltip += `\n${statsText}`;
    }
    return tooltip;
  };

  // Create a grid of 24 slots
  const inventorySlots = Array.from({ length: 24 }, (_, i) => {
    return inventory[i] || null;
  });

  return (
    <div className="h-full">
      <div className="flex items-center gap-2 mb-4">
        <Package className="h-5 w-5 text-green-400" />
        <h2 className="text-lg font-bold">Inventory</h2>
      </div>
      
      <div className="grid grid-cols-6 gap-2">
        {inventorySlots.map((item, i) => (
          <div key={i} className="aspect-square border border-border rounded-lg p-1 hover:bg-muted/50 transition-all cursor-pointer">
            {item ? (
              <div 
                className={`w-full h-full rounded-md border-2 ${getRarityColor(item.rarity)} flex flex-col items-center justify-center relative overflow-hidden bg-card/50`}
                title={getItemTooltip(item)}
                onClick={() => {
                  if (item.type === 'equipment' && equipItem) {
                    if (confirm(`Equip ${item.name}?`)) {
                      equipItem(item);
                    }
                  }
                }}
              >
                <div className="text-lg mb-1">{item.icon}</div>
                <div className="text-[10px] font-medium text-center leading-tight px-1">
                  {item.name}
                </div>
                <div className="absolute bottom-0 right-0 bg-black/70 text-white text-[8px] px-1 rounded-tl">
                  {item.quantity}
                </div>
                {item.type === 'equipment' && (
                  <div className="absolute top-0 left-0 bg-yellow-600/80 text-white text-[8px] px-1 rounded-br">
                    E
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full h-full bg-muted/20 rounded-md border border-dashed border-muted-foreground/30" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};