import React, { useState } from 'react';
import { Hammer, Sword, Shield, Gem, CheckCircle, Recycle, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InventoryItem, CraftingRecipe } from '@/types/gameTypes';
import { toast } from 'sonner';

interface CraftingPanelProps {
  inventory: InventoryItem[];
  addToInventory: (item: InventoryItem) => void;
  removeFromInventory: (itemId: string, quantity: number) => void;
  equipItem?: (item: InventoryItem) => void;
  playerStats: { skills: { [key: string]: number } };
  playerProfile: { autoEquipEnabled: boolean };
  updatePlayerProfile: (updates: any) => void;
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
      equipmentType: 'weapon',
      stats: { 'attack speed': 25, 'crit chance': 15 }
    },
    materials: [
      { itemId: 'shadow-essence', quantity: 3 },
      { itemId: 'iron-ore', quantity: 2 }
    ],
    requiredSkills: { crafting: 5 }
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
      equipmentType: 'armor',
      stats: { 'defense': 30, 'stamina regen': 20 }
    },
    materials: [
      { itemId: 'crystal-shard', quantity: 5 },
      { itemId: 'leather', quantity: 3 }
    ],
    requiredSkills: { crafting: 3 }
  },
  {
    id: 'mystic-amulet',
    name: 'Mystic Amulet',
    category: 'accessory',
    result: {
      id: 'mystic-amulet',
      name: 'Mystic Amulet',
      icon: '🔮',
      rarity: 'legendary',
      quantity: 1,
      type: 'equipment',
      equipmentType: 'amulet',
      stats: { 'xp bonus': 35, 'loot bonus': 25 }
    },
    materials: [
      { itemId: 'crystal-shard', quantity: 8 },
      { itemId: 'shadow-essence', quantity: 5 },
      { itemId: 'alpha-essence', quantity: 2 }
    ],
    requiredSkills: { crafting: 10, enchanting: 5 }
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
    ],
    requiredSkills: { alchemy: 3 }
  }
];

export const CraftingPanel: React.FC<CraftingPanelProps> = ({ 
  inventory, 
  addToInventory, 
  removeFromInventory,
  equipItem,
  playerStats,
  playerProfile,
  updatePlayerProfile
}) => {
  const [activeTab, setActiveTab] = useState<'craft' | 'dismantle'>('craft');
  const canCraft = (recipe: CraftingRecipe): boolean => {
    // Check materials
    const hasMaterials = recipe.materials.every(material => {
      const inventoryItem = inventory.find(item => item.id === material.itemId);
      return inventoryItem && inventoryItem.quantity >= material.quantity;
    });
    
    // Check skill requirements
    const hasSkills = !recipe.requiredSkills || Object.entries(recipe.requiredSkills).every(([skill, level]) => {
      return (playerStats.skills[skill] || 0) >= level;
    });
    
    return hasMaterials && hasSkills;
  };

  const craftItem = (recipe: CraftingRecipe) => {
    if (canCraft(recipe)) {
      // Remove materials
      recipe.materials.forEach(material => {
        removeFromInventory(material.itemId, material.quantity);
      });
      
      // Add crafted item
      addToInventory(recipe.result);

      // Auto-equip if enabled and it's equipment
      if (playerProfile.autoEquipEnabled && recipe.result.type === 'equipment' && equipItem) {
        equipItem(recipe.result);
        toast.success(`Crafted & Equipped ${recipe.result.name}!`);
      } else {
        // Show success toast with equip option
        toast.success(`Crafted ${recipe.result.name}!`, {
          description: `${recipe.result.name} has been added to your inventory.`,
          action: recipe.result.type === 'equipment' && equipItem ? {
            label: "Equip Now",
            onClick: () => {
              equipItem(recipe.result);
              toast.success(`Equipped ${recipe.result.name}!`);
            }
          } : undefined
        });
      }
    } else {
      const missingMaterials = recipe.materials.filter(material => {
        const inventoryItem = inventory.find(item => item.id === material.itemId);
        return !inventoryItem || inventoryItem.quantity < material.quantity;
      });
      
      const missingSkills = recipe.requiredSkills ? Object.entries(recipe.requiredSkills).filter(([skill, level]) => {
        return (playerStats.skills[skill] || 0) < level;
      }) : [];

      const errorMessage = [
        ...missingMaterials.map(m => `Need ${m.quantity} ${m.itemId.replace('-', ' ')}`),
        ...missingSkills.map(([skill, level]) => `Need ${skill} level ${level}`)
      ].join(', ');

      toast.error("Cannot craft item", {
        description: errorMessage
      });
    }
  };

  const dismantleItem = (item: InventoryItem) => {
    if (item.type === 'equipment' && item.quantity > 0) {
      // Remove 1 of the item
      removeFromInventory(item.id, 1);
      
      // Give back some materials based on rarity
      const materialCount = {
        'common': 1,
        'uncommon': 2,
        'rare': 3,
        'epic': 4,
        'legendary': 5
      }[item.rarity] || 1;
      
      // Add basic materials
      addToInventory({ id: 'scrap-metal', name: 'Scrap Metal', icon: '🔩', rarity: 'common', quantity: materialCount, type: 'material' });
      
      if (item.rarity !== 'common') {
        addToInventory({ id: 'essence-fragment', name: 'Essence Fragment', icon: '✨', rarity: 'uncommon', quantity: Math.floor(materialCount / 2), type: 'material' });
      }
      
      toast.success(`Dismantled ${item.name}!`, {
        description: `Gained crafting materials.`
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
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Hammer className="h-5 w-5 text-orange-400" />
          <h2 className="text-lg font-bold">Crafting</h2>
        </div>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => updatePlayerProfile({ autoEquipEnabled: !playerProfile.autoEquipEnabled })}
          className={`h-8 w-8 ${playerProfile.autoEquipEnabled ? 'text-green-400' : 'text-gray-400'}`}
          title={`Auto-Equip: ${playerProfile.autoEquipEnabled ? 'ON' : 'OFF'}`}
        >
          <Settings className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Tab Selector */}
      <div className="flex gap-2 mb-4">
        <Button
          size="sm"
          variant={activeTab === 'craft' ? 'default' : 'outline'}
          onClick={() => setActiveTab('craft')}
          className="flex items-center gap-2"
        >
          <Hammer className="h-4 w-4" />
          Craft
        </Button>
        <Button
          size="sm"
          variant={activeTab === 'dismantle' ? 'default' : 'outline'}
          onClick={() => setActiveTab('dismantle')}
          className="flex items-center gap-2"
        >
          <Recycle className="h-4 w-4" />
          Dismantle
        </Button>
      </div>
      {activeTab === 'craft' ? (
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
                          `+${value}${stat.includes('rate') || stat.includes('regen') || stat.includes('bonus') ? '%' : ''} ${stat}`
                        ).join(', ')}
                      </div>
                    )}
                    {recipe.requiredSkills && (
                      <div className="text-xs text-yellow-400 mt-1">
                        Requires: {Object.entries(recipe.requiredSkills).map(([skill, level]) => 
                          `${skill} ${level}`
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
                  {craftable ? 
                    `Craft ${recipe.category === 'consumable' ? 'Item' : recipe.category === 'weapon' ? 'Weapon' : recipe.category === 'armor' ? 'Armor' : 'Accessory'}` : 
                    'Insufficient Requirements'
                  }
                </Button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-gray-400 mb-4">
            Dismantle equipment to recover crafting materials. Higher rarity items yield more materials.
          </p>
          {inventory.filter(item => item.type === 'equipment').map(item => (
            <div key={item.id} className="p-3 border-2 border-gray-500/30 rounded-lg bg-gradient-to-r from-gray-950/20 to-gray-900/10 hover:border-gray-400/50 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{item.icon}</span>
                  <div>
                    <h4 className={`font-medium ${getRarityColor(item.rarity)}`}>
                      {item.name}
                    </h4>
                    <div className="text-xs text-gray-400">
                      {item.stats && Object.entries(item.stats).map(([stat, value]) => 
                        `+${value}${stat.includes('rate') || stat.includes('regen') || stat.includes('bonus') ? '%' : ''} ${stat}`
                      ).join(', ')}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400">x{item.quantity}</span>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => dismantleItem(item)}
                    className="text-xs"
                  >
                    <Recycle className="h-3 w-3 mr-1" />
                    Dismantle
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {inventory.filter(item => item.type === 'equipment').length === 0 && (
            <div className="text-center text-gray-500 py-8">
              <Recycle className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No equipment to dismantle</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};