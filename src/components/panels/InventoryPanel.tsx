import React from 'react';
import { Package } from 'lucide-react';
import { InventoryItem } from '@/types/gameTypes';

interface InventoryPanelProps {
  inventory: InventoryItem[];
}

export const InventoryPanel: React.FC<InventoryPanelProps> = ({ inventory }) => {
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

  const getItemTooltip = (item: InventoryItem) => {
    if (item.type === 'equipment' && item.stats) {
      return Object.entries(item.stats).map(([stat, value]) => 
        `${stat}: +${value}${stat.includes('rate') ? '%' : ''}`
      ).join('\n');
    }
    return item.name;
  };

  return (
    <div className="h-full">
      <div className="flex items-center gap-2 mb-4">
        <Package className="h-5 w-5 text-green-400" />
        <h2 className="text-lg font-bold">Inventory</h2>
        <div className="ml-auto text-sm text-muted-foreground">
          {inventory.length}/24 slots
        </div>
      </div>
      <div className="grid grid-cols-6 gap-2">
        {Array.from({ length: 24 }, (_, i) => {
          const item = inventory[i];
          return (
            <div key={i} className="aspect-square border border-border rounded-lg p-1 hover:bg-muted/50 transition-all cursor-pointer">
              {item ? (
                <div 
                  className={`w-full h-full rounded-md border-2 rarity-${item.rarity} ${getRarityColor(item.rarity)} flex flex-col items-center justify-center relative overflow-hidden`}
                  title={getItemTooltip(item)}
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
          );
        })}
      </div>
    </div>
  );
};