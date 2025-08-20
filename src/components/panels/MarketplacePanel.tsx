import React, { useState } from 'react';
import { ShoppingCart, TrendingUp, TrendingDown, Skull, Star, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InventoryItem, ShopItem } from '@/types/gameTypes';
import { toast } from 'sonner';

interface MarketplacePanelProps {
  playerGold: number;
  updatePlayerGold: (gold: number) => void;
  addToInventory: (item: InventoryItem) => void;
  inventory: InventoryItem[];
  removeFromInventory: (itemId: string, quantity: number) => void;
  playerProfile: { reputation?: { [faction: string]: number } };
}

const shopCategories: { [category: string]: ShopItem[] } = {
  weapons: [
    {
      item: { id: 'steel-sword', name: 'Steel Sword', icon: '⚔️', rarity: 'uncommon', quantity: 1, type: 'equipment', equipmentType: 'weapon', stats: { 'attack power': 20, 'crit chance': 10 } },
      price: 2500,
      stock: 3,
      category: 'weapons'
    },
    {
      item: { id: 'enchanted-bow', name: 'Enchanted Bow', icon: '🏹', rarity: 'rare', quantity: 1, type: 'equipment', equipmentType: 'weapon', stats: { 'attack power': 35, 'hunt speed': 15 } },
      price: 5000,
      stock: 1,
      category: 'weapons'
    }
  ],
  armor: [
    {
      item: { id: 'chainmail', name: 'Chainmail Armor', icon: '🛡️', rarity: 'uncommon', quantity: 1, type: 'equipment', equipmentType: 'armor', stats: { 'defense': 25, 'durability': 30 } },
      price: 3000,
      stock: 2,
      category: 'armor'
    }
  ],
  accessories: [
    {
      item: { id: 'luck-ring', name: 'Ring of Fortune', icon: '💍', rarity: 'rare', quantity: 1, type: 'equipment', equipmentType: 'ring', stats: { 'loot bonus': 20, 'gold find': 15 } },
      price: 4000,
      stock: 2,
      category: 'accessories'
    },
    {
      item: { id: 'speed-amulet', name: 'Amulet of Swiftness', icon: '🔮', rarity: 'epic', quantity: 1, type: 'equipment', equipmentType: 'amulet', stats: { 'hunt speed': 25, 'stamina regen': 20 } },
      price: 8000,
      stock: 1,
      category: 'accessories'
    }
  ],
  materials: [
    {
      item: { id: 'shadow-essence', name: 'Shadow Essence', icon: '🌑', rarity: 'uncommon', quantity: 3, type: 'material' },
      price: 500,
      stock: 10,
      category: 'materials'
    },
    {
      item: { id: 'iron-ore', name: 'Iron Ore', icon: '⛏️', rarity: 'common', quantity: 5, type: 'material' },
      price: 200,
      stock: 15,
      category: 'materials'
    },
    {
      item: { id: 'crystal-shard', name: 'Crystal Shard', icon: '💎', rarity: 'rare', quantity: 2, type: 'material' },
      price: 800,
      stock: 5,
      category: 'materials'
    },
    {
      item: { id: 'leather', name: 'Leather', icon: '🟤', rarity: 'common', quantity: 4, type: 'material' },
      price: 150,
      stock: 20,
      category: 'materials'
    }
  ],
  consumables: [
    {
      item: { id: 'health-potion', name: 'Health Potion', icon: '🧪', rarity: 'common', quantity: 3, type: 'consumable' },
      price: 300,
      stock: 12,
      category: 'consumables'
    },
    {
      item: { id: 'time-boost-potion', name: 'Time Boost Potion', icon: '⏰', rarity: 'epic', quantity: 1, type: 'consumable' },
      price: 5000,
      stock: 2,
      category: 'consumables'
    }
  ]
};

const blackMarketItems: ShopItem[] = [
  {
    item: { id: 'forbidden-tome', name: 'Forbidden Tome', icon: '📕', rarity: 'legendary', quantity: 1, type: 'equipment', equipmentType: 'trinket', stats: { 'dark magic': 50, 'xp bonus': 40 } },
    price: 25000,
    stock: 1,
    category: 'rare'
  },
  {
    item: { id: 'cursed-blade', name: 'Cursed Blade', icon: '🗡️', rarity: 'legendary', quantity: 1, type: 'equipment', equipmentType: 'weapon', stats: { 'attack power': 80, 'life steal': 15 } },
    price: 30000,
    stock: 1,
    category: 'rare'
  },
  {
    item: { id: 'shadow-cloak', name: 'Cloak of Shadows', icon: '🥷', rarity: 'epic', quantity: 1, type: 'equipment', equipmentType: 'armor', stats: { 'stealth': 40, 'crit chance': 25 } },
    price: 15000,
    stock: 1,
    category: 'rare'
  }
];

export const MarketplacePanel: React.FC<MarketplacePanelProps> = ({ 
  playerGold, 
  updatePlayerGold, 
  addToInventory,
  inventory,
  removeFromInventory,
  playerProfile
}) => {
  const [activeTab, setActiveTab] = useState<'shop' | 'sell' | 'black-market'>('shop');
  const [selectedCategory, setSelectedCategory] = useState<string>('materials');
  const buyItem = (shopItem: ShopItem) => {
    if (playerGold >= shopItem.price && shopItem.stock > 0) {
      updatePlayerGold(playerGold - shopItem.price);
      addToInventory(shopItem.item);
      
      // Reduce stock
      shopItem.stock -= 1;
      
      toast.success(`Purchased ${shopItem.item.name}!`, {
        description: `-${shopItem.price} gold`
      });
    } else {
      toast.error("Cannot purchase", {
        description: playerGold < shopItem.price ? "Insufficient gold" : "Out of stock"
      });
    }
  };

  const sellItem = (item: InventoryItem) => {
    if (item.quantity > 0) {
      const sellPrice = getSellPrice(item);
      removeFromInventory(item.id, 1);
      updatePlayerGold(playerGold + sellPrice);
      
      toast.success(`Sold ${item.name}!`, {
        description: `+${sellPrice} gold`
      });
    }
  };

  const getSellPrice = (item: InventoryItem): number => {
    const baseValue = {
      'common': 10,
      'uncommon': 50,
      'rare': 200,
      'epic': 800,
      'legendary': 3000
    }[item.rarity] || 10;
    
    // Equipment sells for more
    if (item.type === 'equipment') {
      return Math.floor(baseValue * 1.5);
    }
    
    return baseValue;
  };

  const canAccessBlackMarket = (): boolean => {
    const reputation = playerProfile.reputation || {};
    return (reputation['Shadow Hunters'] || 0) >= 500 || (reputation['Independent'] || 0) >= 300;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'weapons': return '⚔️';
      case 'armor': return '🛡️';
      case 'accessories': return '💍';
      case 'materials': return '🔨';
      case 'consumables': return '🧪';
      default: return '📦';
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

  return (
    <div className="h-full">
      <div className="flex items-center gap-2 mb-4">
        <ShoppingCart className="h-5 w-5 text-purple-400" />
        <h2 className="text-lg font-bold">Marketplace</h2>
        <div className="ml-auto text-sm text-yellow-400 font-medium">
          💰 {playerGold.toLocaleString()} gold
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-4">
        <Button
          size="sm"
          variant={activeTab === 'shop' ? 'default' : 'outline'}
          onClick={() => setActiveTab('shop')}
          className="flex items-center gap-2"
        >
          <Package className="h-4 w-4" />
          Shop
        </Button>
        <Button
          size="sm"
          variant={activeTab === 'sell' ? 'default' : 'outline'}
          onClick={() => setActiveTab('sell')}
          className="flex items-center gap-2"
        >
          <TrendingUp className="h-4 w-4" />
          Sell
        </Button>
        <Button
          size="sm"
          variant={activeTab === 'black-market' ? 'default' : 'outline'}
          onClick={() => setActiveTab('black-market')}
          disabled={!canAccessBlackMarket()}
          className="flex items-center gap-2"
        >
          <Skull className="h-4 w-4" />
          Black Market
          {!canAccessBlackMarket() && <span className="text-xs opacity-60">(Locked)</span>}
        </Button>
      </div>

      {/* Content */}
      <div className="space-y-3">
        {activeTab === 'shop' && (
          <>
            {/* Category Selector */}
            <div className="flex gap-2 mb-4 overflow-x-auto">
              {Object.keys(shopCategories).map(category => (
                <Button
                  key={category}
                  size="sm"
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(category)}
                  className="flex items-center gap-2 capitalize whitespace-nowrap"
                >
                  <span>{getCategoryIcon(category)}</span>
                  {category}
                </Button>
              ))}
            </div>

            {/* Shop Items */}
            {shopCategories[selectedCategory]?.map((shopItem, index) => (
              <div key={index} className="p-4 border-2 border-purple-500/30 rounded-lg bg-gradient-to-r from-purple-950/20 to-purple-900/10 hover:border-purple-400/50 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-lg">{shopItem.item.icon}</div>
                    <div>
                      <div className={`font-semibold ${getRarityColor(shopItem.item.rarity)}`}>
                        {shopItem.item.name} {shopItem.item.quantity > 1 && `x${shopItem.item.quantity}`}
                      </div>
                      <div className="text-sm text-purple-300">
                        Stock: {shopItem.stock}
                      </div>
                      {shopItem.item.type === 'equipment' && shopItem.item.stats && (
                        <div className="text-xs text-gray-400 mt-1">
                          {Object.entries(shopItem.item.stats).map(([stat, value]) => 
                            `+${value}${stat.includes('rate') || stat.includes('bonus') || stat.includes('regen') ? '%' : ''} ${stat}`
                          ).join(', ')}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-yellow-400 font-bold mb-1">
                      {shopItem.price.toLocaleString()} 💰
                    </div>
                    <Button 
                      size="sm" 
                      onClick={() => buyItem(shopItem)}
                      disabled={playerGold < shopItem.price || shopItem.stock <= 0}
                      className="bg-purple-600 hover:bg-purple-500 disabled:bg-gray-600"
                    >
                      {shopItem.stock <= 0 ? 'Out of Stock' : 'Buy'}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}

        {activeTab === 'sell' && (
          <>
            <div className="text-sm text-gray-400 mb-4">
              Sell your items for gold. Equipment sells for higher prices.
            </div>
            {inventory.filter(item => item.quantity > 0).map(item => (
              <div key={item.id} className="p-4 border-2 border-green-500/30 rounded-lg bg-gradient-to-r from-green-950/20 to-green-900/10 hover:border-green-400/50 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-lg">{item.icon}</div>
                    <div>
                      <div className={`font-semibold ${getRarityColor(item.rarity)}`}>
                        {item.name}
                      </div>
                      <div className="text-sm text-green-300">
                        Quantity: {item.quantity}
                      </div>
                      {item.type === 'equipment' && item.stats && (
                        <div className="text-xs text-gray-400 mt-1">
                          {Object.entries(item.stats).map(([stat, value]) => 
                            `+${value}${stat.includes('rate') || stat.includes('bonus') || stat.includes('regen') ? '%' : ''} ${stat}`
                          ).join(', ')}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-yellow-400 font-bold mb-1">
                      {getSellPrice(item).toLocaleString()} 💰
                    </div>
                    <Button 
                      size="sm" 
                      onClick={() => sellItem(item)}
                      className="bg-green-600 hover:bg-green-500"
                    >
                      Sell
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            {inventory.filter(item => item.quantity > 0).length === 0 && (
              <div className="text-center text-gray-500 py-8">
                <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No items to sell</p>
              </div>
            )}
          </>
        )}

        {activeTab === 'black-market' && canAccessBlackMarket() && (
          <>
            <div className="text-sm text-red-400 mb-4 p-3 bg-red-950/30 rounded border border-red-600/30">
              ⚠️ Black Market: High-risk, high-reward items. Reputation required.
            </div>
            {blackMarketItems.map((shopItem, index) => (
              <div key={index} className="p-4 border-2 border-red-500/30 rounded-lg bg-gradient-to-r from-red-950/20 to-red-900/10 hover:border-red-400/50 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-lg">{shopItem.item.icon}</div>
                    <div>
                      <div className={`font-semibold ${getRarityColor(shopItem.item.rarity)}`}>
                        {shopItem.item.name}
                        <Star className="h-4 w-4 inline ml-1 text-red-400" />
                      </div>
                      <div className="text-sm text-red-300">
                        Forbidden Item • Stock: {shopItem.stock}
                      </div>
                      {shopItem.item.stats && (
                        <div className="text-xs text-gray-400 mt-1">
                          {Object.entries(shopItem.item.stats).map(([stat, value]) => 
                            `+${value}${stat.includes('rate') || stat.includes('bonus') || stat.includes('regen') ? '%' : ''} ${stat}`
                          ).join(', ')}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-yellow-400 font-bold mb-1">
                      {shopItem.price.toLocaleString()} 💰
                    </div>
                    <Button 
                      size="sm" 
                      onClick={() => buyItem(shopItem)}
                      disabled={playerGold < shopItem.price || shopItem.stock <= 0}
                      className="bg-red-600 hover:bg-red-500 disabled:bg-gray-600"
                    >
                      {shopItem.stock <= 0 ? 'Sold Out' : 'Buy'}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};