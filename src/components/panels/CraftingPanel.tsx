import React from 'react';
import { Hammer, Sword, Shield, Gem, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InventoryItem, CraftingRecipe } from '@/types/gameTypes';
import { toast } from 'sonner';

interface CraftingPanelProps {
  inventory: InventoryItem[];
  addToInventory: (item: InventoryItem) => void;
  removeFromInventory: (itemId: string, quantity: number) => void;
  equipItem?: (item: InventoryItem) => void;
}

const craftingRecipes: CraftingRecipe[] = [
  {
    id: 'shadow-blade',
    name: 'Shadow Blade',
    category: 'weapon',
    result: {
      id: 'shadow-blade',
      name: 'Shadow Blade',
      icon: '⚔️',
      rarity: 'epic',
      quantity: 1,
      type: 'equipment',
      stats: { 'attack speed': 25, 'crit chance': 15 }
    },
    materials: [
      { itemId: 'shadow-essence', quantity: 3 },
      { itemId: 'iron-ore', quantity: 2 }
    ]
  },
  {
    id: 'crystal-armor',
    name: 'Crystal Armor',
    category: 'armor',
    result: {
      id: 'crystal-armor',
      name: 'Crystal Armor',
      icon: '🛡️',
      rarity: 'rare',
      quantity: 1,
      type: 'equipment',
      stats: { 'defense': 30, 'stamina regen': 20 }
    },
    materials: [
      { itemId: 'crystal-shard', quantity: 5 },
      { itemId: 'leather', quantity: 3 }
    ]
  },
  {
    id: 'health-potion',
    name: 'Health Potion',
    category: 'consumable',
    result: {
      id: 'health-potion',
      name: 'Health Potion',
      icon: '🧪',
      rarity: 'common',
      quantity: 3,
      type: 'consumable'
    },
    materials: [
      { itemId: 'herb', quantity: 5 },
      { itemId: 'pure-water', quantity: 1 }
    ]
  },
  {
    id: 'time-boost-potion',
    name: 'Time Boost Potion',
    category: 'consumable',
    result: {
      id: 'time-boost-potion',
      name: 'Time Boost Potion',
      icon: '⏰',
      rarity: 'epic',
      quantity: 1,
      type: 'consumable'
    },
    materials: [
      { itemId: 'shadow-essence', quantity: 2 },
      { itemId: 'crystal-shard', quantity: 1 },
      { itemId: 'herb', quantity: 3 }
    ]
  }
];

export const CraftingPanel: React.FC<CraftingPanelProps> = ({ 
  inventory, 
  addToInventory, 
  removeFromInventory,
  equipItem
}) => {
  const canCraft = (recipe: CraftingRecipe): boolean => {
    return recipe.materials.every(material => {
      const inventoryItem = inventory.find(item => item.id === material.itemId);
      return inventoryItem && inventoryItem.quantity >= material.quantity;
    });
  };

  const craftItem = (recipe: CraftingRecipe) => {
    if (canCraft(recipe)) {
      // Remove materials
      recipe.materials.forEach(material => {
        removeFromInventory(material.itemId, material.quantity);
      });
      
      // Add crafted item
      addToInventory(recipe.result);

      // Show success toast with auto-equip option
      const statsText = recipe.result.stats ? Object.entries(recipe.result.stats).map(([stat, value]) => `+${value}${stat.includes('rate') || stat.includes('speed') || stat.includes('drop') ? '%' : ''} ${stat}`).join(', ') : '';
      
      toast.success(`Successfully crafted ${recipe.result.name}!`, {
        description: `${recipe.result.name} has been added to your inventory. ${statsText ? `Stats: ${statsText}` : ''}`,
        action: recipe.result.type === 'equipment' && equipItem ? {
          label: "Equip Now",
          onClick: () => {
            equipItem(recipe.result);
            toast.success(`Auto-equipped ${recipe.result.name}!`, {
              description: "Your new gear is ready for battle!"
            });
          }
        } : undefined
      });
    } else {
      toast.error("Cannot craft item", {
        description: "You don't have enough materials to craft this item."
      });
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'weapon': return <Sword className="h-4 w-4" />;
      case 'armor': return <Shield className="h-4 w-4" />;
      case 'consumable': return <Gem className="h-4 w-4" />;
      default: return <Hammer className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'weapon': return 'orange';
      case 'armor': return 'blue';
      case 'consumable': return 'green';
      default: return 'gray';
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-400';
      case 'uncommon': return 'text-green-400';
      case 'rare': return 'text-blue-400';
      case 'epic': return 'text-purple-400';
      case 'legendary': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getMaterialSource = (materialId: string) => {
    const materialSources: { [key: string]: string } = {
      'shadow-essence': 'Drops from Shadow Wolf (Forest)',
      'iron-ore': 'Available in Marketplace',
      'crystal-shard': 'Drops from Tundra Yeti (Tundra)',
      'leather': 'Available in Marketplace',
      'herb': 'Drops from various Forest monsters',
      'pure-water': 'Available in Marketplace'
    };
    return materialSources[materialId] || 'Unknown source';
  };

  return (
    <div className="h-full">
      <div className="flex items-center gap-2 mb-4">
        <Hammer className="h-5 w-5 text-orange-400" />
        <h2 className="text-lg font-bold">Crafting</h2>
      </div>
      <div className="space-y-4">
        {craftingRecipes.map(recipe => {
          const categoryColor = getCategoryColor(recipe.category);
          const craftable = canCraft(recipe);
          
          return (
            <div key={recipe.id} className={`p-4 border-2 border-${categoryColor}-500/30 rounded-lg bg-gradient-to-r from-${categoryColor}-950/20 to-${categoryColor}-900/10 ${craftable ? 'hover:border-' + categoryColor + '-400/50' : 'opacity-60'} transition-all`}>
              <div className="flex items-center gap-3 mb-3">
                {getCategoryIcon(recipe.category)}
                <div>
                  <h3 className={`font-semibold ${getRarityColor(recipe.result.rarity)}`}>
                    {recipe.result.icon} {recipe.name}
                  </h3>
                  {recipe.result.stats && (
                    <div className="text-xs text-gray-400 mt-1">
                      {Object.entries(recipe.result.stats).map(([stat, value]) => 
                        `+${value}${stat.includes('rate') || stat.includes('regen') ? '%' : ''} ${stat}`
                      ).join(', ')}
                    </div>
                  )}
                </div>
              </div>
              <div className="mb-3">
                <p className={`text-sm text-${categoryColor}-300 mb-2`}>Required Materials:</p>
                <div className="flex flex-wrap gap-2">
                  {recipe.materials.map((material, index) => {
                    const inventoryItem = inventory.find(item => item.id === material.itemId);
                    const hasEnough = inventoryItem && inventoryItem.quantity >= material.quantity;
                    const materialSource = getMaterialSource(material.itemId);
                    
                    return (
                      <div 
                        key={index} 
                        className={`flex items-center gap-1 bg-${categoryColor}-950/40 px-2 py-1 rounded text-xs ${hasEnough ? 'text-green-400' : 'text-red-400'} cursor-help`}
                        title={`${material.itemId.replace('-', ' ')}: ${materialSource}`}
                      >
                        {hasEnough && <CheckCircle className="h-3 w-3" />}
                        <span>{material.itemId.replace('-', ' ')} x{material.quantity}</span>
                        {inventoryItem && (
                          <span className="text-gray-500">({inventoryItem.quantity})</span>
                        )}
                        <span className="text-xs text-gray-400 ml-1">ⓘ</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <Button 
                size="sm" 
                onClick={() => craftItem(recipe)}
                disabled={!craftable}
                className={`${craftable ? `bg-${categoryColor}-600 hover:bg-${categoryColor}-500 text-white` : 'bg-muted text-muted-foreground cursor-not-allowed'} transition-all`}
              >
                {craftable ? 'Craft' : 'Insufficient Materials'} {recipe.category === 'consumable' ? 'Item' : recipe.category === 'weapon' ? 'Weapon' : 'Armor'}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
};