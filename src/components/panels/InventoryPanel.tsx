import React, { useState, useMemo } from 'react';
import { Package, Filter, Search, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InventoryItem } from '@/types/gameTypes';
import { toast } from 'sonner';

interface InventoryPanelProps {
  inventory: InventoryItem[];
  equipItem?: (item: InventoryItem) => void;
}

type FilterType = 'all' | 'equipment' | 'material' | 'consumable';
type SortType = 'name' | 'rarity' | 'quantity';

export const InventoryPanel: React.FC<InventoryPanelProps> = ({ inventory, equipItem }) => {
  const [filter, setFilter] = useState<FilterType>('all');
  const [sort, setSort] = useState<SortType>('rarity');
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

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

  const getRarityOrder = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 5;
      case 'epic': return 4;
      case 'rare': return 3;
      case 'uncommon': return 2;
      case 'common': return 1;
      default: return 0;
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

  const filteredAndSortedInventory = useMemo(() => {
    let filtered = inventory.filter(item => {
      if (filter !== 'all' && item.type !== filter) return false;
      if (search && !item.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });

    filtered.sort((a, b) => {
      switch (sort) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rarity':
          return getRarityOrder(b.rarity) - getRarityOrder(a.rarity);
        case 'quantity':
          return b.quantity - a.quantity;
        default:
          return 0;
      }
    });

    return filtered;
  }, [inventory, filter, sort, search]);

  const handleEquipItem = (item: InventoryItem) => {
    if (item.type === 'equipment' && equipItem) {
      // Show equipment type being equipped
      const slotType = item.equipmentType || 'equipment';
      equipItem(item);
      toast.success(`Equipped ${item.name}!`, {
        description: `${item.name} is now equipped in your ${slotType} slot and ready for battle.`
      });
    } else if (item.type !== 'equipment') {
      toast.error(`Cannot equip ${item.name}`, {
        description: 'This item is not equipment and cannot be equipped.'
      });
    }
  };

  // Create grid slots for visual consistency
  const gridSlots = Array.from({ length: 24 }, (_, i) => {
    return filteredAndSortedInventory[i] || null;
  });

  const filterButtons = [
    { type: 'all' as FilterType, label: 'All', icon: Package },
    { type: 'equipment' as FilterType, label: 'Equipment', icon: Package },
    { type: 'material' as FilterType, label: 'Materials', icon: Package },
    { type: 'consumable' as FilterType, label: 'Consumables', icon: Package }
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <Package className="h-5 w-5 text-green-400" />
        <h2 className="text-lg font-bold">Inventory</h2>
        <span className="text-sm text-muted-foreground">({inventory.length}/24)</span>
      </div>

      {/* Controls */}
      <div className="space-y-3 mb-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filter buttons */}
        <div className="flex gap-1 flex-wrap">
          {filterButtons.map(({ type, label }) => (
            <Button
              key={type}
              size="sm"
              variant={filter === type ? "default" : "outline"}
              onClick={() => setFilter(type)}
              className="text-xs"
            >
              {label}
            </Button>
          ))}
        </div>

        {/* Sort and View controls */}
        <div className="flex justify-between items-center">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortType)}
            className="bg-background border border-border rounded px-2 py-1 text-sm"
          >
            <option value="rarity">Sort by Rarity</option>
            <option value="name">Sort by Name</option>
            <option value="quantity">Sort by Quantity</option>
          </select>
          
          <div className="flex gap-1">
            <Button
              size="icon"
              variant={viewMode === 'grid' ? "default" : "outline"}
              onClick={() => setViewMode('grid')}
              className="h-8 w-8"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant={viewMode === 'list' ? "default" : "outline"}
              onClick={() => setViewMode('list')}
              className="h-8 w-8"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-6 gap-2">
            {gridSlots.map((item, i) => (
              <div key={i} className="aspect-square border border-border rounded-lg p-1 hover:bg-muted/50 transition-all cursor-pointer">
                {item ? (
                  <div 
                    className={`w-full h-full rounded-md border-2 ${getRarityColor(item.rarity)} flex flex-col items-center justify-center relative overflow-hidden bg-card/50 hover:bg-card/70 transition-colors`}
                    title={getItemTooltip(item)}
                    onClick={() => handleEquipItem(item)}
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
        ) : (
          <div className="space-y-2">
            {filteredAndSortedInventory.map((item, i) => (
              <div 
                key={i}
                className={`flex items-center gap-3 p-3 rounded-lg border-2 ${getRarityColor(item.rarity)} bg-card/50 hover:bg-card/70 transition-colors cursor-pointer`}
                onClick={() => handleEquipItem(item)}
              >
                <div className="text-2xl">{item.icon}</div>
                <div className="flex-1">
                  <div className="font-medium">{item.name}</div>
                  <div className="text-sm text-muted-foreground capitalize">{item.rarity} {item.type}</div>
                  {item.stats && (
                    <div className="text-xs text-green-400">
                      {Object.entries(item.stats).map(([stat, value]) => 
                        `+${value}${stat.includes('rate') || stat.includes('regen') ? '%' : ''} ${stat}`
                      ).join(', ')}
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <div className="font-bold">x{item.quantity}</div>
                  {item.type === 'equipment' && (
                    <div className="text-xs text-yellow-400">Equip</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {filteredAndSortedInventory.length === 0 && (
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No items found</p>
            <p className="text-sm">Try adjusting your filters</p>
          </div>
        </div>
      )}
    </div>
  );
};